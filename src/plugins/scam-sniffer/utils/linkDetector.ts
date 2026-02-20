/**
 * Project Argus — Scam Sniffer: Link Detector
 * Detects URLs in messages and checks for typosquatting patterns.
 */

import type { DetectedLink, TyposquattingResult } from '../types';

// ─── URL Detection ───────────────────────────────────────────────────────────

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
const DOMAIN_REGEX = /^(?:https?:\/\/)?(?:www\.)?([^/:\s]+)/i;

/**
 * Extracts all URLs from a text string with their positions.
 */
export function detectLinks(text: string): DetectedLink[] {
  if (!text) return [];

  const results: DetectedLink[] = [];
  const seenUrls = new Set<string>();

  URL_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(text)) !== null) {
    const url = match[0].replace(/[.,;:!?)]+$/, ''); // Strip trailing punctuation
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);

    const domain = extractDomain(url);
    if (!domain) continue;

    results.push({
      url,
      domain,
      startIndex: match.index,
      endIndex: match.index + url.length,
    });
  }

  return results;
}

/**
 * Extracts the domain from a URL.
 */
export function extractDomain(url: string): string {
  const match = url.match(DOMAIN_REGEX);
  return match ? match[1].toLowerCase() : '';
}

// ─── Typosquatting Detection ─────────────────────────────────────────────────

/**
 * Known legitimate domains that scammers commonly typosquat.
 * Maps the canonical domain to common misspellings/variations.
 */
const TYPOSQUAT_TARGETS: Record<string, string[]> = {
  'telegram.org': [
    'telegramm.org', 'telegrarn.org', 'telegran.org', 'telegrom.org',
    'te1egram.org', 'teIegram.org', 'telegam.org', 'telgram.org',
    'teleqram.org', 'telegr4m.org', 'telegram.com', 'telegram.io',
    'telegram-org.com', 'telegram.cc', 'tg-telegram.org',
  ],
  't.me': [
    'tt.me', 't-me.com', 'tme.com', 't.mee', 'tg.me',
  ],
  'web.telegram.org': [
    'web-telegram.org', 'web.telegramm.org', 'web.telegrarn.org',
    'webtelegram.org', 'web.telegram.com',
  ],
  'binance.com': [
    'blnance.com', 'binancee.com', 'binance-com.com', 'binnance.com',
    'b1nance.com', 'binance.org', 'binance.cc', 'binance-exchange.com',
  ],
  'coinbase.com': [
    'c0inbase.com', 'coinbasse.com', 'coinbase-pro.com', 'coinbasee.com',
    'colnbase.com', 'coinbase.org',
  ],
  'metamask.io': [
    'metamask.com', 'rnetamask.io', 'metamaask.io', 'meta-mask.io',
    'metamask-io.com', 'metarnask.io',
  ],
  'trustwallet.com': [
    'trustwallett.com', 'trust-wallet.com', 'trustwalet.com',
    'trustwallet.org', 'trustwallet.io',
  ],
  'phantom.app': [
    'phantorn.app', 'phantom-app.com', 'phantomapp.com', 'phanton.app',
  ],
  'opensea.io': [
    'opensea.com', 'opensee.io', '0pensea.io', 'opensea-io.com',
  ],
  'uniswap.org': [
    'uniswap.com', 'uniswapp.org', 'un1swap.org', 'uniswap.io',
  ],
  'paypal.com': [
    'paypa1.com', 'paypal.org', 'paypal-com.com', 'paypall.com',
  ],
  'blockchain.com': [
    'blockchain.org', 'blockchian.com', 'b1ockchain.com', 'blockchain-com.com',
  ],
  'google.com': [
    'googl3.com', 'go0gle.com', 'gogle.com', 'google.org',
  ],
  'facebook.com': [
    'faceb00k.com', 'facebok.com', 'facebook.org',
  ],
  'twitter.com': [
    'twltter.com', 'tw1tter.com', 'twitter.org',
  ],
  'whatsapp.com': [
    'whatsap.com', 'whatsapp.org', 'whatssapp.com',
  ],
};

// Build a reverse lookup: typo domain -> target domain
const TYPO_REVERSE_MAP = new Map<string, string>();
for (const [target, typos] of Object.entries(TYPOSQUAT_TARGETS)) {
  for (const typo of typos) {
    TYPO_REVERSE_MAP.set(typo, target);
  }
}

/**
 * Checks if a domain is a known typosquat of a legitimate domain.
 */
