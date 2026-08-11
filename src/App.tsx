import { useState, useMemo, useEffect } from 'react';
import { loadStorageData, saveStorageData, clearAllStorageData } from './utils/storage';
import {
  initialSchoolProfile,
  initialTeacherProfile,
  sampleTeachersList,
  initialAcademicYear,
  sampleRosters,
  sampleAssignments,
  sampleGradeBook7AMat1,
  sampleAttendance7A,
  sampleLessonSessions7AMat,
  sampleTeachingJournals7AMat,
} from './data/sampleData';
import type {
  RekapTab,
  MainModule,
  MarginPreset,
  ScalePreset,
  HeaderStyleOption,
  HeaderLayoutOption,
  TeacherProfile,
  MonthlyAttendanceMatrix,
  TatapMukaAttendanceMatrix,
  JurnalMatrix as JurnalMatrixType,
  GradeBook,
  AttendanceRecord,
  LessonSession,
  TeachingJournal,
  StudentMonthlyAttendanceRow,
} from './types';
import { RekapHeader } from './components/RekapHeader';
import { AppSidebar } from './components/layout/AppSidebar';
import { QuickScoreEditModal } from './components/modals/QuickScoreEditModal';
import { AbsensiBulananMatrix } from './components/matrix/AbsensiBulananMatrix';
import { TatapMukaMatrix } from './components/matrix/TatapMukaMatrix';
import { NilaiMatrix } from './components/matrix/NilaiMatrix';
import { JurnalMatrix } from './components/matrix/JurnalMatrix';
import { ProsemAbsensiScheduleView } from './components/matrix/ProsemAbsensiScheduleView';
import { AdministrasiMerdeka } from './components/administrasi/AdministrasiMerdeka';
import { ManajemenSiswaKelasGuru } from './components/manajemen/ManajemenSiswaKelasGuru';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { KbmHarianExpressModal } from './components/matrix/KbmHarianExpressModal';
import { exportToExcel, exportToWord, triggerPrint } from './utils/exporters';
import { Plus, Edit3, CheckCircle2, RotateCcw, FolderTree, BarChart3, BookOpenCheck, Calendar, BookOpen, Award, FileText, Menu, X, ChevronLeft, ChevronRight, User, Building, Sparkles, LayoutDashboard, Zap, Users, Search, Calculator, Layers, ShieldCheck, FileSpreadsheet, CheckSquare, Star, ChevronDown, AlertTriangle } from 'lucide-react';

