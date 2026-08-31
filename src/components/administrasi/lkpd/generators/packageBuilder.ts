import type {
  BukuSiswaSubBab,
  BukuSiswaBab,
  LKPDVariation,
} from '../../../../data/bukuSiswaData';
import type {
  CompleteLkpdPackage,
  LkpdActivityType,
} from '../types';
import {
  generateLkpdFromTextbookContext,
  LKPD_ACTIVITY_OPTIONS,
} from './textbookContextAnalyzer';

/**
 * Single Unified Builder untuk Membuat Paket Lengkap LKPD Kurikulum Merdeka
 * Berbasis Murni Analisis Konteks Buku Teks & Tujuan Pembelajaran (TP).
 */
export function buildCompleteLkpdPackage(
  subBab: BukuSiswaSubBab,
  bab: { semester: 1 | 2; elemen: string; title?: string; babNumber?: number },
  selectedClass: 'VII' | 'VIII' | 'IX',
  variation?: LKPDVariation,
  selectedActivityType?: LkpdActivityType | string,
  overrideMeetingNumber?: number,
  subjectName: string = 'Pendidikan Pancasila'
): CompleteLkpdPackage {
  // Tentukan activity type dari pilihan atau variation jika ada
  let activityType: LkpdActivityType = 'studi_kasus';
  if (selectedActivityType && selectedActivityType in LKPD_ACTIVITY_OPTIONS) {
    activityType = selectedActivityType as LkpdActivityType;
  } else if (variation?.type && variation.type in LKPD_ACTIVITY_OPTIONS) {
    activityType = variation.type as LkpdActivityType;
  }

  return generateLkpdFromTextbookContext(
    subBab,
    bab,
    selectedClass,
    activityType,
    overrideMeetingNumber,
    subjectName
  );
}

export const generateCompleteLkpdPackage = buildCompleteLkpdPackage;
