/**
 * Project Argus — Scam Sniffer: Wallet Warning Component
 * Displays inline warnings next to detected crypto wallet addresses in messages.
 * Shows risk score, report count, and detailed tooltip on click.
 */

import { memo, useState, useCallback } from '../../../lib/teact/teact';

import type { WalletCheckResult } from '../types';
import { truncateAddress, getChainLabel } from '../utils/walletDetector';
import styles from '../styles/ScamSniffer.module.scss';

interface OwnProps {
  wallet: WalletCheckResult;
}

const WalletWarning = ({ wallet }: OwnProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setShowTooltip(false);
  }, []);

  const statusClass = wallet.isFlagged
    ? styles.flagged
    : wallet.source === 'unchecked'
      ? styles.unchecked
      : styles.safe;

  const riskScoreClass = wallet.riskScore >= 70
    ? styles.critical
    : wallet.riskScore >= 40
      ? styles.high
      : wallet.riskScore > 0
        ? styles.medium
        : styles.low;

  const statusIcon = wallet.isFlagged ? '⚠' : wallet.source === 'unchecked' ? '○' : '✓';
  const statusLabel = wallet.isFlagged
    ? `${wallet.reportCount} report${wallet.reportCount !== 1 ? 's' : ''}`
    : wallet.source === 'unchecked'
      ? 'Not checked'
      : 'Clean';

  return (
    <span className={`${styles.walletWarning} ${statusClass}`} onClick={handleClick}>
      <span className={styles.walletIcon}>{statusIcon}</span>
      <span className={styles.walletChain}>{wallet.chain}</span>
      <span className={styles.walletAddress}>{truncateAddress(wallet.address)}</span>
      {wallet.isFlagged && (
        <span className={styles.walletReports}>{statusLabel}</span>
      )}

      {showTooltip && (
        <WalletTooltip
          wallet={wallet}
          riskScoreClass={riskScoreClass}
          onClose={handleClose}
        />
      )}
    </span>
  );
};

// ─── Tooltip Sub-component ───────────────────────────────────────────────────

interface TooltipProps {
  wallet: WalletCheckResult;
  riskScoreClass: string;
  onClose: () => void;
}

const WalletTooltip = ({ wallet, riskScoreClass, onClose }: TooltipProps) => {
  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(wallet.address).catch(() => {});
  }, [wallet.address]);

  return (
    <div className={styles.walletTooltip} onClick={(e: any) => e.stopPropagation()}>
      <div className={styles.tooltipHeader}>
        <div className={`${styles.tooltipRiskScore} ${riskScoreClass}`}>
          {wallet.riskScore}
        </div>
        <div>
          <div style="font-weight: 600; font-size: 0.875rem;">
            {getChainLabel(wallet.chain)} Wallet
          </div>
          <div style="font-size: 0.6875rem; color: var(--color-text-secondary);">
            Risk Score: {wallet.riskScore}/100
          </div>
        </div>
      </div>

      <div className={styles.tooltipRow}>
        <span className={styles.label}>Address</span>
        <span
          className={styles.value}
          style="cursor: pointer; font-family: monospace; font-size: 0.6875rem;"
          onClick={handleCopyAddress}
          title="Click to copy"
        >
          {truncateAddress(wallet.address, 8, 6)}
        </span>
      </div>

      <div className={styles.tooltipRow}>
        <span className={styles.label}>Source</span>
        <span className={styles.value}>
          {wallet.source === 'chainabuse' ? 'Chainabuse' : wallet.source === 'unchecked' ? 'Not checked' : 'Local'}
        </span>
      </div>

      <div className={styles.tooltipRow}>
        <span className={styles.label}>Reports</span>
        <span className={styles.value}>{wallet.reportCount}</span>
      </div>

      {wallet.categories.length > 0 && (
        <div className={styles.tooltipRow}>
          <span className={styles.label}>Categories</span>
          <span className={styles.value}>{wallet.categories.join(', ')}</span>
        </div>
      )}

      {wallet.lastReportDate && (
        <div className={styles.tooltipRow}>
          <span className={styles.label}>Last Report</span>
          <span className={styles.value}>
            {new Date(wallet.lastReportDate).toLocaleDateString()}
          </span>
        </div>
      )}

      {wallet.error && (
        <div className={styles.tooltipRow}>
          <span className={styles.label}>Status</span>
          <span className={styles.value} style="color: var(--argus-medium);">
            {wallet.error}
          </span>
        </div>
      )}

      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--color-borders); display: flex; gap: 8px;">
        <button
          className={`${styles.panelButton} ${styles.proceed}`}
          onClick={handleCopyAddress}
        >
          Copy Address
        </button>
        <button
          className={`${styles.panelButton} ${styles.proceed}`}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default memo(WalletWarning);
