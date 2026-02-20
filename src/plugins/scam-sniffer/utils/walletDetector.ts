/**
 * Project Argus — Scam Sniffer: Wallet Detector
 * Detects cryptocurrency wallet addresses in message text using regex patterns.
 *
 * Supported chains: BTC, ETH, TRC20 (USDT), SOL, LTC, XRP, DOGE, BCH, BNB, MATIC, ADA, DOT, AVAX
 */

import { CryptoChain } from '../types';
import type { DetectedWallet } from '../types';

// ─── Wallet Address Regex Patterns ───────────────────────────────────────────
// Each pattern is designed to match valid addresses while minimizing false positives.
// Word boundaries (\b) prevent matching substrings of longer tokens.

interface WalletPattern {
  chain: CryptoChain;
  regex: RegExp;
  label: string;
}

const WALLET_PATTERNS: WalletPattern[] = [
  // Bitcoin — Legacy (1...), SegWit (3...), Bech32 (bc1q...), Taproot (bc1p...)
  {
    chain: CryptoChain.BTC,
    regex: /\b(bc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{39,59})\b/gi,
    label: 'BTC (Bech32)',
  },
  {
    chain: CryptoChain.BTC,
    regex: /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34})\b/g,
    label: 'BTC (Legacy/SegWit)',
  },

  // Ethereum — 0x followed by 40 hex chars
  {
    chain: CryptoChain.ETH,
    regex: /\b(0x[a-fA-F0-9]{40})\b/g,
    label: 'ETH',
  },

  // TRON / TRC20 (USDT) — starts with T, 34 chars base58
  {
    chain: CryptoChain.TRC20,
    regex: /\b(T[a-zA-HJ-NP-Z1-9]{33})\b/g,
    label: 'TRC20',
  },

  // Solana — 32-44 chars base58 (no 0, O, I, l)
  {
    chain: CryptoChain.SOL,
    regex: /\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/g,
    label: 'SOL',
  },

  // Litecoin — Legacy (L/M), SegWit (ltc1)
  {
    chain: CryptoChain.LTC,
    regex: /\b(ltc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{39,59})\b/gi,
    label: 'LTC (Bech32)',
  },
  {
    chain: CryptoChain.LTC,
    regex: /\b([LM][a-km-zA-HJ-NP-Z1-9]{26,33})\b/g,
    label: 'LTC (Legacy)',
  },

  // XRP — starts with r, 25-35 chars
  {
    chain: CryptoChain.XRP,
    regex: /\b(r[0-9a-zA-Z]{24,34})\b/g,
    label: 'XRP',
  },

  // Dogecoin — starts with D, 34 chars
  {
    chain: CryptoChain.DOGE,
    regex: /\b(D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32})\b/g,
    label: 'DOGE',
  },

  // Bitcoin Cash — cashaddr format (bitcoincash:q... or q...)
  {
    chain: CryptoChain.BCH,
    regex: /\b(bitcoincash:[qp][a-z0-9]{41})\b/gi,
    label: 'BCH (CashAddr)',
  },

  // BNB Smart Chain — same format as ETH (0x...)
  // Note: BNB addresses are indistinguishable from ETH by format alone.
  // We detect them as ETH; context clues can disambiguate later.

  // Cardano (ADA) — starts with addr1
  {
    chain: CryptoChain.ADA,
    regex: /\b(addr1[a-z0-9]{58,})\b/g,
    label: 'ADA',
  },

  // Polkadot — starts with 1, 47-48 chars base58
  {
    chain: CryptoChain.DOT,
    regex: /\b(1[a-zA-HJ-NP-Z1-9]{46,47})\b/g,
    label: 'DOT',
  },

  // Avalanche C-Chain — same as ETH (0x...)
  // Detected as ETH; context clues can disambiguate.
];

// ─── Common false positive filters ──────────────────────────────────────────

const FALSE_POSITIVE_PATTERNS = [
  /^https?:\/\//i, // URLs
  /^[a-zA-Z]+:\/\//i, // Any protocol
  /^\d+\.\d+\.\d+\.\d+$/, // IP addresses
  /^[a-f0-9]{64}$/i, // Transaction hashes (64 hex chars)
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email addresses
];

// Common English words and patterns that could match SOL/DOT patterns
const COMMON_WORD_BLOCKLIST = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
  'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'did',
  'let', 'say', 'she', 'too', 'use', 'this', 'that', 'with', 'have', 'from',
  'they', 'been', 'said', 'each', 'which', 'their', 'will', 'other', 'about',
  'many', 'then', 'them', 'these', 'some', 'would', 'make', 'like', 'time',
  'just', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'could',
  'give', 'most', 'only', 'tell', 'very', 'when', 'what', 'come', 'made',
  'after', 'back', 'also', 'want', 'here', 'first', 'well', 'even', 'where',
  'send', 'join', 'click', 'free', 'telegram', 'admin', 'group', 'channel',
  'message', 'hello', 'please', 'thanks', 'welcome', 'support', 'help',
]);