export function checkTyposquatting(domain: string): TyposquattingResult {
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');

  // Direct lookup against known typosquats
  const knownTarget = TYPO_REVERSE_MAP.get(normalizedDomain);
  if (knownTarget) {
    return {
      isTyposquat: true,
      targetDomain: knownTarget,
      similarity: 0.9,
      technique: 'known_typosquat',
    };
  }

  // Fuzzy matching against target domains
  for (const target of Object.keys(TYPOSQUAT_TARGETS)) {
    const sim = calculateSimilarity(normalizedDomain, target);
    if (sim >= 0.8 && normalizedDomain !== target) {
      // Determine the technique used
      const technique = identifyTyposquatTechnique(normalizedDomain, target);
      return {
        isTyposquat: true,
        targetDomain: target,
        similarity: sim,
        technique,
      };
    }
  }

  // Check for homoglyph attacks (e.g., using Cyrillic characters that look like Latin)
  const homoglyphTarget = checkHomoglyphs(normalizedDomain);
  if (homoglyphTarget) {
    return {
      isTyposquat: true,
      targetDomain: homoglyphTarget,
      similarity: 0.95,
      technique: 'homoglyph',
    };
  }

  return {
    isTyposquat: false,
    similarity: 0,
  };
}

/**
 * Levenshtein distance-based similarity calculation.
 */
function calculateSimilarity(a: string, b: string): number {
  const lenA = a.length;
  const lenB = b.length;
  const maxLen = Math.max(lenA, lenB);
  if (maxLen === 0) return 1;

  const matrix: number[][] = [];

  for (let i = 0; i <= lenA; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= lenB; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return 1 - matrix[lenA][lenB] / maxLen;
}

/**
 * Identifies the typosquatting technique used.
 */
function identifyTyposquatTechnique(typo: string, target: string): string {
  if (typo.length === target.length) {
    // Character substitution (e.g., rn -> m, 1 -> l, 0 -> o)
    return 'character_substitution';
  }
  if (typo.length === target.length + 1) {
    return 'character_insertion';
  }
  if (typo.length === target.length - 1) {
    return 'character_omission';
  }
  if (typo.includes('-') && !target.includes('-')) {
    return 'hyphenation';
  }
  // Check if TLD was changed
  const typoParts = typo.split('.');
  const targetParts = target.split('.');
  if (typoParts[0] === targetParts[0] && typoParts.slice(1).join('.') !== targetParts.slice(1).join('.')) {
    return 'tld_swap';
  }
  return 'unknown';
}

/**
 * Homoglyph detection — characters that look similar across scripts.
 */
const HOMOGLYPH_MAP: Record<string, string> = {
  '\u0430': 'a', // Cyrillic а
  '\u0435': 'e', // Cyrillic е
  '\u043E': 'o', // Cyrillic о
  '\u0440': 'p', // Cyrillic р
  '\u0441': 'c', // Cyrillic с
  '\u0443': 'y', // Cyrillic у
  '\u0445': 'x', // Cyrillic х
  '\u0456': 'i', // Cyrillic і
  '\u0458': 'j', // Cyrillic ј
  '\u04BB': 'h', // Cyrillic һ
  '\u0501': 'd', // Cyrillic ԁ
};

function checkHomoglyphs(domain: string): string | undefined {
  let hasHomoglyph = false;
  let normalized = '';

  for (const char of domain) {
    if (HOMOGLYPH_MAP[char]) {
      hasHomoglyph = true;
      normalized += HOMOGLYPH_MAP[char];
    } else {
      normalized += char;
    }
  }

  if (!hasHomoglyph) return undefined;

  // Check if the normalized version matches a known target
  for (const target of Object.keys(TYPOSQUAT_TARGETS)) {
    if (normalized === target) {
      return target;
    }
  }

  return undefined;
}

// ─── Suspicious TLD Detection ────────────────────────────────────────────────

const SUSPICIOUS_TLDS = new Set([
  '.tk', '.ml', '.ga', '.cf', '.gq', // Freenom free TLDs (heavily abused)
  '.xyz', '.top', '.club', '.work', '.click',
  '.link', '.buzz', '.surf', '.icu', '.monster',
  '.rest', '.cam', '.uno', '.sbs',
]);

/**
 * Checks if a domain uses a suspicious TLD.
 */
export function hasSuspiciousTLD(domain: string): boolean {
  const tld = '.' + domain.split('.').pop()?.toLowerCase();
  return SUSPICIOUS_TLDS.has(tld);
}

/**
 * Quick heuristic check for suspicious URL characteristics.
 */
export function getUrlSuspicionScore(url: string): number {
  let score = 0;
  const domain = extractDomain(url);

  // Suspicious TLD
  if (hasSuspiciousTLD(domain)) score += 20;

  // IP address instead of domain
  if (/^\d+\.\d+\.\d+\.\d+/.test(domain)) score += 30;

  // Excessive subdomains
  const subdomainCount = domain.split('.').length - 2;
  if (subdomainCount > 2) score += 15;

  // URL contains @ (credential phishing)
  if (url.includes('@')) score += 25;

  // Very long URL (common in phishing)
  if (url.length > 200) score += 10;

  // Contains suspicious keywords in path
  const suspiciousPathWords = ['login', 'signin', 'verify', 'confirm', 'secure', 'account', 'update', 'wallet', 'connect'];
  const lowerUrl = url.toLowerCase();
  for (const word of suspiciousPathWords) {
    if (lowerUrl.includes(word)) {
      score += 5;
    }
  }

  return Math.min(score, 100);
}
