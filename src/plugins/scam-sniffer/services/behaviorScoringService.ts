/**
 * Project Argus — Scam Sniffer: Account Behavior Scoring Service
 * Scores accounts based on risk indicators to produce a trust score.
 *
 * Trust Score: 0-100 (higher = more trusted)
 * - 80-100: Trusted
 * - 60-79: Normal
 * - 40-59: Suspicious
 * - 20-39: High Risk
 * - 0-19: Critical Risk
 */

import type { AccountRiskProfile, RiskFactor } from '../types';
import { RiskCategory } from '../types';
import { getScamSnifferConfig } from '../config';
import { detectUrgencyLanguage, detectTGTBTLanguage } from './patternMatchingService';

// ─── In-memory profile store ─────────────────────────────────────────────────

const profileStore = new Map<string, AccountRiskProfile>();

// ─── Username Risk Patterns ──────────────────────────────────────────────────

const SUSPICIOUS_USERNAME_PATTERNS: Array<{ regex: RegExp; description: string; weight: number }> = [
  {
    regex: /^[a-z]+_?\d{4,}$/i,
    description: 'Generic name followed by many digits',
    weight: -0.15,
  },
  {
    regex: /(?:admin|support|help|official|verify|team|staff|mod)/i,
    description: 'Contains authority keywords (admin, support, official, etc.)',
    weight: -0.25,
  },
  {
    regex: /(?:crypto|bitcoin|btc|eth|forex|trading|invest|profit|earn|money)/i,
    description: 'Contains financial/crypto keywords',
    weight: -0.1,
  },
  {
    regex: /^.{1,3}$/,
    description: 'Very short username (1-3 chars)',
    weight: -0.05,
  },
  {
    regex: /(.)\1{3,}/,
    description: 'Repeated characters (aaaa, 1111, etc.)',
    weight: -0.1,
  },
  {
    regex: /[Il1|O0]{3,}/,
    description: 'Confusable characters (I/l/1, O/0) — possible impersonation',
    weight: -0.2,
  },
  {
    regex: /(?:gift|free|bonus|reward|airdrop|giveaway)/i,
    description: 'Contains incentive keywords',
    weight: -0.15,
  },
];

// ─── Scoring Functions ───────────────────────────────────────────────────────

/**
 * Scores an account's age risk.
 * Newer accounts are higher risk.
 */
function scoreAccountAge(
  registrationTimestamp: number | undefined,
): RiskFactor | undefined {
  if (!registrationTimestamp) return undefined;

  const config = getScamSnifferConfig();
  const threshold = config.behaviorScoring.newAccountThresholdDays;
  const ageDays = (Date.now() - registrationTimestamp) / (1000 * 60 * 60 * 24);

  if (ageDays < 1) {
    return {
      id: 'age-critical',
      category: RiskCategory.ACCOUNT_AGE,
      description: 'Account created less than 24 hours ago',
      weight: -0.4,
      evidence: `Account age: ${Math.floor(ageDays * 24)} hours`,
    };
  }

  if (ageDays < 7) {
    return {
      id: 'age-very-new',
      category: RiskCategory.ACCOUNT_AGE,
      description: 'Account created less than a week ago',
      weight: -0.3,
      evidence: `Account age: ${Math.floor(ageDays)} days`,
    };
  }

  if (ageDays < threshold) {
    return {
      id: 'age-new',
      category: RiskCategory.ACCOUNT_AGE,
      description: `Account created less than ${threshold} days ago`,
      weight: -0.2,
      evidence: `Account age: ${Math.floor(ageDays)} days`,
    };
  }

  if (ageDays > 365) {
    return {
      id: 'age-established',
      category: RiskCategory.ACCOUNT_AGE,
      description: 'Account is over a year old',
      weight: 0.15,
      evidence: `Account age: ${Math.floor(ageDays / 365)} years`,
    };
  }

  return undefined;
}

/**
 * Scores username patterns.
 */
function scoreUsername(
  username: string | undefined,
  firstName: string | undefined,
  lastName: string | undefined,
): RiskFactor[] {
  const factors: RiskFactor[] = [];

  if (!username) {
    factors.push({
      id: 'no-username',
      category: RiskCategory.USERNAME_PATTERN,
      description: 'Account has no username set',
      weight: -0.1,
    });
    return factors;
  }

  for (const pattern of SUSPICIOUS_USERNAME_PATTERNS) {
    if (pattern.regex.test(username)) {
      factors.push({
        id: `username-${pattern.description.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`,
        category: RiskCategory.USERNAME_PATTERN,
        description: pattern.description,
        weight: pattern.weight,
        evidence: `Username: @${username}`,
      });
    }
  }

  // Check if first/last name contains suspicious patterns
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  if (fullName && /(?:admin|support|official|team|staff)/i.test(fullName)) {
    factors.push({
      id: 'name-authority',
      category: RiskCategory.USERNAME_PATTERN,
      description: 'Display name contains authority keywords',
      weight: -0.2,
      evidence: `Name: ${fullName}`,
    });
  }

  return factors;
}

