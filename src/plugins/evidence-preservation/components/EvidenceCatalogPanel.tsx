/**
 * Project Argus — Evidence Catalog Panel
 * Browse, search, and manage archived evidence items.
 * Includes chain-of-custody viewing and export functionality.
 */

import {
  memo, useCallback, useEffect, useState,
} from '../../../lib/teact/teact';
import buildClassName from '../../../util/buildClassName';
import type { EvidenceCatalogEntry, EvidenceItem, ExportFormat } from '../types';
import {
  getEvidence,
  getEvidenceCatalog,
} from '../helpers/evidenceStorage';
import { formatForensicTimestamp, formatHash, verifyCustodyChain } from '../helpers/hashing';
import { downloadBlob, exportEvidence, exportEvidenceCatalog } from '../helpers/exporter';
import { addCustodyEntry } from '../helpers/archiver';
import { getAllEvidence } from '../helpers/evidenceStorage';
import styles from '../styles/EvidencePanel.module.scss';

type OwnProps = {
  chatId?: string;
};

type ViewMode = 'catalog' | 'detail';

const EvidenceCatalogPanel = ({ chatId }: OwnProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [catalogEntries, setCatalogEntries] = useState<EvidenceCatalogEntry[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | undefined>();
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | undefined>();

  // Load catalog on mount and when expanded
  useEffect(() => {
    if (!isExpanded) return;
    loadCatalog();
  }, [isExpanded]);

  const loadCatalog = useCallback(async () => {
    try {
      const catalog = await getEvidenceCatalog();
      let entries = catalog.items;

      // Filter by chat if chatId is provided
      if (chatId) {
        entries = entries.filter((e) => {
          // We need to check the full evidence for chatId
          return true; // Show all for now, filter in detail
        });
      }

      setCatalogEntries(entries);
    } catch (err) {
      console.error('[Argus] Failed to load evidence catalog:', err);
    }
  }, [chatId]);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleSelectEvidence = useCallback(async (evidenceId: string) => {
    try {
      const evidence = await getEvidence(evidenceId);
      if (evidence) {
        // Log access in chain of custody
        await addCustodyEntry(evidence, 'accessed', 'investigator', 'Evidence viewed in catalog');
        setSelectedEvidence(evidence);
        setViewMode('detail');
      }
    } catch (err) {
      console.error('[Argus] Failed to load evidence:', err);
    }
  }, []);

  const handleBackToCatalog = useCallback(() => {
    setViewMode('catalog');
    setSelectedEvidence(undefined);
    setExportMessage(undefined);
    loadCatalog();
  }, [loadCatalog]);

  const handleExport = useCallback(async (format: ExportFormat) => {
    if (!selectedEvidence || isExporting) return;

    setIsExporting(true);
    setExportMessage(undefined);

    try {
      const result = await exportEvidence(selectedEvidence, {
        format,
        includeMedia: true,
        includeRawData: format === 'json',
        includeChainOfCustody: true,
        investigatorName: 'Investigator',
      });

      // Log export in chain of custody
      await addCustodyEntry(
        selectedEvidence,
        'exported',
        'investigator',
        `Evidence exported as ${format.toUpperCase()} (hash: ${result.sha256Hash.substring(0, 16)}...)`,
      );

      downloadBlob(result.blob, result.fileName);
      setExportMessage(`Exported as ${format.toUpperCase()} (${formatFileSize(result.fileSize)})`);

      // Reload to show updated chain
      const updated = await getEvidence(selectedEvidence.evidenceId);
      if (updated) setSelectedEvidence(updated);
    } catch (err) {
      console.error('[Argus] Export failed:', err);
      setExportMessage('Export failed');
    } finally {
      setIsExporting(false);
    }
  }, [selectedEvidence, isExporting]);

  const handleExportCatalog = useCallback(async () => {
    try {
      const allEvidence = await getAllEvidence();
      const result = await exportEvidenceCatalog(allEvidence);
      downloadBlob(result.blob, result.fileName);
    } catch (err) {
      console.error('[Argus] Catalog export failed:', err);
    }
  }, []);

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header} onClick={handleToggleExpand}>
        <div className={styles.headerLeft}>
          <span className={styles.argusIcon}>&#128274;</span>
          <span className={styles.title}>EVIDENCE LOCKER</span>
        </div>
        <span className={buildClassName(
          styles.expandIcon,
          isExpanded && styles.expandIconRotated,
        )}
        >
          &#9660;
        </span>
      </div>

      <div className={buildClassName(
        styles.content,
        isExpanded ? styles.contentExpanded : styles.contentCollapsed,
      )}
      >
        {viewMode === 'catalog' && renderCatalogView(
          catalogEntries,
          handleSelectEvidence,
          handleExportCatalog,
        )}

        {viewMode === 'detail' && selectedEvidence && renderDetailView(
          selectedEvidence,
          handleBackToCatalog,
          handleExport,
          isExporting,
          exportMessage,
        )}
      </div>
    </div>
  );
};

