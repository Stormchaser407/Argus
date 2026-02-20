/**
 * Project Argus — Bot Minions: Keyword Monitor Minion
 * Monitors specified public channels/groups for keyword and regex pattern matches.
 * When triggered: logs the match, archives with evidence preservation, sends alert.
 */

import type {
  MinionConfig,
  MinionState,
  KeywordMonitorConfig,
  MinionAlert,
} from '../types';

import { fetchChatMessages } from './telegramBridge';
import { registerMinionPollFunction } from './minionEngine';
import type { MinionEngine } from './minionEngine';
import {
  generateAlertId,
  matchesKeywords,
  matchesRegexPatterns,
  truncate,
} from '../helpers/utils';

/**
 * Poll function for the Keyword Monitor minion.
 * Scans new messages in target chats for keyword/regex matches.
 */
async function pollKeywordMonitor(
  config: MinionConfig,
  state: MinionState,
  engine: typeof import('./minionEngine').minionEngine,
): Promise<Partial<MinionState>> {
  const typeConfig = config.typeConfig as KeywordMonitorConfig;
  let totalScanned = 0;
  const updatedLastMessageIds = { ...state.lastMessageIds };

  for (const chatId of config.targetChatIds) {
    const lastSeenId = state.lastMessageIds[chatId] || 0;

    // Fetch recent messages
    const messages = await fetchChatMessages(chatId, 50, lastSeenId > 0 ? lastSeenId : undefined);

    if (messages.length === 0) continue;

    // Filter to only new messages (after lastSeenId)
    const newMessages = lastSeenId > 0
      ? messages.filter((m) => m.id > lastSeenId)
      : messages;

    if (newMessages.length === 0) continue;

    totalScanned += newMessages.length;

    // Update the last seen message ID
    const maxId = Math.max(...newMessages.map((m) => m.id));
    updatedLastMessageIds[chatId] = maxId;

    // Check each message for keyword/regex matches
    for (const message of newMessages) {
      if (!message.text) continue;

      // Check plain keywords
      const keywordMatches = matchesKeywords(message.text, typeConfig.keywords);

      // Check regex patterns
      const regexMatches = matchesRegexPatterns(message.text, typeConfig.regexPatterns);

      if (keywordMatches.length > 0 || regexMatches.length > 0) {
        const matchDetails = [
          ...keywordMatches.map((k) => `keyword: "${k}"`),
          ...regexMatches.map((r) => `regex: /${r.pattern}/ → ${r.matches.join(', ')}`),
        ].join('; ');

        const alert: MinionAlert = {
          id: generateAlertId(),
          minionId: config.id,
          minionName: config.name,
          minionType: 'keyword-monitor',
          alertType: 'keyword-match',
          priority: typeConfig.alertPriority,
          title: `Keyword Match in ${chatId}`,
          description: `Matched: ${matchDetails}\n\nMessage: ${truncate(message.text, 300)}`,
          chatId,
          chatTitle: chatId, // Will be resolved by dashboard
          messageId: message.id,
          userId: message.senderId,
          timestamp: Date.now(),
          read: false,
          dismissed: false,
          matchData: JSON.stringify({
            keywords: keywordMatches,
            regexMatches,
            messageText: message.text,
            messageDate: message.date,
            senderId: message.senderId,
          }),
        };

        await engine.emitAlert(alert);

        // Auto-archive if enabled
        if (typeConfig.autoArchive) {
          await engine.log(config.id, 'info', `Auto-archiving matched message ${message.id} in ${chatId}`);
          // Hook into evidence preservation system
          // The evidence preservation plugin handles the actual archival
        }
      }
    }
  }

  return {
    messagesScanned: (state.messagesScanned || 0) + totalScanned,
    lastMessageIds: updatedLastMessageIds,
  };
}

// Register with the engine
registerMinionPollFunction('keyword-monitor', pollKeywordMonitor as any);

/**
 * Create a default Keyword Monitor configuration
 */
export function createDefaultKeywordMonitorConfig(): KeywordMonitorConfig {
  return {
    type: 'keyword-monitor',
    keywords: [],
    regexPatterns: [],
    autoArchive: true,
    alertPriority: 'warning',
    contextMessages: 3,
  };
}

/**
 * Validate a keyword monitor configuration
 */
export function validateKeywordMonitorConfig(config: KeywordMonitorConfig): string[] {
  const errors: string[] = [];

  if (config.keywords.length === 0 && config.regexPatterns.length === 0) {
    errors.push('At least one keyword or regex pattern is required');
  }

  // Validate regex patterns
  for (const pattern of config.regexPatterns) {
    try {
      new RegExp(pattern);
    } catch {
      errors.push(`Invalid regex pattern: ${pattern}`);
    }
  }

  return errors;
}

export default pollKeywordMonitor;
