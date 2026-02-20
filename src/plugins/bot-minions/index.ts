/**
 * Project Argus — Bot Minions Framework (Phase 2)
 *
 * Persistent background monitoring agents that keep searching while the investigator sleeps.
 *
 * Capabilities:
 * - Minion Engine: manages multiple monitoring tasks with start/stop/pause
 * - Keyword Monitor: watches channels for keyword/regex matches
 * - New Member Alert: detects new group members, cross-references watchlists
 * - Channel Clone Detector: finds impersonation channels
 * - Media Monitor: captures new media with metadata, hooks for image analysis
 * - Alert System: in-app + desktop notifications with priority levels
 * - Dashboard: overview, config wizard, logs, alert feed, statistics
 */

import { registerPlugin } from '../index';
import type { ArgusPlugin } from '../index';

// Import services to trigger registration of poll functions
import { minionEngine } from './services/minionEngine';
import { alertService } from './services/alertService';
import './services/keywordMonitor';
import './services/newMemberAlert';
import './services/channelCloneDetector';
import './services/mediaMonitor';

// ─── Exports ─────────────────────────────────────────────────────

// Core engine
export { minionEngine } from './services/minionEngine';
export { alertService } from './services/alertService';

// Minion services
export {
  createDefaultKeywordMonitorConfig,
  validateKeywordMonitorConfig,
} from './services/keywordMonitor';

export {
  createDefaultNewMemberAlertConfig,
  validateNewMemberAlertConfig,
} from './services/newMemberAlert';

export {
  createDefaultChannelCloneDetectorConfig,
  validateChannelCloneDetectorConfig,
} from './services/channelCloneDetector';

export {
  createDefaultMediaMonitorConfig,
  validateMediaMonitorConfig,
  registerImageAnalysisHandler,
  hasImageAnalysisHandler,
} from './services/mediaMonitor';

// Helpers
export { RateLimiter, getGlobalRateLimiter } from './helpers/rateLimiter';
export * from './helpers/minionStorage';
export * from './helpers/utils';

// Types
export type {
  MinionType,
  MinionStatus,
  AlertPriority,
  AlertType,
  MinionConfig,
  KeywordMonitorConfig,
  NewMemberAlertConfig,
  ChannelCloneDetectorConfig,
  MediaMonitorConfig,
  ProtectedChannel,
  MinionState,
  MinionAlert,
  MinionLogEntry,
  MinionLogLevel,
  MinionStats,
  MinionDashboardData,
  RateLimiterConfig,
  ImageAnalysisRequest,
  ImageAnalysisResult,
} from './types';

// Components
export { default as MinionDashboard } from './components/MinionDashboard';
export { default as MinionConfigWizard } from './components/MinionConfigWizard';
export { default as AlertFeed } from './components/AlertFeed';
export { default as MinionStatusCard } from './components/MinionStatusCard';

// ─── Plugin Registration ─────────────────────────────────────────

const BotMinionsPlugin: ArgusPlugin = {
  id: 'bot-minions',
  name: 'Bot Minions Framework',
  version: '2.0.0',
  init: () => {
    console.log('[Argus] Bot Minions Framework v2.0.0 initializing...');

    // Initialize the alert service
    alertService.initialize().then(() => {
      console.log('[Argus] ├─ Alert Service: ACTIVE');
    });

    // Initialize the minion engine
    minionEngine.initialize().then(() => {
      console.log('[Argus] ├─ Minion Engine: ACTIVE');
      console.log('[Argus] ├─ Keyword Monitor: REGISTERED');
      console.log('[Argus] ├─ New Member Alert: REGISTERED');
      console.log('[Argus] ├─ Channel Clone Detector: REGISTERED');
      console.log('[Argus] ├─ Media Monitor: REGISTERED');
      console.log('[Argus] └─ Bot Minions Framework: READY');
    }).catch((error) => {
      console.error('[Argus] Bot Minions initialization failed:', error);
    });
  },
};

registerPlugin(BotMinionsPlugin);

export default BotMinionsPlugin;
