// Sample Internet Document Presets for Identitas Replacer
export interface SampleDocItem {
  id: string;
  title: string;
  source: string;
  type: 'real' | 'placeholder';
  content: string;
}

export const SAMPLE_INTERNET_DOCS: SampleDocItem[] = [
  {
    id: 'modul-matematika',
    title: 'Modul Ajar Matematika Fase D (SMP Negeri 1 Jakarta)',
    source: 'GudangModulAjar.com (Teks Real)',
    type: 'real',
    content: `MODUL AJAR KURIKULUM MERDEKA
MATA PELAJARAN: MATEMATIKA FASE D (KELAS VII)

A. INFORMASI UMUM
Nama Penyusun         : Budi Santoso, S.Pd., M.Pd.
NIP                   : 19820510 200801 1 012
Satuan Pendidikan     : SMP Negeri 1 Jakarta
Mata Pelajaran        : Matematika
Fase / Kelas          : Fase D / VII
Tahun Pelajaran       : 2023/2024
Semester              : Ganjil
Alokasi Waktu         : 2 JP x 40 Menit (1 Pertemuan)

B. KOMPETENSI AWAL
Peserta didik telah memahami operasi dasar penjumlahan, pengurangan, dan perkalian bilangan bulat.

C. PROFIL PELAJAR PANCASILA
1. Bergotong Royong
2. Bernalar Kritis
3. Mandiri

D. SARANA DAN PRASARANA
Papan tulis, laptop, proyektor, Lembar Kerja Peserta Didik (LKPD).

E. MODEL PEMBELAJARAN
Problem Based Learning (PBL) secara Tatap Muka.

--------------------------------------------------------------------------------

F. KOMPONEN INTI
1. TUJUAN PEMBELAJARAN
- Peserta didik mampu menjelaskan konsep rasio dan perbandingan dalam kehidupan sehari-hari.
- Peserta didik mampu menyelesaikan masalah kontekstual yang berkaitan dengan rasio senilai.

2. KEGIATAN PEMBELAJARAN
a. Pendahuluan (10 Menit):
   - Guru membuka pembelajaran dengan salam dan doa.
   - Checking kehadiran peserta didik.
   - Apersepsi mengenai perbandingan sederhana dalam resep masakan.

b. Kegiatan Inti (60 Menit):
   - Orientasi masalah: Guru menyajikan video pembuatan kue dengan skala bahan.
   - Mengorganisasi siswa: Siswa dibagi menjadi kelompok heterogen (4-5 orang).
   - Membimbing penyelidikan: Siswa berdiskusi menyelesaikan LKPD rasio senilai.
   - Mengembangkan hasil karya: Kelompok mempresentasikan jawaban di depan kelas.

c. Penutup (10 Menit):
   - Guru bersama siswa menyimpulkan materi perbandingan.
   - Refleksi pembelajaran dan pemberian tugas mandiri.

3. ASESMEN
- Formatif: Observasi keaktifan diskusi dan hasil kerja kelompok pada LKPD.
- Sumatif: Tes tertulis pilihan ganda di akhir bab.

--------------------------------------------------------------------------------

Mengetahui,                                       Jakarta, 17 Juli 2023
Kepala SMP Negeri 1 Jakarta                       Guru Mata Pelajaran Matematika




Dr. H. Mulyadi, M.Pd.                             Budi Santoso, S.Pd., M.Pd.
NIP. 19700312 199503 1 002                        NIP. 19820510 200801 1 012`
  },
  {
    id: 'rpp-pancasila',
    title: 'RPP / Modul Ajar Pendidikan Pancasila (SMPN 2 Bandung)',
    source: 'BerbagiPerangkat.org (Teks Real)',
    type: 'real',
    content: `MODUL AJAR PENDIDIKAN PANCASILA
SMPN 2 BANDUNG - TAHUN AJARAN 2022/2023

1. IDENTITAS MODUL
- Nama Penyusun       : Hj. Siti Rahmah, S.Pd.
- NIP                 : 19780415 200312 2 005
- Sekolah             : SMPN 2 Bandung
- Jenjang / Kelas     : SMP / Kelas VIII
- Alokasi Waktu       : 3 x 40 Menit
- Tahun Pelajaran     : 2022/2023
- Semester            : Genap

2. MATERI POKOK
Nilai-Nilai Pancasila dalam Kehidupan Bermasyarakat dan Bernegara.

3. KETERANGAN PERSETUJUAN
Mengetahui,
Kepala Sekolah SMPN 2 Bandung                     Bandung, 08 Januari 2023
Guru Mata Pelajaran




Drs. Ahmad Dahlan, M.M.                           Hj. Siti Rahmah, S.Pd.
NIP. 19680101 199303 1 003                        NIP. 19780415 200312 2 005`
  },
  {
    id: 'template-placeholder',
    title: 'Template Master Modul Ajar (Format Tag Placeholder)',
    source: 'Template Otomatis AI (Siap Pakai)',
    type: 'placeholder',
    content: `PERANGKAT DOKUMEN ADMINISTRASI GURU
SATUAN PENDIDIKAN : {{NAMA_SEKOLAH}}
MATA PELAJARAN    : {{MATA_PELAJARAN}}
TAHUN PELAJARAN   : {{TAHUN_AJARAN}}
SEMESTER          : {{SEMESTER}}

A. IDENTITAS PENYUSUN
Nama Guru         : {{NAMA_GURU}}
NIP Guru          : {{NIP_GURU}}
Satuan Pendidikan : {{NAMA_SEKOLAH}}
Mata Pelajaran    : {{MATA_PELAJARAN}}

B. TUJUAN PEMBELAJARAN
1. Peserta didik memahami materi esensial secara mendalam melalui pendekatan pembelajaran berbasis proyek.
2. Peserta didik mampu berkolaborasi aktif dan menalar kritis sesuai dengan Profil Pelajar Pancasila.

C. KEGIATAN PEMBELAJARAN
1. Pendahuluan: Orientasi, apersepsi, dan pembacaan tujuan pembelajaran oleh {{NAMA_GURU}}.
2. Kegiatan Inti: Diskusi kelompok terarah di {{NAMA_SEKOLAH}} menggunakan LKPD interaktif.
3. Penutup: Refleksi pembelajaran dan konfirmasi tugas mandiri.

D. LEMBAR PENGESAHAN DOKUMEN

Mengetahui,                                       {{KOTA_TANGGAL}}
Kepala {{NAMA_SEKOLAH}}                           Guru Mata Pelajaran {{MATA_PELAJARAN}}




{{NAMA_KEPSEK}}                                   {{NAMA_GURU}}
NIP. {{NIP_KEPSEK}}                               NIP. {{NIP_GURU}}`
  }
];
