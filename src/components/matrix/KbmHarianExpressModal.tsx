import React, { useState, useMemo } from 'react';
import type {
  ClassRoster,
  TeachingAssignment,
  AcademicYear,
  AttendanceRecord,
  TeachingJournal,
  GradeBook,
  LessonSession,
  AttendanceStatus,
} from '../../types';
import { generateProsemSchedule } from '../../lib/prosemScheduler';
import {
  computeStudentAbsenceSummaries,
  exportKbmToExcel,
  printKbmReportDoc,
} from '../../lib/exportKbmReports';
import {
  Zap,
  X,
  CheckCircle2,
  Calendar,
  BookOpen,
  UserCheck,
  Award,
  Save,
  Clock,
  Check,
  AlertCircle,
  Compass,
  FileSpreadsheet,
  Printer,
  Smartphone,
  Filter,
  ShieldAlert,
  Plus,
} from 'lucide-react';

interface KbmHarianExpressModalProps {
  isOpen: boolean;
  onClose: () => void;
  roster: ClassRoster;
  assignment: TeachingAssignment;
  year: AcademicYear;
  attendanceRecords: AttendanceRecord[];
  onSaveAttendance: (updated: AttendanceRecord[]) => void;
  teachingJournals: TeachingJournal[];
  onSaveJournal: (newJournal: TeachingJournal) => void;
  gradeBook: GradeBook;
  onSaveGradeBook: (updated: GradeBook) => void;
  lessonSessions: LessonSession[];
  initialMeeting?: { dateISO?: string; meetingNum?: number; tpTitle?: string };
  onSaveLessonSession?: (newSession: LessonSession) => void;
}

