# Project Argus — Scam Sniffer Module (Phase 1B)

**Status:** Pushed to `Stormchaser407/Argus` on `master` branch  
**Commit:** `feat(scam-sniffer): Phase 1B — Complete Scam Sniffer module`  
**Files:** 23 new, 3 modified | ~5,600 lines of functional code

---

## Module Architecture

```
src/plugins/scam-sniffer/
├── index.ts                          # Plugin entry point + public API exports
├── config.ts                         # Config management (env vars + localStorage)
├── types/
│   └── index.ts                      # All TypeScript types, enums, interfaces
├── utils/
│   ├── walletDetector.ts             # Crypto wallet regex detection (10 chains)
│   └── linkDetector.ts               # URL extraction + typosquatting engine
├── services/
│   ├── chainabuseService.ts          # Chainabuse API integration
│   ├── safeBrowsingService.ts        # Google Safe Browsing API
│   ├── virusTotalService.ts          # VirusTotal API
│   ├── domainAgeService.ts           # RDAP domain age checking
│   ├── linkAnalysisService.ts        # Link analysis orchestrator
│   ├── patternMatchingService.ts     # Regex + keyword matching engine
│   ├── behaviorScoringService.ts     # Account trust scoring
│   └── messageScannerService.ts      # Main scanning pipeline orchestrator
├── patterns/
│   └── scamPatterns.ts               # 12-category scam pattern library
├── hooks/
│   └── useMessageScan.ts             # Teact hooks for components
├── components/
│   ├── index.ts                      # Component barrel exports
│   ├── WalletWarning.tsx             # Inline wallet warning + tooltip
│   ├── LinkWarning.tsx               # Link warning overlay + detail panel
│   ├── TrustBadge.tsx                # Profile trust score badge
│   ├── MessageScanIndicator.tsx      # Per-message threat indicator
│   ├── PatternMatchWarning.tsx       # Scam pattern alert
│   └── ScamSnifferDashboard.tsx      # Full dashboard (overview/threats/settings)
└── styles/
    └── ScamSniffer.module.scss       # All styles (telegram-tt design language)
```

---

## 5 Subsystems

### 1. Crypto Wallet Detection & Checking
- **Detection:** Regex patterns for BTC (1/3/bc1), ETH (0x), USDT/TRC20 (T), SOL, XRP, LTC, DOGE, ADA, DOT, MATIC
- **Checking:** Chainabuse API with response caching (5-min TTL)
- **UI:** `WalletWarning` component — inline badge (green/red/gray) with expandable tooltip showing risk score, report count, categories, last report date
- **Graceful degradation:** Shows "API not configured" when `ARGUS_CHAINABUSE_API_KEY` is missing

### 2. Phishing Link Detection
- **Google Safe Browsing:** Checks against MALWARE, SOCIAL_ENGINEERING, UNWANTED_SOFTWARE, POTENTIALLY_HARMFUL_APPLICATION
- **VirusTotal:** Multi-engine URL scanning with positives/total ratio
- **Typosquatting:** 40+ legitimate domains, 6 techniques (character swap, homoglyph, missing char, extra char, wrong TLD, subdomain trick)
- **Domain Age:** RDAP-based checking (no API key needed), flags domains < 30 days old
- **UI:** `LinkWarning` component — badge (⚠ SUSPICIOUS / ⛔ DANGEROUS) with expandable panel showing all check results, proceed/block buttons
- **Graceful degradation:** Each check independently reports "API not configured" or "unavailable"

### 3. Account Behavior Scoring
- **Trust Score:** 0-100 scale (Trusted/Normal/Suspicious/High Risk/Critical Risk)
- **Risk Factors:**
  - Account age (< 24h = -40%, < 7d = -30%, < 30d = -20%, > 1yr = +15%)
  - Username patterns (authority keywords, crypto keywords, confusable chars, etc.)
  - Message patterns (urgency language, TGTBT, excessive caps, emoji spam)
  - Forwarding behavior (mass-forwarded content)
  - Link posting frequency
  - Wallet mention frequency
- **UI:** `TrustBadge` component — color-coded badge (compact or full mode) for profiles
- **Incremental:** Scores update as new messages are processed

