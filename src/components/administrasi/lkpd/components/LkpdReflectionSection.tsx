import React from 'react';
import { Award, CheckCircle, Heart, Sparkles } from 'lucide-react';
import type { LkpdReflectionDetail } from '../types';

interface LkpdReflectionSectionProps {
  reflectionDetail?: LkpdReflectionDetail;
  reflectionQuestions: string[];
}

export const LkpdReflectionSection: React.FC<LkpdReflectionSectionProps> = ({
  reflectionDetail,
  reflectionQuestions,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 rounded-lg">
        <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>F. REFLEKSI PEMBELAJARAN & EVALUASI KETERCAPAIAN TP</span>
        </h3>
      </div>

      <div className="border-2 border-emerald-300 rounded-2xl p-4 bg-emerald-50/30 space-y-4 text-xs">
        {/* 1. Ketercapaian TP (Checklist) */}
        {reflectionDetail && reflectionDetail.tpMasteryCheck && reflectionDetail.tpMasteryCheck.length > 0 && (
          <div className="bg-white border border-emerald-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>INDIKATOR REFLEKSI KETERCAPAIAN TUJUAN PEMBELAJARAN:</span>
            </span>
            <div className="space-y-2 pl-1">
              {reflectionDetail.tpMasteryCheck.map((checkText, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-800 text-[11px]">
                  <div className="w-4 h-4 border-2 border-slate-400 rounded mt-0.5 shrink-0 bg-slate-50" />
                  <span className="font-medium leading-relaxed">{checkText}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Pertanyaan Refleksi Siswa */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-2xs">
          <span className="font-bold text-slate-900 block text-xs">
            Pertanyaan Refleksi Kritis Siswa:
          </span>
          <ol className="list-decimal list-inside space-y-3 text-slate-800">
            {reflectionQuestions.map((ref, rIdx) => (
              <li key={rIdx} className="space-y-1.5 font-medium">
                <span className="text-slate-900 text-[11px]">{ref}</span>
                <div className="space-y-2 py-1 pl-4">
                  <div className="border-b border-dotted border-slate-400 w-full h-2" />
                  <div className="border-b border-dotted border-slate-400 w-full h-2" />
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 3. Komitmen Aksi Nyata (Profil Pelajar Pancasila) */}
        {reflectionDetail?.characterCommitment && (
          <div className="bg-white border-2 border-rose-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
            <span className="font-bold text-rose-950 flex items-center gap-1.5 text-xs">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>IKRAR KOMITMEN KARAKTER & TINDAKAN NYATA KELOMPOK:</span>
            </span>
            <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-200/70 text-slate-800 text-[11px] italic font-serif">
              "{reflectionDetail.characterCommitment}"
            </div>
            <div className="space-y-2 py-1">
              <div className="border-b border-dotted border-slate-400 w-full h-2" />
              <div className="border-b border-dotted border-slate-400 w-full h-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
