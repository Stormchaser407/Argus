/**
 * Project Argus — Scam Sniffer Types
 * Core type definitions for the Scam Sniffer module.
 */

// ─── Threat Levels ───────────────────────────────────────────────────────────

export enum ThreatLevel {
  SAFE = 'safe',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertAction {
  WARNING = 'warning',
  DANGER = 'danger',
  BLOCK = 'block',
}

// ─── Crypto Wallet Types ─────────────────────────────────────────────────────

export enum CryptoChain {
  BTC = 'BTC',
  ETH = 'ETH',
  TRC20 = 'TRC20',
  SOL = 'SOL',
  LTC = 'LTC',
  XRP = 'XRP',
  DOGE = 'DOGE',
  BCH = 'BCH',
  BNB = 'BNB',
  MATIC = 'MATIC',
  ADA = 'ADA',
  DOT = 'DOT',
  AVAX = 'AVAX',
  UNKNOWN = 'UNKNOWN',
}

export interface DetectedWallet {
  address: string;
  chain: CryptoChain;
  startIndex: number;
  endIndex: number;
}

export interface WalletCheckResult {
  address: string;
  chain: CryptoChain;
  isFlagged: boolean;
  reportCount: number;
  riskScore: number; // 0-100
  categories: string[];
  lastReportDate?: string;
  source: 'chainabuse' | 'local' | 'unchecked';
  error?: string;
}

// ─── Phishing / Link Types ───────────────────────────────────────────────────

export interface DetectedLink {
  url: string;
  domain: string;
  startIndex: number;
  endIndex: number;
}

export interface LinkCheckResult {
  url: string;
  domain: string;
  isMalicious: boolean;
  threatLevel: ThreatLevel;
  checks: {
    safeBrowsing?: SafeBrowsingResult;
    virusTotal?: VirusTotalResult;
    typosquatting?: TyposquattingResult;
    domainAge?: DomainAgeResult;
  };
  error?: string;
}

export interface SafeBrowsingResult {
  isAvailable: boolean;
  isMalicious: boolean;
  threatTypes: string[];
}

export interface VirusTotalResult {
  isAvailable: boolean;
  isMalicious: boolean;
  positives: number;
  total: number;
  scanDate?: string;
}

export interface TyposquattingResult {
  isTyposquat: boolean;
  targetDomain?: string;
  similarity: number; // 0-1
  technique?: string;
}

export interface DomainAgeResult {
  isAvailable: boolean;
  isNewDomain: boolean;
  registrationDate?: string;
  ageDays?: number;
}

// ─── Account Behavior Types ──────────────────────────────────────────────────

export interface AccountRiskProfile {
  peerId: string;
  trustScore: number; // 0-100, higher = more trusted
  riskFactors: RiskFactor[];
  lastUpdated: number;
  scannedMessageCount: number;
}

export interface RiskFactor {
  id: string;
  category: RiskCategory;
  description: string;
  weight: number; // -1 to 1 (negative = suspicious, positive = trustworthy)
  evidence?: string;
}

export enum RiskCategory {
  ACCOUNT_AGE = 'account_age',
  USERNAME_PATTERN = 'username_pattern',
  MESSAGE_PATTERN = 'message_pattern',
  FORWARDING_PATTERN = 'forwarding_pattern',
  LINK_BEHAVIOR = 'link_behavior',
  WALLET_BEHAVIOR = 'wallet_behavior',
  SCAM_LANGUAGE = 'scam_language',
}

// ─── Scam Pattern Types ─────────────────────────────────────────────────────

export enum ScamCategory {
  PIG_BUTCHERING = 'pig_butchering',
  FAKE_ADMIN = 'fake_admin',
  CRYPTO_GIVEAWAY = 'crypto_giveaway',
  FAKE_JOB = 'fake_job',
  CLONE_CHANNEL = 'clone_channel',
  INVESTMENT_FRAUD = 'investment_fraud',
  ROMANCE_SCAM = 'romance_scam',
  PHISHING = 'phishing',
  ADVANCE_FEE = 'advance_fee',
  IMPERSONATION = 'impersonation',
  PUMP_AND_DUMP = 'pump_and_dump',
  FAKE_SUPPORT = 'fake_support',
}

export interface ScamPattern {
  id: string;
  category: ScamCategory;
  name: string;
  description: string;
  regexPatterns: RegExp[];
  keywordSets: string[][];
  alertLevel: AlertAction;
  minConfidence: number; // 0-1
}

export interface ScamPatternMatch {
  patternId: string;
  category: ScamCategory;
  name: string;
  confidence: number;
  matchedText: string;
  alertLevel: AlertAction;
  timestamp: number;
}

// ─── Message Scan Result ─────────────────────────────────────────────────────

export interface MessageScanResult {
  messageId: number;
  chatId: string;
  timestamp: number;
  wallets: WalletCheckResult[];
  links: LinkCheckResult[];
  patternMatches: ScamPatternMatch[];
  overallThreatLevel: ThreatLevel;
  senderId?: string;
}

// ─── Dashboard / Threat Log Types ────────────────────────────────────────────

export interface ThreatLogEntry {
  id: string;
  timestamp: number;
  chatId: string;
  chatTitle?: string;
  messageId: number;
  senderId?: string;
  senderName?: string;
  type: 'wallet' | 'link' | 'pattern' | 'behavior';
  threatLevel: ThreatLevel;
  summary: string;
  details: WalletCheckResult | LinkCheckResult | ScamPatternMatch | AccountRiskProfile;
  isFalsePositive: boolean;
}

export interface ScamSnifferStats {
  totalThreatsDetected: number;
  walletsScanned: number;
  walletsFlagged: number;
  linksScanned: number;
  linksFlagged: number;
  patternsMatched: number;
  accountsScored: number;
  falsePositivesReported: number;
  lastScanTimestamp: number;
}

// ─── Configuration ───────────────────────────────────────────────────────────

export interface ScamSnifferConfig {
  enabled: boolean;
  walletDetection: {
    enabled: boolean;
    chains: CryptoChain[];
    autoCheck: boolean;
  };
  phishingDetection: {
    enabled: boolean;
    checkSafeBrowsing: boolean;
    checkVirusTotal: boolean;
    checkTyposquatting: boolean;
    checkDomainAge: boolean;
    domainAgeThresholdDays: number;
  };
  behaviorScoring: {
    enabled: boolean;
    newAccountThresholdDays: number;
  };
  patternMatching: {
    enabled: boolean;
    alertLevel: AlertAction;
    sensitivity: 'low' | 'medium' | 'high';
  };
  apiKeys: {
    chainabuse: string | undefined;
    safeBrowsing: string | undefined;
    virusTotal: string | undefined;
  };
}

export const DEFAULT_CONFIG: ScamSnifferConfig = {
  enabled: true,
  walletDetection: {
    enabled: true,
    chains: Object.values(CryptoChain).filter((c) => c !== CryptoChain.UNKNOWN),
    autoCheck: true,
  },
  phishingDetection: {
    enabled: true,
    checkSafeBrowsing: true,
    checkVirusTotal: true,
    checkTyposquatting: true,
    checkDomainAge: true,
    domainAgeThresholdDays: 30,
  },
  behaviorScoring: {
    enabled: true,
    newAccountThresholdDays: 30,
  },
  patternMatching: {
    enabled: true,
    alertLevel: AlertAction.WARNING,
    sensitivity: 'medium',
  },
  apiKeys: {
    chainabuse: undefined,
    safeBrowsing: undefined,
    virusTotal: undefined,
  },
};
