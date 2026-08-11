/**
 * Type definitions for Guru Admin Flow — Rekap Semester Module
 */

export interface SchoolProfile {
  name: string;
  npsn: string;
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  headmasterName: string;
  headmasterNip: string;
  logo?: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  nip: string;
  nuptk: string;
  rank: string; // e.g. "Penata Muda Tk. I / III/b"
  subject: string;
  role?: string;
  status?: string;
}

export interface AcademicYear {
  id: string;
  label: string; // e.g. "2024/2025"
  semester: 1 | 2;
  semester1Start: string;
  semester1End: string;
  semester2Start: string;
  semester2End: string;
}

export interface Student {
  id: string;
  name: string;
  nis: string;
  nisn: string;
  number: number;
  gender: 'L' | 'P';
}

export interface ClassRoster {
  classId: string;
  classLabel: string; // e.g. "VII-A"
  grade: number;
  parallel: string;
  students: Student[];
}

export interface TeachingAssignment {
  id: string;
  classId: string;
  classLabel: string;
  subject: string;
  teacherId: string;
  totalJpPerWeek: number;
}

export interface GradeEntry {
  studentId: string;
  studentName: string;
  nisn?: string;
  ulanganScores: Record<number, number>; // kdNum -> score
  tugasScores: Record<number, number>;   // kdNum -> score
  finalKDScores: Record<number, number>; // kdNum -> average score
  pts?: number;
  pas?: number;
  finalScore: number;
}

export interface GradeBook {
  id: string;
  assignmentId: string;
  classId: string;
  subject: string;
  semester: 1 | 2;
  entries: GradeEntry[];
  kdCount: number;
  isPaSplit: boolean;
}

export type AttendanceStatus = 'present' | 'sick' | 'excused' | 'late' | 'absent';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface LessonSession {
  id: string;
  date: string; // YYYY-MM-DD
  startPeriod: number;
  durationJP: number;
  subject: string;
  classId: string;
  semester: 1 | 2;
}

export interface TeachingJournal {
  id: string;
  sessionId: string;
  classId: string;
  subject: string;
  semester: 1 | 2;
  date: string;
  plannedMaterialTitle: string;
  actualMaterialTitle?: string;
  realizationStatus: 'done' | 'continued' | 'cancelled';
  note?: string;
}

/* ------------------------------------------------------------------ */
/*  Rekap Matrix Types                                                */
/* ------------------------------------------------------------------ */

export interface StudentMonthlyAttendanceRow {
  studentId: string;
  studentName: string;
  nisn?: string;
  studentNumber: number;
  statusByDate: Record<number, AttendanceStatus | null>;
  rekap: {
    sakit: number;
    izin: number;
    alpa: number;
    terlambat: number;
    hadir: number;
    jlh: number;
  };
}

export interface MonthlyAttendanceMatrix {
  month: number;
  monthName: string;
  year: number;
  daysInMonth: number;
  students: StudentMonthlyAttendanceRow[];
}

export interface MeetingAttendanceColumn {
  meetingNumber: number;
  dateISO: string;
  sessionId: string;
  durationJP: number;
  attendanceByStudent: Record<string, AttendanceStatus>;
}

export interface StudentTatapMukaRow {
  studentId: string;
  studentName: string;
  nisn?: string;
  studentNumber: number;
  totalJPAttended: number;
  lastMeetingDate: string | null;
  pts?: number;
  pas?: number;
  ket?: string;
}

export interface TatapMukaAttendanceMatrix {
  meetings: MeetingAttendanceColumn[];
  students: StudentTatapMukaRow[];
}

export interface JurnalMatrixRow {
  meetingNumber: number;
  dateISO: string;
  sessionId: string;
  startPeriod: number;
  durationJP: number;
  plannedMaterialTitle: string | null;
  actualMaterialTitle: string | null;
  realizationStatus: string | null;
  absentStudents: Array<{ name: string; reason: string }>;
  keterangan: string | null;
  note: string | null;
  hasJournal: boolean;
}

export interface JurnalMatrix {
  rows: JurnalMatrixRow[];
}

export type RekapTab = 'absensi-bulanan' | 'tatap-muka' | 'nilai' | 'jurnal' | 'prosem-schedule';
export type MainModule = 'dashboard' | 'rekap' | 'administrasi' | 'manajemen';
export type MarginPreset = 'normal' | 'rapat' | 'sedang' | 'longgar';
export type ScalePreset = 70 | 80 | 90 | 100;
export type HeaderStyleOption = 'slate' | 'navy' | 'emerald' | 'minimalist';
export type HeaderLayoutOption = 'gabung' | 'tingkat';

export type AdminDocCategory = 'semua' | 'perencanaan' | 'pelaksanaan' | 'evaluasi';

export interface AdminDocItem {
  id: string;
  code: string;
  title: string;
  category: 'perencanaan' | 'pelaksanaan' | 'evaluasi';
  categoryLabel: string;
  description: string;
  format: 'DOCX' | 'XLSX' | 'PDF' | 'FORM';
  status: 'Lengkap' | 'Draf' | 'Perlu Diisi';
  lastUpdated: string;
  jpTotal?: string;
  isFavorite?: boolean;
}

export interface CPTujuanPembelajaran {
  code: string;
  title: string;
  jp: number;
  jpIntra?: number;
  jpKo?: number;
  classGrade: 'VII' | 'VIII' | 'IX';
  semester?: 1 | 2; // 1 = Ganjil, 2 = Genap (Sesuai Buku Siswa Kemendikbud)
  rubrikSingkat?: string;
  keywords?: string;
  p5Dimensions?: string[];
  glosarium?: string;
  asesmenFormatif?: string;
  asesmenSumatif?: string;
  sequenceOrder?: number;
}

export interface CPElement {
  id: string;
  name: string;
  description: string;
  tpList: CPTujuanPembelajaran[];
}

export interface CPSubject {
  id: string;
  subjectName: string;
  phase: 'Fase D';
  skNumber: string; // e.g. "Keputusan BSKAP No. 032/H/KR/2024"
  generalDescription: string;
  elements: CPElement[];
}

export interface DocumentKopSettings {
  schoolName: string;
  npsn: string;
  address: string;
  headmasterName: string;
  headmasterNip: string;
  teacherName: string;
  teacherNip: string;
  dateLocation: string;
  logoUrl?: string;
}

