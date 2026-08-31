# PROGRESS DOKUMENTASI & ROADMAP ADMINISTRASI GURU KURIKULUM MERDEKA

> **Status Aplikasi**: Active & Fully Functional (Build Verified)  
> **Terakhir Diperbarui**: 5 Agustus 2026  
> **Sistem**: SIM Administrasi Pembelajaran SMP Kurikulum Merdeka (BSKAP 032/H/KR/2024)

---

## 📊 AUDIT CAKUPAN TAHAP TERKERJAKAN (COMPLETED STAGES)

### ✅ Tahap 1: Landasan & Master Capaian Pembelajaran (CP)
* **File Utama**: `src/data/cpMasterData.ts`, `src/components/administrasi/CPViewerAndCustomizer.tsx`
* **Fitur & Hasil**:
  1. Integrasi Master CP BSKAP 032/H/KR/2024 untuk Bahasa Indonesia, Matematika, IPA, IPS, PPKn, Bahasa Inggris, PAI, dll.
  2. Dekonstruksi Hirarki CP: Elemen $\rightarrow$ Kalimat CP BSKAP $\rightarrow$ Tujuan Pembelajaran (TP) $\rightarrow$ Alokasi JP & Kode TP.
  3. Viewer & Editor Kop Dokumen Resmi Sekolah (NPSN, Alamat, Nama Kepala Sekolah & NIP, Nama Guru & NIP).
  4. Fitur Cetak/Export PDF Resmi untuk Dokumen Analisis CP & TP.

---

### ✅ Tahap 2: Pemetaan Waktu (PROTA & PROSEM)
* **File Utama**: `src/components/administrasi/ProtaProsemGenerator.tsx`
* **Fitur & Hasil**:
  1. **Program Tahunan (PROTA)**: Matriks alokasi JP per TP untuk Semester Ganjil dan Genap dengan verifikasi kuota jam efektif tahunan secara presisi.
  2. **Program Semester (PROSEM)**: Matriks distribusi mingguan (Juli - Juni) dengan otomatisasi pemetaan slot pekan KBM, Asesmen Sumatif (STS/SAS), dan Cadangan.
  3. **Kalkulator Pekan Efektif**: Pengaturan fleksibel JP/Minggu dan jumlah pekan efektif ganjil/genap dengan kalkulasi indikator kuota real-time.

---

### ✅ Tahap 3: Perencanaan Pembelajaran (Modul Ajar / RPP Merdeka)
* **File Utama**: `src/components/administrasi/ModulAjarGenerator.tsx`
* **Fitur & Hasil**:
  1. **Derivasi Otomatis dari TP**: Fitur *Auto-Fill Konten* yang langsung menurunkan Pemahaman Bermakna, Pertanyaan Pemantik, dan Apersepsi dari TP yang dipilih.
  2. **Komponen Komplit BSKAP**:
     * Informasi Umum (Identitas, Fase, PPP/Dimensi Profil Pelajar Pancasila, Sarpras, Target Siswa).
     * Komponen Inti (TP, Pemahaman Bermakna, Pertanyaan Pemantik, Sintaks Model Pembelajaran seperti PBL/PjBL/Inquiry).
     * Asesmen Pembelajaran (Diagnostik, Formatif, Sumatif, Remedial, Pengayaan).
  3. **Lampiran LKPD**: Generator Lembar Kerja Peserta Didik interaktif siap cetak untuk setiap pertemuan.

---

### ✅ Tahap 4: Asesmen, KKTP, & Penilaian Rapor (e-Rapor)
* **File Utama**: `src/components/administrasi/AsesmenKKTPGenerator.tsx`
* **Fitur & Hasil**:
  1. **Rubrik & Standardisasi KKTP**: Penetapan kriteria ketercapaian berbasis interval nilai (0-60, 61-74, 75-88, 89-100) sesuai panduan BSKAP.
  2. **Buku Daftar Nilai (Leger)**: Rekapitulasi nilai Formatif per TP, Sumatif Tengah Semester (STS), dan Sumatif Akhir Semester (SAS).
  3. **Formula Nilai Akhir (NA)**: Bobot kustomisasi variabel (Contoh: 50% Formatif + 25% STS + 25% SAS).
  4. **Formulasi Deskripsi e-Rapor Otomatis**: Generator narasi deskripsi capaian kompetensi tertinggi dan terendah peserta didik berbasis threshold KKTP.

