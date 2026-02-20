/**
 * Project Argus — Bot Minions: Configuration Wizard
 * Step-by-step wizard for creating and editing minion configurations.
 */

import {
  memo, useState, useCallback,
} from '../../../lib/teact/teact';

import type {
  MinionType,
  MinionConfig,
  KeywordMonitorConfig,
  NewMemberAlertConfig,
  ChannelCloneDetectorConfig,
  MediaMonitorConfig,
  AlertPriority,
} from '../types';

import { createDefaultKeywordMonitorConfig } from '../services/keywordMonitor';
import { createDefaultNewMemberAlertConfig } from '../services/newMemberAlert';
import { createDefaultChannelCloneDetectorConfig } from '../services/channelCloneDetector';
import { createDefaultMediaMonitorConfig } from '../services/mediaMonitor';
import styles from '../styles/BotMinions.module.scss';

interface OwnProps {
  existingConfig?: MinionConfig;
  onSave: (config: Omit<MinionConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

type WizardStep = 'basics' | 'targets' | 'type-config' | 'review';

const MINION_TYPES: Array<{ value: MinionType; label: string; description: string }> = [
  {
    value: 'keyword-monitor',
    label: 'Keyword Monitor',
    description: 'Watch channels for keyword and regex pattern matches',
  },
  {
    value: 'new-member-alert',
    label: 'New Member Alert',
    description: 'Detect new group members and cross-reference watchlists',
  },
  {
    value: 'channel-clone-detector',
    label: 'Channel Clone Detector',
    description: 'Find channels impersonating legitimate ones',
  },
  {
    value: 'media-monitor',
    label: 'Media Monitor',
    description: 'Capture and archive new media with metadata',
  },
];

const MinionConfigWizard = ({ existingConfig, onSave, onCancel }: OwnProps) => {
  const [step, setStep] = useState<WizardStep>('basics');
  const [name, setName] = useState(existingConfig?.name || '');
  const [type, setType] = useState<MinionType>(existingConfig?.type || 'keyword-monitor');
  const [enabled, setEnabled] = useState(existingConfig?.enabled ?? true);
  const [pollInterval, setPollInterval] = useState(
    existingConfig ? Math.floor(existingConfig.pollIntervalMs / 1000) : 60,
  );
  const [targetChatIds, setTargetChatIds] = useState<string[]>(existingConfig?.targetChatIds || []);
  const [chatIdInput, setChatIdInput] = useState('');

  // Type-specific configs
  const [keywordConfig, setKeywordConfig] = useState<KeywordMonitorConfig>(
    (existingConfig?.typeConfig as KeywordMonitorConfig) || createDefaultKeywordMonitorConfig(),
  );
  const [memberConfig, setMemberConfig] = useState<NewMemberAlertConfig>(
    (existingConfig?.typeConfig as NewMemberAlertConfig) || createDefaultNewMemberAlertConfig(),
  );
  const [cloneConfig, setCloneConfig] = useState<ChannelCloneDetectorConfig>(
    (existingConfig?.typeConfig as ChannelCloneDetectorConfig) || createDefaultChannelCloneDetectorConfig(),
  );
  const [mediaConfig, setMediaConfig] = useState<MediaMonitorConfig>(
    (existingConfig?.typeConfig as MediaMonitorConfig) || createDefaultMediaMonitorConfig(),
  );

  // Keyword/pattern input states
  const [keywordInput, setKeywordInput] = useState('');
  const [regexInput, setRegexInput] = useState('');
  const [watchlistInput, setWatchlistInput] = useState('');
  const [protectedChannelInput, setProtectedChannelInput] = useState('');

  const handleAddChatId = useCallback(() => {
    const trimmed = chatIdInput.trim();
    if (trimmed && !targetChatIds.includes(trimmed)) {
      setTargetChatIds([...targetChatIds, trimmed]);
      setChatIdInput('');
    }
  }, [chatIdInput, targetChatIds]);

  const handleRemoveChatId = useCallback((id: string) => {
    setTargetChatIds(targetChatIds.filter((c) => c !== id));
  }, [targetChatIds]);

  const handleAddKeyword = useCallback(() => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywordConfig.keywords.includes(trimmed)) {
      setKeywordConfig({ ...keywordConfig, keywords: [...keywordConfig.keywords, trimmed] });
      setKeywordInput('');
    }
  }, [keywordInput, keywordConfig]);

