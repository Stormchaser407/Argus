/**
 * Project Argus — Scam Sniffer: Configuration
 * Manages runtime configuration and API key loading.
 * API keys are loaded from environment variables (set via .env).
 *
 * Environment Variables:
 *   ARGUS_CHAINABUSE_API_KEY   — Chainabuse API key
 *   ARGUS_SAFE_BROWSING_API_KEY — Google Safe Browsing API key
 *   ARGUS_VIRUSTOTAL_API_KEY    — VirusTotal API key
 */

import type { ScamSnifferConfig } from './types';
import { DEFAULT_CONFIG } from './types';

// ─── Runtime Config ──────────────────────────────────────────────────────────

let currentConfig: ScamSnifferConfig = { ...DEFAULT_CONFIG };

// ─── Local Storage Key ───────────────────────────────────────────────────────

const STORAGE_KEY = 'argus-scam-sniffer-config';

/**
 * Initializes the Scam Sniffer configuration.
 * Loads API keys from environment variables and user preferences from localStorage.
 */
export function initScamSnifferConfig(): void {
  // Load API keys from environment variables (injected at build time via webpack)
  const envConfig: Partial<ScamSnifferConfig> = {
    apiKeys: {
      chainabuse: getEnvVar('ARGUS_CHAINABUSE_API_KEY'),
      safeBrowsing: getEnvVar('ARGUS_SAFE_BROWSING_API_KEY'),
      virusTotal: getEnvVar('ARGUS_VIRUSTOTAL_API_KEY'),
    },
  };

  // Load user preferences from localStorage
  const savedConfig = loadConfigFromStorage();

  // Merge: defaults < saved preferences < env vars (env always wins for API keys)
  currentConfig = {
    ...DEFAULT_CONFIG,
    ...savedConfig,
    apiKeys: {
      ...DEFAULT_CONFIG.apiKeys,
      ...savedConfig?.apiKeys,
      ...envConfig.apiKeys, // Env vars take precedence
    },
  };

  logConfigStatus();
}

/**
 * Gets the current Scam Sniffer configuration.
 */
export function getScamSnifferConfig(): ScamSnifferConfig {
  return currentConfig;
}

/**
 * Updates the Scam Sniffer configuration.
 * Persists user preferences to localStorage (but not API keys).
 */
export function updateScamSnifferConfig(updates: Partial<ScamSnifferConfig>): void {
  currentConfig = {
    ...currentConfig,
    ...updates,
    // Don't allow overwriting API keys from UI — they come from env only
    apiKeys: currentConfig.apiKeys,
  };

  saveConfigToStorage(currentConfig);
}

/**
 * Checks if a specific API is configured (has a key).
 */
export function isApiConfigured(api: 'chainabuse' | 'safeBrowsing' | 'virusTotal'): boolean {
  return !!currentConfig.apiKeys[api];
}

/**
 * Returns a summary of which APIs are configured.
 */
export function getApiStatus(): Record<string, boolean> {
  return {
    chainabuse: !!currentConfig.apiKeys.chainabuse,
    safeBrowsing: !!currentConfig.apiKeys.safeBrowsing,
    virusTotal: !!currentConfig.apiKeys.virusTotal,
    domainAge: true, // RDAP doesn't need an API key
  };
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

/**
 * Safely reads an environment variable.
 * Returns undefined if not set or empty.
 */
function getEnvVar(name: string): string | undefined {
  try {
    // In webpack builds, process.env vars are replaced at compile time
    const value = (process.env as any)[name];
    return value && value !== 'undefined' && value !== '' ? value : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Loads config from localStorage.
 */
function loadConfigFromStorage(): Partial<ScamSnifferConfig> | undefined {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[Argus/ScamSniffer] Failed to load config from storage:', e);
  }
  return undefined;
}

/**
 * Saves config to localStorage (excluding API keys for security).
 */
function saveConfigToStorage(config: ScamSnifferConfig): void {
  try {
    // Strip API keys before saving to localStorage
    const safeConfig = {
      ...config,
      apiKeys: {
        chainabuse: undefined,
        safeBrowsing: undefined,
        virusTotal: undefined,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeConfig));
  } catch (e) {
    console.warn('[Argus/ScamSniffer] Failed to save config to storage:', e);
  }
}

/**
 * Logs the configuration status to console.
 */
function logConfigStatus(): void {
  const status = getApiStatus();
  const configuredApis = Object.entries(status)
    .filter(([, v]) => v)
    .map(([k]) => k);
  const unconfiguredApis = Object.entries(status)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  console.log('[Argus/ScamSniffer] Configuration loaded:');
  console.log(`  Configured APIs: ${configuredApis.join(', ') || 'none'}`);
  if (unconfiguredApis.length > 0) {
    console.log(`  Unconfigured APIs: ${unconfiguredApis.join(', ')} (will degrade gracefully)`);
  }
  console.log(`  Enabled: ${currentConfig.enabled}`);
  console.log(`  Sensitivity: ${currentConfig.patternMatching.sensitivity}`);
}
