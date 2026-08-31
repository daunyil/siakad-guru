export type WeekStatus = 'kbm' | 'mpls' | 'sts' | 'sas' | 'rapor' | 'libur';

export interface MonthCol {
  name: string;
  weeks: number; // 4 or 5
}

export interface RegionalKaldik {
  id: string;
  name: string;
  description: string;
  ganjilTags: Record<string, WeekStatus>; // key e.g. "Juli-0", "Desember-3"
  genapTags: Record<string, WeekStatus>;
}

export interface KopData {
  schoolName: string;
  npsn: string;
  address: string;
  headmasterName: string;
  headmasterNip: string;
  teacherName: string;
  teacherNip: string;
  dateLocation: string;
}

export interface TpAllocationItem {
  elementId: string;
  elementName: string;
  tp: {
    code: string;
    title: string;
    jp: number;
    semester?: 1 | 2;
  };
  jp: number;
  jpIntra: number;
  jpKo: number;
  semester: 'ganjil' | 'genap';
}
