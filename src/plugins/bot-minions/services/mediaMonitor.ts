/**
 * Project Argus — Bot Minions: Media Monitor Minion
 * Monitors specified channels for new media (photos/videos/documents).
 * Archives media automatically with metadata.
 * Provides a hook interface for future image analysis (face matching).
 */

import type {
  MinionConfig,
  MinionState,
  MediaMonitorConfig,
  MinionAlert,
  ImageAnalysisRequest,
  ImageAnalysisResult,
} from '../types';

import { fetchChatMessages, downloadMessageMedia } from './telegramBridge';
import { registerMinionPollFunction } from './minionEngine';
import type { MinionEngine } from './minionEngine';
import { generateAlertId, truncate } from '../helpers/utils';

// ─── Image Analysis Hook Interface ──────────────────────────────

type ImageAnalysisHandler = (request: ImageAnalysisRequest) => Promise<ImageAnalysisResult | undefined>;

let imageAnalysisHandler: ImageAnalysisHandler | undefined;

/**
 * Register an image analysis handler for face matching or other ML analysis.
 * This is the integration point for future ML models.
 */
export function registerImageAnalysisHandler(handler: ImageAnalysisHandler): void {
  imageAnalysisHandler = handler;
  console.log('[Argus:MediaMonitor] Image analysis handler registered');
}

/**
 * Check if an image analysis handler is registered
 */
export function hasImageAnalysisHandler(): boolean {
  return !!imageAnalysisHandler;
}

// ─── Poll Function ───────────────────────────────────────────────

/**
 * Poll function for the Media Monitor minion.
 * Scans new messages for media content, archives it, and optionally triggers analysis.
 */
async function pollMediaMonitor(
  config: MinionConfig,
  state: MinionState,
  engine: typeof import('./minionEngine').minionEngine,
): Promise<Partial<MinionState>> {
  const typeConfig = config.typeConfig as MediaMonitorConfig;
  let totalScanned = 0;
  const updatedLastMessageIds = { ...state.lastMessageIds };

  for (const chatId of config.targetChatIds) {
    const lastSeenId = state.lastMessageIds[chatId] || 0;

    // Fetch recent messages
    const messages = await fetchChatMessages(chatId, 50, lastSeenId > 0 ? lastSeenId : undefined);

    if (messages.length === 0) continue;

    // Filter to new messages only
    const newMessages = lastSeenId > 0
      ? messages.filter((m) => m.id > lastSeenId)
      : messages;

    if (newMessages.length === 0) continue;

    totalScanned += newMessages.length;

    // Update last seen ID
    const maxId = Math.max(...newMessages.map((m) => m.id));
    updatedLastMessageIds[chatId] = maxId;

    // Process messages with media
    for (const message of newMessages) {
      if (!message.hasMedia || !message.mediaType) continue;

      // Check if this media type is being monitored
      if (!typeConfig.mediaTypes.includes(message.mediaType as any)) continue;

      // Build metadata
      const metadata: MediaMetadata = {
        messageId: message.id,
        chatId,
        senderId: message.senderId,
        date: message.date,
        mediaType: message.mediaType,
        isForwarded: message.isForwarded,
        forwardFromId: message.forwardFromId,
        caption: message.text || undefined,
        views: message.views,
      };

      // Create alert for new media
      const alert: MinionAlert = {
        id: generateAlertId(),
        minionId: config.id,
        minionName: config.name,
        minionType: 'media-monitor',
        alertType: 'media-captured',
        priority: typeConfig.alertPriority,
        title: `New ${message.mediaType} in ${chatId}`,
        description: [
          `Type: ${message.mediaType}`,
          `From: ${message.senderId || 'Unknown'}`,
          message.text ? `Caption: ${truncate(message.text, 200)}` : '',
          message.isForwarded ? `Forwarded from: ${message.forwardFromId || 'Unknown'}` : '',
          `Date: ${new Date(message.date * 1000).toISOString()}`,
        ].filter(Boolean).join('\n'),
        chatId,
        chatTitle: chatId,
        messageId: message.id,
        userId: message.senderId,
        timestamp: Date.now(),
        read: false,
        dismissed: false,
        matchData: JSON.stringify(metadata),
      };

      await engine.emitAlert(alert);

      // Auto-archive if enabled
      if (typeConfig.autoArchive) {
        await engine.log(
          config.id,
          'info',
          `Auto-archiving ${message.mediaType} from message ${message.id} in ${chatId}`,
        );
        // Evidence preservation hook — the actual download/storage is handled by the evidence system
      }

      // Image analysis hook
      if (
        typeConfig.imageAnalysisEnabled
        && imageAnalysisHandler
        && (message.mediaType === 'photo' || message.mediaType === 'video')
      ) {
        await processImageAnalysis(config.id, message, chatId, engine);
      }
    }
  }

  return {
    messagesScanned: (state.messagesScanned || 0) + totalScanned,
    lastMessageIds: updatedLastMessageIds,
  };
}

