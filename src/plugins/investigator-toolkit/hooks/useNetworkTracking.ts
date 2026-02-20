/**
 * Project Argus — Network Tracking Hook
 * Processes visible messages to build the network graph in real-time.
 */

import { useEffect } from '../../../lib/teact/teact';
import type { ApiMessage } from '../../../api/types';
import { processMessageForNetwork } from '../helpers/networkMapper';

/**
 * Hook that processes an array of messages to extract network relationship data.
 * Should be used in components that display message lists.
 */
export default function useNetworkTracking(
  messages: ApiMessage[] | undefined,
  isEnabled = true,
) {
  useEffect(() => {
    if (!isEnabled || !messages || messages.length === 0) return;

    // Process only messages with forward info (the most valuable for network mapping)
    const forwardedMessages = messages.filter((msg) => msg.forwardInfo);

    if (forwardedMessages.length === 0) return;

    // Process in batches to avoid blocking
    let index = 0;
    const batchSize = 10;

    function processBatch() {
      const batch = forwardedMessages.slice(index, index + batchSize);
      if (batch.length === 0) return;

      batch.forEach((msg) => {
        processMessageForNetwork(msg).catch(() => {});
      });

      index += batchSize;
      if (index < forwardedMessages.length) {
        setTimeout(processBatch, 100);
      }
    }

    processBatch();
  }, [messages, isEnabled]);
}
