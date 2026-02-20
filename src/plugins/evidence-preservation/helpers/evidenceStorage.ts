/**
 * Project Argus — Evidence Storage Manager
 * IndexedDB-backed storage for archived evidence items and their metadata.
 */

import type {
  EvidenceCatalog,
  EvidenceCatalogEntry,
  EvidenceItem,
  EvidenceStatus,
  MediaArchiveEntry,
} from '../types';

const DB_NAME = 'argus-evidence-preservation';
const DB_VERSION = 1;

const STORES = {
  EVIDENCE: 'evidence',
  MEDIA: 'media',
  CATALOG: 'catalog',
} as const;

let dbInstance: IDBDatabase | undefined;

function openDb(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.EVIDENCE)) {
        const evidenceStore = db.createObjectStore(STORES.EVIDENCE, { keyPath: 'evidenceId' });
        evidenceStore.createIndex('chatId', 'chatId', { unique: false });
        evidenceStore.createIndex('capturedAt', 'capturedAt', { unique: false });
        evidenceStore.createIndex('status', 'status', { unique: false });
        evidenceStore.createIndex('sha256Hash', 'sha256Hash', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.MEDIA)) {
        const mediaStore = db.createObjectStore(STORES.MEDIA, { keyPath: 'fileId' });
        mediaStore.createIndex('chatId', 'chatId', { unique: false });
        mediaStore.createIndex('messageId', 'messageId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.CATALOG)) {
        db.createObjectStore(STORES.CATALOG, { keyPath: 'evidenceId' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(new Error(`[Argus] Failed to open evidence DB: ${request.error?.message}`));
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

// ─── Evidence Items ──────────────────────────────────────────────

export async function saveEvidence(item: EvidenceItem): Promise<void> {
  await doTransaction(STORES.EVIDENCE, 'readwrite', (store) => store.put(item));

  // Update catalog
  const catalogEntry: EvidenceCatalogEntry = {
    evidenceId: item.evidenceId,
    title: item.title,
    chatTitle: item.chatTitle,
    messageCount: item.messages.length,
    mediaCount: item.mediaFiles.length,
    capturedAt: item.capturedAt,
    status: item.status,
    sha256Hash: item.sha256Hash,
    tags: item.tags,
  };
  await doTransaction(STORES.CATALOG, 'readwrite', (store) => store.put(catalogEntry));
}

export async function getEvidence(evidenceId: string): Promise<EvidenceItem | undefined> {
  return doTransaction(STORES.EVIDENCE, 'readonly', (store) => store.get(evidenceId));
}

export async function getAllEvidence(): Promise<EvidenceItem[]> {
  return doTransaction(STORES.EVIDENCE, 'readonly', (store) => store.getAll());
}

export async function getEvidenceByChatId(chatId: string): Promise<EvidenceItem[]> {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.EVIDENCE, 'readonly');
    const store = tx.objectStore(STORES.EVIDENCE);
    const index = store.index('chatId');
    const req = index.getAll(chatId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}

export async function updateEvidenceStatus(
  evidenceId: string,
  status: EvidenceStatus,
): Promise<void> {
  const item = await getEvidence(evidenceId);
  if (!item) return;
  item.status = status;
  await saveEvidence(item);
}

export async function deleteEvidence(evidenceId: string): Promise<void> {
  await doTransaction(STORES.EVIDENCE, 'readwrite', (store) => store.delete(evidenceId));
  await doTransaction(STORES.CATALOG, 'readwrite', (store) => store.delete(evidenceId));
}

// ─── Media Files ─────────────────────────────────────────────────

export async function saveMediaEntry(entry: MediaArchiveEntry): Promise<void> {
  await doTransaction(STORES.MEDIA, 'readwrite', (store) => store.put(entry));
}

export async function getMediaEntry(fileId: string): Promise<MediaArchiveEntry | undefined> {
  return doTransaction(STORES.MEDIA, 'readonly', (store) => store.get(fileId));
}

export async function getMediaByChat(chatId: string): Promise<MediaArchiveEntry[]> {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.MEDIA, 'readonly');
    const store = tx.objectStore(STORES.MEDIA);
    const index = store.index('chatId');
    const req = index.getAll(chatId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}

// ─── Evidence Catalog ────────────────────────────────────────────

export async function getEvidenceCatalog(): Promise<EvidenceCatalog> {
  const items = await doTransaction<EvidenceCatalogEntry[]>(
    STORES.CATALOG,
    'readonly',
    (store) => store.getAll(),
  );

  return {
    totalItems: items.length,
    items: items.sort((a, b) => b.capturedAt - a.capturedAt),
    lastUpdated: Date.now(),
  };
}

export async function searchEvidence(query: string): Promise<EvidenceCatalogEntry[]> {
  const catalog = await getEvidenceCatalog();
  const lowerQuery = query.toLowerCase();

  return catalog.items.filter((item) => item.title.toLowerCase().includes(lowerQuery)
    || item.chatTitle.toLowerCase().includes(lowerQuery)
    || item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)));
}
