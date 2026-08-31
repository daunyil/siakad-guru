/**
 * Sample dataset for SMP Negeri 8 Bantan (Guru Admin Flow)
 * Contains school profile, teacher profile, academic year, rosters,
 * assignments, gradebooks, attendance, sessions, and journals.
 */

import type {
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
  ClassRoster,
  TeachingAssignment,
  GradeBook,
  AttendanceRecord,
  LessonSession,
  TeachingJournal,
} from '../types';

export const initialSchoolProfile: SchoolProfile = {
  name: 'SMP NEGERI 8 BANTAN',
  npsn: '10401234',
  address: 'Jl. Utama Muntai, Kec. Bantan',
  village: 'Muntai',
  district: 'Bantan',
  regency: 'Bengkalis',
  province: 'Riau',
  headmasterName: 'H. AMIRUDDIN, S.Pd., M.Pd.',
  headmasterNip: '19680512 199403 1 005',
  logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=120&q=80',
};

export const initialTeacherProfile: TeacherProfile = {
  id: 'teacher-1',
  name: 'DRA. SITI RAHMAH, M.Pd.',
  nip: '19750820 200212 2 003',
  nuptk: '453275328900012',
  rank: 'Penata Tk. I / III/d',
  subject: 'Matematika',
  role: 'Guru Utama & Wali Kelas VII-B',
  status: 'PNS',
};

export const sampleTeachersList: TeacherProfile[] = [
  initialTeacherProfile,
  {
    id: 'teacher-2',
    name: 'H. AMIRUDDIN, S.Pd., M.Pd.',
    nip: '19680512 199403 1 005',
    nuptk: '344574628900011',
    rank: 'Pembina Utama Muda / IV/c',
    subject: 'Informatika',
    role: 'Kepala Sekolah',
    status: 'PNS',
  },
  {
    id: 'teacher-3',
    name: 'DRS. BAMBANG SUPRIADI',
    nip: '19710315 199802 1 002',
    nuptk: '512374928900088',
    rank: 'Penata Tk. I / III/d',
    subject: 'IPA (Sains)',
    role: 'Guru Mapel IPA',
    status: 'PNS',
  },
  {
    id: 'teacher-4',
    name: 'TRI WAHYUNI, S.Pd.',
    nip: '19820410 200901 2 008',
    nuptk: '123475928900044',
    rank: 'Penata / III/c',
    subject: 'Bahasa Indonesia',
    role: 'Wali Kelas VII-A',
    status: 'PPPK',
  },
  {
    id: 'teacher-5',
    name: 'AHMAD HIDAYAT, S.Ag.',
    nip: '19800101 200604 1 012',
    nuptk: '678975928900055',
    rank: 'Penata / III/c',
    subject: 'Pendidikan Agama Islam',
    role: 'Guru PAI & Bimbingan Konseling',
    status: 'PNS',
  },
];

export const initialAcademicYear: AcademicYear = {
  id: 'ay-2024-2025',
  label: '2024/2025',
  semester: 1,
  semester1Start: '2024-07-15',
  semester1End: '2024-12-20',
  semester2Start: '2025-01-06',
  semester2End: '2025-06-20',
};

