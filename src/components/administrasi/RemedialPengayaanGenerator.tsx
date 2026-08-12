import React, { useState, useMemo } from 'react';
import type { SchoolProfile, TeacherProfile, AcademicYear } from '../../types';
import { sampleStudents7A, STANDARD_SUBJECT_OPTIONS } from '../../data/sampleData';
import { exportToExcel } from '../../utils/exporters';
import {
  RefreshCw,
  Sparkles,
  CheckCircle2,
  UserCheck,
  Download,
  Plus,
  Printer,
  FileSpreadsheet,
  FileText,
  Copy,
  AlertTriangle,
  Award,
  Users,
  Zap,
  Info,
  ChevronRight,
  Trash2,
  Edit2,
  Check,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface RemedialPengayaanGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
}

export interface StudentRecord {
  id: string;
  nama: string;
  nis: string;
  nilaiAwal: number;
  tpBelumTuntas: string;
  intervensi: string;
  nilaiAkhir: number;
  tuntas: boolean;
  kegiatanPengayaan: string;
  hasilPengayaan: number;
  keteranganPengayaan: string;
}

export const RemedialPengayaanGenerator: React.FC<RemedialPengayaanGeneratorProps> = ({
  school,
  teacher,
  year,
  selectedAssignmentSubject = 'Matematika',
  selectedClassLabel = 'VII-A',
}) => {
  // Form Identitas Dokumen State
  const [schoolName, setSchoolName] = useState(school?.name || 'SMP Negeri 1 Jakarta');
  const [subject, setSubject] = useState(selectedAssignmentSubject);
  const [classLabel, setClassLabel] = useState(selectedClassLabel);
  const [semesterLabel, setSemesterLabel] = useState(year?.semester === 2 ? 'Genap' : 'Ganjil');
  const [academicYearStr, setAcademicYearStr] = useState(year?.label || '2026/2027');
  const [tpTitle, setTpTitle] = useState('TP 3.1 & 3.2 (Analisis & Pengukuran Bangun Datar)');
  const [kktpThreshold, setKktpThreshold] = useState<number>(75);

  const [activeTab, setActiveTab] = useState<'remedial' | 'pengayaan' | 'dokumen' | 'soal'>('remedial');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Student master data
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const defaultData: StudentRecord[] = [
      {
        id: '1',
        nama: 'Ahmad Rizky',
        nis: '2425001',
        nilaiAwal: 60,
        tpBelumTuntas: 'TP 3.1 (Luas Segitiga)',
        intervensi: 'Bimbingan Khusus Perorangan',
        nilaiAkhir: 78,
        tuntas: true,
        kegiatanPengayaan: 'Pengerjaan Soal Pemecahan Masalah (HOTS)',
        hasilPengayaan: 88,
        keteranganPengayaan: 'Baik',
      },
      {
        id: '2',
        nama: 'Siti Aminah',
        nis: '2425002',
        nilaiAwal: 55,
        tpBelumTuntas: 'TP 3.1 & TP 3.2',
        intervensi: 'Pembelajaran Ulang + Latihan Soal',
        nilaiAkhir: 76,
        tuntas: true,
        kegiatanPengayaan: 'Analisis Studi Kasus Penerapan di Kehidupan',
        hasilPengayaan: 85,
        keteranganPengayaan: 'Baik',
      },
      {
        id: '3',
        nama: 'Budi Santoso',
        nis: '2425003',
        nilaiAwal: 68,
        tpBelumTuntas: 'TP 3.2 (Keliling Lingkaran)',
        intervensi: 'Penugasan Kelompok (Tutor Sebaya)',
        nilaiAkhir: 82,
        tuntas: true,
        kegiatanPengayaan: 'Menjadi Tutor Sebaya Kelompok Remedial',
        hasilPengayaan: 90,
        keteranganPengayaan: 'Sangat Baik',
      },
      {
        id: '4',
        nama: 'Dewa Made',
        nis: '2425004',
        nilaiAwal: 62,
        tpBelumTuntas: 'TP 3.1 (Luas Segitiga)',
        intervensi: 'Pengerjaan Ulang Soal Asesmen',
        nilaiAkhir: 75,
        tuntas: true,
        kegiatanPengayaan: 'Pengerjaan Soal Pemecahan Masalah (HOTS)',
        hasilPengayaan: 86,
        keteranganPengayaan: 'Baik',
      },
      {
        id: '5',
        nama: 'Eka Rahmawanti',
        nis: '2425005',
        nilaiAwal: 88,
        tpBelumTuntas: '-',
        intervensi: 'Pengayaan Mandiri',
        nilaiAkhir: 88,
        tuntas: true,
        kegiatanPengayaan: 'Pengerjaan Soal Pemecahan Masalah (HOTS)',
        hasilPengayaan: 95,
        keteranganPengayaan: 'Sangat Baik',
      },
      {
        id: '6',
        nama: 'Farhan Pratama',
        nis: '2425006',
        nilaiAwal: 92,
        tpBelumTuntas: '-',
        intervensi: 'Pengayaan Mandiri',
        nilaiAkhir: 92,
        tuntas: true,
        kegiatanPengayaan: 'Menjadi Tutor Sebaya Kelompok Remedial',
        hasilPengayaan: 98,
        keteranganPengayaan: 'Sangat Baik',
      },
      {
        id: '7',
        nama: 'Gita Gutawa',
        nis: '2425007',
        nilaiAwal: 85,
        tpBelumTuntas: '-',
        intervensi: 'Pengayaan Mandiri',
        nilaiAkhir: 85,
        tuntas: true,
        kegiatanPengayaan: 'Analisis Studi Kasus Penerapan di Kehidupan',
        hasilPengayaan: 90,
        keteranganPengayaan: 'Baik',
      },
    ];

    // Merge rest of sample students if available
    const extraStudents = sampleStudents7A.slice(7).map((s, idx) => {
      const scoreList = [58, 64, 72, 80, 90, 60, 94, 88, 70, 86, 74, 91, 65];
      const initial = scoreList[idx % scoreList.length];
      const isBelum = initial < 75;
      return {
        id: s.id,
        nama: s.name,
        nis: s.nis,
        nilaiAwal: initial,
        tpBelumTuntas: isBelum ? (idx % 2 === 0 ? 'TP 3.1 (Luas Segitiga)' : 'TP 3.2 (Keliling & Luas)') : '-',
        intervensi: isBelum
          ? initial < 50
            ? 'Pembelajaran Ulang seluruh materi'
            : idx % 2 === 0
            ? 'Bimbingan Khusus Perorangan'
            : 'Penugasan Kelompok (Tutor Sebaya)'
          : 'Pengayaan Mandiri',
        nilaiAkhir: isBelum ? Math.min(100, Math.max(75, initial + 18)) : initial,
        tuntas: true,
        kegiatanPengayaan: isBelum
          ? '-'
          : initial >= 90
          ? 'Menjadi Tutor Sebaya Kelompok Remedial'
          : 'Pengerjaan Soal Pemecahan Masalah (HOTS)',
        hasilPengayaan: isBelum ? initial : Math.min(100, initial + 7),
        keteranganPengayaan: initial >= 90 ? 'Sangat Baik' : 'Baik',
      };
    });

    return [...defaultData, ...extraStudents];
  });

  // Auto Split & Categorize Students based on KKTP
  const remedialData = useMemo(() => {
    return students.filter((s) => s.nilaiAwal < kktpThreshold);
  }, [students, kktpThreshold]);

  const pengayaanData = useMemo(() => {
    return students.filter((s) => s.nilaiAwal >= kktpThreshold);
  }, [students, kktpThreshold]);

  // Auto-Split Action function
  const handleAutoSplit = () => {
    setStudents((prev) =>
      prev.map((s) => {
        const isBelum = s.nilaiAwal < kktpThreshold;

        let intervensi = s.intervensi;
        if (isBelum) {
          if (s.nilaiAwal < kktpThreshold * 0.5) {
            intervensi = 'Pembelajaran Ulang seluruh materi';
          } else if (s.nilaiAwal < 60) {
            intervensi = 'Bimbingan Khusus Perorangan';
          } else if (s.nilaiAwal < 68) {
            intervensi = 'Pembelajaran Ulang + Latihan Soal';
          } else if (s.nilaiAwal < 72) {
            intervensi = 'Penugasan Kelompok (Tutor Sebaya)';
          } else {
            intervensi = 'Pengerjaan Ulang Soal Asesmen';
          }
        }

        const nilaiAkhirRemedial = isBelum ? Math.min(100, Math.max(kktpThreshold, s.nilaiAwal + 18)) : s.nilaiAwal;

        let kegiatanPengayaan = s.kegiatanPengayaan;
        let hasilPengayaan = s.hasilPengayaan;
        let keteranganPengayaan = s.keteranganPengayaan;

        if (!isBelum) {
          if (s.nilaiAwal >= 90) {
            kegiatanPengayaan = 'Menjadi Tutor Sebaya Kelompok Remedial';
            hasilPengayaan = Math.min(100, s.nilaiAwal + 6);
            keteranganPengayaan = 'Sangat Baik';
          } else if (s.nilaiAwal >= 82) {
            kegiatanPengayaan = 'Pengerjaan Soal Pemecahan Masalah (HOTS)';
            hasilPengayaan = Math.min(100, s.nilaiAwal + 7);
            keteranganPengayaan = 'Sangat Baik';
          } else {
            kegiatanPengayaan = 'Analisis Studi Kasus Penerapan di Kehidupan';
            hasilPengayaan = Math.min(100, s.nilaiAwal + 5);
            keteranganPengayaan = 'Baik';
          }
        }

        return {
          ...s,
          tpBelumTuntas: isBelum ? (s.tpBelumTuntas && s.tpBelumTuntas !== '-' ? s.tpBelumTuntas : 'TP 3.1 & 3.2') : '-',
          intervensi,
          nilaiAkhir: nilaiAkhirRemedial,
          tuntas: true,
          kegiatanPengayaan,
          hasilPengayaan,
          keteranganPengayaan,
        };
      })
    );
  };

  // Add new student
  const handleAddStudent = () => {
    const newId = String(Date.now());
    const newStudent: StudentRecord = {
      id: newId,
      nama: 'Siswa Baru',
      nis: `2425${Math.floor(100 + Math.random() * 900)}`,
      nilaiAwal: 65,
      tpBelumTuntas: 'TP 3.1 (Luas Segitiga)',
      intervensi: 'Bimbingan Khusus Perorangan',
      nilaiAkhir: 78,
      tuntas: true,
      kegiatanPengayaan: 'Pengerjaan Soal Pemecahan Masalah (HOTS)',
      hasilPengayaan: 85,
      keteranganPengayaan: 'Baik',
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  // Update student field
  const handleUpdateStudent = (id: string, field: keyof StudentRecord, value: any) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Export Excel
  const handleExportExcel = () => {
    exportToExcel('remedial-document-container', `Program_Remedial_Pengayaan_${classLabel}.xlsx`, 'Program Remedial');
  };

  // Print popup
  const handlePrintNewWindow = () => {
    const element = document.getElementById('remedial-document-container');
    if (!element) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=950,height=1000');
    if (!printWindow) {
      alert('Popup diblokir oleh browser. Silakan izinkan popup.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>Program Remedial & Pengayaan - ${subject} ${classLabel}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
            body {
              font-family: 'Times New Roman', Times, serif !important;
              background-color: white !important;
              color: black !important;
              padding: 20px;
            }
            .no-print { display: none !important; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 6px; }
            @page { size: A4 portrait; margin: 15mm; }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 400)">
          <div class="p-2">
            ${element.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Copy document format as text/markdown for Word/Excel
  const handleCopyText = () => {
    let docText = `PROGRAM REMEDIAL & PENGAYAAN\n`;
    docText += `Nama Sekolah: ${schoolName}\n`;
    docText += `Mata Pelajaran: ${subject}\n`;
    docText += `Kelas / Semester: ${classLabel} / ${semesterLabel}\n`;
    docText += `Tahun Ajaran: ${academicYearStr}\n`;
    docText += `Tujuan Pembelajaran: ${tpTitle}\n`;
    docText += `KKTP: ${kktpThreshold}\n\n`;

    docText += `A. TABEL PROGRAM REMEDIAL (Nilai < ${kktpThreshold})\n`;
    docText += `No\tNama Siswa\tNilai Awal\tTP Belum Tuntas\tBentuk Intervensi\tNilai Akhir\tKeterangan\n`;
    remedialData.forEach((s, idx) => {
      docText += `${idx + 1}\t${s.nama}\t${s.nilaiAwal}\t${s.tpBelumTuntas}\t${s.intervensi}\t${s.nilaiAkhir}\t${s.nilaiAkhir >= kktpThreshold ? 'Tuntas' : 'Belum Tuntas'}\n`;
    });

    docText += `\nB. TABEL PROGRAM PENGAYAAN (Nilai >= ${kktpThreshold})\n`;
    docText += `No\tNama Siswa\tNilai Awal\tBentuk Kegiatan Pengayaan\tHasil / Nilai Akhir\tKeterangan\n`;
    pengayaanData.forEach((s, idx) => {
      docText += `${idx + 1}\t${s.nama}\t${s.nilaiAwal}\t${s.kegiatanPengayaan}\t${s.hasilPengayaan}\t${s.keteranganPengayaan}\n`;
    });

    navigator.clipboard.writeText(docText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                Kurikulum Merdeka Standard
              </span>
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider">
                KKTP Target: {kktpThreshold}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Program Remedial & Pengayaan</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Otomatis memilah data siswa tuntas dan belum tuntas berbasis KKTP, menyusun bentuk intervensi bimbingan terstruktur, serta mencetak tabel dokumen resmi siap salin ke Word/Excel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleAutoSplit}
              className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 text-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Auto-Split Nilai Sumatif</span>
            </button>
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 text-xs"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>Copy Text/Word</span>
                </>
              )}
            </button>
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 text-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handlePrintNewWindow}
              className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 text-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── FORM IDENTITAS DOKUMEN ── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 no-print">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>📌 Form Identitas Dokumen</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Lengkapi atribut identitas resmi di bawah
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Nama Sekolah</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Mata Pelajaran</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              {STANDARD_SUBJECT_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              {subject && !STANDARD_SUBJECT_OPTIONS.includes(subject) && (
                <option value={subject}>{subject}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Kelas / Semester</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={classLabel}
                onChange={(e) => setClassLabel(e.target.value)}
                className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                placeholder="VII-A"
              />
              <select
                value={semesterLabel}
                onChange={(e) => setSemesterLabel(e.target.value)}
                className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Tahun Ajaran</label>
            <input
              type="text"
              value={academicYearStr}
              onChange={(e) => setAcademicYearStr(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
              Tujuan Pembelajaran (TP)
            </label>
            <input
              type="text"
              value={tpTitle}
              onChange={(e) => setTpTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
              KKTP (Kriteria Ketuntasan Minimal): <span className="text-amber-600 font-extrabold">{kktpThreshold}</span>
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range"
                min={60}
                max={85}
                step={1}
                value={kktpThreshold}
                onChange={(e) => setKktpThreshold(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <input
                type="number"
                value={kktpThreshold}
                onChange={(e) => setKktpThreshold(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-amber-50 border border-amber-300 font-bold text-center text-amber-900 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 no-print">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Total Siswa</div>
            <div className="text-lg font-black text-slate-900">{students.length} Orang</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-800 uppercase">Perlu Remedial</div>
            <div className="text-lg font-black text-amber-900">{remedialData.length} Siswa</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-600 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-800 uppercase">Peserta Pengayaan</div>
            <div className="text-lg font-black text-emerald-900">{pengayaanData.length} Siswa</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-600 text-white">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-indigo-800 uppercase">Persentase Tuntas</div>
            <div className="text-lg font-black text-indigo-900">
              {Math.round((pengayaanData.length / (students.length || 1)) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB SELECTOR ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('remedial')}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'remedial'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>🅰️ Siswa Remedial ({remedialData.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pengayaan')}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'pengayaan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🅱️ Siswa Pengayaan ({pengayaanData.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dokumen')}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'dokumen'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>📋 Format Document (Lengkap Cetak / Copy)</span>
          </button>

          <button
            onClick={() => setActiveTab('soal')}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'soal'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>⚡ Soal Remedial & Pengayaan TP</span>
          </button>
        </div>

        <button
          onClick={handleAddStudent}
          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Tambah Siswa</span>
        </button>
      </div>

      {/* ── TAB CONTENT 1: TABEL PROGRAM REMEDIAL ── */}
      {activeTab === 'remedial' && (
        <div className="space-y-4 no-print">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Catatan Bentuk Intervensi Remedial:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                <li>Nilai &lt; 50% KKTP (&lt; {Math.round(kktpThreshold * 0.5)}): <strong>Pembelajaran Ulang seluruh materi</strong>.</li>
                <li>Nilai 50% - 75% KKTP ({Math.round(kktpThreshold * 0.5)} - {kktpThreshold - 1}): <strong>Bimbingan Perorangan / Penugasan Kelompok / Tutor Sebaya</strong>.</li>
              </ul>
            </div>

            <button
              onClick={handleAutoSplit}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Assign Rules</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-900 text-white font-extrabold text-xs flex items-center justify-between">
              <span>🅰️ TABEL PROGRAM REMEDIAL (Siswa Nilai &lt; {kktpThreshold})</span>
              <span className="text-[11px] text-amber-400 font-bold">{remedialData.length} Siswa</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100 uppercase text-[10px] font-extrabold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-center w-12">No</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3 text-center w-20">Nilai Awal</th>
                    <th className="p-3">Indikator / TP Belum Tuntas</th>
                    <th className="p-3">Bentuk Intervensi / Remedial</th>
                    <th className="p-3 text-center w-24">Nilai Akhir</th>
                    <th className="p-3 text-center w-24">Keterangan</th>
                    <th className="p-3 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {remedialData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400 italic">
                        Semua siswa tuntas! Tidak ada siswa yang memerlukan remedial.
                      </td>
                    </tr>
                  ) : (
                    remedialData.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-amber-50/30 transition">
                        <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={s.nama}
                            onChange={(e) => handleUpdateStudent(s.id, 'nama', e.target.value)}
                            className="font-bold text-slate-900 bg-transparent focus:bg-amber-100/50 px-1 rounded w-full border-b border-transparent hover:border-slate-300"
                          />
                        </td>
                        <td className="p-3 text-center font-bold text-rose-600">
                          <input
                            type="number"
                            value={s.nilaiAwal}
                            onChange={(e) => handleUpdateStudent(s.id, 'nilaiAwal', Number(e.target.value))}
                            className="w-14 text-center font-extrabold bg-rose-50 text-rose-700 border border-rose-200 rounded py-0.5 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={s.tpBelumTuntas}
                            onChange={(e) => handleUpdateStudent(s.id, 'tpBelumTuntas', e.target.value)}
                            className="w-full bg-transparent focus:bg-amber-100/50 px-1 rounded text-slate-700"
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={s.intervensi}
                            onChange={(e) => handleUpdateStudent(s.id, 'intervensi', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-xs rounded px-2 py-1 font-medium text-slate-800"
                          >
                            <option value="Pembelajaran Ulang seluruh materi">Pembelajaran Ulang seluruh materi</option>
                            <option value="Bimbingan Khusus Perorangan">Bimbingan Khusus Perorangan</option>
                            <option value="Pembelajaran Ulang + Latihan Soal">Pembelajaran Ulang + Latihan Soal</option>
                            <option value="Penugasan Kelompok (Tutor Sebaya)">Penugasan Kelompok (Tutor Sebaya)</option>
                            <option value="Pengerjaan Ulang Soal Asesmen">Pengerjaan Ulang Soal Asesmen</option>
                          </select>
                        </td>
                        <td className="p-3 text-center font-bold text-emerald-700">
                          <input
                            type="number"
                            value={s.nilaiAkhir}
                            onChange={(e) => handleUpdateStudent(s.id, 'nilaiAkhir', Number(e.target.value))}
                            className="w-14 text-center font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded py-0.5 text-xs"
                          />
                        </td>
                        <td className="p-3 text-center">
                          {s.nilaiAkhir >= kktpThreshold ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-extrabold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tuntas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px] font-extrabold">
                              Belum Tuntas
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteStudent(s.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 2: TABEL PROGRAM PENGAYAAN ── */}
      {activeTab === 'pengayaan' && (
        <div className="space-y-4 no-print">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Program Pengayaan Kurikulum Merdeka (Nilai &ge; {kktpThreshold})</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Diberikan kepada siswa yang telah tuntas KKTP untuk memperdalam pemahaman melalui soal HOTS, studi kasus, atau menjadi tutor sebaya.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-3 bg-emerald-900 text-white font-extrabold text-xs flex items-center justify-between">
              <span>🅱️ TABEL PROGRAM PENGAYAAN (Siswa Nilai &ge; {kktpThreshold})</span>
              <span className="text-[11px] text-emerald-300 font-bold">{pengayaanData.length} Siswa</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100 uppercase text-[10px] font-extrabold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-center w-12">No</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3 text-center w-20">Nilai Awal</th>
                    <th className="p-3">Bentuk Kegiatan Pengayaan</th>
                    <th className="p-3 text-center w-28">Hasil / Nilai Akhir</th>
                    <th className="p-3 text-center w-28">Keterangan</th>
                    <th className="p-3 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pengayaanData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                        Belum ada siswa yang mencapai KKTP.
                      </td>
                    </tr>
                  ) : (
                    pengayaanData.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-emerald-50/30 transition">
                        <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={s.nama}
                            onChange={(e) => handleUpdateStudent(s.id, 'nama', e.target.value)}
                            className="font-bold text-slate-900 bg-transparent focus:bg-emerald-100/50 px-1 rounded w-full border-b border-transparent hover:border-slate-300"
                          />
                        </td>
                        <td className="p-3 text-center font-bold text-amber-700">
                          <input
                            type="number"
                            value={s.nilaiAwal}
                            onChange={(e) => handleUpdateStudent(s.id, 'nilaiAwal', Number(e.target.value))}
                            className="w-14 text-center font-extrabold bg-amber-50 text-amber-800 border border-amber-200 rounded py-0.5 text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={s.kegiatanPengayaan}
                            onChange={(e) => handleUpdateStudent(s.id, 'kegiatanPengayaan', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-xs rounded px-2 py-1 font-medium text-slate-800"
                          >
                            <option value="Pengerjaan Soal Pemecahan Masalah (HOTS)">
                              Pengerjaan Soal Pemecahan Masalah (HOTS)
                            </option>
                            <option value="Menjadi Tutor Sebaya Kelompok Remedial">
                              Menjadi Tutor Sebaya Kelompok Remedial
                            </option>
                            <option value="Analisis Studi Kasus Penerapan di Kehidupan">
                              Analisis Studi Kasus Penerapan di Kehidupan
                            </option>
                          </select>
                        </td>
                        <td className="p-3 text-center font-bold text-emerald-700">
                          <input
                            type="number"
                            value={s.hasilPengayaan}
                            onChange={(e) => handleUpdateStudent(s.id, 'hasilPengayaan', Number(e.target.value))}
                            className="w-16 text-center font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded py-0.5 text-xs"
                          />
                        </td>
                        <td className="p-3 text-center font-bold text-slate-700">
                          <select
                            value={s.keteranganPengayaan}
                            onChange={(e) => handleUpdateStudent(s.id, 'keteranganPengayaan', e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-xs rounded px-2 py-1 font-semibold text-slate-800"
                          >
                            <option value="Sangat Baik">Sangat Baik</option>
                            <option value="Baik">Baik</option>
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteStudent(s.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT 3 & PRINT-READY DOCUMENT CONTAINER ── */}
      <div
        id="remedial-document-container"
        className={`bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-300 text-black font-serif text-xs leading-relaxed space-y-6 ${
          activeTab !== 'dokumen' ? 'hidden print:block' : ''
        }`}
      >
        {/* KOP DOKUMEN RESMI */}
        <div className="text-center border-b-2 border-black pb-4">
          <h1 className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-900">
            {schoolName}
          </h1>
          <h2 className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-800">
            PROGRAM REMEDIAL & PENGAYAAN KURIKULUM MERDEKA
          </h2>
          <div className="text-[11px] font-bold text-slate-800">
            TAHUN AJARAN {academicYearStr} — SEMESTER {semesterLabel.toUpperCase()}
          </div>
        </div>

        {/* FORM IDENTITAS DOKUMEN (PRINT/DOCUMENT FORMAT) */}
        <div className="border border-black p-3 rounded bg-slate-50/80 text-[11px] font-semibold space-y-1">
          <div className="font-bold text-slate-900 border-b border-black/20 pb-1 uppercase mb-1">
            📌 Form Identitas Dokumen
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <div>
              <span className="text-slate-600">• Nama Sekolah:</span> <strong>{schoolName}</strong>
            </div>
            <div>
              <span className="text-slate-600">• Mata Pelajaran:</span> <strong>{subject}</strong>
            </div>
            <div>
              <span className="text-slate-600">• Kelas / Semester:</span> <strong>{classLabel} / {semesterLabel}</strong>
            </div>
            <div>
              <span className="text-slate-600">• Tahun Ajaran:</span> <strong>{academicYearStr}</strong>
            </div>
            <div className="col-span-2">
              <span className="text-slate-600">• Tujuan Pembelajaran (TP):</span> <strong>{tpTitle}</strong>
            </div>
            <div className="col-span-2">
              <span className="text-slate-600">• KKTP (Kriteria Ketuntasan):</span> <strong>{kktpThreshold} Point</strong>
            </div>
          </div>
        </div>

        {/* 🅰️ TABEL PROGRAM REMEDIAL */}
        <div className="space-y-2">
          <div className="font-extrabold uppercase text-xs text-slate-900 border-b border-black pb-1">
            🅰️ TABEL PROGRAM REMEDIAL (Diberikan kepada siswa yang nilainya di bawah KKTP / &lt; {kktpThreshold})
          </div>

          <table className="w-full border-collapse border border-black text-[10px]">
            <thead>
              <tr className="bg-slate-100 border-b border-black">
                <th className="border border-black p-1.5 text-center w-8">No</th>
                <th className="border border-black p-1.5 text-left w-36">Nama Siswa</th>
                <th className="border border-black p-1.5 text-center w-16">Nilai Awal</th>
                <th className="border border-black p-1.5 text-left">Indikator / TP Belum Tuntas</th>
                <th className="border border-black p-1.5 text-left">Bentuk Intervensi / Remedial</th>
                <th className="border border-black p-1.5 text-center w-16">Nilai Akhir</th>
                <th className="border border-black p-1.5 text-center w-20">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {remedialData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border border-black p-2 text-center text-slate-500 italic">
                    Nihil (Seluruh siswa tuntas mencapai KKTP)
                  </td>
                </tr>
              ) : (
                remedialData.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                    <td className="border border-black p-1.5 font-bold">{s.nama}</td>
                    <td className="border border-black p-1.5 text-center font-bold text-rose-800">{s.nilaiAwal}</td>
                    <td className="border border-black p-1.5">{s.tpBelumTuntas}</td>
                    <td className="border border-black p-1.5">{s.intervensi}</td>
                    <td className="border border-black p-1.5 text-center font-bold">{s.nilaiAkhir}</td>
                    <td className="border border-black p-1.5 text-center font-bold text-emerald-800">
                      {s.nilaiAkhir >= kktpThreshold ? 'Tuntas' : 'Belum Tuntas'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="text-[10px] text-slate-700 italic space-y-0.5 pt-1">
            <div>Catatan Bentuk Intervensi Remedial:</div>
            <div className="pl-2">• Nilai &lt; 50% dari KKTP (&lt; {Math.round(kktpThreshold * 0.5)}): Pembelajaran Ulang seluruh materi.</div>
            <div className="pl-2">• Nilai 50% - 75% dari KKTP ({Math.round(kktpThreshold * 0.5)} - {kktpThreshold - 1}): Bimbingan Perorangan / Penugasan Kelompok / Tutor Sebaya.</div>
          </div>
        </div>

        {/* 🅱️ TABEL PROGRAM PENGAYAAN */}
        <div className="space-y-2 pt-4">
          <div className="font-extrabold uppercase text-xs text-slate-900 border-b border-black pb-1">
            🅱️ TABEL PROGRAM PENGAYAAN (Diberikan kepada siswa yang nilainya mencapai/melampaui KKTP / &ge; {kktpThreshold})
          </div>

          <table className="w-full border-collapse border border-black text-[10px]">
            <thead>
              <tr className="bg-slate-100 border-b border-black">
                <th className="border border-black p-1.5 text-center w-8">No</th>
                <th className="border border-black p-1.5 text-left w-36">Nama Siswa</th>
                <th className="border border-black p-1.5 text-center w-16">Nilai Awal</th>
                <th className="border border-black p-1.5 text-left">Bentuk Kegiatan Pengayaan</th>
                <th className="border border-black p-1.5 text-center w-20">Hasil / Nilai Akhir</th>
                <th className="border border-black p-1.5 text-center w-24">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {pengayaanData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-black p-2 text-center text-slate-500 italic">
                    Nihil (Belum ada siswa mencapai KKTP)
                  </td>
                </tr>
              ) : (
                pengayaanData.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                    <td className="border border-black p-1.5 font-bold">{s.nama}</td>
                    <td className="border border-black p-1.5 text-center font-bold text-amber-800">{s.nilaiAwal}</td>
                    <td className="border border-black p-1.5">{s.kegiatanPengayaan}</td>
                    <td className="border border-black p-1.5 text-center font-bold text-emerald-800">{s.hasilPengayaan}</td>
                    <td className="border border-black p-1.5 text-center font-bold">{s.keteranganPengayaan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* TANDA TANGAN FORMAL */}
        <div className="mt-8 pt-4 border-t border-slate-400 grid grid-cols-2 text-center text-[11px]">
          <div>
            <div>Mengetahui,</div>
            <div className="font-bold uppercase">Kepala {schoolName}</div>
            <div className="h-16" />
            <div className="font-bold underline uppercase">{school?.headmasterName || 'DR. H. SURYADI, M.PD.'}</div>
            <div>NIP. {school?.headmasterNip || '19750312 200003 1 002'}</div>
          </div>

          <div>
            <div>Jakarta, 12 Agustus 2026</div>
            <div className="font-bold uppercase">Guru Mata Pelajaran</div>
            <div className="h-16" />
            <div className="font-bold underline uppercase">{teacher?.name || 'EMIR AMDANI, S.PD.'}</div>
            <div>NIP. {teacher?.nip || '19880514 201502 1 001'}</div>
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT 4: SOAL REMEDIAL & PENGAYAAN GENERATOR ── */}
      {activeTab === 'soal' && (
        <div className="space-y-6 no-print">
          <div className="bg-indigo-900 text-white p-5 rounded-2xl shadow-md border border-indigo-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black rounded text-[10px] uppercase">
                  Auto-Soal TP
                </span>
                <span className="text-xs text-indigo-200 font-semibold">{tpTitle}</span>
              </div>
              <h3 className="text-lg font-extrabold text-white">
                Bank Soal Interaktif Remedial &amp; Pengayaan
              </h3>
              <p className="text-xs text-indigo-200">
                Disusun khusus berbasis Indikator Capaian TP 3.1 &amp; TP 3.2 beserta Kunci Jawaban dan Pedoman Penskoran.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `SOAL REMEDIAL & PENGAYAAN ${subject}\nTP: ${tpTitle}\n\n1. Hitunglah luas segitiga dengan alas 12 cm dan tinggi 8 cm!\nKunci: Luas = 1/2 x a x t = 1/2 x 12 x 8 = 48 cm²\n\n2. Sebuah keliling lingkaran adalah 44 cm. Tentukan jari-jari lingkaran tersebut! (π = 22/7)\nKunci: K = 2 x π x r -> 44 = 2 x (22/7) x r -> r = 7 cm`
                );
                alert('Soal Remedial & Pengayaan berhasil disalin ke clipboard!');
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0"
            >
              <Copy className="w-4 h-4" />
              <span>Salin Paket Soal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Remedial Question Card */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="font-extrabold text-xs text-amber-900 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Paket Soal Remedial (Penguatan Dasar)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                  2 Soal
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-800">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">
                    Soal 1 (TP 3.1 - Luas Segitiga):
                  </div>
                  <p>
                    Sebuah segitiga siku-siku memiliki panjang alas 12 cm dan tinggi 8 cm. Hitunglah luas segitiga tersebut!
                  </p>
                  <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-[11px] font-mono text-amber-900">
                    <strong>Kunci Jawaban:</strong> Luas = ½ × alas × tinggi = ½ × 12 × 8 = 48 cm².
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">
                    Soal 2 (TP 3.2 - Keliling Lingkaran):
                  </div>
                  <p>
                    Suatu taman berbentuk lingkaran memiliki keliling 44 cm. Tentukan panjang jari-jari taman tersebut! (Gunakan π = 22/7)
                  </p>
                  <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-[11px] font-mono text-amber-900">
                    <strong>Kunci Jawaban:</strong> Keliling = 2 × π × r &rarr; 44 = 2 × (22/7) × r &rarr; r = 7 cm.
                  </div>
                </div>
              </div>
            </div>

            {/* Pengayaan Question Card */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <span className="font-extrabold text-xs text-emerald-900 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Paket Soal Pengayaan (Tantangan HOTS)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  2 Soal
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-800">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">
                    Soal Tantangan 1 (Penalaran Bangun Datar Combined):
                  </div>
                  <p>
                    Sebuah persegi panjang memiliki keliling 60 cm. Jika panjangnya 3 cm lebih dari lebarnya, tentukan luas persegi panjang tersebut dan kaitkan dengan luas segitiga ber-alas p dan tinggi l!
                  </p>
                  <div className="mt-2 p-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] font-mono text-emerald-900">
                    <strong>Kunci Jawaban:</strong> 2(p+l) = 60 &rarr; p+l = 30. p = l+3 &rarr; 2l+3 = 30 &rarr; l = 13.5 cm, p = 16.5 cm. Luas = 222.75 cm².
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">
                    Soal Tantangan 2 (Tutor Sebaya & Pemodelan):
                  </div>
                  <p>
                    Susunlah langkah-langkah bimbingan tutor sebaya untuk membantu temanmu memahami perbedaan rumus keliling dan luas lingkaran secara visual!
                  </p>
                  <div className="mt-2 p-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] font-mono text-emerald-900">
                    <strong>Kunci Jawaban:</strong> Penilaian berdasarkan kejelasan analogi (misal: pagar melingkar vs rumput di dalam taman) & keteraturan penjelasan.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