export default function App() {
  // Core state (with localStorage persistence)
  const [school, setSchool] = useState(() => loadStorageData('school', initialSchoolProfile));
  const [teacher, setTeacher] = useState(() => loadStorageData('teacher', initialTeacherProfile));
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => loadStorageData('teachersList', sampleTeachersList));
  const [year, setYear] = useState(() => loadStorageData('year', initialAcademicYear));
  const [assignments, setAssignments] = useState(() => loadStorageData('assignments', sampleAssignments));
  const [rosters, setRosters] = useState(() => loadStorageData('rosters', sampleRosters));

  // Main Module navigation state ('dashboard' | 'rekap' | 'administrasi' | 'manajemen')
  const [mainModule, setMainModule] = useState<MainModule>('dashboard');
  const [adminSubView, setAdminSubView] = useState<string>('katalog');
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    kbm: true,
    kurikulum: true,
    perangkat: true,
    cheat: true,
    tugas: true,
    master: true,
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // User selections
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(sampleAssignments[0].id);
  const [semester, setSemester] = useState<1 | 2>(1);
  const [tab, setTab] = useState<RekapTab>('tatap-muka');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(1); // 1 = Agustus
  const [attendanceThreshold, setAttendanceThreshold] = useState<number>(0.75);
  const [marginPreset, setMarginPreset] = useState<MarginPreset>('rapat');
  const [scalePreset, setScalePreset] = useState<ScalePreset>(80);
  const [headerStyle, setHeaderStyle] = useState<HeaderStyleOption>('slate');
  const [headerLayout, setHeaderLayout] = useState<HeaderLayoutOption>('tingkat');

  // Dynamic state for grades, attendance, sessions, journals (with localStorage persistence)
  const [gradeBook, setGradeBook] = useState<GradeBook>(() => loadStorageData('gradeBook', sampleGradeBook7AMat1));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => loadStorageData('attendanceRecords', sampleAttendance7A));
  const [lessonSessions, setLessonSessions] = useState<LessonSession[]>(() => loadStorageData('lessonSessions', sampleLessonSessions7AMat));
  const [teachingJournals, setTeachingJournals] = useState<TeachingJournal[]>(() => loadStorageData('teachingJournals', sampleTeachingJournals7AMat));

  // Sync state changes to localStorage
  useEffect(() => { saveStorageData('school', school); }, [school]);
  useEffect(() => { saveStorageData('teacher', teacher); }, [teacher]);
  useEffect(() => { saveStorageData('teachersList', teachers); }, [teachers]);
  useEffect(() => { saveStorageData('year', year); }, [year]);
  useEffect(() => { saveStorageData('assignments', assignments); }, [assignments]);
  useEffect(() => { saveStorageData('rosters', rosters); }, [rosters]);
  useEffect(() => { saveStorageData('gradeBook', gradeBook); }, [gradeBook]);
  useEffect(() => { saveStorageData('attendanceRecords', attendanceRecords); }, [attendanceRecords]);
  useEffect(() => { saveStorageData('lessonSessions', lessonSessions); }, [lessonSessions]);
  useEffect(() => { saveStorageData('teachingJournals', teachingJournals); }, [teachingJournals]);

  // Quick edit modal & Express KBM modal state
  const [isExpressKbmOpen, setIsExpressKbmOpen] = useState(false);
  const [expressInitialMeeting, setExpressInitialMeeting] = useState<{ dateISO?: string; meetingNum?: number; tpTitle?: string } | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState('');
  const [editPts, setEditPts] = useState<number>(80);
  const [editPas, setEditPas] = useState<number>(85);
  const [editUlangan, setEditUlangan] = useState<Record<number, number>>({});
  const [editTugas, setEditTugas] = useState<Record<number, number>>({});

  // Selected assignment object
  const currentAssignment = useMemo(
    () => assignments.find((a) => a.id === selectedAssignmentId) || assignments[0],
    [assignments, selectedAssignmentId]
  );

  // Selected roster
  const currentRoster = useMemo(
    () => rosters.find((r) => r.classId === currentAssignment.classId) || rosters[0],
    [rosters, currentAssignment]
  );

  /* ------------------------------------------------------------------ */
  /*  1. Compute Format 1: Monthly Attendance Matrix                     */
  /* ------------------------------------------------------------------ */
  const monthlyMatrix = useMemo<MonthlyAttendanceMatrix>(() => {
    // Map index (0 = Juli, 1 = Agustus, etc) to month & year
    const monthNum = selectedMonthIndex < 6 ? selectedMonthIndex + 7 : selectedMonthIndex - 5;
    const yearNum = selectedMonthIndex < 6 ? 2024 : 2025;
    const monthNames = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

    const studentRows: StudentMonthlyAttendanceRow[] = currentRoster.students.map((student) => {
      const statusByDate: Record<number, any> = {};

      attendanceRecords
        .filter((r) => r.studentId === student.id && r.classId === currentAssignment.classId)
        .forEach((r) => {
          const d = new Date(r.date);
          if (d.getMonth() + 1 === monthNum && d.getFullYear() === yearNum) {
            statusByDate[d.getDate()] = r.status;
          }
        });

      let sakit = 0, izin = 0, alpa = 0, terlambat = 0, hadir = 0;
      Object.values(statusByDate).forEach((status) => {
        if (status === 'sick') sakit++;
        else if (status === 'excused') izin++;
        else if (status === 'absent') alpa++;
        else if (status === 'late') terlambat++;
        else if (status === 'present') hadir++;
      });

      return {
        studentId: student.id,
        studentName: student.name,
        nisn: student.nisn,
        studentNumber: student.number,
        statusByDate,
        rekap: { sakit, izin, alpa, terlambat, hadir, jlh: sakit + izin + alpa + terlambat },
      };
    });

    return {
      month: monthNum,
      monthName: monthNames[selectedMonthIndex],
      year: yearNum,
      daysInMonth,
      students: studentRows,
    };
  }, [selectedMonthIndex, currentRoster, currentAssignment, attendanceRecords]);

  /* ------------------------------------------------------------------ */
  /*  2. Compute Format 2: Tatap Muka Matrix                           */
  /* ------------------------------------------------------------------ */
  const tatapMukaMatrix = useMemo<TatapMukaAttendanceMatrix>(() => {
    const activeSessions = lessonSessions.filter(
      (s) => s.classId === currentAssignment.classId && s.subject === currentAssignment.subject
    );

    const meetings = activeSessions.map((session, idx) => {
      const attendanceByStudent: Record<string, any> = {};
      attendanceRecords
        .filter((r) => r.classId === session.classId && r.date === session.date)
        .forEach((r) => {
          attendanceByStudent[r.studentId] = r.status;
        });

      return {
        meetingNumber: idx + 1,
        dateISO: session.date,
        sessionId: session.id,
        durationJP: session.durationJP,
        attendanceByStudent,
      };
    });

    const students = currentRoster.students.map((student) => {
      let totalJPAttended = 0;
      let lastMeetingDate: string | null = null;

      meetings.forEach((m) => {
        const st = m.attendanceByStudent[student.id];
        if (st === 'present' || st === 'late' || !st) {
          totalJPAttended += m.durationJP;
          lastMeetingDate = m.dateISO;
        }
      });

      const entry = gradeBook.entries.find((e) => e.studentId === student.id);

      return {
        studentId: student.id,
        studentName: student.name,
        nisn: student.nisn,
        studentNumber: student.number,
        totalJPAttended,
        lastMeetingDate,
        pts: entry?.pts,
        pas: entry?.pas,
      };
    });

    return { meetings, students };
  }, [lessonSessions, currentAssignment, attendanceRecords, currentRoster, gradeBook]);

  /* ------------------------------------------------------------------ */
  /*  3. Compute Format 4: Jurnal Agenda Matrix                        */
  /* ------------------------------------------------------------------ */
  const jurnalMatrix = useMemo<JurnalMatrixType>(() => {
    const activeSessions = lessonSessions.filter(
      (s) => s.classId === currentAssignment.classId && s.subject === currentAssignment.subject
    );

    const journalMap = new Map<string, TeachingJournal>();
    teachingJournals.forEach((j) => journalMap.set(j.sessionId, j));

    const rows = activeSessions.map((session, idx) => {
      const journal = journalMap.get(session.id);
      const sessionAtt = attendanceRecords.filter((r) => r.classId === session.classId && r.date === session.date);

      const absentStudents: Array<{ name: string; reason: string }> = [];
      sessionAtt.forEach((ar) => {
        if (ar.status === 'sick' || ar.status === 'excused' || ar.status === 'absent') {
          const stName = currentRoster.students.find((s) => s.id === ar.studentId)?.name || 'Siswa';
          const reason = ar.status === 'sick' ? 'Sakit' : ar.status === 'excused' ? 'Izin' : 'Alpa';
          absentStudents.push({ name: stName, reason });
        }
      });

      let keterangan = 'Tuntas';
      if (journal?.realizationStatus === 'continued') keterangan = 'Dilanjutkan';
      else if (journal?.realizationStatus === 'cancelled') keterangan = 'Tidak Terlaksana';

      return {
        meetingNumber: idx + 1,
        dateISO: session.date,
        sessionId: session.id,
        startPeriod: session.startPeriod,
        durationJP: session.durationJP,
        plannedMaterialTitle: journal?.plannedMaterialTitle || 'Materi Pembelajaran Sesuai Alur TP',
        actualMaterialTitle: journal?.actualMaterialTitle || null,
        realizationStatus: journal?.realizationStatus || 'done',
        absentStudents,
        keterangan,
        note: journal?.note || null,
        journalStatus: 'done',
        hasJournal: !!journal,
      };
    });

    return { rows };
  }, [lessonSessions, currentAssignment, teachingJournals, attendanceRecords, currentRoster]);

  /* ------------------------------------------------------------------ */
  /*  Stats Summary Calculations                                        */
  /* ------------------------------------------------------------------ */
  const totalStudents = currentRoster.students.length;
  const avgGrade = Math.round(
    gradeBook.entries.reduce((acc, curr) => acc + curr.finalScore, 0) / (gradeBook.entries.length || 1)
  );

  const totalPossibleJP = (lessonSessions.length || 1) * 3;
  const totalAttendedJP = tatapMukaMatrix.students.reduce((acc, s) => acc + s.totalJPAttended, 0);
  const attendancePct = Math.round((totalAttendedJP / (totalPossibleJP * totalStudents)) * 100) || 92;

  /* ------------------------------------------------------------------ */
  /*  Export Handlers                                                   */
  /* ------------------------------------------------------------------ */
  const getActiveDocumentId = () => {
    if (tab === 'absensi-bulanan') return 'rekap-absensi-doc';
    if (tab === 'tatap-muka') return 'rekap-tatapmuka-doc';
    if (tab === 'nilai') return 'rekap-nilai-doc';
    return 'rekap-jurnal-doc';
  };

  const handlePrint = () => {
    const docId = getActiveDocumentId();
    triggerPrint(docId, marginPreset, scalePreset);
  };

  const handleExportExcel = () => {
    const docId = getActiveDocumentId();
    exportToExcel(docId, `Rekap_${tab}_${currentAssignment.classLabel}`, `REKAP ${tab.toUpperCase()} ${currentAssignment.classLabel}`);
  };

  const handleExportWord = () => {
    const docId = getActiveDocumentId();
    exportToWord(docId, `Rekap_${tab}_${currentAssignment.classLabel}`, `REKAP ${tab.toUpperCase()} ${currentAssignment.classLabel}`);
  };

  /* ------------------------------------------------------------------ */
  /*  KD Count & GradeBook Handlers                                     */
  /* ------------------------------------------------------------------ */
  const handleKdCountChange = (newCount: number) => {
    setGradeBook((prev) => {
      const updatedEntries = prev.entries.map((entry) => {
        const ulanganScores = { ...(entry.ulanganScores || {}) };
        const tugasScores = { ...(entry.tugasScores || {}) };
        const finalKDScores = { ...(entry.finalKDScores || {}) };

        let sumKD = 0;
        for (let i = 1; i <= newCount; i++) {
          if (ulanganScores[i] === undefined || ulanganScores[i] === null) {
            const seed = (entry.studentName.charCodeAt(0) || 75) + i * 3;
            ulanganScores[i] = Math.min(100, Math.max(65, 70 + (seed % 25)));
          }
          if (tugasScores[i] === undefined || tugasScores[i] === null) {
            const seed = (entry.studentName.charCodeAt(1) || 80) + i * 4;
            tugasScores[i] = Math.min(100, Math.max(70, 75 + (seed % 22)));
          }
          finalKDScores[i] = Math.round((ulanganScores[i] + tugasScores[i]) / 2);
          sumKD += finalKDScores[i];
        }

        const avgKD = sumKD / newCount;
        const pts = entry.pts ?? 80;
        const pas = entry.pas ?? 85;
        const finalScore = Math.round((avgKD + pts + pas) / 3);

        return {
          ...entry,
          ulanganScores,
          tugasScores,
          finalKDScores,
          finalScore,
        };
      });

      return {
        ...prev,
        kdCount: newCount,
        entries: updatedEntries,
      };
    });
  };

  const handleIsPaSplitChange = (isPaSplit: boolean) => {
    setGradeBook((prev) => ({
      ...prev,
      isPaSplit,
    }));
  };

  /* ------------------------------------------------------------------ */
  /*  Quick Edit Score Modal Handler                                    */
  /* ------------------------------------------------------------------ */
  const openEditModal = (studentId?: string) => {
    const targetId = studentId || currentRoster.students[0]?.id || '';
    if (!targetId) return;

    setEditStudentId(targetId);
    const ent = gradeBook.entries.find((x) => x.studentId === targetId);
    if (ent) {
      setEditPts(ent.pts ?? 80);
      setEditPas(ent.pas ?? 85);
      setEditUlangan({ ...(ent.ulanganScores || {}) });
      setEditTugas({ ...(ent.tugasScores || {}) });
    }
    setIsEditModalOpen(true);
  };

  const handleSaveStudentScore = () => {
    if (!editStudentId) return;

    setGradeBook((prev) => {
      const updatedEntries = prev.entries.map((entry) => {
        if (entry.studentId === editStudentId) {
          const ulanganScores = { ...editUlangan };
          const tugasScores = { ...editTugas };
          const finalKDScores: Record<number, number> = {};

          let sumKD = 0;
          for (let i = 1; i <= prev.kdCount; i++) {
            const u = ulanganScores[i] ?? 75;
            const t = tugasScores[i] ?? 80;
            finalKDScores[i] = Math.round((u + t) / 2);
            sumKD += finalKDScores[i];
          }

          const avgKD = sumKD / (prev.kdCount || 1);
          const pts = editPts;
          const pas = editPas;
          const finalScore = Math.round((avgKD + pts + pas) / 3);

          return {
            ...entry,
            ulanganScores,
            tugasScores,
            finalKDScores,
            pts,
            pas,
            finalScore,
          };
        }
        return entry;
      });

      return {
        ...prev,
        entries: updatedEntries,
      };
    });

    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* ── MOBILE BACKDROP OVERLAY ── */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden no-print"
        />
      )}

      {/* ── APP SIDEBAR ── */}
      <AppSidebar
        mainModule={mainModule}
        setMainModule={setMainModule}
        tab={tab}
        setTab={setTab}
        adminSubView={adminSubView}
        setAdminSubView={setAdminSubView}
        sidebarSearch={sidebarSearch}
        setSidebarSearch={setSidebarSearch}
        expandedGroups={expandedGroups}
        setExpandedGroups={setExpandedGroups}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        teacher={teacher}
        school={school}
      />

      {/* ── RIGHT MAIN CONTENT AREA ── */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Bar for Content Area */}
        <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md no-print px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
              title="Buka Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Title */}
            <div>
              <div className="text-[10px] font-semibold tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>Guru Admin Flow</span>
                <span>/</span>
                <span className="text-blue-400 font-bold">
                  {mainModule === 'dashboard'
                    ? 'Dashboard Utama'
                    : mainModule === 'manajemen'
                    ? 'Master Data'
                    : mainModule === 'administrasi'
                    ? 'Administrasi Merdeka'
                    : 'Rekap KBM & Nilai'}
                </span>
                {mainModule === 'administrasi' && (
                  <>
                    <span>/</span>
                    <span className="text-amber-400 font-bold uppercase">{adminSubView}</span>
                  </>
                )}
              </div>
              <h2 className="text-sm md:text-base font-bold text-white leading-tight">
                {mainModule === 'dashboard'
                  ? 'Dashboard Utama & Ringkasan KBM Guru'
                  : mainModule === 'manajemen'
                  ? 'Manajemen Data Siswa, Kelas, Guru & Sekolah'
                  : mainModule === 'administrasi'
                  ? adminSubView === 'rme-kalkulator'
                    ? 'Kalkulator Rincian Minggu Efektif & Alokasi JP'
                    : adminSubView === 'prota-prosem'
                    ? 'Generator PROTA & PROSEM Kurikulum Merdeka'
                    : adminSubView === 'atp'
                    ? 'Generator Alur Tujuan Pembelajaran (ATP)'
                    : adminSubView === 'cp-bskap'
                    ? 'Master Capaian Pembelajaran (CP BSKAP 2024)'
                    : adminSubView === 'modul-ajar'
                    ? 'Generator Modul Ajar (RPP Merdeka)'
                    : adminSubView === 'lkpd'
                    ? 'Generator Lembar Kerja Peserta Didik (LKPD)'
                    : adminSubView === 'asesmen-soal'
                    ? 'Generator Kisi-Kisi & Kartu Soal Asesmen'
                    : adminSubView === 'asesmen-kktp'
                    ? 'Generator Rubrik KKTP & Deskripsi e-Rapor'
                    : adminSubView === 'remedial-pengayaan'
                    ? 'Auto Program Remedial & Pengayaan'
                    : adminSubView === 'p5-projek'
                    ? 'Generator Modul & Rapor Projek P5'
                    : adminSubView === 'piket-bk-ekskul'
                    ? 'Laporan Tugas Tambahan (Piket, BK, Ekskul)'
                    : adminSubView === 'adaptor-identitas'
                    ? 'Adaptor Massal Identitas Dokumen'
                    : 'Perangkat & Dokumen Administrasi Guru'
                  : tab === 'absensi-bulanan'
                  ? 'Presensi Kehadiran Bulanan Siswa'
                  : tab === 'tatap-muka'
                  ? 'Rekap Kehadiran Tatap Muka'
                  : tab === 'nilai'
                  ? 'Daftar & Rekap Penilaian Hasil Belajar'
                  : 'Jurnal Agenda Mengajar Guru'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpressKbmOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="hidden md:inline">Input KBM Express</span>
            </button>
            <span className="hidden sm:inline-block px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl">
              {currentAssignment.classLabel} · {currentAssignment.subject}
            </span>
          </div>
        </header>

        {/* ── MAIN CONTAINER ── */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-6 pb-16 space-y-6">
          {mainModule === 'dashboard' ? (
            <MainDashboard
              school={school}
              teacher={teacher}
              year={year}
              assignments={assignments}
              currentAssignment={currentAssignment}
              onSelectAssignment={setSelectedAssignmentId}
              rosters={rosters}
              gradeBook={gradeBook}
              attendanceRecords={attendanceRecords}
              lessonSessions={lessonSessions}
              teachingJournals={teachingJournals}
              onNavigateModule={(mod, subViewOrTab) => {
                setMainModule(mod);
                if (mod === 'administrasi' && subViewOrTab) {
                  setAdminSubView(subViewOrTab);
                } else if (mod === 'rekap' && subViewOrTab) {
                  setTab(subViewOrTab as RekapTab);
                }
              }}
              onOpenExpressKbm={() => setIsExpressKbmOpen(true)}
              onOpenEditScore={() => openEditModal()}
            />
          ) : mainModule === 'manajemen' ? (
            <ManajemenSiswaKelasGuru
              school={school}
              setSchool={setSchool}
              teacher={teacher}
              setTeacher={setTeacher}
              teachers={teachers}
              setTeachers={setTeachers}
              year={year}
              setYear={setYear}
              rosters={rosters}
              setRosters={setRosters}
              assignments={assignments}
              setAssignments={setAssignments}
            />
          ) : mainModule === 'administrasi' ? (
            <AdministrasiMerdeka
              school={school}
              teacher={teacher}
              year={year}
              selectedAssignmentSubject={currentAssignment.subject}
              selectedClassLabel={currentAssignment.classLabel}
              activeSubView={adminSubView}
              onSubViewChange={setAdminSubView}
            />
          ) : (
            <>
              {/* Header & Controls */}
              <RekapHeader
                assignments={assignments}
                selectedAssignmentId={selectedAssignmentId}
                onSelectAssignment={setSelectedAssignmentId}
                semester={semester}
                onChangeSemester={setSemester}
                selectedMonthIndex={selectedMonthIndex}
                onChangeMonth={setSelectedMonthIndex}
                tab={tab}
                onChangeTab={setTab}
                attendanceThreshold={attendanceThreshold}
                onChangeThreshold={setAttendanceThreshold}
                kdCount={gradeBook.kdCount}
                onChangeKdCount={handleKdCountChange}
                isPaSplit={gradeBook.isPaSplit}
                onChangeIsPaSplit={handleIsPaSplitChange}
                marginPreset={marginPreset}
                onChangeMargin={setMarginPreset}
                scalePreset={scalePreset}
                onChangeScale={setScalePreset}
                headerStyle={headerStyle}
                onChangeHeaderStyle={setHeaderStyle}
                headerLayout={headerLayout}
                onChangeHeaderLayout={setHeaderLayout}
                totalStudents={totalStudents}
                avgGrade={avgGrade}
                attendancePct={attendancePct}
                totalMeetings={tatapMukaMatrix.meetings.length}
                onPrint={handlePrint}
                onExportExcel={handleExportExcel}
                onExportWord={handleExportWord}
                onOpenExpressKbm={() => setIsExpressKbmOpen(true)}
              />

              {/* ── REKAP DOCUMENT CANVAS ── */}
              <div className="flex justify-center my-6">
                <div className="w-full max-w-6xl transition-all duration-200">
                  {tab === 'absensi-bulanan' && (
                    <AbsensiBulananMatrix
                      matrix={monthlyMatrix}
                      school={school}
                      teacherName={teacher.name}
                      teacherNip={teacher.nip}
                      yearLabel={year.label}
                      classLabel={currentAssignment.classLabel}
                    />
                  )}

                  {tab === 'tatap-muka' && (
                    <TatapMukaMatrix
                      matrix={tatapMukaMatrix}
                      school={school}
                      teacherName={teacher.name}
                      teacherNip={teacher.nip}
                      yearLabel={year.label}
                      classLabel={currentAssignment.classLabel}
                      subject={currentAssignment.subject}
                      semester={semester}
                      attendanceThreshold={attendanceThreshold}
                      headerStyle={headerStyle}
                      headerLayout={headerLayout}
                    />
                  )}

                  {tab === 'nilai' && (
                    <NilaiMatrix
                      records={gradeBook.entries}
                      gradeBook={gradeBook}
                      school={school}
                      teacherName={teacher.name}
                      teacherNip={teacher.nip}
                      yearLabel={year.label}
                      classLabel={currentAssignment.classLabel}
                      subject={currentAssignment.subject}
                      semester={semester}
                    />
                  )}

                  {tab === 'jurnal' && (
                    <JurnalMatrix
                      matrix={jurnalMatrix}
                      school={school}
                      teacherName={teacher.name}
                      teacherNip={teacher.nip}
                      yearLabel={year.label}
                      classLabel={currentAssignment.classLabel}
                      subject={currentAssignment.subject}
                      semester={semester}
                      onOpenExpressForMeeting={(dateISO, meetingNum, tpTitle) => {
                        setExpressInitialMeeting({ dateISO, meetingNum, tpTitle });
                        setIsExpressKbmOpen(true);
                      }}
                    />
                  )}

                  {tab === 'prosem-schedule' && (
                    <ProsemAbsensiScheduleView
                      assignment={currentAssignment}
                      year={{ ...year, semester }}
                      school={school}
                      teacherName={teacher.name}
                      teacherNip={teacher.nip}
                      attendanceRecords={attendanceRecords}
                      teachingJournals={teachingJournals}
                      onOpenExpressForMeeting={(dateISO, meetingNum, tpTitle) => {
                        setExpressInitialMeeting({ dateISO, meetingNum, tpTitle });
                        setIsExpressKbmOpen(true);
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ── QUICK SCORE EDIT MODAL ── */}
      {isEditModalOpen && (() => {
        const liveSumKD = Array.from({ length: gradeBook.kdCount }, (_, i) => {
          const kdNum = i + 1;
          const u = editUlangan[kdNum] ?? 75;
          const t = editTugas[kdNum] ?? 80;
          return Math.round((u + t) / 2);
        }).reduce((a, b) => a + b, 0);

        const liveAvgKD = liveSumKD / (gradeBook.kdCount || 1);
        const liveFinalScore = Math.round((liveAvgKD + editPts + editPas) / 3);
        const livePredikat = liveFinalScore >= 90 ? 'A' : liveFinalScore >= 80 ? 'B' : liveFinalScore >= 70 ? 'C' : 'D';

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b pb-3 shrink-0">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>Input / Edit Nilai Siswa (KD / TP & Exam)</span>
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pilih Siswa ({currentAssignment.classLabel})
                    </label>
                    <select
                      value={editStudentId}
                      onChange={(e) => {
                        const sid = e.target.value;
                        setEditStudentId(sid);
                        const ent = gradeBook.entries.find((x) => x.studentId === sid);
                        if (ent) {
                          setEditPts(ent.pts ?? 80);
                          setEditPas(ent.pas ?? 85);
                          setEditUlangan({ ...(ent.ulanganScores || {}) });
                          setEditTugas({ ...(ent.tugasScores || {}) });
                        }
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                    >
                      {currentRoster.students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.number}. {s.name} ({s.nisn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jumlah KD / TP ({currentAssignment.subject})
                    </label>
                    <select
                      value={gradeBook.kdCount}
                      onChange={(e) => handleKdCountChange(Number(e.target.value))}
                      className="w-full bg-white border border-blue-300 text-blue-900 rounded-lg p-2 font-bold"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map((num) => (
                        <option key={num} value={num}>
                          {num} Kompetensi Dasar / TP
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* KD / TP Scores Grid */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                    <span>
                      {gradeBook.isPaSplit
                        ? 'Nilai Formatif (Ulangan) & Sumatif (Tugas) per TP:'
                        : 'Nilai Tujuan Pembelajaran (TP 1 - TP ' + gradeBook.kdCount + '):'}
                    </span>
                    <span className="text-[11px] font-normal text-slate-500">Total: {gradeBook.kdCount} TP</span>
                  </h4>
                  <div className={`grid gap-2 max-h-60 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/50 ${
                    gradeBook.isPaSplit ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
                  }`}>
                    {Array.from({ length: gradeBook.kdCount }, (_, i) => {
                      const kdNum = i + 1;
                      const uVal = editUlangan[kdNum] ?? 75;
                      const tVal = editTugas[kdNum] ?? 80;
                      const tpScore = Math.round((uVal + tVal) / 2);

                      if (!gradeBook.isPaSplit) {
                        return (
                          <div key={kdNum} className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                            <div className="font-bold text-slate-800 text-[11px] text-center">
                              TP {kdNum}
                            </div>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={uVal}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setEditUlangan((prev) => ({ ...prev, [kdNum]: val }));
                                setEditTugas((prev) => ({ ...prev, [kdNum]: val }));
                              }}
                              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 font-bold text-blue-900 text-center text-xs"
                            />
                          </div>
                        );
                      }

                      return (
                        <div key={kdNum} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                          <div className="font-bold text-slate-800 flex justify-between text-[11px]">
                            <span>TP {kdNum}</span>
                            <span className="text-blue-600">Rata: {tpScore}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div>
                              <span className="text-[9px] text-slate-500 block">Ulangan</span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={uVal}
                                onChange={(e) =>
                                  setEditUlangan((prev) => ({ ...prev, [kdNum]: Number(e.target.value) }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 font-semibold text-slate-800 text-center text-xs"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-500 block">Tugas</span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={tVal}
                                onChange={(e) =>
                                  setEditTugas((prev) => ({ ...prev, [kdNum]: Number(e.target.value) }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 font-semibold text-slate-800 text-center text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PTS & PAS */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nilai PTS (Tengah Semester)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editPts}
                      onChange={(e) => setEditPts(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900 text-center"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nilai PAS (Akhir Semester)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editPas}
                      onChange={(e) => setEditPas(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900 text-center"
                    />
                  </div>
                </div>

                {/* Live Preview Score Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Hasil Kalkulasi Otomatis</div>
                    <div className="text-xs text-blue-900 font-medium">
                      Rata-rata KD: <b>{Math.round(liveAvgKD)}</b> · PTS: <b>{editPts}</b> · PAS: <b>{editPas}</b>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-[10px] text-blue-600 font-medium">Nilai Akhir (NA)</div>
                      <div className="text-xl font-extrabold text-blue-900">{liveFinalScore}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      liveFinalScore >= 85
                        ? 'text-emerald-800 bg-emerald-100'
                        : liveFinalScore >= 75
                        ? 'text-blue-800 bg-blue-100'
                        : 'text-amber-800 bg-amber-100'
                    }`}>
                      Predikat {livePredikat}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t shrink-0">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveStudentScore}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {/* ── EXPRESS KBM HARIAN (1-KLIK SAKTI) MODAL ── */}
      <KbmHarianExpressModal
        isOpen={isExpressKbmOpen}
        onClose={() => {
          setIsExpressKbmOpen(false);
          setExpressInitialMeeting(undefined);
        }}
        roster={currentRoster}
        assignment={currentAssignment}
        year={year}
        attendanceRecords={attendanceRecords}
        onSaveAttendance={(updated) => setAttendanceRecords(updated)}
        teachingJournals={teachingJournals}
        onSaveJournal={(newJrn) => {
          setTeachingJournals((prev) => [
            ...prev.filter((j) => j.sessionId !== newJrn.sessionId),
            newJrn,
          ]);
        }}
        gradeBook={gradeBook}
        onSaveGradeBook={(updatedGB) => setGradeBook(updatedGB)}
        lessonSessions={lessonSessions}
        initialMeeting={expressInitialMeeting}
        onSaveLessonSession={(newSession) => {
          setLessonSessions((prev) => [
            ...prev.filter((s) => s.id !== newSession.id && s.date !== newSession.date),
            newSession,
          ]);
        }}
      />
    </div>
  );
}
