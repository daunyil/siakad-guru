import React from 'react';
import {
  Trash2,
  FileText,
  Table,
  CheckCircle2,
  Compass,
  Search,
  Heart,
  HelpCircle,
} from 'lucide-react';
import type { LkpdQuestion } from '../types';

interface LkpdQuestionRendererProps {
  question: LkpdQuestion;
  index: number;
  onDelete?: (id: string) => void;
}

export const LkpdQuestionRenderer: React.FC<LkpdQuestionRendererProps> = ({
  question: q,
  index: idx,
  onDelete,
}) => {
  return (
    <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/40 space-y-3 relative">
      {/* Question Header & Title */}
      <div className="flex items-start justify-between gap-2">
        <div className="font-bold text-xs text-slate-900 flex items-start gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
            {idx + 1}
          </span>
          <span className="pt-0.5 leading-snug">{q.questionText}</span>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(q.id)}
            className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 no-print cursor-pointer shrink-0"
            title="Hapus Pertanyaan"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Guide Hint / Petunjuk Belajar */}
      {q.guideHint && (
        <div className="bg-emerald-50/80 border border-emerald-300 rounded-lg p-2.5 text-[11px] text-emerald-950 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">
            <strong>Petunjuk Kerja:</strong> {q.guideHint}
          </span>
        </div>
      )}

      {/* ── TYPE 1: CASE STUDY DETAIL ── */}
      {q.type === 'case_study' && q.caseStudyNarrative && (
        <div className="space-y-2 pt-1">
          <div className="bg-blue-50/70 border-2 border-blue-200 rounded-xl p-3.5 space-y-2">
            {q.caseStudyTitle && (
              <div className="flex items-center gap-1.5 font-bold text-xs text-blue-950 border-b border-blue-200 pb-1.5">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>{q.caseStudyTitle}</span>
              </div>
            )}
            <p className="text-xs leading-relaxed text-slate-900 font-serif italic whitespace-pre-line bg-white/90 p-3 rounded-lg border border-blue-200">
              "{q.caseStudyNarrative}"
            </p>
          </div>
        </div>
      )}

      {/* ── TYPE 2: MATRIX / TABLE KERJA KONTEKSTUAL ── */}
      {q.type === 'matrix_table' && q.tableHeaders && (
        <div className="overflow-x-auto pt-1 space-y-2">
          <table className="w-full border-collapse border-2 border-black text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-center">
                {q.tableHeaders.map((th, hIdx) => (
                  <th key={hIdx} className="border border-black px-2.5 py-2 text-[11px] leading-tight">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {q.tableRows && q.tableRows.length > 0 ? (
                q.tableRows.map((row, rIdx) => {
                  const isModelRow = rIdx === 0 && row.cells && row.cells.every((c) => c && c.trim().length > 0);

                  return (
                    <tr
                      key={rIdx}
                      className={
                        isModelRow
                          ? 'bg-amber-50/90 font-medium text-slate-950'
                          : rIdx % 2 === 0
                          ? 'bg-white'
                          : 'bg-slate-50/50'
                      }
                    >
                      <td className="border border-black px-2 py-2 text-center font-bold align-top">
                        {rIdx + 1}
                      </td>
                      <td className="border border-black px-2.5 py-2 font-semibold text-slate-900 align-top">
                        {row.aspect.replace(/^\d+\.\s*/, '')}
                        {row.helperHint && (
                          <div className="text-[10px] text-emerald-800 font-normal italic mt-1">
                            💡 {row.helperHint}
                          </div>
                        )}
                      </td>
                      {row.cells && row.cells.length > 0 ? (
                        row.cells.map((cellText, cIdx) => (
                          <td
                            key={cIdx}
                            className={`border border-black px-2.5 py-2 text-slate-900 align-top ${
                              isModelRow ? 'bg-amber-100/60 font-medium text-[11px]' : 'min-h-[48px]'
                            }`}
                          >
                            {cellText ? (
                              <div className="leading-relaxed whitespace-pre-line">{cellText}</div>
                            ) : (
                              <div className="min-h-[48px] py-1">
                                <div className="border-b border-dotted border-slate-300 w-full h-4" />
                                <div className="border-b border-dotted border-slate-300 w-full h-4" />
                              </div>
                            )}
                          </td>
                        ))
                      ) : (
                        <>
                          <td className="border border-black px-2 py-2 min-h-[44px]"><div className="border-b border-dotted border-slate-300 w-full h-4" /></td>
                          <td className="border border-black px-2 py-2 min-h-[44px]"><div className="border-b border-dotted border-slate-300 w-full h-4" /></td>
                          <td className="border border-black px-2 py-2 min-h-[44px]"><div className="border-b border-dotted border-slate-300 w-full h-4" /></td>
                        </>
                      )}
                    </tr>
                  );
                })
              ) : (
                Array.from({ length: q.tableRowsCount || 3 }).map((_, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="border border-black px-2 py-3 text-center font-bold">{rIdx + 1}</td>
                    <td className="border border-black px-2 py-3"><div className="border-b border-dotted border-slate-300 w-full h-4" /></td>
                    <td className="border border-black px-2 py-3"><div className="border-b border-dotted border-slate-300 w-full h-4" /></td>
                    <td className="border border-black px-2 py-3"><div className="border-b border-dotted border-slate-300 w-full h-4" /></td>
                    <td className="border border-black px-2 py-3"><div className="border-b border-dotted border-slate-300 w-full h-4" /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TYPE 3: ACTION PLAN / PROYEK KOLABORATIF ── */}
      {q.type === 'action_plan' && q.actionPlanSteps && (
        <div className="overflow-x-auto pt-1 space-y-2">
          <table className="w-full border-collapse border-2 border-black text-xs">
            <thead>
              <tr className="bg-purple-900 text-white font-bold text-center">
                <th className="border border-black px-2.5 py-2 text-[11px] w-12">No</th>
                <th className="border border-black px-2.5 py-2 text-[11px]">Tahapan Kegiatan Proyek</th>
                <th className="border border-black px-2.5 py-2 text-[11px]">Rincian Aksi & Strategi</th>
                <th className="border border-black px-2.5 py-2 text-[11px]">Penanggung Jawab / Peran</th>
                <th className="border border-black px-2.5 py-2 text-[11px]">Target Output & Bukti</th>
              </tr>
            </thead>
            <tbody>
              {q.actionPlanSteps.map((step, sIdx) => (
                <tr key={sIdx} className={sIdx % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'}>
                  <td className="border border-black px-2 py-2.5 text-center font-bold">{sIdx + 1}</td>
                  <td className="border border-black px-2.5 py-2.5 font-bold text-purple-950 align-top">
                    {step.tahap}
                  </td>
                  <td className="border border-black px-2.5 py-2.5 text-slate-800 align-top text-[11px]">
                    {step.rencanaKegiatan}
                  </td>
                  <td className="border border-black px-2.5 py-2.5 text-slate-800 align-top text-[11px] font-medium">
                    {step.pelaksana}
                  </td>
                  <td className="border border-black px-2.5 py-2.5 text-slate-800 align-top text-[11px] italic">
                    {step.targetHasil}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TYPE 4: ESSAY / PENALARAN TERBUKA DENGAN SENTENCE STARTER ── */}
      {q.type === 'essay' && (
        <div className="space-y-2 pt-1">
          {q.sentenceStarter && (
            <div className="text-xs text-slate-700 italic font-medium bg-white p-2.5 rounded-lg border border-slate-300">
              <span className="text-emerald-800 font-bold not-italic">Kalimat Pembuka: </span>
              "{q.sentenceStarter}"
            </div>
          )}
          <div className="space-y-2.5 py-1">
            <div className="border-b border-dotted border-slate-400 w-full h-3" />
            <div className="border-b border-dotted border-slate-400 w-full h-3" />
            <div className="border-b border-dotted border-slate-400 w-full h-3" />
          </div>
        </div>
      )}
    </div>
  );
};
