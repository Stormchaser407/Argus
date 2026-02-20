/**
 * Project Argus — Scam Sniffer: Message Scanner Service
 * Orchestrates the full scanning pipeline for incoming messages.
 * Ties together wallet detection, link analysis, pattern matching, and behavior scoring.
 */

import type {
  MessageScanResult,
  ThreatLogEntry,
  ScamSnifferStats,
  WalletCheckResult,
  LinkCheckResult,
  ScamPatternMatch,
} from '../types';
import { ThreatLevel } from '../types';
import { getScamSnifferConfig } from '../config';
import { detectWallets } from '../utils/walletDetector';
import { detectLinks } from '../utils/linkDetector';
import { checkWalletChainabuse } from './chainabuseService';
import { analyzeLinks } from './linkAnalysisService';
import { scanMessageForPatterns } from './patternMatchingService';
import { scoreAccount } from './behaviorScoringService';
import type { AccountScoringInput } from './behaviorScoringService';

// ─── Threat Log ──────────────────────────────────────────────────────────────

let threatLog: ThreatLogEntry[] = [];
const MAX_THREAT_LOG_SIZE = 5000;

let stats: ScamSnifferStats = {
  totalThreatsDetected: 0,
  walletsScanned: 0,
  walletsFlagged: 0,
  linksScanned: 0,
  linksFlagged: 0,
  patternsMatched: 0,
  accountsScored: 0,
  falsePositivesReported: 0,
  lastScanTimestamp: 0,
};

// ─── Scan Result Cache ───────────────────────────────────────────────────────

const scanCache = new Map<string, MessageScanResult>();
const SCAN_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getScanCacheKey(chatId: string, messageId: number): string {
  return `${chatId}:${messageId}`;
}

// ─── Main Scanner ────────────────────────────────────────────────────────────

/**
 * Scans a message for all threat types.
 * This is the primary entry point for the scanning pipeline.
 */
