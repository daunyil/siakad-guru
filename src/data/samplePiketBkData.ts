export interface RecordPelanggaranPiket {
  id: string;
  tanggal: string;
  jamKe: string;
  nisn: string;
  namaSiswa: string;
  kelas: string;
  jenisPelanggaran: string;
  kategori: 'Keterlambatan' | 'Seragam/Atribut' | 'Kedisiplinan' | 'Ketertiban Kelas' | 'Berat';
  poin: number;
  tindakanPiket: string;
  statusDisposisi: 'Selesai di Piket' | 'Diteruskan ke Wali Kelas' | 'Rujukan ke Guru BK';
}

export interface RecordKonselingBK {
  id: string;
  tanggal: string;
  nisn: string;
  namaSiswa: string;
  kelas: string;
  bidangBimbingan: 'Pribadi' | 'Belajar' | 'Sosial' | 'Karir';
  jenisLayanan: 'Konseling Individual' | 'Bimbingan Kelompok' | 'Konferensi Kasus' | 'Home Visit';
  keluhanMasalah: string;
  pendekatanSolusi: string;
  tindakLanjut: string;
  status: 'Dalam Proses' | 'Selesai / Teratasi' | 'Rujukan Pihak Luar';
}

export interface StudentEkskul {
  id: string;
  nisn: string;
  namaSiswa: string;
  kelas: string;
  ekskulName: string;
  predikat: 'Sangat Baik' | 'Baik' | 'Cukup';
  keterangan: string;
}

export const initialViolationRules: Array<{ id: string; kategori: RecordPelanggaranPiket['kategori']; nama: string; poin: number }> = [
  { id: 'rule-1', kategori: 'Keterlambatan', nama: 'Terlambat Masuk Sekolah (< 15 Menit)', poin: 5 },
  { id: 'rule-2', kategori: 'Keterlambatan', nama: 'Terlambat Masuk Sekolah (15 - 30 Menit)', poin: 10 },
  { id: 'rule-3', kategori: 'Keterlambatan', nama: 'Terlambat Masuk Sekolah (> 30 Menit / Tanpa Alasan)', poin: 15 },
  { id: 'rule-4', kategori: 'Seragam/Atribut', nama: 'Atribut Seragam Tidak Lengkap (Dasi/Sabuk/Kaos Kaki/Logo)', poin: 5 },
  { id: 'rule-5', kategori: 'Seragam/Atribut', nama: 'Sepatu / Kaos Kaki Tidak Sesuai Ketentuan (Bukan Hitam/Putih)', poin: 5 },
  { id: 'rule-6', kategori: 'Seragam/Atribut', nama: 'Rambut Panjang / Tidak Rapi (Peserta Didik Putra)', poin: 5 },
  { id: 'rule-7', kategori: 'Seragam/Atribut', nama: 'Seragam Ketat / Baju Tidak Dimasukkan', poin: 3 },
  { id: 'rule-8', kategori: 'Ketertiban Kelas', nama: 'Menggunakan HP Tanpa Izin Guru saat KBM', poin: 10 },
  { id: 'rule-9', kategori: 'Ketertiban Kelas', nama: 'Makan / Minum saat KBM Berlangsung', poin: 5 },
  { id: 'rule-10', kategori: 'Kedisiplinan', nama: 'Meninggalkan Kelas / Membolos Jam Pelajaran', poin: 20 },
  { id: 'rule-11', kategori: 'Kedisiplinan', nama: 'Meninggalkan Area Sekolah Tanpa Izin Guru Piket', poin: 25 },
  { id: 'rule-12', kategori: 'Berat', nama: 'Merokok / Vaping di Lingkungan Sekolah', poin: 50 },
  { id: 'rule-13', kategori: 'Berat', nama: 'Berkelahi / Tindak Kekerasan / Bullying', poin: 75 },
  { id: 'rule-14', kategori: 'Berat', nama: 'Merusak Sarana & Prasarana Sekolah', poin: 30 },
];

