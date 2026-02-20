/**
 * Project Argus — Investigator Toolkit Local Storage
 * Manages IndexedDB storage for user profiles, network graphs, and tracking data.
 */

import type {
  ArgusUserProfile,
  BioRecord,
  InteractionRecord,
  NetworkEdge,
  NetworkGraph,
  NetworkNode,
  UsernameRecord,
} from '../types';

const DB_NAME = 'argus-investigator-toolkit';
const DB_VERSION = 1;

const STORES = {
  USER_PROFILES: 'userProfiles',
  NETWORK_GRAPH: 'networkGraph',
  INTERACTIONS: 'interactions',
  USERNAME_HISTORY: 'usernameHistory',
  BIO_HISTORY: 'bioHistory',
} as const;

let dbInstance: IDBDatabase | undefined;

function openDb(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.USER_PROFILES)) {
        const profileStore = db.createObjectStore(STORES.USER_PROFILES, { keyPath: 'userId' });
        profileStore.createIndex('riskLevel', 'riskLevel', { unique: false });
        profileStore.createIndex('lastUpdatedTimestamp', 'lastUpdatedTimestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.NETWORK_GRAPH)) {
        db.createObjectStore(STORES.NETWORK_GRAPH, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.INTERACTIONS)) {
        const interactionStore = db.createObjectStore(STORES.INTERACTIONS, {
          keyPath: ['userId', 'chatId'],
        });
        interactionStore.createIndex('userId', 'userId', { unique: false });
        interactionStore.createIndex('chatId', 'chatId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.USERNAME_HISTORY)) {
        const usernameStore = db.createObjectStore(STORES.USERNAME_HISTORY, { autoIncrement: true });
        usernameStore.createIndex('userId', 'userId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.BIO_HISTORY)) {
        const bioStore = db.createObjectStore(STORES.BIO_HISTORY, { autoIncrement: true });
        bioStore.createIndex('userId', 'userId', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(new Error(`[Argus] Failed to open IndexedDB: ${request.error?.message}`));
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

// ─── User Profiles ───────────────────────────────────────────────

export async function saveUserProfile(profile: ArgusUserProfile): Promise<void> {
  await doTransaction(STORES.USER_PROFILES, 'readwrite', (store) => store.put(profile));
}

export async function getUserProfile(userId: string): Promise<ArgusUserProfile | undefined> {
  return doTransaction(STORES.USER_PROFILES, 'readonly', (store) => store.get(userId));
}

export async function getAllUserProfiles(): Promise<ArgusUserProfile[]> {
  return doTransaction(STORES.USER_PROFILES, 'readonly', (store) => store.getAll());
}

export async function deleteUserProfile(userId: string): Promise<void> {
  await doTransaction(STORES.USER_PROFILES, 'readwrite', (store) => store.delete(userId));
}

// ─── Username History ────────────────────────────────────────────

export async function addUsernameRecord(
  userId: string,
  record: UsernameRecord,
): Promise<void> {
  await doTransaction(STORES.USERNAME_HISTORY, 'readwrite', (store) => store.add({ userId, ...record }));
}

export async function getUsernameHistory(userId: string): Promise<UsernameRecord[]> {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.USERNAME_HISTORY, 'readonly');
    const store = tx.objectStore(STORES.USERNAME_HISTORY);
    const index = store.index('userId');
    const req = index.getAll(userId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}

// ─── Bio History ─────────────────────────────────────────────────

export async function addBioRecord(userId: string, record: BioRecord): Promise<void> {
  await doTransaction(STORES.BIO_HISTORY, 'readwrite', (store) => store.add({ userId, ...record }));
}

export async function getBioHistory(userId: string): Promise<BioRecord[]> {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.BIO_HISTORY, 'readonly');
    const store = tx.objectStore(STORES.BIO_HISTORY);
    const index = store.index('userId');
    const req = index.getAll(userId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}

// ─── Network Graph ───────────────────────────────────────────────

const NETWORK_GRAPH_KEY = 'main';

export async function getNetworkGraph(): Promise<NetworkGraph> {
  const result = await doTransaction<NetworkGraph | undefined>(
    STORES.NETWORK_GRAPH,
    'readonly',
    (store) => store.get(NETWORK_GRAPH_KEY),
  );
  return result || { nodes: {}, edges: [], lastUpdated: Date.now() };
}

export async function saveNetworkGraph(graph: NetworkGraph): Promise<void> {
  await doTransaction(STORES.NETWORK_GRAPH, 'readwrite', (store) => store.put({
    ...graph,
    id: NETWORK_GRAPH_KEY,
    lastUpdated: Date.now(),
  }));
}

export async function addNetworkNode(node: NetworkNode): Promise<void> {
  const graph = await getNetworkGraph();
  graph.nodes[node.userId] = node;
  await saveNetworkGraph(graph);
}

export async function addNetworkEdge(edge: NetworkEdge): Promise<void> {
  const graph = await getNetworkGraph();

  // Check for existing edge and update weight
  const existingIdx = graph.edges.findIndex(
    (e) => e.sourceUserId === edge.sourceUserId
      && e.targetUserId === edge.targetUserId
      && e.edgeType === edge.edgeType,
  );

  if (existingIdx >= 0) {
    graph.edges[existingIdx].weight += 1;
    graph.edges[existingIdx].lastSeen = edge.lastSeen;
  } else {
    graph.edges.push(edge);
  }

  await saveNetworkGraph(graph);
}

// ─── Interactions ────────────────────────────────────────────────

export async function updateInteraction(record: InteractionRecord): Promise<void> {
  await doTransaction(STORES.INTERACTIONS, 'readwrite', (store) => store.put(record));
}

export async function getInteractionsByUser(userId: string): Promise<InteractionRecord[]> {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.INTERACTIONS, 'readonly');
    const store = tx.objectStore(STORES.INTERACTIONS);
    const index = store.index('userId');
    const req = index.getAll(userId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}

export async function getInteractionsByChat(chatId: string): Promise<InteractionRecord[]> {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.INTERACTIONS, 'readonly');
    const store = tx.objectStore(STORES.INTERACTIONS);
    const index = store.index('chatId');
    const req = index.getAll(chatId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}
