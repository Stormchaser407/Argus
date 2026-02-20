/**
 * Project Argus — Evidence Exporter
 * Exports archived evidence as structured JSON or PDF reports.
 */

import type {
  EvidenceExportResult,
  EvidenceItem,
  ExportOptions,
} from '../types';
import { sha256 } from './hashing';
import { formatForensicTimestamp, verifyCustodyChain } from './hashing';

/**
 * Export evidence in the specified format.
 */
export async function exportEvidence(
  evidence: EvidenceItem,
  options: ExportOptions,
): Promise<EvidenceExportResult> {
  switch (options.format) {
    case 'json':
      return exportAsJson(evidence, options);
    case 'pdf':
      return exportAsPdf(evidence, options);
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
}

/**
 * Export evidence as structured JSON with hashes and metadata.
 */
async function exportAsJson(
  evidence: EvidenceItem,
  options: ExportOptions,
): Promise<EvidenceExportResult> {
  const exportData: Record<string, unknown> = {
    _meta: {
      exportFormat: 'Argus Evidence Package v1.0',
      exportedAt: formatForensicTimestamp(Math.floor(Date.now() / 1000)),
      toolVersion: 'Project Argus 1.0.0',
      evidenceId: evidence.evidenceId,
      originalHash: evidence.sha256Hash,
    },
    case: {
      caseNumber: options.caseNumber || 'N/A',
      caseTitle: options.caseTitle || 'N/A',
      investigator: options.investigatorName || 'N/A',
    },
    evidence: {
      id: evidence.evidenceId,
      title: evidence.title,
      description: evidence.description,
      scope: evidence.archiveScope,
      chatId: evidence.chatId,
      chatTitle: evidence.chatTitle,
      capturedAt: formatForensicTimestamp(evidence.capturedAt),
      capturedBy: evidence.capturedBy,
      status: evidence.status,
      sha256Hash: evidence.sha256Hash,
      tags: evidence.tags,
      notes: evidence.notes,
    },
    messages: evidence.messages.map((msg) => {
      const entry: Record<string, unknown> = {
        messageId: msg.messageId,
        chatId: msg.chatId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderUsername: msg.senderUsername,
        date: formatForensicTimestamp(msg.date),
        text: msg.text,
        mediaType: msg.mediaType,
        mediaFileName: msg.mediaFileName,
        isEdited: msg.isEdited,
        editDate: msg.editDate ? formatForensicTimestamp(msg.editDate) : undefined,
        isForwarded: msg.isForwarded,
        forwardFromId: msg.forwardFromId,
        forwardDate: msg.forwardDate ? formatForensicTimestamp(msg.forwardDate) : undefined,
        replyToMessageId: msg.replyToMessageId,
        viewsCount: msg.viewsCount,
      };

      if (options.includeRawData) {
        entry.rawData = msg.rawData;
      }

      return entry;
    }),
    mediaFiles: evidence.mediaFiles.map((media) => ({
      fileId: media.fileId,
      fileName: media.fileName,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      sha256Hash: media.sha256Hash,
      capturedAt: formatForensicTimestamp(media.capturedAt),
      messageId: media.messageId,
    })),
  };

  if (options.includeChainOfCustody) {
    const chainVerification = verifyCustodyChain(evidence.chainOfCustody);
    exportData.chainOfCustody = {
      isValid: chainVerification.isValid,
      entries: evidence.chainOfCustody.map((entry) => ({
        timestamp: formatForensicTimestamp(entry.timestamp),
        action: entry.action,
        actor: entry.actor,
        details: entry.details,
        itemHash: entry.itemHash,
        previousHash: entry.previousHash || 'GENESIS',
      })),
    };
  }

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const exportHash = await sha256(jsonString);

  const fileName = `argus-evidence-${evidence.evidenceId}-${Date.now()}.json`;

  return {
    format: 'json',
    fileName,
    fileSize: blob.size,
    sha256Hash: exportHash,
    exportedAt: Math.floor(Date.now() / 1000),
    itemCount: evidence.messages.length,
    blob,
  };
}

/**
 * Export evidence as a PDF report.
 * Generates an HTML-based PDF with forensic metadata.
 */
async function exportAsPdf(
  evidence: EvidenceItem,
  options: ExportOptions,
): Promise<EvidenceExportResult> {
  const chainVerification = verifyCustodyChain(evidence.chainOfCustody);
  const now = formatForensicTimestamp(Math.floor(Date.now() / 1000));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; font-size: 11px; color: #333; padding: 40px; line-height: 1.5; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { font-size: 18px; letter-spacing: 2px; margin-bottom: 5px; }
    .header .subtitle { font-size: 12px; color: #666; }
    .section { margin-bottom: 20px; page-break-inside: avoid; }
    .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #999; padding-bottom: 5px; margin-bottom: 10px; }
    .field { display: flex; margin-bottom: 3px; }
    .field-label { width: 180px; font-weight: bold; color: #555; flex-shrink: 0; }
    .field-value { flex: 1; word-break: break-all; }
    .hash { font-family: 'Courier New', monospace; font-size: 9px; color: #666; }
    .message { border: 1px solid #ddd; padding: 10px; margin-bottom: 8px; page-break-inside: avoid; }
    .message-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 10px; color: #666; }
    .message-sender { font-weight: bold; color: #333; }
    .message-text { margin-top: 5px; white-space: pre-wrap; }
    .message-meta { font-size: 9px; color: #999; margin-top: 5px; }
    .custody-entry { border-left: 3px solid #333; padding-left: 10px; margin-bottom: 8px; }
    .custody-time { font-size: 9px; color: #666; }
    .custody-action { font-weight: bold; text-transform: uppercase; }
    .footer { margin-top: 30px; border-top: 2px solid #333; padding-top: 10px; text-align: center; font-size: 9px; color: #666; }
    .integrity-badge { display: inline-block; padding: 3px 10px; border: 1px solid; font-weight: bold; font-size: 10px; }
    .integrity-valid { border-color: #34C759; color: #34C759; }
    .integrity-invalid { border-color: #FF3B30; color: #FF3B30; }
    .warning { background-color: #FFF3CD; border: 1px solid #FFCC00; padding: 8px; margin-bottom: 10px; font-size: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PROJECT ARGUS — EVIDENCE REPORT</h1>
    <div class="subtitle">FORENSIC EVIDENCE PRESERVATION DOCUMENT</div>
    <div class="subtitle">Generated: ${now}</div>
  </div>

  <div class="section">
    <div class="section-title">Case Information</div>
    <div class="field"><span class="field-label">Case Number:</span><span class="field-value">${escapeHtml(options.caseNumber || 'N/A')}</span></div>
    <div class="field"><span class="field-label">Case Title:</span><span class="field-value">${escapeHtml(options.caseTitle || 'N/A')}</span></div>
    <div class="field"><span class="field-label">Investigator:</span><span class="field-value">${escapeHtml(options.investigatorName || 'N/A')}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Evidence Summary</div>
    <div class="field"><span class="field-label">Evidence ID:</span><span class="field-value">${evidence.evidenceId}</span></div>
    <div class="field"><span class="field-label">Title:</span><span class="field-value">${escapeHtml(evidence.title)}</span></div>
    <div class="field"><span class="field-label">Scope:</span><span class="field-value">${evidence.archiveScope}</span></div>
    <div class="field"><span class="field-label">Source Chat:</span><span class="field-value">${escapeHtml(evidence.chatTitle)} (ID: ${evidence.chatId})</span></div>
    <div class="field"><span class="field-label">Captured At:</span><span class="field-value">${formatForensicTimestamp(evidence.capturedAt)}</span></div>
    <div class="field"><span class="field-label">Captured By:</span><span class="field-value">${escapeHtml(evidence.capturedBy)}</span></div>
    <div class="field"><span class="field-label">Message Count:</span><span class="field-value">${evidence.messages.length}</span></div>
    <div class="field"><span class="field-label">Media Files:</span><span class="field-value">${evidence.mediaFiles.length}</span></div>
    <div class="field"><span class="field-label">Status:</span><span class="field-value">${evidence.status.toUpperCase()}</span></div>
    <div class="field"><span class="field-label">Tags:</span><span class="field-value">${evidence.tags.join(', ') || 'None'}</span></div>
    <div class="field"><span class="field-label">SHA-256 Hash:</span><span class="field-value hash">${evidence.sha256Hash}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Integrity Verification</div>
    <span class="integrity-badge ${chainVerification.isValid ? 'integrity-valid' : 'integrity-invalid'}">
      ${chainVerification.isValid ? 'CHAIN VALID' : 'CHAIN BROKEN'}
    </span>
    ${!chainVerification.isValid ? `<div class="warning">WARNING: Chain of custody integrity check failed at entry ${chainVerification.brokenAt}.</div>` : ''}
  </div>

  ${options.includeChainOfCustody ? `
  <div class="section">
    <div class="section-title">Chain of Custody (${evidence.chainOfCustody.length} entries)</div>
    ${evidence.chainOfCustody.map((entry) => `
    <div class="custody-entry">
      <div class="custody-time">${formatForensicTimestamp(entry.timestamp)}</div>
      <div><span class="custody-action">${entry.action}</span> — ${escapeHtml(entry.details)}</div>
      <div class="hash">Actor: ${escapeHtml(entry.actor)} | Hash: ${entry.itemHash}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Archived Messages (${evidence.messages.length})</div>
    ${evidence.messages.map((msg) => `
    <div class="message">
      <div class="message-header">
        <span class="message-sender">${escapeHtml(msg.senderName || msg.senderId || 'Unknown')}${msg.senderUsername ? ` (@${escapeHtml(msg.senderUsername)})` : ''}</span>
        <span>${formatForensicTimestamp(msg.date)}</span>
      </div>
      ${msg.text ? `<div class="message-text">${escapeHtml(msg.text)}</div>` : ''}
      <div class="message-meta">
        Message ID: ${msg.messageId} | Chat ID: ${msg.chatId}
        ${msg.isEdited ? ` | EDITED: ${msg.editDate ? formatForensicTimestamp(msg.editDate) : 'Yes'}` : ''}
        ${msg.isForwarded ? ` | FORWARDED from: ${msg.forwardFromId || 'hidden'}` : ''}
        ${msg.mediaType ? ` | Media: ${msg.mediaType}${msg.mediaFileName ? ` (${escapeHtml(msg.mediaFileName)})` : ''}` : ''}
        ${msg.viewsCount ? ` | Views: ${msg.viewsCount}` : ''}
      </div>
    </div>
    `).join('')}
  </div>

  ${evidence.notes ? `
  <div class="section">
    <div class="section-title">Investigator Notes</div>
    <p>${escapeHtml(evidence.notes)}</p>
  </div>
  ` : ''}

  <div class="footer">
    <p>This document was generated by Project Argus Evidence Preservation System.</p>
    <p>Evidence Hash: ${evidence.sha256Hash}</p>
    <p>Report Generated: ${now}</p>
    <p>This report is intended for authorized investigative use only.</p>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const exportHash = await sha256(html);
  const fileName = `argus-evidence-report-${evidence.evidenceId}-${Date.now()}.html`;

  return {
    format: 'pdf',
    fileName,
    fileSize: blob.size,
    sha256Hash: exportHash,
    exportedAt: Math.floor(Date.now() / 1000),
    itemCount: evidence.messages.length,
    blob,
  };
}

/**
 * Trigger a file download in the browser.
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export multiple evidence items as a single JSON catalog.
 */
export async function exportEvidenceCatalog(
  items: EvidenceItem[],
): Promise<EvidenceExportResult> {
  const catalogData = {
    _meta: {
      exportFormat: 'Argus Evidence Catalog v1.0',
      exportedAt: formatForensicTimestamp(Math.floor(Date.now() / 1000)),
      toolVersion: 'Project Argus 1.0.0',
      totalItems: items.length,
    },
    items: items.map((item) => ({
      evidenceId: item.evidenceId,
      title: item.title,
      chatTitle: item.chatTitle,
      messageCount: item.messages.length,
      mediaCount: item.mediaFiles.length,
      capturedAt: formatForensicTimestamp(item.capturedAt),
      capturedBy: item.capturedBy,
      status: item.status,
      sha256Hash: item.sha256Hash,
      tags: item.tags,
    })),
  };

  const jsonString = JSON.stringify(catalogData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const exportHash = await sha256(jsonString);

  return {
    format: 'json',
    fileName: `argus-evidence-catalog-${Date.now()}.json`,
    fileSize: blob.size,
    sha256Hash: exportHash,
    exportedAt: Math.floor(Date.now() / 1000),
    itemCount: items.length,
    blob,
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