export const KbmHarianExpressModal: React.FC<KbmHarianExpressModalProps> = ({
  isOpen,
  onClose,
  roster,
  assignment,
  year,
  attendanceRecords,
  onSaveAttendance,
  teachingJournals,
  onSaveJournal,
  gradeBook,
  onSaveGradeBook,
  lessonSessions,
  initialMeeting,
  onSaveLessonSession,
}) => {
  if (!isOpen) return null;

  // Sesi KBM State
  const todayISO = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(initialMeeting?.dateISO || todayISO);
  const [selectedJam, setSelectedJam] = useState<string>('Jam 1 - 3 (07.15 - 09.30)');
  const [pertemuanNum, setPertemuanNum] = useState<number>(
    initialMeeting?.meetingNum ||
      lessonSessions.filter((s) => s.classId === assignment.classId).length + 1
  );

  // Active Tab for Right Column (presensi vs nilai)
  const [activeRightTab, setActiveRightTab] = useState<'presensi' | 'nilai'>('presensi');

  // Mobile Compact View & Filter States
  const [isMobileCompactView, setIsMobileCompactView] = useState<boolean>(false);
  const [studentFilter, setStudentFilter] = useState<'all' | 'absent_today' | 'warnings_only'>('all');

  // 1. Absensi State (studentId -> status)
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    roster.students.forEach((s) => {
      const existing = attendanceRecords.find(
        (r) => r.studentId === s.id && r.date === (initialMeeting?.dateISO || todayISO) && r.classId === assignment.classId
      );
      initial[s.id] = existing ? existing.status : 'present';
    });
    return initial;
  });

  // 2. Jurnal KBM State
  const [tpTitle, setTpTitle] = useState<string>(
    initialMeeting?.tpTitle ||
      'TP 7.1: Menjelaskan konsep dan sifat-sifat operasi hitung bilangan bulat & berpangkat'
  );
  const [kegiatanKbm, setKegiatanKbm] = useState<string>(
    initialMeeting?.tpTitle
      ? `Penjelasan materi ${initialMeeting.tpTitle}, diskusi kelompok interaktif, dan pengerjaan LKPD.`
      : 'Diskusi kelompok interaktif, penyelesaian LKPD 1, dan pemahaman konsep garis bilangan.'
  );
  const [catatanKejadian, setCatatanKejadian] = useState<string>('');
  const [realizationStatus, setRealizationStatus] = useState<'done' | 'continued' | 'cancelled'>('done');

  // 3. Quick Assessment State (studentId -> score)
  const [selectedKdIndex, setSelectedKdIndex] = useState<number>(1);
  const [assessmentScores, setAssessmentScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    roster.students.forEach((s) => {
      const entry = gradeBook.entries.find((e) => e.studentId === s.id);
      initial[s.id] = entry?.tugasScores?.[1] || 80;
    });
    return initial;
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Compute Early Warning Summaries
  const absenceSummaries = useMemo(() => {
    return computeStudentAbsenceSummaries(roster, attendanceRecords, assignment.classId);
  }, [roster, attendanceRecords, assignment.classId]);

  const warningCount = useMemo(() => {
    return absenceSummaries.filter((s) => s.warningLevel !== 'none').length;
  }, [absenceSummaries]);

  // Prosem & Kaldik Schedule Generator
  const prosemSchedule = useMemo(() => {
    const classGrade = assignment.classLabel.startsWith('VIII')
      ? 'VIII'
      : assignment.classLabel.startsWith('IX')
      ? 'IX'
      : 'VII';

    return generateProsemSchedule(
      year.label,
      year.semester,
      assignment.subject,
      classGrade,
      undefined,
      'Kamis',
      assignment.totalJpPerWeek || 3
    );
  }, [year.label, year.semester, assignment]);

  // Handle Prosem Meeting Selection
  const handleSelectProsemMeeting = (dateISO: string, meetingNum: number, tpText: string) => {
    setSelectedDate(dateISO);
    setPertemuanNum(meetingNum);
    setTpTitle(tpText);
    setKegiatanKbm(`Penjelasan materi ${tpText}, diskusi kelompok interaktif, dan pengerjaan LKPD.`);

    // Sync attendance state for selected date if records exist
    const updatedAtt: Record<string, AttendanceStatus> = {};
    roster.students.forEach((s) => {
      const existing = attendanceRecords.find(
        (r) => r.studentId === s.id && r.date === dateISO && r.classId === assignment.classId
      );
      updatedAtt[s.id] = existing ? existing.status : 'present';
    });
    setAttendanceState(updatedAtt);

    // Show toast
    setNotification(`✓ Memuat Pertemuan Ke-${meetingNum} (${dateISO}) & Auto-Fill Rincian KBM!`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Recalculate attendance stats
  const attStats = useMemo(() => {
    let present = 0,
      sick = 0,
      excused = 0,
      absent = 0,
      late = 0;
    Object.values(attendanceState).forEach((st) => {
      if (st === 'present') present++;
      else if (st === 'sick') sick++;
      else if (st === 'excused') excused++;
      else if (st === 'absent') absent++;
      else if (st === 'late') late++;
    });
    return { present, sick, excused, absent, late, total: roster.students.length };
  }, [attendanceState, roster.students.length]);

  // Filtered Students for Mobile / List view
  const filteredStudents = useMemo(() => {
    return roster.students.filter((st) => {
      if (studentFilter === 'absent_today') {
        const status = attendanceState[st.id] || 'present';
        return status !== 'present';
      }
      if (studentFilter === 'warnings_only') {
        const sum = absenceSummaries.find((s) => s.studentId === st.id);
        return sum && sum.warningLevel !== 'none';
      }
      return true;
    });
  }, [roster.students, studentFilter, attendanceState, absenceSummaries]);

  // Append Early Warning note directly to Catatan Kejadian in Section 2
  const handleAppendWarningToJournal = (studentName: string, msg: string) => {
    const noteText = `[PERINGATAN ABSENSI] Siswa ${studentName}: ${msg}.`;
    if (catatanKejadian.includes(studentName)) {
      setNotification(`Catatan untuk ${studentName} sudah ada pada jurnal.`);
      setTimeout(() => setNotification(null), 2000);
      return;
    }
    setCatatanKejadian((prev) => (prev ? `${prev} | ${noteText}` : noteText));
    setNotification(`✓ Ditambahkan ke Catatan Kejadian Jurnal: ${studentName}`);
    setTimeout(() => setNotification(null), 2500);
  };

  // Bulk Attendance Actions
  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    roster.students.forEach((s) => {
      updated[s.id] = 'present';
    });
    setAttendanceState(updated);
  };

  const handleToggleStudentAtt = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Bulk Grade Presets
  const handleBatchSetScores = (score: number) => {
    const updated: Record<string, number> = {};
    roster.students.forEach((s) => {
      updated[s.id] = score;
    });
    setAssessmentScores(updated);
  };

  const handleScoreChange = (studentId: string, val: number) => {
    const clamped = Math.min(100, Math.max(0, val));
    setAssessmentScores((prev) => ({
      ...prev,
      [studentId]: clamped,
    }));
  };

  // Export handlers
  const handleExportExcel = async () => {
    try {
      await exportKbmToExcel({
        assignment,
        year,
        roster,
        journals: teachingJournals,
        records: attendanceRecords,
      });
      setNotification('✓ Laporan KBM & Absensi berhasil diekspor ke File Excel!');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert('Gagal mengekspor file Excel.');
    }
  };

  const handlePrintPdfDoc = () => {
    printKbmReportDoc({
      assignment,
      year,
      roster,
      journals: teachingJournals,
      records: attendanceRecords,
    });
  };

  // Save All KBM Data (1-Click Sync)
  const handleSaveAll = () => {
    // 1. Sync Attendance
    const newAttRecords: AttendanceRecord[] = [...attendanceRecords];
    roster.students.forEach((s) => {
      const existingIdx = newAttRecords.findIndex(
        (r) => r.studentId === s.id && r.date === selectedDate && r.classId === assignment.classId
      );
      const st = attendanceState[s.id] || 'present';
      if (existingIdx >= 0) {
        newAttRecords[existingIdx] = { ...newAttRecords[existingIdx], status: st };
      } else {
        newAttRecords.push({
          id: `att-${Date.now()}-${s.id}`,
          studentId: s.id,
          classId: assignment.classId,
          date: selectedDate,
          status: st,
        });
      }
    });
    onSaveAttendance(newAttRecords);

    // 2. Sync Journal & Lesson Session
    const journalSessionId = `session-${assignment.classId}-${selectedDate}`;
    
    if (onSaveLessonSession) {
      const existingSession = lessonSessions.find(
        (s) => s.classId === assignment.classId && s.date === selectedDate
      );
      if (!existingSession) {
        onSaveLessonSession({
          id: journalSessionId,
          date: selectedDate,
          startPeriod: 1,
          durationJP: assignment.totalJpPerWeek || 3,
          subject: assignment.subject,
          classId: assignment.classId,
          semester: year.semester,
        });
      }
    }

    const newJournal: TeachingJournal = {
      id: `jrn-${Date.now()}`,
      sessionId: journalSessionId,
      classId: assignment.classId,
      subject: assignment.subject,
      semester: year.semester,
      date: selectedDate,
      plannedMaterialTitle: tpTitle,
      actualMaterialTitle: kegiatanKbm,
      realizationStatus,
      note: catatanKejadian || undefined,
    };
    onSaveJournal(newJournal);

    // 3. Sync GradeBook
    const updatedEntries = gradeBook.entries.map((entry) => {
      const currentTugas = { ...(entry.tugasScores || {}) };
      const currentUlangan = { ...(entry.ulanganScores || {}) };

      if (assessmentScores[entry.studentId] !== undefined) {
        currentTugas[selectedKdIndex] = assessmentScores[entry.studentId];
      }

      const finalKDScores: Record<number, number> = {};
      let sumKD = 0;
      for (let i = 1; i <= gradeBook.kdCount; i++) {
        const u = currentUlangan[i] ?? 75;
        const t = currentTugas[i] ?? 80;
        finalKDScores[i] = Math.round((u + t) / 2);
        sumKD += finalKDScores[i];
      }

      const avgKD = sumKD / (gradeBook.kdCount || 1);
      const pts = entry.pts ?? 80;
      const pas = entry.pas ?? 85;
      const finalScore = Math.round((avgKD + pts + pas) / 3);

      return {
        ...entry,
        tugasScores: currentTugas,
        finalKDScores,
        finalScore,
      };
    });

    onSaveGradeBook({
      ...gradeBook,
      entries: updatedEntries,
    });

    setNotification('Data KBM Harian berhasil disimpan & disinkronkan ke Absensi, Jurnal, dan Ledger Nilai.');
    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-3.5 px-5 flex items-center justify-between border-b border-slate-800 shrink-0 gap-3">
          <div className="flex items-center gap-3 truncate">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl shadow-xs shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 truncate">
                  Input Express KBM · Kelas {assignment.classLabel} ({assignment.subject})
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                Pengisian KBM Harian (Presensi, Jurnal & Nilai Formatif)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Action Buttons for Export */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
              title="Ekspor Laporan KBM Ke Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={handlePrintPdfDoc}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
              title="Cetak Laporan PDF / E-Kinerja"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Structured 2-Column Grid with Explicit Sections */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 bg-slate-50/70 space-y-4">
          {notification && (
            <div className="p-3 bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification}</span>
            </div>
          )}

          {/* ── TOP MASTER CONTROL BANNER: PILIH PERTEMUAN PROSEM & DETIL SESI ── */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-xl p-3.5 sm:p-4 shadow-xs border border-blue-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-blue-200 uppercase tracking-wide">
                    Pilih Pertemuan (Prosem & Kaldik)
                  </h3>
                  <p className="text-[10px] text-blue-300/80">
                    Pilih pekan KBM untuk otomatis mengisi Tanggal, Pertemuan Ke-, dan Judul TP
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs shrink-0">
                {warningCount > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Early Warning: {warningCount} Siswa</span>
                  </span>
                )}
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black shadow-2xs">
                  ⚡ Auto-Fill Mode
                </span>
                <span className="text-[10px] bg-blue-950 text-blue-200 border border-blue-700 px-2 py-0.5 rounded font-medium hidden sm:inline-block">
                  Thn {year.label} (Sem {year.semester})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Dropdown Pertemuan Prosem */}
              <div className="md:col-span-6">
                <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Jadwal Pertemuan Prosem
                </label>
                <select
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const [dIso, mNumStr] = e.target.value.split('|');
                    const mNum = parseInt(mNumStr, 10);
                    const found = prosemSchedule.find((item) => item.dateISO === dIso);
                    if (found) {
                      handleSelectProsemMeeting(dIso, mNum, `[${found.tpCode}] ${found.tpTitle}`);
                    }
                  }}
                  value={`${selectedDate}|${pertemuanNum}`}
                  className="w-full px-2.5 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-lg text-xs font-bold focus:ring-2 focus:ring-amber-400 outline-none"
                >
                  <option value="">-- Pilih Pertemuan dari Prosem --</option>
                  {prosemSchedule.map((m, idx) => {
                    const isKbm = m.status === 'kbm';
                    const hasRecords = attendanceRecords.some(
                      (r) => r.classId === assignment.classId && r.date === m.dateISO
                    );

                    if (!isKbm) {
                      return (
                        <option key={`${m.dateISO}-${idx}`} value="" disabled className="text-slate-500 bg-slate-900">
                          [{m.dateFormatted}] • {m.tpTitle} (Non-KBM)
                        </option>
                      );
                    }

                    return (
                      <option
                        key={`${m.dateISO}-${idx}`}
                        value={`${m.dateISO}|${m.meetingNumber}`}
                        className="bg-slate-900 text-white font-medium"
                      >
                        [Prt {m.meetingNumber}] {m.dateFormatted} • {m.tpCode}: {m.tpTitle.substring(0, 35)}... {hasRecords ? '✓' : '⏳'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Tanggal KBM */}
              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Tanggal KBM
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              {/* Jam & Pertemuan Ke- */}
              <div className="md:col-span-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                    Jam Ke-
                  </label>
                  <select
                    value={selectedJam}
                    onChange={(e) => setSelectedJam(e.target.value)}
                    className="w-full px-1.5 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-lg text-[11px] font-semibold focus:ring-2 focus:ring-amber-400 outline-none"
                  >
                    <option value="Jam 1 - 3 (07.15 - 09.30)">Jam 1-3</option>
                    <option value="Jam 4 - 5 (09.45 - 11.15)">Jam 4-5</option>
                    <option value="Jam 6 - 8 (11.45 - 14.00)">Jam 6-8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                    Pert. Ke
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={36}
                    value={pertemuanNum}
                    onChange={(e) => setPertemuanNum(parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* ── SECTION 1 (7/12): PRESENSI & NILAI SISWA (ABSEN DULU) ── */}
            <div className="lg:col-span-7 space-y-4">
              {/* Section Title Banner */}
              <div className="bg-emerald-950 text-white p-2.5 px-3 rounded-xl border border-emerald-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-black text-[11px] flex items-center justify-center">1</span>
                  <div>
                    <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">SECTION 1: PRESENSI & ASSESMEN SISWA</h3>
                    <p className="text-[10px] text-emerald-200/80">Input Absensi Dulu & Formatif TP</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                    Hadir: {attStats.present}/{attStats.total}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
                {/* Tab Navigation for Section 1 */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-100 p-2 gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveRightTab('presensi')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeRightTab === 'presensi'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>1. Presensi Kehadiran Siswa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRightTab('nilai')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeRightTab === 'nilai'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>2. Nilai Formatif TP</span>
                    </button>
                  </div>

                  {activeRightTab === 'presensi' ? (
                    <div className="flex items-center gap-1">
                      {/* Compact Mode Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsMobileCompactView(!isMobileCompactView)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-all ${
                          isMobileCompactView
                            ? 'bg-amber-400 text-slate-950 border-amber-500'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
                        }`}
                        title="Toggle Tampilan Ringkas Mobile / HP"
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>{isMobileCompactView ? 'Mode HP On' : 'Mode HP'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleMarkAllPresent}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3 h-3" />
                        <span>Reset Hadir</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-500">Preset:</span>
                      <button
                        type="button"
                        onClick={() => handleBatchSetScores(80)}
                        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[10px] font-bold"
                      >
                        80
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchSetScores(85)}
                        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[10px] font-bold"
                      >
                        85
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchSetScores(90)}
                        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[10px] font-bold"
                      >
                        90
                      </button>
                    </div>
                  )}
                </div>

                {/* Tab 1: Presensi Content */}
                {activeRightTab === 'presensi' && (
                  <div className="p-3 sm:p-4 flex-1 flex flex-col space-y-3">
                    {/* Summary Bar & Quick Filters */}
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 shrink-0 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-medium flex-wrap gap-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-emerald-700 font-bold">Hadir: {attStats.present}</span>
                          <span className="text-amber-700 font-bold">Sakit: {attStats.sick}</span>
                          <span className="text-sky-700 font-bold">Izin: {attStats.excused}</span>
                          <span className="text-red-700 font-bold">Alpa: {attStats.absent}</span>
                          <span className="text-purple-700 font-bold">Terlambat: {attStats.late}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px]">Total: {attStats.total}</span>
                      </div>

                      {/* Quick Filter Bar for Smartphone & Fast Classroom Usage */}
                      <div className="flex items-center gap-1 pt-1 border-t border-slate-200 text-[10px]">
                        <span className="text-slate-500 font-bold flex items-center gap-0.5">
                          <Filter className="w-3 h-3 text-slate-400" /> Filter:
                        </span>
                        <button
                          type="button"
                          onClick={() => setStudentFilter('all')}
                          className={`px-2 py-0.5 rounded font-bold transition-colors ${
                            studentFilter === 'all'
                              ? 'bg-slate-800 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Semua ({roster.students.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudentFilter('absent_today')}
                          className={`px-2 py-0.5 rounded font-bold transition-colors ${
                            studentFilter === 'absent_today'
                              ? 'bg-amber-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Tidak Hadir Hari Ini ({attStats.total - attStats.present})
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudentFilter('warnings_only')}
                          className={`px-2 py-0.5 rounded font-bold transition-colors flex items-center gap-1 ${
                            studentFilter === 'warnings_only'
                              ? 'bg-rose-700 text-white'
                              : 'bg-white border border-slate-200 text-rose-700 hover:bg-rose-50'
                          }`}
                        >
                          <ShieldAlert className="w-3 h-3" />
                          <span>Peringatan ⚠️ ({warningCount})</span>
                        </button>
                      </div>
                    </div>

                    {/* Student List (Normal vs Compact Mobile Mode) */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 max-h-80 pr-1">
                      {filteredStudents.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400 italic bg-slate-50 rounded-lg border border-slate-200">
                          Tidak ada siswa yang sesuai filter pilihan.
                        </div>
                      ) : (
                        filteredStudents.map((st) => {
                          const currentStatus = attendanceState[st.id] || 'present';
                          const sum = absenceSummaries.find((s) => s.studentId === st.id);
                          const hasWarning = sum && sum.warningLevel !== 'none';

                          if (isMobileCompactView) {
                            {/* 📱 COMPACT MOBILE MODE (Ultra 1-row touch buttons for HP) */}
                            return (
                              <div
                                key={st.id}
                                className={`p-1.5 px-2 bg-white border rounded-lg flex items-center justify-between gap-1.5 text-xs transition-colors shadow-2xs ${
                                  hasWarning ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <div className="truncate flex items-center gap-1.5 flex-1 min-w-0">
                                  <span className="text-[10px] text-slate-400 font-mono w-4 shrink-0">#{st.number}</span>
                                  <span className="font-bold text-slate-800 truncate text-[11px]">{st.name}</span>
                                  {hasWarning && sum && (
                                    <span
                                      className={`px-1 py-0.2 rounded text-[9px] font-bold text-white shrink-0 ${
                                        sum.warningLevel === 'danger' ? 'bg-rose-600' : 'bg-amber-600'
                                      }`}
                                      title={sum.warningMessage}
                                    >
                                      {sum.absentCount > 0 ? `${sum.absentCount}xA` : `${sum.totalNonPresent}xAbs`}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {(
                                    [
                                      { key: 'present', label: 'H', activeClass: 'bg-emerald-600 text-white' },
                                      { key: 'sick', label: 'S', activeClass: 'bg-amber-600 text-white' },
                                      { key: 'excused', label: 'I', activeClass: 'bg-sky-600 text-white' },
                                      { key: 'absent', label: 'A', activeClass: 'bg-red-600 text-white' },
                                      { key: 'late', label: 'T', activeClass: 'bg-purple-600 text-white' },
                                    ] as const
                                  ).map((opt) => (
                                    <button
                                      key={opt.key}
                                      type="button"
                                      onClick={() => handleToggleStudentAtt(st.id, opt.key)}
                                      className={`w-7 h-7 rounded-lg font-bold text-xs transition-all ${
                                        currentStatus === opt.key
                                          ? `${opt.activeClass} shadow-xs scale-105 ring-1 ring-black/10`
                                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          {/* 🖥️ STANDARD VIEW */}
                          return (
                            <div
                              key={st.id}
                              className={`p-2 bg-slate-50/80 hover:bg-slate-100 border rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs transition-colors ${
                                hasWarning ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                              }`}
                            >
                              <div className="truncate flex items-center gap-2 flex-1">
                                <span className="text-[10px] text-slate-400 font-mono w-5">#{st.number}</span>
                                <span className="font-semibold text-slate-800 truncate">{st.name}</span>

                                {/* Early Warning Badge */}
                                {hasWarning && sum && (
                                  <div className="flex items-center gap-1 shrink-0">
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-extrabold text-white flex items-center gap-1 shadow-2xs ${
                                        sum.warningLevel === 'danger' ? 'bg-rose-600' : 'bg-amber-600'
                                      }`}
                                      title={sum.warningMessage}
                                    >
                                      <ShieldAlert className="w-2.5 h-2.5" />
                                      <span>
                                        {sum.absentCount >= 3
                                          ? `Alpa ${sum.absentCount}x`
                                          : `Absen ${sum.totalNonPresent}x`}
                                      </span>
                                    </span>

                                    {/* Action button to insert warning to journal notes */}
                                    <button
                                      type="button"
                                      onClick={() => handleAppendWarningToJournal(st.name, sum.warningMessage)}
                                      className="px-1.5 py-0.5 bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 rounded text-[9px] font-bold transition-colors flex items-center gap-0.5"
                                      title="Tambahkan catatan peringatan ini ke Jurnal Mengajar"
                                    >
                                      <Plus className="w-2.5 h-2.5" />
                                      <span>Catat Jurnal</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {(
                                  [
                                    { key: 'present', label: 'H', activeClass: 'bg-emerald-600 text-white' },
                                    { key: 'sick', label: 'S', activeClass: 'bg-amber-600 text-white' },
                                    { key: 'excused', label: 'I', activeClass: 'bg-sky-600 text-white' },
                                    { key: 'absent', label: 'A', activeClass: 'bg-red-600 text-white' },
                                    { key: 'late', label: 'T', activeClass: 'bg-purple-600 text-white' },
                                  ] as const
                                ).map((opt) => (
                                  <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => handleToggleStudentAtt(st.id, opt.key)}
                                    className={`w-6 h-6 rounded font-bold text-[10px] transition-all ${
                                      currentStatus === opt.key
                                        ? opt.activeClass
                                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Nilai Formatif Content */}
                {activeRightTab === 'nilai' && (
                  <div className="p-4 flex-1 flex flex-col space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs shrink-0">
                      <span className="font-semibold text-slate-700">Pilih Target KD/TP:</span>
                      <select
                        value={selectedKdIndex}
                        onChange={(e) => setSelectedKdIndex(parseInt(e.target.value))}
                        className="px-2.5 py-1 bg-amber-50 border border-amber-300 text-amber-950 font-bold rounded-lg text-xs"
                      >
                        {Array.from({ length: gradeBook.kdCount }).map((_, idx) => (
                          <option key={idx + 1} value={idx + 1}>
                            KD / TP {idx + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Student Score Grid */}
                    <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 pr-1">
                      {roster.students.map((st) => (
                        <div
                          key={st.id}
                          className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-1 text-xs"
                        >
                          <span className="font-medium text-slate-700 truncate">{st.name}</span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={assessmentScores[st.id] ?? 80}
                            onChange={(e) => handleScoreChange(st.id, parseInt(e.target.value) || 0)}
                            className="w-12 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-bold text-center text-slate-900 focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── SECTION 2 (5/12): JURNAL AGENDA MENGAJAR (BARU JURNAL) ── */}
            <div className="lg:col-span-5 space-y-4">
              {/* Section Title Banner */}
              <div className="bg-slate-900 text-white p-2.5 px-3 rounded-xl border border-slate-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center">2</span>
                  <div>
                    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wide">SECTION 2: JURNAL AGENDA MENGAJAR</h3>
                    <p className="text-[10px] text-slate-300">Rincian TP, Kegiatan KBM & Catatan Kelas</p>
                  </div>
                </div>
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>

              {/* Card 2: Agenda Jurnal Mengajar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                    Agenda KBM & Materi
                  </h3>
                  <select
                    value={realizationStatus}
                    onChange={(e) => setRealizationStatus(e.target.value as any)}
                    className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-[11px] font-semibold"
                  >
                    <option value="done">Tuntas / Selesai</option>
                    <option value="continued">Dilanjutkan Pertemuan Depan</option>
                    <option value="cancelled">Tugas Mandiri / Izin</option>
                  </select>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Tujuan Pembelajaran (TP)</label>
                    <textarea
                      rows={2}
                      value={tpTitle}
                      onChange={(e) => setTpTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium resize-none focus:bg-white"
                      placeholder="Judul TP atau Pokok Bahasan..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-medium text-slate-600">Rincian Kegiatan KBM</label>
                      <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        Isi Cepat:
                      </span>
                    </div>

                    {/* Quick Fill Chips for Rincian KBM */}
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setKegiatanKbm(
                            `Penjelasan materi ${tpTitle || 'pokok'}, diskusi kelompok, dan pengerjaan LKPD.`
                          )
                        }
                        className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-[10px] font-bold transition-all"
                      >
                        ⚡ Standard KBM & LKPD
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setKegiatanKbm(
                            `Diskusi kelompok interaktif, presentasi hasil karya siswa, dan umpan balik sejawat.`
                          )
                        }
                        className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded text-[10px] font-bold transition-all"
                      >
                        🗣️ Diskusi & Presentasi
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setKegiatanKbm(
                            `Praktik mandiri / unjuk kerja laboratorium, pembimbingan individu, dan asesmen proses.`
                          )
                        }
                        className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded text-[10px] font-bold transition-all"
                      >
                        🧪 Praktik / Unjuk Kerja
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setKegiatanKbm(
                            `Review materi pertemuan sebelumnya, pengerjaan tes formatif, dan refleksi bersama.`
                          )
                        }
                        className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded text-[10px] font-bold transition-all"
                      >
                        📝 Formatif & Review
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={kegiatanKbm}
                      onChange={(e) => setKegiatanKbm(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium resize-none focus:bg-white"
                      placeholder="Deskripsi singkat kegiatan KBM..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-medium text-slate-600">Catatan Kejadian (Opsional)</label>
                      <span className="text-[10px] text-slate-500 font-bold">Preset:</span>
                    </div>

                    {/* Quick Fill Chips for Catatan Kejadian */}
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setCatatanKejadian('KBM berjalan sangat kondusif, seluruh siswa antusias.')
                        }
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[10px] font-medium"
                      >
                        ✓ Kondusif & Antusias
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCatatanKejadian('Beberapa siswa memerlukan bimbingan ekstra pada pengerjaan LKPD.')
                        }
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[10px] font-medium"
                      >
                        ⚠️ Bimbingan Ekstra
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatatanKejadian('')}
                        className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded text-[10px] font-bold"
                      >
                        ✕ Kosongkan
                      </button>
                    </div>

                    <input
                      type="text"
                      value={catatanKejadian}
                      onChange={(e) => setCatatanKejadian(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white"
                      placeholder="Misal: Bagus terlambat 15 menit..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-3.5 px-4 sm:px-6 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
              title="Ekspor Laporan KBM Ke File Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor Excel</span>
            </button>
            <button
              type="button"
              onClick={handlePrintPdfDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-800 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
              title="Cetak Laporan PDF Dokumen Administrasi / E-Kinerja"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan KBM (Sync All)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