/**
 * Process image through the analysis handler (face matching hook)
 */
async function processImageAnalysis(
  minionId: string,
  message: { id: number; senderId?: string; mediaType?: string },
  chatId: string,
  engine: typeof import('./minionEngine').minionEngine,
): Promise<void> {
  if (!imageAnalysisHandler) return;

  try {
    const mediaUrl = await downloadMessageMedia(chatId, message.id);
    if (!mediaUrl) return;

    const request: ImageAnalysisRequest = {
      mediaId: `${chatId}-${message.id}`,
      chatId,
      messageId: message.id,
      mimeType: message.mediaType === 'photo' ? 'image/jpeg' : 'video/mp4',
      imageData: mediaUrl,
      timestamp: Date.now(),
    };

    const result = await imageAnalysisHandler(request);

    if (result && result.facesDetected && result.matchedReferenceIds.length > 0) {
      const analysisAlert: MinionAlert = {
        id: generateAlertId(),
        minionId,
        minionName: '',
        minionType: 'media-monitor',
        alertType: 'media-analysis-hook',
        priority: 'critical',
        title: `Face Match Detected in ${chatId}`,
        description: [
          `${result.faceCount} face(s) detected, ${result.matchedReferenceIds.length} match(es)`,
          `Confidence: ${result.matchConfidences.map((c) => `${(c * 100).toFixed(1)}%`).join(', ')}`,
          `Matched references: ${result.matchedReferenceIds.join(', ')}`,
        ].join('\n'),
        chatId,
        chatTitle: chatId,
        messageId: message.id,
        userId: message.senderId,
        timestamp: Date.now(),
        read: false,
        dismissed: false,
        matchData: JSON.stringify(result),
      };

      await engine.emitAlert(analysisAlert);
    }

    await engine.log(minionId, 'info', `Image analysis complete for message ${message.id}: ${result?.faceCount || 0} faces detected`);
  } catch (error) {
    await engine.log(minionId, 'warn', `Image analysis failed for message ${message.id}: ${error}`);
  }
}

// Register with the engine
registerMinionPollFunction('media-monitor', pollMediaMonitor as any);

// ─── Types ───────────────────────────────────────────────────────

interface MediaMetadata {
  messageId: number;
  chatId: string;
  senderId?: string;
  date: number;
  mediaType: string;
  isForwarded: boolean;
  forwardFromId?: string;
  caption?: string;
  views?: number;
}

/**
 * Create a default Media Monitor configuration
 */
export function createDefaultMediaMonitorConfig(): MediaMonitorConfig {
  return {
    type: 'media-monitor',
    mediaTypes: ['photo', 'video'],
    autoArchive: true,
    extractMetadata: true,
    imageAnalysisEnabled: false,
    alertPriority: 'info',
  };
}

/**
 * Validate a media monitor configuration
 */
export function validateMediaMonitorConfig(config: MediaMonitorConfig): string[] {
  const errors: string[] = [];

  if (config.mediaTypes.length === 0) {
    errors.push('At least one media type must be selected');
  }

  const validTypes = ['photo', 'video', 'document', 'audio'];
  for (const type of config.mediaTypes) {
    if (!validTypes.includes(type)) {
      errors.push(`Invalid media type: ${type}`);
    }
  }

  return errors;
}

export default pollMediaMonitor;
