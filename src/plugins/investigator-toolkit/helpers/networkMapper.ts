/**
 * Project Argus — Network Mapper
 * Tracks forwarded messages, replies, and mentions to build relationship graphs.
 */

import type { ApiMessage } from '../../../api/types';
import type { ForwardTraceEntry, InteractionRecord, NetworkEdge, NetworkNode } from '../types';
import {
  addNetworkEdge,
  addNetworkNode,
  getInteractionsByChat,
  getInteractionsByUser,
  getNetworkGraph,
  updateInteraction,
} from './storage';

/**
 * Process a message to extract network relationship data.
 * Tracks forwards, replies, and mentions to build the network graph.
 */
export async function processMessageForNetwork(message: ApiMessage): Promise<void> {
  const { senderId, chatId, forwardInfo, date } = message;

  if (!senderId) return;

  // Ensure sender node exists
  await addNetworkNode({
    userId: senderId,
    displayName: senderId,
    connectionCount: 0,
  });

  // Track forwarded messages
  if (forwardInfo) {
    const forwardSourceId = forwardInfo.fromId || forwardInfo.fromChatId;
    if (forwardSourceId && forwardSourceId !== senderId) {
      await addNetworkNode({
        userId: forwardSourceId,
        displayName: forwardSourceId,
        connectionCount: 0,
      });

      await addNetworkEdge({
        sourceUserId: forwardSourceId,
        targetUserId: senderId,
        edgeType: 'forward',
        weight: 1,
        firstSeen: date,
        lastSeen: date,
        chatId,
      });
    }
  }

  // Track reply relationships
  if (message.replyInfo && 'replyToMsgId' in message.replyInfo) {
    // Reply tracking is handled at the component level where we can resolve
    // the original message sender
  }

  // Update interaction counts
  const existing = await getInteractionsByUser(senderId);
  const chatInteraction = existing.find((r) => r.chatId === chatId);

  if (chatInteraction) {
    chatInteraction.messageCount += 1;
    chatInteraction.lastMessageDate = date;
    if (forwardInfo) chatInteraction.forwardCount += 1;
    await updateInteraction(chatInteraction);
  } else {
    await updateInteraction({
      userId: senderId,
      chatId,
      messageCount: 1,
      lastMessageDate: date,
      forwardCount: forwardInfo ? 1 : 0,
      replyCount: 0,
      mentionCount: 0,
    });
  }
}

/**
 * Process a batch of messages for network analysis.
 */
export async function processMessagesForNetwork(messages: ApiMessage[]): Promise<void> {
  for (const message of messages) {
    await processMessageForNetwork(message);
  }
}

/**
 * Get all connections for a specific user from the network graph.
 */
export async function getUserConnections(userId: string): Promise<{
  incoming: NetworkEdge[];
  outgoing: NetworkEdge[];
  nodes: NetworkNode[];
}> {
  const graph = await getNetworkGraph();

  const incoming = graph.edges.filter((e) => e.targetUserId === userId);
  const outgoing = graph.edges.filter((e) => e.sourceUserId === userId);

  const connectedIds = new Set<string>();
  incoming.forEach((e) => connectedIds.add(e.sourceUserId));
  outgoing.forEach((e) => connectedIds.add(e.targetUserId));

  const nodes = Array.from(connectedIds)
    .map((id) => graph.nodes[id])
    .filter(Boolean);

  return { incoming, outgoing, nodes };
}

/**
 * Get the top connected users in the network.
 */
export async function getTopConnectedUsers(limit = 20): Promise<Array<{
  userId: string;
  displayName: string;
  totalConnections: number;
  forwardCount: number;
  replyCount: number;
}>> {
  const graph = await getNetworkGraph();
  const connectionCounts: Record<string, {
    total: number;
    forwards: number;
    replies: number;
  }> = {};

  for (const edge of graph.edges) {
    if (!connectionCounts[edge.sourceUserId]) {
      connectionCounts[edge.sourceUserId] = { total: 0, forwards: 0, replies: 0 };
    }
    if (!connectionCounts[edge.targetUserId]) {
      connectionCounts[edge.targetUserId] = { total: 0, forwards: 0, replies: 0 };
    }

    connectionCounts[edge.sourceUserId].total += edge.weight;
    connectionCounts[edge.targetUserId].total += edge.weight;

    if (edge.edgeType === 'forward') {
      connectionCounts[edge.sourceUserId].forwards += edge.weight;
      connectionCounts[edge.targetUserId].forwards += edge.weight;
    } else if (edge.edgeType === 'reply') {
      connectionCounts[edge.sourceUserId].replies += edge.weight;
      connectionCounts[edge.targetUserId].replies += edge.weight;
    }
  }

  return Object.entries(connectionCounts)
    .map(([userId, counts]) => ({
      userId,
      displayName: graph.nodes[userId]?.displayName || userId,
      totalConnections: counts.total,
      forwardCount: counts.forwards,
      replyCount: counts.replies,
    }))
    .sort((a, b) => b.totalConnections - a.totalConnections)
    .slice(0, limit);
}

/**
 * Extract forward trace data from a message.
 */
export function extractForwardTrace(message: ApiMessage): ForwardTraceEntry | undefined {
  if (!message.forwardInfo) return undefined;

  return {
    messageId: message.id,
    chatId: message.chatId,
    fromUserId: message.forwardInfo.fromId,
    fromChatId: message.forwardInfo.fromChatId,
    originalDate: message.forwardInfo.date,
    forwardDate: message.date,
  };
}

/**
 * Get interaction summary for a specific chat.
 */
export async function getChatInteractionSummary(chatId: string): Promise<{
  totalUsers: number;
  topPosters: Array<{ userId: string; messageCount: number }>;
  topForwarders: Array<{ userId: string; forwardCount: number }>;
}> {
  const interactions = await getInteractionsByChat(chatId);

  const topPosters = [...interactions]
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 10)
    .map(({ userId, messageCount }) => ({ userId, messageCount }));

  const topForwarders = [...interactions]
    .filter((r) => r.forwardCount > 0)
    .sort((a, b) => b.forwardCount - a.forwardCount)
    .slice(0, 10)
    .map(({ userId, forwardCount }) => ({ userId, forwardCount }));

  return {
    totalUsers: interactions.length,
    topPosters,
    topForwarders,
  };
}
