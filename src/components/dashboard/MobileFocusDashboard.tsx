import React, { useState } from 'react';
import type {
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
  TeachingAssignment,
  ClassRoster,
  MainModule,
} from '../../types';
import {
  Zap,
  Scan,
  ShieldAlert,
  Edit3,
  Users,
  Building2,
  Calendar,
  Award,
  BookOpen,
  FileText,
  Printer,
  Sparkles,
  ChevronDown,
  Layers,
  HeartPulse,
  UserCheck,
  CreditCard,
  CheckSquare,
  RotateCcw,
  MessageSquare,
  Share2,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { WhatsAppAbsentReportModal } from '../modals/WhatsAppAbsentReportModal';

interface MobileFocusDashboardProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  assignments: TeachingAssignment[];
  currentAssignment: TeachingAssignment;
  onSelectAssignment: (id: string) => void;
  rosters: ClassRoster[];
  totalStudentsInAssignment: number;
  absentStudentsToday: {
    list: Array<{
      id: string;
      studentId: string;
      name: string;
      nisn: string;
      number: number;
      status: 'sick' | 'excused' | 'absent';
      date: string;
    }>;
    totalAbsent: number;
    sickCount: number;
    excusedCount: number;
    absentCount: number;
    presentCount: number;
    totalClassStudents: number;
  };
  attendanceStats: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    late?: number;
    totalPct: number;
  };
  gradeStats: {
    avg: number;
    tuntasCount: number;
    total: number;
    percentTuntas: number;
    tuntasList: Array<{ name: string; score: number }>;
    remedialList: Array<{ name: string; score: number }>;
  };
  flaggedWarningStudents?: Array<{
    studentId: string;
    name: string;
    number: number;
    nisn?: string;
    warningLevel: 'none' | 'warning' | 'danger';
    warningMessage: string;
    absentCount: number;
    totalNonPresent: number;
  }>;
  greeting: string;
  onNavigateModule: (mod: MainModule, subViewOrTab?: string) => void;
  onOpenExpressKbm: () => void;
  onOpenEditScore: () => void;
  onOpenBarcodeScanner?: () => void;
  onOpenCardGenerator?: () => void;
  onOpenTeacherSwitcher?: () => void;
  onSwitchToPiket: () => void;
}