export const initialPiketRecords: RecordPelanggaranPiket[] = [
  {
    id: 'piket-1',
    tanggal: '2025-07-21',
    jamKe: '1 (07.15)',
    nisn: '0081234503',
    namaSiswa: 'Bagus Pratama',
    kelas: 'VII-A',
    jenisPelanggaran: 'Terlambat masuk sekolah (> 15 menit)',
    kategori: 'Keterlambatan',
    poin: 5,
    tindakanPiket: 'Pembersihan halaman perpustakaan & pembinaan kedisiplinan',
    statusDisposisi: 'Selesai di Piket',
  },
  {
    id: 'piket-2',
    tanggal: '2025-07-22',
    jamKe: '3 (08.45)',
    nisn: '0081234508',
    namaSiswa: 'Rian Hidayat',
    kelas: 'VIII-B',
    jenisPelanggaran: 'Tidak memakai atribut lengkap (Sepatu tidak hitam / Tanpa Sabuk)',
    kategori: 'Seragam/Atribut',
    poin: 5,
    tindakanPiket: 'Pencatatan di buku piket & peringatan lisan',
    statusDisposisi: 'Diteruskan ke Wali Kelas',
  },
  {
    id: 'piket-3',
    tanggal: '2025-07-24',
    jamKe: '5 (10.30)',
    nisn: '0081234512',
    namaSiswa: 'Doni Kurniawan',
    kelas: 'IX-C',
    jenisPelanggaran: 'Meninggalkan area sekolah tanpa izin (Membolos jam KBM)',
    kategori: 'Kedisiplinan',
    poin: 15,
    tindakanPiket: 'Pemanggilan orang tua & pembuatan surat pernyataan',
    statusDisposisi: 'Rujukan ke Guru BK',
  },
];

export const initialBkRecords: RecordKonselingBK[] = [
  {
    id: 'bk-1',
    tanggal: '2025-07-24',
    nisn: '0081234512',
    namaSiswa: 'Doni Kurniawan',
    kelas: 'IX-C',
    bidangBimbingan: 'Pribadi',
    jenisLayanan: 'Konseling Individual',
    keluhanMasalah: 'Rujukan Piket: Membolos jam KBM (15 Poin). Kurang motivasi belajar & pengaruh teman sebaya.',
    pendekatanSolusi: 'Klarifikasi nilai diri, identifikasi pemicu kebosanan di kelas, penyusunan kontrak perilaku.',
    tindakLanjut: 'Pemanggilan orang tua, koordinasi dengan wali kelas dan guru mata pelajaran.',
    status: 'Dalam Proses',
  },
  {
    id: 'bk-2',
    tanggal: '2025-07-20',
    nisn: '0081234503',
    namaSiswa: 'Bagus Pratama',
    kelas: 'VII-A',
    bidangBimbingan: 'Belajar',
    jenisLayanan: 'Bimbingan Kelompok',
    keluhanMasalah: 'Kesulitan manajemen waktu belajar di rumah dan konsentrasi saat KBM matematika.',
    pendekatanSolusi: 'Pelatihan teknik Pomodoro belajar dan penyusunan jadwal harian siswa.',
    tindakLanjut: 'Evaluasi mingguan jadwal harian mandiri.',
    status: 'Selesai / Teratasi',
  },
];

export const initialEkskulList: string[] = [
  'Pramuka (Wajib)',
  'PMR & Red Cross',
  'Paskibra Sekolah',
  'Olahraga (Futsal/Voli/Basket)',
  'Seni Musik & Tari Tradisional',
  'Karya Ilmiah Remaja (KIR)',
  'English Club',
];

export const initialEkskulStudents: StudentEkskul[] = [
  {
    id: 'ekskul-1',
    nisn: '0081234501',
    namaSiswa: 'Ahmad Fauzi',
    kelas: 'VII-A',
    ekskulName: 'Pramuka (Wajib)',
    predikat: 'Sangat Baik',
    keterangan: 'Aktif sebagai Pratama regu, memimpin perkemahan dengan kedisiplinan tinggi.',
  },
  {
    id: 'ekskul-2',
    nisn: '0081234502',
    namaSiswa: 'Anisa Rahmawati',
    kelas: 'VII-A',
    ekskulName: 'Pramuka (Wajib)',
    predikat: 'Baik',
    keterangan: 'Mengikuti seluruh latihan rutin dan menguasai teknik tali-temali.',
  },
  {
    id: 'ekskul-3',
    nisn: '0081234503',
    namaSiswa: 'Bagus Pratama',
    kelas: 'VII-A',
    ekskulName: 'Pramuka (Wajib)',
    predikat: 'Baik',
    keterangan: 'Menunjukkan kehadiran rutin dan kerja sama baik dalam regu.',
  },
  {
    id: 'ekskul-4',
    nisn: '0081234504',
    namaSiswa: 'Citra Dewi',
    kelas: 'VII-A',
    ekskulName: 'PMR & Red Cross',
    predikat: 'Sangat Baik',
    keterangan: 'Terampil memberikan pertolongan pertama pada kegiatan upacara sekolah.',
  },
  {
    id: 'ekskul-5',
    nisn: '0081234505',
    namaSiswa: 'Dion Saputra',
    kelas: 'VII-A',
    ekskulName: 'Olahraga (Futsal/Voli/Basket)',
    predikat: 'Sangat Baik',
    keterangan: 'Kapten tim futsal kelas VII, menunjukkan sportivitas tinggi.',
  },
];
