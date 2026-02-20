/**
 * Project Argus — Evidence Hashing & Chain-of-Custody
 * SHA-256 hashing for evidence integrity and chain-of-custody logging.
 */

import type { CustodyAction, CustodyLogEntry } from '../types';

/**
 * Compute SHA-256 hash of a string using the Web Crypto API.
 */
export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compute SHA-256 hash of an ArrayBuffer (for media files).
 */
export async function sha256Buffer(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compute SHA-256 hash of a Blob.
 */
export async function sha256Blob(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  return sha256Buffer(buffer);
}

/**
 * Create a chain-of-custody log entry.
 * Each entry includes the hash of the current state and a reference to the previous hash,
 * forming an immutable chain.
 */
export async function createCustodyLogEntry(params: {
  action: CustodyAction;
  actor: string;
  details: string;
  itemData: string;
  previousHash?: string;
}): Promise<CustodyLogEntry> {
  const { action, actor, details, itemData, previousHash } = params;
  const timestamp = Math.floor(Date.now() / 1000);

  // Hash includes: timestamp + action + actor + item data + previous hash
  const hashInput = [
    String(timestamp),
    action,
    actor,
    itemData,
    previousHash || 'GENESIS',
  ].join('|');

  const itemHash = await sha256(hashInput);

  return {
    timestamp,
    action,
    actor,
    details,
    itemHash,
    previousHash,
  };
}

/**
 * Verify the integrity of a chain-of-custody log.
 * Returns true if the chain is valid (each entry references the previous hash correctly).
 */
export function verifyCustodyChain(chain: CustodyLogEntry[]): {
  isValid: boolean;
  brokenAt?: number;
} {
  if (chain.length === 0) return { isValid: true };

  // First entry should have no previous hash
  if (chain[0].previousHash) {
    return { isValid: false, brokenAt: 0 };
  }

  // Each subsequent entry should reference the previous entry's hash
  for (let i = 1; i < chain.length; i++) {
    if (chain[i].previousHash !== chain[i - 1].itemHash) {
      return { isValid: false, brokenAt: i };
    }
  }

  return { isValid: true };
}

/**
 * Format a hash for display (truncated with ellipsis).
 */
export function formatHash(hash: string, length = 12): string {
  if (hash.length <= length) return hash;
  return `${hash.substring(0, length)}...`;
}

/**
 * Format a timestamp for forensic display (ISO 8601 with timezone).
 */
export function formatForensicTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString();
}
