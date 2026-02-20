/**
 * Project Argus — Scam Sniffer Plugin
 * Phase 1B: Real-time threat detection module.
 *
 * Features:
 * 1. Crypto Wallet Detection & Checking (Chainabuse API)
 * 2. Phishing Link Detection (Google Safe Browsing, VirusTotal, typosquatting, domain age)
 * 3. Account Behavior Scoring (trust score badges)
 * 4. Known Scam Pattern Matching (regex + keyword engine)
 * 5. Scam Sniffer Dashboard (threat log, stats, settings)
 *
 * API keys are loaded from environment variables:
 *   ARGUS_CHAINABUSE_API_KEY
 *   ARGUS_SAFE_BROWSING_API_KEY
 *   ARGUS_VIRUSTOTAL_API_KEY
 *
 * All APIs degrade gracefully when keys are not provided.
 */

import { registerPlugin } from '../index';
import type { ArgusPlugin } from '../index';
import { initScamSnifferConfig, getApiStatus } from './config';
import { getPatternCount } from './patterns/scamPatterns';

const ScamSniffer: ArgusPlugin = {
  id: 'scam-sniffer',
  name: 'Scam Sniffer',
  version: '1.0.0',
  init: () => {
    console.log('[Argus] Scam Sniffer v1.0.0 — Initializing...');

    // Initialize configuration (loads API keys from env, preferences from localStorage)
    initScamSnifferConfig();

    // Log status
    const apiStatus = getApiStatus();
    const patternCount = getPatternCount();

    console.log(`[Argus] Scam Sniffer — ${patternCount} scam patterns loaded`);
    console.log('[Argus] Scam Sniffer — API Status:', apiStatus);
    console.log('[Argus] Scam Sniffer — Ready. Monitoring messages for threats.');
  },
};

registerPlugin(ScamSniffer);

// ─── Public API Exports ──────────────────────────────────────────────────────

// Types
export type {
  MessageScanResult,
  WalletCheckResult,
  LinkCheckResult,
  ScamPatternMatch,
  AccountRiskProfile,
  ThreatLogEntry,
  ScamSnifferStats,
  ScamSnifferConfig,
} from './types';

export {
  ThreatLevel,
  CryptoChain,
  AlertAction,
  ScamCategory,
  RiskCategory,
} from './types';

// Services
export { scanMessage, getThreatLog, getStats, reportFalsePositive } from './services/messageScannerService';
export { checkWalletChainabuse } from './services/chainabuseService';
export { analyzeLink } from './services/linkAnalysisService';
export { scanMessageForPatterns } from './services/patternMatchingService';
export { scoreAccount, getAccountProfile, getTrustScoreDisplay } from './services/behaviorScoringService';

// Utils
export { detectWallets, getChainLabel, truncateAddress } from './utils/walletDetector';
export { detectLinks, checkTyposquatting, extractDomain } from './utils/linkDetector';

// Hooks
export { useMessageScan, useTrustScore } from './hooks/useMessageScan';

// Components
export {
  WalletWarning,
  LinkWarning,
  TrustBadge,
  MessageScanIndicator,
  PatternMatchWarning,
  ScamSnifferDashboard,
} from './components';

// Config
export { getScamSnifferConfig, updateScamSnifferConfig, isApiConfigured, getApiStatus } from './config';

export default ScamSniffer;
