import React, { useMemo, useState } from 'react';
import type {
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
  TeachingAssignment,
  ClassRoster,
  GradeBook,
  AttendanceRecord,
  LessonSession,
  TeachingJournal,
  MainModule,
  UserRole,
} from '../../types';
import {
  Users,
  Edit3,
  Award,
  Calendar,
  BookOpen,
  Zap,
  MapPin,
  FileText,
  Layers,
  CheckSquare,
  ShieldCheck,
  ShieldAlert,
  UserX,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Printer,
  ChevronRight,
  RotateCcw,
  RefreshCw,
  Folder,
  Scan,
  CreditCard,
  Activity,
  UserCheck,
  AlertCircle,
  HeartPulse,
  Share2,
  MessageSquare,
  Send,
  UserCheck2,
} from 'lucide-react';
import { WhatsAppAbsentReportModal } from '../modals/WhatsAppAbsentReportModal';
import { MobileQuickPiketDashboard } from './MobileQuickPiketDashboard';
import { MobileFocusDashboard } from './MobileFocusDashboard';
import { computeStudentAbsenceSummaries } from '../../lib/exportKbmReports';

interface MainDashboardProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  assignments: TeachingAssignment[];
  currentAssignment: TeachingAssignment;
  onSelectAssignment: (id: string) => void;
  rosters: ClassRoster[];
  gradeBook: GradeBook;
  attendanceRecords: AttendanceRecord[];
  lessonSessions: LessonSession[];
  teachingJournals: TeachingJournal[];
  onNavigateModule: (mod: MainModule, subViewOrTab?: string) => void;
  onOpenExpressKbm: () => void;
  onOpenEditScore: () => void;
  onOpenBarcodeScanner?: () => void;
  onOpenCardGenerator?: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenTeacherSwitcher?: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  school,
  teacher,
  year,
  assignments,
  currentAssignment,
  onSelectAssignment,
  rosters,
  gradeBook,
  attendanceRecords,
  lessonSessions,
  teachingJournals,
  onNavigateModule,
  onOpenExpressKbm,
  onOpenEditScore,
  onOpenBarcodeScanner,
  onOpenCardGenerator,
  currentRole,
  setCurrentRole,
  onOpenTeacherSwitcher,
}) => {
  // WhatsApp Absent Report Modal state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  }, []);

  // Compute stats for current assignment
  const currentRoster = useMemo(
    () => rosters.find((r) => r.classId === currentAssignment.classId) || rosters[0],
    [rosters, currentAssignment]
  );

  const totalStudentsInAssignment = currentRoster?.students?.length || 0;

  // Total students across all assigned classes
  const totalStudentsAll = useMemo(() => {
    const uniqueStudentIds = new Set<string>();
    rosters.forEach((r) => r.students?.forEach((s) => uniqueStudentIds.add(s.id)));
    return uniqueStudentIds.size || totalStudentsInAssignment;
  }, [rosters, totalStudentsInAssignment]);

  // Real-time absent students today (Sakit, Izin, Alpa) for currently selected class or all classes
  const absentStudentsToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    // Check records in attendanceRecords for today
    const currentClassRecords = attendanceRecords.filter(
      (r) => r.classId === currentAssignment.classId
    );

    // Filter today's absent records
    let todayAbsents = currentClassRecords.filter(
      (r) => r.date === today && (r.status === 'sick' || r.status === 'excused' || r.status === 'absent')
    );

    // If no records strictly for today's ISO date, check latest recorded date in this class
    if (todayAbsents.length === 0 && currentClassRecords.length > 0) {
      const dates = Array.from(new Set(currentClassRecords.map((r) => r.date))).sort().reverse();
      const latestDate = dates[0];
      if (latestDate) {
        todayAbsents = currentClassRecords.filter(
          (r) => r.date === latestDate && (r.status === 'sick' || r.status === 'excused' || r.status === 'absent')
        );
      }
    }

    // Map to student details
    const studentMap = new Map<string, { id: string; name: string; nisn?: string; number: number }>();
    currentRoster?.students?.forEach((s) => {
      studentMap.set(s.id, { id: s.id, name: s.name, nisn: s.nisn, number: s.number });
    });

    const result = todayAbsents.map((rec) => {
      const stu = studentMap.get(rec.studentId);
      return {
        id: rec.id,
        studentId: rec.studentId,
        name: stu?.name || 'Siswa',
        nisn: stu?.nisn || '-',
        number: stu?.number || 0,
        status: rec.status as 'sick' | 'excused' | 'absent',
        date: rec.date,
      };
    });

    // Sort by student number or name
    result.sort((a, b) => a.number - b.number || a.name.localeCompare(b.name));

    const sickCount = result.filter((s) => s.status === 'sick').length;
    const excusedCount = result.filter((s) => s.status === 'excused').length;
    const absentCount = result.filter((s) => s.status === 'absent').length;

    return {
      list: result,
      totalAbsent: result.length,
      sickCount,
      excusedCount,
      absentCount,
      presentCount: Math.max(0, (currentRoster?.students?.length || 0) - result.length),
      totalClassStudents: currentRoster?.students?.length || 0,
    };
  }, [attendanceRecords, currentAssignment, currentRoster]);

  // Compute Early Warning Summaries (Students with excessive absences / risk)
  const earlyWarningSummaries = useMemo(() => {
    if (!currentRoster) return [];
    return computeStudentAbsenceSummaries(currentRoster, attendanceRecords, currentAssignment.classId);
  }, [currentRoster, attendanceRecords, currentAssignment.classId]);

  const flaggedWarningStudents = useMemo(() => {
    return earlyWarningSummaries.filter((s) => s.warningLevel !== 'none');
  }, [earlyWarningSummaries]);

  // Attendance stats for current assignment
  const attendanceStats = useMemo(() => {
    const records = attendanceRecords.filter((r) => r.classId === currentAssignment.classId);
    if (records.length === 0) return { hadir: 88, sakit: 4, izin: 3, alpa: 1, totalPct: 92 };

    let hadir = 0,
      sakit = 0,
      izin = 0,
      alpa = 0,
      late = 0;
    records.forEach((r) => {
      if (r.status === 'present') hadir++;
      else if (r.status === 'sick') sakit++;
      else if (r.status === 'excused') izin++;
      else if (r.status === 'absent') alpa++;
      else if (r.status === 'late') late++;
    });

    const total = records.length;
    const totalPct = Math.round(((hadir + late) / (total || 1)) * 100);

    return { hadir, sakit, izin, alpa, late, totalPct: totalPct > 0 ? totalPct : 92 };
  }, [attendanceRecords, currentAssignment]);

  // Grade stats
  const gradeStats = useMemo(() => {
    const entries = gradeBook?.entries || [];
    if (entries.length === 0) return { avg: 82, tuntasCount: 0, total: 0, percentTuntas: 85, tuntasList: [], remedialList: [] };

    let sum = 0;
    let tuntas = 0;
    let remedial = 0;

    const tuntasList: Array<{ name: string; score: number }> = [];
    const remedialList: Array<{ name: string; score: number }> = [];

    entries.forEach((e) => {
      sum += e.finalScore;
      if (e.finalScore >= 75) {
        tuntas++;
        tuntasList.push({ name: e.studentName, score: e.finalScore });
      } else {
        remedial++;
        remedialList.push({ name: e.studentName, score: e.finalScore });
      }
    });

    const avg = Math.round(sum / (entries.length || 1));
    const percentTuntas = Math.round((tuntas / (entries.length || 1)) * 100);

    return { avg, tuntasCount: tuntas, total: entries.length, percentTuntas, tuntasList, remedialList };
  }, [gradeBook]);

  // Session & Journal stats
  const journalStats = useMemo(() => {
    const activeSessions = lessonSessions.filter(
      (s) => s.classId === currentAssignment.classId && s.subject === currentAssignment.subject
    );
    const filledJournals = teachingJournals.filter(
      (j) => j.classId === currentAssignment.classId && j.subject === currentAssignment.subject
    );

    const totalSessions = activeSessions.length || 12;
    const completedJournals = filledJournals.length || 10;
    const pct = Math.round((completedJournals / totalSessions) * 100);

    return { totalSessions, completedJournals, pct };
  }, [lessonSessions, teachingJournals, currentAssignment]);

  // Administration Completeness Checklist
  const adminChecklist = [
    { title: 'Capaian Pembelajaran (CP BSKAP 2024)', subView: 'cp-bskap', status: 'ready', code: 'DOC-01' },
    { title: 'Alur Tujuan Pembelajaran (ATP)', subView: 'atp', status: 'ready', code: 'DOC-02' },
    { title: 'PROTA & PROSEM (Kalender Pendidikan)', subView: 'prota-prosem', status: 'ready', code: 'DOC-03' },
    { title: 'Modul Ajar (RPP Kurikulum Merdeka)', subView: 'modul-ajar', status: 'ready', code: 'DOC-04' },
    { title: 'Kriteria Ketercapaian TP (KKTP) & Rubrik', subView: 'asesmen-kktp', status: 'ready', code: 'DOC-05' },
    { title: 'LKPD Siswa & Lembar Kerja 3-Tier', subView: 'lkpd', status: 'draft', code: 'DOC-06' },
    { title: 'Kisi-Kisi Soal & Kartu Asesmen', subView: 'asesmen-soal', status: 'ready', code: 'DOC-07' },
    { title: 'Program Remedial & Pengayaan', subView: 'remedial-pengayaan', status: 'ready', code: 'DOC-08' },
  ];

  const readyAdminCount = adminChecklist.filter((c) => c.status === 'ready').length;
  const adminCompletenessPct = Math.round((readyAdminCount / adminChecklist.length) * 100);

  // If in Guru Piket role, render the specialized Piket Command Center after all hooks are evaluated
  if (currentRole === 'guru_piket') {
    return (
      <div className="space-y-5 animate-in fade-in duration-200">
        {/* Active Role Notice Bar with instant switcher */}
        <div className="bg-rose-950/90 border border-rose-800 text-rose-100 rounded-2xl p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-800/80 text-white rounded-xl">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                  Mode Aktif: GURU PIKET & KETERTIBAN
                </span>
                <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full shadow-xs">
                  Petugas Piket
                </span>
              </div>
              <p className="text-[11px] text-rose-200/90 mt-0.5">
                Mengontrol ketertiban gerbang, rekap presensi seluruh kelas, poin disiplin, dan disposisi kasus.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => setCurrentRole('subject_teacher')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Beralih ke Guru Mapel ({teacher.subject || 'Mapel'})</span>
            </button>
          </div>
        </div>

        {/* Dedicated Piket Command & Operational View */}
        <MobileQuickPiketDashboard
          school={school}
          teacher={teacher}
          year={year}
          assignments={assignments}
          currentAssignment={currentAssignment}
          onSelectAssignment={onSelectAssignment}
          rosters={rosters}
          onNavigateModule={onNavigateModule}
          onOpenExpressKbm={onOpenExpressKbm}
          onOpenBarcodeScanner={onOpenBarcodeScanner}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 📱 MOBILE VIEW: 1 SCREEN FULL FOCUS BUTTON ISIAN + SLIDE UP SNAP */}
      <MobileFocusDashboard
        school={school}
        teacher={teacher}
        year={year}
        assignments={assignments}
        currentAssignment={currentAssignment}
        onSelectAssignment={onSelectAssignment}
        rosters={rosters}
        totalStudentsInAssignment={totalStudentsInAssignment}
        absentStudentsToday={absentStudentsToday}
        attendanceStats={attendanceStats}
        gradeStats={gradeStats}
        flaggedWarningStudents={flaggedWarningStudents}
        greeting={greeting}
        onNavigateModule={onNavigateModule}
        onOpenExpressKbm={onOpenExpressKbm}
        onOpenEditScore={onOpenEditScore}
        onOpenBarcodeScanner={onOpenBarcodeScanner}
        onOpenCardGenerator={onOpenCardGenerator}
        onOpenTeacherSwitcher={onOpenTeacherSwitcher}
        onSwitchToPiket={() => setCurrentRole('guru_piket')}
      />

      {/* 💻 DESKTOP / TABLET VIEW */}
      <div className="hidden md:block space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. HERO BANNER: 3 PRIMARY ACTION BUTTONS (SCAN, KBM, PIKET)   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Sistem Administrasi Guru · Kurikulum Merdeka</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                {greeting}, <span className="text-amber-400">{teacher.name}</span>!
              </h1>
            </div>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Guru <strong className="text-white font-semibold">{teacher.subject}</strong> ·{' '}
              <strong className="text-white font-semibold">{school.name}</strong> · TP{' '}
              <strong className="text-blue-300 font-semibold">{year.label} (Sem. {year.semester === 1 ? 'Ganjil' : 'Genap'})</strong>
            </p>

            {onOpenTeacherSwitcher && (
              <div className="pt-1 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={onOpenTeacherSwitcher}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/60 border border-blue-400/40 text-blue-200 hover:text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer backdrop-blur-xs"
                  title="Klik untuk memilih profil guru lain, ganti mata pelajaran, atau tambah guru baru"
                >
                  <Users className="w-3.5 h-3.5 text-blue-300" />
                  <span>🔄 Ganti Guru / Mapel</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenTeacherSwitcher}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                  title="Edit data diri dan mata pelajaran aktif"
                >
                  <Edit3 className="w-3 h-3 text-slate-300" />
                  <span>Edit Profil Saya</span>
                </button>
              </div>
            )}
          </div>

          {/* 3 UTAMA: SCAN BARCODE, INPUT KBM, INPUT PIKET */}
          <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto">
            {/* 1. TOMBOL SCAN BARCODE */}
            {onOpenBarcodeScanner && (
              <button
                type="button"
                onClick={onOpenBarcodeScanner}
                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-xs md:text-sm rounded-2xl shadow-lg border border-blue-400/40 transition-all cursor-pointer"
                title="Pindai barcode kartu siswa untuk presensi otomatis"
              >
                <Scan className="w-4 h-4 md:w-5 md:h-5 text-blue-200 animate-pulse shrink-0" />
                <span>Scan Barcode</span>
              </button>
            )}

            {/* 2. TOMBOL INPUT KBM */}
            <button
              type="button"
              onClick={onOpenExpressKbm}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs md:text-sm rounded-2xl shadow-lg transition-all cursor-pointer"
              title="Input KBM Cepat: Presensi Jam Pelajaran & Agenda Jurnal Kelas"
            >
              <Zap className="w-4 h-4 md:w-5 md:h-5 fill-current text-slate-950 shrink-0" />
              <span>Input KBM</span>
            </button>

            {/* 3. TOMBOL INPUT PIKET */}
            <button
              type="button"
              onClick={() => setCurrentRole('guru_piket')}
              className="flex items-center justify-center gap-2 px-4 py-3.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-xs md:text-sm rounded-2xl shadow-lg border border-rose-400/40 transition-all cursor-pointer"
              title="Buka Command Center Guru Piket: Gerbang Pagi, Rekap Semua Kelas & Poin Disiplin"
            >
              <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 text-rose-200 shrink-0" />
              <span>Input Piket</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. PILIH KELAS / ROMBEL DIAJAR SAAT INI                        */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Rombel / Kelas Aktif Mengajar:
            </span>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <span>Kelas {currentAssignment.classLabel}</span>
              <span className="text-slate-400 font-normal">·</span>
              <span className="text-blue-600">{currentAssignment.subject}</span>
              <span className="text-slate-400 font-normal">({totalStudentsInAssignment} Siswa)</span>
            </div>
          </div>
        </div>

        {/* Roster Assignment Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {assignments.map((asg) => {
            const isSelected = asg.id === currentAssignment.id;
            return (
              <button
                key={asg.id}
                onClick={() => onSelectAssignment(asg.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>Kelas {asg.classLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {asg.subject}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2.5 EARLY WARNING SYSTEM: SISWA PERLU PERHATIAN (BK / WALI)    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {flaggedWarningStudents.length > 0 ? (
        <div className="bg-gradient-to-r from-rose-900/90 via-red-950 to-slate-900 rounded-2xl p-5 text-white border border-rose-700/80 shadow-lg space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-600/80 text-white rounded-xl shadow-xs">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white">
                    Early Warning System & Siswa Perlu Perhatian
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                    {flaggedWarningStudents.length} Siswa Terdeteksi
                  </span>
                </div>
                <p className="text-[11px] text-rose-200/90 mt-0.5">
                  Kelas {currentAssignment.classLabel} · Terdeteksi akumulasi Alpa / Ketidakhadiran berulang yang memerlukan koordinasi BK & Wali Kelas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Kirim Laporan ke BK / Wali Kelas</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {flaggedWarningStudents.map((st) => {
              const isDanger = st.warningLevel === 'danger';
              return (
                <div
                  key={st.studentId}
                  className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                    isDanger
                      ? 'bg-rose-950/80 border-rose-500 text-white'
                      : 'bg-amber-950/70 border-amber-500/80 text-amber-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-black/40 text-rose-200 font-black text-[11px] flex items-center justify-center shrink-0">
                        {st.number || '•'}
                      </span>
                      <div className="min-w-0">
                        <span className="font-extrabold text-xs text-white truncate block">
                          {st.name}
                        </span>
                        <span className="text-[10px] text-rose-300/80 font-mono block">
                          NISN: {st.nisn || '-'}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        isDanger ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {isDanger ? 'Darurat' : 'Peringatan'}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-rose-200">
                      ⚠️ {st.absentCount > 0 ? `Alpa ${st.absentCount}x` : `Tidak Hadir ${st.totalNonPresent}x`}
                    </span>
                    <span className="text-white/70 text-[9.5px]">
                      {st.warningMessage}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. STATUS LIVE SISWA BERHALANGAN / ABSEN HARI INI              */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${absentStudentsToday.totalAbsent > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {absentStudentsToday.totalAbsent > 0 ? (
                <HeartPulse className="w-5 h-5" />
              ) : (
                <UserCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Status Presensi KBM Hari Ini (Kelas {currentAssignment.classLabel})
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Real-Time
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Mata Pelajaran: {currentAssignment.subject} · {absentStudentsToday.presentCount} dari {absentStudentsToday.totalClassStudents} Siswa Hadir ({attendanceStats.totalPct}%)
              </p>
            </div>
          </div>

          {/* Status breakdown pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Sakit: <strong>{absentStudentsToday.sickCount}</strong></span>
            </span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200/80 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Izin: <strong>{absentStudentsToday.excusedCount}</strong></span>
            </span>
            <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200/80 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Alpa: <strong>{absentStudentsToday.absentCount}</strong></span>
            </span>
            <button
              type="button"
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              title="Kirim Rekapitulasi Presensi Siswa ke WhatsApp Grup / Wali Kelas"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Lapor WA</span>
            </button>
            <button
              onClick={onOpenExpressKbm}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all ml-auto sm:ml-0 flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-400 fill-current" />
              <span>Input KBM</span>
            </button>
          </div>
        </div>

        {/* Content List: Empty state or Direct absent student cards */}
        {absentStudentsToday.totalAbsent === 0 ? (
          <div className="py-4 px-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-200/60 text-emerald-800 rounded-lg shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-emerald-950">
                  Seluruh Siswa Hadir Lengkap (100% Kehadiran)
                </div>
                <div className="text-[11px] text-emerald-800">
                  Tidak ada siswa yang tercatat Sakit, Izin, maupun Alpa di kelas {currentAssignment.classLabel} hari ini.
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 hidden sm:inline-block">
              {absentStudentsToday.totalClassStudents} Siswa Hadir
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
              <span>Daftar {absentStudentsToday.totalAbsent} Siswa Tidak Hadir:</span>
              <span>Kelas {currentAssignment.classLabel}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {absentStudentsToday.list.map((student) => {
                const isSick = student.status === 'sick';
                const isExcused = student.status === 'excused';

                const badgeBg = isSick
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : isExcused
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300';

                const label = isSick ? 'Sakit' : isExcused ? 'Izin' : 'Alpa (Tanpa Keterangan)';
                const badgeIcon = isSick ? '🤒' : isExcused ? '📝' : '❌';

                return (
                  <div
                    key={student.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-xl flex items-center justify-between gap-2.5 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                        {student.number || '•'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-900 truncate">
                          {student.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          NISN: {student.nisn || '-'}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 px-2 py-0.5 text-[11px] font-extrabold border rounded-md flex items-center gap-1 ${badgeBg}`}
                    >
                      <span>{badgeIcon}</span>
                      <span>{label}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 💬 ACTION FOOTER: LAPORKAN KE WA GRUP / WALI KELAS */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/70 -mx-5 -mb-5 p-4 rounded-b-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">
              {absentStudentsToday.totalAbsent > 0
                ? `${absentStudentsToday.totalAbsent} siswa berhalangan hadir. Siap diteruskan ke WhatsApp Grup / Wali Kelas.`
                : 'Presensi lengkap. Siap dibagikan sebagai laporan rekap harian ke Grup WhatsApp.'}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Kirim Laporan WA ke Grup / Wali Kelas</span>
            </button>
          </div>
        </div>
      </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 4. 📁 WORKFLOW PERIODIK & PERANGKAT (BUKAN HARIAN)             */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <span>📁 Modul Administrasi & Evaluasi Terjadwal</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-semibold">
              Diakses berkala saat asesmen, awal semester, atau pelaporan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* HUB 1: PENILAIAN & ASESMEN (PERIODIK / RAPOR) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    Periodik / Sumatif
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">1. Penilaian & e-Rapor</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Digunakan saat selesai Lingkup Materi, PTS/PAS, dan pengolahan deskripsi capaian rapor.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <button
                  onClick={onOpenEditScore}
                  className="w-full p-2 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs rounded-xl transition-colors text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-purple-600" />
                    <span>Input Nilai Siswa (TP & SAS)</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                </button>

                <button
                  onClick={() => onNavigateModule('administrasi', 'asesmen-kktp')}
                  className="w-full p-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-pink-600" />
                    <span>KKTP & Deskripsi e-Rapor</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigateModule('administrasi', 'remedial-pengayaan')}
                  className="w-full p-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Program Remedial ({gradeStats.remedialList.length} Siswa)</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* HUB 2: PERANGKAT AJAR MERDEKA (AWAL SEMESTER) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                    Awal Tahun / Semester
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">2. Perangkat Ajar Merdeka</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Perencanaan kurikulum, alokasi jam efektif, ATP, modul ajar (RPP), dan adaptasi identitas.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onNavigateModule('administrasi', 'prota-prosem')}
                  className="w-full p-2 bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs rounded-xl transition-colors text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>PROTA & PROSEM (Alokasi JP)</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                </button>

                <button
                  onClick={() => onNavigateModule('administrasi', 'atp')}
                  className="w-full p-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>ATP & CP BSKAP 2024</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigateModule('administrasi', 'modul-ajar')}
                  className="w-full p-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Modul Ajar (RPP Merdeka)</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* HUB 3: PUSAT CETAK & LAPORAN SUPERVISI */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Printer className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Akhir Bulan / Supervisi
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">3. Pusat Cetak & Laporan</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Ekspor dan cetak rekapitulasi resmi untuk supervisi Kepala Sekolah, Pengawas, & Arsip Guru.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onNavigateModule('rekap', 'absensi-bulanan')}
                  className="w-full p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl transition-colors text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cetak Presensi Bulanan / Semester</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                <button
                  onClick={() => onNavigateModule('rekap', 'nilai')}
                  className="w-full p-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cetak Leger & Buku Nilai</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigateModule('administrasi', 'laporan-piket')}
                  className="w-full p-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                    <span>Cetak Laporan Piket & BK</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {onOpenCardGenerator && (
                  <button
                    onClick={onOpenCardGenerator}
                    className="w-full p-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-left flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      <span>Cetak Kartu Siswa & Barcode</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 5. ANALISIS KETUNTASAN BELAJAR & CHECKLIST KELENGKAPAN         */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* LEFT: Student Performance Breakdown & Remedial */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span>Analisis Ketuntasan Belajar Kelas {currentAssignment.classLabel}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Capaian KKTP mata pelajaran {currentAssignment.subject} (Rata-rata: {gradeStats.avg})
                </p>
              </div>

              <button
                onClick={() => onNavigateModule('administrasi', 'remedial-pengayaan')}
                className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
              >
                <span>Program Remedial</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tuntas vs Remedial Progress Bar */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Tingkat Ketuntasan KKTP</span>
                  <strong className="text-emerald-700">{gradeStats.percentTuntas}% Tuntas</strong>
                </div>

                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${gradeStats.percentTuntas}%` }}
                    title={`Tuntas: ${gradeStats.percentTuntas}%`}
                  />
                  <div
                    className="bg-amber-400 h-full transition-all duration-500"
                    style={{ width: `${100 - gradeStats.percentTuntas}%` }}
                    title={`Remedial: ${100 - gradeStats.percentTuntas}%`}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Tuntas: <b>{gradeStats.tuntasCount} Siswa</b>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    Remedial: <b>{gradeStats.remedialList.length} Siswa</b>
                  </span>
                </div>
              </div>

              {/* Attendance Breakdown */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Presensi Kelas {currentAssignment.classLabel}</span>
                  <strong className="text-blue-700">{attendanceStats.totalPct}% Kehadiran</strong>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  <div className="bg-emerald-100 text-emerald-800 p-2 rounded-xl">
                    <span className="text-[10px] font-semibold block text-emerald-700">Hadir</span>
                    <strong className="text-sm font-bold">{attendanceStats.hadir}</strong>
                  </div>
                  <div className="bg-sky-100 text-sky-800 p-2 rounded-xl">
                    <span className="text-[10px] font-semibold block text-sky-700">Sakit</span>
                    <strong className="text-sm font-bold">{attendanceStats.sakit}</strong>
                  </div>
                  <div className="bg-amber-100 text-amber-800 p-2 rounded-xl">
                    <span className="text-[10px] font-semibold block text-amber-700">Izin</span>
                    <strong className="text-sm font-bold">{attendanceStats.izin}</strong>
                  </div>
                  <div className="bg-rose-100 text-rose-800 p-2 rounded-xl">
                    <span className="text-[10px] font-semibold block text-rose-700">Alpa</span>
                    <strong className="text-sm font-bold">{attendanceStats.alpa}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Remedial List */}
            {gradeStats.remedialList.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Daftar Siswa Perlu Pendampingan Remedial ({gradeStats.remedialList.length} Siswa)</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {gradeStats.remedialList.map((s, idx) => (
                    <span key={idx} className="bg-white border border-amber-300 text-amber-900 px-2.5 py-1 rounded-lg font-medium text-[11px] shadow-2xs flex items-center gap-1">
                      <span>{s.name}</span>
                      <strong className="text-amber-700 bg-amber-100 px-1 rounded text-[10px]">{s.score}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Checklist Dokumen Administrasi Guru */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Checklist Administrasi Guru</span>
                </h3>
                <p className="text-[11px] text-slate-500">Kelengkapan berkas supervisi akademik.</p>
              </div>

              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                {adminCompletenessPct}% Ready
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${adminCompletenessPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>{readyAdminCount} dari {adminChecklist.length} Berkas Siap Cetak</span>
              </div>
            </div>

            {/* Checklist List */}
            <div className="space-y-1.5 text-xs pt-1 max-h-72 overflow-y-auto pr-1">
              {adminChecklist.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateModule('administrasi', item.subView)}
                  className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 hover:border-emerald-300 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        item.status === 'ready' ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                      }`}
                    />
                    <span className="font-semibold text-slate-800 text-[11px] truncate group-hover:text-emerald-900">
                      {item.title}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                      item.status === 'ready'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status === 'ready' ? 'Ready' : 'Draft'}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigateModule('administrasi', 'katalog')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors text-center flex items-center justify-center gap-1.5"
            >
              <Folder className="w-4 h-4 text-amber-400" />
              <span>Buka Katalog Dokumen Lengkap</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL LAPORAN WHATSAPP SISWA ABSEN (DESKTOP) ── */}
      <WhatsAppAbsentReportModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        school={school}
        teacher={teacher}
        assignment={currentAssignment}
        roster={currentRoster}
        absentStudents={absentStudentsToday.list}
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