function renderCatalogView(
  entries: EvidenceCatalogEntry[],
  onSelect: (id: string) => void,
  onExportCatalog: () => void,
) {
  if (entries.length === 0) {
    return (
      <div className={styles.emptyState}>
        No evidence archived yet. Use the archive buttons to preserve messages.
      </div>
    );
  }

  return (
    <div className={styles.catalogSection}>
      <div className={styles.catalogHeader}>
        <span className={styles.catalogCount}>{entries.length} items</span>
        <button className={styles.archiveBtn} onClick={onExportCatalog}>
          Export Catalog
        </button>
      </div>

      {entries.map((entry) => (
        <div
          key={entry.evidenceId}
          className={styles.catalogItem}
          onClick={() => onSelect(entry.evidenceId)}
        >
          <div className={styles.catalogItemHeader}>
            <span className={styles.catalogItemTitle}>{entry.title}</span>
            <span className={buildClassName(
              styles.catalogItemStatus,
              getStatusStyle(entry.status),
            )}
            >
              {entry.status}
            </span>
          </div>
          <div className={styles.catalogItemMeta}>
            <span>{entry.messageCount} msgs</span>
            <span>{entry.mediaCount} media</span>
            <span>{new Date(entry.capturedAt * 1000).toLocaleDateString()}</span>
          </div>
          <div className={styles.catalogItemHash}>
            SHA-256: {formatHash(entry.sha256Hash, 24)}
          </div>
          {entry.tags.length > 0 && (
            <div className={styles.catalogItemTags}>
              {entry.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function renderDetailView(
  evidence: EvidenceItem,
  onBack: () => void,
  onExport: (format: ExportFormat) => void,
  isExporting: boolean,
  exportMessage?: string,
) {
  const chainVerification = verifyCustodyChain(evidence.chainOfCustody);

  return (
    <div className={styles.detailView}>
      {/* Back button */}
      <div className={styles.detailHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          &#8592; Back to Catalog
        </button>
        <span className={buildClassName(
          styles.integrityBadge,
          chainVerification.isValid ? styles.integrityValid : styles.integrityInvalid,
        )}
        >
          {chainVerification.isValid ? '\u2713 CHAIN VALID' : '\u2717 CHAIN BROKEN'}
        </span>
      </div>

      {/* Evidence Summary */}
      <div className={styles.detailSection}>
        <div className={styles.detailSectionTitle}>Evidence Summary</div>
        <div className={styles.detailField}>
          <span className={styles.detailLabel}>Evidence ID</span>
          <span className={styles.detailValue}>{evidence.evidenceId}</span>
        </div>
        <div className={styles.detailField}>
          <span className={styles.detailLabel}>Title</span>
          <span className={styles.detailValue}>{evidence.title}</span>
        </div>
        <div className={styles.detailField}>
          <span className={styles.detailLabel}>Source</span>
          <span className={styles.detailValue}>{evidence.chatTitle}</span>
        </div>
        <div className={styles.detailField}>
          <span className={styles.detailLabel}>Messages</span>
          <span className={styles.detailValue}>{evidence.messages.length}</span>
        </div>
        <div className={styles.detailField}>
          <span className={styles.detailLabel}>Captured</span>
          <span className={styles.detailValue}>
            {new Date(evidence.capturedAt * 1000).toLocaleString()}
          </span>
        </div>
        <div className={styles.detailField}>
          <span className={styles.detailLabel}>SHA-256</span>
          <span className={buildClassName(styles.detailValue, styles.hashValue)}>
            {evidence.sha256Hash}
          </span>
        </div>
      </div>

      {/* Chain of Custody */}
      <div className={styles.detailSection}>
        <div className={styles.detailSectionTitle}>
          Chain of Custody ({evidence.chainOfCustody.length} entries)
        </div>
        {evidence.chainOfCustody.map((entry, idx) => (
          <div key={`${entry.timestamp}-${idx}`} className={styles.custodyEntry}>
            <div className={styles.custodyAction}>{entry.action}</div>
            <div className={styles.custodyDetails}>{entry.details}</div>
            <div className={styles.custodyTime}>
              {formatForensicTimestamp(entry.timestamp)}
            </div>
            <div className={styles.custodyHash}>
              Hash: {formatHash(entry.itemHash, 20)}
            </div>
          </div>
        ))}
      </div>

      {/* Export Actions */}
      <div className={styles.detailSection}>
        <div className={styles.detailSectionTitle}>Export Evidence</div>
        <div className={styles.exportActions}>
          <button
            className={styles.exportBtn}
            onClick={() => onExport('json')}
            disabled={isExporting}
          >
            &#128196; Export JSON
          </button>
          <button
            className={styles.exportBtn}
            onClick={() => onExport('pdf')}
            disabled={isExporting}
          >
            &#128203; Export Report
          </button>
        </div>
        {isExporting && (
          <div className={styles.loading}>Generating export...</div>
        )}
        {exportMessage && (
          <div className={styles.successMessage}>
            &#9989; {exportMessage}
          </div>
        )}
      </div>

      {/* Notes */}
      {evidence.notes && (
        <div className={styles.detailSection}>
          <div className={styles.detailSectionTitle}>Notes</div>
          <p style="font-size: 0.8125rem; color: var(--color-text); line-height: 1.4">
            {evidence.notes}
          </p>
        </div>
      )}
    </div>
  );
}

function getStatusStyle(status: string): string {
  switch (status) {
    case 'archived': return styles.statusArchived;
    case 'exported': return styles.statusExported;
    case 'verified': return styles.statusVerified;
    case 'pending': return styles.statusPending;
    default: return styles.statusArchived;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default memo(EvidenceCatalogPanel);
