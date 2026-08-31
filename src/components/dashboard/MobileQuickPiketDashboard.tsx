import React, { useState, useEffect, useMemo } from 'react';
import type {
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
  TeachingAssignment,
  ClassRoster,
  MainModule,
} from '../../types';
import {
  DailyClassAttendance,
  RecordPelanggaranPiket,
  initialClassAttendance,
  initialPiketRecords,
  initialViolationRules,
} from '../../data/samplePiketBkData';
import { loadStorageData, saveStorageData } from '../../utils/storage';
import {
  ShieldAlert,
  UserX,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Zap,
  Sparkles,
  Search,
  ArrowRight,
  Clock,
  Send,
  Calendar,
  X,
  FileText,
  UserCheck,
  Building2,
  ChevronRight,
  MapPin,
  Award,
  Folder,
  Printer,
  HeartHandshake,
  BookOpen,
  GraduationCap,
  Bell,
  BarChart3,
  Sliders,
  Scan,
} from 'lucide-react';

interface MobileQuickPiketDashboardProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  assignments: TeachingAssignment[];
  currentAssignment: TeachingAssignment;
  onSelectAssignment: (id: string) => void;
  rosters: ClassRoster[];
  onNavigateModule: (mod: MainModule, subViewOrTab?: string) => void;
  onOpenExpressKbm: () => void;
  onOpenBarcodeScanner?: () => void;
}

