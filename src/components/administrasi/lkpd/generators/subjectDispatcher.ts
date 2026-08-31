import type { BukuSiswaSubBab, LKPDVariation } from '../../../../data/bukuSiswaData';
import type {
  CompleteLkpdPackage,
  LkpdActivityType,
} from '../types';
import { buildCompleteLkpdPackage } from './packageBuilder';

/**
 * Dispatcher utama untuk menghasilkan paket lengkap LKPD Kurikulum Merdeka
 * Berbasis Analisis Konteks Buku Teks & Tujuan Pembelajaran
 */
export function generateCompleteLkpdPackage(
  subBab: BukuSiswaSubBab,
  bab: { semester: 1 | 2; elemen: string; title?: string; babNumber?: number },
  selectedClass: 'VII' | 'VIII' | 'IX',
  variation?: LKPDVariation,
  selectedActivityType?: LkpdActivityType | string,
  overrideMeetingNumber?: number,
  subjectName: string = 'Pendidikan Pancasila'
): CompleteLkpdPackage {
  return buildCompleteLkpdPackage(
    subBab,
    bab,
    selectedClass,
    variation,
    selectedActivityType,
    overrideMeetingNumber,
    subjectName
  );
}