function isFalsePositive(candidate: string): boolean {
  // Check against known false positive patterns
  if (FALSE_POSITIVE_PATTERNS.some((p) => p.test(candidate))) {
    return true;
  }

  // Check against common word blocklist (case-insensitive)
  if (COMMON_WORD_BLOCKLIST.has(candidate.toLowerCase())) {
    return true;
  }

  // Too short to be a real wallet address (most are 25+ chars)
  if (candidate.length < 25) {
    return true;
  }

  return false;
}

// ─── Main Detection Function ─────────────────────────────────────────────────

/**
 * Scans a text string for cryptocurrency wallet addresses.
 * Returns an array of detected wallets with their positions and chain type.
 */
export function detectWallets(text: string): DetectedWallet[] {
  if (!text || text.length < 25) return [];

  const results: DetectedWallet[] = [];
  const seenAddresses = new Set<string>();

  // Process patterns in priority order (more specific first)
  // BTC Bech32, ETH, TRC20, ADA, BCH, LTC Bech32 are highly specific
  // SOL and DOT are more generic and checked last
  const priorityPatterns = WALLET_PATTERNS.filter(
    (p) => [CryptoChain.BTC, CryptoChain.ETH, CryptoChain.TRC20, CryptoChain.ADA, CryptoChain.BCH].includes(p.chain),
  );
  const genericPatterns = WALLET_PATTERNS.filter(
    (p) => ![CryptoChain.BTC, CryptoChain.ETH, CryptoChain.TRC20, CryptoChain.ADA, CryptoChain.BCH].includes(p.chain),
  );

  const allPatterns = [...priorityPatterns, ...genericPatterns];

  for (const pattern of allPatterns) {
    // Reset regex lastIndex for global patterns
    pattern.regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.regex.exec(text)) !== null) {
      const address = match[1] || match[0];
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;

      // Skip duplicates
      if (seenAddresses.has(address)) continue;

      // Skip false positives
      if (isFalsePositive(address)) continue;

      // For SOL/DOT/XRP — additional validation to reduce noise
      if ([CryptoChain.SOL, CryptoChain.DOT, CryptoChain.XRP].includes(pattern.chain)) {
        // These patterns are very broad; only match if the address looks "random enough"
        if (!looksLikeCryptoAddress(address)) continue;
      }

      seenAddresses.add(address);
      results.push({
        address,
        chain: pattern.chain,
        startIndex,
        endIndex,
      });
    }
  }

  return results;
}

/**
 * Entropy-based check: real crypto addresses have high character diversity.
 * English words and common strings have lower entropy.
 */
function looksLikeCryptoAddress(str: string): boolean {
  if (str.length < 26) return false;

  // Calculate character frequency entropy
  const freq: Record<string, number> = {};
  for (const ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  const len = str.length;
  let entropy = 0;
  for (const count of Object.values(freq)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  // Real crypto addresses typically have entropy > 3.5
  // English words and short phrases have entropy < 3.0
  return entropy > 3.2;
}

/**
 * Returns a human-readable label for a crypto chain.
 */
export function getChainLabel(chain: CryptoChain): string {
  const labels: Record<CryptoChain, string> = {
    [CryptoChain.BTC]: 'Bitcoin',
    [CryptoChain.ETH]: 'Ethereum',
    [CryptoChain.TRC20]: 'TRON (TRC-20)',
    [CryptoChain.SOL]: 'Solana',
    [CryptoChain.LTC]: 'Litecoin',
    [CryptoChain.XRP]: 'XRP',
    [CryptoChain.DOGE]: 'Dogecoin',
    [CryptoChain.BCH]: 'Bitcoin Cash',
    [CryptoChain.BNB]: 'BNB Chain',
    [CryptoChain.MATIC]: 'Polygon',
    [CryptoChain.ADA]: 'Cardano',
    [CryptoChain.DOT]: 'Polkadot',
    [CryptoChain.AVAX]: 'Avalanche',
    [CryptoChain.UNKNOWN]: 'Unknown',
  };
  return labels[chain] || chain;
}

/**
 * Truncates a wallet address for display (e.g., "0x1234...abcd").
 */
export function truncateAddress(address: string, prefixLen = 6, suffixLen = 4): string {
  if (address.length <= prefixLen + suffixLen + 3) return address;
  return `${address.slice(0, prefixLen)}...${address.slice(-suffixLen)}`;
}