### 4. Known Scam Pattern Matching
- **12 Categories:** Pig butchering, fake admin, crypto giveaway, fake job, clone channel, investment fraud, romance scam, credential phishing, advance fee, impersonation, pump & dump, fake support
- **Engine:** Combined regex + keyword-set matching with confidence scoring
- **Amplifiers:** Urgency language (+15%) and TGTBT language (+15%) boost confidence
- **Sensitivity:** Configurable (low/medium/high) with multipliers
- **UI:** `PatternMatchWarning` component — expandable inline alert with category, confidence %, and matched text

### 5. Scam Sniffer Dashboard
- **Overview Tab:** Stats cards (threats/wallets/links/patterns), scan summary, API status indicators
- **Threat Log Tab:** Filterable by type (wallet/link/pattern/behavior), false positive reporting, clear log
- **Settings Tab:** Toggle switches for all features, sensitivity selector, per-API toggles
- **Access:** Designed for sidebar panel integration

---

## Setup

### 🟡 Environment Variables

Add to your `.env` file (see `.env.example`):

```bash
# Chainabuse — Crypto wallet scam reports
# Get key at: https://docs.chainabuse.com
ARGUS_CHAINABUSE_API_KEY=your_key_here

# Google Safe Browsing — Malicious URL detection
# Get key at: https://developers.google.com/safe-browsing/v4/get-started
ARGUS_SAFE_BROWSING_API_KEY=your_key_here

# VirusTotal — Multi-engine URL scanning
# Get key at: https://www.virustotal.com/gui/my-apikey
ARGUS_VIRUSTOTAL_API_KEY=your_key_here
```

**All APIs are optional.** The module works without any keys — it just shows "API not configured" for those checks and still runs local detection (typosquatting, domain age via RDAP, wallet regex, pattern matching, behavior scoring).

### 🟢 Webpack Integration

Already done — the three env vars are added to `webpack.config.ts` EnvironmentPlugin with empty string defaults.

---

## Integration Points

### Using in a Message Component

```tsx
import { useMessageScan } from '../plugins/scam-sniffer';
import { WalletWarning, LinkWarning, PatternMatchWarning, MessageScanIndicator } from '../plugins/scam-sniffer';

// Inside a message component:
const { scanResult, isScanning, hasThreat } = useMessageScan({
  messageId: message.id,
  chatId: chat.id,
  text: message.text,
  senderId: message.senderId,
  // ...
});

// Render inline warnings
{scanResult?.wallets.filter(w => w.isFlagged).map(wallet => (
  <WalletWarning wallet={wallet} />
))}

{scanResult?.links.filter(l => l.isMalicious).map(link => (
  <LinkWarning linkResult={link} />
))}

{scanResult?.patternMatches.length > 0 && (
  <PatternMatchWarning matches={scanResult.patternMatches} />
)}

{hasThreat && <MessageScanIndicator scanResult={scanResult} />}
```

### Using Trust Badge on Profiles

```tsx
import { TrustBadge } from '../plugins/scam-sniffer';

<TrustBadge peerId={user.id} />          // Full: "Suspicious (35)"
<TrustBadge peerId={user.id} compact />  // Compact: "⚠ 35"
```

### Using the Dashboard

```tsx
import { ScamSnifferDashboard } from '../plugins/scam-sniffer';

// In a sidebar panel:
<ScamSnifferDashboard />
```

### Direct Service Access

```tsx
import { scanMessage, getThreatLog, getStats, reportFalsePositive } from '../plugins/scam-sniffer';
import { detectWallets, checkTyposquatting } from '../plugins/scam-sniffer';

// Scan a message programmatically
const result = await scanMessage({ messageId: 123, chatId: 'chat1', text: '...' });

// Get threat log
const threats = getThreatLog({ type: 'wallet', limit: 50 });

// Report false positive
reportFalsePositive(threatEntryId);
```

---

## What's Next (Phase 2+ Integration)

The module is fully functional as a standalone scanning engine. To wire it into the live chat flow:

1. **Hook into message rendering** — Add `useMessageScan` to the Message component and render inline warnings
2. **Hook into profile view** — Add `TrustBadge` to the user profile panel
3. **Add sidebar entry** — Register `ScamSnifferDashboard` as a sidebar panel
4. **Wire GramJS events** — Subscribe to new message events to trigger scanning automatically

These are UI integration tasks that touch the core telegram-tt components — kept separate to avoid merge conflicts with the base codebase.
