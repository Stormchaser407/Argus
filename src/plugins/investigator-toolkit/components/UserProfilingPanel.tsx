/**
 * Project Argus — User Profiling Panel
 * Enhanced user profile panel showing Telegram ID, registration date,
 * risk scoring, username history, and bio change tracking.
 */

import {
  memo, useCallback, useEffect, useMemo, useState,
} from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';
import type {
  ApiUser,
  ApiUserFullInfo,
  ApiUserStatus,
} from '../../../api/types';
import {
  selectUser,
  selectUserFullInfo,
  selectUserStatus,
} from '../../../global/selectors';
import buildClassName from '../../../util/buildClassName';
import { copyTextToClipboard } from '../../../util/clipboard';
import type { ArgusUserProfile, RiskLevel } from '../types';
import {
  calculateAccountAgeDays,
  calculateRiskScore,
  estimateRegistrationDate,
  formatAccountAge,
  formatRegistrationDate,
  getRiskLevel,
} from '../helpers/riskScoring';
import { getUserProfile, saveUserProfile } from '../helpers/storage';
import { updateArgusProfile } from '../helpers/profileTracker';
import styles from '../styles/UserProfilingPanel.module.scss';

type OwnProps = {
  userId: string;
};

type StateProps = {
  user?: ApiUser;
  userFullInfo?: ApiUserFullInfo;
  userStatus?: ApiUserStatus;
};

const RISK_STYLE_MAP: Record<RiskLevel, string> = {
  critical: styles.riskCritical,
  high: styles.riskHigh,
  medium: styles.riskMedium,
  low: styles.riskLow,
  minimal: styles.riskMinimal,
};