export const MobileFocusDashboard: React.FC<MobileFocusDashboardProps> = ({
  school,
  teacher,
  year,
  assignments,
  currentAssignment,
  onSelectAssignment,
  rosters,
  totalStudentsInAssignment,
  absentStudentsToday,
  attendanceStats,
  gradeStats,
  flaggedWarningStudents = [],
  greeting,
  onNavigateModule,
  onOpenExpressKbm,
  onOpenEditScore,
  onOpenBarcodeScanner,
  onOpenCardGenerator,
  onOpenTeacherSwitcher,
  onSwitchToPiket,
}) => {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden flex flex-col space-y-6">
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 📱 SECTION 1 (FULL SCREEN FOCUS): ACTION BUTTONS & HERO INPUT CONTROLS   */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <section
        id="mobile-action-screen"
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-between rounded-3xl p-5 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white shadow-2xl border border-slate-800 relative overflow-hidden"
      >
        {/* Ambient Glows */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Mini Header */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Sistem KBM Guru Merdeka</span>
            </div>

            {onOpenTeacherSwitcher && (
              <button
                type="button"
                onClick={onOpenTeacherSwitcher}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 text-[10px] font-bold flex items-center gap-1 active:scale-95"
              >
                <Users className="w-3 h-3 text-amber-300" />
                <span>Ganti Guru</span>
              </button>
            )}
          </div>

          <div>
            <h1 className="text-xl font-black text-white leading-tight">
              {greeting}, <span className="text-amber-400">{teacher.name}</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium line-clamp-1 mt-0.5">
              Guru {teacher.subject} · {school.name}
            </p>
          </div>

          {/* Active Class Pill Selector */}
          <div className="p-2.5 bg-slate-900/90 border border-blue-800/80 rounded-2xl flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-blue-600/30 text-amber-400 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Kelas Aktif:
                </span>
                <span className="text-xs font-black text-white truncate block">
                  Kelas {currentAssignment.classLabel} ({totalStudentsInAssignment} Siswa)
                </span>
              </div>
            </div>

            {/* Quick Switch Class Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto shrink-0 py-0.5">
              {assignments.map((asg) => {
                const isSelected = asg.id === currentAssignment.id;
                return (
                  <button
                    key={asg.id}
                    type="button"
                    onClick={() => onSelectAssignment(asg.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs scale-105'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {asg.classLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 🎯 3 BIG FOCUS ACTION BUTTONS (ISIAN UTAMA HARIAN) ── */}
        <div className="my-auto py-3 space-y-3 relative z-10">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Pilih Aksi Pengisian Hari Ini:</span>
          </div>

          {/* 1. INPUT KBM HARIAN (BIG PRIMARY) */}
          <button
            type="button"
            onClick={onOpenExpressKbm}
            className="w-full p-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.98] text-slate-950 font-black rounded-2xl shadow-xl border-2 border-amber-200 flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="p-3 bg-slate-950 text-amber-400 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="text-base font-black text-slate-950 leading-tight">
                  Input KBM Harian (Express)
                </div>
                <div className="text-xs text-slate-800 font-bold opacity-90 mt-0.5">
                  Presensi Jam Belajar, Jurnal & Nilai
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-950 text-amber-300 rounded-lg text-[10px] font-extrabold uppercase shadow-xs">
              Mulai ⚡
            </span>
          </button>

          {/* 2. SCAN BARCODE PRESENSI */}
          {onOpenBarcodeScanner && (
            <button
              type="button"
              onClick={onOpenBarcodeScanner}
              className="w-full p-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 active:scale-[0.98] text-white font-extrabold rounded-2xl shadow-lg border border-blue-400/40 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="p-2.5 bg-blue-900/80 text-blue-200 border border-blue-400/40 rounded-xl group-hover:scale-105 transition-transform">
                  <Scan className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-black text-white leading-tight">
                    Scan Barcode / QR Kartu Siswa
                  </div>
                  <div className="text-[11px] text-blue-200 font-medium mt-0.5">
                    Presensi Gerbang & Scan Kamera Cepat
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded-lg text-[10px] font-bold">
                Buka
              </span>
            </button>
          )}

          {/* 3. INPUT PIKET & GERBANG */}
          <button
            type="button"
            onClick={onSwitchToPiket}
            className="w-full p-3.5 bg-gradient-to-r from-rose-700 via-rose-800 to-pink-900 hover:from-rose-600 hover:to-rose-700 active:scale-[0.98] text-white font-extrabold rounded-2xl shadow-lg border border-rose-400/40 flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 bg-rose-950/90 text-rose-200 border border-rose-400/40 rounded-xl group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <div className="text-sm font-black text-white leading-tight">
                  Input Piket & Ketertiban
                </div>
                <div className="text-[11px] text-rose-200 font-medium mt-0.5">
                  Rekap Semua Rombel & Poin Disiplin
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-rose-500/30 text-rose-200 border border-rose-400/30 rounded-lg text-[10px] font-bold">
              Piket
            </span>
          </button>
        </div>

        {/* ── BOTTOM SLIDE-UP INDICATOR & QUICK STATUS ── */}
        <div className="pt-2 relative z-10 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hadir: <strong>{attendanceStats.totalPct}%</strong></span>
            </span>
            <span className="text-amber-300 font-semibold">
              {absentStudentsToday.totalAbsent > 0
                ? `${absentStudentsToday.totalAbsent} Siswa Tidak Hadir`
                : 'Semua Hadir Lengkap'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('mobile-details-section')}
            className="w-full py-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer animate-bounce"
          >
            <span>Geser / Tap Lihat Rekap Detail & Dokumen</span>
            <ChevronDown className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 📄 SECTION 2 (SLIDE-UP SNAP): DETAIL REKAP PRESENSI & MODUL ADMINISTRASI */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <section id="mobile-details-section" className="space-y-4 pt-2">
        {/* Early Warning System in Mobile */}
        {flaggedWarningStudents.length > 0 && (
          <div className="bg-rose-950/90 border border-rose-700 text-white rounded-2xl p-4 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
                <span className="text-xs font-black text-white">
                  Early Warning: {flaggedWarningStudents.length} Siswa Berisiko
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold"
              >
                Lapor BK
              </button>
            </div>
            <div className="space-y-1.5">
              {flaggedWarningStudents.map((st) => (
                <div
                  key={st.studentId}
                  className="p-2 bg-black/40 border border-rose-600/50 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-rose-100 truncate">{st.number}. {st.name}</div>
                    <div className="text-[10px] text-rose-300">{st.warningMessage}</div>
                  </div>
                  <span className="px-1.5 py-0.5 bg-rose-600 text-white font-black text-[9px] rounded uppercase shrink-0">
                    {st.warningLevel === 'danger' ? 'Darurat' : 'Perhatian'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Live Siswa Berhalangan */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${absentStudentsToday.totalAbsent > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {absentStudentsToday.totalAbsent > 0 ? (
                  <HeartPulse className="w-4 h-4" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-slate-900">
                  Presensi Hari Ini · Kelas {currentAssignment.classLabel}
                </h3>
                <p className="text-[10px] text-slate-500">
                  {absentStudentsToday.presentCount} dari {absentStudentsToday.totalClassStudents} Hadir ({attendanceStats.totalPct}%)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Lapor WA</span>
            </button>
          </div>

          {absentStudentsToday.totalAbsent === 0 ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-xs font-bold text-emerald-950">
                Semua siswa hadir 100% di kelas hari ini.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">Sakit: {absentStudentsToday.sickCount}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Izin: {absentStudentsToday.excusedCount}</span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded">Alpa: {absentStudentsToday.absentCount}</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {absentStudentsToday.list.map((stu) => (
                  <div
                    key={stu.id}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="truncate font-bold text-slate-800">
                      {stu.number}. {stu.name}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 shrink-0">
                      {stu.status === 'sick' ? '🤒 Sakit' : stu.status === 'excused' ? '📝 Izin' : '❌ Alpa'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hub Modul Tambahan / Periodik */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Modul & Dokumen Administrasi Lengkap:</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenEditScore}
              className="p-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition-all"
            >
              <Award className="w-4 h-4 text-purple-600 mb-1" />
              <div className="text-xs font-black text-purple-950">Input Nilai TP & SAS</div>
              <div className="text-[10px] text-purple-700">Rata-rata: {gradeStats.avg}</div>
            </button>

            <button
              onClick={() => onNavigateModule('administrasi', 'prota-prosem')}
              className="p-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-left transition-all"
            >
              <Calendar className="w-4 h-4 text-sky-600 mb-1" />
              <div className="text-xs font-black text-sky-950">PROTA & PROSEM</div>
              <div className="text-[10px] text-sky-700">Alokasi Jam Belajar</div>
            </button>

            <button
              onClick={() => onNavigateModule('administrasi', 'modul-ajar')}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition-all"
            >
              <BookOpen className="w-4 h-4 text-emerald-600 mb-1" />
              <div className="text-xs font-black text-emerald-950">Modul Ajar RPP</div>
              <div className="text-[10px] text-emerald-700">Perangkat Merdeka</div>
            </button>

            <button
              onClick={() => onNavigateModule('rekap', 'absensi-bulanan')}
              className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all"
            >
              <FileText className="w-4 h-4 text-amber-600 mb-1" />
              <div className="text-xs font-black text-amber-950">Cetak Presensi</div>
              <div className="text-[10px] text-amber-700">Rekap Bulanan</div>
            </button>

            <button
              onClick={() => onNavigateModule('rekap', 'nilai')}
              className="p-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-left transition-all"
            >
              <Printer className="w-4 h-4 text-indigo-600 mb-1" />
              <div className="text-xs font-black text-indigo-950">Leger & Buku Nilai</div>
              <div className="text-[10px] text-indigo-700">Cetak Hasil Belajar</div>
            </button>

            {onOpenCardGenerator && (
              <button
                onClick={onOpenCardGenerator}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-left transition-all"
              >
                <CreditCard className="w-4 h-4 text-slate-700 mb-1" />
                <div className="text-xs font-black text-slate-950">Cetak Kartu Siswa</div>
                <div className="text-[10px] text-slate-600">Barcode & QR Code</div>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp Modal */}
      <WhatsAppAbsentReportModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        school={school}
        teacher={teacher}
        assignment={currentAssignment}
        roster={rosters.find((r) => r.classId === currentAssignment.classId) || rosters[0]}
        absentStudents={absentStudentsToday.list.map((s) => ({
          studentId: s.studentId,
          name: s.name,
          nisn: s.nisn,
          number: s.number,
          status: s.status,
        }))}
        attendanceStats={{
          present: absentStudentsToday.presentCount,
          sick: absentStudentsToday.sickCount,
          excused: absentStudentsToday.excusedCount,
          absent: absentStudentsToday.absentCount,
          total: absentStudentsToday.totalClassStudents,
        }}
      />
    </div>
  );
};
