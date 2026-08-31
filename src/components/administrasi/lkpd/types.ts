import type { BukuSiswaSubBab, BukuSiswaBab, LKPDVariation } from '../../../data/bukuSiswaData';

/**
 * Model / Ragam Aktivitas Pembelajaran Berbasis Kurikulum Merdeka
 */
export type LkpdActivityType =
  | 'studi_kasus'
  | 'komparasi'
  | 'proyek_kreatif'
  | 'observasi_wawancara'
  | 'refleksi_komitmen'
  | 'analisis_konsep';

export interface LkpdActivityModelOption {
  id: LkpdActivityType;
  title: string;
  shortLabel: string;
  badge: string;
  iconName: string;
  description: string;
  colorClass: string;
}

/**
 * Baris tabel/matriks analisis kontekstual
 */
export interface LkpdMatrixRow {
  aspect: string;
  cells?: string[];
  helperHint?: string;
}

/**
 * Komponen pertanyaan atau instrumen aktivitas kerja
 */
export interface LkpdQuestion {
  id: string;
  type:
    | 'essay'
    | 'case_study'
    | 'matrix_table'
    | 'action_plan'
    | 'observation_sheet'
    | 'reflection_prompt';
  questionText: string;
  guideHint?: string;
  sentenceStarter?: string;
  // Detail untuk Studi Kasus
  caseStudyTitle?: string;
  caseStudyNarrative?: string;
  // Detail untuk Tabel / Matriks Kerja
  tableHeaders?: string[];
  tableRows?: LkpdMatrixRow[];
  tableRowsCount?: number;
  // Detail untuk Rencana Aksi / Proyek
  actionPlanSteps?: Array<{
    tahap: string;
    rencanaKegiatan: string;
    pelaksana: string;
    targetHasil: string;
  }>;
}

/**
 * Refleksi Pembelajaran Berbasis Capaian TP
 */
export interface LkpdReflectionDetail {
  tpMasteryCheck: string[];
  meaningfulInsight: string;
  characterCommitment: string;
}

/**
 * Kriteria Rubrik Penilaian Otentik Ketercapaian TP
 */
export interface LkpdRubricCriterion {
  aspect: string;
  score4: string; // Sangat Baik
  score3: string; // Baik
  score2: string; // Cukup
  score1: string; // Perlu Bimbingan
}

/**
 * Paket Lengkap LKPD Berbasis Analisis Konteks Buku Teks & Tujuan Pembelajaran
 */
export interface CompleteLkpdPackage {
  title: string;
  meetingNumber: number;
  timeAllocation: string;
  targetClass: 'VII' | 'VIII' | 'IX';
  semester: 1 | 2;
  subjectId: string;
  subjectName: string;
  elementName: string;
  tpCode: string;
  tpTitle: string;
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  p5Dimensions: string[];
  toolsAndMaterials: string;
  generalInstructions: string[];
  stimulusTitle: string;
  stimulusText: string;
  activityType: LkpdActivityType;
  activityBadge: string;
  activityStepsTitle: string;
  activitySteps: string[];
  questionsTitle: string;
  questions: LkpdQuestion[];
  reflectionQuestions: string[];
  reflectionDetail?: LkpdReflectionDetail;
  rubricCriteria: LkpdRubricCriterion[];
}