const UserProfilingPanel = ({
  userId,
  user,
  userFullInfo,
  userStatus,
}: OwnProps & StateProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [argusProfile, setArgusProfile] = useState<ArgusUserProfile | undefined>();
  const [copiedField, setCopiedField] = useState<string | undefined>();

  // Build/update the Argus profile when user data changes
  useEffect(() => {
    if (!user) return;

    updateArgusProfile(user, userFullInfo).then((profile) => {
      setArgusProfile(profile);
    }).catch((err) => {
      console.error('[Argus] Failed to update profile:', err);
    });
  }, [user, userFullInfo]);

  // Also load existing profile on mount
  useEffect(() => {
    getUserProfile(userId).then((profile) => {
      if (profile) setArgusProfile(profile);
    }).catch(() => {});
  }, [userId]);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleCopyId = useCallback(() => {
    copyTextToClipboard(userId);
    setCopiedField('id');
    setTimeout(() => setCopiedField(undefined), 2000);
  }, [userId]);

  // Computed values
  const registrationDate = useMemo(() => estimateRegistrationDate(userId), [userId]);
  const accountAgeDays = useMemo(
    () => (registrationDate ? calculateAccountAgeDays(registrationDate) : undefined),
    [registrationDate],
  );

  const riskScore = useMemo(() => {
    if (!user) return 0;
    return calculateRiskScore({
      accountAgeDays: accountAgeDays || 0,
      hasProfilePhoto: Boolean(user.avatarPhotoId),
      hasBio: Boolean(userFullInfo?.bio),
      hasUsername: Boolean(user.usernames?.length),
      isPremium: Boolean(user.isPremium),
      isVerified: Boolean(user.isVerified),
      commonChatsCount: userFullInfo?.commonChatsCount || 0,
    });
  }, [user, userFullInfo, accountAgeDays]);

  const riskLevel = useMemo(() => getRiskLevel(riskScore), [riskScore]);

  if (!user) return undefined;

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header} onClick={handleToggleExpand}>
        <div className={styles.headerLeft}>
          <span className={styles.argusIcon}>&#128065;</span>
          <span className={styles.title}>ARGUS INTEL</span>
        </div>
        <span className={buildClassName(
          styles.expandIcon,
          isExpanded && styles.expandIconRotated,
        )}
        >
          &#9660;
        </span>
      </div>

      {/* Collapsible Content */}
      <div className={buildClassName(
        styles.content,
        isExpanded ? styles.contentExpanded : styles.contentCollapsed,
      )}
      >
        {/* Telegram ID */}
        <div className={styles.idSection}>
          <span className={styles.idLabel}>Telegram ID</span>
          <span className={styles.idValue} onClick={handleCopyId} title="Click to copy">
            {userId}
            {copiedField === 'id' && <span className={styles.copyTooltip}>Copied!</span>}
          </span>
        </div>

        {/* Registration Date */}
        {registrationDate && (
          <div className={styles.regDateSection}>
            <div className={styles.regDateRow}>
              <span className={styles.regDateLabel}>Registration Date (est.)</span>
              <span className={styles.regDateValue}>
                {formatRegistrationDate(registrationDate)}
              </span>
            </div>
            {accountAgeDays !== undefined && (
              <div className={styles.accountAge}>
                Account age: {formatAccountAge(accountAgeDays)}
              </div>
            )}
          </div>
        )}

        {/* Risk Score */}
        <div className={styles.riskSection}>
          <div className={styles.riskHeader}>
            <span className={styles.riskLabel}>Risk Assessment</span>
            <span className={buildClassName(styles.riskBadge, RISK_STYLE_MAP[riskLevel])}>
              {riskLevel}
            </span>
          </div>
          <div className={styles.riskBar}>
            <div
              className={styles.riskBarFill}
              style={`width: ${riskScore}%; background-color: ${getRiskColor(riskLevel)}`}
            />
          </div>
          <div className={styles.riskScoreText}>
            Score: {riskScore}/100
          </div>
        </div>

        {/* Username History */}
        {argusProfile && argusProfile.usernameHistory.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.sectionLabel}>
              Username History ({argusProfile.usernameHistory.length})
            </div>
            <ul className={styles.historyList}>
              {argusProfile.usernameHistory.map((record) => (
                <li className={styles.historyItem} key={`${record.username}-${record.firstSeen}`}>
                  <span className={buildClassName(
                    styles.historyUsername,
                    record.isActive && styles.historyActive,
                  )}
                  >
                    @{record.username}
                  </span>
                  <span className={styles.historyDate}>
                    {new Date(record.firstSeen * 1000).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bio History */}
        {argusProfile && argusProfile.bioHistory.length > 1 && (
          <div className={styles.historySection}>
            <div className={styles.sectionLabel}>
              Bio Changes ({argusProfile.bioHistory.length})
            </div>
            {argusProfile.bioHistory.slice(-5).reverse().map((record) => (
              <div className={styles.bioItem} key={record.capturedAt}>
                <div className={styles.bioText}>{record.bio}</div>
                <div className={styles.bioDate}>
                  {new Date(record.capturedAt * 1000).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile Flags */}
        <div className={styles.historySection}>
          <div className={styles.sectionLabel}>Profile Flags</div>
          <div className={styles.historyList}>
            {user.isPremium && (
              <div className={styles.historyItem}>
                <span>&#11088; Premium Account</span>
              </div>
            )}
            {user.isVerified && (
              <div className={styles.historyItem}>
                <span>&#9989; Verified</span>
              </div>
            )}
            {user.type === 'userTypeBot' && (
              <div className={styles.historyItem}>
                <span>&#129302; Bot Account</span>
              </div>
            )}
            {!user.avatarPhotoId && (
              <div className={styles.historyItem}>
                <span style="color: var(--color-error)">&#9888; No Profile Photo</span>
              </div>
            )}
            {!userFullInfo?.bio && (
              <div className={styles.historyItem}>
                <span style="color: var(--color-error)">&#9888; No Bio Set</span>
              </div>
            )}
            {userFullInfo?.commonChatsCount !== undefined && (
              <div className={styles.historyItem}>
                <span>Common Groups: {userFullInfo.commonChatsCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    critical: '#FF3B30',
    high: '#FF9500',
    medium: '#FFCC00',
    low: '#34C759',
    minimal: '#007AFF',
  };
  return colors[level];
}

export default memo(withGlobal<OwnProps>((global, { userId }): StateProps => {
  const user = selectUser(global, userId);
  const userFullInfo = selectUserFullInfo(global, userId);
  const userStatus = selectUserStatus(global, userId);

  return {
    user,
    userFullInfo,
    userStatus,
  };
})(UserProfilingPanel));
