import React from 'react';
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
  return (
    <div className="space-y-4 no-print">
      {/* ── MAIN FILTER BAR ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Kelas & Mapel dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kelas & Mata Pelajaran
            </label>
            <select
              value={selectedAssignmentId}
              onChange={(e) => onSelectAssignment(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => onChangeSemester(Number(e.target.value) as 1 | 2)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Semester 1 (Ganjil)</option>
              <option value={2}>Semester 2 (Genap)</option>
            </select>
          </div>

          {/* Month selector for Absensi Bulanan tab */}
          {tab === 'absensi-bulanan' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Bulan
              </label>
              <select
                value={selectedMonthIndex}
                onChange={(e) => onChangeMonth(Number(e.target.value))}
                className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Batas Minimal Kehadiran
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5">
                <input
                  type="range"
                  min="0.50"
                  max="1.00"
                  step="0.05"
                  value={attendanceThreshold}
                  onChange={(e) => onChangeThreshold(Number(e.target.value))}
                  className="w-24 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-blue-700 min-w-9 text-right">
                  {Math.round(attendanceThreshold * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Controls for Rekap Nilai tab (KD / TP count) */}
          {tab === 'nilai' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Jumlah KD / TP
                </label>
                <select
                  value={kdCount}
                  onChange={(e) => onChangeKdCount?.(Number(e.target.value))}
                  className="text-xs font-bold bg-blue-50 text-blue-900 border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map((num) => (
                    <option key={num} value={num}>
                      {num} Kompetensi / TP
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Format Nilai
                </label>
                <select
                  value={isPaSplit ? 'split' : 'single'}
                  onChange={(e) => onChangeIsPaSplit?.(e.target.value === 'split')}
                  className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="split">Formatif & Sumatif (UH + Tugas)</option>
                  <option value="single">Ringkas (1 Kolom / TP)</option>
                </select>
              </div>
            </>
          )}

          {/* Role badge */}
          <div className="self-end pb-1">
            <span className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700">
              Role: Guru Mapel / Wali Kelas
            </span>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenExpressKbm && (
            <button
              onClick={onOpenExpressKbm}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Input KBM Express</span>
            </button>
          )}

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export XLSX</span>
          </button>

          <button
            onClick={onExportWord}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <FileCode className="w-4 h-4" />
            <span>Export DOCX</span>
          </button>
        </div>
      </div>

      {/* ── PRE-PRINT TOOLBAR (MARGIN, FONT SCALE, & HEADER STYLE OPTIONS) ── */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-800 font-bold uppercase text-[10px] tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>Format Cetak & Desain Table Header</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Margin Page:</label>
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

          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Ukuran Font:</label>
            <select
              value={scalePreset}
              onChange={(e) => onChangeScale(Number(e.target.value) as ScalePreset)}
              className="bg-white border border-amber-300 rounded px-2 py-1 text-slate-800 text-xs font-medium focus:outline-none"
            >
              <option value={70}>70% (Sangat Muat)</option>
              <option value={80}>80% (Standar Rekap A4)</option>
              <option value={90}>90% (Besar)</option>
              <option value={100}>100% (Ukuran Asli)</option>
            </select>
          </div>

          {/* Model Kolom Header */}
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Model Header:</label>
            <select
              value={headerLayout}
              onChange={(e) => onChangeHeaderLayout(e.target.value as HeaderLayoutOption)}
              className="bg-white border border-amber-300 rounded px-2 py-1 text-slate-800 text-xs font-bold focus:outline-none"
            >
              <option value="gabung">Gabung 1 Kolom (Pertemuan & Tanggal)</option>
              <option value="tingkat">Bertingkat 2 Baris (Header Super)</option>
            </select>
          </div>

          {/* Variasi Desain Header Warna */}
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Variasi Header:</label>
            <select
              value={headerStyle}
              onChange={(e) => onChangeHeaderStyle(e.target.value as HeaderStyleOption)}
              className="bg-white border border-amber-300 rounded px-2 py-1 text-slate-800 text-xs font-bold focus:outline-none"
            >
              <option value="slate">Klasik Resmi (Slate Abu)</option>
              <option value="navy">Navy Dinas (Biru Gelap Modern)</option>
              <option value="emerald">Emerald Edu (Hijau Dinas/Madrasah)</option>
              <option value="minimalist">Minimalis Clean (Putih Hemat Tinta)</option>
            </select>
          </div>
        </div>

        <div className="text-amber-800 text-[11px] font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Gunakan mode Landscape A4 saat mencetak dokumen ini.</span>
        </div>
      </div>

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
