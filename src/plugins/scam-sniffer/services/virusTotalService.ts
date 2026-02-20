/**
 * Project Argus — Scam Sniffer: VirusTotal API Service
 * Scans URLs against VirusTotal's multi-engine threat database.
 *
 * API Docs: https://developers.virustotal.com/reference
 * Requires: ARGUS_VIRUSTOTAL_API_KEY environment variable
 */

import type { VirusTotalResult } from '../types';
import { getScamSnifferConfig } from '../config';

const VT_API_BASE = 'https://www.virustotal.com/api/v3';

// ─── Cache ───────────────────────────────────────────────────────────────────

interface CacheEntry {
  result: VirusTotalResult;
  timestamp: number;
}

const vtCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getCachedResult(url: string): VirusTotalResult | undefined {
  const entry = vtCache.get(url);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.result;
  }
  vtCache.delete(url);
  return undefined;
}

function setCachedResult(url: string, result: VirusTotalResult): void {
  vtCache.set(url, { result, timestamp: Date.now() });

  if (vtCache.size > 2000) {
    const now = Date.now();
    for (const [key, entry] of vtCache.entries()) {
      if (now - entry.timestamp > CACHE_TTL_MS) {
        vtCache.delete(key);
      }
    }
  }
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Encodes a URL to a VirusTotal-compatible identifier.
 * VT uses base64url encoding of the URL as the resource ID.
 */
function encodeUrlId(url: string): string {
  // VT API v3 uses base64url encoding without padding
  const encoded = btoa(url)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return encoded;
}

/**
 * Checks a URL against VirusTotal.
 * First tries to get an existing analysis, then submits for scanning if not found.
 */
export async function checkUrlVirusTotal(url: string): Promise<VirusTotalResult> {
  const cached = getCachedResult(url);
  if (cached) return cached;

  const config = getScamSnifferConfig();
  const apiKey = config.apiKeys.virusTotal;

  if (!apiKey) {
    return {
      isAvailable: false,
      isMalicious: false,
      positives: 0,
      total: 0,
    };
  }

  try {
    // Try to get existing URL report
    const urlId = encodeUrlId(url);
    const response = await fetch(
      `${VT_API_BASE}/urls/${urlId}`,
      {
        method: 'GET',
        headers: {
          'x-apikey': apiKey,
          'Accept': 'application/json',
        },
      },
    );

    if (response.status === 404) {
      // URL not in VT database — submit for scanning
      return await submitUrlForScan(url, apiKey);
    }

    if (response.status === 401 || response.status === 403) {
      return {
        isAvailable: false,
        isMalicious: false,
        positives: 0,
        total: 0,
      };
    }

    if (response.status === 429) {
      return {
        isAvailable: false,
        isMalicious: false,
        positives: 0,
        total: 0,
      };
    }

    if (!response.ok) {
      throw new Error(`VirusTotal API returned ${response.status}`);
    }

    const data = await response.json();
    const result = parseVTResponse(data);
    setCachedResult(url, result);
    return result;
  } catch (error) {
    console.error('[Argus/ScamSniffer] VirusTotal API error:', error);
    return {
      isAvailable: false,
      isMalicious: false,
      positives: 0,
      total: 0,
    };
  }
}

/**
 * Submits a URL to VirusTotal for scanning.
 * Returns a preliminary result (scan pending).
 */
async function submitUrlForScan(url: string, apiKey: string): Promise<VirusTotalResult> {
  try {
    const formData = new URLSearchParams();
    formData.append('url', url);

    const response = await fetch(
      `${VT_API_BASE}/urls`,
      {
        method: 'POST',
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      },
    );

    if (!response.ok) {
      return {
        isAvailable: false,
        isMalicious: false,
        positives: 0,
        total: 0,
      };
    }

    // Scan submitted — result will be available later
    // For now, return a "pending" result
    const result: VirusTotalResult = {
      isAvailable: true,
      isMalicious: false,
      positives: 0,
      total: 0,
      scanDate: new Date().toISOString(),
    };

    return result;
  } catch (error) {
    console.error('[Argus/ScamSniffer] VirusTotal scan submission error:', error);
    return {
      isAvailable: false,
      isMalicious: false,
      positives: 0,
      total: 0,
    };
  }
}

/**
 * Parses a VirusTotal URL analysis response.
 */
function parseVTResponse(data: any): VirusTotalResult {
  const attributes = data?.data?.attributes;
  if (!attributes) {
    return {
      isAvailable: true,
      isMalicious: false,
      positives: 0,
      total: 0,
    };
  }

  const stats = attributes.last_analysis_stats || {};
  const malicious = stats.malicious || 0;
  const suspicious = stats.suspicious || 0;
  const harmless = stats.harmless || 0;
  const undetected = stats.undetected || 0;
  const total = malicious + suspicious + harmless + undetected;
  const positives = malicious + suspicious;

  // Consider malicious if 3+ engines flag it, or if malicious ratio > 10%
  const isMalicious = positives >= 3 || (total > 0 && positives / total > 0.1);

  return {
    isAvailable: true,
    isMalicious,
    positives,
    total,
    scanDate: attributes.last_analysis_date
      ? new Date(attributes.last_analysis_date * 1000).toISOString()
      : undefined,
  };
}

/**
 * Batch check multiple URLs against VirusTotal.
 * Processes sequentially with delays to respect the free API rate limit (4 req/min).
 */
export async function batchCheckUrlsVT(urls: string[]): Promise<Map<string, VirusTotalResult>> {
  const results = new Map<string, VirusTotalResult>();

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const result = await checkUrlVirusTotal(url);
    results.set(url, result);

    // VT free tier: 4 requests per minute
    if (i < urls.length - 1) {
      await new Promise((resolve) => { setTimeout(resolve, 15500); });
    }
  }

  return results;
}

export function clearVirusTotalCache(): void {
  vtCache.clear();
}
