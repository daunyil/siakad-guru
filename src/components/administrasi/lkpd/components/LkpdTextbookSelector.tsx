import React from 'react';
import {
  BookOpen,
  Layers,
  Sparkles,
  Check,
  ChevronDown,
  Target,
  FileText,
  Table,
  Compass,
  Search,
  Heart,
} from 'lucide-react';
import type {
  BukuSiswaSubject,
  BukuSiswaBab,
  BukuSiswaSubBab,
} from '../../../../data/bukuSiswaData';
import type {
  LkpdActivityType,
} from '../types';
import { LKPD_ACTIVITY_OPTIONS } from '../generators/textbookContextAnalyzer';

interface LkpdTextbookSelectorProps {
  selectedBukuClass: 'VII' | 'VIII' | 'IX';
  onSelectClass: (c: 'VII' | 'VIII' | 'IX') => void;
  activeBukuSiswaSubject?: BukuSiswaSubject;
  currentBab?: BukuSiswaBab;
  selectedBabId: string;
  onSelectBab: (babId: string) => void;
  currentSubBab?: BukuSiswaSubBab;
  selectedSubBabId: string;
  onSelectSubBab: (subBabId: string) => void;
  selectedActivityType: LkpdActivityType;
  onSelectActivityType: (activity: LkpdActivityType) => void;
  meetingNumber: number;
  onChangeMeetingNumber: (num: number) => void;
  onRegenerate: () => void;
}

export const LkpdTextbookSelector: React.FC<LkpdTextbookSelectorProps> = ({
  selectedBukuClass,
  onSelectClass,
  activeBukuSiswaSubject,
  currentBab,
  selectedBabId,
  onSelectBab,
  currentSubBab,
  selectedSubBabId,
  onSelectSubBab,
  selectedActivityType,
  onSelectActivityType,
  meetingNumber,
  onChangeMeetingNumber,
  onRegenerate,
}) => {
  const activityList = Object.values(LKPD_ACTIVITY_OPTIONS);

  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm space-y-4 no-print">
      {/* ── ROW 1: KELAS, BAB, DAN SUB-BAB ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
        {/* Pilihan Kelas */}
        <div className="sm:col-span-3 space-y-1">
          <label className="text-xs font-bold text-slate-700 block">Jenjang / Kelas:</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['VII', 'VIII', 'IX'] as const).map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => onSelectClass(grade)}
                className={`py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  selectedBukuClass === grade
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Kelas {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Pilihan Bab */}
        <div className="sm:col-span-4 space-y-1">
          <label className="text-xs font-bold text-slate-700 block">Bab / Tema Pembelajaran:</label>
          <div className="relative">
            <select
              value={selectedBabId}
              onChange={(e) => onSelectBab(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden appearance-none pr-8 cursor-pointer"
            >
              {activeBukuSiswaSubject?.babList.map((bab) => (
                <option key={bab.id} value={bab.id}>
                  Bab {bab.babNumber}: {bab.title} ({bab.elemen})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Pilihan Sub-Bab / Topik */}
        <div className="sm:col-span-5 space-y-1">
          <label className="text-xs font-bold text-slate-700 block">Sub-Bab / Topik Pertemuan:</label>
          <div className="relative">
            <select
              value={selectedSubBabId}
              onChange={(e) => onSelectSubBab(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden appearance-none pr-8 cursor-pointer"
            >
              {currentBab?.subBabList.map((sb) => (
                <option key={sb.id} value={sb.id}>
                  {sb.code} - {sb.title} ({sb.pages})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── ROW 2: DETAIL TUJUAN PEMBELAJARAN (TP) & PEMAHAMAN BERMAKNA AKTIF ── */}
      {currentSubBab && (
        <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-3 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <Target className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Fokus Capaian & Tujuan Pembelajaran (TP):</span>
          </div>
          <p className="text-slate-900 leading-relaxed font-medium">
            {currentSubBab.tujuanPembelajaran || `Peserta didik mampu menganalisis materi ${currentSubBab.title} secara kritis dan solutif.`}
          </p>
          {currentSubBab.pemahamanBermakna && (
            <p className="text-slate-700 italic text-[11px] pt-0.5">
              💡 <strong>Pemahaman Bermakna:</strong> "{currentSubBab.pemahamanBermakna}"
            </p>
          )}
        </div>
      )}

      {/* ── ROW 3: PILIHAN RAGAM MODEL AKTIVITAS PEMBELAJARAN ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
              Ragam Model Aktivitas Pembelajaran:
            </span>
          </div>
          <span className="text-[11px] text-indigo-700 font-semibold hidden sm:inline">
            ✨ Fleksibel, otentik, dan berorientasi pada pencapaian Tujuan Pembelajaran
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {activityList.map((opt) => {
            const isSelected = selectedActivityType === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectActivityType(opt.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `${opt.colorClass} border-current ring-2 ring-indigo-500 shadow-sm font-bold`
                    : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/80 border border-slate-300">
                      {opt.shortLabel}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-700 shrink-0" />}
                  </div>
                  <p className="text-[11px] font-bold leading-snug line-clamp-2 text-slate-900">
                    {opt.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
