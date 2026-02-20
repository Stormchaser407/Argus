/**
 * Project Argus — Bot Minions: Alert Service
 * Manages alert notifications, desktop notifications, and the alert queue.
 */

import type { MinionAlert, AlertPriority } from '../types';
import {
  saveAlert,
  markAlertRead,
  markAlertDismissed,
  markAllAlertsRead,
  getRecentAlerts,
  getUnreadAlerts,
  getAlertsByPriority,
  getAlertsByMinion,
} from '../helpers/minionStorage';

type AlertListener = (alert: MinionAlert) => void;

class AlertService {
  private listeners: Set<AlertListener> = new Set();

  private desktopNotificationsEnabled: boolean = false;

  private soundEnabled: boolean = true;

  private unreadCount: number = 0;

  private countListeners: Set<(count: number) => void> = new Set();

  // ─── Initialization ──────────────────────────────────────────

  async initialize(): Promise<void> {
    // Request notification permission
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        this.desktopNotificationsEnabled = permission === 'granted';
      } catch {
        this.desktopNotificationsEnabled = false;
      }
    } else if (typeof Notification !== 'undefined') {
      this.desktopNotificationsEnabled = Notification.permission === 'granted';
    }

    // Load unread count
    const unread = await getUnreadAlerts();
    this.unreadCount = unread.length;
    this.notifyCountListeners();

    console.log(`[Argus:AlertService] Initialized (desktop notifications: ${this.desktopNotificationsEnabled})`);
  }

  // ─── Alert Push ──────────────────────────────────────────────

  async pushAlert(alert: MinionAlert): Promise<void> {
    // Persist
    await saveAlert(alert);

    // Update unread count
    if (!alert.read) {
      this.unreadCount++;
      this.notifyCountListeners();
    }

    // Notify in-app listeners
    this.listeners.forEach((listener) => {
      try {
        listener(alert);
      } catch (e) {
        console.error('[Argus:AlertService] Listener error:', e);
      }
    });

    // Desktop notification
    if (this.desktopNotificationsEnabled) {
      this.sendDesktopNotification(alert);
    }

    // Sound for critical alerts
    if (this.soundEnabled && alert.priority === 'critical') {
      this.playAlertSound();
    }

    console.log(`[Argus:AlertService] Alert pushed: [${alert.priority}] ${alert.title}`);
  }

  // ─── Desktop Notifications ───────────────────────────────────

  private sendDesktopNotification(alert: MinionAlert): void {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    const icon = this.getPriorityIcon(alert.priority);
    const tag = `argus-alert-${alert.id}`;

    try {
      const notification = new Notification(`Argus: ${alert.title}`, {
        body: alert.description,
        icon,
        tag,
        requireInteraction: alert.priority === 'critical',
        silent: alert.priority === 'info',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close non-critical after 10s
      if (alert.priority !== 'critical') {
        setTimeout(() => notification.close(), 10000);
      }
    } catch (e) {
      console.warn('[Argus:AlertService] Desktop notification failed:', e);
    }
  }

  private getPriorityIcon(priority: AlertPriority): string {
    switch (priority) {
      case 'critical': return '/argus-alert-critical.png';
      case 'warning': return '/argus-alert-warning.png';
      case 'info':
      default: return '/argus-alert-info.png';
    }
  }

  private playAlertSound(): void {
    try {
      // Create a simple beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 200);
    } catch {
      // Audio not available, silently fail
    }
  }

  // ─── Alert Management ────────────────────────────────────────

  async markRead(alertId: string): Promise<void> {
    await markAlertRead(alertId);
    this.unreadCount = Math.max(0, this.unreadCount - 1);
    this.notifyCountListeners();
  }

  async markDismissed(alertId: string): Promise<void> {
    await markAlertDismissed(alertId);
  }

  async markAllRead(): Promise<void> {
    await markAllAlertsRead();
    this.unreadCount = 0;
    this.notifyCountListeners();
  }

  async getRecent(limit?: number): Promise<MinionAlert[]> {
    return getRecentAlerts(limit);
  }

  async getByPriority(priority: AlertPriority): Promise<MinionAlert[]> {
    return getAlertsByPriority(priority);
  }

  async getByMinion(minionId: string): Promise<MinionAlert[]> {
    return getAlertsByMinion(minionId);
  }

  getUnreadCount(): number {
    return this.unreadCount;
  }

  // ─── Listeners ───────────────────────────────────────────────

  onAlert(listener: AlertListener): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  onUnreadCountChange(listener: (count: number) => void): () => void {
    this.countListeners.add(listener);
    return () => { this.countListeners.delete(listener); };
  }

  private notifyCountListeners(): void {
    this.countListeners.forEach((fn) => {
      try { fn(this.unreadCount); } catch { /* ignore */ }
    });
  }

  // ─── Settings ────────────────────────────────────────────────

  setDesktopNotifications(enabled: boolean): void {
    this.desktopNotificationsEnabled = enabled;
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  isDesktopNotificationsEnabled(): boolean {
    return this.desktopNotificationsEnabled;
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }
}

export const alertService = new AlertService();
export default alertService;
