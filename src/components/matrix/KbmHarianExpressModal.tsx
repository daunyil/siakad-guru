import React, { useState, useMemo, useEffect } from 'react';
import type {
  ClassRoster,
  TeachingAssignment,
  AcademicYear,
  AttendanceRecord,
  TeachingJournal,
  GradeBook,
  LessonSession,
  AttendanceStatus,
  SchoolProfile,
  TeacherProfile,
} from '../../types';
import { generateProsemSchedule } from '../../lib/prosemScheduler';
import {
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
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Share2,
  MessageSquare,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { WhatsAppAbsentReportModal } from '../modals/WhatsAppAbsentReportModal';

interface KbmHarianExpressModalProps {
  isOpen: boolean;
  onClose: () => void;
  roster: ClassRoster;
  assignment: TeachingAssignment;
  assignments?: TeachingAssignment[];
  rosters?: ClassRoster[];
  onSelectAssignment?: (assignmentId: string) => void;
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
  school?: SchoolProfile;
  teacher?: TeacherProfile;
}

export const KbmHarianExpressModal: React.FC<KbmHarianExpressModalProps> = ({
  isOpen,
  onClose,
  roster,
  assignment,
  assignments,
  rosters,
  onSelectAssignment,
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
  school,
  teacher,
}) => {
  // WhatsApp Absent Report Modal state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);

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

  // Accordion State: 'absen' is open by default, 'jurnal' is closed. Opening jurnal closes absen.
  const [activeAccordion, setActiveAccordion] = useState<'absen' | 'jurnal'>('absen');

  // Filter State
  const [studentFilter, setStudentFilter] = useState<'all' | 'absent_today'>('all');

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
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // Sync attendance state & scores whenever selected assignment/roster/class changes
  useEffect(() => {
    const updatedAtt: Record<string, AttendanceStatus> = {};
    roster.students.forEach((s) => {
      const existing = attendanceRecords.find(
        (r) => r.studentId === s.id && r.date === selectedDate && r.classId === assignment.classId
      );
      updatedAtt[s.id] = existing ? existing.status : 'present';
    });
    setAttendanceState(updatedAtt);

    const initialScores: Record<string, number> = {};
    roster.students.forEach((s) => {
      const entry = gradeBook.entries.find((e) => e.studentId === s.id);
      initialScores[s.id] = entry?.tugasScores?.[selectedKdIndex] || 80;
    });
    setAssessmentScores(initialScores);

    if (!initialMeeting?.meetingNum) {
      setPertemuanNum(
        lessonSessions.filter((s) => s.classId === assignment.classId).length + 1
      );
    }
  }, [assignment.id, assignment.classId, roster.classId, selectedDate]);

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

  // Absent students list for WhatsApp report
  const absentStudentsList = useMemo(() => {
    return roster.students
      .filter((s) => attendanceState[s.id] && attendanceState[s.id] !== 'present')
      .map((s) => ({
        studentId: s.id,
        name: s.name,
        nisn: s.nisn,
        number: s.number,
        status: (attendanceState[s.id] || 'absent') as 'sick' | 'excused' | 'absent' | 'late',
        date: selectedDate,
      }));
  }, [roster.students, attendanceState, selectedDate]);

  // Filtered Students for Mobile / List view
  const filteredStudents = useMemo(() => {
    return roster.students.filter((st) => {
      if (studentFilter === 'absent_today') {
        const status = attendanceState[st.id] || 'present';
        return status !== 'present';
      }
      return true;
    });
  }, [roster.students, studentFilter, attendanceState]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-3.5 px-5 flex items-center justify-between border-b border-slate-800 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl shadow-xs shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-300">
                  Input Express KBM ·
                </span>
                <span className="text-xs font-extrabold text-amber-300">
                  Kelas {assignment.classLabel} ({assignment.subject})
                </span>
                {assignments && assignments.length > 1 && onSelectAssignment && (
                  <select
                    value={assignment.id}
                    onChange={(e) => onSelectAssignment(e.target.value)}
                    className="bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold rounded px-2 py-0.5 focus:ring-1 focus:ring-amber-400 outline-none cursor-pointer"
                    title="Pilih Kelas Lain"
                  >
                    {assignments.map((asg) => (
                      <option key={asg.id} value={asg.id} className="bg-slate-900 text-white font-medium">
                        Kelas {asg.classLabel} • {asg.subject}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                Pengisian KBM Harian (Presensi, Jurnal & Nilai Formatif)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Tutup Jendela"
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

          {/* ── TOP MASTER CONTROL BANNER: PILIH KELAS, PERTEMUAN PROSEM & DETIL SESI ── */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-xl p-3.5 sm:p-4 shadow-xs border border-blue-800 space-y-3">
            
            {/* ── BARIS PILIH KELAS / ROMBEL ── */}
            <div className="p-2.5 sm:p-3 bg-slate-900/90 border border-blue-700/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/30 shrink-0">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300">
                      PILIH KELAS / ROMBEL KBM
                    </span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded font-semibold">
                      {roster.students.length} Siswa Terdaftar
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    Kelas Aktif: <span className="text-amber-300 font-black">Kelas {assignment.classLabel}</span> · {assignment.subject}
                  </div>
                </div>
              </div>

              {assignments && assignments.length > 0 && onSelectAssignment && (
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 shadow-xs">
                    <label htmlFor="kbm-class-select" className="text-[11px] font-bold text-amber-300 shrink-0 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Pilih Kelas:</span>
                    </label>
                    <select
                      id="kbm-class-select"
                      value={assignment.id}
                      onChange={(e) => onSelectAssignment(e.target.value)}
                      className="bg-transparent text-white font-extrabold text-xs focus:ring-1 focus:ring-amber-400 outline-none cursor-pointer pr-1"
                    >
                      {assignments.map((asg) => (
                        <option key={asg.id} value={asg.id} className="bg-slate-900 text-white font-semibold">
                          Kelas {asg.classLabel} ({asg.subject})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fast Class Pill Buttons */}
                  <div className="flex items-center gap-1">
                    {assignments.map((asg) => {
                      const isSelected = asg.id === assignment.id;
                      return (
                        <button
                          key={asg.id}
                          type="button"
                          onClick={() => onSelectAssignment(asg.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs scale-105'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                          }`}
                          title={`Beralih ke Kelas ${asg.classLabel}`}
                        >
                          {asg.classLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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

              {/* Pertemuan Ke- (tanpa Jam Ke) */}
              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Pertemuan Ke-
                </label>
                <input
                  type="number"
                  min={1}
                  max={36}
                  value={pertemuanNum}
                  onChange={(e) => setPertemuanNum(parseInt(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* ── ACCORDION CONTAINER (DEFAULT: ABSEN TERBUKA, JURNAL TERTUTUP) ── */}
          <div className="space-y-3">
            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ACCORDION 1: PRESENSI & NILAI SISWA (DEFAULT: OPEN)           */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                activeAccordion === 'absen'
                  ? 'border-emerald-500 bg-white shadow-md ring-1 ring-emerald-500/20'
                  : 'border-slate-200 bg-white/80 hover:border-emerald-300 hover:bg-white shadow-2xs'
              }`}
            >
              {/* Accordion 1 Header Button */}
              <button
                type="button"
                onClick={() => setActiveAccordion('absen')}
                className={`w-full p-3.5 px-4 flex items-center justify-between text-left transition-colors ${
                  activeAccordion === 'absen'
                    ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-b border-emerald-800'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                      activeAccordion === 'absen'
                        ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    1
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-xs sm:text-sm font-extrabold tracking-tight ${
                          activeAccordion === 'absen' ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        1. Presensi Kehadiran & Nilai Formatif Siswa
                      </h3>
                      {activeAccordion === 'absen' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Sedang Aktif
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] truncate ${
                        activeAccordion === 'absen' ? 'text-emerald-200/90' : 'text-slate-500'
                      }`}
                    >
                      Hadir: <strong className="text-emerald-400">{attStats.present}</strong> / {attStats.total} Siswa · Sakit: <strong>{attStats.sick}</strong> · Izin: <strong>{attStats.excused}</strong> · Alpa: <strong>{attStats.absent}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border hidden sm:flex items-center gap-1 ${
                      activeAccordion === 'absen'
                        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    <span>{activeAccordion === 'absen' ? 'Tutup Absen' : 'Buka Absen'}</span>
                  </span>
                  <div
                    className={`p-1.5 rounded-lg transition-transform duration-200 ${
                      activeAccordion === 'absen'
                        ? 'bg-emerald-500/20 text-emerald-300 rotate-180'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Accordion 1 Body (Expanded when activeAccordion === 'absen') */}
              {activeAccordion === 'absen' && (
                <div className="p-3 sm:p-4 space-y-4 animate-in fade-in duration-150">
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
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleMarkAllPresent}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                            title="Tandai Seluruh Siswa Hadir (100% Kehadiran)"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>⚡ Hadir Semua (100%)</span>
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
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 shrink-0 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-medium flex-wrap gap-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Hadir: {attStats.present}
                              </span>
                              <span className="text-amber-700 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Sakit: {attStats.sick}
                              </span>
                              <span className="text-sky-700 font-extrabold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                                Izin: {attStats.excused}
                              </span>
                              <span className="text-red-700 font-extrabold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                Alpa: {attStats.absent}
                              </span>
                              <span className="text-purple-700 font-extrabold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                Terlambat: {attStats.late}
                              </span>
                            </div>
                            <span className="text-slate-500 font-mono text-[11px] font-bold">
                              Total: {attStats.total} Siswa
                            </span>
                          </div>

                          {/* Quick Filter Bar for Smartphone & Fast Classroom Usage */}
                          <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200 text-[10px] flex-wrap">
                            <span className="text-slate-500 font-bold flex items-center gap-0.5">
                              <Filter className="w-3 h-3 text-slate-400" /> Filter:
                            </span>
                            <button
                              type="button"
                              onClick={() => setStudentFilter('all')}
                              className={`px-2 py-0.5 rounded font-bold transition-colors ${
                                studentFilter === 'all'
                                  ? 'bg-slate-800 text-white shadow-2xs'
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
                                  ? 'bg-amber-600 text-white shadow-2xs'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              Tidak Hadir ({attStats.total - attStats.present})
                            </button>
                          </div>
                        </div>

                        {/* Student List */}
                        <div className="flex-1 overflow-y-auto space-y-1.5 max-h-80 sm:max-h-96 pr-1">
                          {filteredStudents.length === 0 ? (
                            <div className="text-center py-8 text-xs text-slate-400 italic bg-slate-50 rounded-xl border border-slate-200">
                              Tidak ada siswa yang sesuai filter pilihan.
                            </div>
                          ) : (
                            filteredStudents.map((st) => {
                              const currentStatus = attendanceState[st.id] || 'present';
                              const isNonPresent = currentStatus !== 'present';

                              return (
                                <div
                                  key={st.id}
                                  className={`p-2 px-3 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                                    isNonPresent
                                      ? 'border-amber-300 bg-amber-50/50 shadow-2xs'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  {/* Left: Number + Student Name (Clean, legible, dark text) */}
                                  <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-1">
                                    <span className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                                      {st.number || '•'}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <span className="font-extrabold text-slate-950 text-xs sm:text-sm leading-snug break-words block">
                                        {st.name}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-mono block">
                                        NISN: {st.nisn || '-'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Right: Compact buttons H S I A T */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    {(
                                      [
                                        { key: 'present', label: 'H', activeClass: 'bg-emerald-600 text-white ring-1 ring-emerald-700' },
                                        { key: 'sick', label: 'S', activeClass: 'bg-amber-500 text-slate-950 font-black ring-1 ring-amber-600' },
                                        { key: 'excused', label: 'I', activeClass: 'bg-sky-600 text-white ring-1 ring-sky-700' },
                                        { key: 'absent', label: 'A', activeClass: 'bg-rose-600 text-white ring-1 ring-rose-700' },
                                        { key: 'late', label: 'T', activeClass: 'bg-purple-600 text-white ring-1 ring-purple-700' },
                                      ] as const
                                    ).map((opt) => (
                                      <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => handleToggleStudentAtt(st.id, opt.key)}
                                        className={`w-7 h-7 sm:w-8 sm:h-7.5 rounded-lg font-black text-xs transition-all flex items-center justify-center cursor-pointer ${
                                          currentStatus === opt.key
                                            ? `${opt.activeClass} shadow-xs scale-105`
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                        title={`${st.name}: Status ${opt.label}`}
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

                    {/* Tab 2: Nilai Formatif Content (Clear, high-contrast, fully visible names) */}
                    {activeRightTab === 'nilai' && (
                      <div className="p-3 sm:p-4 flex-1 flex flex-col space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs shrink-0 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">Target KD / Tujuan Pembelajaran:</span>
                            <select
                              value={selectedKdIndex}
                              onChange={(e) => setSelectedKdIndex(parseInt(e.target.value))}
                              className="px-3 py-1 bg-amber-50 border border-amber-300 text-amber-950 font-bold rounded-lg text-xs"
                            >
                              {Array.from({ length: gradeBook.kdCount }).map((_, idx) => (
                                <option key={idx + 1} value={idx + 1}>
                                  KD / TP {idx + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            KKTP Standar: <strong className="text-slate-800">75</strong>
                          </span>
                        </div>

                        {/* Student Score List (2-column layout with full names & clear inputs) */}
                        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-80 sm:max-h-96 pr-1">
                          {roster.students.map((st) => {
                            const score = assessmentScores[st.id] ?? 80;
                            const isTuntas = score >= 75;

                            return (
                              <div
                                key={st.id}
                                className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs transition-colors"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <span className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                                    {st.number || '•'}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <span className="font-extrabold text-slate-950 text-xs sm:text-[13px] leading-snug break-words block">
                                      {st.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono block">
                                      NISN: {st.nisn || '-'}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span
                                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border hidden sm:inline-block ${
                                      isTuntas
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}
                                  >
                                    {isTuntas ? 'Tuntas' : 'Remedial'}
                                  </span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={score}
                                    onChange={(e) => handleScoreChange(st.id, parseInt(e.target.value) || 0)}
                                    className="w-14 px-2 py-1.5 bg-amber-50/70 border border-amber-300 rounded-lg font-black text-center text-slate-950 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Action to proceed to Jurnal or Share WhatsApp */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-emerald-900 font-medium">
                      Presensi siswa terisi: <strong className="text-emerald-700">{attStats.present} Hadir</strong>,{' '}
                      <span className="font-bold text-rose-600">{attStats.total - attStats.present} Tidak Hadir</span>.
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setIsWhatsAppModalOpen(true)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                        title="Kirim Laporan Presensi Siswa ke WhatsApp Grup / Wali Kelas"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Lapor WA ke Wali Kelas</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveAccordion('jurnal')}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                      >
                        <span>Lanjut Isi Jurnal Mengajar</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ACCORDION 2: JURNAL AGENDA MENGAJAR (DEFAULT: CLOSED)         */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                activeAccordion === 'jurnal'
                  ? 'border-indigo-500 bg-white shadow-md ring-1 ring-indigo-500/20'
                  : 'border-slate-200 bg-white/80 hover:border-indigo-300 hover:bg-white shadow-2xs'
              }`}
            >
              {/* Accordion 2 Header Button */}
              <button
                type="button"
                onClick={() => setActiveAccordion('jurnal')}
                className={`w-full p-3.5 px-4 flex items-center justify-between text-left transition-colors ${
                  activeAccordion === 'jurnal'
                    ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-800'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                      activeAccordion === 'jurnal'
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    2
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-xs sm:text-sm font-extrabold tracking-tight ${
                          activeAccordion === 'jurnal' ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        2. Jurnal Agenda Mengajar & Rincian KBM
                      </h3>
                      {activeAccordion === 'jurnal' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          Sedang Aktif
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] truncate ${
                        activeAccordion === 'jurnal' ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      Status: <strong className="text-amber-400">{realizationStatus === 'done' ? 'Tuntas / Selesai' : realizationStatus === 'continued' ? 'Lanjut Pertemuan Depan' : 'Tugas Mandiri'}</strong> · TP: {tpTitle || 'Belum diisi'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border hidden sm:flex items-center gap-1 ${
                      activeAccordion === 'jurnal'
                        ? 'bg-amber-400/20 text-amber-200 border-amber-400/40'
                        : 'bg-white text-slate-600 border-slate-300'
                    }`}
                  >
                    <span>{activeAccordion === 'jurnal' ? 'Tutup Jurnal' : 'Buka Jurnal'}</span>
                  </span>
                  <div
                    className={`p-1.5 rounded-lg transition-transform duration-200 ${
                      activeAccordion === 'jurnal'
                        ? 'bg-amber-400/20 text-amber-300 rotate-180'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Accordion 2 Body (Expanded when activeAccordion === 'jurnal') */}
              {activeAccordion === 'jurnal' && (
                <div className="p-3 sm:p-4 space-y-4 animate-in fade-in duration-150">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                        Agenda KBM & Materi
                      </h3>
                      <select
                        value={realizationStatus}
                        onChange={(e) => setRealizationStatus(e.target.value as any)}
                        className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-xs font-bold"
                      >
                        <option value="done">✓ Tuntas / Selesai</option>
                        <option value="continued">⏳ Dilanjutkan Pertemuan Depan</option>
                        <option value="cancelled">📝 Tugas Mandiri / Izin</option>
                      </select>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Tujuan Pembelajaran (TP)
                        </label>
                        <textarea
                          rows={2}
                          value={tpTitle}
                          onChange={(e) => setTpTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium resize-none focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                          placeholder="Judul TP atau Pokok Bahasan..."
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-slate-700">Rincian Kegiatan KBM</label>
                          <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" />
                            Isi Cepat:
                          </span>
                        </div>

                        {/* Quick Fill Chips for Rincian KBM */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setKegiatanKbm(
                                `Penjelasan materi ${tpTitle || 'pokok'}, diskusi kelompok, dan pengerjaan LKPD.`
                              )
                            }
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[10.5px] font-bold transition-all"
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
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-[10.5px] font-bold transition-all"
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
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all"
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
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-[10.5px] font-bold transition-all"
                          >
                            📝 Formatif & Review
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={kegiatanKbm}
                          onChange={(e) => setKegiatanKbm(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium resize-none focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                          placeholder="Deskripsi singkat kegiatan KBM..."
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-slate-700">Catatan Kejadian (Opsional)</label>
                          <span className="text-[10px] text-slate-500 font-bold">Preset:</span>
                        </div>

                        {/* Quick Fill Chips for Catatan Kejadian */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <button
                            type="button"
                            onClick={() =>
                              setCatatanKejadian('KBM berjalan sangat kondusif, seluruh siswa antusias.')
                            }
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10.5px] font-medium"
                          >
                            ✓ Kondusif & Antusias
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCatatanKejadian('Beberapa siswa memerlukan bimbingan ekstra pada pengerjaan LKPD.')
                            }
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10.5px] font-medium"
                          >
                            ⚠️ Bimbingan Ekstra
                          </button>
                          <button
                            type="button"
                            onClick={() => setCatatanKejadian('')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-[10.5px] font-bold"
                          >
                            ✕ Kosongkan
                          </button>
                        </div>

                        <input
                          type="text"
                          value={catatanKejadian}
                          onChange={(e) => setCatatanKejadian(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                          placeholder="Misal: Bagus terlambat 15 menit..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Navigation Back & Direct Save */}
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveAccordion('absen')}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Kembali ke Presensi Siswa</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAll}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Seluruh KBM (Sync All)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Slim Modal Footer */}
        <div className="py-2.5 px-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Kirim Rekapitulasi Presensi ke WhatsApp Grup / Wali Kelas"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Lapor WA</span>
            </button>

            {/* Compact Secondary Export Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                title="Opsi Ekspor Laporan Excel / PDF"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Ekspor...</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showExportMenu && (
                <div className="absolute bottom-full left-0 mb-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 min-w-[170px] space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[9px] font-extrabold uppercase px-2 py-1 text-slate-400">
                    Arsip Dokumen KBM
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      handleExportExcel();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg font-medium text-left transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ekspor ke Excel (.xlsx)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      handlePrintPdfDoc();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-800 rounded-lg font-medium text-left transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-sky-600" />
                    <span>Cetak / PDF Dokumen</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-black rounded-lg text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan KBM</span>
            </button>
          </div>
        </div>

        {/* ── MODAL LAPORAN WHATSAPP SISWA ABSEN ── */}
        <WhatsAppAbsentReportModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          school={school}
          teacher={teacher}
          assignment={assignment}
          roster={roster}
          absentStudents={absentStudentsList}
          attendanceStats={{
            present: attStats.present,
            sick: attStats.sick,
            excused: attStats.excused,
            absent: attStats.absent,
            total: attStats.total,
          }}
        />
      </div>
    </div>
  );
};