export const MobileQuickPiketDashboard: React.FC<MobileQuickPiketDashboardProps> = ({
  school,
  teacher,
  year,
  assignments,
  currentAssignment,
  onSelectAssignment,
  rosters,
  onNavigateModule,
  onOpenExpressKbm,
  onOpenBarcodeScanner,
}) => {
  // Active Action Pane: 'absen-piket' | 'pelanggaran' | 'rekap-live'
  const [activeActionPane, setActiveActionPane] = useState<'absen-piket' | 'pelanggaran' | 'rekap-live'>('absen-piket');

  // Persistence for Class Attendance & Piket Records
  const [classAttendance, setClassAttendance] = useState<DailyClassAttendance[]>(() =>
    loadStorageData('piket_attendance', initialClassAttendance)
  );
  const [piketRecords, setPiketRecords] = useState<RecordPelanggaranPiket[]>(() =>
    loadStorageData('piket_records', initialPiketRecords)
  );

  useEffect(() => {
    saveStorageData('piket_attendance', classAttendance);
  }, [classAttendance]);

  useEffect(() => {
    saveStorageData('piket_records', piketRecords);
  }, [piketRecords]);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // ──────────────────────────────────────────────
  // 1. ABSEN PIKET STATE & HANDLERS
  // ──────────────────────────────────────────────
  const [selectedPiketKelas, setSelectedPiketKelas] = useState<string>('VII-A');
  const [studentSearch, setStudentSearch] = useState<string>('');

  const currentClassData = useMemo(() => {
    return (
      classAttendance.find((c) => c.kelas === selectedPiketKelas) || {
        kelas: selectedPiketKelas,
        totalSiswa: 32,
        hadir: 32,
        sakit: 0,
        izin: 0,
        alpa: 0,
        absenStudents: [],
      }
    );
  }, [classAttendance, selectedPiketKelas]);

  // Available students for selected class from rosters or defaults
  const classStudentsList = useMemo(() => {
    const matchedRoster = rosters.find(
      (r) => r.classLabel.toUpperCase() === selectedPiketKelas.toUpperCase() || r.classId === selectedPiketKelas
    );
    if (matchedRoster && matchedRoster.students.length > 0) {
      return matchedRoster.students.map((s) => s.name);
    }
    return [
      'Ahmad Fauzi',
      'Anisa Rahmawati',
      'Bagus Pratama',
      'Budi Santoso',
      'Citra Dewi',
      'Dimas Arya',
      'Dina Safitri',
      'Eko Saputra',
      'Fani Nurhaliza',
      'Gita Permata',
      'Hendra Kusuma',
      'Intan Puspita',
      'Joko Prasetyo',
      'Kiki Amanda',
      'Lestari Putri',
      'Muhammad Rizky',
      'Nabila Azzahra',
      'Rian Hidayat',
      'Siti Nurhaliza',
      'Zahra Amelia',
    ];
  }, [rosters, selectedPiketKelas]);

  const handleQuickAddAbsence = (keterangan: 'Sakit' | 'Izin' | 'Alpa' | 'Bolos/Cabut') => {
    if (!studentSearch.trim()) {
      showToast('⚠️ Masukkan / ketik nama siswa terlebih dahulu!');
      return;
    }
    const studentName = studentSearch.trim();

    setClassAttendance((prev) =>
      prev.map((c) => {
        if (c.kelas === selectedPiketKelas) {
          const newAbs = [
            ...c.absenStudents,
            {
              id: `abs-${Date.now()}`,
              nama: studentName,
              nisn: '0081234500',
              keterangan,
              alasan: 'Dicatat melalui Mode Cepat Piket Mobile',
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

    setStudentSearch('');
    showToast(`✓ [${keterangan}] ${studentName} (${selectedPiketKelas}) tersimpan!`);
  };

  const handleDeleteAbsence = (absId: string) => {
    setClassAttendance((prev) =>
      prev.map((c) => {
        if (c.kelas === selectedPiketKelas) {
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
    showToast('Data absen siswa berhasil dihapus.');
  };

  // ──────────────────────────────────────────────
  // 2. PELANGGARAN STATE & HANDLERS
  // ──────────────────────────────────────────────
  const [pelanggaranForm, setPelanggaranForm] = useState({
    kelas: 'VII-A',
    namaSiswa: '',
    jenisPelanggaran: 'Terlambat Masuk Sekolah (< 15 Menit)',
    kategori: 'Keterlambatan' as RecordPelanggaranPiket['kategori'],
    poin: 5,
    tindakanPiket: 'Pembersihan lingkungan & pembinaan kedisiplinan',
    statusDisposisi: 'Selesai di Piket' as RecordPelanggaranPiket['statusDisposisi'],
  });

  const handleSelectViolationPreset = (rule: {
    nama: string;
    kategori: RecordPelanggaranPiket['kategori'];
    poin: number;
  }) => {
    let defaultTindakan = 'Pembinaan lisan & izin masuk kelas';
    if (rule.kategori === 'Seragam/Atribut') defaultTindakan = 'Teguran lisan & penertiban atribut seragam';
    if (rule.kategori === 'Ketertiban Kelas') defaultTindakan = 'Teguran lisan & pembinaan disiplin belajar';
    if (rule.kategori === 'Kedisiplinan') defaultTindakan = 'Surat Pernyataan Kedisiplinan & koordinasi wali kelas';
    if (rule.kategori === 'Berat') defaultTindakan = 'Pemanggilan Orang Tua & Rujukan Konseling BK';

    setPelanggaranForm((prev) => ({
      ...prev,
      jenisPelanggaran: rule.nama,
      kategori: rule.kategori,
      poin: rule.poin,
      tindakanPiket: defaultTindakan,
      statusDisposisi:
        rule.poin >= 30 || rule.kategori === 'Berat'
          ? 'Rujukan ke Guru BK'
          : rule.poin >= 15
          ? 'Diteruskan ke Wali Kelas'
          : 'Selesai di Piket',
    }));
  };

  const handleSavePelanggaran = () => {
    if (!pelanggaranForm.namaSiswa.trim()) {
      showToast('⚠️ Ketik atau pilih nama siswa!');
      return;
    }

    const newRec: RecordPelanggaranPiket = {
      id: `piket-${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      jamKe: `Piket (${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})`,
      nisn: '0081234500',
      namaSiswa: pelanggaranForm.namaSiswa.trim(),
      kelas: pelanggaranForm.kelas,
      jenisPelanggaran: pelanggaranForm.jenisPelanggaran,
      kategori: pelanggaranForm.kategori,
      poin: pelanggaranForm.poin,
      tindakanPiket: pelanggaranForm.tindakanPiket,
      statusDisposisi: pelanggaranForm.statusDisposisi,
    };

    setPiketRecords([newRec, ...piketRecords]);
    setPelanggaranForm((prev) => ({ ...prev, namaSiswa: '' }));
    showToast(`✓ Pelanggaran ${newRec.namaSiswa} (+${newRec.poin} Poin) tersimpan!`);
  };

  const handleDeletePiketRecord = (id: string) => {
    setPiketRecords((prev) => prev.filter((p) => p.id !== id));
    showToast('Catatan pelanggaran dihapus.');
  };

  // Stats calculation
  const totalAbsentAllClasses = useMemo(() => {
    return classAttendance.reduce((sum, c) => sum + (c.absenStudents?.length || 0), 0);
  }, [classAttendance]);

  const totalPelanggaranToday = useMemo(() => {
    return piketRecords.length;
  }, [piketRecords]);

  // Greeting & Date
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* ── TOAST NOTIFICATION ── */}
      {toastMsg && (
        <div className="fixed top-4 left-4 right-4 z-50 p-3 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between animate-in slide-in-from-top">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </span>
          <button onClick={() => setToastMsg(null)} className="p-1 hover:bg-slate-800 rounded-lg">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}

      {/* ── 1. HEADER PUSAT PINTASAN CEPAT ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-bold">
            <Zap className="w-3 h-3 text-amber-400 fill-current" />
            <span>Pusat Pintasan Cepat Guru</span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium">{todayFormatted}</span>
        </div>

        <h1 className="text-xl font-black tracking-tight text-white">
          {greeting}, <span className="text-amber-400">{teacher.name}</span>
        </h1>
        <p className="text-xs text-slate-300 mt-0.5 truncate">
          {school.name} · TP {year.label}
        </p>

        {/* Live Counters */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => setActiveActionPane('absen-piket')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activeActionPane === 'absen-piket'
                ? 'bg-blue-600/40 border-blue-400 text-white shadow-inner'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Siswa Absen</span>
              <UserX className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-black text-amber-400 mt-0.5">
              {totalAbsentAllClasses} <span className="text-[10px] font-normal text-slate-300">Siswa</span>
            </div>
          </button>

          <button
            onClick={() => setActiveActionPane('pelanggaran')}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              activeActionPane === 'pelanggaran'
                ? 'bg-rose-600/40 border-rose-400 text-white shadow-inner'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Kasus Pelanggaran</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-black text-rose-400 mt-0.5">
              {totalPelanggaranToday} <span className="text-[10px] font-normal text-slate-300">Kasus</span>
            </div>
          </button>
        </div>
      </div>

      {/* ── 2. PUSAT PINTASAN UTAMA (GRID SHORTCUTS) ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-current" />
            <span>Pintasan Cepat Tindakan:</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium">1-Ketuk Langsung</span>
        </div>

        {/* Big Barcode Scanner Shortcut for Mobile Users */}
        {onOpenBarcodeScanner && (
          <button
            onClick={onOpenBarcodeScanner}
            className="w-full p-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl shadow-md flex items-center justify-between transition-all active:scale-98 border border-blue-400/30"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 bg-white/20 rounded-xl">
                <Scan className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-white">Scan Barcode / QR Siswa</div>
                <div className="text-[10px] text-blue-100 font-medium">Presensi KBM Kelas & Gerbang Piket</div>
              </div>
            </div>
            <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
              KAMERA HP
            </span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          {/* Pintasan 1: Absen Piket (Active Tab trigger) */}
          <button
            onClick={() => setActiveActionPane('absen-piket')}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
              activeActionPane === 'absen-piket'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                : 'bg-blue-50/70 hover:bg-blue-100/70 text-slate-800 border-blue-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-xl ${
                  activeActionPane === 'absen-piket' ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                <UserX className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  activeActionPane === 'absen-piket' ? 'bg-white/20 text-white' : 'bg-blue-200/80 text-blue-900'
                }`}
              >
                Piket
              </span>
            </div>
            <div>
              <div className="font-black text-xs">Absen Piket Cepat</div>
              <div
                className={`text-[10px] font-medium mt-0.5 ${
                  activeActionPane === 'absen-piket' ? 'text-blue-100' : 'text-slate-500'
                }`}
              >
                Input Sakit, Izin, Alpa
              </div>
            </div>
          </button>

          {/* Pintasan 2: Catat Pelanggaran (Active Tab trigger) */}
          <button
            onClick={() => setActiveActionPane('pelanggaran')}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
              activeActionPane === 'pelanggaran'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-400/30'
                : 'bg-rose-50/70 hover:bg-rose-100/70 text-slate-800 border-rose-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-xl ${
                  activeActionPane === 'pelanggaran' ? 'bg-white/20 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  activeActionPane === 'pelanggaran' ? 'bg-white/20 text-white' : 'bg-rose-200/80 text-rose-900'
                }`}
              >
                Disiplin
              </span>
            </div>
            <div>
              <div className="font-black text-xs">Catat Pelanggaran</div>
              <div
                className={`text-[10px] font-medium mt-0.5 ${
                  activeActionPane === 'pelanggaran' ? 'text-rose-100' : 'text-slate-500'
                }`}
              >
                Preset Poin & Disposisi
              </div>
            </div>
          </button>

          {/* Pintasan 3: KBM Express */}
          <button
            onClick={onOpenExpressKbm}
            className="p-3.5 bg-amber-500/15 hover:bg-amber-500/25 text-slate-900 border border-amber-300 rounded-2xl text-left transition-all flex flex-col justify-between active:scale-98"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-xl">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="text-[10px] font-extrabold bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded-md">
                1-Klik
              </span>
            </div>
            <div>
              <div className="font-black text-xs">Input KBM Express</div>
              <div className="text-[10px] font-medium text-slate-600 mt-0.5">Jurnal & Presensi Kelas</div>
            </div>
          </button>

          {/* Pintasan 4: Rekap & Cetak Lembar Piket */}
          <button
            onClick={() => onNavigateModule('administrasi', 'laporan-piket')}
            className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-2xl text-left transition-all flex flex-col justify-between active:scale-98"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-slate-800 text-amber-400 rounded-xl">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md">
                PDF
              </span>
            </div>
            <div>
              <div className="font-black text-xs">Rekap & Cetak Piket</div>
              <div className="text-[10px] font-medium text-slate-300 mt-0.5">Lembar Resmi PDF/Print</div>
            </div>
          </button>

          {/* Pintasan 5: Presensi Tatap Muka Mengajar */}
          <button
            onClick={() => onNavigateModule('rekap', 'tatap-muka')}
            className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl text-left transition-all flex items-center gap-2.5 active:scale-98"
          >
            <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">Presensi KBM</div>
              <div className="text-[9px] text-slate-500">Tatap Muka Per JP</div>
            </div>
          </button>

          {/* Pintasan 6: Input Nilai Siswa */}
          <button
            onClick={() => onNavigateModule('rekap', 'nilai')}
            className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl text-left transition-all flex items-center gap-2.5 active:scale-98"
          >
            <div className="p-2 bg-purple-600 text-white rounded-xl shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs">Input Nilai Siswa</div>
              <div className="text-[9px] text-slate-500">TP, PTS & PAS</div>
            </div>
          </button>
        </div>
      </div>

      {/* ── 3. SELECTOR AKSI CEPAT DI BAWAH PINTASAN ── */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveActionPane('absen-piket')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeActionPane === 'absen-piket'
              ? 'bg-blue-600 text-white shadow-xs font-extrabold'
              : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>Form Absen Piket</span>
        </button>

        <button
          onClick={() => setActiveActionPane('pelanggaran')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeActionPane === 'pelanggaran'
              ? 'bg-rose-600 text-white shadow-xs font-extrabold'
              : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Form Pelanggaran</span>
        </button>

        <button
          onClick={() => setActiveActionPane('rekap-live')}
          className={`flex-1 py-2.5 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeActionPane === 'rekap-live'
              ? 'bg-slate-900 text-white shadow-xs font-extrabold'
              : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>Status Hari Ini</span>
        </button>
      </div>

      {/* ── 4. PANEL AKSI CEPAT 1: ABSEN PIKET ── */}
      {activeActionPane === 'absen-piket' && (
        <div className="space-y-4">
          {/* Class Selector Horizontal Slider */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Pilih Kelas / Rombel:</span>
              </span>
              <span className="text-[11px] font-bold text-blue-600">
                {currentClassData.hadir} Hadir / {currentClassData.totalSiswa} Siswa
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['VII-A', 'VII-B', 'VIII-A', 'VIII-B', 'IX-A', 'IX-B', 'IX-C'].map((k) => {
                const isSel = selectedPiketKelas === k;
                const cItem = classAttendance.find((c) => c.kelas === k);
                const absCount = cItem?.absenStudents?.length || 0;

                return (
                  <button
                    key={k}
                    onClick={() => setSelectedPiketKelas(k)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                      isSel
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{k}</span>
                    {absCount > 0 && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                          isSel ? 'bg-amber-400 text-slate-950' : 'bg-rose-500 text-white'
                        }`}
                      >
                        {absCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick 1-Tap Absence Entry Form */}
          <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Input Cepat Absen Kelas {selectedPiketKelas}</span>
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">
                1-Ketuk Simpan
              </span>
            </div>

            {/* Student Name Input Field */}
            <div className="relative">
              <input
                type="text"
                list="mobile-student-list"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Ketik atau pilih nama siswa..."
                className="w-full text-xs font-bold pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              {studentSearch && (
                <button
                  onClick={() => setStudentSearch('')}
                  className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <datalist id="mobile-student-list">
                {classStudentsList.map((name, i) => (
                  <option key={i} value={name} />
                ))}
              </datalist>
            </div>

            {/* Quick Student Name Suggestions (Chips) */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
              {classStudentsList.slice(0, 6).map((name, i) => (
                <button
                  key={i}
                  onClick={() => setStudentSearch(name)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg shrink-0 font-medium border border-slate-200 transition-colors"
                >
                  {name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* 4 Instant Status Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleQuickAddAbsence('Sakit')}
                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>🤒</span>
                <span>+ Sakit</span>
              </button>

              <button
                onClick={() => handleQuickAddAbsence('Izin')}
                className="py-3 px-3 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>📝</span>
                <span>+ Izin</span>
              </button>

              <button
                onClick={() => handleQuickAddAbsence('Alpa')}
                className="py-3 px-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>❌</span>
                <span>+ Alpa</span>
              </button>

              <button
                onClick={() => handleQuickAddAbsence('Bolos/Cabut')}
                className="py-3 px-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>🏃</span>
                <span>+ Bolos</span>
              </button>
            </div>
          </div>

          {/* List of Absent Students in Selected Class */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <UserX className="w-4 h-4 text-rose-500" />
                <span>Siswa Berhalangan di Kelas {selectedPiketKelas}</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {currentClassData.absenStudents?.length || 0} Siswa
              </span>
            </div>

            {(!currentClassData.absenStudents || currentClassData.absenStudents.length === 0) ? (
              <div className="py-6 text-center text-slate-400 text-xs space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-slate-600">Semua Siswa Hadir Tuntas</p>
                <p className="text-[10px]">Tidak ada catatan sakit, izin, atau alpa di kelas ini.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentClassData.absenStudents.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.nama}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            item.keterangan === 'Sakit'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.keterangan === 'Izin'
                              ? 'bg-sky-100 text-sky-800'
                              : item.keterangan === 'Alpa'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.keterangan}
                        </span>
                        {item.alasan && (
                          <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                            {item.alasan}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAbsence(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Hapus data absen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Direct Link to Full Report */}
            <button
              onClick={() => onNavigateModule('administrasi', 'laporan-piket')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Buka Lembar Rekap Piket & Cetak PDF →</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 5. PANEL AKSI CEPAT 2: CATAT PELANGGARAN ── */}
      {activeActionPane === 'pelanggaran' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Form Catat Pelanggaran Ketertiban Siswa</span>
              </h3>
              <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-bold">
                Otomatis Poin
              </span>
            </div>

            {/* Class & Student Inputs */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Kelas:</label>
                <select
                  value={pelanggaranForm.kelas}
                  onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, kelas: e.target.value })}
                  className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                >
                  {['VII-A', 'VII-B', 'VIII-A', 'VIII-B', 'IX-A', 'IX-B', 'IX-C'].map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Siswa:</label>
                <input
                  type="text"
                  value={pelanggaranForm.namaSiswa}
                  onChange={(e) => setPelanggaranForm({ ...pelanggaranForm, namaSiswa: e.target.value })}
                  placeholder="Ketik nama siswa..."
                  className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Instant Preset Buttons */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                Pilih Jenis Kasus Pelanggaran (1-Ketuk):
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  {
                    nama: 'Terlambat Masuk Sekolah (< 15 Menit)',
                    kategori: 'Keterlambatan' as const,
                    poin: 5,
                    label: '🕒 Terlambat (<15m)',
                    pts: '+5',
                  },
                  {
                    nama: 'Terlambat Masuk Sekolah (> 30 Menit)',
                    kategori: 'Keterlambatan' as const,
                    poin: 15,
                    label: '🕒 Terlambat (>30m)',
                    pts: '+15',
                  },
                  {
                    nama: 'Atribut Seragam Tidak Lengkap',
                    kategori: 'Seragam/Atribut' as const,
                    poin: 5,
                    label: '👔 Atribut / Dasi',
                    pts: '+5',
                  },
                  {
                    nama: 'Rambut Panjang / Tidak Rapi',
                    kategori: 'Seragam/Atribut' as const,
                    poin: 5,
                    label: '💇 Rambut Putra',
                    pts: '+5',
                  },
                  {
                    nama: 'Menggunakan HP saat KBM',
                    kategori: 'Ketertiban Kelas' as const,
                    poin: 10,
                    label: '📱 Main HP KBM',
                    pts: '+10',
                  },
                  {
                    nama: 'Membolos Jam KBM / Keluar Kelas',
                    kategori: 'Kedisiplinan' as const,
                    poin: 20,
                    label: '🏃 Cabut / Bolos',
                    pts: '+20',
                  },
                  {
                    nama: 'Merokok / Vaping di Sekolah',
                    kategori: 'Berat' as const,
                    poin: 50,
                    label: '🚬 Merokok / Vape',
                    pts: '+50',
                  },
                  {
                    nama: 'Berkelahi / Tindak Kekerasan',
                    kategori: 'Berat' as const,
                    poin: 75,
                    label: '⚔️ Berkelahi',
                    pts: '+75',
                  },
                ].map((rule, idx) => {
                  const isSelected = pelanggaranForm.jenisPelanggaran === rule.nama;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectViolationPreset(rule)}
                      className={`p-2 rounded-xl text-left font-bold transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-[11px] truncate pr-1">{rule.label}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                          isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {rule.pts}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Summary Card */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-600">Pelanggaran Terpilih:</span>
                <span className="font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                  +{pelanggaranForm.poin} Poin
                </span>
              </div>
              <div className="font-bold text-slate-900 text-[11px]">{pelanggaranForm.jenisPelanggaran}</div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                <span>
                  Disposisi: <strong>{pelanggaranForm.statusDisposisi}</strong>
                </span>
                <span>
                  Tindakan: <strong>{pelanggaranForm.tindakanPiket}</strong>
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSavePelanggaran}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Simpan Catatan Pelanggaran Siswa</span>
            </button>
          </div>

          {/* Today's Violations Stream */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Daftar Kasus Pelanggaran Terbaru</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500">{piketRecords.length} Kasus</span>
            </div>

            {piketRecords.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-slate-600">Sekolah Tertib & Kondusif</p>
                <p className="text-[10px]">Belum ada laporan pelanggaran hari ini.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {piketRecords.slice(0, 5).map((rec) => (
                  <div key={rec.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{rec.namaSiswa}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                          {rec.kelas}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                          +{rec.poin} Poin
                        </span>
                        <button
                          onClick={() => handleDeletePiketRecord(rec.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-700">{rec.jenisPelanggaran}</div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>{rec.jamKe}</span>
                      <span
                        className={`font-bold ${
                          rec.statusDisposisi === 'Rujukan ke Guru BK'
                            ? 'text-purple-600'
                            : rec.statusDisposisi === 'Diteruskan ke Wali Kelas'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {rec.statusDisposisi}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Direct Link to Rules and SP */}
            <button
              onClick={() => onNavigateModule('administrasi', 'laporan-piket')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Kelola Master Aturan & Terbitkan SP →</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 6. PANEL STATUS REKAP LIVE HARI INI ── */}
      {activeActionPane === 'rekap-live' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Rekapitulasi Kehadiran Per Kelas Hari Ini</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold">{classAttendance.length} Kelas</span>
            </div>

            <div className="space-y-2">
              {classAttendance.map((cls) => {
                const totalAbs = (cls.absenStudents || []).length;
                const hadirPct = Math.round((cls.hadir / cls.totalSiswa) * 100);

                return (
                  <div
                    key={cls.kelas}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-black text-xs">
                          {cls.kelas}
                        </span>
                        <span>{hadirPct}% Kehadiran</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {cls.hadir} Hadir
                        </span>
                        {cls.sakit > 0 && (
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {cls.sakit} S
                          </span>
                        )}
                        {cls.izin > 0 && (
                          <span className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                            {cls.izin} I
                          </span>
                        )}
                        {cls.alpa > 0 && (
                          <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                            {cls.alpa} A
                          </span>
                        )}
                      </div>
                    </div>

                    {totalAbs > 0 && (
                      <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-700">Absen: </span>
                        {cls.absenStudents.map((s, idx) => (
                          <span key={s.id} className="text-slate-800">
                            {s.nama} ({s.keterangan}){idx < cls.absenStudents.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