export async function scanMessage(params: {
  messageId: number;
  chatId: string;
  chatTitle?: string;
  text: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  senderFirstName?: string;
  senderLastName?: string;
  senderRegistrationTimestamp?: number;
  isForwarded?: boolean;
}): Promise<MessageScanResult> {
  const config = getScamSnifferConfig();

  if (!config.enabled || !params.text) {
    return createEmptyResult(params.messageId, params.chatId, params.senderId);
  }

  // Check cache
  const cacheKey = getScanCacheKey(params.chatId, params.messageId);
  const cached = scanCache.get(cacheKey);
  if (cached) return cached;

  const result: MessageScanResult = {
    messageId: params.messageId,
    chatId: params.chatId,
    timestamp: Date.now(),
    wallets: [],
    links: [],
    patternMatches: [],
    overallThreatLevel: ThreatLevel.SAFE,
    senderId: params.senderId,
  };

  // ── 1. Crypto Wallet Detection & Checking ────────────────────────────
  if (config.walletDetection.enabled) {
    const detectedWallets = detectWallets(params.text);
    stats.walletsScanned += detectedWallets.length;

    if (config.walletDetection.autoCheck && detectedWallets.length > 0) {
      // Check wallets against Chainabuse (async)
      const walletChecks = await Promise.all(
        detectedWallets.map((w) => checkWalletChainabuse(w.address, w.chain)),
      );
      result.wallets = walletChecks;

      const flaggedWallets = walletChecks.filter((w) => w.isFlagged);
      stats.walletsFlagged += flaggedWallets.length;

      // Log flagged wallets
      for (const wallet of flaggedWallets) {
        addThreatLogEntry({
          chatId: params.chatId,
          chatTitle: params.chatTitle,
          messageId: params.messageId,
          senderId: params.senderId,
          senderName: params.senderName,
          type: 'wallet',
          threatLevel: wallet.riskScore >= 70 ? ThreatLevel.HIGH : ThreatLevel.MEDIUM,
          summary: `Flagged wallet: ${wallet.address.slice(0, 10)}... (${wallet.chain}) — ${wallet.reportCount} reports`,
          details: wallet,
        });
      }
    } else {
      // Just detect without checking
      result.wallets = detectedWallets.map((w) => ({
        address: w.address,
        chain: w.chain,
        isFlagged: false,
        reportCount: 0,
        riskScore: 0,
        categories: [],
        source: 'unchecked' as const,
      }));
    }
  }

  // ── 2. Phishing Link Detection ───────────────────────────────────────
  if (config.phishingDetection.enabled) {
    const detectedLinks = detectLinks(params.text);
    stats.linksScanned += detectedLinks.length;

    if (detectedLinks.length > 0) {
      result.links = await analyzeLinks(detectedLinks);

      const flaggedLinks = result.links.filter((l) => l.isMalicious);
      stats.linksFlagged += flaggedLinks.length;

      // Log flagged links
      for (const link of flaggedLinks) {
        addThreatLogEntry({
          chatId: params.chatId,
          chatTitle: params.chatTitle,
          messageId: params.messageId,
          senderId: params.senderId,
          senderName: params.senderName,
          type: 'link',
          threatLevel: link.threatLevel,
          summary: `Malicious link: ${link.domain} — ${link.threatLevel}`,
          details: link,
        });
      }
    }
  }

  // ── 3. Scam Pattern Matching ─────────────────────────────────────────
  if (config.patternMatching.enabled) {
    result.patternMatches = scanMessageForPatterns(params.text);
    stats.patternsMatched += result.patternMatches.length;

    // Log pattern matches
    for (const match of result.patternMatches) {
      addThreatLogEntry({
        chatId: params.chatId,
        chatTitle: params.chatTitle,
        messageId: params.messageId,
        senderId: params.senderId,
        senderName: params.senderName,
        type: 'pattern',
        threatLevel: match.confidence >= 0.7 ? ThreatLevel.HIGH : ThreatLevel.MEDIUM,
        summary: `Scam pattern: ${match.name} (${Math.round(match.confidence * 100)}% confidence)`,
        details: match,
      });
    }
  }

  // ── 4. Account Behavior Scoring ──────────────────────────────────────
  if (config.behaviorScoring.enabled && params.senderId) {
    const scoringInput: AccountScoringInput = {
      peerId: params.senderId,
      username: params.senderUsername,
      firstName: params.senderFirstName,
      lastName: params.senderLastName,
      registrationTimestamp: params.senderRegistrationTimestamp,
      messageText: params.text,
      isForwarded: params.isForwarded,
      linkCount: result.links.length,
      totalMessageCount: 1, // Incremental
      walletMentionCount: result.wallets.length,
    };

    const profile = scoreAccount(scoringInput);
    stats.accountsScored++;

    // Log high-risk accounts
    if (profile.trustScore < 30) {
      addThreatLogEntry({
        chatId: params.chatId,
        chatTitle: params.chatTitle,
        messageId: params.messageId,
        senderId: params.senderId,
        senderName: params.senderName,
        type: 'behavior',
        threatLevel: profile.trustScore < 15 ? ThreatLevel.CRITICAL : ThreatLevel.HIGH,
        summary: `High-risk account: Trust Score ${profile.trustScore}/100`,
        details: profile,
      });
    }
  }

  // ── 5. Calculate Overall Threat Level ────────────────────────────────
  result.overallThreatLevel = calculateOverallThreatLevel(result);

  if (result.overallThreatLevel !== ThreatLevel.SAFE) {
    stats.totalThreatsDetected++;
  }

  stats.lastScanTimestamp = Date.now();

  // Cache the result
  scanCache.set(cacheKey, result);

  // Clean old cache entries periodically
  if (scanCache.size > 5000) {
    const now = Date.now();
    for (const [key, entry] of scanCache.entries()) {
      if (now - entry.timestamp > SCAN_CACHE_TTL_MS) {
        scanCache.delete(key);
      }
    }
  }

  return result;
}

/**
 * Creates an empty scan result (used when scanning is disabled).
 */
