/**
 * Project Argus — Network Mapping Panel
 * Displays forwarded message connections, interaction patterns, and relationship data.
 */

import {
  memo, useCallback, useEffect, useMemo, useState,
} from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';
import type { ApiUser } from '../../../api/types';
import { selectUser } from '../../../global/selectors';
import buildClassName from '../../../util/buildClassName';
import type { NetworkEdge, NetworkNode } from '../types';
import { getUserConnections, getTopConnectedUsers } from '../helpers/networkMapper';
import styles from '../styles/UserProfilingPanel.module.scss';

type OwnProps = {
  userId: string;
};

type StateProps = {
  user?: ApiUser;
  usersById: Record<string, ApiUser>;
};

interface ConnectionDisplay {
  userId: string;
  displayName: string;
  edgeType: string;
  weight: number;
  direction: 'incoming' | 'outgoing';
  lastSeen: number;
}

const NetworkMappingPanel = ({
  userId,
  user,
  usersById,
}: OwnProps & StateProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [connections, setConnections] = useState<ConnectionDisplay[]>([]);
  const [incomingCount, setIncomingCount] = useState(0);
  const [outgoingCount, setOutgoingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    getUserConnections(userId).then(({ incoming, outgoing, nodes }) => {
      const displays: ConnectionDisplay[] = [];

      incoming.forEach((edge) => {
        const sourceUser = usersById[edge.sourceUserId];
        displays.push({
          userId: edge.sourceUserId,
          displayName: sourceUser
            ? [sourceUser.firstName, sourceUser.lastName].filter(Boolean).join(' ')
              || sourceUser.usernames?.[0]?.username
              || edge.sourceUserId
            : edge.sourceUserId,
          edgeType: edge.edgeType,
          weight: edge.weight,
          direction: 'incoming',
          lastSeen: edge.lastSeen,
        });
      });

      outgoing.forEach((edge) => {
        const targetUser = usersById[edge.targetUserId];
        displays.push({
          userId: edge.targetUserId,
          displayName: targetUser
            ? [targetUser.firstName, targetUser.lastName].filter(Boolean).join(' ')
              || targetUser.usernames?.[0]?.username
              || edge.targetUserId
            : edge.targetUserId,
          edgeType: edge.edgeType,
          weight: edge.weight,
          direction: 'outgoing',
          lastSeen: edge.lastSeen,
        });
      });

      // Sort by weight (most interactions first)
      displays.sort((a, b) => b.weight - a.weight);

      setConnections(displays);
      setIncomingCount(incoming.length);
      setOutgoingCount(outgoing.length);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [userId, usersById]);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const totalConnections = incomingCount + outgoingCount;

  if (!user) return undefined;

  return (
    <div className={styles.networkSection}>
      <div className={styles.header} onClick={handleToggleExpand}>
        <div className={styles.headerLeft}>
          <span className={styles.argusIcon}>&#128279;</span>
          <span className={styles.title}>
            NETWORK MAP ({totalConnections})
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
        {isLoading && (
          <div className={styles.loading}>Analyzing network...</div>
        )}

        {!isLoading && totalConnections === 0 && (
          <div className={styles.emptyState}>
            No network data yet. Forward tracking builds over time as messages are viewed.
          </div>
        )}

        {!isLoading && totalConnections > 0 && (
          <div>
            {/* Network Stats */}
            <div className={styles.networkStats}>
              <div className={styles.networkStat}>
                <div className={styles.networkStatValue}>{incomingCount}</div>
                <div className={styles.networkStatLabel}>Forwarded From</div>
              </div>
              <div className={styles.networkStat}>
                <div className={styles.networkStatValue}>{outgoingCount}</div>
                <div className={styles.networkStatLabel}>Forwarded To</div>
              </div>
            </div>

            {/* Connection List */}
            <div className={styles.sectionLabel}>
              Top Connections
            </div>
            {connections.slice(0, 15).map((conn) => (
              <div key={`${conn.userId}-${conn.edgeType}-${conn.direction}`} className={styles.connectionItem}>
                <span className={styles.connectionName}>
                  {conn.direction === 'incoming' ? '\u2190 ' : '\u2192 '}
                  {conn.displayName}
                </span>
                <span className={styles.connectionType}>
                  {conn.edgeType} ({conn.weight})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(withGlobal<OwnProps>((global, { userId }): StateProps => {
  const user = selectUser(global, userId);

  return {
    user,
    usersById: global.users.byId,
  };
})(NetworkMappingPanel));
