/**
 * Project Argus — Scam Sniffer: Trust Badge Component
 * Displays a trust score badge on user profiles.
 * Color-coded from green (trusted) to red (critical risk).
 */

import { memo, useMemo } from '../../../lib/teact/teact';

import { getTrustScoreDisplay, getAccountProfile } from '../services/behaviorScoringService';
import styles from '../styles/ScamSniffer.module.scss';

interface OwnProps {
  peerId: string;
  compact?: boolean;
}

const TrustBadge = ({ peerId, compact = false }: OwnProps) => {
  const profile = getAccountProfile(peerId);

  const display = useMemo(() => {
    if (!profile) return undefined;
    return getTrustScoreDisplay(profile.trustScore);
  }, [profile]);

  if (!profile || !display) return null;

  const badgeClass = profile.trustScore >= 80
    ? styles.trusted
    : profile.trustScore >= 60
      ? styles.normal
      : profile.trustScore >= 40
        ? styles.suspicious
        : profile.trustScore >= 20
          ? styles.highRisk
          : styles.criticalRisk;

  if (compact) {
    return (
      <span
        className={`${styles.trustBadge} ${badgeClass}`}
        title={`Trust Score: ${profile.trustScore}/100 — ${display.label}`}
      >
        <span className={styles.trustBadgeIcon}>{display.icon}</span>
        <span>{profile.trustScore}</span>
      </span>
    );
  }

  return (
    <span
      className={`${styles.trustBadge} ${badgeClass}`}
      title={`Trust Score: ${profile.trustScore}/100`}
    >
      <span className={styles.trustBadgeIcon}>{display.icon}</span>
      <span>{display.label}</span>
      <span style="opacity: 0.7;">({profile.trustScore})</span>
    </span>
  );
};

export default memo(TrustBadge);
