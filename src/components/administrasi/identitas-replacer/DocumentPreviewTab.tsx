import React, { useMemo, useEffect, useRef, useState } from 'react';
import {
  Eye,
  CheckSquare,
  FileText,
  FileCheck2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { renderAsync } from 'docx-preview';
import { processDocxArrayBuffer } from '../../../utils/docxProcessor';
import type { TargetIdentityState, OldIdentityState } from './types';

interface DocumentPreviewTabProps {
  processedText: string;
  processedHtml: string | null;
  uploadedDocxBuffer: ArrayBuffer | null;
  uploadedDocxName: string | null;
  previewLayoutMode: 'docx' | 'structured' | 'raw';
  setPreviewLayoutMode: (mode: 'docx' | 'structured' | 'raw') => void;
  targetIdentity: TargetIdentityState;
  oldIdentity: OldIdentityState;
  enableSmartPatternReplace: boolean;
  subject: string;
  highlightReplacements: boolean;
  includeExtraKop: boolean;
  includeExtraSignature: boolean;
  defaultDistrict: string;
  defaultFormattedDate: string;
}

export const DocumentPreviewTab: React.FC<DocumentPreviewTabProps> = ({
  processedText,
  uploadedDocxBuffer,
  uploadedDocxName,
  previewLayoutMode,
  setPreviewLayoutMode,
  targetIdentity,
  oldIdentity,
  enableSmartPatternReplace,
  subject,
  highlightReplacements,
  includeExtraKop,
  includeExtraSignature,
  defaultDistrict,
  defaultFormattedDate,
}) => {
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const [isDocxRendering, setIsDocxRendering] = useState(false);
  const [docxRenderError, setDocxRenderError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const {
    targetSchool,
    targetTeacher,
    targetTeacherNip,
    targetHeadmaster,
    targetHeadmasterNip,
    targetYear,
    targetSemester,
    targetPlace,
    targetDate,
    targetDateLocation,
  } = targetIdentity;

  const effectivePlace = targetPlace ? targetPlace.trim() : defaultDistrict;
  const effectiveDate = targetDate ? targetDate.trim() : defaultFormattedDate;
  const effectiveDateLoc = targetDateLocation ? targetDateLocation.trim() : `${effectivePlace}, ${effectiveDate}`;

  // Highlight Terms
  const highlightTerms = useMemo(() => {
    return [
      targetSchool,
      targetTeacher,
      targetTeacherNip,
      targetHeadmaster,
      targetHeadmasterNip,
      targetYear,
      targetSemester,
      effectiveDateLoc,
      effectivePlace,
      effectiveDate,
    ].filter((t) => t && t.trim().length > 1);
  }, [
    targetSchool,
    targetTeacher,
    targetTeacherNip,
    targetHeadmaster,
    targetHeadmasterNip,
    targetYear,
    targetSemester,
    effectiveDateLoc,
    effectivePlace,
    effectiveDate,
  ]);

  // Helper to highlight terms in raw text/JSX
  const renderWithHighlight = (text: string): React.ReactNode => {
    if (!highlightReplacements || highlightTerms.length === 0 || !text) return text;

    const escaped = highlightTerms.map((t) => t.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = highlightTerms.some((t) => t.trim().toLowerCase() === part.trim().toLowerCase());
      if (isMatch) {
        return (
          <mark
            key={i}
            className="bg-amber-200 text-amber-950 px-1 py-0.5 rounded font-semibold border-b-2 border-amber-500 print:bg-amber-200 print:text-amber-950"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  // Function to highlight DOM nodes inside rendered docx-preview container
  const applyHighlightsToDocxContainer = (container: HTMLElement, terms: string[]) => {
    if (!terms || terms.length === 0) return;

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let currentNode = walker.nextNode();
    while (currentNode) {
      textNodes.push(currentNode as Text);
      currentNode = walker.nextNode();
    }

    const escapedTerms = terms.map((t) => t.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!escapedTerms) return;
    const regex = new RegExp(`(${escapedTerms})`, 'gi');

    for (const node of textNodes) {
      const parent = node.parentElement;
      if (!parent || parent.tagName === 'MARK' || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
        continue;
      }

      const text = node.textContent;
      if (text && regex.test(text)) {
        const span = document.createElement('span');
        span.innerHTML = text.replace(
          regex,
          '<mark class="bg-amber-200 text-amber-950 px-0.5 py-0.5 rounded font-semibold border-b border-amber-500">$1</mark>'
        );
        parent.replaceChild(span, node);
      }
    }
  };

  // Real-time DOCX rendering using docx-preview
  useEffect(() => {
    let isMounted = true;

    async function renderDocxPreview() {
      if (!uploadedDocxBuffer || !docxContainerRef.current) return;

      setIsDocxRendering(true);
      setDocxRenderError(null);

      try {
        const { blob } = await processDocxArrayBuffer(uploadedDocxBuffer, {
          targetSchool,
          targetTeacher,
          targetTeacherNip,
          targetHeadmaster,
          targetHeadmasterNip,
          targetYear,
          targetSemester,
          targetDateLocation: effectiveDateLoc,
          targetPlace: effectivePlace,
          targetDate: effectiveDate,
          subject: subject || 'Matematika',
          oldSchool: oldIdentity.oldSchool,
          oldTeacher: oldIdentity.oldTeacher,
          oldTeacherNip: oldIdentity.oldTeacherNip,
          oldHeadmaster: oldIdentity.oldHeadmaster,
          oldHeadmasterNip: oldIdentity.oldHeadmasterNip,
          oldYear: oldIdentity.oldYear,
          oldDateLocation: oldIdentity.oldDateLocation,
          oldPlace: oldIdentity.oldPlace,
          oldDate: oldIdentity.oldDate,
          enableSmartPattern: enableSmartPatternReplace,
          includeExtraSignature,
          includeExtraKop,
        });

        if (!isMounted || !docxContainerRef.current) return;

        docxContainerRef.current.innerHTML = '';
        await renderAsync(blob, docxContainerRef.current, undefined, {
          className: 'docx-preview-doc',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          renderChanges: false,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderEndnotes: true,
          useBase64URL: true,
        });

        if (highlightReplacements && highlightTerms.length > 0 && docxContainerRef.current) {
          applyHighlightsToDocxContainer(docxContainerRef.current, highlightTerms);
        }
      } catch (err: any) {
        console.error('DOCX Preview rendering error:', err);
        if (isMounted) {
          setDocxRenderError(err?.message || 'Gagal memuat pratinjau halaman Word asli.');
        }
      } finally {
        if (isMounted) {
          setIsDocxRendering(false);
        }
      }
    }

    if (previewLayoutMode === 'docx') {
      renderDocxPreview();
    }

    return () => {
      isMounted = false;
    };
  }, [
    uploadedDocxBuffer,
    previewLayoutMode,
    targetSchool,
    targetTeacher,
    targetTeacherNip,
    targetHeadmaster,
    targetHeadmasterNip,
    targetYear,
    targetSemester,
    effectiveDateLoc,
    effectivePlace,
    effectiveDate,
    subject,
    oldIdentity,
    enableSmartPatternReplace,
    highlightReplacements,
    highlightTerms,
    includeExtraSignature,
    includeExtraKop,
  ]);

  // Render high-precision structured A4 Indonesian Educational Administration layout
  const renderStructuredDocument = () => {
    const lines = processedText.split(/\r?\n/);

    // Look for signature block at bottom
    let signatureStartIndex = -1;
    for (let i = lines.length - 1; i >= Math.max(0, lines.length - 30); i--) {
      const line = lines[i].trim().toLowerCase();
      if (line.startsWith('mengetahui') || (line.includes('kepala') && line.includes('guru'))) {
        signatureStartIndex = i;
        break;
      }
    }

    const contentLines = signatureStartIndex >= 0 ? lines.slice(0, signatureStartIndex) : lines;
    const blocks: React.ReactNode[] = [];
    let kvGroup: { label: string; val: string }[] = [];

    const flushKvGroup = (keyPrefix: string) => {
      if (kvGroup.length > 0) {
        blocks.push(
          <div
            key={`kv-${keyPrefix}`}
            className="my-3 bg-slate-50/50 p-3 rounded-lg border border-slate-200/80 overflow-x-auto"
          >
            <table className="w-full text-xs font-serif border-collapse">
              <tbody>
                {kvGroup.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-200/60 last:border-none">
                    <td className="py-1.5 pr-2 font-semibold text-slate-800 whitespace-nowrap w-[180px] sm:w-[220px] align-top">
                      {renderWithHighlight(item.label)}
                    </td>
                    <td className="py-1.5 px-1 text-center font-bold text-slate-600 align-top w-4">:</td>
                    <td className="py-1.5 pl-2 text-slate-900 font-medium align-top leading-relaxed">
                      {renderWithHighlight(item.val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        kvGroup = [];
      }
    };

    contentLines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushKvGroup(`blank-${idx}`);
        return;
      }

      // Divider line
      if (trimmed.startsWith('---') || trimmed.startsWith('___') || trimmed.startsWith('***')) {
        flushKvGroup(`hr-${idx}`);
        blocks.push(<hr key={`hr-${idx}`} className="my-5 border-t-2 border-slate-300 print:border-black" />);
        return;
      }

      // Title line (e.g. MODUL AJAR KURIKULUM MERDEKA)
      const isDocTitle =
        (trimmed.startsWith('MODUL AJAR') ||
          trimmed.startsWith('RENCANA PELAKSANAAN') ||
          trimmed.startsWith('RPP') ||
          trimmed.startsWith('PERANGKAT')) &&
        idx < 6;

      if (isDocTitle) {
        flushKvGroup(`title-${idx}`);
        blocks.push(
          <div
            key={`title-${idx}`}
            className="text-center font-bold text-base sm:text-lg text-slate-950 uppercase tracking-wide my-2"
          >
            {renderWithHighlight(trimmed)}
          </div>
        );
        return;
      }

      // Subtitle line (e.g. MATA PELAJARAN: MATEMATIKA ...)
      if (
        (trimmed.startsWith('MATA PELAJARAN:') ||
          trimmed.startsWith('SMP') ||
          trimmed.startsWith('FASE') ||
          trimmed.startsWith('KELAS')) &&
        idx < 6
      ) {
        flushKvGroup(`subtitle-${idx}`);
        blocks.push(
          <div
            key={`subtitle-${idx}`}
            className="text-center font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b-2 border-slate-900"
          >
            {renderWithHighlight(trimmed)}
          </div>
        );
        return;
      }

      // Section Header (e.g. A. INFORMASI UMUM or 1. TUJUAN PEMBELAJARAN or 1. IDENTITAS MODUL)
      const isSectionHeader = /^[A-Z1-9]\.\s+[A-Z0-9\s/()-]{3,}$/.test(trimmed);
      if (isSectionHeader) {
        flushKvGroup(`sec-${idx}`);
        blocks.push(
          <div
            key={`sec-${idx}`}
            className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wide mt-6 mb-2.5 pb-1 border-b border-slate-400 print:border-black flex items-center gap-2"
          >
            <span className="bg-slate-200 text-slate-800 text-[11px] px-2 py-0.5 rounded font-sans font-bold print:hidden">
              BAGIAN
            </span>
            <span>{renderWithHighlight(trimmed)}</span>
          </div>
        );
        return;
      }

      // Key-Value pair (e.g., Label : Value)
      const kvMatch = trimmed.match(/^([^:=]+)\s*[:=]\s*(.+)$/);
      if (kvMatch) {
        const label = kvMatch[1].trim();
        const val = kvMatch[2].trim();
        if (label.length < 45 && !label.toLowerCase().includes('http')) {
          kvGroup.push({ label, val });
          return;
        }
      }

      // Standard paragraph or list item
      flushKvGroup(`p-${idx}`);

      const isListItem = /^(?:[-*•]|\d+\.|\w\.)\s+/.test(trimmed);

      blocks.push(
        <p
          key={`p-${idx}`}
          className={`text-xs text-slate-900 leading-relaxed ${
            isListItem ? 'pl-5 my-1.5' : 'my-2 text-justify'
          }`}
        >
          {renderWithHighlight(trimmed)}
        </p>
      );
    });

    flushKvGroup('end');

    // Formal Signature 2-Column Block
    const renderSignatures = () => (
      <div className="mt-12 pt-6 border-t-2 border-slate-900 print:border-black page-break-inside-avoid">
        <table className="w-full text-xs font-serif border-none" style={{ border: 'none' }}>
          <tbody>
            <tr style={{ border: 'none' }}>
              <td style={{ border: 'none', width: '50%', verticalAlign: 'top' }} className="pr-4">
                <div className="text-slate-800">Mengetahui,</div>
                <div className="font-bold text-slate-950 mt-0.5">Kepala {renderWithHighlight(targetSchool)}</div>
                <div className="h-20" />
                <div className="font-bold underline text-slate-950">{renderWithHighlight(targetHeadmaster)}</div>
                <div className="text-slate-700 text-[11px] mt-0.5">
                  NIP. {renderWithHighlight(targetHeadmasterNip)}
                </div>
              </td>

              <td style={{ border: 'none', width: '50%', verticalAlign: 'top' }} className="pl-4">
                <div className="text-slate-800">{renderWithHighlight(effectiveDateLoc)}</div>
                <div className="font-bold text-slate-950 mt-0.5">
                  Guru Mata Pelajaran {subject || 'Matematika'}
                </div>
                <div className="h-20" />
                <div className="font-bold underline text-slate-950">{renderWithHighlight(targetTeacher)}</div>
                <div className="text-slate-700 text-[11px] mt-0.5">
                  NIP. {renderWithHighlight(targetTeacherNip)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );

    return (
      <div className="space-y-1">
        {blocks}
        {(includeExtraSignature || signatureStartIndex >= 0) && renderSignatures()}
      </div>
    );
  };

  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Toolbar & Mode Switcher (Print: hidden) */}
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Mode Pratinjau Dokumen</span>
              {uploadedDocxBuffer && (
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  File Word Aktif
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {previewLayoutMode === 'docx'
                ? 'Menampilkan 100% tata letak halaman Word asli dengan penggantian identitas presisi'
                : previewLayoutMode === 'structured'
                ? 'Tata letak resmi A4 naskah administrasi sekolah dengan kolom & tabel sejajar'
                : 'Tampilan teks polos langsung dari hasil ekstraksi'}
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {uploadedDocxBuffer && (
              <button
                type="button"
                onClick={() => setPreviewLayoutMode('docx')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  previewLayoutMode === 'docx'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Halaman Word Asli</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setPreviewLayoutMode('structured')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                previewLayoutMode === 'structured'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Naskah A4 Resmi</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewLayoutMode('raw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                previewLayoutMode === 'raw'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Teks Mentah</span>
            </button>
          </div>

          {/* Zoom & Print Controls */}
          {previewLayoutMode === 'docx' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                title="Zoom Out"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold text-slate-700 w-9 text-center">{zoomLevel}%</span>
              <button
                type="button"
                title="Zoom In"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Reset Zoom (100%)"
                onClick={() => setZoomLevel(100)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handlePrintDocument}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Main Document Page Container */}
      <div className="max-w-5xl mx-auto flex justify-center">
        {previewLayoutMode === 'docx' && uploadedDocxBuffer ? (
          <div className="w-full flex flex-col items-center">
            {isDocxRendering && (
              <div className="my-12 flex flex-col items-center justify-center text-slate-600 gap-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="text-xs font-semibold">Merender Halaman Dokumen Word Asli...</span>
              </div>
            )}

            {docxRenderError && (
              <div className="w-full max-w-2xl my-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-bold">Gagal Merender Pratinjau Word Asli</div>
                  <div>{docxRenderError}</div>
                  <button
                    type="button"
                    onClick={() => setPreviewLayoutMode('structured')}
                    className="mt-2 text-blue-700 font-bold underline"
                  >
                    Beralih ke Tampilan Naskah Terstruktur A4
                  </button>
                </div>
              </div>
            )}

            <div
              className={`w-full overflow-x-auto flex justify-center ${
                isDocxRendering ? 'hidden' : 'block'
              }`}
              style={{
                transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                transformOrigin: 'top center',
              }}
            >
              <div
                ref={docxContainerRef}
                className="docx-render-container w-full max-w-4xl py-4 flex flex-col items-center"
              />
            </div>
          </div>
        ) : (
          <div className="formal-doc-preview document-page w-full max-w-4xl bg-white p-8 md:p-14 border border-slate-300 shadow-xl rounded-2xl font-serif text-slate-900 leading-relaxed space-y-6">
            {/* Optional Header Standard Kop Dokumen */}
            {includeExtraKop && (
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h1 className="text-base font-bold uppercase tracking-wider text-slate-900">
                  {targetSchool.toUpperCase()}
                </h1>
                <h2 className="text-xs font-bold uppercase text-slate-800">
                  PERANGKAT PEMBELAJARAN / MODUL AJAR KURIKULUM MERDEKA
                </h2>
                <div className="text-xs font-bold text-slate-700">TAHUN PELAJARAN {targetYear}</div>
              </div>
            )}

            {/* Render Clean Structured Text or Raw Text */}
            {previewLayoutMode === 'structured' ? (
              renderStructuredDocument()
            ) : (
              <pre className="whitespace-pre-wrap font-serif text-xs leading-relaxed text-justify text-slate-900 overflow-x-auto">
                {renderWithHighlight(processedText)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