  const handleAddRegex = useCallback(() => {
    const trimmed = regexInput.trim();
    if (trimmed) {
      try {
        new RegExp(trimmed);
        if (!keywordConfig.regexPatterns.includes(trimmed)) {
          setKeywordConfig({ ...keywordConfig, regexPatterns: [...keywordConfig.regexPatterns, trimmed] });
          setRegexInput('');
        }
      } catch {
        // Invalid regex — could show error
      }
    }
  }, [regexInput, keywordConfig]);

  const handleAddWatchlistId = useCallback(() => {
    const trimmed = watchlistInput.trim();
    if (trimmed && !memberConfig.watchlistUserIds.includes(trimmed)) {
      setMemberConfig({ ...memberConfig, watchlistUserIds: [...memberConfig.watchlistUserIds, trimmed] });
      setWatchlistInput('');
    }
  }, [watchlistInput, memberConfig]);

  const handleAddProtectedChannel = useCallback(() => {
    const trimmed = protectedChannelInput.trim();
    if (trimmed) {
      const newChannel = { chatId: trimmed, title: trimmed };
      setCloneConfig({
        ...cloneConfig,
        protectedChannels: [...cloneConfig.protectedChannels, newChannel],
      });
      setProtectedChannelInput('');
    }
  }, [protectedChannelInput, cloneConfig]);

  const handleSave = useCallback(() => {
    let typeConfig: MinionConfig['typeConfig'];
    switch (type) {
      case 'keyword-monitor': typeConfig = keywordConfig; break;
      case 'new-member-alert': typeConfig = memberConfig; break;
      case 'channel-clone-detector': typeConfig = cloneConfig; break;
      case 'media-monitor': typeConfig = mediaConfig; break;
      default: typeConfig = keywordConfig;
    }

    onSave({
      name,
      type,
      enabled,
      targetChatIds,
      pollIntervalMs: Math.max(pollInterval, 30) * 1000,
      typeConfig,
    });
  }, [name, type, enabled, targetChatIds, pollInterval, keywordConfig, memberConfig, cloneConfig, mediaConfig, onSave]);

  const canProceed = (): boolean => {
    switch (step) {
      case 'basics': return name.trim().length > 0;
      case 'targets': return targetChatIds.length > 0;
      case 'type-config': return true;
      case 'review': return true;
      default: return false;
    }
  };

