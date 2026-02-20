/**
 * Project Argus — Bot Minions: Rate Limiter
 * Conservative rate limiting with jitter to avoid Telegram FloodWaitError.
 * Uses a token-bucket approach with exponential backoff on errors.
 */

import type { RateLimiterConfig } from '../types';

const DEFAULT_CONFIG: RateLimiterConfig = {
  minDelayMs: 2000,
  maxDelayMs: 5000,
  maxConcurrent: 1,
  backoffMultiplier: 2,
  maxBackoffMs: 300000, // 5 minutes
};

export class RateLimiter {
  private config: RateLimiterConfig;

  private lastCallTime: number = 0;

  private currentBackoff: number = 0;

  private activeCount: number = 0;

  private queue: Array<{
    resolve: (value: void) => void;
    reject: (reason: unknown) => void;
  }> = [];

  private floodWaitUntil: number = 0;

  constructor(config?: Partial<RateLimiterConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Generate a random delay with jitter between min and max
   */
  private getJitteredDelay(): number {
    const { minDelayMs, maxDelayMs } = this.config;
    const base = minDelayMs + this.currentBackoff;
    const jitter = Math.random() * (maxDelayMs - minDelayMs);
    return Math.min(base + jitter, this.config.maxBackoffMs);
  }

  /**
   * Wait for rate limit clearance before making an API call
   */
  async acquire(): Promise<void> {
    // Check flood wait
    const now = Date.now();
    if (this.floodWaitUntil > now) {
      const waitTime = this.floodWaitUntil - now;
      console.log(`[Argus:RateLimiter] FloodWait active, waiting ${waitTime}ms`);
      await this.sleep(waitTime);
    }

    // Check concurrent limit
    if (this.activeCount >= this.config.maxConcurrent) {
      await new Promise<void>((resolve, reject) => {
        this.queue.push({ resolve, reject });
      });
    }

    // Enforce minimum delay between calls
    const elapsed = Date.now() - this.lastCallTime;
    const requiredDelay = this.getJitteredDelay();
    if (elapsed < requiredDelay) {
      await this.sleep(requiredDelay - elapsed);
    }

    this.activeCount++;
    this.lastCallTime = Date.now();
  }

  /**
   * Release the rate limiter after an API call completes
   */
  release(): void {
    this.activeCount = Math.max(0, this.activeCount - 1);
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next?.resolve();
    }
  }

  /**
   * Report a successful API call (reduces backoff)
   */
  reportSuccess(): void {
    this.currentBackoff = Math.max(0, this.currentBackoff - 500);
  }

  /**
   * Report a FloodWaitError with the wait time from Telegram
   */
  reportFloodWait(waitSeconds: number): void {
    const waitMs = (waitSeconds + 5) * 1000; // Add 5s safety margin
    this.floodWaitUntil = Date.now() + waitMs;
    this.currentBackoff = Math.min(
      this.currentBackoff * this.config.backoffMultiplier + waitMs,
      this.config.maxBackoffMs,
    );
    console.warn(`[Argus:RateLimiter] FloodWait: ${waitSeconds}s, backoff now ${this.currentBackoff}ms`);
  }

  /**
   * Report a generic error (increases backoff)
   */
  reportError(): void {
    this.currentBackoff = Math.min(
      Math.max(this.currentBackoff, this.config.minDelayMs) * this.config.backoffMultiplier,
      this.config.maxBackoffMs,
    );
  }

  /**
   * Execute an async function with rate limiting
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      const result = await fn();
      this.reportSuccess();
      return result;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'seconds' in error) {
        this.reportFloodWait((error as { seconds: number }).seconds);
      } else {
        this.reportError();
      }
      throw error;
    } finally {
      this.release();
    }
  }

  /**
   * Get current rate limiter status
   */
  getStatus(): {
    activeCount: number;
    queueLength: number;
    currentBackoff: number;
    isFloodWaiting: boolean;
    floodWaitRemaining: number;
  } {
    const now = Date.now();
    return {
      activeCount: this.activeCount,
      queueLength: this.queue.length,
      currentBackoff: this.currentBackoff,
      isFloodWaiting: this.floodWaitUntil > now,
      floodWaitRemaining: Math.max(0, this.floodWaitUntil - now),
    };
  }

  /**
   * Reset the rate limiter state
   */
  reset(): void {
    this.currentBackoff = 0;
    this.floodWaitUntil = 0;
    this.activeCount = 0;
    this.queue.forEach(({ reject }) => reject(new Error('Rate limiter reset')));
    this.queue = [];
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => { setTimeout(resolve, ms); });
  }
}

/** Shared global rate limiter instance for all minions */
let globalLimiter: RateLimiter | undefined;

export function getGlobalRateLimiter(): RateLimiter {
  if (!globalLimiter) {
    globalLimiter = new RateLimiter({
      minDelayMs: 3000,
      maxDelayMs: 7000,
      maxConcurrent: 1,
      backoffMultiplier: 2.5,
      maxBackoffMs: 600000, // 10 minutes max
    });
  }
  return globalLimiter;
}
