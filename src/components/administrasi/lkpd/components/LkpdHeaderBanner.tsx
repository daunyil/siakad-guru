import React, { useState } from 'react';
import {
  FileSpreadsheet,
  BookOpen,
  Printer,
  Settings,
  Sparkles,
  Target,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import type { LkpdActivityType } from '../types';
import { LKPD_ACTIVITY_OPTIONS } from '../generators/textbookContextAnalyzer';

interface LkpdHeaderBannerProps {
  subjectName: string;
  classGrade: string;
  meetingNumber: number;
  activityType?: LkpdActivityType;
  tpTitle?: string;
  isEditingKop: boolean;
  onToggleEditKop: () => void;
  onCycleActivity: () => void;
  onPrint: () => void;
  onCopyText?: () => void;
}

export const LkpdHeaderBanner: React.FC<LkpdHeaderBannerProps> = ({
  subjectName,
  classGrade,
  meetingNumber,
  activityType = 'studi_kasus',
  tpTitle,
  isEditingKop,
  onToggleEditKop,
  onCycleActivity,
  onPrint,
  onCopyText,
}) => {
  const [copied, setCopied] = useState(false);
  const currentActivityConfig = LKPD_ACTIVITY_OPTIONS[activityType] || LKPD_ACTIVITY_OPTIONS.studi_kasus;

  const handleCopy = () => {
    if (onCopyText) {
      onCopyText();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 md:p-6 shadow-xl border border-slate-700/80 no-print">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-xs rounded-full flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Berbasis Konteks Buku Teks & TP
            </span>
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-bold text-xs rounded-full">
              {currentActivityConfig.title}
            </span>
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-xs rounded-full">
              Pertemuan ke-{meetingNumber}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>Lembar Kerja Peserta Didik (LKPD)</span>
          </h1>

          <p className="text-xs text-slate-300 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              Sinkronisasi Materi Buku Siswa Kemendikbudristek • {subjectName} (Kelas {classGrade})
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 shrink-0">
          <button
            onClick={onToggleEditKop}
            className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border ${
              isEditingKop
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{isEditingKop ? 'Tutup Pengaturan Kop' : 'Atur Kop Sekolah'}</span>
          </button>

          <button
            onClick={onCycleActivity}
            className="px-3 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-indigo-400/30 hover:shadow-md"
            title="Beralih ke model aktivitas pembelajaran lainnya"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ganti Model Aktivitas</span>
          </button>

          {onCopyText && (
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-slate-600"
              title="Salin seluruh isi LKPD ke clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onPrint}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg hover:shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak LKPD (A4)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
