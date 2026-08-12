import React, { useState } from 'react';
import type { SchoolProfile, TeacherProfile, AcademicYear } from '../../types';
import { smartPrint } from '../../utils/printHelper';
import {
  RecordPelanggaranPiket,
  RecordKonselingBK,
  StudentEkskul,
  DailyClassAttendance,
  initialViolationRules,
  initialPiketRecords,
  initialBkRecords,
  initialEkskulList,
  initialEkskulStudents,
  initialClassAttendance,
} from '../../data/samplePiketBkData';
import {
  ShieldAlert,
  HeartHandshake,
  Award,
  Printer,
  Settings,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Clock,
  FileText,
  Sparkles,
  Search,
  Filter,
  Download,
  Send,
  FileSpreadsheet,
  Mail,
  Calendar,
  ChevronRight,
  Edit3,
  UserX,
} from 'lucide-react';

interface PiketBkEkstraGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  initialTab?: 'piket' | 'poin-pelanggaran' | 'bk' | 'ekskul';
}

export const PiketBkEkstraGenerator: React.FC<PiketBkEkstraGeneratorProps> = ({
  school,
  teacher,
  year,
  initialTab = 'piket',
}) => {
  const [activeTab, setActiveTab] = useState<'piket' | 'poin-pelanggaran' | 'bk' | 'ekskul'>(initialTab);

  // Sync activeTab if initialTab changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Kop & Signatures
  const [kop, setKop] = useState({
    schoolName: school.name || 'SMP NEGERI 1 BANTAN',
    headmasterName: school.headmasterName || 'Drs. H. M. YUSUF, M.Pd.',
    headmasterNip: school.headmasterNip || '19680512 199403 1 004',
    officerName: teacher.name || 'SITI AMINAH, S.Pd.',
    officerNip: teacher.nip || '19850410 201001 2 015',
    dateLocation: 'Bantan, 20 Juli 2025',
  });

  const [isEditingKop, setIsEditingKop] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Filters & Search
  const [searchPiket, setSearchPiket] = useState<string>('');
  const [piketCategoryFilter, setPiketCategoryFilter] = useState<string>('semua');
  const [poinClassFilter, setPoinClassFilter] = useState<string>('semua');
  const [poinStatusFilter, setPoinStatusFilter] = useState<string>('semua');
  const [searchBk, setSearchBk] = useState<string>('');
  const [bkBidangFilter, setBkBidangFilter] = useState<string>('semua');

  // SP Modal Student State
  const [selectedSpStudent, setSelectedSpStudent] = useState<{
    nama: string;
    kelas: string;
    nisn: string;
    poin: number;
    records: RecordPelanggaranPiket[];
  } | null>(null);

  const [spForm, setSpForm] = useState({
    type: 'Surat Peringatan I (SP-1)' as 'Surat Teguran Kedisiplinan' | 'Surat Peringatan I (SP-1)' | 'Surat Peringatan II (SP-2)' | 'Surat Pemanggilan Orang Tua',
    nomor: '421.3 / 108 / SMP-01 / 2025',
    tanggalSurat: new Date().toISOString().split('T')[0],
    panggilanHariTanggal: 'Senin, 28 Juli 2025',
    panggilanJam: '08.30 WIB',
    panggilanTempat: 'Ruang Bimbingan Konseling (BK)',
    catatanKhusus: 'Mohon hadir tepat waktu demi keberlanjutan pembinaan kedisiplinan dan masa depan belajar peserta didik.',
  });

  // Master Rules
  const [violationRules, setViolationRules] = useState(initialViolationRules);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [newRuleInput, setNewRuleInput] = useState<{ kategori: RecordPelanggaranPiket['kategori']; nama: string; poin: number }>({
    kategori: 'Keterlambatan',
    nama: '',
    poin: 5,
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Student History Detail Modal State
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<{
    nama: string;
    kelas: string;
    nisn: string;
    poin: number;
    records: RecordPelanggaranPiket[];
    bkRecords: RecordKonselingBK[];
  } | null>(null);

  // ── DATA STATE: REKAP ABSENSI HARIAN PIKET PER KELAS ──
  const [classAttendance, setClassAttendance] = useState<DailyClassAttendance[]>(initialClassAttendance);
  const [newAbsenceInput, setNewAbsenceInput] = useState({
    kelas: 'VII-A',
    nama: '',
    nisn: '',
    keterangan: 'Sakit' as 'Sakit' | 'Izin' | 'Alpa' | 'Bolos/Cabut',
    alasan: '',
  });

  const handleAddAbsence = () => {
    if (!newAbsenceInput.nama) {
      showToast('Isi nama siswa yang berhalangan hadir!');
      return;
    }
    setClassAttendance((prev) =>
      prev.map((c) => {
        if (c.kelas === newAbsenceInput.kelas) {
          const newAbs = [
            ...c.absenStudents,
            {
              id: `abs-${Date.now()}`,
              nama: newAbsenceInput.nama,
              nisn: newAbsenceInput.nisn || '0081234500',
              keterangan: newAbsenceInput.keterangan,
              alasan: newAbsenceInput.alasan || 'Tanpa keterangan tambahan',
            },
          ];
          const sCount = newAbs.filter((a) => a.keterangan === 'Sakit').length;
          const iCount = newAbs.filter((a) => a.keterangan === 'Izin').length;
          const aCount = newAbs.filter((a) => a.keterangan === 'Alpa' || a.keterangan === 'Bolos/Cabut').length;
          const totalAbs = newAbs.length;
          return {
            ...c,
            sakit: sCount,
            izin: iCount,
            alpa: aCount,
            hadir: Math.max(0, c.totalSiswa - totalAbs),
            absenStudents: newAbs,
          };
        }
        return c;
      })
    );
    setNewAbsenceInput({ kelas: newAbsenceInput.kelas, nama: '', nisn: '', keterangan: 'Sakit', alasan: '' });
    showToast(`Ketidakhadiran ${newAbsenceInput.nama} berhasil dicatat di Laporan Piket!`);
  };

  const handleDeleteAbsence = (kelas: string, absId: string) => {
    setClassAttendance((prev) =>
      prev.map((c) => {
        if (c.kelas === kelas) {
          const newAbs = c.absenStudents.filter((a) => a.id !== absId);
          const sCount = newAbs.filter((a) => a.keterangan === 'Sakit').length;
          const iCount = newAbs.filter((a) => a.keterangan === 'Izin').length;
          const aCount = newAbs.filter((a) => a.keterangan === 'Alpa' || a.keterangan === 'Bolos/Cabut').length;
          const totalAbs = newAbs.length;
          return {
            ...c,
            sakit: sCount,
            izin: iCount,
            alpa: aCount,
            hadir: Math.max(0, c.totalSiswa - totalAbs),
            absenStudents: newAbs,
          };
        }
        return c;
      })
    );
    showToast('Data ketidakhadiran siswa berhasil dihapus!');
  };

  // ── DATA STATE: PIKET ──
  const [piketRecords, setPiketRecords] = useState<RecordPelanggaranPiket[]>(initialPiketRecords);

  const [newPiket, setNewPiket] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jamKe: '1 (07.15)',
    nisn: '',
    namaSiswa: '',
    kelas: 'VII-A',
    jenisPelanggaran: '',
    kategori: 'Keterlambatan' as RecordPelanggaranPiket['kategori'],
    poin: 5,
    tindakanPiket: '',
    statusDisposisi: 'Selesai di Piket' as RecordPelanggaranPiket['statusDisposisi'],
  });

  const handleAddPiket = () => {
    if (!newPiket.namaSiswa || !newPiket.jenisPelanggaran) {
      showToast('Isi nama siswa dan jenis pelanggaran terlebih dahulu!');
      return;
    }

    const record: RecordPelanggaranPiket = {
      ...newPiket,
      id: `piket-${Date.now()}`,
    };

    setPiketRecords([record, ...piketRecords]);
    setNewPiket({
      tanggal: new Date().toISOString().split('T')[0],
      jamKe: '1 (07.15)',
      nisn: '',
      namaSiswa: '',
      kelas: 'VII-A',
      jenisPelanggaran: '',
      kategori: 'Keterlambatan',
      poin: 5,
      tindakanPiket: '',
      statusDisposisi: 'Selesai di Piket',
    });

    if (record.statusDisposisi === 'Rujukan ke Guru BK') {
      const autoBk: RecordKonselingBK = {
        id: `bk-${Date.now()}`,
        tanggal: record.tanggal,
        nisn: record.nisn || '0081234500',
        namaSiswa: record.namaSiswa,
        kelas: record.kelas,
        bidangBimbingan: 'Pribadi',
        jenisLayanan: 'Konseling Individual',
        keluhanMasalah: `Rujukan Piket: ${record.jenisPelanggaran} (${record.poin} Poin)`,
        pendekatanSolusi: 'Konseling rasional emotif & klarifikasi komitmen tata tertib',
        tindakLanjut: 'Monitoring perilaku mingguan bersama wali kelas',
        status: 'Dalam Proses',
      };
      setBkRecords([autoBk, ...bkRecords]);
      showToast('Data dicatat & OTOMATIS DITERUSKAN ke Layanan Guru BK!');
    } else {
      showToast('Catatan Guru Piket berhasil ditambahkan!');
    }
  };

  const handleDeletePiket = (id: string) => {
    setPiketRecords(piketRecords.filter((p) => p.id !== id));
    showToast('Catatan piket berhasil dihapus!');
  };

  const handleForwardPiketToBk = (p: RecordPelanggaranPiket) => {
    const autoBk: RecordKonselingBK = {
      id: `bk-${Date.now()}`,
      tanggal: p.tanggal,
      nisn: p.nisn || '0081234500',
      namaSiswa: p.namaSiswa,
      kelas: p.kelas,
      bidangBimbingan: 'Pribadi',
      jenisLayanan: 'Konseling Individual',
      keluhanMasalah: `Rujukan Piket: ${p.jenisPelanggaran} (+${p.poin} Poin)`,
      pendekatanSolusi: 'Penyusunan kesepakatan komitmen tata tertib',
      tindakLanjut: 'Monitoring kedisiplinan mingguan',
      status: 'Dalam Proses',
    };
    setPiketRecords(
      piketRecords.map((item) =>
        item.id === p.id ? { ...item, statusDisposisi: 'Rujukan ke Guru BK' } : item
      )
    );
    setBkRecords([autoBk, ...bkRecords]);
    showToast(`Kasus ${p.namaSiswa} berhasil diteruskan ke Bimbingan Konseling!`);
  };

  // ── DATA STATE: GURU BK ──
  const [bkRecords, setBkRecords] = useState<RecordKonselingBK[]>(initialBkRecords);

  const [newBk, setNewBk] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    nisn: '',
    namaSiswa: '',
    kelas: 'VII-A',
    bidangBimbingan: 'Pribadi' as RecordKonselingBK['bidangBimbingan'],
    jenisLayanan: 'Konseling Individual' as RecordKonselingBK['jenisLayanan'],
    keluhanMasalah: '',
    pendekatanSolusi: '',
    tindakLanjut: '',
    status: 'Dalam Proses' as RecordKonselingBK['status'],
  });

  const handleAddBk = () => {
    if (!newBk.namaSiswa || !newBk.keluhanMasalah) {
      showToast('Isi nama siswa dan deskripsi masalah terlebih dahulu!');
      return;
    }

    const record: RecordKonselingBK = {
      ...newBk,
      id: `bk-${Date.now()}`,
    };

    setBkRecords([record, ...bkRecords]);
    setNewBk({
      tanggal: new Date().toISOString().split('T')[0],
      nisn: '',
      namaSiswa: '',
      kelas: 'VII-A',
      bidangBimbingan: 'Pribadi',
      jenisLayanan: 'Konseling Individual',
      keluhanMasalah: '',
      pendekatanSolusi: '',
      tindakLanjut: '',
      status: 'Dalam Proses',
    });
    showToast('Jurnal Layanan Konseling BK berhasil disimpan!');
  };

  const handleDeleteBk = (id: string) => {
    setBkRecords(bkRecords.filter((b) => b.id !== id));
    showToast('Catatan layanan BK berhasil dihapus!');
  };

  const handleToggleBkStatus = (id: string) => {
    setBkRecords(
      bkRecords.map((b) =>
        b.id === id
          ? {
              ...b,
              status: b.status === 'Selesai / Teratasi' ? 'Dalam Proses' : 'Selesai / Teratasi',
            }
          : b
      )
    );
    showToast('Status penanganan BK diperbarui!');
  };

  // ── DATA STATE: EKSKUL ──
  const [selectedEkskul, setSelectedEkskul] = useState<string>('Pramuka (Wajib)');
  const [ekskulList] = useState<string[]>(initialEkskulList);
  const [ekskulStudents, setEkskulStudents] = useState<StudentEkskul[]>(initialEkskulStudents);

  const [isAddEkskulModalOpen, setIsAddEkskulModalOpen] = useState(false);
  const [newEkskulStudentInput, setNewEkskulStudentInput] = useState({
    namaSiswa: '',
    kelas: 'VII-A',
    nisn: '',
    predikat: 'Baik' as 'Sangat Baik' | 'Baik' | 'Cukup',
    keterangan: 'Mengikuti kegiatan ekstrakurikuler dengan penuh tanggung jawab dan hadir teratur.',
  });

  const handleAddEkskulStudent = () => {
    if (!newEkskulStudentInput.namaSiswa) {
      showToast('Isi nama peserta didik!');
      return;
    }
    const record: StudentEkskul = {
      id: `ekskul-${Date.now()}`,
      nisn: newEkskulStudentInput.nisn || '0081234599',
      namaSiswa: newEkskulStudentInput.namaSiswa,
      kelas: newEkskulStudentInput.kelas,
      ekskulName: selectedEkskul,
      predikat: newEkskulStudentInput.predikat,
      keterangan: newEkskulStudentInput.keterangan,
    };
    setEkskulStudents([...ekskulStudents, record]);
    setNewEkskulStudentInput({
      namaSiswa: '',
      kelas: 'VII-A',
      nisn: '',
      predikat: 'Baik',
      keterangan: 'Mengikuti kegiatan ekstrakurikuler dengan penuh tanggung jawab dan hadir teratur.',
    });
    setIsAddEkskulModalOpen(false);
    showToast(`Peserta didik berhasil ditambahkan ke ${selectedEkskul}!`);
  };

  const handleDeleteEkskulStudent = (id: string) => {
    setEkskulStudents(ekskulStudents.filter((s) => s.id !== id));
    showToast('Peserta didik dihapus dari daftar!');
  };

  const handleUpdateEkskulGrade = (
    id: string,
    predikat: 'Sangat Baik' | 'Baik' | 'Cukup',
    keterangan: string
  ) => {
    setEkskulStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, predikat, keterangan } : s))
    );
  };

  // Export to CSV Helper
  const exportToCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`File ${filename} berhasil diunduh!`);
  };

  const handlePrint = () => {
    smartPrint({
      documentSelector: '.document-page',
      docTitle: `Jurnal & Laporan ${
        activeTab === 'piket'
          ? 'Piket'
          : activeTab === 'bk'
          ? 'Bimbingan Konseling'
          : activeTab === 'poin-pelanggaran'
          ? 'Poin Pelanggaran'
          : 'Ekstrakurikuler'
      }`,
      orientation: 'landscape',
    });
  };

  const handlePrintSpLetter = () => {
    smartPrint({
      documentSelector: '.sp-letter-canvas',
      docTitle: `Surat Resmi ${spForm.type} - ${selectedSpStudent?.nama || 'Siswa'}`,
      orientation: 'portrait',
    });
  };

  // Filtered Piket Records
  const filteredPiketRecords = piketRecords.filter((p) => {
    const matchesSearch =
      !searchPiket ||
      p.namaSiswa.toLowerCase().includes(searchPiket.toLowerCase()) ||
      p.kelas.toLowerCase().includes(searchPiket.toLowerCase()) ||
      p.jenisPelanggaran.toLowerCase().includes(searchPiket.toLowerCase());
    const matchesCategory = piketCategoryFilter === 'semua' || p.kategori === piketCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered BK Records
  const filteredBkRecords = bkRecords.filter((b) => {
    const matchesSearch =
      !searchBk ||
      b.namaSiswa.toLowerCase().includes(searchBk.toLowerCase()) ||
      b.kelas.toLowerCase().includes(searchBk.toLowerCase()) ||
      b.keluhanMasalah.toLowerCase().includes(searchBk.toLowerCase());
    const matchesBidang = bkBidangFilter === 'semua' || b.bidangBimbingan === bkBidangFilter;
    return matchesSearch && matchesBidang;
  });

  // Filtered Ekskul Students
  const filteredEkskulStudents = ekskulStudents.filter((s) => s.ekskulName === selectedEkskul);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
                Tahap 4: Administrasi Terpadu Sekolah
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Integrasi Otomatis Piket $\rightarrow$ BK $\rightarrow$ e-Rapor
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Administrasi Guru Piket, Layanan BK, & Ekstrakurikuler
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Modul terintegrasi untuk mencatat pelanggaran/keterlambatan piket harian, menyusun buku layanan konseling Bimbingan Konseling (BK), mencetak Surat Peringatan (SP) & Pemanggilan Orang Tua, serta mengelola penilaian ekstrakurikuler e-Rapor.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditingKop(!isEditingKop)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-sky-400" />
              <span>{isEditingKop ? 'Tutup Pengatur Kop' : 'Atur Kop Dokumen'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── EDIT KOP PANEL ── */}
      {isEditingKop && (
        <div className="bg-white border-2 border-sky-200 rounded-2xl p-5 shadow-sm space-y-4 no-print">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase">
              Pengaturan Kop Dokumen & Penanggung Jawab
            </h3>
            <button onClick={() => setIsEditingKop(false)}>
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={kop.schoolName}
                onChange={(e) => setKop({ ...kop, schoolName: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kepala Sekolah</label>
              <input
                type="text"
                value={kop.headmasterName}
                onChange={(e) => setKop({ ...kop, headmasterName: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={kop.headmasterNip}
                onChange={(e) => setKop({ ...kop, headmasterNip: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Guru / Petugas Piket</label>
              <input
                type="text"
                value={kop.officerName}
                onChange={(e) => setKop({ ...kop, officerName: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Petugas</label>
              <input
                type="text"
                value={kop.officerNip}
                onChange={(e) => setKop({ ...kop, officerNip: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lokasi & Tanggal Surat</label>
              <input
                type="text"
                value={kop.dateLocation}
                onChange={(e) => setKop({ ...kop, dateLocation: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TABS NAVIGATION BAR ── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 no-print">
        <button
          onClick={() => setActiveTab('piket')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'piket'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white border text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>1. Laporan Piket Harian</span>
          <span className="ml-1 px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-full">
            {piketRecords.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('poin-pelanggaran')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'poin-pelanggaran'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white border text-slate-700 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>2. Buku Poin & Cetak SP</span>
          <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] rounded-full font-bold">
            Kedisiplinan
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bk')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'bk'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white border text-slate-700 hover:bg-slate-50'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>3. Buku Layanan BK</span>
          <span className="ml-1 px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-full">
            {bkRecords.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ekskul')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'ekskul'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Penilaian Ekstrakurikuler</span>
          <span className="ml-1 px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-full">
            {filteredEkskulStudents.length}
          </span>
        </button>
      </div>

      {/* ── TAB 1: LAPORAN PIKET HARIAN (KEHADIRAN SISWA PER KELAS & PELANGGARAN KONDISIONAL) ── */}
      {activeTab === 'piket' && (
        <div className="space-y-6">
          {/* Header Summary Cards Kehadiran Sekolah */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 no-print">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] font-extrabold uppercase text-slate-500">Total Siswa</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {classAttendance.reduce((acc, c) => acc + c.totalSiswa, 0)}
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 shadow-xs text-center">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700">Hadir</span>
              <div className="text-xl font-black text-emerald-800 mt-0.5">
                {classAttendance.reduce((acc, c) => acc + c.hadir, 0)}
              </div>
            </div>

            <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200 shadow-xs text-center">
              <span className="text-[10px] font-extrabold uppercase text-sky-700">Sakit (S)</span>
              <div className="text-xl font-black text-sky-800 mt-0.5">
                {classAttendance.reduce((acc, c) => acc + c.sakit, 0)}
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 shadow-xs text-center">
              <span className="text-[10px] font-extrabold uppercase text-amber-700">Izin (I)</span>
              <div className="text-xl font-black text-amber-800 mt-0.5">
                {classAttendance.reduce((acc, c) => acc + c.izin, 0)}
              </div>
            </div>

            <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 shadow-xs text-center">
              <span className="text-[10px] font-extrabold uppercase text-rose-700">Alpa / Bolos</span>
              <div className="text-xl font-black text-rose-800 mt-0.5">
                {classAttendance.reduce((acc, c) => acc + c.alpa, 0)}
              </div>
            </div>

            <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-200 shadow-xs text-center">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700">% Kehadiran</span>
              <div className="text-xl font-black text-indigo-900 mt-0.5">
                {((classAttendance.reduce((acc, c) => acc + c.hadir, 0) /
                  (classAttendance.reduce((acc, c) => acc + c.totalSiswa, 0) || 1)) *
                  100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* SEKSI 1: INPUT & REKAP KETIDAKHADIRAN SISWA PER KELAS (HARI INI) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 no-print">
            <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  SEKSI 1: Laporan Ketidakhadiran Siswa Per Kelas (Laporan Rutin Guru Piket)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Catat status kehadiran rutin harian per kelas dan nama-nama siswa yang berhalangan hadir.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  exportToCsv(
                    `Laporan_Kehadiran_Piket_${kop.schoolName.replace(/\s+/g, '_')}.csv`,
                    ['No', 'Kelas', 'Total Siswa', 'Hadir', 'Sakit', 'Izin', 'Alpa', '% Kehadiran', 'Siswa Berhalangan Hadir'],
                    classAttendance.map((c, idx) => [
                      idx + 1,
                      c.kelas,
                      c.totalSiswa,
                      c.hadir,
                      c.sakit,
                      c.izin,
                      c.alpa,
                      `${((c.hadir / c.totalSiswa) * 100).toFixed(1)}%`,
                      c.absenStudents.map((s) => `${s.nama} (${s.keterangan}${s.alasan ? ': ' + s.alasan : ''})`).join('; ') || 'Hadir Semua',
                    ])
                  )
                }
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Laporan Kehadiran CSV</span>
              </button>
            </div>

            {/* Quick Form Add Absent Student */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs">
              <span className="font-extrabold text-slate-800 uppercase text-[11px] flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                Catat/Tambah Siswa Berhalangan Hadir Hari Ini:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Kelas</label>
                  <select
                    value={newAbsenceInput.kelas}
                    onChange={(e) => setNewAbsenceInput({ ...newAbsenceInput, kelas: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border rounded-lg font-bold"
                  >
                    {classAttendance.map((c) => (
                      <option key={c.kelas} value={c.kelas}>
                        Kelas {c.kelas} ({c.totalSiswa} Siswa)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Siswa</label>
                  <input
                    type="text"
                    list="absent-student-list"
                    value={newAbsenceInput.nama}
                    onChange={(e) => setNewAbsenceInput({ ...newAbsenceInput, nama: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border rounded-lg font-bold"
                    placeholder="Contoh: Andi Santoso"
                  />
                  <datalist id="absent-student-list">
                    <option value="Andi Santoso" />
                    <option value="Anto Wijaya" />
                    <option value="Ani Safitri" />
                    <option value="Budi Santoso" />
                    <option value="Doni Kurniawan" />
                  </datalist>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Kehadiran</label>
                  <select
                    value={newAbsenceInput.keterangan}
                    onChange={(e) =>
                      setNewAbsenceInput({
                        ...newAbsenceInput,
                        keterangan: e.target.value as 'Sakit' | 'Izin' | 'Alpa' | 'Bolos/Cabut',
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border rounded-lg font-bold"
                  >
                    <option value="Sakit">Sakit (S)</option>
                    <option value="Izin">Izin (I)</option>
                    <option value="Alpa">Alpa / Tanpa Keterangan (A)</option>
                    <option value="Bolos/Cabut">Bolos / Cabut Jam Pelajaran</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddAbsence}
                    className="w-full px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all shadow-xs"
                  >
                    + Simpan Kehadiran
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SEKSI 2: CATATAN PELANGGARAN & KEJADIAN HARI INI (KONDISIONAL) */}
          <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm space-y-4 no-print">
            <div className="flex flex-wrap items-center justify-between border-b pb-2 gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-red-900 uppercase flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  SEKSI 2: Catatan Pelanggaran & Kejadian Hari Ini (Kondisional Jika Ada Pelanggaran)
                </h3>
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                  *Otomatis Terhubung ke Buku Induk Pelanggaran & BK
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsRulesModalOpen(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>⚙️ Master Aturan & Bobot Poin</span>
              </button>
            </div>

            {/* Quick Preset Selector */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex flex-wrap items-center gap-3 text-xs">
              <span className="font-extrabold text-amber-950 flex items-center gap-1 shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Pilih Aturan Pelanggaran:</span>
              </span>
              <select
                onChange={(e) => {
                  const rule = violationRules.find((r) => r.id === e.target.value);
                  if (rule) {
                    setNewPiket({
                      ...newPiket,
                      jenisPelanggaran: rule.nama,
                      kategori: rule.kategori,
                      poin: rule.poin,
                    });
                    showToast(`Terpilih: "${rule.nama}" (+${rule.poin} Poin)`);
                  }
                }}
                className="flex-1 min-w-[240px] px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Pilih Dari Master Aturan Tata Tertib --</option>
                {violationRules.map((rule) => (
                  <option key={rule.id} value={rule.id}>
                    [{rule.kategori}] {rule.nama} (+{rule.poin} Poin)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Tanggal</label>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setNewPiket({ ...newPiket, tanggal: today });
                      showToast('Tanggal diatur ke Hari Ini');
                    }}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded transition-colors"
                  >
                    📅 Hari Ini
                  </button>
                </div>
                <input
                  type="date"
                  value={newPiket.tanggal}
                  onChange={(e) => setNewPiket({ ...newPiket, tanggal: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-bold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Jam Ke- / Waktu</label>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                      setNewPiket({ ...newPiket, jamKe: `Jam ${timeStr} WIB` });
                      showToast(`Jam diisi: ${timeStr} WIB`);
                    }}
                    className="text-[10px] bg-red-100 hover:bg-red-200 text-red-800 font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors"
                  >
                    <Clock className="w-3 h-3" /> ⚡ Sekarang
                  </button>
                </div>
                <select
                  value={newPiket.jamKe}
                  onChange={(e) => setNewPiket({ ...newPiket, jamKe: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border rounded-lg font-bold text-xs"
                >
                  <option value="1 (07.15 - 07.55)">Jam ke-1 (07.15 - 07.55)</option>
                  <option value="2 (07.55 - 08.35)">Jam ke-2 (07.55 - 08.35)</option>
                  <option value="3 (08.35 - 09.15)">Jam ke-3 (08.35 - 09.15)</option>
                  <option value="Istirahat I (09.15 - 09.30)">Istirahat I (09.15 - 09.30)</option>
                  <option value="4 (09.30 - 10.10)">Jam ke-4 (09.30 - 10.10)</option>
                  <option value="5 (10.10 - 10.50)">Jam ke-5 (10.10 - 10.50)</option>
                  <option value="6 (10.50 - 11.30)">Jam ke-6 (10.50 - 11.30)</option>
                  <option value="Istirahat II (11.30 - 12.15)">Istirahat II (11.30 - 12.15)</option>
                  <option value="7 (12.15 - 12.55)">Jam ke-7 (12.15 - 12.55)</option>
                  <option value="8 (12.55 - 13.35)">Jam ke-8 (12.55 - 13.35)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Peserta Didik</label>
                <input
                  type="text"
                  list="student-list-piket-full"
                  value={newPiket.namaSiswa}
                  onChange={(e) => setNewPiket({ ...newPiket, namaSiswa: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-bold"
                  placeholder="Ketik nama siswa..."
                />
                <datalist id="student-list-piket-full">
                  <option value="Budi Santoso" />
                  <option value="Doni Kurniawan" />
                  <option value="Bagus Pratama" />
                  <option value="Rian Hidayat" />
                  <option value="Ahmad Rizky" />
                  <option value="Siti Nurhaliza" />
                </datalist>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kelas / Rombel</label>
                <select
                  value={newPiket.kelas}
                  onChange={(e) => setNewPiket({ ...newPiket, kelas: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-bold"
                >
                  <option value="VII-A">VII-A</option>
                  <option value="VII-B">VII-B</option>
                  <option value="VIII-A">VIII-A</option>
                  <option value="VIII-B">VIII-B</option>
                  <option value="IX-A">IX-A</option>
                  <option value="IX-B">IX-B</option>
                  <option value="IX-C">IX-C</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Jenis Pelanggaran / Kesalahan</label>
                <input
                  type="text"
                  value={newPiket.jenisPelanggaran}
                  onChange={(e) => setNewPiket({ ...newPiket, jenisPelanggaran: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
                  placeholder="Contoh: Merokok di area sekolah, Terlambat >30m..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Pelanggaran</label>
                <select
                  value={newPiket.kategori}
                  onChange={(e) =>
                    setNewPiket({
                      ...newPiket,
                      kategori: e.target.value as RecordPelanggaranPiket['kategori'],
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-bold"
                >
                  <option value="Keterlambatan">Keterlambatan</option>
                  <option value="Seragam/Atribut">Seragam / Atribut</option>
                  <option value="Kedisiplinan">Kedisiplinan</option>
                  <option value="Ketertiban Kelas">Ketertiban Kelas</option>
                  <option value="Berat">Pelanggaran Berat</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bobot Poin</label>
                <input
                  type="number"
                  value={newPiket.poin}
                  onChange={(e) => setNewPiket({ ...newPiket, poin: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-bold text-red-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Tindakan Langsung Petugas Piket</label>
                <input
                  type="text"
                  value={newPiket.tindakanPiket}
                  onChange={(e) => setNewPiket({ ...newPiket, tindakanPiket: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
                  placeholder="Contoh: Pembinaan lisan, izin masuk kelas..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Disposisi Penanganan</label>
                <div className="flex gap-2">
                  <select
                    value={newPiket.statusDisposisi}
                    onChange={(e) =>
                      setNewPiket({
                        ...newPiket,
                        statusDisposisi: e.target.value as RecordPelanggaranPiket['statusDisposisi'],
                      })
                    }
                    className="w-full px-3 py-1.5 bg-red-50 border border-red-300 font-bold text-red-950 rounded-lg text-xs"
                  >
                    <option value="Selesai di Piket">Selesai di Piket</option>
                    <option value="Diteruskan ke Wali Kelas">Diteruskan ke Wali Kelas</option>
                    <option value="Rujukan ke Guru BK">🔥 Rujukan ke Guru BK & Induk Pelanggaran</option>
                  </select>

                  <button
                    onClick={handleAddPiket}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shrink-0 shadow-sm transition-all"
                  >
                    + Catat Pelanggaran
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PRINTABLE DOCUMENT CANVASS: LAPORAN ABSENSI & PELANGGARAN HARIAN PIKET */}
          <div className="bg-white border border-slate-300 rounded-2xl shadow-lg p-8 md:p-12 space-y-8 document-page text-black font-serif text-xs leading-normal">
            <div className="text-center border-b-2 border-black pb-4 space-y-1">
              <h1 className="text-sm md:text-base font-bold uppercase tracking-wider">
                LAPORAN HARIAN GURU PIKET & REKAP KEHADIRAN SISWA
              </h1>
              <h2 className="text-xs md:text-sm font-bold uppercase">
                {kop.schoolName} - TAHUN PELAJARAN {year.label}
              </h2>
              <p className="text-[11px] font-sans italic text-slate-600">
                Diarsip oleh Guru Piket Harian & Disampaikan ke Guru BK / Wali Kelas
              </p>
            </div>

            {/* TABEL REKAP KEHADIRAN SISWA PER KELAS */}
            <div className="space-y-2 font-sans">
              <h3 className="font-extrabold text-xs uppercase tracking-tight text-slate-900 border-b pb-1">
                I. REKAPITULASI KEHADIRAN SISWA PER KELAS HARI INI
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-center font-bold">
                      <th className="border border-black px-1 py-1.5 w-8">No</th>
                      <th className="border border-black px-2 py-1.5 w-20">Kelas</th>
                      <th className="border border-black px-2 py-1.5 w-16">Total Siswa</th>
                      <th className="border border-black px-2 py-1.5 w-14">Hadir</th>
                      <th className="border border-black px-2 py-1.5 w-12 bg-sky-50">Sakit</th>
                      <th className="border border-black px-2 py-1.5 w-12 bg-amber-50">Izin</th>
                      <th className="border border-black px-2 py-1.5 w-12 bg-rose-50">Alpa</th>
                      <th className="border border-black px-2 py-1.5 w-16">% Hadir</th>
                      <th className="border border-black px-2 py-1.5 text-left">Daftar Nama Siswa Berhalangan Hadir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classAttendance.map((c, idx) => (
                      <tr key={c.kelas} className="border-b border-black hover:bg-slate-50">
                        <td className="border border-black text-center font-bold">{idx + 1}</td>
                        <td className="border border-black text-center font-bold">{c.kelas}</td>
                        <td className="border border-black text-center">{c.totalSiswa}</td>
                        <td className="border border-black text-center font-bold text-emerald-800">{c.hadir}</td>
                        <td className="border border-black text-center text-sky-900 font-bold bg-sky-50/50">{c.sakit}</td>
                        <td className="border border-black text-center text-amber-900 font-bold bg-amber-50/50">{c.izin}</td>
                        <td className="border border-black text-center text-rose-900 font-bold bg-rose-50/50">{c.alpa}</td>
                        <td className="border border-black text-center font-bold">
                          {((c.hadir / c.totalSiswa) * 100).toFixed(1)}%
                        </td>
                        <td className="border border-black px-2 py-1">
                          {c.absenStudents.length === 0 ? (
                            <span className="text-emerald-700 italic font-medium">Lengkap (Nihil)</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {c.absenStudents.map((s) => (
                                <span
                                  key={s.id}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold border inline-flex items-center gap-1 ${
                                    s.keterangan === 'Sakit'
                                      ? 'bg-sky-100 text-sky-900 border-sky-300'
                                      : s.keterangan === 'Izin'
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-rose-100 text-rose-900 border-rose-300'
                                  }`}
                                >
                                  <span>
                                    {s.nama} ({s.keterangan})
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAbsence(c.kelas, s.id)}
                                    className="no-print text-red-600 hover:text-red-900 font-black ml-0.5"
                                    title="Hapus ketidakhadiran"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABEL CATATAN PELANGGARAN KONDISIONAL */}
            <div className="space-y-2 font-sans pt-2">
              <h3 className="font-extrabold text-xs uppercase tracking-tight text-slate-900 border-b pb-1 flex items-center justify-between">
                <span>II. CATATAN PELANGGARAN & KEJADIAN KETERTIBAN HARI INI (KONDISIONAL)</span>
                <span className="text-[10px] text-slate-500 font-normal italic">
                  *Terisi hanya jika terjadi pelanggaran hari ini
                </span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-center font-bold">
                      <th className="border border-black px-1 py-1.5 w-8">No</th>
                      <th className="border border-black px-2 py-1.5 w-20">Tgl / Jam</th>
                      <th className="border border-black px-2 py-1.5 text-left">Nama Siswa & Kelas</th>
                      <th className="border border-black px-2 py-1.5 text-left">Uraian Pelanggaran / Kesalahan</th>
                      <th className="border border-black px-1 py-1.5 w-12">Poin</th>
                      <th className="border border-black px-2 py-1.5 text-left">Tindakan Langsung Piket</th>
                      <th className="border border-black px-2 py-1.5 w-28 text-center">Status Disposisi</th>
                      <th className="border border-black px-1 py-1.5 w-12 text-center no-print">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPiketRecords.map((p, idx) => (
                      <tr key={p.id} className="border-b border-black hover:bg-slate-50">
                        <td className="border border-black text-center font-bold">{idx + 1}</td>
                        <td className="border border-black px-1 py-1.5 text-center">
                          <div className="font-bold">{p.tanggal}</div>
                          <div className="text-[9px] text-slate-500">{p.jamKe}</div>
                        </td>
                        <td className="border border-black px-2 py-1.5 font-bold">
                          {p.namaSiswa}
                          <div className="text-[9px] text-slate-600 font-normal">Kelas: {p.kelas}</div>
                        </td>
                        <td className="border border-black px-2 py-1.5">
                          <span className="font-bold text-red-950">[{p.kategori}]</span> {p.jenisPelanggaran}
                        </td>
                        <td className="border border-black text-center font-bold text-red-700 bg-red-50">
                          +{p.poin}
                        </td>
                        <td className="border border-black px-2 py-1.5 text-slate-800">{p.tindakanPiket}</td>
                        <td className="border border-black text-center p-1 font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] ${
                              p.statusDisposisi === 'Rujukan ke Guru BK'
                                ? 'bg-red-600 text-white'
                                : p.statusDisposisi === 'Diteruskan ke Wali Kelas'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {p.statusDisposisi}
                          </span>
                        </td>
                        <td className="border border-black text-center p-1 no-print">
                          <button
                            type="button"
                            onClick={() => handleDeletePiket(p.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Hapus Catatan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredPiketRecords.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-emerald-700 italic font-medium">
                          Nihil. Tidak ada catatan pelanggaran atau insiden ketertiban pada hari ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-8 flex justify-between font-serif text-xs">
              <div className="text-center w-56">
                <div>Mengetahui,</div>
                <div>Kepala {kop.schoolName}</div>
                <div className="h-20" />
                <div className="font-bold underline">{kop.headmasterName}</div>
                <div>NIP. {kop.headmasterNip}</div>
              </div>

              <div className="text-center w-56">
                <div>{kop.dateLocation}</div>
                <div>Guru Piket Harian</div>
                <div className="h-20" />
                <div className="font-bold underline">{kop.officerName}</div>
                <div>NIP. {kop.officerNip}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: BUKU INDUK CATATAN PELANGGARAN SISWA & BK (ARSIP BUKU INDUK GURU BK) ── */}
      {activeTab === 'poin-pelanggaran' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                  Total Insiden Pelanggaran
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">{piketRecords.length} Catatan</div>
              </div>
              <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-600 tracking-wider">
                  Teguran Wali Kelas (11-25)
                </span>
                <div className="text-2xl font-black text-amber-700 mt-1">
                  {(Array.from(new Set(piketRecords.map((p) => p.namaSiswa))) as string[]).filter((name) => {
                    const sum = piketRecords.filter((p) => p.namaSiswa === name).reduce((acc, curr) => acc + curr.poin, 0);
                    return sum >= 11 && sum <= 25;
                  }).length} Siswa
                </div>
              </div>
              <div className="p-3 bg-amber-100 text-amber-800 rounded-xl font-black text-xs">
                🟡 WARN
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-orange-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-orange-600 tracking-wider">
                  Peringatan SP-1 (26-50)
                </span>
                <div className="text-2xl font-black text-orange-700 mt-1">
                  {(Array.from(new Set(piketRecords.map((p) => p.namaSiswa))) as string[]).filter((name) => {
                    const sum = piketRecords.filter((p) => p.namaSiswa === name).reduce((acc, curr) => acc + curr.poin, 0);
                    return sum >= 26 && sum <= 50;
                  }).length} Siswa
                </div>
              </div>
              <div className="p-3 bg-orange-100 text-orange-800 rounded-xl font-black text-xs">
                🟠 SP-1
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-300 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-red-700 tracking-wider">
                  🔴 Pemanggilan Ortu / SP-2 (&gt;50)
                </span>
                <div className="text-2xl font-black text-red-800 mt-1">
                  {(Array.from(new Set(piketRecords.map((p) => p.namaSiswa))) as string[]).filter((name) => {
                    const sum = piketRecords.filter((p) => p.namaSiswa === name).reduce((acc, curr) => acc + curr.poin, 0);
                    return sum > 50;
                  }).length} Siswa
                </div>
              </div>
              <div className="p-3 bg-red-600 text-white rounded-xl font-black text-xs animate-pulse">
                🚨 BATAS
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar Tab 2 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 no-print">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchPiket}
                  onChange={(e) => setSearchPiket(e.target.value)}
                  placeholder="Cari nama siswa, NISN, atau jenis pelanggaran..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <select
                    value={poinClassFilter}
                    onChange={(e) => setPoinClassFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="semua">Semua Kelas</option>
                    <option value="VII-A">Kelas VII-A</option>
                    <option value="VII-B">Kelas VII-B</option>
                    <option value="VIII-A">Kelas VIII-A</option>
                    <option value="VIII-B">Kelas VIII-B</option>
                    <option value="IX-A">Kelas IX-A</option>
                    <option value="IX-B">Kelas IX-B</option>
                  </select>
                </div>

                <select
                  value={poinStatusFilter}
                  onChange={(e) => setPoinStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="semua">Semua Status Poin</option>
                  <option value="sp2">🔴 Pemanggilan Ortu (&gt;50 Poin)</option>
                  <option value="sp1">🟠 SP-1 Peringatan (26-50 Poin)</option>
                  <option value="teguran">🟡 Teguran Wali Kelas (11-25 Poin)</option>
                  <option value="normal">🟢 Normal (&lt;11 Poin)</option>
                </select>

                {(searchPiket || poinClassFilter !== 'semua' || poinStatusFilter !== 'semua') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchPiket('');
                      setPoinClassFilter('semua');
                      setPoinStatusFilter('semua');
                    }}
                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Reset Filter
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const studentNames = Array.from(new Set(piketRecords.map((p) => p.namaSiswa)));
                    const rows = studentNames.map((name, idx) => {
                      const recs = piketRecords.filter((p) => p.namaSiswa === name);
                      const total = recs.reduce((a, c) => a + c.poin, 0);
                      const last = recs[0];
                      return [
                        idx + 1,
                        name,
                        last?.nisn || '',
                        last?.kelas || '',
                        total,
                        total > 50 ? 'SP-2 (Pemanggilan Ortu)' : total >= 26 ? 'SP-1' : total >= 11 ? 'Teguran' : 'Normal',
                        recs.map((r) => `${r.tanggal}: ${r.jenisPelanggaran} (+${r.poin})`).join('; '),
                      ];
                    });
                    exportToCsv(
                      `Buku_Induk_Pelanggaran_${kop.schoolName.replace(/\s+/g, '_')}.csv`,
                      ['No', 'Nama Siswa', 'NISN', 'Kelas', 'Total Poin', 'Status SP', 'Riwayat Pelanggaran'],
                      rows
                    );
                  }}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Indicator */}
            {(() => {
              const allUniqueStudents = Array.from(new Set(piketRecords.map((p) => p.namaSiswa)));
              const filteredStudents = allUniqueStudents.filter((name) => {
                if (typeof name !== 'string') return false;
                const recs = piketRecords.filter((p) => p.namaSiswa === name);
                const lastRecord = recs[0];
                const totalPoin = recs.reduce((acc, curr) => acc + curr.poin, 0);

                if (searchPiket) {
                  const q = searchPiket.toLowerCase();
                  const matchName = name.toLowerCase().includes(q);
                  const matchNisn = lastRecord?.nisn?.includes(q);
                  const matchRule = recs.some((r) => r.jenisPelanggaran.toLowerCase().includes(q));
                  if (!matchName && !matchNisn && !matchRule) return false;
                }

                if (poinClassFilter !== 'semua' && lastRecord?.kelas !== poinClassFilter) {
                  return false;
                }

                if (poinStatusFilter === 'sp2' && totalPoin <= 50) return false;
                if (poinStatusFilter === 'sp1' && (totalPoin < 26 || totalPoin > 50)) return false;
                if (poinStatusFilter === 'teguran' && (totalPoin < 11 || totalPoin > 25)) return false;
                if (poinStatusFilter === 'normal' && totalPoin >= 11) return false;

                return true;
              });

              return (
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>
                    Menampilkan <strong className="text-slate-900 font-bold">{filteredStudents.length}</strong> dari total <strong className="text-slate-900 font-bold">{allUniqueStudents.length}</strong> siswa ber-catatan pelanggaran
                  </span>
                  <span className="italic text-[10px] text-slate-400">
                    *Tampilan siap untuk memuat data &gt;100 siswa
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Printable Document Canvas Buku Induk Pelanggaran */}
          <div className="bg-white border border-slate-300 rounded-2xl shadow-lg p-8 md:p-12 document-page text-black font-serif text-xs leading-normal space-y-6">
            <div className="text-center border-b-2 border-black pb-4 space-y-1">
              <h1 className="text-sm md:text-base font-bold uppercase tracking-wider">
                ARSIP BUKU INDUK CATATAN PELANGGARAN & POIN SISWA
              </h1>
              <h2 className="text-xs md:text-sm font-bold uppercase">
                GURU BIMBINGAN KONSELING (BK) & KESISWAAN - {kop.schoolName}
              </h2>
              <p className="text-[11px] font-sans italic text-slate-600">
                Arsip Rekam Jejak Pelanggaran Kedisiplinan & Batas Ambang Pemanggilan Orang Tua
              </p>
            </div>

            <div className="overflow-x-auto font-sans">
              <table className="w-full border-collapse border border-black text-[11px]">
                <thead>
                  <tr className="bg-slate-200 text-center font-bold">
                    <th className="border border-black px-2 py-2 w-10">No</th>
                    <th className="border border-black px-3 py-2 text-left">Nama Peserta Didik & NISN</th>
                    <th className="border border-black px-2 py-2 w-16 text-center">Kelas</th>
                    <th className="border border-black px-2 py-2 w-20 text-center">Total Poin</th>
                    <th className="border border-black px-3 py-2 text-center w-40">Status & Ambang Batas SP</th>
                    <th className="border border-black px-3 py-2 text-left">Riwayat Pelanggaran Terakhir</th>
                    <th className="border border-black px-2 py-2 w-48 text-center no-print">Aksi Arsip BK</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set(piketRecords.map((p) => p.namaSiswa)))
                    .filter((name): name is string => {
                      if (typeof name !== 'string') return false;
                      const recs = piketRecords.filter((p) => p.namaSiswa === name);
                      const lastRecord = recs[0];
                      const totalPoin = recs.reduce((acc, curr) => acc + curr.poin, 0);

                      if (searchPiket) {
                        const q = searchPiket.toLowerCase();
                        const matchName = name.toLowerCase().includes(q);
                        const matchNisn = lastRecord?.nisn?.includes(q);
                        const matchRule = recs.some((r) => r.jenisPelanggaran.toLowerCase().includes(q));
                        if (!matchName && !matchNisn && !matchRule) return false;
                      }

                      if (poinClassFilter !== 'semua' && lastRecord?.kelas !== poinClassFilter) {
                        return false;
                      }

                      if (poinStatusFilter === 'sp2' && totalPoin <= 50) return false;
                      if (poinStatusFilter === 'sp1' && (totalPoin < 26 || totalPoin > 50)) return false;
                      if (poinStatusFilter === 'teguran' && (totalPoin < 11 || totalPoin > 25)) return false;
                      if (poinStatusFilter === 'normal' && totalPoin >= 11) return false;

                      return true;
                    })
                    .map((name, idx) => {
                      const studentRecords = piketRecords.filter((p) => p.namaSiswa === name);
                      const studentBkRecords = bkRecords.filter((b) => b.namaSiswa === name);
                      const lastRecord = studentRecords[0];
                      const totalPoin = studentRecords.reduce((acc, curr) => acc + curr.poin, 0);

                      let statusBadge = {
                        label: '🟢 Normal (<11 Poin)',
                        bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                      };
                      if (totalPoin > 50) {
                        statusBadge = {
                          label: '🔴 SP-2 / Batas Pemanggilan Ortu (>50 Poin)',
                          bg: 'bg-red-600 text-white font-black animate-pulse',
                        };
                      } else if (totalPoin >= 26) {
                        statusBadge = {
                          label: '🟠 SP-1 / Peringatan I (26-50 Poin)',
                          bg: 'bg-orange-500 text-white font-bold',
                        };
                      } else if (totalPoin >= 11) {
                        statusBadge = {
                          label: '🟡 Teguran Wali Kelas (11-25 Poin)',
                          bg: 'bg-amber-100 text-amber-950 border-amber-300 font-bold',
                        };
                      }

                      return (
                        <tr key={name} className="border-b border-black hover:bg-slate-50">
                          <td className="border border-black text-center font-bold">{idx + 1}</td>
                          <td className="border border-black px-3 py-2 font-extrabold text-slate-900">
                            {name}
                            <div className="text-[9px] text-slate-500 font-normal">
                              NISN: {lastRecord?.nisn || '0081234500'}
                            </div>
                          </td>
                          <td className="border border-black px-2 py-2 text-center font-bold">
                            {lastRecord?.kelas}
                          </td>
                          <td className="border border-black text-center font-black text-base text-red-700 bg-red-50">
                            +{totalPoin}
                          </td>
                          <td className="border border-black p-2 text-center">
                            <span
                              className={`px-2.5 py-1 rounded text-[9px] uppercase border inline-block ${statusBadge.bg}`}
                            >
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="border border-black px-3 py-2 text-slate-800 text-[10px]">
                            <ul className="list-disc list-inside space-y-0.5">
                              {studentRecords.slice(0, 3).map((r) => (
                                <li key={r.id}>
                                  <span className="font-semibold">{r.tanggal}</span>: {r.jenisPelanggaran}{' '}
                                  <strong className="text-red-700">(+{r.poin} Poin)</strong>
                                </li>
                              ))}
                              {studentRecords.length > 3 && (
                                <li className="text-[9px] text-slate-500 italic">
                                  + {studentRecords.length - 3} kesalahan lainnya...
                                </li>
                              )}
                            </ul>
                          </td>
                          <td className="border border-black p-2 text-center no-print">
                            <div className="flex flex-col gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedStudentDetail({
                                    nama: name,
                                    kelas: lastRecord?.kelas || 'VII-A',
                                    nisn: lastRecord?.nisn || '0081234500',
                                    poin: totalPoin,
                                    records: studentRecords,
                                    bkRecords: studentBkRecords,
                                  });
                                }}
                                className="px-2.5 py-1 bg-sky-700 hover:bg-sky-600 text-white rounded font-bold text-[10px] transition-colors flex items-center justify-center gap-1 w-full shadow-xs"
                              >
                                <Search className="w-3 h-3" />
                                <span>Detail Riwayat ({studentRecords.length})</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedSpStudent({
                                    nama: name,
                                    kelas: lastRecord?.kelas || 'VII-A',
                                    nisn: lastRecord?.nisn || '0081234500',
                                    poin: totalPoin,
                                    records: studentRecords,
                                  });
                                  if (totalPoin > 50) {
                                    setSpForm((prev) => ({
                                      ...prev,
                                      type: 'Surat Pemanggilan Orang Tua',
                                      nomor: `421.3 / ${100 + idx} / SMP-01 / 2025`,
                                    }));
                                  } else if (totalPoin >= 26) {
                                    setSpForm((prev) => ({
                                      ...prev,
                                      type: 'Surat Peringatan I (SP-1)',
                                      nomor: `421.3 / ${100 + idx} / SMP-01 / 2025`,
                                    }));
                                  } else {
                                    setSpForm((prev) => ({
                                      ...prev,
                                      type: 'Surat Teguran Kedisiplinan',
                                      nomor: `421.3 / ${100 + idx} / SMP-01 / 2025`,
                                    }));
                                  }
                                }}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-[10px] transition-colors flex items-center justify-center gap-1 w-full shadow-xs"
                              >
                                <FileText className="w-3 h-3 text-amber-400" />
                                <span>Cetak SP / Pemanggilan</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Signature Area */}
            <div className="pt-8 flex justify-between font-serif text-xs">
              <div className="text-center w-56">
                <div>Mengetahui,</div>
                <div>Kepala {kop.schoolName}</div>
                <div className="h-20" />
                <div className="font-bold underline">{kop.headmasterName}</div>
                <div>NIP. {kop.headmasterNip}</div>
              </div>

              <div className="text-center w-56">
                <div>{kop.dateLocation}</div>
                <div>Guru Bimbingan Konseling (BK)</div>
                <div className="h-20" />
                <div className="font-bold underline">{kop.officerName}</div>
                <div>NIP. {kop.officerNip}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: GURU BK MODULE ── */}
      {activeTab === 'bk' && (
        <div className="space-y-6">
          {/* Quick Input BK Form */}
          <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-sm space-y-4 no-print">
            <div className="flex flex-wrap items-center justify-between border-b pb-2 gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-sky-900 uppercase flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-sky-600" />
                  Pencatatan Buku Layanan Bimbingan & Konseling (BK)
                </h3>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                  *Empat Bidang: Pribadi, Belajar, Sosial, Karir
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  exportToCsv(
                    `Laporan_Bimbingan_Konseling_${kop.schoolName.replace(/\s+/g, '_')}.csv`,
                    ['No', 'Tanggal', 'Nama Siswa', 'Kelas', 'Bidang', 'Jenis Layanan', 'Masalah', 'Solusi', 'Tindak Lanjut', 'Status'],
                    bkRecords.map((b, idx) => [
                      idx + 1,
                      b.tanggal,
                      b.namaSiswa,
                      b.kelas,
                      b.bidangBimbingan,
                      b.jenisLayanan,
                      b.keluhanMasalah,
                      b.pendekatanSolusi,
                      b.tindakLanjut,
                      b.status,
                    ])
                  )
                }
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel/CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Tanggal Layanan</label>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setNewBk({ ...newBk, tanggal: today });
                      showToast('Tanggal BK diatur ke Hari Ini');
                    }}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded transition-colors"
                  >
                    📅 Hari Ini
                  </button>
                </div>
                <input
                  type="date"
                  value={newBk.tanggal}
                  onChange={(e) => setNewBk({ ...newBk, tanggal: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Peserta Didik</label>
                <input
                  type="text"
                  list="student-list-bk"
                  value={newBk.namaSiswa}
                  onChange={(e) => setNewBk({ ...newBk, namaSiswa: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-bold"
                  placeholder="Ketik nama konseli..."
                />
                <datalist id="student-list-bk">
                  <option value="Bagus Pratama" />
                  <option value="Rian Hidayat" />
                  <option value="Doni Kurniawan" />
                  <option value="Ahmad Rizky" />
                  <option value="Siti Nurhaliza" />
                  <option value="Dewi Lestari" />
                  <option value="Fajar Nugraha" />
                  <option value="Bintang Saputra" />
                </datalist>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                <select
                  value={newBk.kelas}
                  onChange={(e) => setNewBk({ ...newBk, kelas: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-bold"
                >
                  <option value="VII-A">VII-A</option>
                  <option value="VII-B">VII-B</option>
                  <option value="VIII-A">VIII-A</option>
                  <option value="VIII-B">VIII-B</option>
                  <option value="IX-A">IX-A</option>
                  <option value="IX-B">IX-B</option>
                  <option value="IX-C">IX-C</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bidang Bimbingan</label>
                <select
                  value={newBk.bidangBimbingan}
                  onChange={(e) =>
                    setNewBk({
                      ...newBk,
                      bidangBimbingan: e.target.value as RecordKonselingBK['bidangBimbingan'],
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-bold"
                >
                  <option value="Pribadi">Bimbingan Pribadi</option>
                  <option value="Belajar">Bimbingan Belajar</option>
                  <option value="Sosial">Bimbingan Sosial</option>
                  <option value="Karir">Bimbingan Karir</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Keluhan / Gambaran Masalah</label>
                <input
                  type="text"
                  value={newBk.keluhanMasalah}
                  onChange={(e) => setNewBk({ ...newBk, keluhanMasalah: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium mb-1.5"
                  placeholder="Deskripsikan isu konseling..."
                />
                <div className="flex flex-wrap gap-1 text-[10px]">
                  <span className="font-bold text-slate-500 self-center mr-1">Klik Cepat:</span>
                  {[
                    'Sering Terlambat Masuk',
                    'Kesulitan Konsentrasi Belajar',
                    'Konflik dengan Teman Sebaya',
                    'Sering Membolos Jam KBM',
                    'Kedisiplinan & Atribut',
                    'Konsultasi Pilihan Karir/SMA',
                  ].map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => setNewBk({ ...newBk, keluhanMasalah: issue })}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-sky-100 hover:text-sky-900 text-slate-700 font-semibold rounded-md border border-slate-200 transition-colors"
                    >
                      + {issue}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Pendekatan & Solusi BK</label>
                <input
                  type="text"
                  value={newBk.pendekatanSolusi}
                  onChange={(e) => setNewBk({ ...newBk, pendekatanSolusi: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium mb-1.5"
                  placeholder="Teknik bimbingan / kesepakatan solusi..."
                />
                <div className="flex flex-wrap gap-1 text-[10px]">
                  <span className="font-bold text-slate-500 self-center mr-1">Klik Cepat:</span>
                  {[
                    'Konseling Bimbingan Individu',
                    'Penyusunan Jadwal Belajar',
                    'Contract Learning Kedisiplinan',
                    'Diskusi Mediasi Teman',
                    'Edukasi Pilihan Lanjutan',
                  ].map((sol) => (
                    <button
                      key={sol}
                      type="button"
                      onClick={() => setNewBk({ ...newBk, pendekatanSolusi: sol })}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-sky-100 hover:text-sky-900 text-slate-700 font-semibold rounded-md border border-slate-200 transition-colors"
                    >
                      + {sol}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Rencana Tindak Lanjut</label>
                <input
                  type="text"
                  value={newBk.tindakLanjut}
                  onChange={(e) => setNewBk({ ...newBk, tindakLanjut: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
                  placeholder="Monitoring, home visit, pemanggilan orang tua..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Status Penanganan</label>
                <div className="flex gap-2">
                  <select
                    value={newBk.status}
                    onChange={(e) =>
                      setNewBk({
                        ...newBk,
                        status: e.target.value as RecordKonselingBK['status'],
                      })
                    }
                    className="w-full px-3 py-1.5 bg-sky-50 border border-sky-300 font-bold text-sky-950 rounded-lg"
                  >
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Selesai / Teratasi">Selesai / Teratasi</option>
                    <option value="Rujukan Pihak Luar">Rujukan Pihak Luar</option>
                  </select>

                  <button
                    onClick={handleAddBk}
                    className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shrink-0 shadow-sm transition-all"
                  >
                    + Simpan Jurnal BK
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Search & Filter Toolbar BK */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchBk}
                onChange={(e) => setSearchBk(e.target.value)}
                placeholder="Cari konseli, kelas, atau deskripsi masalah BK..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={bkBidangFilter}
                onChange={(e) => setBkBidangFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="semua">Semua Bidang BK</option>
                <option value="Pribadi">Pribadi</option>
                <option value="Belajar">Belajar</option>
                <option value="Sosial">Sosial</option>
                <option value="Karir">Karir</option>
              </select>
            </div>
          </div>

          {/* Printable BK Document */}
          <div className="bg-white border border-slate-300 rounded-2xl shadow-lg p-8 md:p-12 space-y-6 document-page text-black font-serif text-xs leading-normal">
            <div className="text-center border-b-2 border-black pb-4 space-y-1">
              <h1 className="text-sm md:text-base font-bold uppercase tracking-wider">
                BUKU CATATAN PELAKSANAAN LAYANAN BIMBINGAN DAN KONSELING (BK)
              </h1>
              <h2 className="text-xs md:text-sm font-bold uppercase">
                {kop.schoolName} - TAHUN PELAJARAN {year.label}
              </h2>
            </div>

            <div className="overflow-x-auto font-sans">
              <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                  <tr className="bg-slate-200 text-center font-bold">
                    <th className="border border-black px-1 py-1.5 w-8">No</th>
                    <th className="border border-black px-2 py-1.5 w-20">Tanggal</th>
                    <th className="border border-black px-2 py-1.5 text-left">Nama Siswa & Kelas</th>
                    <th className="border border-black px-2 py-1.5 text-left">Bidang & Kasus Masalah</th>
                    <th className="border border-black px-2 py-1.5 text-left">Pendekatan Solusi</th>
                    <th className="border border-black px-2 py-1.5 text-left">Tindak Lanjut</th>
                    <th className="border border-black px-2 py-1.5 w-24 text-center">Status</th>
                    <th className="border border-black px-1 py-1.5 w-16 text-center no-print">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBkRecords.map((b, idx) => (
                    <tr key={b.id} className="border-b border-black hover:bg-slate-50">
                      <td className="border border-black text-center font-bold">{idx + 1}</td>
                      <td className="border border-black px-1 py-1.5 text-center font-bold">{b.tanggal}</td>
                      <td className="border border-black px-2 py-1.5 font-bold">
                        {b.namaSiswa}
                        <div className="text-[9px] text-slate-600 font-normal">Kelas: {b.kelas}</div>
                      </td>
                      <td className="border border-black px-2 py-1.5">
                        <span className="font-bold text-sky-900">[{b.bidangBimbingan}]</span> {b.keluhanMasalah}
                      </td>
                      <td className="border border-black px-2 py-1.5 text-slate-800">{b.pendekatanSolusi}</td>
                      <td className="border border-black px-2 py-1.5 text-slate-800">{b.tindakLanjut}</td>
                      <td className="border border-black text-center p-1 font-bold">
                        <button
                          type="button"
                          onClick={() => handleToggleBkStatus(b.id)}
                          className={`px-2 py-0.5 rounded text-[9px] cursor-pointer transition-all ${
                            b.status === 'Selesai / Teratasi'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-sky-100 text-sky-900 border border-sky-300'
                          }`}
                          title="Klik untuk mengubah status"
                        >
                          {b.status}
                        </button>
                      </td>
                      <td className="border border-black text-center p-1 no-print">
                        <button
                          type="button"
                          onClick={() => handleDeleteBk(b.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Hapus Jurnal BK"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBkRecords.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-slate-500 italic">
                        Tidak ada catatan layanan BK yang sesuai filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-8 flex justify-between font-serif text-xs">
              <div className="text-center w-56">
                <div>Mengetahui,</div>
                <div>Kepala {kop.schoolName}</div>
                <div className="h-20" />
                <div className="font-bold underline">{kop.headmasterName}</div>
                <div>NIP. {kop.headmasterNip}</div>
              </div>

              <div className="text-center w-56">
                <div>{kop.dateLocation}</div>
                <div>Guru Bimbingan Konseling (BK)</div>
                <div className="h-20" />
                <div className="font-bold underline">{kop.officerName}</div>
                <div>NIP. {kop.officerNip}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: EKSKUL MODULE ── */}
      {activeTab === 'ekskul' && (
        <div className="space-y-6">
          <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-xs font-bold text-emerald-950 uppercase">
                  Pengelolaan Penilaian Kegiatan Ekstrakurikuler e-Rapor
                </h3>
                <p className="text-[11px] text-slate-600">
                  Pilih cabang ekstrakurikuler untuk mengisi predikat kualitatif & narasi deskripsi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Pilih Ekstrakurikuler:</label>
              <select
                value={selectedEkskul}
                onChange={(e) => setSelectedEkskul(e.target.value)}
                className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-lg text-xs font-bold"
              >
                {ekskulList.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsAddEkskulModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Siswa Ekskul</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  exportToCsv(
                    `Nilai_Ekskul_${selectedEkskul.replace(/[^a-zA-Z0-9]/g, '_')}.csv`,
                    ['No', 'Nama Siswa', 'Kelas', 'Predikat', 'Deskripsi e-Rapor'],
                    filteredEkskulStudents.map((s, idx) => [idx + 1, s.namaSiswa, s.kelas, s.predikat, s.keterangan])
                  )
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Printable Document Canvas Ekskul */}
          <div className="bg-white border border-slate-300 rounded-2xl shadow-lg p-8 md:p-12 space-y-6 document-page text-black font-serif text-xs leading-normal">
            <div className="text-center border-b-2 border-black pb-4 space-y-1">
              <h1 className="text-sm md:text-base font-bold uppercase tracking-wider">
                DAFTAR NILAI & DESKRIPSI CAPAIAN EKSTRAKURIKULER
              </h1>
              <h2 className="text-xs md:text-sm font-bold uppercase">
                CABANG: {selectedEkskul.toUpperCase()}
              </h2>
              <p className="text-[11px] font-sans italic text-slate-600">
                {kop.schoolName} - TAHUN PELAJARAN {year.label}
              </p>
            </div>

            <div className="overflow-x-auto font-sans">
              <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                  <tr className="bg-slate-200 text-center font-bold">
                    <th className="border border-black px-1 py-1.5 w-8">No</th>
                    <th className="border border-black px-2 py-1.5 text-left min-w-[140px]">
                      Nama Peserta Didik
                    </th>
                    <th className="border border-black px-2 py-1.5 w-20">Kelas</th>
                    <th className="border border-black px-2 py-1.5 w-28 text-center">
                      Predikat
                    </th>
                    <th className="border border-black px-2 py-1.5 text-left">
                      Deskripsi Capaian e-Rapor
                    </th>
                    <th className="border border-black px-1 py-1.5 w-12 text-center no-print">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEkskulStudents.map((s, idx) => (
                    <tr key={s.id} className="border-b border-black hover:bg-slate-50">
                      <td className="border border-black text-center font-bold">{idx + 1}</td>
                      <td className="border border-black px-2 py-1.5 font-bold">{s.namaSiswa}</td>
                      <td className="border border-black px-2 py-1.5 text-center font-bold">{s.kelas}</td>
                      <td className="border border-black text-center p-1 font-bold">
                        <select
                          value={s.predikat}
                          onChange={(e) =>
                            handleUpdateEkskulGrade(
                              s.id,
                              e.target.value as 'Sangat Baik' | 'Baik' | 'Cukup',
                              s.keterangan
                            )
                          }
                          className="w-full py-0.5 bg-emerald-50 border border-emerald-300 rounded font-bold text-center text-[10px]"
                        >
                          <option value="Sangat Baik">Sangat Baik</option>
                          <option value="Baik">Baik</option>
                          <option value="Cukup">Cukup</option>
                        </select>
                      </td>
                      <td className="border border-black px-2 py-1 text-slate-800">
                        <input
                          type="text"
                          value={s.keterangan}
                          onChange={(e) =>
                            handleUpdateEkskulGrade(s.id, s.predikat, e.target.value)
                          }
                          className="w-full px-2 py-0.5 border rounded text-[10px]"
                        />
                      </td>
                      <td className="border border-black text-center p-1 no-print">
                        <button
                          type="button"
                          onClick={() => handleDeleteEkskulStudent(s.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Hapus Siswa dari Ekskul"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredEkskulStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-500 italic">
                        Belum ada peserta didik terdaftar pada ekstrakurikuler {selectedEkskul}. Klik tombol "+ Siswa Ekskul" di atas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-8 flex justify-between font-serif text-xs">
              <div className="text-center w-56">
                <div>Mengetahui,</div>
                <div>Kepala {kop.schoolName}</div>
                <div className="h-20" />
                <div className="font-bold underline">{kop.headmasterName}</div>
                <div>NIP. {kop.headmasterNip}</div>
              </div>

              <div className="text-center w-56">
                <div>{kop.dateLocation}</div>
                <div>Pembina {selectedEkskul}</div>
                <div className="h-20" />
                <div className="font-bold underline">{kop.officerName}</div>
                <div>NIP. {kop.officerNip}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SURAT PERINGATAN (SP) & PEMANGGILAN ORANG TUA ── */}
      {selectedSpStudent && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-100 text-amber-900 rounded-2xl">
                  <FileText className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                    Generator Surat Peringatan & Pemanggilan Orang Tua
                  </h3>
                  <p className="text-xs text-slate-500">
                    Siswa: <strong className="text-slate-800">{selectedSpStudent.nama}</strong> ({selectedSpStudent.kelas}) · Total Poin: <strong className="text-red-700">+{selectedSpStudent.poin} Poin</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSpStudent(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Settings Surat */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-800 uppercase text-[11px] flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-sky-600" />
                Parameter Dokumen Surat Resmi
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Dokumen Surat</label>
                  <select
                    value={spForm.type}
                    onChange={(e) =>
                      setSpForm({
                        ...spForm,
                        type: e.target.value as typeof spForm.type,
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Surat Teguran Kedisiplinan">Surat Teguran Kedisiplinan</option>
                    <option value="Surat Peringatan I (SP-1)">Surat Peringatan I (SP-1)</option>
                    <option value="Surat Peringatan II (SP-2)">Surat Peringatan II (SP-2)</option>
                    <option value="Surat Pemanggilan Orang Tua">Surat Pemanggilan Orang Tua</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Surat Resmi</label>
                  <input
                    type="text"
                    value={spForm.nomor}
                    onChange={(e) => setSpForm({ ...spForm, nomor: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Surat</label>
                  <input
                    type="date"
                    value={spForm.tanggalSurat}
                    onChange={(e) => setSpForm({ ...spForm, tanggalSurat: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hari & Tanggal Pertemuan</label>
                  <input
                    type="text"
                    value={spForm.panggilanHariTanggal}
                    onChange={(e) => setSpForm({ ...spForm, panggilanHariTanggal: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-medium"
                    placeholder="Contoh: Senin, 28 Juli 2025"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu / Jam Pertemuan</label>
                  <input
                    type="text"
                    value={spForm.panggilanJam}
                    onChange={(e) => setSpForm({ ...spForm, panggilanJam: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-medium"
                    placeholder="Contoh: 08.30 WIB"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tempat Pertemuan</label>
                  <input
                    type="text"
                    value={spForm.panggilanTempat}
                    onChange={(e) => setSpForm({ ...spForm, panggilanTempat: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>

            {/* PREVIEW CANVASS DOKUMEN SURAT SP */}
            <div className="bg-white border-2 border-slate-400 p-8 md:p-10 text-black font-serif text-xs leading-relaxed shadow-lg rounded-xl sp-letter-canvas space-y-4">
              {/* Kop Surat */}
              <div className="text-center border-b-4 border-double border-black pb-3 space-y-0.5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">PEMERINTAH KABUPATEN / DINAS PENDIDIKAN</h2>
                <h1 className="text-base font-black uppercase tracking-wider">{kop.schoolName}</h1>
                <p className="text-[10px] font-sans italic text-slate-600">
                  Alamat: Jl. Utama Pendidikan No. 01, Bantan · Website: www.sekolah.sch.id
                </p>
              </div>

              {/* Header Letter Meta */}
              <div className="flex justify-between items-start font-sans text-xs pt-2">
                <div>
                  <div><strong>Nomor</strong> : {spForm.nomor}</div>
                  <div><strong>Lampiran</strong> : -</div>
                  <div><strong>Perihal</strong> : <strong className="underline uppercase">{spForm.type.toUpperCase()}</strong></div>
                </div>
                <div className="text-right">
                  <div>{kop.dateLocation}</div>
                  <div>Kepada Yth.</div>
                  <div className="font-bold">Bapak / Ibu Orang Tua / Wali Siswa</div>
                  <div>dari An. <strong>{selectedSpStudent.nama}</strong> ({selectedSpStudent.kelas})</div>
                  <div>di Tempat</div>
                </div>
              </div>

              {/* Opening Paragraph */}
              <div className="space-y-2 pt-2">
                <p>Dengan hormat,</p>
                <p className="text-justify">
                  Sehubungan dengan pelaksanaan tata tertib kedisiplinan dan evaluasi perkembangan karakter peserta didik di {kop.schoolName}, melalui surat ini kami memberitahukan akumulasi poin pelanggaran atas nama peserta didik berikut:
                </p>
              </div>

              {/* Student Info Box */}
              <div className="bg-slate-50 border border-black p-3 font-sans text-[11px] space-y-1 my-2">
                <div className="grid grid-cols-3">
                  <span className="font-bold">Nama Lengkap Siswa</span>
                  <span className="col-span-2">: {selectedSpStudent.nama}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="font-bold">NISN / Kelas</span>
                  <span className="col-span-2">: {selectedSpStudent.nisn} / Kelas {selectedSpStudent.kelas}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="font-bold">Total Poin Pelanggaran</span>
                  <span className="col-span-2 text-red-700 font-extrabold">: +{selectedSpStudent.poin} Poin</span>
                </div>
              </div>

              {/* Violations Detail Table */}
              <div className="font-sans space-y-1">
                <p className="font-bold">Rincian Catatan Pelanggaran Kedisiplinan Terakhir:</p>
                <table className="w-full border-collapse border border-black text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-center font-bold">
                      <th className="border border-black p-1 w-8">No</th>
                      <th className="border border-black p-1 w-20">Tanggal</th>
                      <th className="border border-black p-1 text-left">Jenis Pelanggaran / Kejadian</th>
                      <th className="border border-black p-1 w-12 text-center">Poin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSpStudent.records.map((r, idx) => (
                      <tr key={r.id}>
                        <td className="border border-black p-1 text-center font-bold">{idx + 1}</td>
                        <td className="border border-black p-1 text-center">{r.tanggal}</td>
                        <td className="border border-black p-1">[{r.kategori}] {r.jenisPelanggaran}</td>
                        <td className="border border-black p-1 text-center font-bold text-red-700">+{r.poin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summons Schedule Details */}
              <div className="space-y-2 pt-2">
                <p className="text-justify">
                  Mengingat pentingnya penanganan dini dan pembinaan karakter bersama, kami mengundang Bapak/Ibu Orang Tua/Wali Siswa untuk hadir bertatap muka pada:
                </p>
                <div className="bg-amber-50 border border-amber-300 p-3 font-sans text-xs space-y-1 rounded">
                  <div className="grid grid-cols-3">
                    <span className="font-bold">Hari, Tanggal</span>
                    <span className="col-span-2">: {spForm.panggilanHariTanggal}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold">Waktu / Jam</span>
                    <span className="col-span-2">: {spForm.panggilanJam}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold">Tempat / Ruangan</span>
                    <span className="col-span-2">: {spForm.panggilanTempat}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold">Maksud & Tujuan</span>
                    <span className="col-span-2">: Konseling terpadu & Penandatanganan Komitmen Pembinaan Kedisiplinan Siswa</span>
                  </div>
                </div>
                <p className="italic text-[11px] text-slate-700">
                  *{spForm.catatanKhusus}
                </p>
              </div>

              {/* Closing */}
              <p>
                Demikian surat pemberitahuan ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu demi kebaikan putra/putri kita, kami ucapkan terima kasih.
              </p>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 gap-8 font-sans text-xs">
                <div className="text-center">
                  <div>Mengetahui,</div>
                  <div>Guru Bimbingan Konseling / Wali Kelas</div>
                  <div className="h-16" />
                  <div className="font-bold underline">{kop.officerName}</div>
                  <div>NIP. {kop.officerNip}</div>
                </div>

                <div className="text-center">
                  <div>{kop.dateLocation}</div>
                  <div>Kepala {kop.schoolName}</div>
                  <div className="h-16" />
                  <div className="font-bold underline">{kop.headmasterName}</div>
                  <div>NIP. {kop.headmasterNip}</div>
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="flex items-center justify-between border-t pt-4">
              <button
                type="button"
                onClick={() => setSelectedSpStudent(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-colors"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={handlePrintSpLetter}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Surat Resmi (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: TAMBAH SISWA EKSKUL ── */}
      {isAddEkskulModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                Tambah Peserta Didik ({selectedEkskul})
              </h3>
              <button onClick={() => setIsAddEkskulModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Peserta Didik</label>
                <input
                  type="text"
                  value={newEkskulStudentInput.namaSiswa}
                  onChange={(e) => setNewEkskulStudentInput({ ...newEkskulStudentInput, namaSiswa: e.target.value })}
                  placeholder="Ketik nama siswa..."
                  className="w-full px-3 py-1.5 border rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={newEkskulStudentInput.kelas}
                    onChange={(e) => setNewEkskulStudentInput({ ...newEkskulStudentInput, kelas: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-lg font-bold"
                  >
                    <option value="VII-A">VII-A</option>
                    <option value="VII-B">VII-B</option>
                    <option value="VIII-A">VIII-A</option>
                    <option value="VIII-B">VIII-B</option>
                    <option value="IX-A">IX-A</option>
                    <option value="IX-B">IX-B</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN</label>
                  <input
                    type="text"
                    value={newEkskulStudentInput.nisn}
                    onChange={(e) => setNewEkskulStudentInput({ ...newEkskulStudentInput, nisn: e.target.value })}
                    placeholder="NISN Siswa..."
                    className="w-full px-3 py-1.5 border rounded-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Predikat Capaian</label>
                <select
                  value={newEkskulStudentInput.predikat}
                  onChange={(e) =>
                    setNewEkskulStudentInput({
                      ...newEkskulStudentInput,
                      predikat: e.target.value as 'Sangat Baik' | 'Baik' | 'Cukup',
                    })
                  }
                  className="w-full px-3 py-1.5 border rounded-lg font-bold"
                >
                  <option value="Sangat Baik">Sangat Baik</option>
                  <option value="Baik">Baik</option>
                  <option value="Cukup">Cukup</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Capaian e-Rapor</label>
                <textarea
                  value={newEkskulStudentInput.keterangan}
                  onChange={(e) => setNewEkskulStudentInput({ ...newEkskulStudentInput, keterangan: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-1.5 border rounded-lg font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsAddEkskulModalOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddEkskulStudent}
                className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                Simpan Siswa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: MASTER ATURAN & BOBOT POIN PELANGGARAN ── */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col justify-between space-y-4 overflow-hidden">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                    Tabel Master Aturan & Bobot Poin Pelanggaran Sekolah
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {kop.schoolName} · Pedoman Poin Kedisiplinan & Ketertiban Peserta Didik
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Add Form Rule */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-3 shrink-0">
              <h4 className="text-xs font-bold text-amber-950 uppercase flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-700" />
                Tambah Aturan / Pelanggaran Baru
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Kategori</label>
                  <select
                    value={newRuleInput.kategori}
                    onChange={(e) =>
                      setNewRuleInput({
                        ...newRuleInput,
                        kategori: e.target.value as RecordPelanggaranPiket['kategori'],
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Keterlambatan">Keterlambatan</option>
                    <option value="Seragam/Atribut">Seragam/Atribut</option>
                    <option value="Kedisiplinan">Kedisiplinan</option>
                    <option value="Ketertiban Kelas">Ketertiban Kelas</option>
                    <option value="Berat">Pelanggaran Berat</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Nama / Jenis Pelanggaran</label>
                  <input
                    type="text"
                    value={newRuleInput.nama}
                    onChange={(e) => setNewRuleInput({ ...newRuleInput, nama: e.target.value })}
                    placeholder="Contoh: Terlambat > 15 menit..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Bobot Poin</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={newRuleInput.poin}
                      onChange={(e) => setNewRuleInput({ ...newRuleInput, poin: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-xl font-extrabold text-center text-red-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newRuleInput.nama) {
                          showToast('Isi nama jenis pelanggaran!');
                          return;
                        }
                        setViolationRules([
                          ...violationRules,
                          {
                            id: `rule-${Date.now()}`,
                            ...newRuleInput,
                          },
                        ]);
                        setNewRuleInput({ kategori: 'Keterlambatan', nama: '', poin: 5 });
                        showToast('Aturan baru berhasil ditambahkan!');
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
                    >
                      + Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* List Table of Rules */}
            <div className="overflow-y-auto flex-1 border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3 w-36">Kategori</th>
                    <th className="p-3">Nama / Jenis Pelanggaran</th>
                    <th className="p-3 w-24 text-center">Bobot Poin</th>
                    <th className="p-3 w-16 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {violationRules.map((rule, idx) => (
                    <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-md text-[10px] font-extrabold uppercase">
                          {rule.kategori}
                        </span>
                      </td>
                      <td className="p-3 font-extrabold text-slate-900">{rule.nama}</td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={rule.poin}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setViolationRules(
                              violationRules.map((r) => (r.id === rule.id ? { ...r, poin: val } : r))
                            );
                          }}
                          className="w-16 px-1.5 py-1 border border-slate-300 rounded-lg text-center font-black text-red-700 bg-red-50/50"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setViolationRules(violationRules.filter((r) => r.id !== rule.id));
                            showToast('Aturan berhasil dihapus!');
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Aturan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t shrink-0">
              <button
                type="button"
                onClick={() => setIsRulesModalOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors"
              >
                Tutup & Gunakan Aturan
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── MODAL: KARTU INDIVIDUAL REKAM JEJAK PELANGGARAN SISWA ── */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-100 text-sky-800 rounded-2xl">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                      Kartu Rekam Jejak Kedisiplinan & Bimbingan Siswa
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-100 text-sky-900 border border-sky-300">
                      Kartu Induk BK
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {kop.schoolName} · Rekam Jejak Pelanggaran & Layanan Konseling Per Peserta Didik
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Profile Identity Card */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Nama Lengkap Peserta Didik
                  </div>
                  <div className="text-lg font-black text-white">{selectedStudentDetail.nama}</div>
                  <div className="text-xs text-slate-300 font-medium flex items-center gap-3 mt-1">
                    <span>NISN: <strong className="text-amber-300">{selectedStudentDetail.nisn}</strong></span>
                    <span>•</span>
                    <span>Kelas: <strong className="text-amber-300">{selectedStudentDetail.kelas}</strong></span>
                  </div>
                </div>

                <div className="text-right bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Akumulasi Poin
                  </div>
                  <div className="text-2xl font-black text-red-400">
                    +{selectedStudentDetail.poin} <span className="text-xs font-normal text-slate-300">Poin</span>
                  </div>
                </div>
              </div>

              {/* Progress Gauge towards 50 Points SP-2 Limit */}
              <div className="space-y-1.5 pt-2 border-t border-slate-700">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-300">Status Ambang Batas Kedisiplinan (Maksimal 50 Poin SP-2)</span>
                  <span className="font-bold text-amber-300">
                    {Math.min(100, Math.round((selectedStudentDetail.poin / 50) * 100))}% Dari Batas Pemanggilan
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden p-0.5 border border-slate-600">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedStudentDetail.poin > 50
                        ? 'bg-red-500 animate-pulse'
                        : selectedStudentDetail.poin >= 26
                        ? 'bg-orange-500'
                        : selectedStudentDetail.poin >= 11
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, (selectedStudentDetail.poin / 50) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Table 1: Log Pelanggaran Kedisiplinan Piket */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                1. Riwayat Pelanggaran Kedisiplinan ({selectedStudentDetail.records.length} Catatan)
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="p-2.5 w-8 text-center border-b">No</th>
                      <th className="p-2.5 w-24 border-b">Tanggal</th>
                      <th className="p-2.5 border-b">Jenis Pelanggaran</th>
                      <th className="p-2.5 w-28 border-b">Kategori</th>
                      <th className="p-2.5 w-20 text-center border-b">Poin</th>
                      <th className="p-2.5 border-b">Tindak Lanjut / Disposisi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {selectedStudentDetail.records.map((r, idx) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-semibold text-slate-700">{r.tanggal}</td>
                        <td className="p-2.5 font-extrabold text-slate-900">{r.jenisPelanggaran}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-bold border border-slate-200">
                            {r.kategori}
                          </span>
                        </td>
                        <td className="p-2.5 text-center font-black text-red-700 bg-red-50/50">
                          +{r.poin}
                        </td>
                        <td className="p-2.5 text-slate-700 italic text-[11px]">
                          {r.tindakLanjutPiket || 'Dicatat oleh Petugas Piket & Diteruskan ke BK'}
                        </td>
                      </tr>
                    ))}
                    {selectedStudentDetail.records.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-400 italic">
                          Tidak ada catatan pelanggaran kedisiplinan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Layanan Bimbingan Konseling (BK) */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-sky-600" />
                2. Riwayat Layanan Bimbingan & Konseling ({selectedStudentDetail.bkRecords.length} Sesi BK)
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-sky-50 text-sky-900 font-extrabold uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="p-2.5 w-8 text-center border-b border-sky-200">No</th>
                      <th className="p-2.5 w-24 border-b border-sky-200">Tanggal</th>
                      <th className="p-2.5 w-24 border-b border-sky-200">Bidang</th>
                      <th className="p-2.5 border-b border-sky-200">Kasus / Topik Bimbingan</th>
                      <th className="p-2.5 border-b border-sky-200">Pendekatan & Solusi</th>
                      <th className="p-2.5 w-28 text-center border-b border-sky-200">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {selectedStudentDetail.bkRecords.map((b, idx) => (
                      <tr key={b.id} className="hover:bg-sky-50/30 transition-colors">
                        <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-semibold text-slate-700">{b.tanggal}</td>
                        <td className="p-2.5 font-extrabold text-sky-900">[{b.bidangBimbingan}]</td>
                        <td className="p-2.5 font-medium text-slate-800">{b.keluhanMasalah}</td>
                        <td className="p-2.5 text-slate-700 text-[11px]">{b.pendekatanSolusi}</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.status === 'Selesai / Teratasi'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-sky-100 text-sky-800 border border-sky-300'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {selectedStudentDetail.bkRecords.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-400 italic">
                          Belum ada jurnal sesi Bimbingan & Konseling (BK) khusus untuk siswa ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between border-t pt-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-colors"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const detail = selectedStudentDetail;
                    setSelectedSpStudent({
                      nama: detail.nama,
                      kelas: detail.kelas,
                      nisn: detail.nisn,
                      poin: detail.poin,
                      records: detail.records,
                    });
                    setSelectedStudentDetail(null);
                    if (detail.poin > 50) {
                      setSpForm((prev) => ({
                        ...prev,
                        type: 'Surat Pemanggilan Orang Tua',
                        nomor: `421.3 / 109 / SMP-01 / 2025`,
                      }));
                    } else if (detail.poin >= 26) {
                      setSpForm((prev) => ({
                        ...prev,
                        type: 'Surat Peringatan I (SP-1)',
                        nomor: `421.3 / 109 / SMP-01 / 2025`,
                      }));
                    } else {
                      setSpForm((prev) => ({
                        ...prev,
                        type: 'Surat Teguran Kedisiplinan',
                        nomor: `421.3 / 109 / SMP-01 / 2025`,
                      }));
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Teruskan ke Generator SP / Pemanggilan</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kartu Siswa (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