export const sampleStudents7A = [
  { id: 's-01', name: 'ACHMAD FAUZI', nis: '242501', nisn: '0112345601', number: 1, gender: 'L' as const },
  { id: 's-02', name: 'ADINDA PUTRI MAHESHWARI', nis: '242502', nisn: '0112345602', number: 2, gender: 'P' as const },
  { id: 's-03', name: 'AHMAD ZAKI MUBAROK', nis: '242503', nisn: '0112345603', number: 3, gender: 'L' as const },
  { id: 's-04', name: 'ALYA ANINDYA SHIFA', nis: '242504', nisn: '0112345604', number: 4, gender: 'P' as const },
  { id: 's-05', name: 'ANDI PRASETYO', nis: '242505', nisn: '0112345605', number: 5, gender: 'L' as const },
  { id: 's-06', name: 'ANNISA RAHMAWATI', nis: '242506', nisn: '0112345606', number: 6, gender: 'P' as const },
  { id: 's-07', name: 'BAYU PRATAMA', nis: '242507', nisn: '0112345607', number: 7, gender: 'L' as const },
  { id: 's-08', name: 'BUDI SANTOSO', nis: '242508', nisn: '0112345608', number: 8, gender: 'L' as const },
  { id: 's-09', name: 'CITRA DEWI LESTARI', nis: '242509', nisn: '0112345609', number: 9, gender: 'P' as const },
  { id: 's-10', name: 'DANIEL WIJAYA', nis: '242510', nisn: '0112345610', number: 10, gender: 'L' as const },
  { id: 's-11', name: 'DEDI KURNIAWAN', nis: '242511', nisn: '0112345611', number: 11, gender: 'L' as const },
  { id: 's-12', name: 'DWI ASTUTI', nis: '242512', nisn: '0112345612', number: 12, gender: 'P' as const },
  { id: 's-13', name: 'EKA PUTRI RAMADHANI', nis: '242513', nisn: '0112345613', number: 13, gender: 'P' as const },
  { id: 's-14', name: 'FARHAN HIDAYAT', nis: '242514', nisn: '0112345614', number: 14, gender: 'L' as const },
  { id: 's-15', name: 'GILANG PERMANA', nis: '242515', nisn: '0112345615', number: 15, gender: 'L' as const },
  { id: 's-16', name: 'HASNA NABILA', nis: '242516', nisn: '0112345616', number: 16, gender: 'P' as const },
  { id: 's-17', name: 'INDRA SEPATIAN', nis: '242517', nisn: '0112345617', number: 17, gender: 'L' as const },
  { id: 's-18', name: 'INTAN PERMATA SARI', nis: '242518', nisn: '0112345618', number: 18, gender: 'P' as const },
  { id: 's-19', name: 'KIKY AMALIA', nis: '242519', nisn: '0112345619', number: 19, gender: 'P' as const },
  { id: 's-20', name: 'LUTFHI SAPUTRA', nis: '242520', nisn: '0112345620', number: 20, gender: 'L' as const },
];

export const sampleStudents7B = [
  { id: 's7b-01', name: 'AURA AULIA', nis: '242521', nisn: '0112345621', number: 1, gender: 'P' as const },
  { id: 's7b-02', name: 'BIMANTARA', nis: '242522', nisn: '0112345622', number: 2, gender: 'L' as const },
  { id: 's7b-03', name: 'CINDY CLAUDIA', nis: '242523', nisn: '0112345623', number: 3, gender: 'P' as const },
  { id: 's7b-04', name: 'DICKY CHANDRA', nis: '242524', nisn: '0112345624', number: 4, gender: 'L' as const },
  { id: 's7b-05', name: 'ERIKA SARI', nis: '242525', nisn: '0112345625', number: 5, gender: 'P' as const },
];

export const sampleRosters: ClassRoster[] = [
  {
    classId: 'cls-7a',
    classLabel: 'VII-A',
    grade: 7,
    parallel: 'A',
    students: sampleStudents7A,
  },
  {
    classId: 'cls-7b',
    classLabel: 'VII-B',
    grade: 7,
    parallel: 'B',
    students: sampleStudents7B,
  },
];

export const sampleAssignments: TeachingAssignment[] = [
  {
    id: 'asg-7a-mat',
    classId: 'cls-7a',
    classLabel: 'VII-A',
    subject: 'Matematika',
    teacherId: 'teacher-1',
    totalJpPerWeek: 5,
  },
  {
    id: 'asg-7b-mat',
    classId: 'cls-7b',
    classLabel: 'VII-B',
    subject: 'Matematika',
    teacherId: 'teacher-1',
    totalJpPerWeek: 5,
  },
  {
    id: 'asg-7a-ipa',
    classId: 'cls-7a',
    classLabel: 'VII-A',
    subject: 'IPA (Sains)',
    teacherId: 'teacher-1',
    totalJpPerWeek: 4,
  },
];

/* ------------------------------------------------------------------ */
/*  Sample GradeBooks                                                 */
/* ------------------------------------------------------------------ */

