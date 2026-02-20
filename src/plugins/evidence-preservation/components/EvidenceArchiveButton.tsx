/**
 * Project Argus — Evidence Archive Button
 * One-click archive button that can be placed on messages, conversations, or channels.
 */

import {
  memo, useCallback, useState,
} from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';
import type { ApiChat, ApiMessage, ApiUser } from '../../../api/types';
import {
  selectChat,
  selectChatMessages,
  selectUser,
} from '../../../global/selectors';
import type { ArchiveScope, EvidenceItem } from '../types';
import { createEvidenceFromMessages } from '../helpers/archiver';
import { addCustodyEntry } from '../helpers/archiver';
import styles from '../styles/EvidencePanel.module.scss';

type OwnProps = {
  chatId: string;
  messageIds?: number[];
  scope: ArchiveScope;
  onArchiveComplete?: (evidence: EvidenceItem) => void;
};

type StateProps = {
  chat?: ApiChat;
  messagesById?: Record<number, ApiMessage>;
  usersById: Record<string, ApiUser>;
  currentUserId?: string;
};

const EvidenceArchiveButton = ({
  chatId,
  messageIds,
  scope,
  onArchiveComplete,
  chat,
  messagesById,
  usersById,
  currentUserId,
}: OwnProps & StateProps) => {
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveResult, setArchiveResult] = useState<'success' | 'error' | undefined>();
  const [lastEvidenceId, setLastEvidenceId] = useState<string | undefined>();

  const handleArchive = useCallback(async () => {
    if (isArchiving || !messagesById || !chat) return;

    setIsArchiving(true);
    setArchiveResult(undefined);

    try {
      // Determine which messages to archive
      let messagesToArchive: ApiMessage[];

      if (messageIds && messageIds.length > 0) {
        messagesToArchive = messageIds
          .map((id) => messagesById[id])
          .filter(Boolean);
      } else {
        // Archive all available messages in the chat
        messagesToArchive = Object.values(messagesById)
          .sort((a, b) => a.date - b.date);
      }

      if (messagesToArchive.length === 0) {
        setArchiveResult('error');
        setIsArchiving(false);
        return;
      }

      const evidence = await createEvidenceFromMessages({
        messages: messagesToArchive,
        chatId,
        chatTitle: chat.title || 'Unknown Chat',
        usersById,
        scope,
        investigatorId: currentUserId,
      });

      setLastEvidenceId(evidence.evidenceId);
      setArchiveResult('success');

      if (onArchiveComplete) {
        onArchiveComplete(evidence);
      }
    } catch (err) {
      console.error('[Argus] Archive failed:', err);
      setArchiveResult('error');
    } finally {
      setIsArchiving(false);
    }
  }, [isArchiving, messagesById, chat, messageIds, chatId, usersById, scope, currentUserId, onArchiveComplete]);

  const scopeLabel = getScopeLabel(scope);
  const buttonIcon = isArchiving ? '\u23F3' : '\uD83D\uDCE6';

  return (
    <div>
      <button
        className={styles.archiveBtn}
        onClick={handleArchive}
        disabled={isArchiving}
        title={`Archive ${scopeLabel}`}
      >
        <span className={styles.archiveBtnIcon}>{buttonIcon}</span>
        {isArchiving ? 'Archiving...' : `Archive ${scopeLabel}`}
      </button>

      {archiveResult === 'success' && (
        <div className={styles.successMessage}>
          &#9989; Archived successfully
          {lastEvidenceId && ` (${lastEvidenceId})`}
        </div>
      )}

      {archiveResult === 'error' && (
        <div className={styles.errorMessage}>
          &#10060; Archive failed — no messages found
        </div>
      )}
    </div>
  );
};

function getScopeLabel(scope: ArchiveScope): string {
  switch (scope) {
    case 'message': return 'Message';
    case 'selection': return 'Selection';
    case 'conversation': return 'Conversation';
    case 'channel': return 'Channel';
    default: return 'Evidence';
  }
}

export default memo(withGlobal<OwnProps>((global, { chatId }): StateProps => {
  const chat = selectChat(global, chatId);
  const messagesById = selectChatMessages(global, chatId);

  return {
    chat,
    messagesById,
    usersById: global.users.byId,
    currentUserId: global.currentUserId,
  };
})(EvidenceArchiveButton));