  const nextStep = (): void => {
    const steps: WizardStep[] = ['basics', 'targets', 'type-config', 'review'];
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const prevStep = (): void => {
    const steps: WizardStep[] = ['basics', 'targets', 'type-config', 'review'];
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  return (
    <div className={styles.wizard}>
      <div className={styles.wizardTitle}>
        {existingConfig ? 'Edit Minion' : 'Create New Minion'}
      </div>

      {/* Step: Basics */}
      {step === 'basics' && (
        <div className={styles.wizardStep}>
          <div className={styles.wizardStepTitle}>Step 1: Basic Configuration</div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Minion Name</label>
            <input
              type="text"
              className={styles.formInput}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="e.g., Missing Children Keywords"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Minion Type</label>
            {MINION_TYPES.map((mt) => (
              <label key={mt.value} className={styles.formCheckbox} style="margin-bottom: 8px">
                <input
                  type="radio"
                  name="minionType"
                  checked={type === mt.value}
                  onChange={() => setType(mt.value)}
                />
                <div>
                  <div style="font-weight: var(--font-weight-medium)">{mt.label}</div>
                  <div style="font-size: 0.75rem; color: var(--color-text-secondary)">{mt.description}</div>
                </div>
              </label>
            ))}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{`Poll Interval (seconds, min 30)`}</label>
            <input
              type="number"
              className={styles.formInput}
              value={pollInterval}
              min={30}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPollInterval(parseInt(e.target.value, 10) || 60)}
            />
            <div className={styles.formHint}>How often the minion checks for new data. Lower = more API calls.</div>
          </div>

          <label className={styles.formCheckbox}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnabled(e.target.checked)}
            />
            Start minion immediately after creation
          </label>
        </div>
      )}

      {/* Step: Targets */}
      {step === 'targets' && (
        <div className={styles.wizardStep}>
          <div className={styles.wizardStepTitle}>Step 2: Target Channels/Groups</div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Add Chat ID or Username</label>
            <div style="display: flex; gap: 8px">
              <input
                type="text"
                className={styles.formInput}
                value={chatIdInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatIdInput(e.target.value)}
                placeholder="e.g., -1001234567890 or @channelname"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleAddChatId(); }}
              />
              <button type="button" className={`${styles.headerBtn} ${styles.primary}`} onClick={handleAddChatId}>
                Add
              </button>
            </div>
            <div className={styles.formHint}>Enter Telegram chat IDs or public @usernames</div>
          </div>

          <div className={styles.chipList}>
            {targetChatIds.map((id) => (
              <span key={id} className={styles.chip}>
                {id}
                <span className={styles.chipRemove} onClick={() => handleRemoveChatId(id)}>x</span>
              </span>
            ))}
          </div>

          {targetChatIds.length === 0 && (
            <div className={styles.formHint} style="color: var(--minion-error); margin-top: 8px">
              At least one target is required
            </div>
          )}
        </div>
      )}

      {/* Step: Type-specific config */}
      {step === 'type-config' && (
        <div className={styles.wizardStep}>
          <div className={styles.wizardStepTitle}>Step 3: Monitor Configuration</div>

          {type === 'keyword-monitor' && (
            <div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Keywords (case-insensitive)</label>
                <div style="display: flex; gap: 8px">
                  <input
                    type="text"
                    className={styles.formInput}
                    value={keywordInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeywordInput(e.target.value)}
                    placeholder="Enter a keyword"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleAddKeyword(); }}
                  />
                  <button type="button" className={styles.headerBtn} onClick={handleAddKeyword}>Add</button>
                </div>
                <div className={styles.chipList}>
                  {keywordConfig.keywords.map((kw) => (
                    <span key={kw} className={styles.chip}>
                      {kw}
                      <span
                        className={styles.chipRemove}
                        onClick={() => setKeywordConfig({
                          ...keywordConfig,
                          keywords: keywordConfig.keywords.filter((k) => k !== kw),
                        })}
                      >
                        x
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Regex Patterns</label>
                <div style="display: flex; gap: 8px">
                  <input
                    type="text"
                    className={styles.formInput}
                    value={regexInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegexInput(e.target.value)}
                    placeholder="e.g., \b(missing|amber)\s+alert\b"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleAddRegex(); }}
                  />
                  <button type="button" className={styles.headerBtn} onClick={handleAddRegex}>Add</button>
                </div>
                <div className={styles.chipList}>
                  {keywordConfig.regexPatterns.map((pat) => (
                    <span key={pat} className={styles.chip}>
                      {`/${pat}/`}
                      <span
                        className={styles.chipRemove}
                        onClick={() => setKeywordConfig({
                          ...keywordConfig,
                          regexPatterns: keywordConfig.regexPatterns.filter((p) => p !== pat),
                        })}
                      >
                        x
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <label className={styles.formCheckbox}>
                <input
                  type="checkbox"
                  checked={keywordConfig.autoArchive}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeywordConfig({
                    ...keywordConfig,
                    autoArchive: e.target.checked,
                  })}
                />
                Auto-archive matched messages (Evidence Preservation)
              </label>

              <div className={styles.formGroup} style="margin-top: 12px">
                <label className={styles.formLabel}>Alert Priority</label>
                <select
                  className={styles.formSelect}
                  value={keywordConfig.alertPriority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setKeywordConfig({
                    ...keywordConfig,
                    alertPriority: e.target.value as AlertPriority,
                  })}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          )}

          {type === 'new-member-alert' && (
            <div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Watchlist User IDs</label>
                <div style="display: flex; gap: 8px">
                  <input
                    type="text"
                    className={styles.formInput}
                    value={watchlistInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWatchlistInput(e.target.value)}
                    placeholder="Enter a Telegram user ID"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleAddWatchlistId(); }}
                  />
                  <button type="button" className={styles.headerBtn} onClick={handleAddWatchlistId}>Add</button>
                </div>
                <div className={styles.chipList}>
                  {memberConfig.watchlistUserIds.map((uid) => (
                    <span key={uid} className={styles.chip}>
                      {uid}
                      <span
                        className={styles.chipRemove}
                        onClick={() => setMemberConfig({
                          ...memberConfig,
                          watchlistUserIds: memberConfig.watchlistUserIds.filter((u) => u !== uid),
                        })}
                      >
                        x
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{`New Account Threshold (days)`}</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={memberConfig.newAccountThresholdDays}
                  min={1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMemberConfig({
                    ...memberConfig,
                    newAccountThresholdDays: parseInt(e.target.value, 10) || 30,
                  })}
                />
                <div className={styles.formHint}>Accounts newer than this will be flagged as suspicious</div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Watchlist Alert Priority</label>
                <select
                  className={styles.formSelect}
                  value={memberConfig.watchlistAlertPriority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMemberConfig({
                    ...memberConfig,
                    watchlistAlertPriority: e.target.value as AlertPriority,
                  })}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          )}

          {type === 'channel-clone-detector' && (
            <div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Protected Channel IDs/Names</label>
                <div style="display: flex; gap: 8px">
                  <input
                    type="text"
                    className={styles.formInput}
                    value={protectedChannelInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProtectedChannelInput(e.target.value)}
                    placeholder="Channel ID or title to protect"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleAddProtectedChannel(); }}
                  />
                  <button type="button" className={styles.headerBtn} onClick={handleAddProtectedChannel}>Add</button>
                </div>
                <div className={styles.chipList}>
                  {cloneConfig.protectedChannels.map((ch) => (
                    <span key={ch.chatId} className={styles.chip}>
                      {ch.title}
                      <span
                        className={styles.chipRemove}
                        onClick={() => setCloneConfig({
                          ...cloneConfig,
                          protectedChannels: cloneConfig.protectedChannels.filter((c) => c.chatId !== ch.chatId),
                        })}
                      >
                        x
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{`Name Similarity Threshold (0-1)`}</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={cloneConfig.nameThreshold}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCloneConfig({
                    ...cloneConfig,
                    nameThreshold: parseFloat(e.target.value) || 0.75,
                  })}
                />
              </div>
            </div>
          )}

          {type === 'media-monitor' && (
            <div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Media Types to Monitor</label>
                {(['photo', 'video', 'document', 'audio'] as const).map((mt) => (
                  <label key={mt} className={styles.formCheckbox} style="margin-bottom: 4px">
                    <input
                      type="checkbox"
                      checked={mediaConfig.mediaTypes.includes(mt)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const checked = e.target.checked;
                        setMediaConfig({
                          ...mediaConfig,
                          mediaTypes: checked
                            ? [...mediaConfig.mediaTypes, mt]
                            : mediaConfig.mediaTypes.filter((t) => t !== mt),
                        });
                      }}
                    />
                    {mt.charAt(0).toUpperCase() + mt.slice(1)}
                  </label>
                ))}
              </div>

              <label className={styles.formCheckbox}>
                <input
                  type="checkbox"
                  checked={mediaConfig.autoArchive}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMediaConfig({
                    ...mediaConfig,
                    autoArchive: e.target.checked,
                  })}
                />
                Auto-archive captured media
              </label>

              <label className={styles.formCheckbox} style="margin-top: 8px">
                <input
                  type="checkbox"
                  checked={mediaConfig.imageAnalysisEnabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMediaConfig({
                    ...mediaConfig,
                    imageAnalysisEnabled: e.target.checked,
                  })}
                />
                Enable image analysis hook (requires external handler)
              </label>
            </div>
          )}
        </div>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className={styles.wizardStep}>
          <div className={styles.wizardStepTitle}>Step 4: Review & Deploy</div>
          <div style="background: var(--minion-card-bg); border-radius: 8px; padding: 14px; font-size: 0.8125rem; line-height: 1.8">
            <div><strong>Name:</strong>{` ${name}`}</div>
            <div><strong>Type:</strong>{` ${MINION_TYPES.find((t) => t.value === type)?.label}`}</div>
            <div><strong>Poll Interval:</strong>{` ${pollInterval}s`}</div>
            <div><strong>Auto-start:</strong>{` ${enabled ? 'Yes' : 'No'}`}</div>
            <div><strong>Targets:</strong>{` ${targetChatIds.join(', ')}`}</div>
            {type === 'keyword-monitor' && (
              <>
                <div><strong>Keywords:</strong>{` ${keywordConfig.keywords.join(', ') || 'None'}`}</div>
                <div><strong>Regex Patterns:</strong>{` ${keywordConfig.regexPatterns.length || 'None'}`}</div>
              </>
            )}
            {type === 'new-member-alert' && (
              <>
                <div><strong>Watchlist IDs:</strong>{` ${memberConfig.watchlistUserIds.length}`}</div>
                <div><strong>New Account Threshold:</strong>{` ${memberConfig.newAccountThresholdDays} days`}</div>
              </>
            )}
            {type === 'channel-clone-detector' && (
              <div><strong>Protected Channels:</strong>{` ${cloneConfig.protectedChannels.length}`}</div>
            )}
            {type === 'media-monitor' && (
              <div><strong>Media Types:</strong>{` ${mediaConfig.mediaTypes.join(', ')}`}</div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className={styles.wizardActions}>
        <button type="button" className={styles.headerBtn} onClick={step === 'basics' ? onCancel : prevStep}>
          {step === 'basics' ? 'Cancel' : 'Back'}
        </button>
        {step === 'review' ? (
          <button type="button" className={`${styles.headerBtn} ${styles.primary}`} onClick={handleSave}>
            {existingConfig ? 'Save Changes' : 'Deploy Minion'}
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.headerBtn} ${styles.primary}`}
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(MinionConfigWizard);
