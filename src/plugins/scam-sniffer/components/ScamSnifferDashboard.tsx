/**
 * Project Argus — Scam Sniffer: Dashboard Component
 * Summary view of all detected threats across monitored chats.
 * Includes threat log, statistics, settings, and false positive reporting.
 */

import {
  memo, useState, useCallback, useMemo,
} from '../../../lib/teact/teact';

import type { ThreatLogEntry, ScamSnifferStats } from '../types';
import { ThreatLevel } from '../types';
import {
  getThreatLog,
  getStats,
  reportFalsePositive,
  clearThreatLog,
  resetStats,
} from '../services/messageScannerService';
import { getScamCategoryLabel } from '../services/patternMatchingService';
import { getPatternCount } from '../patterns/scamPatterns';
import { getScamSnifferConfig, updateScamSnifferConfig } from '../config';
import styles from '../styles/ScamSniffer.module.scss';

type DashboardTab = 'overview' | 'threats' | 'settings';

const ScamSnifferDashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [threatFilter, setThreatFilter] = useState<ThreatLogEntry['type'] | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className={styles.dashboard}>
      <DashboardHeader onRefresh={handleRefresh} />

      <div className={styles.dashboardTabs}>
        <TabButton
          label="Overview"
          isActive={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        />
        <TabButton
          label="Threat Log"
          isActive={activeTab === 'threats'}
          onClick={() => setActiveTab('threats')}
        />
        <TabButton
          label="Settings"
          isActive={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
      </div>

      <div className={styles.dashboardContent}>
        {activeTab === 'overview' && <OverviewPanel key={refreshKey} />}
        {activeTab === 'threats' && (
          <ThreatLogPanel
            key={refreshKey}
            filter={threatFilter}
            onFilterChange={setThreatFilter}
          />
        )}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
};

// ─── Dashboard Header ────────────────────────────────────────────────────────

interface HeaderProps {
  onRefresh: () => void;
}

const DashboardHeader = ({ onRefresh }: HeaderProps) => (
  <div className={styles.dashboardHeader}>
    <h2>
      <span>🛡</span>
      <span>Scam Sniffer</span>
    </h2>
    <div className={styles.headerActions}>
      <button
        className={styles.threatActionBtn}
        onClick={onRefresh}
        title="Refresh data"
      >
        ↻ Refresh
      </button>
    </div>
  </div>
);

// ─── Tab Button ──────────────────────────────────────────────────────────────

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = ({ label, isActive, onClick }: TabButtonProps) => (
  <div
    className={`${styles.dashboardTab} ${isActive ? styles.active : ''}`}
    onClick={onClick}
    role="tab"
    tabIndex={0}
  >
    {label}
  </div>
);

// ─── Overview Panel ──────────────────────────────────────────────────────────

const OverviewPanel = () => {
  const stats: ScamSnifferStats = getStats();
  const config = getScamSnifferConfig();

  return (
    <div>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.threats}`}>
          <div className={styles.statValue}>{stats.totalThreatsDetected}</div>
          <div className={styles.statLabel}>Threats Detected</div>
        </div>
        <div className={`${styles.statCard} ${styles.wallets}`}>
          <div className={styles.statValue}>{stats.walletsFlagged}</div>
          <div className={styles.statLabel}>Wallets Flagged</div>
        </div>
        <div className={`${styles.statCard} ${styles.links}`}>
          <div className={styles.statValue}>{stats.linksFlagged}</div>
          <div className={styles.statLabel}>Links Blocked</div>
        </div>
        <div className={`${styles.statCard} ${styles.patterns}`}>
          <div className={styles.statValue}>{stats.patternsMatched}</div>
          <div className={styles.statLabel}>Patterns Matched</div>
        </div>
      </div>

      {/* Scan Summary */}
      <div className={styles.settingsSection}>
        <h3>Scan Summary</h3>
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Total Wallets Scanned</div>
          </div>
          <span>{stats.walletsScanned}</span>
        </div>
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Total Links Scanned</div>
          </div>
          <span>{stats.linksScanned}</span>
        </div>
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Accounts Scored</div>
          </div>
          <span>{stats.accountsScored}</span>
        </div>
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>False Positives Reported</div>
          </div>
          <span>{stats.falsePositivesReported}</span>
        </div>
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Pattern Library Size</div>
          </div>
          <span>{getPatternCount()} patterns</span>
        </div>
      </div>

      {/* API Status */}
      <div className={styles.settingsSection}>
        <h3>API Status</h3>
        <ApiStatusRow
          name="Chainabuse"
          isConfigured={!!config.apiKeys.chainabuse}
        />
        <ApiStatusRow
          name="Google Safe Browsing"
          isConfigured={!!config.apiKeys.safeBrowsing}
        />
        <ApiStatusRow
          name="VirusTotal"
          isConfigured={!!config.apiKeys.virusTotal}
        />
        <ApiStatusRow
          name="Domain Age (RDAP)"
          isConfigured={true}
          note="No API key required"
        />
      </div>

      {/* Last Scan */}
      {stats.lastScanTimestamp > 0 && (
        <div style="font-size: 0.75rem; color: var(--color-text-secondary); text-align: center; margin-top: 16px;">
          Last scan: {new Date(stats.lastScanTimestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
};

// ─── API Status Row ──────────────────────────────────────────────────────────

interface ApiStatusRowProps {
  name: string;
  isConfigured: boolean;
  note?: string;
}

const ApiStatusRow = ({ name, isConfigured, note }: ApiStatusRowProps) => (
  <div className={styles.settingRow}>
    <div className={styles.settingLabel}>{name}</div>
    <div className={`${styles.apiStatus} ${isConfigured ? styles.configured : styles.notConfigured}`}>
      <span className={`${styles.apiStatusDot} ${isConfigured ? styles.active : styles.inactive}`} />
      <span>{isConfigured ? (note || 'Configured') : 'Not configured'}</span>
    </div>
  </div>
);

// ─── Threat Log Panel ────────────────────────────────────────────────────────

interface ThreatLogPanelProps {
  filter?: ThreatLogEntry['type'];
  onFilterChange: (filter: ThreatLogEntry['type'] | undefined) => void;
}

const ThreatLogPanel = ({ filter, onFilterChange }: ThreatLogPanelProps) => {
  const threats = useMemo(() => getThreatLog({ type: filter, limit: 200 }), [filter]);

  const handleFalsePositive = useCallback((entryId: string) => {
    reportFalsePositive(entryId);
  }, []);

  const handleClearLog = useCallback(() => {
    clearThreatLog();
    resetStats();
  }, []);

  return (
    <div>
      {/* Filter Buttons */}
      <div style="display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
        <FilterButton label="All" isActive={!filter} onClick={() => onFilterChange(undefined)} />
        <FilterButton label="Wallets" isActive={filter === 'wallet'} onClick={() => onFilterChange('wallet')} />
        <FilterButton label="Links" isActive={filter === 'link'} onClick={() => onFilterChange('link')} />
        <FilterButton label="Patterns" isActive={filter === 'pattern'} onClick={() => onFilterChange('pattern')} />
        <FilterButton label="Behavior" isActive={filter === 'behavior'} onClick={() => onFilterChange('behavior')} />

        <button
          className={styles.threatActionBtn}
          onClick={handleClearLog}
          style="margin-left: auto;"
        >
          Clear Log
        </button>
      </div>

      {/* Threat List */}
      {threats.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🛡</div>
          <div className={styles.emptyTitle}>No threats detected</div>
          <div className={styles.emptyDescription}>
            Scam Sniffer is actively monitoring your chats. Threats will appear here when detected.
          </div>
        </div>
      ) : (
        <div className={styles.threatList}>
          {threats.map((entry) => (
            <ThreatLogEntryRow
              key={entry.id}
              entry={entry}
              onFalsePositive={handleFalsePositive}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Filter Button ───────────────────────────────────────────────────────────

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton = ({ label, isActive, onClick }: FilterButtonProps) => (
  <button
    className={`${styles.sensitivityOption} ${isActive ? styles.active : ''}`}
    onClick={onClick}
  >
    {label}
  </button>
);

// ─── Threat Log Entry Row ────────────────────────────────────────────────────

interface ThreatLogEntryRowProps {
  entry: ThreatLogEntry;
  onFalsePositive: (id: string) => void;
}

const ThreatLogEntryRow = ({ entry, onFalsePositive }: ThreatLogEntryRowProps) => {
  const levelClass = entry.isFalsePositive
    ? styles.falsePositive
    : styles[entry.threatLevel] || '';

  const typeIcons: Record<string, string> = {
    wallet: '💰',
    link: '🔗',
    pattern: '🔍',
    behavior: '👤',
  };

  return (
    <div className={`${styles.threatEntry} ${levelClass}`}>
      <div className={`${styles.threatIcon} ${styles[entry.type]}`}>
        {typeIcons[entry.type] || '⚠'}
      </div>

      <div className={styles.threatContent}>
        <div className={styles.threatSummary}>
          {entry.summary}
          {entry.isFalsePositive && (
            <span style="margin-left: 6px; font-size: 0.6875rem; color: #9ca3af;">(False Positive)</span>
          )}
        </div>
        <div className={styles.threatMeta}>
          <span>{new Date(entry.timestamp).toLocaleString()}</span>
          {entry.chatTitle && <span>{entry.chatTitle}</span>}
          {entry.senderName && <span>by {entry.senderName}</span>}
        </div>
      </div>

      <div className={styles.threatActions}>
        {!entry.isFalsePositive && (
          <button
            className={styles.threatActionBtn}
            onClick={() => onFalsePositive(entry.id)}
            title="Report as false positive"
          >
            FP
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Settings Panel ──────────────────────────────────────────────────────────

const SettingsPanel = () => {
  const config = getScamSnifferConfig();
  const [localConfig, setLocalConfig] = useState(config);

  const handleToggle = useCallback((path: string, value: boolean) => {
    const newConfig = { ...localConfig };
    const keys = path.split('.');
    let obj: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setLocalConfig(newConfig);
    updateScamSnifferConfig(newConfig);
  }, [localConfig]);

  const handleSensitivity = useCallback((level: 'low' | 'medium' | 'high') => {
    const newConfig = {
      ...localConfig,
      patternMatching: { ...localConfig.patternMatching, sensitivity: level },
    };
    setLocalConfig(newConfig);
    updateScamSnifferConfig(newConfig);
  }, [localConfig]);

  return (
    <div>
      {/* Master Toggle */}
      <div className={styles.settingsSection}>
        <h3>General</h3>
        <SettingToggle
          label="Enable Scam Sniffer"
          description="Master switch for all scanning features"
          checked={localConfig.enabled}
          onChange={(v) => handleToggle('enabled', v)}
        />
      </div>

      {/* Wallet Detection */}
      <div className={styles.settingsSection}>
        <h3>Crypto Wallet Detection</h3>
        <SettingToggle
          label="Detect wallet addresses"
          description="Scan messages for cryptocurrency wallet addresses"
          checked={localConfig.walletDetection.enabled}
          onChange={(v) => handleToggle('walletDetection.enabled', v)}
        />
        <SettingToggle
          label="Auto-check against Chainabuse"
          description="Automatically cross-reference detected wallets"
          checked={localConfig.walletDetection.autoCheck}
          onChange={(v) => handleToggle('walletDetection.autoCheck', v)}
        />
      </div>

      {/* Phishing Detection */}
      <div className={styles.settingsSection}>
        <h3>Phishing Link Detection</h3>
        <SettingToggle
          label="Check Google Safe Browsing"
          description="Scan URLs against Google's threat database"
          checked={localConfig.phishingDetection.checkSafeBrowsing}
          onChange={(v) => handleToggle('phishingDetection.checkSafeBrowsing', v)}
        />
        <SettingToggle
          label="Check VirusTotal"
          description="Scan URLs with VirusTotal multi-engine analysis"
          checked={localConfig.phishingDetection.checkVirusTotal}
          onChange={(v) => handleToggle('phishingDetection.checkVirusTotal', v)}
        />
        <SettingToggle
          label="Typosquatting detection"
          description="Detect domains impersonating legitimate sites"
          checked={localConfig.phishingDetection.checkTyposquatting}
          onChange={(v) => handleToggle('phishingDetection.checkTyposquatting', v)}
        />
        <SettingToggle
          label="Domain age checking"
          description="Flag newly registered domains"
          checked={localConfig.phishingDetection.checkDomainAge}
          onChange={(v) => handleToggle('phishingDetection.checkDomainAge', v)}
        />
      </div>

      {/* Behavior Scoring */}
      <div className={styles.settingsSection}>
        <h3>Account Behavior Scoring</h3>
        <SettingToggle
          label="Enable behavior scoring"
          description="Score accounts based on risk indicators"
          checked={localConfig.behaviorScoring.enabled}
          onChange={(v) => handleToggle('behaviorScoring.enabled', v)}
        />
      </div>

      {/* Pattern Matching */}
      <div className={styles.settingsSection}>
        <h3>Scam Pattern Matching</h3>
        <SettingToggle
          label="Enable pattern matching"
          description="Detect known scam patterns in messages"
          checked={localConfig.patternMatching.enabled}
          onChange={(v) => handleToggle('patternMatching.enabled', v)}
        />

        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Detection Sensitivity</div>
            <div className={styles.settingDescription}>Higher sensitivity catches more but may increase false positives</div>
          </div>
          <div className={styles.sensitivitySelector}>
            <button
              className={`${styles.sensitivityOption} ${localConfig.patternMatching.sensitivity === 'low' ? styles.active : ''}`}
              onClick={() => handleSensitivity('low')}
            >
              Low
            </button>
            <button
              className={`${styles.sensitivityOption} ${localConfig.patternMatching.sensitivity === 'medium' ? styles.active : ''}`}
              onClick={() => handleSensitivity('medium')}
            >
              Medium
            </button>
            <button
              className={`${styles.sensitivityOption} ${localConfig.patternMatching.sensitivity === 'high' ? styles.active : ''}`}
              onClick={() => handleSensitivity('high')}
            >
              High
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Setting Toggle Sub-component ────────────────────────────────────────────

interface SettingToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const SettingToggle = ({ label, description, checked, onChange }: SettingToggleProps) => (
  <div className={styles.settingRow}>
    <div>
      <div className={styles.settingLabel}>{label}</div>
      <div className={styles.settingDescription}>{description}</div>
    </div>
    <label className={styles.toggle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e: any) => onChange(e.target.checked)}
      />
      <span className={styles.slider} />
    </label>
  </div>
);

export default memo(ScamSnifferDashboard);
