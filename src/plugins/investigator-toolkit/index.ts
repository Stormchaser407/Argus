import { registerPlugin, ArgusPlugin } from '../index';

/**
 * Investigator Toolkit — Phase 1A
 *
 * Features:
 * - User Profiling Panel (Telegram ID, RegDate, risk scoring, username/bio history)
 * - Group Membership Viewer (common chats, group overlap analysis)
 * - Network Mapping (forward tracking, interaction analysis)
 */

// Export components for use in the main app
export { default as ArgusIntelPanel } from './components/ArgusIntelPanel';
export { default as UserProfilingPanel } from './components/UserProfilingPanel';
export { default as GroupMembershipViewer } from './components/GroupMembershipViewer';
export { default as NetworkMappingPanel } from './components/NetworkMappingPanel';

// Export hooks
export { default as useNetworkTracking } from './hooks/useNetworkTracking';

// Export helpers
export {
  estimateRegistrationDate,
  calculateAccountAgeDays,
  calculateRiskScore,
  getRiskLevel,
  formatRegistrationDate,
  formatAccountAge,
} from './helpers/riskScoring';

export {
  updateArgusProfile,
  getProfileSummary,
} from './helpers/profileTracker';

export {
  processMessageForNetwork,
  processMessagesForNetwork,
  getUserConnections,
  getTopConnectedUsers,
  extractForwardTrace,
  getChatInteractionSummary,
} from './helpers/networkMapper';

// Export types
export type {
  ArgusUserProfile,
  RiskLevel,
  UsernameRecord,
  BioRecord,
  GroupMembershipInfo,
  GroupOverlapResult,
  NetworkNode,
  NetworkEdge,
  NetworkGraph,
  ForwardTraceEntry,
  InteractionRecord,
} from './types';

const InvestigatorToolkit: ArgusPlugin = {
  id: 'investigator-toolkit',
  name: 'Investigator Toolkit',
  version: '1.0.0',
  init: () => {
    console.log('[Argus] Investigator Toolkit v1.0.0 initialized');
    console.log('[Argus] \u251C\u2500 User Profiling Panel: ACTIVE');
    console.log('[Argus] \u251C\u2500 Group Membership Viewer: ACTIVE');
    console.log('[Argus] \u2514\u2500 Network Mapping: ACTIVE');
  },
};

registerPlugin(InvestigatorToolkit);

export default InvestigatorToolkit;
