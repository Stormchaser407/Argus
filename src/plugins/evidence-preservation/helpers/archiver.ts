/**
 * Project Argus — Message Archiver
 * Handles one-click archiving of messages, conversations, and channels
 * with full metadata preservation.
 */

import type { ApiMessage, ApiUser, ApiChat } from '../../../api/types';
import type {
  ArchiveRequest,
  ArchivedMessage,
  CustodyLogEntry,
  EvidenceItem,
  MediaArchiveEntry,
} from '../types';
import { sha256, createCustodyLogEntry } from './hashing';
import { saveEvidence } from './evidenceStorage';

/**
 * Generate a unique evidence ID.
 */
function generateEvidenceId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `ARG-${timestamp}-${random}`.toUpperCase();
}

/**
 * Convert an API message to an archived message format with full metadata.
 */
export function archiveMessage(
  message: ApiMessage,
  chatTitle: string,
  usersById: Record<string, ApiUser>,
): ArchivedMessage {
  const sender = message.senderId ? usersById[message.senderId] : undefined;
  const senderName = sender
    ? [sender.firstName, sender.lastName].filter(Boolean).join(' ')
    : undefined;
  const senderUsername = sender?.usernames?.find((u) => u.isActive)?.username;

  // Extract text content
  const text = message.content.text?.text;

  // Determine media type
  let mediaType: string | undefined;
  let mediaFileName: string | undefined;
  if (message.content.photo) {
    mediaType = 'photo';
  } else if (message.content.video) {
    mediaType = 'video';
    mediaFileName = message.content.video.fileName;
  } else if (message.content.document) {
    mediaType = 'document';
    mediaFileName = message.content.document.fileName;
  } else if (message.content.audio) {
    mediaType = 'audio';
    mediaFileName = message.content.audio.fileName;
  } else if (message.content.voice) {
    mediaType = 'voice';
  } else if (message.content.sticker) {
    mediaType = 'sticker';
  }

  return {
    id: `${message.chatId}-${message.id}`,
    messageId: message.id,
    chatId: message.chatId,
    chatTitle,
    senderId: message.senderId,
    senderName,
    senderUsername,
    date: message.date,
    editDate: message.editDate,
    text,
    mediaType,
    mediaFileName,
    forwardFromId: message.forwardInfo?.fromId || message.forwardInfo?.fromChatId,
    forwardFromName: message.forwardInfo?.hiddenUserName || message.forwardInfo?.postAuthorTitle,
    forwardDate: message.forwardInfo?.date,
    replyToMessageId: message.replyInfo && 'replyToMsgId' in message.replyInfo
      ? message.replyInfo.replyToMsgId
      : undefined,
    viewsCount: message.viewsCount,
    isEdited: Boolean(message.isEdited),
    isForwarded: Boolean(message.forwardInfo),
    rawData: JSON.stringify(message),
  };
}

/**
 * Create an evidence item from a set of messages.
 * This is the main archiving function — one-click archive.
 */
export async function createEvidenceFromMessages(params: {
  messages: ApiMessage[];
  chatId: string;
  chatTitle: string;
  usersById: Record<string, ApiUser>;
  scope: ArchiveRequest['scope'];
  investigatorId?: string;
  tags?: string[];
  notes?: string;
}): Promise<EvidenceItem> {
  const {
    messages, chatId, chatTitle, usersById,
    scope, investigatorId, tags, notes,
  } = params;

  const evidenceId = generateEvidenceId();
  const capturedAt = Math.floor(Date.now() / 1000);
  const actor = investigatorId || 'unknown';

  // Archive all messages
  const archivedMessages = messages.map((msg) => archiveMessage(msg, chatTitle, usersById));

  // Compute SHA-256 hash of the entire evidence package
  const evidenceData = JSON.stringify({
    evidenceId,
    messages: archivedMessages,
    capturedAt,
    chatId,
  });
  const evidenceHash = await sha256(evidenceData);

  // Create initial chain-of-custody entry
  const genesisEntry = await createCustodyLogEntry({
    action: 'created',
    actor,
    details: `Evidence package created: ${archivedMessages.length} messages from "${chatTitle}"`,
    itemData: evidenceData,
  });

  const archiveEntry = await createCustodyLogEntry({
    action: 'archived',
    actor,
    details: `Messages archived with SHA-256 hash: ${evidenceHash}`,
    itemData: evidenceHash,
    previousHash: genesisEntry.itemHash,
  });

  // Build the evidence item
  const evidenceItem: EvidenceItem = {
    evidenceId,
    archiveScope: scope,
    title: `${chatTitle} — ${formatScopeLabel(scope)} (${archivedMessages.length} msgs)`,
    description: notes,
    chatId,
    chatTitle,
    messages: archivedMessages,
    mediaFiles: [],
    capturedAt,
    capturedBy: actor,
    sha256Hash: evidenceHash,
    status: 'archived',
    tags: tags || [],
    notes: notes || '',
    chainOfCustody: [genesisEntry, archiveEntry],
  };

  // Persist to IndexedDB
  await saveEvidence(evidenceItem);

  console.log(`[Argus] Evidence archived: ${evidenceId} (${archivedMessages.length} messages, hash: ${evidenceHash.substring(0, 16)}...)`);

  return evidenceItem;
}

/**
 * Add a chain-of-custody entry to an existing evidence item.
 */
export async function addCustodyEntry(
  evidenceItem: EvidenceItem,
  action: CustodyLogEntry['action'],
  actor: string,
  details: string,
): Promise<EvidenceItem> {
  const lastEntry = evidenceItem.chainOfCustody[evidenceItem.chainOfCustody.length - 1];

  const newEntry = await createCustodyLogEntry({
    action,
    actor,
    details,
    itemData: evidenceItem.sha256Hash,
    previousHash: lastEntry?.itemHash,
  });

  evidenceItem.chainOfCustody.push(newEntry);
  await saveEvidence(evidenceItem);

  return evidenceItem;
}

function formatScopeLabel(scope: ArchiveRequest['scope']): string {
  switch (scope) {
    case 'message': return 'Single Message';
    case 'selection': return 'Selected Messages';
    case 'conversation': return 'Conversation';
    case 'channel': return 'Full Channel';
    default: return 'Archive';
  }
}