export const sampleGradeBook7AMat1: GradeBook = {
  id: 'gb-7a-mat-sem1',
  assignmentId: 'asg-7a-mat',
  classId: 'cls-7a',
  subject: 'Matematika',
  semester: 1,
  kdCount: 10,
  isPaSplit: false,
  entries: sampleStudents7A.map((s, idx) => {
    // Generate realistic scores with slight variation
    const base = 75 + (idx % 5) * 4 - Math.floor(idx / 3) * 2;
    const score = (offset: number) => Math.min(100, Math.max(65, base + offset));

    const ulangan: Record<number, number> = {};
    const tugas: Record<number, number> = {};
    const finalKD: Record<number, number> = {};
    let sumKD = 0;

    for (let i = 1; i <= 10; i++) {
      const u = score(((i * 3) % 7) - 3);
      const t = score(((i * 4) % 9) - 2);
      ulangan[i] = u;
      tugas[i] = t;
      finalKD[i] = Math.round((u + t) / 2);
      sumKD += finalKD[i];
    }

    const pts = score(2);
    const pas = score(6);
    const avgKD = sumKD / 10;
    const finalScore = Math.round((avgKD + pts + pas) / 3);

    return {
      studentId: s.id,
      studentName: s.name,
      nisn: s.nisn,
      ulanganScores: ulangan,
      tugasScores: tugas,
      finalKDScores: finalKD,
      pts,
      pas,
      finalScore,
    };
  }),
};

/* ------------------------------------------------------------------ */
/*  Sample Attendance Records                                         */
/* ------------------------------------------------------------------ */

export function generateSampleAttendance(classId: string, students: typeof sampleStudents7A): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const dates = [
    '2024-08-05', '2024-08-12', '2024-08-19', '2024-08-26',
    '2024-09-02', '2024-09-09', '2024-09-16', '2024-09-23', '2024-09-30',
    '2024-10-07', '2024-10-14', '2024-10-21', '2024-10-28',
    '2024-11-04', '2024-11-11', '2024-11-18', '2024-11-25',
    '2024-12-02', '2024-12-09',
  ];

  dates.forEach((date, dateIdx) => {
    students.forEach((s, sIdx) => {
      // Default present
      let status: 'present' | 'sick' | 'excused' | 'late' | 'absent' = 'present';
      
      // Introduce realistic occasional absences
      if ((sIdx + dateIdx) % 17 === 0) status = 'sick';
      else if ((sIdx * 3 + dateIdx) % 19 === 0) status = 'excused';
      else if ((sIdx + dateIdx * 2) % 23 === 0) status = 'late';
      else if (sIdx === 8 && dateIdx === 4) status = 'absent';

      records.push({
        id: `att-${classId}-${date}-${s.id}`,
        studentId: s.id,
        classId,
        date,
        status,
      });
    });
  });

  return records;
}

export const sampleAttendance7A = generateSampleAttendance('cls-7a', sampleStudents7A);

/* ------------------------------------------------------------------ */
/*  Sample Lesson Sessions                                            */
/* ------------------------------------------------------------------ */

