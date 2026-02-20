import { registerPlugin, ArgusPlugin } from '../index';

/**
 * Evidence Preservation — Phase 1A
 *
 * Capabilities:
 * - One-click message/conversation/channel archiving
 * - Full metadata preservation (timestamps, user IDs, edit history)
 * - SHA-256 chain-of-custody logging
 * - Evidence export (JSON with hashes, PDF/HTML reports)
 * - Evidence catalog and index
 */

// Export components
export { default as EvidencePanel } from './components/EvidencePanel';
export { default as EvidenceArchiveButton } from './components/EvidenceArchiveButton';
export { default as EvidenceCatalogPanel } from './components/EvidenceCatalogPanel';

// Export helpers
export {
  archiveMessage,
  createEvidenceFromMessages,
  addCustodyEntry,
} from './helpers/archiver';

export {
  exportEvidence,
  downloadBlob,
  exportEvidenceCatalog,
} from './helpers/exporter';

export {
  sha256,
  sha256Buffer,
  sha256Blob,
  createCustodyLogEntry,
  verifyCustodyChain,
  formatHash,
  formatForensicTimestamp,
} from './helpers/hashing';

export {
  saveEvidence,
  getEvidence,
  getAllEvidence,
  getEvidenceByChatId,
  updateEvidenceStatus,
  deleteEvidence,
  saveMediaEntry,
  getMediaEntry,
  getMediaByChat,
  getEvidenceCatalog,
  searchEvidence,
} from './helpers/evidenceStorage';

// Export types
export type {
  EvidenceStatus,
  ArchiveScope,
  ExportFormat,
  ArchivedMessage,
  EvidenceItem,
  MediaArchiveEntry,
  CustodyLogEntry,
  CustodyAction,
  EvidenceCatalog,
  EvidenceCatalogEntry,
  ExportOptions,
  EvidenceExportResult,
  ArchiveRequest,
} from './types';

const EvidencePreservation: ArgusPlugin = {
  id: 'evidence-preservation',
  name: 'Evidence Preservation',
  version: '1.0.0',
  init: () => {
    console.log('[Argus] Evidence Preservation v1.0.0 initialized');
    console.log('[Argus] ├─ Message Archiving: ACTIVE');
    console.log('[Argus] ├─ Chain-of-Custody Logging: ACTIVE');
    console.log('[Argus] └─ Evidence Export (JSON/PDF): ACTIVE');
  },
};

registerPlugin(EvidencePreservation);

export default EvidencePreservation;
