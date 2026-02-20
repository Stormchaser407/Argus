/**
 * Project Argus — Bot Minions: Minion Engine
 * Core service that manages the lifecycle of all monitoring minions.
 * Handles creation, start/stop/pause, polling orchestration, and state persistence.
 */

import type {
  MinionConfig,
  MinionState,
  MinionAlert,
  MinionLogEntry,
  MinionStatus,
  MinionStats,
  MinionLogLevel,
  MinionType,
} from '../types';

import {
  saveConfig,
  getConfig,
  getAllConfigs,
  deleteConfig,
  saveState,
  getState,
  getAllStates,
  deleteState,
  saveAlert,
  saveLog,
  saveStats,
  getStats,
  getRecentAlerts,
  getAllLogs,
  deleteAllMinionData,
  pruneOldLogs,
} from '../helpers/minionStorage';

import { getGlobalRateLimiter } from '../helpers/rateLimiter';
import { generateMinionId, generateLogId } from '../helpers/utils';
import { alertService } from './alertService';

// ─── Minion Poll Functions (imported from individual minion modules) ──

type MinionPollFn = (
  config: MinionConfig,
  state: MinionState,
  engine: MinionEngine,
) => Promise<Partial<MinionState>>;

const minionPollFunctions: Record<MinionType, MinionPollFn | undefined> = {
  'keyword-monitor': undefined,
  'new-member-alert': undefined,
  'channel-clone-detector': undefined,
  'media-monitor': undefined,
};

export function registerMinionPollFunction(type: MinionType, fn: MinionPollFn): void {
  minionPollFunctions[type] = fn;
}

// ─── Engine Class ────────────────────────────────────────────────

class MinionEngine {
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  private states: Map<string, MinionState> = new Map();

  private configs: Map<string, MinionConfig> = new Map();

  private initialized: boolean = false;

  private engineStartTime: number = 0;

  private listeners: Set<() => void> = new Set();

  // ─── Initialization ──────────────────────────────────────────

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('[Argus:MinionEngine] Initializing...');
    this.engineStartTime = Date.now();

    // Load all configs and states from IndexedDB
    const configs = await getAllConfigs();
    const states = await getAllStates();

    const stateMap = new Map(states.map((s) => [s.id, s]));

    for (const config of configs) {
      this.configs.set(config.id, config);

      const existingState = stateMap.get(config.id);
      if (existingState) {
        // Reset status to stopped on reload (will auto-resume if enabled)
        existingState.status = 'stopped';
        this.states.set(config.id, existingState);
      } else {
        this.states.set(config.id, this.createDefaultState(config.id));
      }
    }

    // Auto-start enabled minions
    for (const config of configs) {
      if (config.enabled) {
        await this.startMinion(config.id);
      }
    }

    // Prune old logs periodically
    this.schedulePruning();