export const sampleLessonSessions7AMat: LessonSession[] = [
  { id: 'ls-01', date: '2024-08-05', startPeriod: 1, durationJP: 3, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-02', date: '2024-08-07', startPeriod: 4, durationJP: 2, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-03', date: '2024-08-12', startPeriod: 1, durationJP: 3, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-04', date: '2024-08-14', startPeriod: 4, durationJP: 2, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-05', date: '2024-08-19', startPeriod: 1, durationJP: 3, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-06', date: '2024-08-21', startPeriod: 4, durationJP: 2, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-07', date: '2024-08-26', startPeriod: 1, durationJP: 3, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-08', date: '2024-08-28', startPeriod: 4, durationJP: 2, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-09', date: '2024-09-02', startPeriod: 1, durationJP: 3, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-10', date: '2024-09-04', startPeriod: 4, durationJP: 2, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-11', date: '2024-09-09', startPeriod: 1, durationJP: 3, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-12', date: '2024-09-11', startPeriod: 4, durationJP: 2, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-13', date: '2024-09-16', startPeriod: 1, durationJP: 3, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-14', date: '2024-09-18', startPeriod: 4, durationJP: 2, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-15', date: '2024-09-23', startPeriod: 1, durationJP: 3, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-16', date: '2024-09-25', startPeriod: 4, durationJP: 2, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-17', date: '2024-10-07', startPeriod: 1, durationJP: 3, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
  { id: 'ls-18', date: '2024-10-09', startPeriod: 4, durationJP: 2, subject: 'Matematika', classId: 'cls-7a', semester: 1 },
];

/* ------------------------------------------------------------------ */
/*  Sample Teaching Journals                                          */
/* ------------------------------------------------------------------ */

export const sampleTeachingJournals7AMat: TeachingJournal[] = [
  {
    id: 'tj-01',
    sessionId: 'ls-01',
    classId: 'cls-7a',
    subject: 'Matematika',
    semester: 1,
    date: '2024-08-05',
    plannedMaterialTitle: 'Bilangan Bulat: Konsep, Sifat, dan Operasi Penjumlahan & Pengurangan',
    actualMaterialTitle: 'Penjelasan konsep bilangan bulat dan latihan soal penjumlahan',
    realizationStatus: 'done',
    note: 'Siswa aktif melakukan latihan papan tulis',
  },
  {
    id: 'tj-02',
    sessionId: 'ls-02',
    classId: 'cls-7a',
    subject: 'Matematika',
    semester: 1,
    date: '2024-08-07',
    plannedMaterialTitle: 'Bilangan Bulat: Operasi Perkalian dan Pembagian',
    actualMaterialTitle: 'Operasi perkalian dan pembagian bilangan bulat',
    realizationStatus: 'done',
    note: 'Diberikan tugas rumah 5 nomor',
  },
  {
    id: 'tj-03',
    sessionId: 'ls-03',
    classId: 'cls-7a',
    subject: 'Matematika',
    semester: 1,
    date: '2024-08-12',
    plannedMaterialTitle: 'Sifat-sifat Operasi Hitung Komutatif, Asosiatif, Distributif',
    actualMaterialTitle: 'Diskusi kelompok mengenai sifat distributif',
    realizationStatus: 'done',
    note: 'Seluruh kelompok menyelesaikan LKPD 1',
  },
  {
    id: 'tj-04',
    sessionId: 'ls-04',
    classId: 'cls-7a',
    subject: 'Matematika',
    semester: 1,
    date: '2024-08-14',
    plannedMaterialTitle: 'Ulangan Harian 1: Bilangan Bulat',
    actualMaterialTitle: 'Pelaksanaan UH 1 Bilangan Bulat',
    realizationStatus: 'done',
    note: 'UH berjalan tertib dan lancar',
  },
  {
    id: 'tj-05',
    sessionId: 'ls-05',
    classId: 'cls-7a',
    subject: 'Matematika',
    semester: 1,
    date: '2024-08-19',
    plannedMaterialTitle: 'Bilangan Rasional dan Pecahan: Urutan dan Operasi Hitung',
    actualMaterialTitle: 'Pengenalan bilangan pecahan campuran dan desimal',
    realizationStatus: 'done',
  },
  {
    id: 'tj-06',
    sessionId: 'ls-06',
    classId: 'cls-7a',
    subject: 'Matematika',
    semester: 1,
    date: '2024-08-21',
    plannedMaterialTitle: 'Operasi Penjumlahan dan Pengurangan Pecahan',
    actualMaterialTitle: 'Penyamaan penyebut pecahan berpenyebut beda',
    realizationStatus: 'continued',
    note: 'Masih ada 4 siswa yang perlu perbaikan konsep dasar penyebut',
  },
  {
    id: 'tj-07',
    sessionId: 'ls-07',
    classId: 'cls-7a',
    subject: 'Matematika',
    semester: 1,
    date: '2024-08-26',
    plannedMaterialTitle: 'Aljabar: Pengenalan Variabel, Koefisien, Konstanta',
    actualMaterialTitle: 'Bentuk aljabar dan suku sejenis',
    realizationStatus: 'done',
  },
];

export const STANDARD_SUBJECT_OPTIONS = [
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'Ilmu Pengetahuan Alam (IPA)',
  'Ilmu Pengetahuan Sosial (IPS)',
  'Bahasa Inggris',
  'Informatika',
  'Pendidikan Agama Islam (PAI)',
  'Pendidikan Agama Kristen',
  'Pendidikan Agama Katolik',
  'Pendidikan Agama Hindu',
  'Pendidikan Agama Buddha',
  'Pendidikan Agama Khonghucu',
  'PJOK',
  'Seni Budaya',
  'Seni Rupa',
  'Seni Musik',
  'Seni Tari',
  'Seni Teater',
  'Prakarya & Kewirausahaan',
  'Bahasa Daerah / Melayu',
  'Bimbingan dan Konseling (BK)',
  'Muatan Lokal (Mulok)',
];

