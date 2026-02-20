/**
 * Project Argus — Scam Sniffer: Chainabuse API Service
 * Cross-references crypto wallet addresses against the Chainabuse database.
 *
 * API Docs: https://docs.chainabuse.com
 * Requires: ARGUS_CHAINABUSE_API_KEY environment variable
 */

import type { CryptoChain, WalletCheckResult } from '../types';
import { getScamSnifferConfig } from '../config';

const CHAINABUSE_API_BASE = 'https://api.chainabuse.com/v0';

// ─── Chain name mapping for Chainabuse API ───────────────────────────────────

const CHAIN_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  TRC20: 'tron',
  SOL: 'solana',
  LTC: 'litecoin',
  XRP: 'xrp',
  DOGE: 'dogecoin',
  BCH: 'bitcoin-cash',
  BNB: 'bsc',
  MATIC: 'polygon',
  ADA: 'cardano',
  DOT: 'polkadot',
  AVAX: 'avalanche',
};

// ─── Local cache to avoid redundant API calls ────────────────────────────────

interface CacheEntry {
  result: WalletCheckResult;
  timestamp: number;
}

const walletCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getCachedResult(address: string): WalletCheckResult | undefined {
  const entry = walletCache.get(address.toLowerCase());
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.result;
  }
  walletCache.delete(address.toLowerCase());
  return undefined;
}

function setCachedResult(address: string, result: WalletCheckResult): void {
  walletCache.set(address.toLowerCase(), {
    result,
    timestamp: Date.now(),
  });

  // Evict old entries if cache grows too large
  if (walletCache.size > 1000) {
    const now = Date.now();
    for (const [key, entry] of walletCache.entries()) {
      if (now - entry.timestamp > CACHE_TTL_MS) {
        walletCache.delete(key);
      }
    }
  }
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Checks a wallet address against the Chainabuse API.
 * Degrades gracefully if API key is not configured.
 */
export async function checkWalletChainabuse(
  address: string,
  chain: CryptoChain,
): Promise<WalletCheckResult> {
  // Check cache first
  const cached = getCachedResult(address);
  if (cached) return cached;

  const config = getScamSnifferConfig();
  const apiKey = config.apiKeys.chainabuse;

  // Graceful degradation — no API key
  if (!apiKey) {
    const result: WalletCheckResult = {
      address,
      chain,
      isFlagged: false,
      reportCount: 0,
      riskScore: 0,
      categories: [],
      source: 'unchecked',
      error: 'Chainabuse API key not configured',
    };
    return result;
  }

  try {
    const chainName = CHAIN_MAP[chain] || chain.toLowerCase();

    // Query the Chainabuse address report endpoint
    const response = await fetch(
      `${CHAINABUSE_API_BASE}/reports?address=${encodeURIComponent(address)}&chain=${chainName}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      },
    );

    if (response.status === 401 || response.status === 403) {
      const result: WalletCheckResult = {
        address,
        chain,
        isFlagged: false,
        reportCount: 0,
        riskScore: 0,
        categories: [],
        source: 'unchecked',
        error: 'Chainabuse API key invalid or unauthorized',
      };
      setCachedResult(address, result);
      return result;
    }

    if (response.status === 429) {
      const result: WalletCheckResult = {
        address,
        chain,
        isFlagged: false,
        reportCount: 0,
        riskScore: 0,
        categories: [],
        source: 'unchecked',
        error: 'Chainabuse API rate limit exceeded',
      };
      return result; // Don't cache rate limit errors
    }

    if (!response.ok) {
      throw new Error(`Chainabuse API returned ${response.status}`);
    }

    const data = await response.json();

    // Parse the response
    const reports = Array.isArray(data.reports) ? data.reports : (Array.isArray(data) ? data : []);
    const reportCount = reports.length;
    const isFlagged = reportCount > 0;

    // Extract unique categories from reports
    const categories = [...new Set(
      reports
        .map((r: any) => r.category || r.scamCategory || r.type)
        .filter(Boolean),
    )] as string[];

    // Calculate risk score based on report count and recency
    let riskScore = 0;
    if (reportCount > 0) {
      riskScore = Math.min(100, 30 + reportCount * 10);

      // Boost score for recent reports
      const recentReports = reports.filter((r: any) => {
        const reportDate = new Date(r.createdAt || r.reportedAt || 0);
        const daysSinceReport = (Date.now() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceReport < 90;
      });
      if (recentReports.length > 0) {
        riskScore = Math.min(100, riskScore + 20);
      }
    }

    // Get the most recent report date
    const lastReportDate = reports.length > 0
      ? reports
        .map((r: any) => r.createdAt || r.reportedAt)
        .filter(Boolean)
        .sort()
        .pop()
      : undefined;

    const result: WalletCheckResult = {
      address,
      chain,
      isFlagged,
      reportCount,
      riskScore,
      categories,
      lastReportDate,
      source: 'chainabuse',
    };

    setCachedResult(address, result);
    return result;
  } catch (error) {
    console.error('[Argus/ScamSniffer] Chainabuse API error:', error);
    const result: WalletCheckResult = {
      address,
      chain,
      isFlagged: false,
      reportCount: 0,
      riskScore: 0,
      categories: [],
      source: 'unchecked',
      error: `Chainabuse API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
    return result;
  }
}

/**
 * Batch check multiple wallets. Processes sequentially with a small delay
 * to respect rate limits.
 */
export async function batchCheckWallets(
  wallets: Array<{ address: string; chain: CryptoChain }>,
): Promise<WalletCheckResult[]> {
  const results: WalletCheckResult[] = [];

  for (const wallet of wallets) {
    const result = await checkWalletChainabuse(wallet.address, wallet.chain);
    results.push(result);

    // Small delay between requests to respect rate limits
    if (wallets.indexOf(wallet) < wallets.length - 1) {
      await new Promise((resolve) => { setTimeout(resolve, 200); });
    }
  }

  return results;
}

/**
 * Clears the wallet check cache.
 */
export function clearWalletCache(): void {
  walletCache.clear();
}

/**
 * Returns cache statistics.
 */
export function getWalletCacheStats(): { size: number; maxAge: number } {
  return {
    size: walletCache.size,
    maxAge: CACHE_TTL_MS,
  };
}