function createEmptyResult(
  messageId: number,
  chatId: string,
  senderId?: string,
): MessageScanResult {
  return {
    messageId,
    chatId,
    timestamp: Date.now(),
    wallets: [],
    links: [],
    patternMatches: [],
    overallThreatLevel: ThreatLevel.SAFE,
    senderId,
  };
}

/**
 * Calculates the overall threat level from all scan results.
 */
function calculateOverallThreatLevel(result: MessageScanResult): ThreatLevel {
  const levels: ThreatLevel[] = [];

  // Wallet threats
  for (const wallet of result.wallets) {
    if (wallet.isFlagged) {
      levels.push(wallet.riskScore >= 70 ? ThreatLevel.HIGH : ThreatLevel.MEDIUM);
    }
  }

  // Link threats
  for (const link of result.links) {
    if (link.threatLevel !== ThreatLevel.SAFE) {
      levels.push(link.threatLevel);
    }
  }

  // Pattern match threats
  for (const match of result.patternMatches) {
    if (match.confidence >= 0.7) {
      levels.push(ThreatLevel.HIGH);
    } else if (match.confidence >= 0.4) {
      levels.push(ThreatLevel.MEDIUM);
    } else {
      levels.push(ThreatLevel.LOW);
    }
  }

  if (levels.length === 0) return ThreatLevel.SAFE;

  // Return the highest threat level
  const priority: Record<ThreatLevel, number> = {
    [ThreatLevel.SAFE]: 0,
    [ThreatLevel.LOW]: 1,
    [ThreatLevel.MEDIUM]: 2,
    [ThreatLevel.HIGH]: 3,
    [ThreatLevel.CRITICAL]: 4,
  };

  levels.sort((a, b) => priority[b] - priority[a]);
  return levels[0];
}

// ─── Threat Log Management ───────────────────────────────────────────────────

function addThreatLogEntry(entry: Omit<ThreatLogEntry, 'id' | 'timestamp' | 'isFalsePositive'>): void {
  const logEntry: ThreatLogEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    isFalsePositive: false,
  };

  threatLog.unshift(logEntry); // Add to front (newest first)

  // Trim log if too large
  if (threatLog.length > MAX_THREAT_LOG_SIZE) {
    threatLog = threatLog.slice(0, MAX_THREAT_LOG_SIZE);
  }
}

/**
 * Gets the threat log, optionally filtered.
 */
export function getThreatLog(filter?: {
  type?: ThreatLogEntry['type'];
  chatId?: string;
  threatLevel?: ThreatLevel;
  limit?: number;
}): ThreatLogEntry[] {
  let filtered = threatLog;

  if (filter?.type) {
    filtered = filtered.filter((e) => e.type === filter.type);
  }
  if (filter?.chatId) {
    filtered = filtered.filter((e) => e.chatId === filter.chatId);
  }
  if (filter?.threatLevel) {
    filtered = filtered.filter((e) => e.threatLevel === filter.threatLevel);
  }
  if (filter?.limit) {
    filtered = filtered.slice(0, filter.limit);
  }

  return filtered;
}

/**
 * Marks a threat log entry as a false positive.
 */
export function reportFalsePositive(entryId: string): boolean {
  const entry = threatLog.find((e) => e.id === entryId);
  if (entry) {
    entry.isFalsePositive = true;
    stats.falsePositivesReported++;
    return true;
  }
  return false;
}

/**
 * Gets current statistics.
 */
export function getStats(): ScamSnifferStats {
  return { ...stats };
}

/**
 * Resets statistics.
 */
export function resetStats(): void {
  stats = {
    totalThreatsDetected: 0,
    walletsScanned: 0,
    walletsFlagged: 0,
    linksScanned: 0,
    linksFlagged: 0,
    patternsMatched: 0,
    accountsScored: 0,
    falsePositivesReported: 0,
    lastScanTimestamp: 0,
  };
}

/**
 * Clears the threat log.
 */
export function clearThreatLog(): void {
  threatLog = [];
}

/**
 * Gets the total number of entries in the threat log.
 */
export function getThreatLogSize(): number {
  return threatLog.length;
}
