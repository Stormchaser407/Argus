/**
 * Project Argus — Profile Tracker
 * Monitors and records changes to user profiles (usernames, bios, photos).
 */

import type { ApiUser, ApiUserFullInfo } from '../../../api/types';
import type { ArgusUserProfile, BioRecord, UsernameRecord } from '../types';
import {
  calculateAccountAgeDays,
  calculateRiskScore,
  estimateRegistrationDate,
  getRiskLevel,
} from './riskScoring';
import {
  addBioRecord,
  addUsernameRecord,
  getBioHistory,
  getUsernameHistory,
  getUserProfile,
  saveUserProfile,
} from './storage';

/**
 * Build or update an Argus user profile from Telegram API data.
 * Detects and records changes to usernames and bios.
 */
export async function updateArgusProfile(
  user: ApiUser,
  fullInfo?: ApiUserFullInfo,
): Promise<ArgusUserProfile> {
  const now = Math.floor(Date.now() / 1000);
  const existing = await getUserProfile(user.id);

  // Estimate registration date from user ID
  const registrationDate = estimateRegistrationDate(user.id);
  const accountAgeDays = registrationDate ? calculateAccountAgeDays(registrationDate) : undefined;

  // Track username changes
  const currentUsername = user.usernames?.find((u) => u.isActive)?.username
    || user.usernames?.[0]?.username;

  if (currentUsername) {
    await trackUsernameChange(user.id, currentUsername, now, existing);
  }

  // Track bio changes
  if (fullInfo?.bio) {
    await trackBioChange(user.id, fullInfo.bio, now, existing);
  }

  // Fetch stored history
  const usernameHistory = await getUsernameHistory(user.id);
  const bioHistory = await getBioHistory(user.id);

  // Calculate risk score
  const riskScore = calculateRiskScore({
    accountAgeDays: accountAgeDays || 0,
    hasProfilePhoto: Boolean(user.avatarPhotoId),
    hasBio: Boolean(fullInfo?.bio),
    hasUsername: Boolean(currentUsername),
    isPremium: Boolean(user.isPremium),
    isVerified: Boolean(user.isVerified),
    commonChatsCount: fullInfo?.commonChatsCount || 0,
  });

  const profile: ArgusUserProfile = {
    userId: user.id,
    telegramId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: currentUsername,
    bio: fullInfo?.bio,
    registrationDate,
    accountAgeDays,
    riskLevel: getRiskLevel(riskScore),
    riskScore,
    usernameHistory: usernameHistory.map((r) => ({
      username: r.username,
      firstSeen: r.firstSeen,
      lastSeen: r.lastSeen,
      isActive: r.isActive,
    })),
    bioHistory: bioHistory.map((r) => ({
      bio: r.bio,
      capturedAt: r.capturedAt,
    })),
    profilePhotoCount: undefined,
    isPremium: user.isPremium,
    isVerified: user.isVerified,
    isBot: user.type === 'userTypeBot',
    commonChatsCount: fullInfo?.commonChatsCount,
    firstSeenTimestamp: existing?.firstSeenTimestamp || now,
    lastUpdatedTimestamp: now,
  };

  await saveUserProfile(profile);
  return profile;
}

/**
 * Track a username change for a user.
 */
async function trackUsernameChange(
  userId: string,
  currentUsername: string,
  now: number,
  existing?: ArgusUserProfile,
): Promise<void> {
  const history = await getUsernameHistory(userId);
  const lastRecord = history[history.length - 1];

  if (!lastRecord || lastRecord.username !== currentUsername) {
    // Mark previous username as inactive
    if (lastRecord) {
      lastRecord.isActive = false;
      lastRecord.lastSeen = now;
    }

    // Add new username record
    await addUsernameRecord(userId, {
      username: currentUsername,
      firstSeen: now,
      lastSeen: now,
      isActive: true,
    });
  } else {
    // Update lastSeen for current username
    lastRecord.lastSeen = now;
  }
}

/**
 * Track a bio change for a user.
 */
async function trackBioChange(
  userId: string,
  currentBio: string,
  now: number,
  existing?: ArgusUserProfile,
): Promise<void> {
  const history = await getBioHistory(userId);
  const lastRecord = history[history.length - 1];

  if (!lastRecord || lastRecord.bio !== currentBio) {
    await addBioRecord(userId, {
      bio: currentBio,
      capturedAt: now,
    });
  }
}

/**
 * Get a formatted profile summary for display.
 */
export function getProfileSummary(profile: ArgusUserProfile): {
  displayName: string;
  riskBadge: string;
  accountInfo: string;
  changeCount: number;
} {
  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
    || profile.username
    || `User ${profile.userId}`;

  const riskBadge = `${profile.riskLevel.toUpperCase()} (${profile.riskScore}/100)`;

  const accountInfo = profile.accountAgeDays !== undefined
    ? `Account age: ${profile.accountAgeDays} days`
    : 'Account age: Unknown';

  const changeCount = profile.usernameHistory.length + profile.bioHistory.length;

  return { displayName, riskBadge, accountInfo, changeCount };
}
