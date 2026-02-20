/**
 * Project Argus — Bot Minions: Utility Helpers
 * ID generation, text similarity, and common utilities.
 */

/**
 * Generate a unique minion ID
 */
export function generateMinionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `minion-${timestamp}-${random}`;
}

/**
 * Generate a unique alert ID
 */
export function generateAlertId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `alert-${timestamp}-${random}`;
}

/**
 * Generate a unique log entry ID
 */
export function generateLogId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `log-${timestamp}-${random}`;
}

/**
 * Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Normalized string similarity (0 = completely different, 1 = identical)
 */
export function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;

  const lowerA = a.toLowerCase().trim();
  const lowerB = b.toLowerCase().trim();

  if (lowerA === lowerB) return 1;

  const maxLen = Math.max(lowerA.length, lowerB.length);
  if (maxLen === 0) return 1;

  const distance = levenshteinDistance(lowerA, lowerB);
  return 1 - distance / maxLen;
}

/**
 * Check if a string matches any keyword (case-insensitive)
 */
export function matchesKeywords(text: string, keywords: string[]): string[] {
  const lowerText = text.toLowerCase();
  return keywords.filter((keyword) => lowerText.includes(keyword.toLowerCase()));
}

/**
 * Check if a string matches any regex pattern
 */
export function matchesRegexPatterns(text: string, patterns: string[]): Array<{ pattern: string; matches: string[] }> {
  const results: Array<{ pattern: string; matches: string[] }> = [];

  for (const pattern of patterns) {
    try {
      const regex = new RegExp(pattern, 'gi');
      const matches = text.match(regex);
      if (matches) {
        results.push({ pattern, matches: Array.from(matches) });
      }
    } catch (e) {
      console.warn(`[Argus:Minions] Invalid regex pattern: ${pattern}`, e);
    }
  }

  return results;
}

/**
 * Estimate account age in days from a Telegram user ID.
 * This is a rough heuristic based on known ID ranges and registration dates.
 */
export function estimateAccountAgeDays(userId: string): number {
  const id = parseInt(userId, 10);
  if (Number.isNaN(id)) return -1;

  // Known anchor points (approximate):
  // ID ~100000000 ≈ 2013
  // ID ~500000000 ≈ 2016
  // ID ~1000000000 ≈ 2018
  // ID ~5000000000 ≈ 2022
  // ID ~7000000000 ≈ 2024

  const now = Date.now();
  let estimatedRegDate: number;

  if (id < 100000000) {
    estimatedRegDate = new Date('2013-01-01').getTime();
  } else if (id < 500000000) {
    const ratio = (id - 100000000) / 400000000;
    estimatedRegDate = new Date('2013-01-01').getTime() + ratio * (new Date('2016-01-01').getTime() - new Date('2013-01-01').getTime());
  } else if (id < 1000000000) {
    const ratio = (id - 500000000) / 500000000;
    estimatedRegDate = new Date('2016-01-01').getTime() + ratio * (new Date('2018-01-01').getTime() - new Date('2016-01-01').getTime());
  } else if (id < 5000000000) {
    const ratio = (id - 1000000000) / 4000000000;
    estimatedRegDate = new Date('2018-01-01').getTime() + ratio * (new Date('2022-01-01').getTime() - new Date('2018-01-01').getTime());
  } else {
    const ratio = Math.min((id - 5000000000) / 3000000000, 1);
    estimatedRegDate = new Date('2022-01-01').getTime() + ratio * (now - new Date('2022-01-01').getTime());
  }

  return Math.max(0, Math.floor((now - estimatedRegDate) / (24 * 60 * 60 * 1000)));
}

/**
 * Check if a username matches suspicious patterns
 */
export function isSuspiciousUsername(username: string, patterns: string[]): boolean {
  if (!username) return false;

  for (const pattern of patterns) {
    try {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(username)) return true;
    } catch (e) {
      // Invalid regex, skip
    }
  }

  // Built-in heuristics
  const suspicious = [
    /^[a-z]{2,3}\d{6,}$/i, // Short prefix + many numbers (e.g., ab123456)
    /^user\d+$/i, // Generic "user" + numbers
    /^[a-z]\d{8,}$/i, // Single letter + many numbers
    /^temp_/i, // Temp prefix
    /^test_/i, // Test prefix
  ];

  return suspicious.some((regex) => regex.test(username));
}

/**
 * Format a timestamp for display
 */
export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}

/**
 * Format milliseconds as human-readable duration
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLen: number = 200): string {
  if (str.length <= maxLen) return str;
  return `${str.substring(0, maxLen)}...`;
}
