/**
 * Project Argus — Bot Minions: Dashboard
 * Main dashboard for managing all minions, viewing alerts, logs, and statistics.
 */

import {
  memo, useState, useCallback, useEffect, useMemo,
} from '../../../lib/teact/teact';

import type {
  MinionConfig,
  MinionState,
  MinionAlert,
  MinionLogEntry,
  MinionStats,
} from '../types';

import { minionEngine } from '../services/minionEngine';
import { alertService } from '../services/alertService';
import MinionStatusCard from './MinionStatusCard';
import MinionConfigWizard from './MinionConfigWizard';
import AlertFeed from './AlertFeed';
import { formatDuration, formatTimestamp } from '../helpers/utils';
import styles from '../styles/BotMinions.module.scss';

type DashboardTab = 'overview' | 'minions' | 'alerts' | 'logs' | 'create';

const MinionDashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const [configs, setConfigs] = useState<MinionConfig[]>([]);
  const [states, setStates] = useState<Record<string, MinionState>>({});
  const [alerts, setAlerts] = useState<MinionAlert[]>([]);
  const [logs, setLogs] = useState<MinionLogEntry[]>([]);
  const [stats, setStats] = useState<MinionStats | undefined>(undefined);
  const [editingMinionId, setEditingMinionId] = useState<string | undefined>(undefined);
  const [unreadCount, setUnreadCount] = useState(0);

  // ─── Data Loading ──────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      const [loadedConfigs, loadedStates, loadedAlerts, loadedLogs, loadedStats] = await Promise.all([
        Promise.resolve(minionEngine.getAllConfigs()),
        Promise.resolve(minionEngine.getAllStates()),
        minionEngine.getRecentAlerts(100),
        minionEngine.getRecentLogs(200),
        minionEngine.getStats(),
      ]);

      setConfigs(loadedConfigs);
      setStates(loadedStates);
      setAlerts(loadedAlerts);
      setLogs(loadedLogs);
      setStats(loadedStats);
      setUnreadCount(alertService.getUnreadCount());
    } catch (error) {
      console.error('[Argus:Dashboard] Failed to load data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Subscribe to engine changes
    const unsubEngine = minionEngine.subscribe(() => {
      loadData();
    });

    // Subscribe to alert count changes
    const unsubAlerts = alertService.onUnreadCountChange((count) => {
      setUnreadCount(count);
    });

    // Periodic refresh
    const interval = setInterval(loadData, 10000);

    return () => {
      unsubEngine();
      unsubAlerts();
      clearInterval(interval);
    };
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    loadData();
  }, [loadData]);

  // ─── Minion Actions ────────────────────────────────────────────

  const handleStart = useCallback(async (id: string) => {
    await minionEngine.startMinion(id);
    loadData();
  }, [loadData]);

  const handleStop = useCallback(async (id: string) => {
    await minionEngine.stopMinion(id);
    loadData();
  }, [loadData]);

  const handlePause = useCallback(async (id: string) => {
    await minionEngine.pauseMinion(id);
    loadData();
  }, [loadData]);

  const handleResume = useCallback(async (id: string) => {
    await minionEngine.resumeMinion(id);
    loadData();
  }, [loadData]);

  const handleDelete = useCallback(async (id: string) => {
    await minionEngine.deleteMinion(id);
    loadData();
  }, [loadData]);

  const handleEdit = useCallback((id: string) => {
    setEditingMinionId(id);
    setActiveTab('create');
  }, []);

  const handleCreateMinion = useCallback(async (config: Omit<MinionConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMinionId) {
      await minionEngine.updateMinion(editingMinionId, config);
      setEditingMinionId(undefined);
    } else {
      await minionEngine.createMinion(config);
    }
    setActiveTab('minions');
    loadData();
  }, [editingMinionId, loadData]);

  const handleCancelCreate = useCallback(() => {
    setEditingMinionId(undefined);
    setActiveTab('minions');
  }, []);

  // ─── Render ────────────────────────────────────────────────────

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h2>
          Bot Minions
          {stats && (
            <span style="font-size: 0.75rem; color: var(--color-text-secondary); font-weight: normal">
              {` ${stats.activeMinions} active / ${stats.totalMinions} total`}
            </span>
          )}
        </h2>
        <div className={styles.headerActions}>
          <button type="button" className={styles.headerBtn} onClick={handleRefresh}>
            Refresh
          </button>
          <button
            type="button"
            className={`${styles.headerBtn} ${styles.primary}`}
            onClick={() => { setEditingMinionId(undefined); setActiveTab('create'); }}
          >
            + New Minion
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.dashboardTabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'minions' ? styles.active : ''}`}
          onClick={() => setActiveTab('minions')}
        >
          {`Minions (${configs.length})`}
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'alerts' ? styles.active : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts
          {unreadCount > 0 && <span className={styles.tabBadge}>{unreadCount}</span>}
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'logs' ? styles.active : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          Logs
        </button>
        {activeTab === 'create' && (
          <button
            type="button"
            className={`${styles.tab} ${styles.active}`}
          >
            {editingMinionId ? 'Edit Minion' : 'New Minion'}
          </button>
        )}
      </div>

      {/* Content */}
      <div className={styles.dashboardContent}>
        {activeTab === 'overview' && (
          <OverviewPanel
            key={refreshKey}
            stats={stats}
            configs={configs}
            states={states}
            recentAlerts={alerts.slice(0, 5)}
          />
        )}

        {activeTab === 'minions' && (
          <MinionsPanel
            configs={configs}
            states={states}
            onStart={handleStart}
            onStop={handleStop}
            onPause={handlePause}
            onResume={handleResume}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertFeed alerts={alerts} onRefresh={handleRefresh} />
        )}

        {activeTab === 'logs' && (
          <LogsPanel logs={logs} />
        )}

        {activeTab === 'create' && (
          <MinionConfigWizard
            existingConfig={editingMinionId ? configs.find((c) => c.id === editingMinionId) : undefined}
            onSave={handleCreateMinion}
            onCancel={handleCancelCreate}
          />
        )}
      </div>
    </div>
  );
};

// ─── Overview Panel ──────────────────────────────────────────────

interface OverviewProps {
  stats?: MinionStats;
  configs: MinionConfig[];
  states: Record<string, MinionState>;
  recentAlerts: MinionAlert[];
}

const OverviewPanel = ({
  stats, configs, states, recentAlerts,
}: OverviewProps) => {
  if (!stats) {
    return (
      <div className={styles.emptyState}>
        <h3>Loading...</h3>
        <p>Initializing the Minion Engine...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue} style="color: var(--minion-running)">
            {stats.activeMinions}
          </div>
          <div className={styles.statLabel}>Active Minions</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {stats.totalMessagesScanned.toLocaleString()}
          </div>
          <div className={styles.statLabel}>Messages Scanned</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style="color: var(--alert-warning)">
            {stats.totalAlertsTriggered}
          </div>
          <div className={styles.statLabel}>Alerts Triggered</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {formatDuration(stats.uptimeMs)}
          </div>
          <div className={styles.statLabel}>Engine Uptime</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style="color: var(--minion-paused)">
            {stats.pausedMinions}
          </div>
          <div className={styles.statLabel}>Paused</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style="color: var(--minion-error)">
            {stats.totalErrors}
          </div>
          <div className={styles.statLabel}>Total Errors</div>
        </div>
      </div>

      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <div style="margin-bottom: 20px">
          <h3 style="font-size: 0.875rem; font-weight: var(--font-weight-bold); margin-bottom: 10px">
            Recent Alerts
          </h3>
          <div className={styles.alertFeed}>
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`${styles.alertItem} ${!alert.read ? styles.unread : ''} ${alert.priority === 'critical' ? styles.critical : ''}`}
              >
                <div className={`${styles.alertPriorityIcon} ${styles[alert.priority]}`}>
                  {alert.priority === 'critical' ? '\uD83D\uDEA8' : alert.priority === 'warning' ? '\u26A0\uFE0F' : '\u2139\uFE0F'}
                </div>
                <div className={styles.alertContent}>
                  <div className={styles.alertTitle}>{alert.title}</div>
                  <div className={styles.alertDescription}>{alert.description}</div>
                </div>
                <div className={styles.alertTime}>{formatTimestamp(alert.timestamp)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {configs.length === 0 && (
        <div className={styles.emptyState}>
          <h3>No Minions Deployed</h3>
          <p>Create your first minion to start monitoring. They'll keep watching while you sleep.</p>
        </div>
      )}
    </div>
  );
};

// ─── Minions Panel ───────────────────────────────────────────────

interface MinionsPanelProps {
  configs: MinionConfig[];
  states: Record<string, MinionState>;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const MinionsPanel = ({
  configs, states, onStart, onStop, onPause, onResume, onDelete, onEdit,
}: MinionsPanelProps) => {
  if (configs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No Minions Yet</h3>
        <p>Click "+ New Minion" to deploy your first background monitor.</p>
      </div>
    );
  }

  return (
    <div className={styles.minionList}>
      {configs.map((config) => {
        const state = states[config.id] || {
          id: config.id,
          status: 'stopped' as const,
          lastPollAt: 0,
          nextPollAt: 0,
          messagesScanned: 0,
          alertsTriggered: 0,
          errorsCount: 0,
          uptimeMs: 0,
          lastMessageIds: {},
          lastKnownMembers: {},
        };

        return (
          <MinionStatusCard
            key={config.id}
            config={config}
            state={state}
            onStart={onStart}
            onStop={onStop}
            onPause={onPause}
            onResume={onResume}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        );
      })}
    </div>
  );
};

// ─── Logs Panel ──────────────────────────────────────────────────

interface LogsPanelProps {
  logs: MinionLogEntry[];
}

const LogsPanel = ({ logs }: LogsPanelProps) => {
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filteredLogs = levelFilter === 'all'
    ? logs
    : logs.filter((l) => l.level === levelFilter);

  if (logs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No Logs Yet</h3>
        <p>Logs will appear here once minions start running.</p>
      </div>
    );
  }

  return (
    <div>
      <div style="display: flex; gap: 6px; margin-bottom: 12px">
        {['all', 'error', 'warn', 'info', 'debug'].map((level) => (
          <button
            key={level}
            type="button"
            className={`${styles.actionBtn} ${levelFilter === level ? styles.primary : ''}`}
            onClick={() => setLevelFilter(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.logViewer}>
        {filteredLogs.map((entry) => (
          <div key={entry.id} className={`${styles.logEntry} ${styles[entry.level]}`}>
            <span className={styles.logTime}>
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            <span className={styles.logLevel}>{entry.level}</span>
            <span className={styles.logMessage}>
              {`[${entry.minionId.substring(0, 12)}] ${entry.message}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(MinionDashboard);