---

### ✅ Modul Pelaksanaan: Jurnal Agenda Mengajar Guru & Catatan KBM
* **File Utama**: `src/components/matrix/JurnalMatrix.tsx` (Kode Dokumen: `ADM-L01`)
* **Fitur & Hasil**:
  1. **Jurnal Harian KBM**: Pencatatan tanggal KBM, jam ke, kelas/rombel, materi/TP yang diajarkan, dan kehadiran siswa (Hadir/Sakit/Izin/Alfa).
  2. **Catatan Kejadian & Solusi**: Pencatatan dinamika kelas, kendala siswa, serta tindakan perbaikan secara real-time.
  3. **Format Siap Cetak**: Tampilan matriks jurnal KBM siap cetak/ekspor PDF lengkap dengan pengesahan Kepala Sekolah & Guru.

---

### ✅ Tahap 5: Modul & Penilaian Projek Penguatan Profil Pelajar Pancasila (P5)
* **File Utama**: `src/components/administrasi/P5ProjekGenerator.tsx`
* **Fitur & Hasil**:
  1. **7 Tema Utama P5 BSKAP**: Gaya Hidup Berkelanjutan, Kearifan Lokal, Bhinneka Tunggal Ika, Bangunlah Jiwa dan Raganya, Suara Demokrasi, Rekayasa dan Teknologi, serta Kewirausahaan.
  2. **Modul Perencanaan P5**: Pemetaan target Dimensi Profil Pelajar Pancasila (PPP), Alokasi JP (misal 48 JP), dan susunan Alur Aktivitas (Pengenalan, Kontekstualisasi, Aksi, Refleksi & Tindak Lanjut).
  3. **Rubrik Penilaian 4 Tingkat**: Standardisasi level capaian BB (Belum Berkembang), MB (Mulai Berkembang), BSH (Berkembang Sesuai Harapan), dan SB (Sangat Berkembang).
  4. **Rekap Rapor P5 Otomatis**: Lembar observasi perkembangan karakter per peserta didik beserta kalimat narasi catatan proses Rapor P5.

---

## 🚀 ROADMAP PERENCANAAN TAHAP BERIKUTNYA

```
[Tahap 1-5 + Jurnal KBM COMPLETED] ──> [Tahap 6: Ekstrakurikuler & Bimbingan Konseling] ──> [Tahap 7: Bundel Supervisi PDF/Zip]
```

### ✅ Tahap 6: Administrasi Guru Piket, Layanan BK, & Ekstrakurikuler
* **File Utama**: `src/components/administrasi/PiketBkEkstraGenerator.tsx`
* **Fitur & Hasil**:
  1. **Jurnal Ketertiban Guru Piket**: Pencatatan pelanggaran, keterlambatan, poin tata tertib, dan tindakan di tempat.
  2. **Integrasi Otomatis Piket ke BK**: Pelanggaran dengan disposisi *Rujukan ke Guru BK* secara otomatis diteruskan (*auto-bridge*) ke Buku Layanan Konseling BK.
  3. **Buku Layanan Bimbingan Konseling (BK)**: Dokumentasi 4 bidang layanan (Pribadi, Belajar, Sosial, Karir), keluhan/kasus, pendekatan solusi, dan monitoring tindak lanjut.
  4. **Penilaian Ekstrakurikuler e-Rapor**: Pengisian predikat kualitatif (Sangat Baik, Baik, Cukup) dan deskripsi capaian per cabang ekstrakurikuler (Pramuka, PMR, Paskibra, Olahraga, Seni, KIR, English Club).

