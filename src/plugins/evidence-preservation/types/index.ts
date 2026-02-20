/**
 * Project Argus — Evidence Preservation Types
 * Type definitions for message archiving, chain-of-custody, and evidence export.
 */

export type EvidenceStatus = 'pending' | 'archived' | 'exported' | 'verified';
export type ArchiveScope = 'message' | 'conversation' | 'channel' | 'selection';
export type ExportFormat = 'json' | 'pdf';

export interface ArchivedMessage {
  id: string;
  messageId: number;
  chatId: string;
  chatTitle: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  date: number;
  editDate?: number;
  text?: string;
  mediaType?: string;
  mediaFileId?: string;
  mediaFileName?: string;
  mediaLocalPath?: string;
  forwardFromId?: string;
  forwardFromName?: string;
  forwardDate?: number;
  replyToMessageId?: number;
  viewsCount?: number;
  isEdited: boolean;
  isForwarded: boolean;
  rawData: string;
}

export interface EvidenceItem {
  evidenceId: string;
  archiveScope: ArchiveScope;
  title: string;
  description?: string;
  chatId: string;
  chatTitle: string;
  messages: ArchivedMessage[];
  mediaFiles: MediaArchiveEntry[];
  capturedAt: number;
  capturedBy: string;
  sha256Hash: string;
  status: EvidenceStatus;
  tags: string[];
  notes: string;
  chainOfCustody: CustodyLogEntry[];
}

export interface MediaArchiveEntry {
  fileId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  sha256Hash: string;
  localPath?: string;
  capturedAt: number;
  messageId: number;
  chatId: string;
}

export interface CustodyLogEntry {
  timestamp: number;
  action: CustodyAction;
  actor: string;
  details: string;
  itemHash: string;
  previousHash?: string;
}

export type CustodyAction =
  | 'created'
  | 'archived'
  | 'media_downloaded'
  | 'exported'
  | 'verified'
  | 'modified'
  | 'accessed'
  | 'tagged'
  | 'noted';

export interface EvidenceCatalog {
  totalItems: number;
  items: EvidenceCatalogEntry[];
  lastUpdated: number;
}

export interface EvidenceCatalogEntry {
  evidenceId: string;
  title: string;
  chatTitle: string;
  messageCount: number;
  mediaCount: number;
  capturedAt: number;
  status: EvidenceStatus;
  sha256Hash: string;
  tags: string[];
}

export interface ExportOptions {
  format: ExportFormat;
  includeMedia: boolean;
  includeRawData: boolean;
  includeChainOfCustody: boolean;
  investigatorName?: string;
  caseNumber?: string;
  caseTitle?: string;
}

export interface EvidenceExportResult {
  format: ExportFormat;
  fileName: string;
  fileSize: number;
  sha256Hash: string;
  exportedAt: number;
  itemCount: number;
  blob: Blob;
}

export interface ArchiveRequest {
  scope: ArchiveScope;
  chatId: string;
  messageIds?: number[];
  startDate?: number;
  endDate?: number;
  includeMedia: boolean;
  tags?: string[];
  notes?: string;
}
