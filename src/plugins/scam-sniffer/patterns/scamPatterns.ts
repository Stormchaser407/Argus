/**
 * Project Argus — Scam Sniffer: Scam Pattern Library
 * Comprehensive regex and keyword-based patterns for detecting common Telegram scams.
 *
 * Each pattern includes:
 * - Regex patterns for structural matching
 * - Keyword sets for semantic matching (all keywords in a set must appear)
 * - Confidence thresholds and alert levels
 */

import { AlertAction, ScamCategory } from '../types';
import type { ScamPattern } from '../types';

// ─── Pattern Definitions ─────────────────────────────────────────────────────

export const SCAM_PATTERNS: ScamPattern[] = [
  // ── Pig Butchering (Romance + Investment) ────────────────────────────────
  {
    id: 'pig-butchering-romance-invest',
    category: ScamCategory.PIG_BUTCHERING,
    name: 'Pig Butchering (Romance + Investment)',
    description: 'Combines romantic interest with investment opportunities. Scammer builds trust over time, then introduces a "guaranteed" investment platform.',
    regexPatterns: [
      /(?:my\s+(?:uncle|aunt|friend|mentor|teacher).*(?:invest|trad|crypto|forex))/i,
      /(?:special\s+(?:investment|trading)\s+(?:platform|opportunity|group))/i,
      /(?:guaranteed\s+(?:returns?|profit|income).*(?:\d+%|\$\d+))/i,
      /(?:(?:i\s+(?:made|earned|got))\s+\$?\d[\d,]*\s*(?:in|from|with)\s*(?:just|only)?\s*\d+\s*(?:day|hour|week|month))/i,
      /(?:(?:mining|staking|liquidity)\s+(?:pool|farm).*(?:guaranteed|daily|passive)\s+(?:return|income|profit))/i,
    ],
    keywordSets: [
      ['investment', 'guaranteed', 'return'],
      ['trading', 'platform', 'profit'],
      ['crypto', 'opportunity', 'passive income'],
      ['mining', 'daily', 'profit'],
      ['forex', 'signal', 'guaranteed'],
    ],
    alertLevel: AlertAction.DANGER,
    minConfidence: 0.6,
  },

  // ── Fake Admin Impersonation ─────────────────────────────────────────────
  {
    id: 'fake-admin-impersonation',
    category: ScamCategory.FAKE_ADMIN,
    name: 'Fake Admin Impersonation',
    description: 'Scammer impersonates a group admin or support agent, often DMing users to "verify" their account or wallet.',
    regexPatterns: [
      /(?:i\s*(?:am|'m)\s*(?:the|a|an)?\s*(?:admin|moderator|mod|support|staff|team\s*member))/i,
      /(?:(?:verify|validate|confirm|authenticate)\s+(?:your|ur)\s+(?:account|wallet|identity))/i,
      /(?:(?:send|share|provide)\s+(?:your|ur)\s+(?:seed\s*phrase|private\s*key|recovery\s*phrase|mnemonic))/i,
      /(?:(?:your\s+(?:account|wallet)\s+(?:has\s+been|is|was)\s+(?:compromised|hacked|flagged|suspended)))/i,
      /(?:(?:click|tap)\s+(?:here|this\s+link)\s+to\s+(?:verify|validate|restore|recover))/i,
    ],
    keywordSets: [
      ['admin', 'verify', 'account'],
      ['support', 'wallet', 'confirm'],
      ['moderator', 'suspended', 'verify'],
      ['seed phrase', 'share'],
      ['private key', 'send'],
      ['recovery phrase', 'provide'],
    ],
    alertLevel: AlertAction.DANGER,
    minConfidence: 0.5,
  },

  // ── Crypto Giveaway Scam ─────────────────────────────────────────────────
  {
    id: 'crypto-giveaway',
    category: ScamCategory.CRYPTO_GIVEAWAY,
    name: 'Crypto Giveaway Scam ("Send X, Get 2X")',
    description: 'Classic advance-fee scam where victims are told to send crypto to receive a multiplied amount back.',
    regexPatterns: [
      /(?:send\s+\d+\.?\d*\s*(?:BTC|ETH|SOL|USDT|crypto).*(?:get|receive|earn)\s+\d+\.?\d*\s*(?:back|return))/i,
      /(?:(?:giveaway|airdrop).*(?:send|deposit).*(?:receive|get)\s+(?:double|2x|3x|5x|10x))/i,
      /(?:(?:elon|musk|vitalik|cz|binance).*(?:giveaway|giving\s+away|distributing))/i,
      /(?:(?:first|next)\s+\d+\s+(?:people|participants|users).*(?:free|bonus|reward).*(?:BTC|ETH|crypto))/i,
      /(?:(?:limited\s+time|hurry|act\s+now|don'?t\s+miss).*(?:giveaway|airdrop|free\s+crypto))/i,
    ],
    keywordSets: [
      ['giveaway', 'send', 'receive', 'double'],
      ['airdrop', 'free', 'crypto', 'limited'],
      ['giveaway', 'BTC', 'ETH'],
      ['send', 'get back', 'multiply'],
    ],
    alertLevel: AlertAction.DANGER,
    minConfidence: 0.7,
  },

  // ── Fake Job Offers ──────────────────────────────────────────────────────
  {
    id: 'fake-job-offer',
    category: ScamCategory.FAKE_JOB,
    name: 'Fake Job Offer',
    description: 'Scammer offers high-paying remote jobs with minimal requirements, often requiring an upfront "training fee" or personal information.',
    regexPatterns: [
      /(?:(?:earn|make)\s+\$?\d[\d,]*\s*(?:\/|\s*per\s*)(?:day|hour|week).*(?:from\s+home|remote|online|part[\s-]?time))/i,
      /(?:(?:no\s+experience|no\s+skills?|anyone\s+can).*(?:earn|make|income)\s+\$?\d[\d,]*)/i,
      /(?:(?:hiring|looking\s+for|need).*(?:data\s+entry|review|click|like|watch).*\$?\d[\d,]*\s*(?:\/|\s*per))/i,
      /(?:(?:training|registration|activation)\s+fee.*\$?\d+)/i,
      /(?:(?:work\s+from\s+(?:home|anywhere)).*(?:guaranteed|easy)\s+(?:income|money|pay))/i,
    ],
    keywordSets: [
      ['earn', 'per day', 'from home', 'no experience'],
      ['hiring', 'easy money', 'part time'],
      ['remote', 'guaranteed income', 'apply now'],
      ['training fee', 'registration', 'deposit'],
    ],
    alertLevel: AlertAction.WARNING,
    minConfidence: 0.5,
  },

  // ── Clone Channel Detection ──────────────────────────────────────────────
  {
    id: 'clone-channel',
    category: ScamCategory.CLONE_CHANNEL,
    name: 'Clone Channel / Impersonation',
    description: 'Scammer creates a near-identical copy of a legitimate channel to redirect users to phishing links or scam offers.',
    regexPatterns: [
      /(?:(?:official|real|original|verified)\s+(?:channel|group|chat).*(?:moved|migrated|changed|updated)\s+(?:to|here))/i,
      /(?:(?:this\s+is\s+the\s+(?:new|real|official)).*(?:channel|group))/i,
      /(?:(?:old\s+(?:channel|group)\s+(?:was|got|has\s+been)\s+(?:hacked|deleted|banned)))/i,
      /(?:(?:join|switch\s+to)\s+(?:our\s+)?(?:new|updated|official)\s+(?:channel|group))/i,
    ],
    keywordSets: [
      ['official channel', 'moved', 'join'],
      ['real group', 'migrated', 'new link'],
      ['old channel', 'hacked', 'new'],
    ],
    alertLevel: AlertAction.WARNING,
    minConfidence: 0.5,
  },

  // ── Investment Fraud (General) ───────────────────────────────────────────
  {
    id: 'investment-fraud-general',
    category: ScamCategory.INVESTMENT_FRAUD,
    name: 'Investment Fraud',
    description: 'General investment fraud patterns including pump-and-dump, fake ICOs, and Ponzi schemes.',
    regexPatterns: [
      /(?:(?:100|200|300|500|1000)x\s+(?:return|gain|profit|potential))/i,
      /(?:(?:guaranteed|risk[\s-]?free|no[\s-]?loss)\s+(?:investment|return|profit|income))/i,
      /(?:(?:next\s+(?:100|1000)x\s+(?:gem|coin|token)))/i,
      /(?:(?:presale|pre[\s-]?launch|ICO|IDO).*(?:guaranteed|moon|100x))/i,
      /(?:(?:join\s+(?:now|today|before).*(?:too\s+late|miss\s+out|sold\s+out)).*(?:invest|token|coin))/i,
    ],
    keywordSets: [
      ['guaranteed', 'investment', 'return', 'risk free'],
      ['presale', 'token', 'moon'],
      ['100x', 'gem', 'buy now'],
      ['passive income', 'daily returns', 'guaranteed'],
    ],
    alertLevel: AlertAction.DANGER,
    minConfidence: 0.6,
  },

  // ── Romance Scam ─────────────────────────────────────────────────────────
  {
    id: 'romance-scam',
    category: ScamCategory.ROMANCE_SCAM,
    name: 'Romance Scam',
    description: 'Scammer builds a romantic relationship to eventually request money for emergencies, travel, or investments.',
    regexPatterns: [
      /(?:(?:i\s+(?:love|miss|need)\s+you).*(?:send|transfer|wire|money|help\s+(?:me|with)))/i,
      /(?:(?:stuck|stranded|hospital|emergency|customs).*(?:send|need|help).*(?:money|\$|bitcoin|crypto|gift\s+card))/i,
      /(?:(?:gift\s+card|itunes|google\s+play|steam).*(?:send|buy|purchase).*(?:help|emergency|stuck))/i,
    ],
    keywordSets: [
      ['love', 'send money', 'emergency'],
      ['stuck', 'help', 'wire transfer'],
      ['gift card', 'emergency', 'please help'],
    ],
    alertLevel: AlertAction.WARNING,
    minConfidence: 0.5,
  },

  // ── Phishing (Credential Harvesting) ─────────────────────────────────────
  {
    id: 'phishing-credential',
    category: ScamCategory.PHISHING,
    name: 'Credential Phishing',
    description: 'Attempts to harvest login credentials, API keys, or wallet seed phrases through fake login pages.',
    regexPatterns: [
      /(?:(?:enter|input|type|provide)\s+(?:your|ur)\s+(?:password|login|credentials|api\s*key))/i,
      /(?:(?:your\s+(?:account|session)\s+(?:expired|will\s+expire|needs?\s+(?:verification|update))))/i,
      /(?:(?:log\s*in|sign\s*in)\s+(?:to\s+)?(?:verify|confirm|restore|update)\s+(?:your|ur)\s+(?:account|wallet))/i,
      /(?:(?:connect\s+(?:your|ur)\s+wallet).*(?:claim|receive|airdrop|reward))/i,
    ],
    keywordSets: [
      ['enter', 'password', 'verify'],
      ['account expired', 'login', 'confirm'],
      ['connect wallet', 'claim', 'reward'],
      ['session expired', 'verify', 'click'],
    ],
    alertLevel: AlertAction.DANGER,
    minConfidence: 0.6,
  },

  // ── Advance Fee Fraud ────────────────────────────────────────────────────
  {
    id: 'advance-fee',
    category: ScamCategory.ADVANCE_FEE,
    name: 'Advance Fee Fraud',
    description: 'Victim is told they have won a prize or inheritance but must pay fees to claim it.',
    regexPatterns: [
      /(?:(?:you\s+(?:have\s+)?(?:won|been\s+selected|inherited)).*(?:pay|fee|tax|processing|transfer))/i,
      /(?:(?:claim\s+(?:your|the)\s+(?:prize|reward|inheritance|winnings)).*(?:fee|deposit|payment))/i,
      /(?:(?:processing|withdrawal|activation|verification)\s+fee\s+of\s+\$?\d+)/i,
      /(?:(?:congratulations|congrats).*(?:won|selected|winner).*(?:contact|claim|DM))/i,
    ],
    keywordSets: [
      ['won', 'prize', 'fee', 'claim'],
      ['inheritance', 'processing fee', 'pay'],
      ['congratulations', 'winner', 'contact'],
      ['selected', 'reward', 'deposit required'],
    ],
    alertLevel: AlertAction.DANGER,
    minConfidence: 0.6,
  },

  // ── Impersonation (General) ──────────────────────────────────────────────
  {
    id: 'impersonation-general',
    category: ScamCategory.IMPERSONATION,
    name: 'Celebrity / Brand Impersonation',
    description: 'Scammer impersonates a well-known person or brand to lend credibility to a scam.',
    regexPatterns: [
      /(?:(?:i\s*(?:am|'m)\s+(?:elon|vitalik|cz|sam|mark|jeff|bill)))/i,
      /(?:(?:official\s+(?:account|page|channel)\s+of))/i,
      /(?:(?:verified\s+by\s+(?:telegram|binance|coinbase|metamask)))/i,
    ],
    keywordSets: [
      ['official account', 'verified'],
      ['Elon Musk', 'giveaway'],
      ['Binance official', 'announcement'],
    ],
    alertLevel: AlertAction.WARNING,
    minConfidence: 0.5,
  },

  // ── Pump and Dump ────────────────────────────────────────────────────────
  {
    id: 'pump-and-dump',
    category: ScamCategory.PUMP_AND_DUMP,
    name: 'Pump and Dump Signal',
    description: 'Coordinated buying campaigns designed to inflate a token price before insiders sell.',
    regexPatterns: [
      /(?:(?:pump\s+(?:signal|alert|call|target)))/i,
      /(?:(?:buy\s+(?:now|signal|alert).*(?:target|pump|moon)))/i,
      /(?:(?:next\s+pump\s+(?:in|at|starts?)))/i,
      /(?:(?:(?:target|take\s+profit)\s*[:=]\s*\d+[%x]))/i,
      /(?:(?:massive\s+pump\s+coming|pump\s+(?:is\s+)?starting))/i,
    ],
    keywordSets: [
      ['pump', 'signal', 'buy now'],
      ['pump', 'target', 'profit'],
      ['buy signal', 'moon', 'gem'],
    ],
    alertLevel: AlertAction.WARNING,
    minConfidence: 0.6,
  },

  // ── Fake Support / Tech Support Scam ─────────────────────────────────────
  {
    id: 'fake-support',
    category: ScamCategory.FAKE_SUPPORT,
    name: 'Fake Technical Support',
    description: 'Scammer poses as customer support to gain access to accounts or wallets.',
    regexPatterns: [
      /(?:(?:contact\s+(?:our|the)\s+(?:support|help\s*desk|team)).*(?:DM|message|click))/i,
      /(?:(?:(?:support|help)\s+(?:ticket|request)\s+#?\d+))/i,
      /(?:(?:(?:we\s+(?:noticed|detected)\s+(?:suspicious|unusual)\s+(?:activity|login|transaction))))/i,
      /(?:(?:(?:your\s+(?:funds?|assets?|tokens?)\s+(?:are|is)\s+(?:at\s+risk|locked|frozen))))/i,
    ],
    keywordSets: [
      ['support', 'DM', 'resolve'],
      ['suspicious activity', 'contact', 'immediately'],
      ['funds at risk', 'verify', 'support'],
      ['help desk', 'ticket', 'urgent'],
    ],
    alertLevel: AlertAction.DANGER,
    minConfidence: 0.5,
  },
];

// ─── Urgency Language Patterns ───────────────────────────────────────────────
// These amplify the confidence score when found alongside other scam patterns.

export const URGENCY_PATTERNS: RegExp[] = [
  /(?:(?:act|hurry|respond)\s+(?:now|fast|quickly|immediately))/i,
  /(?:(?:limited\s+(?:time|spots?|offer|availability)))/i,
  /(?:(?:(?:don'?t|do\s+not)\s+(?:miss|wait|delay|hesitate)))/i,
  /(?:(?:(?:only|just)\s+\d+\s+(?:spots?|slots?|places?)\s+(?:left|remaining|available)))/i,
  /(?:(?:(?:expires?|ends?|closing)\s+(?:soon|today|tonight|in\s+\d+\s+(?:hour|minute))))/i,
  /(?:(?:last\s+chance|final\s+(?:call|warning|opportunity)))/i,
  /(?:(?:once\s+in\s+a\s+lifetime|never\s+(?:again|before)))/i,
  /(?:(?:exclusive|VIP|private)\s+(?:offer|access|group|channel))/i,
];

// ─── Too-Good-To-Be-True Patterns ───────────────────────────────────────────

export const TGTBT_PATTERNS: RegExp[] = [
  /(?:(?:earn|make|get)\s+\$?\d[\d,]*\s*(?:\/|\s*per\s*)(?:day|hour|week)\s+(?:guaranteed|easily|effortlessly))/i,
  /(?:(?:100%|guaranteed|risk[\s-]?free)\s+(?:return|profit|success))/i,
  /(?:(?:free\s+(?:money|crypto|bitcoin|ethereum|tokens?)))/i,
  /(?:(?:double|triple|multiply)\s+(?:your|ur)\s+(?:money|crypto|investment|bitcoin))/i,
  /(?:(?:secret|insider)\s+(?:method|strategy|technique|formula|system))/i,
  /(?:(?:millionaire|rich|wealthy)\s+(?:in|within)\s+\d+\s+(?:day|week|month))/i,
];

/**
 * Returns all scam patterns, optionally filtered by category.
 */
export function getScamPatterns(category?: ScamCategory): ScamPattern[] {
  if (category) {
    return SCAM_PATTERNS.filter((p) => p.category === category);
  }
  return SCAM_PATTERNS;
}

/**
 * Returns the total number of patterns in the library.
 */
export function getPatternCount(): number {
  return SCAM_PATTERNS.length;
}
