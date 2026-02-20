/**
 * Project Argus — Main Evidence Panel
 * Combines archive actions and evidence catalog into a single panel
 * that integrates into the right-column profile view.
 */

import { memo, useCallback, useState } from '../../../lib/teact/teact';
import type { EvidenceItem } from '../types';
import EvidenceArchiveButton from './EvidenceArchiveButton';
import EvidenceCatalogPanel from './EvidenceCatalogPanel';
import styles from '../styles/EvidencePanel.module.scss';

type OwnProps = {
  chatId: string;
};

const EvidencePanel = ({ chatId }: OwnProps) => {
  const [lastArchived, setLastArchived] = useState<EvidenceItem | undefined>();

  const handleArchiveComplete = useCallback((evidence: EvidenceItem) => {
    setLastArchived(evidence);
  }, []);

  return (
    <div className="ArgusEvidencePanel">
      {/* Archive Actions */}
      <div className={styles.root}>
        <div className={styles.headerLeft}>
          <span className={styles.argusIcon}>&#128230;</span>
          <span className={styles.title}>QUICK ARCHIVE</span>
        </div>
        <div className={styles.archiveActions}>
          <EvidenceArchiveButton
            chatId={chatId}
            scope="conversation"
            onArchiveComplete={handleArchiveComplete}
          />
        </div>
        {lastArchived && (
          <div className={styles.successMessage}>
            &#9989; Last archived: {lastArchived.evidenceId}
            ({lastArchived.messages.length} messages)
          </div>
        )}
      </div>

      {/* Evidence Catalog */}
      <EvidenceCatalogPanel chatId={chatId} />
    </div>
  );
};

export default memo(EvidencePanel);
