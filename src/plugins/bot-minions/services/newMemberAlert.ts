/**
 * Project Argus — Bot Minions: New Member Alert Minion
 * Watches specified groups for new member joins.
 * Cross-references against watchlist, flags risk criteria (new accounts, suspicious usernames).
 */

import type {
  MinionConfig,
  MinionState,
  NewMemberAlertConfig,
  MinionAlert,
} from '../types';

import { fetchChatMembers } from './telegramBridge';
import { registerMinionPollFunction } from './minionEngine';
import type { MinionEngine } from './minionEngine';
import {
  generateAlertId,
  estimateAccountAgeDays,
  isSuspiciousUsername,
} from '../helpers/utils';

/**
 * Poll function for the New Member Alert minion.
 * Compares current member list against last known list to detect new joins.
 */
async function pollNewMemberAlert(
  config: MinionConfig,
  state: MinionState,
  engine: typeof import('./minionEngine').minionEngine,
): Promise<Partial<MinionState>> {
  const typeConfig = config.typeConfig as NewMemberAlertConfig;
  const updatedLastKnownMembers = { ...state.lastKnownMembers };
  let totalScanned = 0;

  for (const chatId of config.targetChatIds) {
    const members = await fetchChatMembers(chatId, 200);

    if (members.length === 0) continue;

    totalScanned += members.length;

    const currentMemberIds = members.map((m) => m.userId);
    const previousMemberIds = new Set(state.lastKnownMembers[chatId] || []);

    // Detect new members (present now but not in last snapshot)
    const newMembers = previousMemberIds.size > 0
      ? members.filter((m) => !previousMemberIds.has(m.userId))
      : []; // First run: don't alert on existing members

    // Update the known member list
    updatedLastKnownMembers[chatId] = currentMemberIds;

    for (const member of newMembers) {
      const riskFactors: string[] = [];
      let isWatchlistHit = false;

      // Check watchlist
      if (typeConfig.watchlistUserIds.includes(member.userId)) {
        isWatchlistHit = true;
        riskFactors.push('WATCHLIST HIT');
      }

      // Check account age
      const ageDays = estimateAccountAgeDays(member.userId);
      if (ageDays >= 0 && ageDays < typeConfig.newAccountThresholdDays) {
        riskFactors.push(`New account (~${ageDays} days old)`);
      }

      // Check suspicious username
      if (isSuspiciousUsername(member.username, typeConfig.suspiciousUsernamePatterns)) {
        riskFactors.push(`Suspicious username: @${member.username}`);
      }

      // Check for no username (common in disposable accounts)
      if (!member.username) {
        riskFactors.push('No username set');
      }

      // Check for bot accounts
      if (member.isBot) {
        riskFactors.push('Bot account');
      }

      // Determine if we should alert
      const shouldAlert = isWatchlistHit || riskFactors.length > 0;

      if (shouldAlert) {
        const memberName = [member.firstName, member.lastName].filter(Boolean).join(' ') || member.username || member.userId;

        const alert: MinionAlert = {
          id: generateAlertId(),
          minionId: config.id,
          minionName: config.name,
          minionType: 'new-member-alert',
          alertType: isWatchlistHit ? 'watchlist-hit' : 'risk-account',
          priority: isWatchlistHit ? typeConfig.watchlistAlertPriority : typeConfig.riskAlertPriority,
          title: isWatchlistHit
            ? `WATCHLIST: ${memberName} joined ${chatId}`
            : `Risk Account: ${memberName} joined ${chatId}`,
          description: [
            `User: ${memberName}`,
            member.username ? `Username: @${member.username}` : 'No username',
            `User ID: ${member.userId}`,
            `Estimated account age: ~${ageDays >= 0 ? `${ageDays} days` : 'unknown'}`,
            '',
            'Risk Factors:',
            ...riskFactors.map((f) => `  • ${f}`),
          ].join('\n'),
          chatId,
          chatTitle: chatId,
          userId: member.userId,
          userName: memberName,
          timestamp: Date.now(),
          read: false,
          dismissed: false,
          matchData: JSON.stringify({
            member,
            riskFactors,
            isWatchlistHit,
            estimatedAgeDays: ageDays,
          }),
        };

        await engine.emitAlert(alert);
      }

      // Log all new members regardless of risk
      await engine.log(
        config.id,
        'info',
        `New member in ${chatId}: ${[member.firstName, member.lastName].filter(Boolean).join(' ')} (@${member.username || 'none'}) [${member.userId}]${riskFactors.length > 0 ? ` — ${riskFactors.join(', ')}` : ''}`,
      );
    }

    if (newMembers.length > 0 && previousMemberIds.size > 0) {
      await engine.log(config.id, 'info', `Detected ${newMembers.length} new member(s) in ${chatId}`);
    }
  }

  return {
    messagesScanned: (state.messagesScanned || 0) + totalScanned,
    lastKnownMembers: updatedLastKnownMembers,
  };
}

// Register with the engine
registerMinionPollFunction('new-member-alert', pollNewMemberAlert as any);

/**
 * Create a default New Member Alert configuration
 */
export function createDefaultNewMemberAlertConfig(): NewMemberAlertConfig {
  return {
    type: 'new-member-alert',
    watchlistUserIds: [],
    newAccountThresholdDays: 30,
    suspiciousUsernamePatterns: [
      '^[a-z]{2}\\d{6,}$',
      '^user\\d+$',
      '^temp_',
    ],
    autoProfile: true,
    watchlistAlertPriority: 'critical',
    riskAlertPriority: 'warning',
  };
}

/**
 * Validate a new member alert configuration
 */
export function validateNewMemberAlertConfig(config: NewMemberAlertConfig): string[] {
  const errors: string[] = [];

  if (config.newAccountThresholdDays < 0) {
    errors.push('Account age threshold must be non-negative');
  }

  for (const pattern of config.suspiciousUsernamePatterns) {
    try {
      new RegExp(pattern);
    } catch {
      errors.push(`Invalid regex pattern: ${pattern}`);
    }
  }

  return errors;
}

export default pollNewMemberAlert;
