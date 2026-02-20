/**
 * Project Argus — Bot Minions: Telegram API Bridge
 * Taps into the existing GramJS client connection used by telegram-tt.
 * Provides a clean interface for minions to fetch data without creating separate connections.
 */

import { callApi } from '../../../api/gramjs';

/**
 * Fetch recent messages from a chat.
 * Uses the existing callApi infrastructure that routes through the GramJS web worker.
 */
export async function fetchChatMessages(
  chatId: string,
  limit: number = 50,
  offsetId?: number,
): Promise<BridgeMessage[]> {
  try {
    const result = await callApi('fetchMessages', {
      chat: { id: chatId, accessHash: '' } as any,
      limit,
      ...(offsetId ? { offsetId } : {}),
    });

    if (!result || !result.messages) return [];

    return result.messages.map((msg: any) => ({
      id: msg.id,
      chatId: msg.chatId,
      senderId: msg.senderId,
      date: msg.date,
      text: msg.content?.text?.text || '',
      mediaType: getMediaType(msg),
      hasMedia: !!(msg.content?.photo || msg.content?.video || msg.content?.document),
      isForwarded: !!msg.forwardInfo,
      forwardFromId: msg.forwardInfo?.fromChatId,
      views: msg.viewsCount,
      editDate: msg.editDate,
    }));
  } catch (error) {
    console.error(`[Argus:TelegramBridge] fetchChatMessages error for ${chatId}:`, error);
    return [];
  }
}

/**
 * Fetch chat/channel info
 */
export async function fetchChatInfo(chatId: string): Promise<BridgeChatInfo | undefined> {
  try {
    const result = await callApi('fetchFullChat', {
      chat: { id: chatId, accessHash: '' } as any,
    });

    if (!result) return undefined;

    return {
      id: chatId,
      title: (result as any).fullInfo?.title || (result as any).title || 'Unknown',
      description: (result as any).fullInfo?.about || '',
      username: (result as any).usernames?.[0]?.username || '',
      memberCount: (result as any).fullInfo?.membersCount || 0,
      isChannel: (result as any).type === 'chatTypeChannel',
      isGroup: (result as any).type === 'chatTypeSuperGroup' || (result as any).type === 'chatTypeBasicGroup',
      photo: (result as any).avatarHash || undefined,
    };
  } catch (error) {
    console.error(`[Argus:TelegramBridge] fetchChatInfo error for ${chatId}:`, error);
    return undefined;
  }
}

/**
 * Fetch members of a group/supergroup
 */
export async function fetchChatMembers(
  chatId: string,
  limit: number = 200,
): Promise<BridgeMember[]> {
  try {
    const result = await callApi('fetchMembers', {
      chat: { id: chatId, accessHash: '' } as any,
      type: 'recent' as any,
      offset: 0,
      limit,
    });

    if (!result || !result.members) return [];

    return result.members.map((member: any) => ({
      userId: member.userId || member.id,
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      username: member.usernames?.[0]?.username || '',
      isBot: member.isBot || false,
      isPremium: member.isPremium || false,
      joinDate: member.joinDate || 0,
    }));
  } catch (error) {
    console.error(`[Argus:TelegramBridge] fetchChatMembers error for ${chatId}:`, error);
    return [];
  }
}

/**
 * Search for public channels/groups by keyword
 */
export async function searchPublicChats(query: string): Promise<BridgeChatInfo[]> {
  try {
    const result = await callApi('searchChats', {
      query,
    } as any);

    if (!result) return [];

    const chats = (result as any).globalChats || (result as any).chats || [];
    return chats.map((chat: any) => ({
      id: chat.id,
      title: chat.title || 'Unknown',
      description: chat.about || '',
      username: chat.usernames?.[0]?.username || '',
      memberCount: chat.membersCount || 0,
      isChannel: chat.type === 'chatTypeChannel',
      isGroup: chat.type === 'chatTypeSuperGroup' || chat.type === 'chatTypeBasicGroup',
      photo: chat.avatarHash || undefined,
    }));
  } catch (error) {
    console.error('[Argus:TelegramBridge] searchPublicChats error:', error);
    return [];
  }
}

/**
 * Download media from a message (returns blob URL)
 */
export async function downloadMessageMedia(
  chatId: string,
  messageId: number,
): Promise<string | undefined> {
  try {
    const result = await callApi('downloadMedia', {
      media: { chatId, messageId } as any,
    } as any);

    if (!result) return undefined;
    return result as unknown as string;
  } catch (error) {
    console.error(`[Argus:TelegramBridge] downloadMessageMedia error:`, error);
    return undefined;
  }
}

// ─── Bridge Types ────────────────────────────────────────────────

export interface BridgeMessage {
  id: number;
  chatId: string;
  senderId?: string;
  date: number;
  text: string;
  mediaType?: 'photo' | 'video' | 'document' | 'audio' | 'voice' | 'sticker';
  hasMedia: boolean;
  isForwarded: boolean;
  forwardFromId?: string;
  views?: number;
  editDate?: number;
}

export interface BridgeChatInfo {
  id: string;
  title: string;
  description: string;
  username: string;
  memberCount: number;
  isChannel: boolean;
  isGroup: boolean;
  photo?: string;
}

export interface BridgeMember {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  isBot: boolean;
  isPremium: boolean;
  joinDate: number;
}

// ─── Helpers ─────────────────────────────────────────────────────

function getMediaType(msg: any): BridgeMessage['mediaType'] | undefined {
  if (msg.content?.photo) return 'photo';
  if (msg.content?.video) return 'video';
  if (msg.content?.document) return 'document';
  if (msg.content?.audio) return 'audio';
  if (msg.content?.voice) return 'voice';
  if (msg.content?.sticker) return 'sticker';
  return undefined;
}
