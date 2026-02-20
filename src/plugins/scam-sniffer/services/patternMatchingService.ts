/**
 * Project Argus — Scam Sniffer: Pattern Matching Engine
 * Scans message text against the scam pattern library using regex and keyword matching.
 * Supports configurable sensitivity and alert levels.
 */

import type { ScamPattern, ScamPatternMatch } from '../types';
import { AlertAction } from '../types';
import { getScamSnifferConfig } from '../config';
import { SCAM_PATTERNS, URGENCY_PATTERNS, TGTBT_PATTERNS } from '../patterns/scamPatterns';

// ─── Sensitivity Multipliers ─────────────────────────────────────────────────

const SENSITIVITY_MULTIPLIERS: Record<string, number> = {
  low: 0.7,
  medium: 1.0,
  high: 1.3,
};

// ─── Main Matching Function ──────────────────────────────────────────────────

/**
 * Scans a message text against all scam patterns.
 * Returns an array of matches with confidence scores.
 */
export function scanMessageForPatterns(text: string): ScamPatternMatch[] {
  if (!text || text.length < 10) return [];

  const config = getScamSnifferConfig();
  if (!config.patternMatching.enabled) return [];

  const sensitivity = SENSITIVITY_MULTIPLIERS[config.patternMatching.sensitivity] || 1.0;
  const normalizedText = text.toLowerCase();
  const matches: ScamPatternMatch[] = [];

  for (const pattern of SCAM_PATTERNS) {
    const result = matchPattern(text, normalizedText, pattern, sensitivity);
    if (result) {
      matches.push(result);
    }
  }

  // Sort by confidence (highest first)
  matches.sort((a, b) => b.confidence - a.confidence);

  return matches;
}

/**
 * Matches a single pattern against the text.
 * Uses a scoring system combining regex matches and keyword matches.
 */
function matchPattern(
  originalText: string,
  normalizedText: string,
  pattern: ScamPattern,
  sensitivity: number,
): ScamPatternMatch | undefined {
  let score = 0;
  let matchedText = '';
  let regexHits = 0;
  let keywordHits = 0;

  // ── Regex Matching ─────────────────────────────────────────────────────
  for (const regex of pattern.regexPatterns) {
    regex.lastIndex = 0;
    const match = regex.exec(originalText);
    if (match) {
      regexHits++;
      score += 0.3; // Each regex hit adds 30% confidence
      if (!matchedText || match[0].length > matchedText.length) {
        matchedText = match[0];
      }
    }
  }

  // ── Keyword Set Matching ───────────────────────────────────────────────
  // A keyword set matches if ALL keywords in the set are found in the text
  for (const keywordSet of pattern.keywordSets) {
    const allPresent = keywordSet.every((keyword) => normalizedText.includes(keyword.toLowerCase()));
    if (allPresent) {
      keywordHits++;
      score += 0.25; // Each keyword set hit adds 25% confidence
      if (!matchedText) {
        matchedText = keywordSet.join(', ');
      }
    }
  }

  // No matches at all — skip
  if (regexHits === 0 && keywordHits === 0) return undefined;

  // ── Urgency Amplifier ──────────────────────────────────────────────────
  const hasUrgency = URGENCY_PATTERNS.some((regex) => {
    regex.lastIndex = 0;
    return regex.test(originalText);
  });
  if (hasUrgency) {
    score += 0.15;
  }

  // ── Too-Good-To-Be-True Amplifier ──────────────────────────────────────
  const hasTGTBT = TGTBT_PATTERNS.some((regex) => {
    regex.lastIndex = 0;
    return regex.test(originalText);
  });
  if (hasTGTBT) {
    score += 0.15;
  }

  // ── Apply sensitivity multiplier ───────────────────────────────────────
  score *= sensitivity;

  // Cap at 1.0
  const confidence = Math.min(1.0, score);

  // Check against minimum confidence threshold
  if (confidence < pattern.minConfidence) return undefined;

  // Determine effective alert level based on confidence
  let alertLevel = pattern.alertLevel;
  if (confidence >= 0.8) {
    alertLevel = AlertAction.DANGER;
  } else if (confidence < 0.5 && alertLevel === AlertAction.DANGER) {
    alertLevel = AlertAction.WARNING;
  }

  return {
    patternId: pattern.id,
    category: pattern.category,
    name: pattern.name,
    confidence,
    matchedText: matchedText.slice(0, 200), // Truncate for storage
    alertLevel,
    timestamp: Date.now(),
  };
}

/**
 * Scans text for urgency language only (used for behavior scoring).
 */
export function detectUrgencyLanguage(text: string): boolean {
  return URGENCY_PATTERNS.some((regex) => {
    regex.lastIndex = 0;
    return regex.test(text);
  });
}

/**
 * Scans text for too-good-to-be-true language (used for behavior scoring).
 */
export function detectTGTBTLanguage(text: string): boolean {
  return TGTBT_PATTERNS.some((regex) => {
    regex.lastIndex = 0;
    return regex.test(text);
  });
}

/**
 * Returns a human-readable description of a scam category.
 */
export function getScamCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    pig_butchering: 'Pig Butchering (Romance + Investment)',
    fake_admin: 'Fake Admin Impersonation',
    crypto_giveaway: 'Crypto Giveaway Scam',
    fake_job: 'Fake Job Offer',
    clone_channel: 'Clone Channel',
    investment_fraud: 'Investment Fraud',
    romance_scam: 'Romance Scam',
    phishing: 'Credential Phishing',
    advance_fee: 'Advance Fee Fraud',
    impersonation: 'Impersonation',
    pump_and_dump: 'Pump & Dump',
    fake_support: 'Fake Technical Support',
  };
  return labels[category] || category;
}

/**
 * Returns the color associated with an alert level.
 */
export function getAlertLevelColor(level: AlertAction): string {
  switch (level) {
    case AlertAction.BLOCK: return '#dc2626'; // Red
    case AlertAction.DANGER: return '#ea580c'; // Orange-red
    case AlertAction.WARNING: return '#d97706'; // Amber
    default: return '#6b7280'; // Gray
  }
}
