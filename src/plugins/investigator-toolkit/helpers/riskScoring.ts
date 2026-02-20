/**
 * Project Argus — Risk Scoring Engine
 * Calculates risk scores based on account age, behavior patterns, and profile completeness.
 */

import type { RiskLevel } from '../types';
import { RISK_THRESHOLDS } from '../types';

/**
 * Estimate Telegram account registration date from user ID.
 * Telegram user IDs are roughly sequential and correlated with creation time.
 * This uses known anchor points to interpolate registration dates.
 */
const ID_DATE_ANCHORS: Array<{ id: number; timestamp: number }> = [
  { id: 1000000, timestamp: 1380326400 },    // ~Sep 28, 2013
  { id: 10000000, timestamp: 1390000000 },    // ~Jan 18, 2014
  { id: 50000000, timestamp: 1400000000 },    // ~May 14, 2014
  { id: 100000000, timestamp: 1413331200 },   // ~Oct 15, 2014
  { id: 200000000, timestamp: 1432857600 },   // ~May 29, 2015
  { id: 300000000, timestamp: 1449014400 },   // ~Dec 2, 2015
  { id: 400000000, timestamp: 1462838400 },   // ~May 10, 2016
  { id: 500000000, timestamp: 1477008000 },   // ~Oct 21, 2016
  { id: 600000000, timestamp: 1492992000 },   // ~Apr 24, 2017
  { id: 700000000, timestamp: 1510272000 },   // ~Nov 10, 2017
  { id: 800000000, timestamp: 1524355200 },   // ~Apr 22, 2018
  { id: 900000000, timestamp: 1537920000 },   // ~Sep 26, 2018
  { id: 1000000000, timestamp: 1546300800 },  // ~Jan 1, 2019
  { id: 1100000000, timestamp: 1558310400 },  // ~May 20, 2019
  { id: 1200000000, timestamp: 1571270400 },  // ~Oct 17, 2019
  { id: 1300000000, timestamp: 1585699200 },  // ~Apr 1, 2020
  { id: 1400000000, timestamp: 1596240000 },  // ~Aug 1, 2020
  { id: 1500000000, timestamp: 1609459200 },  // ~Jan 1, 2021
  { id: 1600000000, timestamp: 1619827200 },  // ~May 1, 2021
  { id: 1700000000, timestamp: 1627776000 },  // ~Aug 1, 2021
  { id: 1800000000, timestamp: 1640995200 },  // ~Jan 1, 2022
  { id: 1900000000, timestamp: 1648771200 },  // ~Apr 1, 2022
  { id: 2000000000, timestamp: 1656633600 },  // ~Jul 1, 2022
  { id: 5000000000, timestamp: 1672531200 },  // ~Jan 1, 2023 (IDs jumped to 5B+ range)
  { id: 5500000000, timestamp: 1688169600 },  // ~Jul 1, 2023
  { id: 6000000000, timestamp: 1704067200 },  // ~Jan 1, 2024
  { id: 6500000000, timestamp: 1719792000 },  // ~Jul 1, 2024
  { id: 7000000000, timestamp: 1735689600 },  // ~Jan 1, 2025
  { id: 7500000000, timestamp: 1751328000 },  // ~Jul 1, 2025
];

export function estimateRegistrationDate(userId: string): number | undefined {
  const numericId = parseInt(userId, 10);
  if (Number.isNaN(numericId) || numericId <= 0) {
    return undefined;
  }

  // If below smallest known anchor
  if (numericId < ID_DATE_ANCHORS[0].id) {
    return ID_DATE_ANCHORS[0].timestamp;
  }

  // If above largest known anchor
  const lastAnchor = ID_DATE_ANCHORS[ID_DATE_ANCHORS.length - 1];
  if (numericId > lastAnchor.id) {
    // Extrapolate from last two anchors
    const prevAnchor = ID_DATE_ANCHORS[ID_DATE_ANCHORS.length - 2];
    const idDelta = lastAnchor.id - prevAnchor.id;
    const timeDelta = lastAnchor.timestamp - prevAnchor.timestamp;
    const extrapolated = lastAnchor.timestamp
      + ((numericId - lastAnchor.id) / idDelta) * timeDelta;
    return Math.min(extrapolated, Date.now() / 1000);
  }

  // Interpolate between two closest anchors
  for (let i = 0; i < ID_DATE_ANCHORS.length - 1; i++) {
    const current = ID_DATE_ANCHORS[i];
    const next = ID_DATE_ANCHORS[i + 1];
    if (numericId >= current.id && numericId <= next.id) {
      const idRange = next.id - current.id;
      const timeRange = next.timestamp - current.timestamp;
      const idOffset = numericId - current.id;
      return current.timestamp + (idOffset / idRange) * timeRange;
    }
  }

  return undefined;
}

export function calculateAccountAgeDays(registrationTimestamp: number): number {
  const now = Date.now() / 1000;
  const ageSec = now - registrationTimestamp;
  return Math.max(0, Math.floor(ageSec / 86400));
}

export function calculateRiskScore(params: {
  accountAgeDays: number;
  hasProfilePhoto: boolean;
  hasBio: boolean;
  hasUsername: boolean;
  isPremium: boolean;
  isVerified: boolean;
  commonChatsCount: number;
}): number {
  const {
    accountAgeDays, hasProfilePhoto, hasBio, hasUsername,
    isPremium, isVerified, commonChatsCount,
  } = params;

  let score = 0;

  // Account age scoring (0-40 points, higher = more risky for new accounts)
  if (accountAgeDays < RISK_THRESHOLDS.CRITICAL_DAYS) {
    score += 40;
  } else if (accountAgeDays < RISK_THRESHOLDS.HIGH_DAYS) {
    score += 30;
  } else if (accountAgeDays < RISK_THRESHOLDS.MEDIUM_DAYS) {
    score += 20;
  } else if (accountAgeDays < RISK_THRESHOLDS.LOW_DAYS) {
    score += 10;
  }

  // Profile completeness (0-30 points for incomplete profiles)
  if (!hasProfilePhoto) score += 10;
  if (!hasBio) score += 10;
  if (!hasUsername) score += 10;

  // Positive signals reduce risk
  if (isPremium) score -= 10;
  if (isVerified) score -= 20;
  if (commonChatsCount > 5) score -= 5;
  if (commonChatsCount > 20) score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 30) return 'medium';
  if (score >= 15) return 'low';
  return 'minimal';
}

export function formatRegistrationDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatAccountAge(days: number): string {
  if (days < 1) return 'Less than a day';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
  }
  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  if (remainingMonths === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }
  return `${years}y ${remainingMonths}m`;
}
