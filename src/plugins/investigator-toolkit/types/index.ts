/**
 * Project Argus — Investigator Toolkit Types
 * Type definitions for user profiling, group analysis, and network mapping.
 */

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal';

export interface ArgusUserProfile {
  userId: string;
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  bio?: string;
  registrationDate?: number;
  accountAgeDays?: number;
  riskLevel: RiskLevel;
  riskScore: number;
  usernameHistory: UsernameRecord[];
  bioHistory: BioRecord[];
  profilePhotoCount?: number;
  isPremium?: boolean;
  isVerified?: boolean;
  isBot?: boolean;
  lastSeen?: number;
  commonChatsCount?: number;
  firstSeenTimestamp: number;
  lastUpdatedTimestamp: number;
}

export interface UsernameRecord {
  username: string;
  firstSeen: number;
  lastSeen: number;
  isActive: boolean;
}

export interface BioRecord {
  bio: string;
  capturedAt: number;
}

export interface GroupMembershipInfo {
  chatId: string;
  chatTitle: string;
  chatType: 'group' | 'supergroup' | 'channel';
  memberCount?: number;
  isPublic: boolean;
  username?: string;
  joinDate?: number;
}

export interface GroupOverlapResult {
  userId: string;
  watchedGroups: GroupMembershipInfo[];
  otherGroups: GroupMembershipInfo[];
  overlapCount: number;
}

export interface NetworkNode {
  userId: string;
  displayName: string;
  username?: string;
  connectionCount: number;
}

export interface NetworkEdge {
  sourceUserId: string;
  targetUserId: string;
  edgeType: 'forward' | 'reply' | 'mention' | 'common_group';
  weight: number;
  firstSeen: number;
  lastSeen: number;
  chatId?: string;
}

export interface NetworkGraph {
  nodes: Record<string, NetworkNode>;
  edges: NetworkEdge[];
  lastUpdated: number;
}

export interface ForwardTraceEntry {
  messageId: number;
  chatId: string;
  fromUserId?: string;
  fromChatId?: string;
  originalDate: number;
  forwardDate: number;
}

export interface InteractionRecord {
  userId: string;
  chatId: string;
  messageCount: number;
  lastMessageDate: number;
  forwardCount: number;
  replyCount: number;
  mentionCount: number;
}

export const RISK_THRESHOLDS = {
  CRITICAL_DAYS: 7,
  HIGH_DAYS: 30,
  MEDIUM_DAYS: 90,
  LOW_DAYS: 365,
} as const;

export const RISK_COLORS: Record<RiskLevel, string> = {
  critical: '#FF3B30',
  high: '#FF9500',
  medium: '#FFCC00',
  low: '#34C759',
  minimal: '#007AFF',
};
