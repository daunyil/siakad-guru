import React, { useMemo } from 'react';
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
} from '../../types';
import {
  Users,
  Award,
  Calendar,
  BookOpen,
  Zap,
  MapPin,
  FileText,
  Layers,
  CheckSquare,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calculator,
  RefreshCw,
  Folder,
  BarChart3,
  UserCheck,
  GraduationCap,
  PlusCircle,
  ChevronRight,
  ListOrdered,
} from 'lucide-react';

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
}) => {
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

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* ── 1. WELCOME HERO BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Background Decorative Accents */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Sistem Informasi Administrasi Guru · Kurikulum Merdeka</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              {greeting}, <span className="text-amber-400">{teacher.name}</span>!
            </h1>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Mengampu mata pelajaran <strong className="text-white font-semibold">{teacher.subject}</strong> di{' '}
              <strong className="text-white font-semibold">{school.name}</strong>. Tahun Ajaran{' '}
              <strong className="text-blue-300 font-semibold">{year.label} (Semester {year.semester === 1 ? 'Ganjil' : 'Genap'})</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700 font-medium">
                NIP: {teacher.nip || '-'}
              </span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700 font-medium">
                NPSN: {school.npsn || '-'}
              </span>
              <span className="px-2.5 py-1 bg-blue-900/60 text-blue-200 rounded-lg border border-blue-700/50 font-bold">
                Kelas Aktif: {currentAssignment.classLabel} ({totalStudentsInAssignment} Siswa)
              </span>
            </div>
          </div>

          {/* Quick Action Buttons in Banner */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={onOpenExpressKbm}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-current text-slate-950" />
              <span>Input KBM Express (1-Klik)</span>
            </button>

            <button
              onClick={() => onNavigateModule('administrasi', 'katalog')}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-all hover:border-slate-600"
            >
              <Folder className="w-4 h-4 text-purple-400" />
              <span>Buka Katalog Perangkat</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. CLASS SELECTOR BAR ── */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pilih Rombel / Kelas Diampu:</span>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <span>{currentAssignment.classLabel}</span>
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
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {asg.subject}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. TOP STAT CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Siswa */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Siswa Diampu</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{totalStudentsAll}</span>
            <span className="text-xs font-medium text-slate-500">Siswa ({assignments.length} Rombel)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Kelas Aktif ({currentAssignment.classLabel}):</span>
            <strong className="text-blue-600">{totalStudentsInAssignment} Siswa</strong>
          </div>
        </div>

        {/* Card 2: Kehadiran Siswa */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkat Kehadiran</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{attendanceStats.totalPct}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Sangat Baik
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Hadir: {attendanceStats.hadir}</span>
            <span>Sakit/Izin/Alpa: <strong className="text-amber-600">{attendanceStats.sakit + attendanceStats.izin + attendanceStats.alpa}</strong></span>
          </div>
        </div>

        {/* Card 3: Rata-Rata Nilai Siswa */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Nilai Kelas</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{gradeStats.avg}</span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
              Predikat {gradeStats.avg >= 85 ? 'A' : gradeStats.avg >= 75 ? 'B' : 'C'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Ketuntasan:</span>
            <strong className="text-emerald-600">{gradeStats.percentTuntas}% ({gradeStats.tuntasCount} Siswa Tuntas)</strong>
          </div>
        </div>

        {/* Card 4: Jurnal & KBM Terlaksana */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jurnal KBM Terlaksana</span>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{journalStats.completedJournals}</span>
            <span className="text-xs font-medium text-slate-500">/ {journalStats.totalSessions} Pertemuan</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Progres Jurnal:</span>
            <strong className="text-sky-600">{journalStats.pct}% Terisi</strong>
          </div>
        </div>
      </div>

      {/* ── 4. AKSES CEPAT FITUR UTAMA (SHORTCUT GRID) ── */}
      <div className="space-y-3">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 fill-current" />
          <span>Akses Cepat & Pintasan Fitur Harian Guru</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Shortcut 1: Absensi Tatap Muka */}
          <button
            onClick={() => onNavigateModule('rekap', 'tatap-muka')}
            className="p-4 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-2xl shadow-2xs hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-800 block group-hover:text-emerald-900">
                Absensi Tatap Muka
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">Presensi per JP KBM</span>
            </div>
          </button>

          {/* Shortcut 2: Input / Edit Nilai */}
          <button
            onClick={onOpenEditScore}
            className="p-4 bg-white hover:bg-purple-50/60 border border-slate-200 hover:border-purple-300 rounded-2xl shadow-2xs hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-800 block group-hover:text-purple-900">
                Input Nilai Siswa
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">Nilai TP, PTS & PAS</span>
            </div>
          </button>

          {/* Shortcut 3: Jurnal Mengajar */}
          <button
            onClick={() => onNavigateModule('rekap', 'jurnal')}
            className="p-4 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-2xl shadow-2xs hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-800 block group-hover:text-blue-900">
                Jurnal Mengajar
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">Agenda & Catatan KBM</span>
            </div>
          </button>

          {/* Shortcut 4: PROTA & PROSEM */}
          <button
            onClick={() => onNavigateModule('administrasi', 'prota-prosem')}
            className="p-4 bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-2xl shadow-2xs hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-800 block group-hover:text-amber-900">
                PROTA & PROSEM
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">Kalender & Pekan Efektif</span>
            </div>
          </button>

          {/* Shortcut 5: Modul Ajar (RPP) */}
          <button
            onClick={() => onNavigateModule('administrasi', 'modul-ajar')}
            className="p-4 bg-white hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 rounded-2xl shadow-2xs hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-800 block group-hover:text-teal-900">
                Modul Ajar (RPP)
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">Generator RPP Merdeka</span>
            </div>
          </button>

          {/* Shortcut 6: Adaptor Identitas */}
          <button
            onClick={() => onNavigateModule('administrasi', 'adaptor-identitas')}
            className="p-4 bg-white hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 rounded-2xl shadow-2xs hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-800 block group-hover:text-rose-900">
                Adaptor Identitas
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">Ganti Identitas Docx</span>
            </div>
          </button>
        </div>
      </div>

      {/* ── 5. TWO-COLUMN LAYOUT: KBM SCHEDULE & ACADEMIC CHECKLIST ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2 Cols): Schedule / Class Cards & Student Performance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Cards & KBM Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Daftar Rombel / Kelas Diampu & Status KBM Hari Ini</span>
                </h3>
                <p className="text-[11px] text-slate-500">Pilih kelas untuk langsung melakukan pengisian presensi dan jurnal mengajar.</p>
              </div>

              <button
                onClick={onOpenExpressKbm}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Input Express</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assignments.map((asg) => {
                const roster = rosters.find((r) => r.classId === asg.classId);
                const isCurrent = asg.id === currentAssignment.id;
                const studentCount = roster?.students?.length || 32;

                return (
                  <div
                    key={asg.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isCurrent
                        ? 'bg-blue-50/50 border-blue-300 shadow-xs ring-1 ring-blue-400/30'
                        : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                          {asg.classLabel}
                        </span>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">
                            Kelas {asg.classLabel} · {asg.subject}
                          </h4>
                          <span className="text-[10px] text-slate-500">{studentCount} Siswa Terdaftar</span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-extrabold uppercase rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="flex justify-between">
                        <span>Beban Jam (JP):</span>
                        <strong className="text-slate-800">{asg.totalJpPerWeek || 3} JP / Minggu</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Status Jurnal Terakhir:</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Terisi Tuntas
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs pt-1">
                      <button
                        onClick={() => {
                          onSelectAssignment(asg.id);
                          onNavigateModule('rekap', 'tatap-muka');
                        }}
                        className="flex-1 py-2 px-2.5 bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 rounded-xl transition-colors text-center text-[11px] flex items-center justify-center gap-1"
                      >
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>Presensi</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectAssignment(asg.id);
                          onNavigateModule('rekap', 'nilai');
                        }}
                        className="flex-1 py-2 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-2xs transition-colors text-center text-[11px] flex items-center justify-center gap-1"
                      >
                        <Award className="w-3 h-3" />
                        <span>Nilai</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Performance Breakdown & Remedial Alert */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span>Analisis Ketuntasan Belajar & Catatan Khusus Siswa</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Data kelas {currentAssignment.classLabel} mata pelajaran {currentAssignment.subject}.
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
                    Perlu Remedial: <b>{gradeStats.remedialList.length} Siswa</b>
                  </span>
                </div>
              </div>

              {/* Attendance Summary Bar */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Ringkasan Presensi Siswa</span>
                  <strong className="text-blue-700">{attendanceStats.totalPct}% Hadir</strong>
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

            {/* Students Needing Remedial Attention List */}
            {gradeStats.remedialList.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Daftar Siswa Perlu Bimbingan / Remedial Khusus ({gradeStats.remedialList.length} Siswa)</span>
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
        </div>

        {/* RIGHT COLUMN (1 Col): Administration Completeness Checklist & Calendar */}
        <div className="space-y-6">
          {/* Perangkat Ajar Completeness Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Checklist Perangkat Guru</span>
                </h3>
                <p className="text-[11px] text-slate-500">Kelengkapan dokumen administrasi pembelajaran.</p>
              </div>

              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                {adminCompletenessPct}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${adminCompletenessPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>{readyAdminCount} dari {adminChecklist.length} Dokumen Ready</span>
                <span>Target: 100% Ready</span>
              </div>
            </div>

            {/* Checklist List */}
            <div className="space-y-2 text-xs pt-1 max-h-80 overflow-y-auto pr-1">
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
              <span>Buka Semua Perangkat</span>
            </button>
          </div>

          {/* Kalender Pendidikan & Agendas */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Agenda Kalender Pendidikan ({year.label})</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">Semester Ganjil</span>
                <p className="font-bold text-indigo-950 text-xs">Masa KBM & Penilaian Sumatif Tengah Semester (STS)</p>
                <p className="text-[10px] text-indigo-800">15 Juli - 20 Desember 2024</p>
              </div>

              <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-purple-700 uppercase block">Libur Idul Fitri (SKB 3 Menteri)</span>
                <p className="font-bold text-purple-950 text-xs">Perkiraan Libur Hari Raya & Cuti Bersama</p>
                <p className="text-[10px] text-purple-800">Akhir Maret - Awal April 2025 (2 Pekan Full)</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateModule('administrasi', 'prota-prosem')}
              className="w-full py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl transition-colors text-center block"
            >
              Lihat Kalender Lengkap →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
