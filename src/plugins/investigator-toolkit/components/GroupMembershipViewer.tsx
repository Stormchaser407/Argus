/**
 * Project Argus — Group Membership Viewer
 * Shows public groups a user belongs to, using getCommonChats and group overlap analysis.
 */

import {
  memo, useCallback, useEffect, useMemo, useState,
} from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';
import type {
  ApiChat,
  ApiUser,
  ApiUserCommonChats,
} from '../../../api/types';
import {
  selectChat,
  selectUser,
  selectUserCommonChats,
} from '../../../global/selectors';
import buildClassName from '../../../util/buildClassName';
import type { GroupMembershipInfo } from '../types';
import styles from '../styles/UserProfilingPanel.module.scss';

type OwnProps = {
  userId: string;
};

type StateProps = {
  user?: ApiUser;
  commonChats?: ApiUserCommonChats;
  chatsById: Record<string, ApiChat>;
};

const GroupMembershipViewer = ({
  userId,
  user,
  commonChats,
  chatsById,
}: OwnProps & StateProps) => {
  const { loadCommonChats, openChat } = getActions();
  const [isExpanded, setIsExpanded] = useState(false);

  // Load common chats when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadCommonChats({ userId });
    }
  }, [userId, user]);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleOpenChat = useCallback((chatId: string) => {
    openChat({ id: chatId });
  }, []);

  // Build group membership info from common chats
  const groups: GroupMembershipInfo[] = useMemo(() => {
    if (!commonChats?.ids) return [];

    return commonChats.ids.map((chatId) => {
      const chat = chatsById[chatId];
      if (!chat) return undefined;

      const isChannel = chat.type === 'chatTypeChannel';
      const isGroup = chat.type === 'chatTypeSuperGroup' || chat.type === 'chatTypeBasicGroup';

      return {
        chatId,
        chatTitle: chat.title || 'Unknown',
        chatType: isChannel ? 'channel' as const : (chat.type === 'chatTypeSuperGroup' ? 'supergroup' as const : 'group' as const),
        memberCount: chat.membersCount,
        isPublic: Boolean(chat.usernames?.length),
        username: chat.usernames?.find((u) => u.isActive)?.username,
      };
    }).filter(Boolean) as GroupMembershipInfo[];
  }, [commonChats, chatsById]);

  const groupCount = groups.length;

  if (!user || groupCount === 0) return undefined;

  return (
    <div className={styles.groupsSection}>
      <div className={styles.header} onClick={handleToggleExpand}>
        <div className={styles.headerLeft}>
          <span className={styles.argusIcon}>&#128101;</span>
          <span className={styles.title}>
            GROUP MEMBERSHIP ({groupCount})
          </span>
        </div>
        <span className={buildClassName(
          styles.expandIcon,
          isExpanded && styles.expandIconRotated,
        )}
        >
          &#9660;
        </span>
      </div>

      <div className={buildClassName(
        styles.content,
        isExpanded ? styles.contentExpanded : styles.contentCollapsed,
      )}
      >
        {groups.map((group) => (
          <div
            key={group.chatId}
            className={styles.groupItem}
            onClick={() => handleOpenChat(group.chatId)}
          >
            <div className={styles.groupIcon}>
              {group.chatType === 'channel' ? 'CH' : 'GR'}
            </div>
            <div className={styles.groupInfo}>
              <div className={styles.groupTitle}>{group.chatTitle}</div>
              <div className={styles.groupMeta}>
                {group.chatType}
                {group.memberCount ? ` · ${formatMemberCount(group.memberCount)} members` : ''}
                {group.isPublic && group.username ? ` · @${group.username}` : ''}
              </div>
            </div>
          </div>
        ))}

        {!commonChats?.isFullyLoaded && (
          <div className={styles.loading}>Loading more groups...</div>
        )}
      </div>
    </div>
  );
};

function formatMemberCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

export default memo(withGlobal<OwnProps>((global, { userId }): StateProps => {
  const user = selectUser(global, userId);
  const commonChats = selectUserCommonChats(global, userId);

  return {
    user,
    commonChats,
    chatsById: global.chats.byId,
  };
})(GroupMembershipViewer));
