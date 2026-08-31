import React, { useState } from 'react';
import {
  FileText,
  Printer,
  FileSpreadsheet,
  FileCode,
  Users,
  Award,
  CalendarCheck,
  BookOpen,
  Sliders,
  Sparkles,
  Zap,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type {
  TeachingAssignment,
  RekapTab,
  MarginPreset,
  ScalePreset,
  HeaderStyleOption,
  HeaderLayoutOption,
} from '../types';

interface RekapHeaderProps {
  assignments: TeachingAssignment[];
  selectedAssignmentId: string;
  onSelectAssignment: (id: string) => void;
  semester: 1 | 2;
  onChangeSemester: (sem: 1 | 2) => void;
  selectedMonthIndex: number;
  onChangeMonth: (idx: number) => void;
  tab: RekapTab;
  onChangeTab: (tab: RekapTab) => void;
  attendanceThreshold: number;
  onChangeThreshold: (val: number) => void;
  kdCount?: number;
  onChangeKdCount?: (val: number) => void;
  isPaSplit?: boolean;
  onChangeIsPaSplit?: (val: boolean) => void;
  marginPreset: MarginPreset;
  onChangeMargin: (m: MarginPreset) => void;
  scalePreset: ScalePreset;
  onChangeScale: (s: ScalePreset) => void;
  headerStyle: HeaderStyleOption;
  onChangeHeaderStyle: (hs: HeaderStyleOption) => void;
  headerLayout: HeaderLayoutOption;
  onChangeHeaderLayout: (hl: HeaderLayoutOption) => void;
  totalStudents: number;
  avgGrade: number;
  attendancePct: number;
  totalMeetings: number;
  onPrint: () => void;
  onExportExcel: () => void;
  onExportWord: () => void;
  onOpenExpressKbm?: () => void;
}

const MONTHS = [
  { value: 0, label: 'Juli' },
  { value: 1, label: 'Agustus' },
  { value: 2, label: 'September' },
  { value: 3, label: 'Oktober' },
  { value: 4, label: 'November' },
  { value: 5, label: 'Desember' },
  { value: 6, label: 'Januari' },
  { value: 7, label: 'Februari' },
  { value: 8, label: 'Maret' },
  { value: 9, label: 'April' },
  { value: 10, label: 'Mei' },
  { value: 11, label: 'Juni' },
];

export const RekapHeader: React.FC<RekapHeaderProps> = ({
  assignments,
  selectedAssignmentId,
  onSelectAssignment,
  semester,
  onChangeSemester,
  selectedMonthIndex,
  onChangeMonth,
  tab,
  onChangeTab,
  attendanceThreshold,
  onChangeThreshold,
  kdCount = 10,
  onChangeKdCount,
  isPaSplit = false,
  onChangeIsPaSplit,
  marginPreset,
  onChangeMargin,
  scalePreset,
  onChangeScale,
  headerStyle,
  onChangeHeaderStyle,
  headerLayout,
  onChangeHeaderLayout,
  totalStudents,
  avgGrade,
  attendancePct,
  totalMeetings,
  onPrint,
  onExportExcel,
  onExportWord,
  onOpenExpressKbm,
}) => {
  const [showPrintSettings, setShowPrintSettings] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  return (
    <div className="space-y-3 no-print">
      {/* ── MAIN SLIM FILTER & ACTION BAR ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Kelas & Mapel dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
              Kelas & Mapel
            </label>
            <select
              value={selectedAssignmentId}
              onChange={(e) => onSelectAssignment(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.classLabel} · {a.subject}
                </option>
              ))}
            </select>
          </div>

          {/* Semester dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => onChangeSemester(Number(e.target.value) as 1 | 2)}
              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value={1}>Semester 1 (Ganjil)</option>
              <option value={2}>Semester 2 (Genap)</option>
            </select>
          </div>

          {/* Month selector for Absensi Bulanan tab */}
          {tab === 'absensi-bulanan' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                Bulan
              </label>
              <select
                value={selectedMonthIndex}
                onChange={(e) => onChangeMonth(Number(e.target.value))}
                className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Threshold Slider for Tatap Muka tab */}
          {tab === 'tatap-muka' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                Minimal Hadir
              </label>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1">
                <input
                  type="range"
                  min="0.50"
                  max="1.00"
                  step="0.05"
                  value={attendanceThreshold}
                  onChange={(e) => onChangeThreshold(Number(e.target.value))}
                  className="w-18 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-blue-700 min-w-8 text-right">
                  {Math.round(attendanceThreshold * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Controls for Rekap Nilai tab (KD / TP count) */}
          {tab === 'nilai' && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                  Jumlah TP
                </label>
                <select
                  value={kdCount}
                  onChange={(e) => onChangeKdCount?.(Number(e.target.value))}
                  className="text-xs font-bold bg-blue-50 text-blue-900 border border-blue-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map((num) => (
                    <option key={num} value={num}>
                      {num} TP
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                  Format Nilai
                </label>
                <select
                  value={isPaSplit ? 'split' : 'single'}
                  onChange={(e) => onChangeIsPaSplit?.(e.target.value === 'split')}
                  className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="split">Formatif & Sumatif</option>
                  <option value="single">Ringkas (1 Kolom)</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* ── ACTION CONTROLS (SLIMMED DOWN) ── */}
        <div className="flex items-center gap-1.5 ml-auto">
          {onOpenExpressKbm && (
            <button
              onClick={onOpenExpressKbm}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-extrabold transition-all shadow-2xs cursor-pointer active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Input KBM</span>
            </button>
          )}

          {/* Toggle Print / Table Format Settings */}
          <button
            type="button"
            onClick={() => setShowPrintSettings(!showPrintSettings)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showPrintSettings
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title="Pengaturan format margin kertas & gaya tabel"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Format Kertas</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showPrintSettings ? 'rotate-180' : ''}`} />
          </button>

          {/* Compact Export & Print Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              title="Cetak atau Ekspor Dokumen"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Ekspor / Cetak</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 min-w-[170px] space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[9px] font-extrabold uppercase px-2 py-1 text-slate-400">
                  Pilihan Cetak / Unduh
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onPrint();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-800 rounded-lg font-medium text-left transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportExcel();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg font-medium text-left transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export Excel (.xlsx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExportWord();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg font-medium text-left transition-colors cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Export Word (.docx)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PRE-PRINT TOOLBAR (COLLAPSIBLE, ONLY SHOWN WHEN TOGGLED) ── */}
      {showPrintSettings && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center gap-3.5">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase text-[10px] tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-amber-700" />
              <span>Desain Kertas & Tabel:</span>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-slate-600 font-semibold text-[11px]">Margin:</label>
              <select
                value={marginPreset}
                onChange={(e) => onChangeMargin(e.target.value as MarginPreset)}
                className="bg-white border border-amber-300 rounded px-2 py-1 text-slate-800 text-xs font-medium focus:outline-none"
              >
                <option value="rapat">Rapat (5mm - Rekomendasi Matrix)</option>
                <option value="normal">Normal (10mm)</option>
                <option value="sedang">Sedang (12mm)</option>
                <option value="longgar">Longgar (15mm)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-slate-600 font-semibold text-[11px]">Font:</label>
              <select
                value={scalePreset}
                onChange={(e) => onChangeScale(Number(e.target.value) as ScalePreset)}
                className="bg-white border border-amber-300 rounded px-2 py-1 text-slate-800 text-xs font-medium focus:outline-none"
              >
                <option value={70}>70% (Sangat Muat)</option>
                <option value={80}>80% (Standar A4)</option>
                <option value={90}>90% (Besar)</option>
                <option value={100}>100% (Asli)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-slate-600 font-semibold text-[11px]">Header:</label>
              <select
                value={headerLayout}
                onChange={(e) => onChangeHeaderLayout(e.target.value as HeaderLayoutOption)}
                className="bg-white border border-amber-300 rounded px-2 py-1 text-slate-800 text-xs font-bold focus:outline-none"
              >
                <option value="gabung">Gabung 1 Kolom</option>
                <option value="tingkat">Bertingkat 2 Baris</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-slate-600 font-semibold text-[11px]">Warna:</label>
              <select
                value={headerStyle}
                onChange={(e) => onChangeHeaderStyle(e.target.value as HeaderStyleOption)}
                className="bg-white border border-amber-300 rounded px-2 py-1 text-slate-800 text-xs font-bold focus:outline-none"
              >
                <option value="slate">Resmi (Slate)</option>
                <option value="navy">Navy Dinas</option>
                <option value="emerald">Emerald Edu</option>
                <option value="minimalist">Minimalis Putih</option>
              </select>
            </div>
          </div>

          <div className="text-amber-800 text-[11px] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Gunakan mode Landscape A4 saat cetak dokumen.</span>
          </div>
        </div>
      )}

      {/* ── TAB BUTTONS (5 REKAP FORMATS) ── */}
      <div className="flex flex-wrap md:flex-nowrap gap-1.5 bg-slate-200/80 p-1.5 rounded-xl text-xs font-semibold">
        <button
          onClick={() => onChangeTab('absensi-bulanan')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
            tab === 'absensi-bulanan'
              ? 'bg-white text-blue-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-4 h-4 text-blue-600" />
          <span>Buku Absensi (Laporan Bulanan)</span>
        </button>

        <button
          onClick={() => onChangeTab('tatap-muka')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
            tab === 'tatap-muka'
              ? 'bg-white text-blue-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Buku Absensi (Laporan Per Mapel)</span>
        </button>

        <button
          onClick={() => onChangeTab('nilai')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
            tab === 'nilai'
              ? 'bg-white text-blue-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>Daftar Nilai Siswa</span>
        </button>

        <button
          onClick={() => onChangeTab('jurnal')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
            tab === 'jurnal'
              ? 'bg-white text-blue-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span>Jurnal Agenda Mengajar</span>
        </button>

        <button
          onClick={() => onChangeTab('prosem-schedule')}
          className={`flex-1 py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
            tab === 'prosem-schedule'
              ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Jadwal Presensi PROSEM</span>
        </button>
      </div>
    </div>
  );
};
