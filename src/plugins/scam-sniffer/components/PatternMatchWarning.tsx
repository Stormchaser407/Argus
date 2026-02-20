/**
 * Project Argus — Scam Sniffer: Pattern Match Warning Component
 * Displays inline warnings when scam patterns are detected in messages.
 */

import { memo, useState, useCallback } from '../../../lib/teact/teact';

import type { ScamPatternMatch } from '../types';
import { AlertAction } from '../types';
import { getScamCategoryLabel, getAlertLevelColor } from '../services/patternMatchingService';
import styles from '../styles/ScamSniffer.module.scss';

interface OwnProps {
  matches: ScamPatternMatch[];
}

const PatternMatchWarning = ({ matches }: OwnProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  if (!matches || matches.length === 0) return null;

  // Show the highest-confidence match as the primary warning
  const topMatch = matches[0];
  const isDanger = topMatch.alertLevel === AlertAction.DANGER || topMatch.alertLevel === AlertAction.BLOCK;
  const badgeClass = isDanger ? styles.danger : styles.warning;
  const icon = isDanger ? '🔍⛔' : '🔍⚠';

  return (
    <div>
      <div
        className={`${styles.messageScanIndicator} ${isDanger ? styles.danger : styles.warning}`}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
      >
        <span>{icon}</span>
        <span>
          {getScamCategoryLabel(topMatch.category)} detected
          ({Math.round(topMatch.confidence * 100)}% confidence)
          {matches.length > 1 && ` +${matches.length - 1} more`}
        </span>
      </div>

      {expanded && (
        <div style="margin-top: 4px;">
          {matches.map((match, index) => (
            <PatternMatchDetail key={`${match.patternId}-${index}`} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Pattern Match Detail ────────────────────────────────────────────────────

interface DetailProps {
  match: ScamPatternMatch;
}

const PatternMatchDetail = ({ match }: DetailProps) => {
  const color = getAlertLevelColor(match.alertLevel);

  return (
    <div
      style={`
        padding: 6px 10px;
        margin: 2px 0;
        border-radius: 6px;
        border-left: 3px solid ${color};
        background: rgba(0, 0, 0, 0.03);
        font-size: 0.75rem;
      `}
    >
      <div style="font-weight: 600; margin-bottom: 2px;">
        {getScamCategoryLabel(match.category)}
      </div>
      <div style="color: var(--color-text-secondary);">
        Confidence: {Math.round(match.confidence * 100)}% · Alert: {match.alertLevel}
      </div>
      {match.matchedText && (
        <div style="margin-top: 4px; font-style: italic; opacity: 0.8; word-break: break-word;">
          &ldquo;{match.matchedText.slice(0, 150)}{match.matchedText.length > 150 ? '...' : ''}&rdquo;
        </div>
      )}
    </div>
  );
};

export default memo(PatternMatchWarning);
