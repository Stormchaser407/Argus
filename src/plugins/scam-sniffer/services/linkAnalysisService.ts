/**
 * Project Argus — Scam Sniffer: Link Analysis Service
 * Orchestrates all link/URL checking: Safe Browsing, VirusTotal,
 * typosquatting detection, and domain age checking.
 */

import type { DetectedLink, LinkCheckResult } from '../types';
import { ThreatLevel } from '../types';
import { getScamSnifferConfig } from '../config';
import { checkTyposquatting, getUrlSuspicionScore, hasSuspiciousTLD } from '../utils/linkDetector';
import { checkUrlSafeBrowsing } from './safeBrowsingService';
import { checkUrlVirusTotal } from './virusTotalService';
import { checkDomainAge } from './domainAgeService';

// ─── Trusted domains that should never be flagged ────────────────────────────

const TRUSTED_DOMAINS = new Set([
  'telegram.org', 't.me', 'web.telegram.org',
  'google.com', 'youtube.com', 'github.com',
  'wikipedia.org', 'reddit.com', 'twitter.com', 'x.com',
  'facebook.com', 'instagram.com', 'linkedin.com',
  'apple.com', 'microsoft.com', 'amazon.com',
  'stackoverflow.com', 'medium.com', 'notion.so',
]);

function isTrustedDomain(domain: string): boolean {
  const normalized = domain.toLowerCase().replace(/^www\./, '');
  // Check exact match and parent domain match
  if (TRUSTED_DOMAINS.has(normalized)) return true;
  const parts = normalized.split('.');
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join('.');
    if (TRUSTED_DOMAINS.has(parent)) return true;
  }
  return false;
}

// ─── Main Analysis Function ──────────────────────────────────────────────────

/**
 * Performs a comprehensive analysis of a detected link.
 * Runs all configured checks in parallel for speed.
 */
export async function analyzeLink(link: DetectedLink): Promise<LinkCheckResult> {
  const config = getScamSnifferConfig();
  const { url, domain } = link;

  // Skip trusted domains
  if (isTrustedDomain(domain)) {
    return {
      url,
      domain,
      isMalicious: false,
      threatLevel: ThreatLevel.SAFE,
      checks: {},
    };
  }

  // Run all checks in parallel
  const checkPromises: Promise<void>[] = [];
  const result: LinkCheckResult = {
    url,
    domain,
    isMalicious: false,
    threatLevel: ThreatLevel.SAFE,
    checks: {},
  };

  // 1. Typosquatting check (local, instant)
  if (config.phishingDetection.checkTyposquatting) {
    result.checks.typosquatting = checkTyposquatting(domain);
  }

  // 2. Google Safe Browsing
  if (config.phishingDetection.checkSafeBrowsing) {
    checkPromises.push(
      checkUrlSafeBrowsing(url).then((sbResult) => {
        result.checks.safeBrowsing = sbResult;
      }),
    );
  }

  // 3. VirusTotal
  if (config.phishingDetection.checkVirusTotal) {
    checkPromises.push(
      checkUrlVirusTotal(url).then((vtResult) => {
        result.checks.virusTotal = vtResult;
      }),
    );
  }

  // 4. Domain age
  if (config.phishingDetection.checkDomainAge) {
    checkPromises.push(
      checkDomainAge(domain).then((ageResult) => {
        result.checks.domainAge = ageResult;
      }),
    );
  }

  // Wait for all async checks to complete
  await Promise.allSettled(checkPromises);

  // Calculate overall threat level
  result.threatLevel = calculateThreatLevel(result);
  result.isMalicious = result.threatLevel === ThreatLevel.HIGH
    || result.threatLevel === ThreatLevel.CRITICAL;

  return result;
}

/**
 * Calculates the overall threat level based on all check results.
 */
function calculateThreatLevel(result: LinkCheckResult): ThreatLevel {
  let score = 0;

  // Safe Browsing — most authoritative signal
  if (result.checks.safeBrowsing?.isMalicious) {
    score += 80;
  }

  // VirusTotal
  if (result.checks.virusTotal?.isMalicious) {
    const vt = result.checks.virusTotal;
    if (vt.positives >= 10) {
      score += 70;
    } else if (vt.positives >= 5) {
      score += 50;
    } else if (vt.positives >= 3) {
      score += 30;
    }
  }

  // Typosquatting — strong signal
  if (result.checks.typosquatting?.isTyposquat) {
    score += 60;
  }

  // Domain age — supporting signal
  if (result.checks.domainAge?.isNewDomain) {
    score += 20;
  }

  // Suspicious TLD
  if (hasSuspiciousTLD(result.domain)) {
    score += 15;
  }

  // URL heuristic score
  const heuristicScore = getUrlSuspicionScore(result.url);
  score += Math.floor(heuristicScore * 0.3);

  // Map score to threat level
  if (score >= 80) return ThreatLevel.CRITICAL;
  if (score >= 60) return ThreatLevel.HIGH;
  if (score >= 35) return ThreatLevel.MEDIUM;
  if (score >= 15) return ThreatLevel.LOW;
  return ThreatLevel.SAFE;
}

/**
 * Batch analyze multiple links.
 */
export async function analyzeLinks(links: DetectedLink[]): Promise<LinkCheckResult[]> {
  // Process in parallel but with a concurrency limit
  const CONCURRENCY = 3;
  const results: LinkCheckResult[] = [];

  for (let i = 0; i < links.length; i += CONCURRENCY) {
    const batch = links.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(analyzeLink));
    results.push(...batchResults);
  }

  return results;
}

/**
 * Returns a human-readable summary of link check results.
 */
export function getLinkCheckSummary(result: LinkCheckResult): string {
  const parts: string[] = [];

  if (result.checks.safeBrowsing?.isMalicious) {
    const types = result.checks.safeBrowsing.threatTypes.join(', ');
    parts.push(`Google Safe Browsing: ${types}`);
  }

  if (result.checks.virusTotal?.isMalicious) {
    const vt = result.checks.virusTotal;
    parts.push(`VirusTotal: ${vt.positives}/${vt.total} engines flagged`);
  }

  if (result.checks.typosquatting?.isTyposquat) {
    const ts = result.checks.typosquatting;
    parts.push(`Typosquatting: impersonates ${ts.targetDomain} (${ts.technique})`);
  }

  if (result.checks.domainAge?.isNewDomain) {
    const age = result.checks.domainAge;
    parts.push(`New domain: registered ${age.ageDays} days ago`);
  }

  if (parts.length === 0) {
    return 'No threats detected';
  }

  return parts.join(' | ');
}