    this.initialized = true;
    console.log(`[Argus:MinionEngine] Initialized with ${configs.length} minion(s)`);
    this.notifyListeners();
  }

  // ─── Listener Management ─────────────────────────────────────

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => {
      try { fn(); } catch (e) { /* ignore */ }
    });
  }

  // ─── Minion CRUD ─────────────────────────────────────────────

  async createMinion(config: Omit<MinionConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<MinionConfig> {
    const fullConfig: MinionConfig = {
      ...config,
      id: generateMinionId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveConfig(fullConfig);
    this.configs.set(fullConfig.id, fullConfig);
    this.states.set(fullConfig.id, this.createDefaultState(fullConfig.id));
    await saveState(this.states.get(fullConfig.id)!);

    await this.log(fullConfig.id, 'info', `Minion "${fullConfig.name}" created (${fullConfig.type})`);

    if (fullConfig.enabled) {
      await this.startMinion(fullConfig.id);
    }

    this.notifyListeners();
    return fullConfig;
  }

  async updateMinion(id: string, updates: Partial<MinionConfig>): Promise<MinionConfig | undefined> {
    const config = this.configs.get(id);
    if (!config) return undefined;

    const updated = { ...config, ...updates, id, updatedAt: Date.now() };
    await saveConfig(updated);
    this.configs.set(id, updated);

    await this.log(id, 'info', `Minion "${updated.name}" configuration updated`);
    this.notifyListeners();
    return updated;
  }

  async deleteMinion(id: string): Promise<void> {
    await this.stopMinion(id);
    await deleteAllMinionData(id);
    this.configs.delete(id);
    this.states.delete(id);

    console.log(`[Argus:MinionEngine] Minion ${id} deleted`);
    this.notifyListeners();
  }

  // ─── Minion Lifecycle ────────────────────────────────────────

  async startMinion(id: string): Promise<boolean> {
    const config = this.configs.get(id);
    if (!config) {
      console.error(`[Argus:MinionEngine] Cannot start: minion ${id} not found`);
      return false;
    }

    const pollFn = minionPollFunctions[config.type];
    if (!pollFn) {
      await this.log(id, 'error', `No poll function registered for type: ${config.type}`);
      this.updateState(id, { status: 'error', lastError: `No handler for type: ${config.type}` });
      return false;
    }

    // Clear any existing timer
    this.clearTimer(id);

    this.updateState(id, {
      status: 'running',
      startedAt: Date.now(),
      lastError: undefined,
    });

    await this.log(id, 'info', `Minion "${config.name}" started`);
    this.schedulePoll(id);
    this.notifyListeners();
    return true;
  }

  async stopMinion(id: string): Promise<void> {
    this.clearTimer(id);
    this.updateState(id, { status: 'stopped' });
    await this.persistState(id);
    await this.log(id, 'info', 'Minion stopped');
    this.notifyListeners();
  }

  async pauseMinion(id: string): Promise<void> {
    this.clearTimer(id);
    this.updateState(id, { status: 'paused' });
    await this.persistState(id);
    await this.log(id, 'info', 'Minion paused');
    this.notifyListeners();
  }

  async resumeMinion(id: string): Promise<void> {
    const state = this.states.get(id);
    if (!state || state.status !== 'paused') return;

    this.updateState(id, { status: 'running' });
    await this.log(id, 'info', 'Minion resumed');
    this.schedulePoll(id);
    this.notifyListeners();
  }

  // ─── Polling ─────────────────────────────────────────────────

  private schedulePoll(id: string): void {
    const config = this.configs.get(id);
    const state = this.states.get(id);
    if (!config || !state || state.status !== 'running') return;

    const interval = Math.max(config.pollIntervalMs, 30000); // Minimum 30s
    const jitter = Math.random() * 5000; // 0-5s jitter

    const timer = setTimeout(() => {
      this.executePoll(id);
    }, interval + jitter);

    this.timers.set(id, timer);
    this.updateState(id, { nextPollAt: Date.now() + interval + jitter });
  }

  private async executePoll(id: string): Promise<void> {
    const config = this.configs.get(id);
    const state = this.states.get(id);
    if (!config || !state || state.status !== 'running') return;

    const pollFn = minionPollFunctions[config.type];
    if (!pollFn) return;

    const rateLimiter = getGlobalRateLimiter();

    try {
      await this.log(id, 'debug', `Polling ${config.targetChatIds.length} target(s)...`);

      const stateUpdates = await rateLimiter.execute(async () => pollFn(config, state, this));

      this.updateState(id, {
        ...stateUpdates,
        lastPollAt: Date.now(),
        errorsCount: state.errorsCount, // Preserve unless overridden
      });

      await this.persistState(id);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[Argus:MinionEngine] Poll error for ${id}:`, errorMsg);

      this.updateState(id, {
        lastError: errorMsg,
        errorsCount: (state.errorsCount || 0) + 1,
        lastPollAt: Date.now(),
      });

      await this.log(id, 'error', `Poll failed: ${errorMsg}`);

      // If too many consecutive errors, pause the minion
      const currentState = this.states.get(id);
      if (currentState && currentState.errorsCount >= 10) {
        await this.log(id, 'error', 'Too many errors, pausing minion');
        await this.pauseMinion(id);
        return;
      }
    }

    // Schedule next poll if still running
    const currentState = this.states.get(id);
    if (currentState?.status === 'running') {
      this.schedulePoll(id);
    }

    this.notifyListeners();
  }

  // ─── Alert Emission ──────────────────────────────────────────

  async emitAlert(alert: MinionAlert): Promise<void> {
    await saveAlert(alert);
    alertService.pushAlert(alert);
    await this.log(alert.minionId, 'info', `Alert: [${alert.priority}] ${alert.title}`);

    const state = this.states.get(alert.minionId);
    if (state) {
      this.updateState(alert.minionId, {
        alertsTriggered: (state.alertsTriggered || 0) + 1,
      });
    }

    this.notifyListeners();
  }

  // ─── Logging ─────────────────────────────────────────────────

  async log(minionId: string, level: MinionLogLevel, message: string, data?: unknown): Promise<void> {
    const entry: MinionLogEntry = {
      id: generateLogId(),
      minionId,
      level,
      message,
      timestamp: Date.now(),
      data: data ? JSON.stringify(data) : undefined,
    };

    await saveLog(entry);

    if (level === 'error' || level === 'warn') {
      console.warn(`[Argus:Minion:${minionId}] ${message}`);
    }
  }

  // ─── State Management ────────────────────────────────────────

  private updateState(id: string, updates: Partial<MinionState>): void {
    const current = this.states.get(id);
    if (!current) return;

    const updated = { ...current, ...updates };

    // Calculate uptime
    if (updated.startedAt && updated.status === 'running') {
      updated.uptimeMs = Date.now() - updated.startedAt;
    }

    this.states.set(id, updated);
  }

  private async persistState(id: string): Promise<void> {
    const state = this.states.get(id);
    if (state) {
      await saveState(state);
    }
  }

  private createDefaultState(id: string): MinionState {
    return {
      id,
      status: 'stopped',
      lastPollAt: 0,
      nextPollAt: 0,
      messagesScanned: 0,
      alertsTriggered: 0,
      errorsCount: 0,
      uptimeMs: 0,
      lastMessageIds: {},
      lastKnownMembers: {},
    };
  }

  // ─── Getters ─────────────────────────────────────────────────

  getConfig(id: string): MinionConfig | undefined {
    return this.configs.get(id);
  }

  getState(id: string): MinionState | undefined {
    return this.states.get(id);
  }

  getAllConfigs(): MinionConfig[] {
    return Array.from(this.configs.values());
  }

  getAllStates(): Record<string, MinionState> {
    const result: Record<string, MinionState> = {};
    this.states.forEach((state, id) => {
      result[id] = state;
    });
    return result;
  }

  async getStats(): Promise<MinionStats> {
    const configs = this.getAllConfigs();
    const statesArr = Array.from(this.states.values());

    const stats: MinionStats = {
      totalMinions: configs.length,
      activeMinions: statesArr.filter((s) => s.status === 'running').length,
      pausedMinions: statesArr.filter((s) => s.status === 'paused').length,
      stoppedMinions: statesArr.filter((s) => s.status === 'stopped').length,
      errorMinions: statesArr.filter((s) => s.status === 'error').length,
      totalMessagesScanned: statesArr.reduce((sum, s) => sum + s.messagesScanned, 0),
      totalAlertsTriggered: statesArr.reduce((sum, s) => sum + s.alertsTriggered, 0),
      totalErrors: statesArr.reduce((sum, s) => sum + s.errorsCount, 0),
      uptimeMs: this.engineStartTime ? Date.now() - this.engineStartTime : 0,
      lastUpdated: Date.now(),
    };

    await saveStats(stats);
    return stats;
  }

  async getRecentAlerts(limit?: number): Promise<MinionAlert[]> {
    return getRecentAlerts(limit);
  }

  async getRecentLogs(limit?: number): Promise<MinionLogEntry[]> {
    return getAllLogs(limit);
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // ─── Cleanup ─────────────────────────────────────────────────

  async shutdown(): Promise<void> {
    console.log('[Argus:MinionEngine] Shutting down...');

    // Stop all timers
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();

    // Persist all states
    for (const [id, state] of this.states) {
      state.status = 'stopped';
      await saveState(state);
    }

    this.initialized = false;
    console.log('[Argus:MinionEngine] Shutdown complete');
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private schedulePruning(): void {
    // Prune old logs every 6 hours
    setInterval(async () => {
      const pruned = await pruneOldLogs(7 * 24 * 60 * 60 * 1000);
      if (pruned > 0) {
        console.log(`[Argus:MinionEngine] Pruned ${pruned} old log entries`);
      }
    }, 6 * 60 * 60 * 1000);
  }
}

// ─── Singleton ───────────────────────────────────────────────────

export const minionEngine = new MinionEngine();
export default minionEngine;
