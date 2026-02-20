/**
 * Project Argus — Scam Sniffer: Link Warning Component
 * Displays visual warning overlay on suspicious links before user clicks.
 * Shows detailed check results in an expandable panel.
 */

import { memo, useState, useCallback } from '../../../lib/teact/teact';

import type { LinkCheckResult } from '../types';
import { ThreatLevel } from '../types';
import { getLinkCheckSummary } from '../services/linkAnalysisService';
import { getThreatTypeLabel } from '../services/safeBrowsingService';
import { formatDomainAge } from '../services/domainAgeService';
import styles from '../styles/ScamSniffer.module.scss';

interface OwnProps {
  linkResult: LinkCheckResult;
  onProceed?: () => void;
}

const LinkWarning = ({ linkResult, onProceed }: OwnProps) => {
  const [showPanel, setShowPanel] = useState(false);

  const handleBadgeClick = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPanel((prev) => !prev);
  }, []);

  const handleProceed = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPanel(false);
    if (onProceed) onProceed();
  }, [onProceed]);

  const handleBlock = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPanel(false);
  }, []);

  // Don't show anything for safe links
  if (linkResult.threatLevel === ThreatLevel.SAFE) return null;

  const isDanger = linkResult.threatLevel === ThreatLevel.HIGH
    || linkResult.threatLevel === ThreatLevel.CRITICAL;
  const badgeClass = isDanger ? styles.danger : styles.warning;
  const badgeIcon = isDanger ? '⛔' : '⚠';
  const badgeText = isDanger ? 'DANGEROUS' : 'SUSPICIOUS';

  return (
    <span className={styles.linkWarningOverlay}>
      <span
        className={`${styles.linkWarningBadge} ${badgeClass}`}
        onClick={handleBadgeClick}
      >
        <span>{badgeIcon}</span>
        <span>{badgeText}</span>
      </span>

      {showPanel && (
        <LinkWarningPanel
          linkResult={linkResult}
          isDanger={isDanger}
          onProceed={handleProceed}
          onBlock={handleBlock}
        />
      )}
    </span>
  );
};

// ─── Warning Panel Sub-component ─────────────────────────────────────────────

interface PanelProps {
  linkResult: LinkCheckResult;
  isDanger: boolean;
  onProceed: (e: any) => void;
  onBlock: (e: any) => void;
}

const LinkWarningPanel = ({ linkResult, isDanger, onProceed, onBlock }: PanelProps) => {
  const checks = linkResult.checks;

  return (
    <div className={styles.linkWarningPanel} onClick={(e: any) => e.stopPropagation()}>
      <div className={styles.panelTitle}>
        <span>{isDanger ? '⛔' : '⚠'}</span>
        <span>{isDanger ? 'Dangerous Link Detected' : 'Suspicious Link Detected'}</span>
      </div>

      <div style="font-size: 0.75rem; color: var(--color-text-secondary); margin-bottom: 8px; word-break: break-all;">
        {linkResult.url.length > 60 ? `${linkResult.url.slice(0, 60)}...` : linkResult.url}
      </div>

      <div className={styles.panelChecks}>
        {/* Google Safe Browsing */}
        <CheckItem
          label="Google Safe Browsing"
          status={
            !checks.safeBrowsing?.isAvailable
              ? 'unavailable'
              : checks.safeBrowsing.isMalicious
                ? 'flagged'
                : 'clean'
          }
          detail={
            !checks.safeBrowsing?.isAvailable
              ? 'API not configured'
              : checks.safeBrowsing.isMalicious
                ? checks.safeBrowsing.threatTypes.map(getThreatTypeLabel).join(', ')
                : 'No threats found'
          }
        />

        {/* VirusTotal */}
        <CheckItem
          label="VirusTotal"
          status={
            !checks.virusTotal?.isAvailable
              ? 'unavailable'
              : checks.virusTotal.isMalicious
                ? 'flagged'
                : 'clean'
          }
          detail={
            !checks.virusTotal?.isAvailable
              ? 'API not configured'
              : checks.virusTotal.isMalicious
                ? `${checks.virusTotal.positives}/${checks.virusTotal.total} engines flagged`
                : `0/${checks.virusTotal.total} engines flagged`
          }
        />

        {/* Typosquatting */}
        {checks.typosquatting && (
          <CheckItem
            label="Typosquatting Check"
            status={checks.typosquatting.isTyposquat ? 'flagged' : 'clean'}
            detail={
              checks.typosquatting.isTyposquat
                ? `Impersonates ${checks.typosquatting.targetDomain} (${checks.typosquatting.technique})`
                : 'No impersonation detected'
            }
          />
        )}

        {/* Domain Age */}
        {checks.domainAge && (
          <CheckItem
            label="Domain Age"
            status={
              !checks.domainAge.isAvailable
                ? 'unavailable'
                : checks.domainAge.isNewDomain
                  ? 'flagged'
                  : 'clean'
            }
            detail={
              !checks.domainAge.isAvailable
                ? 'Could not determine'
                : checks.domainAge.ageDays !== undefined
                  ? `Registered ${formatDomainAge(checks.domainAge.ageDays)} ago`
                  : 'Age unknown'
            }
          />
        )}
      </div>

      <div className={styles.panelActions}>
        <button className={`${styles.panelButton} ${styles.proceed}`} onClick={onProceed}>
          Proceed Anyway
        </button>
        <button className={`${styles.panelButton} ${styles.block}`} onClick={onBlock}>
          Block Link
        </button>
      </div>
    </div>
  );
};

// ─── Check Item Sub-component ────────────────────────────────────────────────

interface CheckItemProps {
  label: string;
  status: 'flagged' | 'clean' | 'unavailable';
  detail: string;
}

const CheckItem = ({ label, status, detail }: CheckItemProps) => {
  const icon = status === 'flagged' ? '✕' : status === 'clean' ? '✓' : '○';

  return (
    <div className={`${styles.checkItem} ${styles[status]}`}>
      <span className={styles.checkIcon}>{icon}</span>
      <div>
        <div style="font-weight: 500;">{label}</div>
        <div style="font-size: 0.6875rem; opacity: 0.8;">{detail}</div>
      </div>
    </div>
  );
};

export default memo(LinkWarning);
