import type { P5ThemeOption } from './types';

export const P5_THEMES: P5ThemeOption[] = [
  {
    id: 'gaya-hidup',
    name: 'Gaya Hidup Berkelanjutan',
    description: 'Memahami dampak aktivitas manusia terhadap lingkungan dan membangun kesadaran ramah lingkungan.',
    defaultProjectTitle: 'Pengolahan Sampah Organik & Bank Sampah Sekolah',
    dimensions: ['Gotong Royong', 'Bernalar Kritis', 'Kreatif'],
  },
  {
    id: 'kearifan-lokal',
    name: 'Kearifan Lokal',
    description: 'Mengeksplorasi dan melestarikan budaya, tradisi, serta kearifan daerah lokal.',
    defaultProjectTitle: 'Pelestarian Seni Kesenian & Kuliner Tradisional Daerah',
    dimensions: ['Berkebinekaan Global', 'Gotong Royong', 'Kreatif'],
  },
  {
    id: 'bhinneka',
    name: 'Bhinneka Tunggal Ika',
    description: 'Mengenal, menghargai, dan mempromosikan toleransi serta keberagaman dalam kehidupan bermasyarakat.',
    defaultProjectTitle: 'Festival Budaya & Indahnya Keberagaman Nusantara',
    dimensions: ['Berkebinekaan Global', 'Bernalar Kritis'],
  },
  {
    id: 'jiwa-raga',
    name: 'Bangunlah Jiwa dan Raganya',
    description: 'Membangun kesadaran dan keterampilan untuk memelihara kesehatan fisik dan mental.',
    defaultProjectTitle: 'Kampanye Anti-Bullying & Kampus Sehat Jiwa Raga',
    dimensions: ['Beriman & Bertakwa', 'Mandiri'],
  },
  {
    id: 'suara-demokrasi',
    name: 'Suara Demokrasi',
    description: 'Melatih kebebasan berpendapat, musyawarah, dan pemilu OSIS secara transparan.',
    defaultProjectTitle: 'Pemilihan Ketua OSIS Berbasis Demokrasi Pancasila',
    dimensions: ['Bernalar Kritis', 'Gotong Royong'],
  },
  {
    id: 'rekayasa-teknologi',
    name: 'Rekayasa dan Teknologi',
    description: 'Mengidentifikasi masalah sekitar dan merancang solusi bernilai teknologi tepat guna.',
    defaultProjectTitle: 'Rancang Bangun Alat Penyaring Air Sederhana & Solar Cell',
    dimensions: ['Bernalar Kritis', 'Kreatif'],
  },
  {
    id: 'kewirausahaan',
    name: 'Kewirausahaan',
    description: 'Mengembangkan jiwa wirausaha, kreativitas produk, serta pemahaman pasar sederhana.',
    defaultProjectTitle: 'Gelar Karya Entrepreneur Muda: Produk Kreatif Daur Ulang',
    dimensions: ['Mandiri', 'Kreatif', 'Gotong Royong'],
  },
];

export const PPP_DIMENSIONS = [
  'Beriman & Bertakwa',
  'Berkebinekaan Global',
  'Gotong Royong',
  'Mandiri',
  'Bernalar Kritis',
  'Kreatif',
];