### ✅ Fitur Acuan Kaldik Regional & Pemetaan Prosem Otomatis
* **File Utama**: `src/components/administrasi/ProtaProsemGenerator.tsx` & `src/components/administrasi/ImportKaldikModal.tsx`
* **Fitur Solusi Kalender Pendidikan**:
  1. **Pindai AI Gambar / Foto Kaldik (PNG / JPG / PDF)**: Guru dapat mengunggah foto / screenshot Kalender Pendidikan yang diterima dari Dinas/Sekolah. AI Vision (Gemini) memindai visual kalender dan otomatis menandai minggu KBM, MPLS, Ujian STS/SAS, dan Libur.
  2. **Import File Excel Kaldik (.xlsx / .csv)**: Membaca file spreadsheet Excel dari sekolah dan secara cerdas mendeteksi kata kunci agenda harian/mingguan.
  3. **Preset Kaldik Regional Provinsi / Kemenag**: Menyediakan preset Kalender Pendidikan bawaan untuk **Jawa Barat, DKI Jakarta, Jawa Tengah & DIY, Jawa Timur, Kemenag (Madrasah)**, dan **Kustom/Daerah Lain**.
  4. **Pemetaan Jenis Pekan Non-Efektif**: Membagi status minggu menjadi `KBM` (Efektif), `MPLS` (Pengenalan Sekolah), `STS` (Sumatif Tengah Semester), `SAS` (Sumatif Akhir Semester), `RAPOR`, dan `LIBUR`.
  5. **Auto-Calculation Minggu Efektif (HEB)**: Perhitungan total jam efektif (HEB) dihitung otomatis secara akurat berdasarkan minggu berstatus KBM saja.
  6. **Dynamic Prosem Matrix**: Kolom non-KBM di matriks Program Semester otomatis ditandai badge warna khusus & label agenda, sementara alokasi JP per TP secara presisi hanya menempati minggu-minggu KBM efektif.

### ✅ Fitur Akses Cepat: Input Express KBM Harian (Terstruktur 2-Kolom)
* **File Utama**: `src/components/matrix/KbmHarianExpressModal.tsx`
* **Pembaruan Layout & Rapih**:
  1. **Layout 2-Kolom Ringkas**: Membagi tampilan secara simetris antara **Detail Sesi KBM & Agenda Jurnal** (kiri) dengan **Tab Presensi Siswa & Input Nilai Formatif** (kanan).
  2. **Zero-Clutter Styling**: Menghilangkan tombol berkedip (pulse) yang berlebihan dan menggantinya dengan tombol bertema profesional `Input KBM Express`.
  3. **Auto-Sync Multi-Tabel**: Pengisian sekali klik langsung menyinkronkan data ke **Matriks Presensi Bulanan, Rekap Tatap Muka, Jurnal Mengajar, dan Ledger Nilai**.

---

## 📌 Catatan Audit Peran Dokumen & Pembagian Tugas Guru

* **Guru Mata Pelajaran (Fokus Utama App)**: Mengelola KBM Harian (Absen, Jurnal, Nilai TP), RPP/Modul Ajar, Prota/Prosem, CP/ATP, & KKTP.
* **Koordinator P5**: Dokumen Projek P5 dikelola secara independen oleh Tim/Koordinator P5 Sekolah.
* **Pembina Ekstrakurikuler**: Dokumentasi & Penilaian Ekskul dikelola oleh Pembina masing-masing.
* **Guru Piket & BK**: Bertanggung jawab atas Buku Ketertiban, Pelanggaran Siswa, dan Layanan Konseling.

---

## 🚀 ROADMAP PERENCANAAN TAHAP BERIKUTNYA

```
[Tahap 1-6 + Express KBM Input COMPLETED] ──> [Tahap 7: Paket Ekspor Administrasi Berdasarkan Peran (Role-Based Bundle)]
```

### 🔲 Tahap 7: Paket Ekspor Administrasi Lengkap (One-Click Zip / PDF Bundle)
* Penggabungan seluruh dokumen administrasi (Tahap 1 - 6) menjadi 1 bundel arsip lengkap siap supervisi kepala sekolah / pengawas.
* Integrasi backup data lokal & sinkronisasi kustomisasi.

---

## 🛠️ CATATAN INTEGRASI TEKNIS
* Semua sub-generator terhubung secara harmonis pada komponen induk `AdministrasiMerdeka.tsx`.
* Navigasi antar tahap disediakan melalui top tab bar & tombol pintas cepat pada setiap kartu dokumen di Katalog Administrasi.
