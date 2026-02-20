/**
 * Project Argus — Bot Minions Framework Types
 * Type definitions for persistent background monitoring agents.
 */

// ─── Minion Core Types ───────────────────────────────────────────

export type MinionType =
  | 'keyword-monitor'
  | 'new-member-alert'
  | 'channel-clone-detector'
  | 'media-monitor';

export type MinionStatus = 'running' | 'paused' | 'stopped' | 'error' | 'starting';

export type AlertPriority = 'info' | 'warning' | 'critical';

export type AlertType =
  | 'keyword-match'
  | 'new-member'
  | 'watchlist-hit'
  | 'risk-account'
  | 'channel-clone'
  | 'media-captured'
  | 'media-analysis-hook'
  | 'minion-error';

// ─── Minion Configuration ────────────────────────────────────────

export interface MinionConfig {
  id: string;
  name: string;
  type: MinionType;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
  /** Target chat IDs to monitor */
  targetChatIds: string[];
  /** Polling interval in milliseconds (minimum 30000 = 30s) */
  pollIntervalMs: number;
  /** Type-specific configuration */
  typeConfig: KeywordMonitorConfig | NewMemberAlertConfig | ChannelCloneDetectorConfig | MediaMonitorConfig;
}

export interface KeywordMonitorConfig {
  type: 'keyword-monitor';
  /** Plain text keywords (case-insensitive) */
  keywords: string[];
  /** Regex patterns (stored as strings, compiled at runtime) */
  regexPatterns: string[];
  /** Whether to archive matched messages automatically */
  autoArchive: boolean;
  /** Alert priority for matches */
  alertPriority: AlertPriority;
  /** Context: number of messages before/after to capture */
  contextMessages: number;
}

export interface NewMemberAlertConfig {
  type: 'new-member-alert';
  /** User IDs on the watchlist */
  watchlistUserIds: string[];
  /** Flag accounts newer than this many days */
  newAccountThresholdDays: number;
  /** Suspicious username patterns (regex strings) */
  suspiciousUsernamePatterns: string[];
  /** Whether to auto-profile new members */
  autoProfile: boolean;
  /** Alert priority for watchlist hits */
  watchlistAlertPriority: AlertPriority;
  /** Alert priority for risk-flagged accounts */
  riskAlertPriority: AlertPriority;
}

export interface ChannelCloneDetectorConfig {
  type: 'channel-clone-detector';
  /** Protected channels to watch for impersonation */
  protectedChannels: ProtectedChannel[];
  /** Similarity threshold (0-1) for name matching */
  nameThreshold: number;
  /** Similarity threshold (0-1) for description matching */
  descriptionThreshold: number;
  /** Alert priority for clone detection */
  alertPriority: AlertPriority;
}

export interface ProtectedChannel {
  chatId: string;
  title: string;
  description?: string;
  username?: string;
  /** Base64 or hash of profile photo for comparison */
  photoHash?: string;
}

export interface MediaMonitorConfig {
  type: 'media-monitor';
  /** Media types to capture */
  mediaTypes: ('photo' | 'video' | 'document' | 'audio')[];
  /** Auto-archive captured media */
  autoArchive: boolean;
  /** Whether to extract and store metadata */
  extractMetadata: boolean;
  /** Hook for future image analysis (face matching interface) */
  imageAnalysisEnabled: boolean;
  /** Alert priority for new media */
  alertPriority: AlertPriority;
}

// ─── Minion State ────────────────────────────────────────────────

export interface MinionState {
  id: string;
  status: MinionStatus;
  lastPollAt: number;
  nextPollAt: number;
  messagesScanned: number;
  alertsTriggered: number;
  errorsCount: number;
  lastError?: string;
  startedAt?: number;
  uptimeMs: number;
  /** Last processed message ID per chat for deduplication */
  lastMessageIds: Record<string, number>;
  /** Last known member list per chat (for new member detection) */
  lastKnownMembers: Record<string, string[]>;
}

// ─── Alert Types ─────────────────────────────────────────────────

export interface MinionAlert {
  id: string;
  minionId: string;
  minionName: string;
  minionType: MinionType;
  alertType: AlertType;
  priority: AlertPriority;
  title: string;
  description: string;
  chatId: string;
  chatTitle: string;
  messageId?: number;
  userId?: string;
  userName?: string;
  timestamp: number;
  read: boolean;
  dismissed: boolean;
  /** Serialized matched data (keyword, member info, etc.) */
  matchData?: string;
  /** Evidence ID if auto-archived */
  evidenceId?: string;
}

// ─── Log Types ───────────────────────────────────────────────────

export type MinionLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface MinionLogEntry {
  id: string;
  minionId: string;
  level: MinionLogLevel;
  message: string;
  timestamp: number;
  data?: string;
}

// ─── Statistics ──────────────────────────────────────────────────

export interface MinionStats {
  totalMinions: number;
  activeMinions: number;
  pausedMinions: number;
  stoppedMinions: number;
  errorMinions: number;
  totalMessagesScanned: number;
  totalAlertsTriggered: number;
  totalErrors: number;
  uptimeMs: number;
  lastUpdated: number;
}

// ─── Dashboard Types ─────────────────────────────────────────────

export interface MinionDashboardData {
  minions: MinionConfig[];
  states: Record<string, MinionState>;
  stats: MinionStats;
  recentAlerts: MinionAlert[];
  recentLogs: MinionLogEntry[];
}

// ─── Rate Limiter Types ──────────────────────────────────────────

export interface RateLimiterConfig {
  /** Minimum delay between API calls in ms */
  minDelayMs: number;
  /** Maximum delay between API calls in ms (for jitter) */
  maxDelayMs: number;
  /** Maximum concurrent API calls */
  maxConcurrent: number;
  /** Backoff multiplier on FloodWaitError */
  backoffMultiplier: number;
  /** Maximum backoff delay in ms */
  maxBackoffMs: number;
}

// ─── Worker Message Types ────────────────────────────────────────

export type MinionWorkerMessage =
  | { type: 'start'; minionId: string; config: MinionConfig }
  | { type: 'stop'; minionId: string }
  | { type: 'pause'; minionId: string }
  | { type: 'resume'; minionId: string }
  | { type: 'poll-result'; minionId: string; state: Partial<MinionState> }
  | { type: 'alert'; alert: MinionAlert }
  | { type: 'log'; entry: MinionLogEntry }
  | { type: 'error'; minionId: string; error: string }
  | { type: 'state-update'; minionId: string; state: Partial<MinionState> };

// ─── Image Analysis Hook (Future) ───────────────────────────────

export interface ImageAnalysisRequest {
  mediaId: string;
  chatId: string;
  messageId: number;
  mimeType: string;
  /** Base64-encoded image data or blob URL */
  imageData: string;
  timestamp: number;
}

export interface ImageAnalysisResult {
  mediaId: string;
  /** Whether faces were detected */
  facesDetected: boolean;
  /** Number of faces found */
  faceCount: number;
  /** Confidence scores for any matches (0-1) */
  matchConfidences: number[];
  /** IDs of matched reference images */
  matchedReferenceIds: string[];
  /** Raw analysis data for forensic purposes */
  rawResult: string;
  analyzedAt: number;
}
