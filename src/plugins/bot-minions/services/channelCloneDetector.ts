/**
 * Project Argus — Bot Minions: Channel Clone Detector Minion
 * Monitors for channels/groups that appear to be clones of legitimate ones.
 * Compares channel names, descriptions, and profile photos against protected channels.
 */

import type {
  MinionConfig,
  MinionState,
  ChannelCloneDetectorConfig,
  ProtectedChannel,
  MinionAlert,
} from '../types';

import { searchPublicChats, fetchChatInfo } from './telegramBridge';
import { registerMinionPollFunction } from './minionEngine';
import type { MinionEngine } from './minionEngine';
import {
  generateAlertId,
  stringSimilarity,
  truncate,
} from '../helpers/utils';

/**
 * Poll function for the Channel Clone Detector minion.
 * Searches for channels similar to protected ones and flags potential impersonation.
 */
async function pollChannelCloneDetector(
  config: MinionConfig,
  state: MinionState,
  engine: typeof import('./minionEngine').minionEngine,
): Promise<Partial<MinionState>> {
  const typeConfig = config.typeConfig as ChannelCloneDetectorConfig;
  let totalScanned = 0;

  for (const protectedChannel of typeConfig.protectedChannels) {
    // Search for channels with similar names
    const searchResults = await searchPublicChats(protectedChannel.title);
    totalScanned += searchResults.length;

    for (const candidate of searchResults) {
      // Skip the protected channel itself
      if (candidate.id === protectedChannel.chatId) continue;

      // Calculate similarity scores
      const nameSimilarity = stringSimilarity(protectedChannel.title, candidate.title);
      const descSimilarity = protectedChannel.description && candidate.description
        ? stringSimilarity(protectedChannel.description, candidate.description)
        : 0;

      // Check for common impersonation patterns
      const impersonationIndicators = detectImpersonationPatterns(
        protectedChannel,
        candidate,
      );

      // Determine if this is a potential clone
      const isNameClone = nameSimilarity >= typeConfig.nameThreshold;
      const isDescClone = descSimilarity >= typeConfig.descriptionThreshold;
      const hasImpersonationPatterns = impersonationIndicators.length > 0;

      if (isNameClone || isDescClone || hasImpersonationPatterns) {
        const overallScore = Math.max(nameSimilarity, descSimilarity);
        const indicators = [
          `Name similarity: ${(nameSimilarity * 100).toFixed(1)}%`,
          ...(descSimilarity > 0 ? [`Description similarity: ${(descSimilarity * 100).toFixed(1)}%`] : []),
          ...impersonationIndicators,
        ];

        const alert: MinionAlert = {
          id: generateAlertId(),
          minionId: config.id,
          minionName: config.name,
          minionType: 'channel-clone-detector',
          alertType: 'channel-clone',
          priority: overallScore >= 0.9 ? 'critical' : typeConfig.alertPriority,
          title: `Potential Clone: "${candidate.title}"`,
          description: [
            `Protected Channel: "${protectedChannel.title}" (${protectedChannel.chatId})`,
            `Suspect Channel: "${candidate.title}" (${candidate.id})`,
            candidate.username ? `Username: @${candidate.username}` : '',
            `Members: ${candidate.memberCount}`,
            '',
            'Indicators:',
            ...indicators.map((i) => `  • ${i}`),
          ].filter(Boolean).join('\n'),
          chatId: candidate.id,
          chatTitle: candidate.title,
          timestamp: Date.now(),
          read: false,
          dismissed: false,
          matchData: JSON.stringify({
            protectedChannel: protectedChannel.chatId,
            protectedTitle: protectedChannel.title,
            suspectChannel: candidate.id,
            suspectTitle: candidate.title,
            nameSimilarity,
            descSimilarity,
            impersonationIndicators,
            overallScore,
          }),
        };

        await engine.emitAlert(alert);
      }
    }

    await engine.log(
      config.id,
      'info',
      `Scanned ${searchResults.length} channels for clones of "${protectedChannel.title}"`,
    );
  }

  return {
    messagesScanned: (state.messagesScanned || 0) + totalScanned,
  };
}

/**
 * Detect common impersonation patterns between a protected channel and a candidate.
 */
function detectImpersonationPatterns(
  protected_: ProtectedChannel,
  candidate: { id: string; title: string; description: string; username: string },
): string[] {
  const indicators: string[] = [];
  const protTitle = protected_.title.toLowerCase();
  const candTitle = candidate.title.toLowerCase();

  // Homoglyph detection (common character substitutions)
  const homoglyphs: Record<string, string[]> = {
    o: ['0', 'ο', 'о'], // Latin o, zero, Greek omicron, Cyrillic o
    l: ['1', 'I', 'і', '|'],
    e: ['3', 'е', 'ε'],
    a: ['@', 'а', 'α'],
    i: ['1', 'і', 'ι', '!'],
    s: ['5', '$'],
    t: ['7', '+'],
    b: ['8'],
    g: ['9'],
  };

  // Check if candidate title uses homoglyphs of the protected title
  let homoglyphCount = 0;
  for (let i = 0; i < Math.min(protTitle.length, candTitle.length); i++) {
    const protChar = protTitle[i];
    const candChar = candTitle[i];
    if (protChar !== candChar && homoglyphs[protChar]?.includes(candChar)) {
      homoglyphCount++;
    }
  }
  if (homoglyphCount > 0) {
    indicators.push(`Homoglyph substitution detected (${homoglyphCount} character(s))`);
  }

  // Check for added/removed characters (e.g., "TelegramOfficial" vs "Telegram_Official")
  const strippedProt = protTitle.replace(/[^a-z0-9]/g, '');
  const strippedCand = candTitle.replace(/[^a-z0-9]/g, '');
  if (strippedProt === strippedCand && protTitle !== candTitle) {
    indicators.push('Same name with different separators/formatting');
  }

  // Check for prefix/suffix additions (e.g., "Official Telegram" vs "Telegram")
  if (candTitle.includes(protTitle) && candTitle !== protTitle) {
    indicators.push('Protected channel name embedded in suspect name');
  }

  // Check for username similarity if both have usernames
  if (protected_.username && candidate.username) {
    const usernameSim = stringSimilarity(protected_.username, candidate.username);
    if (usernameSim >= 0.7 && usernameSim < 1) {
      indicators.push(`Similar username: @${candidate.username} (${(usernameSim * 100).toFixed(1)}% match)`);
    }
  }

  return indicators;
}

// Register with the engine
registerMinionPollFunction('channel-clone-detector', pollChannelCloneDetector as any);

/**
 * Create a default Channel Clone Detector configuration
 */
export function createDefaultChannelCloneDetectorConfig(): ChannelCloneDetectorConfig {
  return {
    type: 'channel-clone-detector',
    protectedChannels: [],
    nameThreshold: 0.75,
    descriptionThreshold: 0.6,
    alertPriority: 'warning',
  };
}

/**
 * Validate a channel clone detector configuration
 */
export function validateChannelCloneDetectorConfig(config: ChannelCloneDetectorConfig): string[] {
  const errors: string[] = [];

  if (config.protectedChannels.length === 0) {
    errors.push('At least one protected channel is required');
  }

  if (config.nameThreshold < 0 || config.nameThreshold > 1) {
    errors.push('Name threshold must be between 0 and 1');
  }

  if (config.descriptionThreshold < 0 || config.descriptionThreshold > 1) {
    errors.push('Description threshold must be between 0 and 1');
  }

  return errors;
}

export default pollChannelCloneDetector;
