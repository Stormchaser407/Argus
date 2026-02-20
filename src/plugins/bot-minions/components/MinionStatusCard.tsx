/**
 * Project Argus — Bot Minions: Minion Status Card
 * Displays a single minion's status, stats, and controls.
 */

import { memo, useCallback } from '../../../lib/teact/teact';

import type { MinionConfig, MinionState, MinionType } from '../types';
import { formatDuration, formatTimestamp } from '../helpers/utils';
import styles from '../styles/BotMinions.module.scss';

interface OwnProps {
  config: MinionConfig;
  state: MinionState;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const MINION_TYPE_LABELS: Record<MinionType, string> = {
  'keyword-monitor': 'Keyword Monitor',
  'new-member-alert': 'New Member Alert',
  'channel-clone-detector': 'Clone Detector',
  'media-monitor': 'Media Monitor',
};

const MinionStatusCard = ({
  config,
  state,
  onStart,
  onStop,
  onPause,
  onResume,
  onDelete,
  onEdit,
}: OwnProps) => {
  const handleStart = useCallback(() => onStart(config.id), [config.id, onStart]);
  const handleStop = useCallback(() => onStop(config.id), [config.id, onStop]);
  const handlePause = useCallback(() => onPause(config.id), [config.id, onPause]);
  const handleResume = useCallback(() => onResume(config.id), [config.id, onResume]);
  const handleDelete = useCallback(() => onDelete(config.id), [config.id, onDelete]);
  const handleEdit = useCallback(() => onEdit(config.id), [config.id, onEdit]);

  const isRunning = state.status === 'running';
  const isPaused = state.status === 'paused';
  const isStopped = state.status === 'stopped';

  return (
    <div className={styles.minionCard}>
      <div className={styles.minionCardHeader}>
        <div className={styles.minionName}>
          {config.name}
          <span className={styles.minionType}>{MINION_TYPE_LABELS[config.type]}</span>
        </div>
        <span className={`${styles.statusBadge} ${styles[state.status]}`}>
          <span className={styles.statusDot} />
          {state.status.charAt(0).toUpperCase() + state.status.slice(1)}
        </span>
      </div>

      <div className={styles.minionMeta}>
        <span>{`Targets: ${config.targetChatIds.length}`}</span>
        <span>{`Scanned: ${state.messagesScanned.toLocaleString()}`}</span>
        <span>{`Alerts: ${state.alertsTriggered}`}</span>
        {isRunning && state.startedAt && (
          <span>{`Uptime: ${formatDuration(Date.now() - state.startedAt)}`}</span>
        )}
        {state.lastPollAt > 0 && (
          <span>{`Last poll: ${formatTimestamp(state.lastPollAt)}`}</span>
        )}
        {state.lastError && (
          <span style="color: var(--minion-error)">{`Error: ${state.lastError}`}</span>
        )}
      </div>

      <div className={styles.minionActions}>
        {isStopped && (
          <button type="button" className={styles.actionBtn} onClick={handleStart}>
            Start
          </button>
        )}
        {isRunning && (
          <>
            <button type="button" className={styles.actionBtn} onClick={handlePause}>
              Pause
            </button>
            <button type="button" className={styles.actionBtn} onClick={handleStop}>
              Stop
            </button>
          </>
        )}
        {isPaused && (
          <>
            <button type="button" className={styles.actionBtn} onClick={handleResume}>
              Resume
            </button>
            <button type="button" className={styles.actionBtn} onClick={handleStop}>
              Stop
            </button>
          </>
        )}
        {state.status === 'error' && (
          <button type="button" className={styles.actionBtn} onClick={handleStart}>
            Restart
          </button>
        )}
        <button type="button" className={styles.actionBtn} onClick={handleEdit}>
          Edit
        </button>
        <button type="button" className={`${styles.actionBtn} ${styles.danger}`} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default memo(MinionStatusCard);
