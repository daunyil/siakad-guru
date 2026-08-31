import type { LKPDVariation } from '../../../data/bukuSiswaData';

export interface KopData {
  governmentAgency?: string;
  schoolName: string;
  schoolAddress?: string;
  headmasterName: string;
  headmasterNip: string;
  teacherName: string;
  teacherNip: string;
  dateLocation: string;
  academicSemester?: string;
}

export interface RefleksiItem {
  no: number;
  pertanyaan: string;
  indikator?: string;
}

export interface ModulAjarFormState {
  meetingNumber: number;
  timeAllocation: string;
  learningModel: string;
  pendekatanMetode?: string;
  kompetensiAwal?: string;
  p3Dimensions: string[];
  sarpras: string;
  targetSiswa: string;
  iktpList?: string[];
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  materiPokok?: string;
  bukuSiswaTitle?: string;
  bukuSiswaBab?: string;
  bukuSiswaSubBab?: string;
  bukuSiswaPages?: string;
  kegiatanAwal: string;
  kegiatanInti: string;
  kegiatanPenutup: string;
  asesmenDiagnostik: string;
  asesmenFormatif: string;
  asesmenSumatif: string;
  refleksiGuru?: RefleksiItem[];
  refleksiSiswa?: RefleksiItem[];
  remedial: string;
  pengayaan: string;
  lkpdTitle?: string;
  lkpdBadge?: string;
  lkpdType?: string;
  lkpdInstructions?: string[];
  lkpdQuestions?: string[];
  lkpdVariations?: LKPDVariation[];
  selectedLkpdVariationId?: string;
  lkpdRubrik?: {
    kriteria: string;
    skor4: string;
    skor3: string;
    skor2: string;
    skor1: string;
  }[];
  bahanBacaanGuruSiswa?: string;
  glosarium?: string;
  daftarPustaka?: string;
}

