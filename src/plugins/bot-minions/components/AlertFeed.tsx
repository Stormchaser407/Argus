/**
 * Project Argus — Bot Minions: Alert Feed
 * Chronological list of all triggered alerts across all minions.
 */

import {
  memo, useState, useCallback, useEffect,
} from '../../../lib/teact/teact';

import type { MinionAlert, AlertPriority } from '../types';
import { alertService } from '../services/alertService';
import { formatTimestamp, truncate } from '../helpers/utils';
import styles from '../styles/BotMinions.module.scss';

interface OwnProps {
  alerts: MinionAlert[];
  onRefresh: () => void;
}

const PRIORITY_ICONS: Record<AlertPriority, string> = {
  info: '\u2139\uFE0F',
  warning: '\u26A0\uFE0F',
  critical: '\uD83D\uDEA8',
};

const AlertFeed = ({ alerts, onRefresh }: OwnProps) => {
  const [filter, setFilter] = useState<AlertPriority | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | undefined>(undefined);

  const filteredAlerts = filter === 'all'
    ? alerts
    : alerts.filter((a) => a.priority === filter);

  const handleAlertClick = useCallback((alertId: string) => {
    setExpandedId((prev) => (prev === alertId ? undefined : alertId));
    alertService.markRead(alertId);
    onRefresh();
  }, [onRefresh]);

  const handleMarkAllRead = useCallback(() => {
    alertService.markAllRead();
    onRefresh();
  }, [onRefresh]);

  const handleDismiss = useCallback((alertId: string) => {
    alertService.markDismissed(alertId);
    onRefresh();
  }, [onRefresh]);

  if (alerts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No Alerts</h3>
        <p>Your minions haven't triggered any alerts yet. They're watching silently.</p>
      </div>
    );
  }

  return (
    <div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px">
        <div style="display: flex; gap: 6px">
          {(['all', 'critical', 'warning', 'info'] as const).map((level) => (
            <button
              type="button"
              className={`${styles.actionBtn} ${filter === level ? styles.primary : ''}`}
              onClick={() => setFilter(level)}
            >
              {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
              {level !== 'all' && (
                <span style="margin-left: 4px; opacity: 0.7">
                  ({alerts.filter((a) => a.priority === level).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <button type="button" className={styles.actionBtn} onClick={handleMarkAllRead}>
          Mark All Read
        </button>
      </div>

      <div className={styles.alertFeed}>
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={[
              styles.alertItem,
              !alert.read ? styles.unread : '',
              alert.priority === 'critical' ? styles.critical : '',
              alert.priority === 'warning' ? styles.warning : '',
            ].filter(Boolean).join(' ')}
            onClick={() => handleAlertClick(alert.id)}
          >
            <div className={`${styles.alertPriorityIcon} ${styles[alert.priority]}`}>
              {PRIORITY_ICONS[alert.priority]}
            </div>
            <div className={styles.alertContent}>
              <div className={styles.alertTitle}>{alert.title}</div>
              {expandedId === alert.id ? (
                <div className={styles.alertDetailBody}>
                  {alert.description}
                  <div className={styles.alertDetailMeta}>
                    <span>{`Minion: ${alert.minionName} (${alert.minionType})`}</span>
                    <span>{`Chat: ${alert.chatTitle}`}</span>
                    {alert.userId && <span>{`User: ${alert.userId}`}</span>}
                    {alert.messageId && <span>{`Message ID: ${alert.messageId}`}</span>}
                    <span>{`Time: ${formatTimestamp(alert.timestamp)}`}</span>
                  </div>
                  <div style="margin-top: 8px">
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); handleDismiss(alert.id); }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.alertDescription}>
                  {truncate(alert.description, 120)}
                </div>
              )}
            </div>
            <div className={styles.alertTime}>
              {formatRelativeTime(alert.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default memo(AlertFeed);
