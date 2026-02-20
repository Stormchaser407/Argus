/**
 * Project Argus — Scam Sniffer: Message Scan Indicator
 * Shows a compact indicator below messages that have been scanned.
 * Displays the overall threat level and a summary of findings.
 */

import { memo, useMemo } from '../../../lib/teact/teact';

import type { MessageScanResult } from '../types';
import { ThreatLevel } from '../types';
import styles from '../styles/ScamSniffer.module.scss';

interface OwnProps {
  scanResult: MessageScanResult;
  onClick?: () => void;
}

const MessageScanIndicator = ({ scanResult, onClick }: OwnProps) => {
  const { overallThreatLevel, wallets, links, patternMatches } = scanResult;

  // Don't show indicator for safe messages
  if (overallThreatLevel === ThreatLevel.SAFE) return null;

  const summary = useMemo(() => {
    const parts: string[] = [];

    const flaggedWallets = wallets.filter((w) => w.isFlagged);
    if (flaggedWallets.length > 0) {
      parts.push(`${flaggedWallets.length} flagged wallet${flaggedWallets.length !== 1 ? 's' : ''}`);
    }

    const flaggedLinks = links.filter((l) => l.isMalicious);
    if (flaggedLinks.length > 0) {
      parts.push(`${flaggedLinks.length} malicious link${flaggedLinks.length !== 1 ? 's' : ''}`);
    }

    if (patternMatches.length > 0) {
      const topMatch = patternMatches[0];
      parts.push(`${topMatch.name} (${Math.round(topMatch.confidence * 100)}%)`);
    }

    return parts.join(' · ');
  }, [wallets, links, patternMatches]);

  const indicatorClass = overallThreatLevel === ThreatLevel.HIGH
    || overallThreatLevel === ThreatLevel.CRITICAL
    ? styles.danger
    : overallThreatLevel === ThreatLevel.MEDIUM
      ? styles.warning
      : styles.safe;

  const icon = overallThreatLevel === ThreatLevel.HIGH
    || overallThreatLevel === ThreatLevel.CRITICAL
    ? '⛔'
    : overallThreatLevel === ThreatLevel.MEDIUM
      ? '⚠'
      : 'ℹ';

  return (
    <div
      className={`${styles.messageScanIndicator} ${indicatorClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <span>{icon}</span>
      <span>Scam Sniffer: {summary}</span>
    </div>
  );
};

export default memo(MessageScanIndicator);