/**
 * Scores message content patterns.
 * Call this incrementally as messages are scanned.
 */
function scoreMessageContent(text: string): RiskFactor[] {
  const factors: RiskFactor[] = [];

  if (detectUrgencyLanguage(text)) {
    factors.push({
      id: 'msg-urgency',
      category: RiskCategory.MESSAGE_PATTERN,
      description: 'Uses urgency language',
      weight: -0.1,
      evidence: text.slice(0, 100),
    });
  }

  if (detectTGTBTLanguage(text)) {
    factors.push({
      id: 'msg-tgtbt',
      category: RiskCategory.MESSAGE_PATTERN,
      description: 'Uses too-good-to-be-true language',
      weight: -0.15,
      evidence: text.slice(0, 100),
    });
  }

  // Check for excessive caps (shouting)
  const capsRatio = (text.match(/[A-Z]/g) || []).length / Math.max(text.length, 1);
  if (capsRatio > 0.5 && text.length > 20) {
    factors.push({
      id: 'msg-caps',
      category: RiskCategory.MESSAGE_PATTERN,
      description: 'Excessive use of capital letters',
      weight: -0.05,
    });
  }

  // Check for excessive emojis (common in scam messages)
  const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 10) {
    factors.push({
      id: 'msg-emoji-spam',
      category: RiskCategory.MESSAGE_PATTERN,
      description: 'Excessive emoji usage',
      weight: -0.05,
    });
  }

  return factors;
}

/**
 * Scores forwarding behavior.
 * Mass forwarding is a common scam indicator.
 */
function scoreForwardingBehavior(
  isForwarded: boolean,
  forwardCount: number,
): RiskFactor | undefined {
  if (!isForwarded) return undefined;

  if (forwardCount > 10) {
    return {
      id: 'fwd-mass',
      category: RiskCategory.FORWARDING_PATTERN,
      description: 'Sends mass-forwarded content',
      weight: -0.2,
      evidence: `${forwardCount} forwarded messages`,
    };
  }

  if (forwardCount > 5) {
    return {
      id: 'fwd-frequent',
      category: RiskCategory.FORWARDING_PATTERN,
      description: 'Frequently forwards content',
      weight: -0.1,
      evidence: `${forwardCount} forwarded messages`,
    };
  }

  return undefined;
}

/**
 * Scores link posting behavior.
 */
function scoreLinkBehavior(
  linkCount: number,
  messageCount: number,
): RiskFactor | undefined {
  if (messageCount < 3) return undefined;

  const linkRatio = linkCount / messageCount;
  if (linkRatio > 0.7) {
    return {
      id: 'link-heavy',
      category: RiskCategory.LINK_BEHAVIOR,
      description: 'Most messages contain links',
      weight: -0.2,
      evidence: `${linkCount}/${messageCount} messages contain links`,
    };
  }

  if (linkRatio > 0.4) {
    return {
      id: 'link-frequent',
      category: RiskCategory.LINK_BEHAVIOR,
      description: 'Frequently posts links',
      weight: -0.1,
      evidence: `${linkCount}/${messageCount} messages contain links`,
    };
  }

  return undefined;
}

// ─── Main Scoring API ────────────────────────────────────────────────────────

export interface AccountScoringInput {
  peerId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  registrationTimestamp?: number;
  messageText?: string;
  isForwarded?: boolean;
  forwardedMessageCount?: number;
  linkCount?: number;
  totalMessageCount?: number;
  walletMentionCount?: number;
}

/**
 * Calculates or updates the risk profile for an account.
 * Designed to be called incrementally as new messages are processed.
 */
