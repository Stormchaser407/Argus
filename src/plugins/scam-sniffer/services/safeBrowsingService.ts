/**
 * Project Argus — Scam Sniffer: Google Safe Browsing API Service
 * Checks URLs against Google's Safe Browsing threat lists.
 *
 * API Docs: https://developers.google.com/safe-browsing/v4
 * Requires: ARGUS_SAFE_BROWSING_API_KEY environment variable
 */

import type { SafeBrowsingResult } from '../types';
import { getScamSnifferConfig } from '../config';

const SAFE_BROWSING_API_BASE = 'https://safebrowsing.googleapis.com/v4';
const CLIENT_ID = 'project-argus';
const CLIENT_VERSION = '1.0.0';

// ─── Cache ───────────────────────────────────────────────────────────────────

interface CacheEntry {
  result: SafeBrowsingResult;
  timestamp: number;
}

const urlCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function getCachedResult(url: string): SafeBrowsingResult | undefined {
  const entry = urlCache.get(url);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.result;
  }
  urlCache.delete(url);
  return undefined;
}

function setCachedResult(url: string, result: SafeBrowsingResult): void {
  urlCache.set(url, { result, timestamp: Date.now() });

  // Evict old entries
  if (urlCache.size > 2000) {
    const now = Date.now();
    for (const [key, entry] of urlCache.entries()) {
      if (now - entry.timestamp > CACHE_TTL_MS) {
        urlCache.delete(key);
      }
    }
  }
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Checks a URL against Google Safe Browsing.
 * Returns threat information if the URL is flagged.
 */
export async function checkUrlSafeBrowsing(url: string): Promise<SafeBrowsingResult> {
  const cached = getCachedResult(url);
  if (cached) return cached;

  const config = getScamSnifferConfig();
  const apiKey = config.apiKeys.safeBrowsing;

  if (!apiKey) {
    return {
      isAvailable: false,
      isMalicious: false,
      threatTypes: [],
    };
  }

  try {
    const requestBody = {
      client: {
        clientId: CLIENT_ID,
        clientVersion: CLIENT_VERSION,
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION',
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }],
      },
    };

    const response = await fetch(
      `${SAFE_BROWSING_API_BASE}/threatMatches:find?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (response.status === 401 || response.status === 403) {
      const result: SafeBrowsingResult = {
        isAvailable: false,
        isMalicious: false,
        threatTypes: [],
      };
      return result;
    }

    if (response.status === 429) {
      return {
        isAvailable: false,
        isMalicious: false,
        threatTypes: [],
      };
    }

    if (!response.ok) {
      throw new Error(`Safe Browsing API returned ${response.status}`);
    }

    const data = await response.json();
    const matches = data.matches || [];
    const isMalicious = matches.length > 0;
    const threatTypes = [...new Set(matches.map((m: any) => m.threatType))] as string[];

    const result: SafeBrowsingResult = {
      isAvailable: true,
      isMalicious,
      threatTypes,
    };

    setCachedResult(url, result);
    return result;
  } catch (error) {
    console.error('[Argus/ScamSniffer] Safe Browsing API error:', error);
    return {
      isAvailable: false,
      isMalicious: false,
      threatTypes: [],
    };
  }
}

/**
 * Batch check multiple URLs. The Safe Browsing API supports multiple URLs
 * in a single request, so we batch them.
 */
export async function batchCheckUrls(urls: string[]): Promise<Map<string, SafeBrowsingResult>> {
  const results = new Map<string, SafeBrowsingResult>();
  const uncachedUrls: string[] = [];

  // Check cache first
  for (const url of urls) {
    const cached = getCachedResult(url);
    if (cached) {
      results.set(url, cached);
    } else {
      uncachedUrls.push(url);
    }
  }

  if (uncachedUrls.length === 0) return results;

  const config = getScamSnifferConfig();
  const apiKey = config.apiKeys.safeBrowsing;

  if (!apiKey) {
    for (const url of uncachedUrls) {
      results.set(url, { isAvailable: false, isMalicious: false, threatTypes: [] });
    }
    return results;
  }

  try {
    const requestBody = {
      client: {
        clientId: CLIENT_ID,
        clientVersion: CLIENT_VERSION,
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION',
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: uncachedUrls.map((url) => ({ url })),
      },
    };

    const response = await fetch(
      `${SAFE_BROWSING_API_BASE}/threatMatches:find?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      // Mark all as unavailable
      for (const url of uncachedUrls) {
        results.set(url, { isAvailable: false, isMalicious: false, threatTypes: [] });
      }
      return results;
    }

    const data = await response.json();
    const matches = data.matches || [];

    // Build a map of flagged URLs
    const flaggedUrls = new Map<string, string[]>();
    for (const match of matches) {
      const matchUrl = match.threat?.url;
      if (matchUrl) {
        const existing = flaggedUrls.get(matchUrl) || [];
        existing.push(match.threatType);
        flaggedUrls.set(matchUrl, existing);
      }
    }

    // Set results for all uncached URLs
    for (const url of uncachedUrls) {
      const threatTypes = flaggedUrls.get(url) || [];
      const result: SafeBrowsingResult = {
        isAvailable: true,
        isMalicious: threatTypes.length > 0,
        threatTypes,
      };
      setCachedResult(url, result);
      results.set(url, result);
    }
  } catch (error) {
    console.error('[Argus/ScamSniffer] Safe Browsing batch check error:', error);
    for (const url of uncachedUrls) {
      results.set(url, { isAvailable: false, isMalicious: false, threatTypes: [] });
    }
  }

  return results;
}

/**
 * Returns a human-readable label for a Safe Browsing threat type.
 */
export function getThreatTypeLabel(threatType: string): string {
  const labels: Record<string, string> = {
    MALWARE: 'Malware',
    SOCIAL_ENGINEERING: 'Phishing / Social Engineering',
    UNWANTED_SOFTWARE: 'Unwanted Software',
    POTENTIALLY_HARMFUL_APPLICATION: 'Potentially Harmful App',
  };
  return labels[threatType] || threatType;
}

export function clearSafeBrowsingCache(): void {
  urlCache.clear();
}
