/**
 * Project Argus — Bot Minions: IndexedDB Storage
 * Persistent storage for minion configs, states, alerts, and logs.
 */

import type {
  MinionConfig,
  MinionState,
  MinionAlert,
  MinionLogEntry,
  MinionStats,
} from '../types';

const DB_NAME = 'argus-bot-minions';
const DB_VERSION = 1;

const STORES = {
  CONFIGS: 'minion-configs',
  STATES: 'minion-states',
  ALERTS: 'minion-alerts',
  LOGS: 'minion-logs',
  STATS: 'minion-stats',
} as const;

let dbInstance: IDBDatabase | undefined;

function openDb(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.CONFIGS)) {
        const configStore = db.createObjectStore(STORES.CONFIGS, { keyPath: 'id' });
        configStore.createIndex('type', 'type', { unique: false });
        configStore.createIndex('enabled', 'enabled', { unique: false });
        configStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.STATES)) {
        const stateStore = db.createObjectStore(STORES.STATES, { keyPath: 'id' });
        stateStore.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.ALERTS)) {
        const alertStore = db.createObjectStore(STORES.ALERTS, { keyPath: 'id' });
        alertStore.createIndex('minionId', 'minionId', { unique: false });
        alertStore.createIndex('priority', 'priority', { unique: false });
        alertStore.createIndex('timestamp', 'timestamp', { unique: false });
        alertStore.createIndex('read', 'read', { unique: false });
        alertStore.createIndex('alertType', 'alertType', { unique: false });
        alertStore.createIndex('chatId', 'chatId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.LOGS)) {
        const logStore = db.createObjectStore(STORES.LOGS, { keyPath: 'id' });
        logStore.createIndex('minionId', 'minionId', { unique: false });
        logStore.createIndex('level', 'level', { unique: false });
        logStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.STATS)) {
        db.createObjectStore(STORES.STATS, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(new Error(`[Argus:Minions] Failed to open DB: ${request.error?.message}`));
    };
  });
}

function doTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const req = operation(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function doIndexQuery<T>(
  storeName: string,
  indexName: string,
  value: IDBValidKey,
): Promise<T[]> {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const req = index.getAll(value);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}

// ─── Minion Configs ──────────────────────────────────────────────

export async function saveConfig(config: MinionConfig): Promise<void> {
  await doTransaction(STORES.CONFIGS, 'readwrite', (store) => store.put(config));
}

export async function getConfig(id: string): Promise<MinionConfig | undefined> {
  return doTransaction(STORES.CONFIGS, 'readonly', (store) => store.get(id));
}

export async function getAllConfigs(): Promise<MinionConfig[]> {
  return doTransaction(STORES.CONFIGS, 'readonly', (store) => store.getAll());
}

export async function deleteConfig(id: string): Promise<void> {
  await doTransaction(STORES.CONFIGS, 'readwrite', (store) => store.delete(id));
}

export async function getConfigsByType(type: string): Promise<MinionConfig[]> {
  return doIndexQuery(STORES.CONFIGS, 'type', type);
}

// ─── Minion States ───────────────────────────────────────────────

export async function saveState(state: MinionState): Promise<void> {
  await doTransaction(STORES.STATES, 'readwrite', (store) => store.put(state));
}

export async function getState(id: string): Promise<MinionState | undefined> {
  return doTransaction(STORES.STATES, 'readonly', (store) => store.get(id));
}

export async function getAllStates(): Promise<MinionState[]> {
  return doTransaction(STORES.STATES, 'readonly', (store) => store.getAll());
}

export async function deleteState(id: string): Promise<void> {
  await doTransaction(STORES.STATES, 'readwrite', (store) => store.delete(id));
}

// ─── Alerts ──────────────────────────────────────────────────────

export async function saveAlert(alert: MinionAlert): Promise<void> {
  await doTransaction(STORES.ALERTS, 'readwrite', (store) => store.put(alert));
}

export async function getAlert(id: string): Promise<MinionAlert | undefined> {
  return doTransaction(STORES.ALERTS, 'readonly', (store) => store.get(id));
}

export async function getAllAlerts(): Promise<MinionAlert[]> {
  return doTransaction(STORES.ALERTS, 'readonly', (store) => store.getAll());
}

export async function getAlertsByMinion(minionId: string): Promise<MinionAlert[]> {
  return doIndexQuery(STORES.ALERTS, 'minionId', minionId);
}

export async function getUnreadAlerts(): Promise<MinionAlert[]> {
  return doIndexQuery(STORES.ALERTS, 'read', 0);
}

export async function getAlertsByPriority(priority: string): Promise<MinionAlert[]> {
  return doIndexQuery(STORES.ALERTS, 'priority', priority);
}

export async function markAlertRead(id: string): Promise<void> {
  const alert = await getAlert(id);
  if (!alert) return;
  alert.read = true;
  await saveAlert(alert);
}

export async function markAlertDismissed(id: string): Promise<void> {
  const alert = await getAlert(id);
  if (!alert) return;
  alert.dismissed = true;
  await saveAlert(alert);
}

export async function markAllAlertsRead(): Promise<void> {
  const alerts = await getAllAlerts();
  const db = await openDb();
  const tx = db.transaction(STORES.ALERTS, 'readwrite');
  const store = tx.objectStore(STORES.ALERTS);
  alerts.forEach((alert) => {
    if (!alert.read) {
      alert.read = true;
      store.put(alert);
    }
  });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteAlert(id: string): Promise<void> {
  await doTransaction(STORES.ALERTS, 'readwrite', (store) => store.delete(id));
}

export async function clearAlertsByMinion(minionId: string): Promise<void> {
  const alerts = await getAlertsByMinion(minionId);
  const db = await openDb();
  const tx = db.transaction(STORES.ALERTS, 'readwrite');
  const store = tx.objectStore(STORES.ALERTS);
  alerts.forEach((alert) => store.delete(alert.id));
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getRecentAlerts(limit: number = 50): Promise<MinionAlert[]> {
  const all = await getAllAlerts();
  return all
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

// ─── Logs ────────────────────────────────────────────────────────

export async function saveLog(entry: MinionLogEntry): Promise<void> {
  await doTransaction(STORES.LOGS, 'readwrite', (store) => store.put(entry));
}

export async function getLogsByMinion(minionId: string, limit: number = 100): Promise<MinionLogEntry[]> {
  const logs: MinionLogEntry[] = await doIndexQuery(STORES.LOGS, 'minionId', minionId);
  return logs
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

export async function getAllLogs(limit: number = 200): Promise<MinionLogEntry[]> {
  const all = await doTransaction<MinionLogEntry[]>(STORES.LOGS, 'readonly', (store) => store.getAll());
  return all
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

export async function clearLogsByMinion(minionId: string): Promise<void> {
  const logs = await getLogsByMinion(minionId, 10000);
  const db = await openDb();
  const tx = db.transaction(STORES.LOGS, 'readwrite');
  const store = tx.objectStore(STORES.LOGS);
  logs.forEach((log) => store.delete(log.id));
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function pruneOldLogs(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): Promise<number> {
  const cutoff = Date.now() - maxAgeMs;
  const all = await doTransaction<MinionLogEntry[]>(STORES.LOGS, 'readonly', (store) => store.getAll());
  const toDelete = all.filter((log) => log.timestamp < cutoff);
  if (toDelete.length === 0) return 0;

  const db = await openDb();
  const tx = db.transaction(STORES.LOGS, 'readwrite');
  const store = tx.objectStore(STORES.LOGS);
  toDelete.forEach((log) => store.delete(log.id));
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(toDelete.length);
    tx.onerror = () => reject(tx.error);
  });
}

// ─── Stats ───────────────────────────────────────────────────────

const STATS_KEY = 'global-stats';

export async function saveStats(stats: MinionStats): Promise<void> {
  await doTransaction(STORES.STATS, 'readwrite', (store) => store.put({ ...stats, id: STATS_KEY }));
}

export async function getStats(): Promise<MinionStats> {
  const result = await doTransaction<MinionStats & { id: string } | undefined>(
    STORES.STATS,
    'readonly',
    (store) => store.get(STATS_KEY),
  );
  if (result) {
    const { id: _id, ...stats } = result;
    return stats as MinionStats;
  }
  return {
    totalMinions: 0,
    activeMinions: 0,
    pausedMinions: 0,
    stoppedMinions: 0,
    errorMinions: 0,
    totalMessagesScanned: 0,
    totalAlertsTriggered: 0,
    totalErrors: 0,
    uptimeMs: 0,
    lastUpdated: Date.now(),
  };
}

// ─── Cleanup ─────────────────────────────────────────────────────

export async function deleteAllMinionData(minionId: string): Promise<void> {
  await deleteConfig(minionId);
  await deleteState(minionId);
  await clearAlertsByMinion(minionId);
  await clearLogsByMinion(minionId);
}