export function scoreAccount(input: AccountScoringInput): AccountRiskProfile {
  const config = getScamSnifferConfig();
  if (!config.behaviorScoring.enabled) {
    return {
      peerId: input.peerId,
      trustScore: 50,
      riskFactors: [],
      lastUpdated: Date.now(),
      scannedMessageCount: 0,
    };
  }

  // Get existing profile or create new one
  let profile = profileStore.get(input.peerId);
  if (!profile) {
    profile = {
      peerId: input.peerId,
      trustScore: 50, // Start neutral
      riskFactors: [],
      lastUpdated: Date.now(),
      scannedMessageCount: 0,
    };
  }

  const newFactors: RiskFactor[] = [];

  // Account age (only score once)
  if (!profile.riskFactors.some((f) => f.category === RiskCategory.ACCOUNT_AGE)) {
    const ageFactor = scoreAccountAge(input.registrationTimestamp);
    if (ageFactor) newFactors.push(ageFactor);
  }

  // Username patterns (only score once)
  if (!profile.riskFactors.some((f) => f.category === RiskCategory.USERNAME_PATTERN)) {
    const usernameFactors = scoreUsername(input.username, input.firstName, input.lastName);
    newFactors.push(...usernameFactors);
  }

  // Message content (score each new message)
  if (input.messageText) {
    const msgFactors = scoreMessageContent(input.messageText);
    newFactors.push(...msgFactors);
    profile.scannedMessageCount++;
  }

  // Forwarding behavior
  if (input.isForwarded !== undefined) {
    const fwdFactor = scoreForwardingBehavior(
      input.isForwarded,
      input.forwardedMessageCount || 0,
    );
    if (fwdFactor) {
      // Remove old forwarding factor and replace
      profile.riskFactors = profile.riskFactors.filter(
        (f) => f.category !== RiskCategory.FORWARDING_PATTERN,
      );
      newFactors.push(fwdFactor);
    }
  }

  // Link behavior
  if (input.linkCount !== undefined && input.totalMessageCount !== undefined) {
    const linkFactor = scoreLinkBehavior(input.linkCount, input.totalMessageCount);
    if (linkFactor) {
      profile.riskFactors = profile.riskFactors.filter(
        (f) => f.category !== RiskCategory.LINK_BEHAVIOR,
      );
      newFactors.push(linkFactor);
    }
  }

  // Wallet mention behavior
  if (input.walletMentionCount && input.walletMentionCount > 3) {
    const existing = profile.riskFactors.find((f) => f.id === 'wallet-frequent');
    if (!existing) {
      newFactors.push({
        id: 'wallet-frequent',
        category: RiskCategory.WALLET_BEHAVIOR,
        description: 'Frequently mentions crypto wallet addresses',
        weight: -0.15,
        evidence: `${input.walletMentionCount} wallet addresses mentioned`,
      });
    }
  }

  // Add new factors
  profile.riskFactors.push(...newFactors);

  // Calculate trust score
  profile.trustScore = calculateTrustScore(profile.riskFactors);
  profile.lastUpdated = Date.now();

  // Store updated profile
  profileStore.set(input.peerId, profile);

  return { ...profile };
}

/**
 * Calculates the trust score from risk factors.
 * Starts at 50 (neutral) and adjusts based on factor weights.
 */
function calculateTrustScore(factors: RiskFactor[]): number {
  let score = 50; // Neutral baseline

  // Sum all factor weights
  let totalWeight = 0;
  for (const factor of factors) {
    totalWeight += factor.weight;
  }

  // Apply weights — scale to 0-100 range
  // Each -1.0 total weight maps to ~50 points of trust reduction
  score += totalWeight * 50;

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Gets the trust score label and color for display.
 */
export function getTrustScoreDisplay(score: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (score >= 80) {
    return { label: 'Trusted', color: '#16a34a', icon: '✓' };
  }
  if (score >= 60) {
    return { label: 'Normal', color: '#2563eb', icon: '○' };
  }
  if (score >= 40) {
    return { label: 'Suspicious', color: '#d97706', icon: '⚠' };
  }
  if (score >= 20) {
    return { label: 'High Risk', color: '#ea580c', icon: '⚠' };
  }
  return { label: 'Critical Risk', color: '#dc2626', icon: '✕' };
}

/**
 * Gets a stored profile for a peer.
 */
export function getAccountProfile(peerId: string): AccountRiskProfile | undefined {
  return profileStore.get(peerId);
}

/**
 * Gets all stored profiles.
 */
export function getAllProfiles(): AccountRiskProfile[] {
  return Array.from(profileStore.values());
}

/**
 * Clears the profile store.
 */
export function clearProfileStore(): void {
  profileStore.clear();
}

/**
 * Returns profile store statistics.
 */
export function getProfileStoreStats(): { totalProfiles: number; averageTrustScore: number } {
  const profiles = Array.from(profileStore.values());
  const totalProfiles = profiles.length;
  const averageTrustScore = totalProfiles > 0
    ? Math.round(profiles.reduce((sum, p) => sum + p.trustScore, 0) / totalProfiles)
    : 50;
  return { totalProfiles, averageTrustScore };
}
