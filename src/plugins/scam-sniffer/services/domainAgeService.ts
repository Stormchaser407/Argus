/**
 * Project Argus — Scam Sniffer: Domain Age Service
 * Checks domain registration age using RDAP (Registration Data Access Protocol).
 *
 * RDAP is the IETF-standard successor to WHOIS, providing structured JSON responses.
 * No API key required — uses public RDAP bootstrap servers.
 */

import type { DomainAgeResult } from '../types';
import { getScamSnifferConfig } from '../config';

// RDAP bootstrap URL — automatically routes to the correct registrar's RDAP server
const RDAP_BOOTSTRAP_URL = 'https://rdap.org/domain/';

// ─── Cache ───────────────────────────────────────────────────────────────────

interface CacheEntry {
  result: DomainAgeResult;
  timestamp: number;
}

const domainCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour (domain age doesn't change often)

function getCachedResult(domain: string): DomainAgeResult | undefined {
  const entry = domainCache.get(domain);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.result;
  }
  domainCache.delete(domain);
  return undefined;
}

function setCachedResult(domain: string, result: DomainAgeResult): void {
  domainCache.set(domain, { result, timestamp: Date.now() });

  if (domainCache.size > 1000) {
    const now = Date.now();
    for (const [key, entry] of domainCache.entries()) {
      if (now - entry.timestamp > CACHE_TTL_MS) {
        domainCache.delete(key);
      }
    }
  }
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Extracts the registrable domain (e.g., "example.com" from "sub.example.com").
 */
function getRegistrableDomain(domain: string): string {
  const parts = domain.toLowerCase().split('.');
  // Handle common multi-part TLDs
  const multiPartTLDs = ['co.uk', 'com.au', 'co.jp', 'co.kr', 'com.br', 'co.nz', 'co.za'];
  const lastTwo = parts.slice(-2).join('.');
  if (multiPartTLDs.includes(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

/**
 * Checks the age of a domain using RDAP.
 */
export async function checkDomainAge(domain: string): Promise<DomainAgeResult> {
  const registrableDomain = getRegistrableDomain(domain);

  const cached = getCachedResult(registrableDomain);
  if (cached) return cached;

  try {
    const response = await fetch(`${RDAP_BOOTSTRAP_URL}${registrableDomain}`, {
      method: 'GET',
      headers: { 'Accept': 'application/rdap+json, application/json' },
    });

    if (!response.ok) {
      // Many TLDs don't support RDAP yet
      const result: DomainAgeResult = {
        isAvailable: false,
        isNewDomain: false,
      };
      setCachedResult(registrableDomain, result);
      return result;
    }

    const data = await response.json();
    const registrationDate = extractRegistrationDate(data);

    if (!registrationDate) {
      const result: DomainAgeResult = {
        isAvailable: true,
        isNewDomain: false,
      };
      setCachedResult(registrableDomain, result);
      return result;
    }

    const regDate = new Date(registrationDate);
    const ageDays = Math.floor((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24));
    const config = getScamSnifferConfig();
    const threshold = config.phishingDetection.domainAgeThresholdDays;

    const result: DomainAgeResult = {
      isAvailable: true,
      isNewDomain: ageDays < threshold,
      registrationDate: regDate.toISOString(),
      ageDays,
    };

    setCachedResult(registrableDomain, result);
    return result;
  } catch (error) {
    console.error('[Argus/ScamSniffer] Domain age check error:', error);
    const result: DomainAgeResult = {
      isAvailable: false,
      isNewDomain: false,
    };
    setCachedResult(registrableDomain, result);
    return result;
  }
}

/**
 * Extracts the registration date from an RDAP response.
 * RDAP uses the "events" array with eventAction "registration".
 */
function extractRegistrationDate(data: any): string | undefined {
  if (!data.events || !Array.isArray(data.events)) return undefined;

  // Look for the registration event
  const registrationEvent = data.events.find(
    (e: any) => e.eventAction === 'registration',
  );

  if (registrationEvent?.eventDate) {
    return registrationEvent.eventDate;
  }

  // Fallback: look for the earliest event date
  const dates = data.events
    .map((e: any) => e.eventDate)
    .filter(Boolean)
    .map((d: string) => new Date(d))
    .filter((d: Date) => !isNaN(d.getTime()))
    .sort((a: Date, b: Date) => a.getTime() - b.getTime());

  return dates.length > 0 ? dates[0].toISOString() : undefined;
}

/**
 * Formats domain age for display.
 */
export function formatDomainAge(ageDays: number): string {
  if (ageDays < 1) return 'Less than a day';
  if (ageDays < 7) return `${ageDays} day${ageDays === 1 ? '' : 's'}`;
  if (ageDays < 30) {
    const weeks = Math.floor(ageDays / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'}`;
  }
  if (ageDays < 365) {
    const months = Math.floor(ageDays / 30);
    return `${months} month${months === 1 ? '' : 's'}`;
  }
  const years = Math.floor(ageDays / 365);
  const remainingMonths = Math.floor((ageDays % 365) / 30);
  if (remainingMonths > 0) {
    return `${years} year${years === 1 ? '' : 's'}, ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`;
  }
  return `${years} year${years === 1 ? '' : 's'}`;
}

export function clearDomainAgeCache(): void {
  domainCache.clear();
}
