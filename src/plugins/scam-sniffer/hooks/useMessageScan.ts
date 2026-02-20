/**
 * Project Argus — Scam Sniffer: useMessageScan Hook
 * Teact hook that scans a message and returns the scan result.
 * Handles async scanning with loading state.
 */

import { useState, useEffect } from '../../../lib/teact/teact';

import type { MessageScanResult } from '../types';
import { ThreatLevel } from '../types';
import { scanMessage } from '../services/messageScannerService';
import { getScamSnifferConfig } from '../config';

interface UseMessageScanParams {
  messageId: number;
  chatId: string;
  chatTitle?: string;
  text?: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  senderFirstName?: string;
  senderLastName?: string;
  isForwarded?: boolean;
}

interface UseMessageScanResult {
  scanResult: MessageScanResult | undefined;
  isScanning: boolean;
  hasThreat: boolean;
}

const EMPTY_RESULT: MessageScanResult = {
  messageId: 0,
  chatId: '',
  timestamp: 0,
  wallets: [],
  links: [],
  patternMatches: [],
  overallThreatLevel: ThreatLevel.SAFE,
};

/**
 * Hook to scan a message for threats.
 * Returns the scan result, loading state, and whether threats were found.
 */
export function useMessageScan(params: UseMessageScanParams): UseMessageScanResult {
  const [scanResult, setScanResult] = useState<MessageScanResult | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const config = getScamSnifferConfig();
    if (!config.enabled || !params.text || params.text.length < 5) {
      setScanResult(undefined);
      return;
    }

    let cancelled = false;
    setIsScanning(true);

    scanMessage({
      messageId: params.messageId,
      chatId: params.chatId,
      chatTitle: params.chatTitle,
      text: params.text,
      senderId: params.senderId,
      senderName: params.senderName,
      senderUsername: params.senderUsername,
      senderFirstName: params.senderFirstName,
      senderLastName: params.senderLastName,
      isForwarded: params.isForwarded,
    }).then((result) => {
      if (!cancelled) {
        setScanResult(result);
        setIsScanning(false);
      }
    }).catch((error) => {
      console.error('[Argus/ScamSniffer] Scan error:', error);
      if (!cancelled) {
        setIsScanning(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [params.messageId, params.chatId, params.text]);

  const hasThreat = scanResult
    ? scanResult.overallThreatLevel !== ThreatLevel.SAFE
    : false;

  return { scanResult, isScanning, hasThreat };
}

/**
 * Hook to get the trust score for a peer.
 * Lightweight — just reads from the behavior scoring store.
 */
export function useTrustScore(peerId: string | undefined): number | undefined {
  const [score, setScore] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!peerId) {
      setScore(undefined);
      return;
    }

    // Import dynamically to avoid circular deps
    import('../services/behaviorScoringService').then(({ getAccountProfile }) => {
      const profile = getAccountProfile(peerId);
      setScore(profile?.trustScore);
    });
  }, [peerId]);

  return score;
}
