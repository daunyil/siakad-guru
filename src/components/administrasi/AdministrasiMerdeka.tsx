import React, { useState, useMemo } from 'react';
import type { SchoolProfile, TeacherProfile, AcademicYear, AdminDocItem, AdminDocCategory } from '../../types';
import { initialAdminDocs } from '../../data/adminDocData';
import { CPViewerAndCustomizer } from './CPViewerAndCustomizer';
import { AtpGenerator } from './AtpGenerator';
import { LkpdGenerator } from './LkpdGenerator';
import { AsesmenSoalGenerator } from './AsesmenSoalGenerator';
import { ProtaProsemGenerator } from './ProtaProsemGenerator';
import { ModulAjarGenerator } from './ModulAjarGenerator';
import { AsesmenKKTPGenerator } from './AsesmenKKTPGenerator';
import { P5ProjekGenerator } from './P5ProjekGenerator';
import { PiketBkEkstraGenerator } from './PiketBkEkstraGenerator';
import { RemedialPengayaanGenerator } from './RemedialPengayaanGenerator';
import { IdentitasReplacerGenerator } from './IdentitasReplacerGenerator';
import { RmeKalkulatorGenerator } from './RmeKalkulatorGenerator';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Plus,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  FileSpreadsheet,
  FileCode,
  FolderArchive,
  ArrowRight,
  Printer,
  X,
  Building,
  User,
  Star,
  CheckSquare,
  ShieldCheck,
  FolderTree,
  Calculator,
  ChevronLeft
} from 'lucide-react';

interface AdministrasiMerdekaProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
  activeSubView?: string;
  onSubViewChange?: (subView: string) => void;
}

export const AdministrasiMerdeka: React.FC<AdministrasiMerdekaProps> = ({
  school,
  teacher,
  year,
  selectedAssignmentSubject = 'Pendidikan Pancasila',
  selectedClassLabel = 'VII-A',
  activeSubView: externalSubView,
  onSubViewChange,
}) => {
  const [docs, setDocs] = useState<AdminDocItem[]>(initialAdminDocs);
  const [internalSubView, setInternalSubView] = useState<string>('katalog');

  // Active subview logic (sync external or internal)
  const currentSubView = externalSubView || internalSubView;
  const handleSetSubView = (sv: string) => {
    setInternalSubView(sv);
    if (onSubViewChange) {
      onSubViewChange(sv);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<AdminDocCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<string>('semua');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [activePreviewDoc, setActivePreviewDoc] = useState<AdminDocItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);


  // Filtered docs logic
  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      // Category match
      if (selectedCategory !== 'semua' && doc.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (
        searchQuery.trim() !== '' &&
        !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Format match
      if (formatFilter !== 'semua' && doc.format !== formatFilter) {
        return false;
      }
      // Status match
      if (statusFilter !== 'semua' && doc.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [docs, selectedCategory, searchQuery, formatFilter, statusFilter]);

  // Completion Stats
  const stats = useMemo(() => {
    const total = docs.length;
    const lengkap = docs.filter((d) => d.status === 'Lengkap').length;
    const draf = docs.filter((d) => d.status === 'Draf').length;
    const perluDiisi = docs.filter((d) => d.status === 'Perlu Diisi').length;

    const perencanaan = docs.filter((d) => d.category === 'perencanaan');
    const perencanaanLengkap = perencanaan.filter((d) => d.status === 'Lengkap').length;

    const pelaksanaan = docs.filter((d) => d.category === 'pelaksanaan');
    const pelaksanaanLengkap = pelaksanaan.filter((d) => d.status === 'Lengkap').length;

    const evaluasi = docs.filter((d) => d.category === 'evaluasi');
    const evaluasiLengkap = evaluasi.filter((d) => d.status === 'Lengkap').length;

    return {
      total,
      lengkap,
      draf,
      perluDiisi,
      percent: Math.round((lengkap / total) * 100),
      perencanaanTotal: perencanaan.length,
      perencanaanLengkap,
      perencanaanPct: Math.round((perencanaanLengkap / (perencanaan.length || 1)) * 100),
      pelaksanaanTotal: pelaksanaan.length,
      pelaksanaanLengkap,
      pelaksanaanPct: Math.round((pelaksanaanLengkap / (pelaksanaan.length || 1)) * 100),
      evaluasiTotal: evaluasi.length,
      evaluasiLengkap,
      evaluasiPct: Math.round((evaluasiLengkap / (evaluasi.length || 1)) * 100),
    };
  }, [docs]);

  const toggleFavorite = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
    );
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleDownloadTemplate = (doc: AdminDocItem) => {
    showToast(`Mempersiapkan unduhan template: ${doc.code} - ${doc.title}...`);
  };

  return (
    <div className="space-y-6">
      {/* ── NOTIFICATION TOAST ── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── HEADER BANNER (Shown ONLY when on Katalog view to keep tool workspace clean & distraction-free) ── */}
      {currentSubView === 'katalog' && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Kurikulum Merdeka 2025/2026
                </span>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" />
                  Lengkap 3 Tahapan KBM
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Kumpulan Dokumen Administrasi Guru
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Pusat perangkat pembelajaran dan administrasi guru terpadu Kurikulum Merdeka. Terstruktur dari <strong className="text-blue-300">Tahap Perencanaan</strong>, <strong className="text-blue-300">Pelaksanaan Pembelajaran</strong>, hingga <strong className="text-blue-300">Evaluasi & Asesmen</strong>.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  <span>{school.name}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{teacher.name}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedClassLabel} · {selectedAssignmentSubject}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                onClick={() => showToast('Membuka form penambahan dokumen baru...')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Dokumen</span>
              </button>
              <button
                onClick={() => showToast('Menyiapkan paket unduhan bundel ZIP seluruh dokumen...')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <FolderArchive className="w-4 h-4 text-emerald-400" />
                <span>Unduh Paket ZIP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UNIFIED COMPACT SUB-MODULE CATEGORIZED NAVIGATION ── */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 no-print">
        {/* Stage / Module Primary Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs font-bold">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Back to catalog button when inside a tool */}
            {currentSubView !== 'katalog' && (
              <button
                onClick={() => handleSetSubView('katalog')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs mr-1"
                title="Kembali ke Daftar Katalog Dokumen"
              >
                <ChevronLeft className="w-4 h-4 text-amber-400" />
                <span>Katalog Dokumen</span>
              </button>
            )}

            {currentSubView === 'katalog' && (
              <button
                onClick={() => handleSetSubView('katalog')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-extrabold shadow-2xs flex items-center gap-1.5"
              >
                <FolderTree className="w-4 h-4 text-blue-400" />
                <span>Semua Dokumen</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-semibold">
                  {docs.length}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                if (!['rme-kalkulator', 'prota-prosem', 'atp', 'cp-bskap'].includes(currentSubView)) {
                  handleSetSubView('rme-kalkulator');
                }
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                ['rme-kalkulator', 'prota-prosem', 'atp', 'cp-bskap'].includes(currentSubView)
                  ? 'bg-blue-600 text-white font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/70'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-blue-300" />
              <span>1. Perencanaan & Kaldik</span>
            </button>

            <button
              onClick={() => {
                if (!['modul-ajar', 'lkpd'].includes(currentSubView)) {
                  handleSetSubView('modul-ajar');
                }
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                ['modul-ajar', 'lkpd'].includes(currentSubView)
                  ? 'bg-emerald-600 text-white font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              <span>2. Modul & Perangkat</span>
            </button>

            <button
              onClick={() => {
                if (!['asesmen-soal', 'asesmen-kktp', 'remedial-pengayaan'].includes(currentSubView)) {
                  handleSetSubView('asesmen-soal');
                }
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                ['asesmen-soal', 'asesmen-kktp', 'remedial-pengayaan'].includes(currentSubView)
                  ? 'bg-purple-600 text-white font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/70'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-purple-300" />
              <span>3. Asesmen & Evaluasi</span>
            </button>

            <button
              onClick={() => {
                if (!['p5-projek', 'laporan-piket', 'buku-poin-pelanggaran', 'piket-bk-ekskul', 'adaptor-identitas'].includes(currentSubView)) {
                  handleSetSubView('p5-projek');
                }
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                ['p5-projek', 'laporan-piket', 'buku-poin-pelanggaran', 'piket-bk-ekskul', 'adaptor-identitas'].includes(currentSubView)
                  ? 'bg-amber-600 text-white font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50/70'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-300" />
              <span>4. P5 & Tugas Tambahan</span>
            </button>
          </div>

          {/* School/Class indicator on far right */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="px-2 py-0.5 bg-slate-100 rounded-lg text-[11px]">
              🏫 {school.name}
            </span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-lg text-[11px]">
              {selectedClassLabel} · {selectedAssignmentSubject}
            </span>
          </div>
        </div>

        {/* Sub-Tools Subbar */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold pt-0.5">
          {/* If in Katalog */}
          {currentSubView === 'katalog' && (
            <span className="text-slate-500 text-xs font-medium flex items-center gap-2">
              <FolderTree className="w-3.5 h-3.5 text-blue-500" />
              Pilih modul generator di atas atau jelajahi katalog dokumen di bawah
            </span>
          )}

          {/* If in Stage 1 Tools */}
          {['rme-kalkulator', 'cp-bskap', 'atp', 'prota-prosem'].includes(currentSubView) && (
            <>
              <button
                onClick={() => handleSetSubView('rme-kalkulator')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'rme-kalkulator'
                    ? 'bg-blue-700 text-white border-blue-700 font-bold shadow-2xs'
                    : 'bg-blue-50/80 text-blue-900 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>1. Kalkulator RME & Jam</span>
              </button>
              <button
                onClick={() => handleSetSubView('cp-bskap')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'cp-bskap'
                    ? 'bg-blue-700 text-white border-blue-700 font-bold shadow-2xs'
                    : 'bg-blue-50/80 text-blue-900 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. Master CP BSKAP</span>
              </button>
              <button
                onClick={() => handleSetSubView('atp')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'atp'
                    ? 'bg-blue-700 text-white border-blue-700 font-bold shadow-2xs'
                    : 'bg-blue-50/80 text-blue-900 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3. ATP Generator</span>
              </button>
              <button
                onClick={() => handleSetSubView('prota-prosem')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'prota-prosem'
                    ? 'bg-blue-700 text-white border-blue-700 font-bold shadow-2xs'
                    : 'bg-blue-50/80 text-blue-900 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>4. PROTA & PROSEM</span>
              </button>
            </>
          )}

          {/* If in Stage 2 Tools */}
          {['modul-ajar', 'lkpd'].includes(currentSubView) && (
            <>
              <button
                onClick={() => handleSetSubView('modul-ajar')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'modul-ajar'
                    ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-2xs'
                    : 'bg-emerald-50/80 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Modul Ajar (RPP Merdeka)</span>
              </button>
              <button
                onClick={() => handleSetSubView('lkpd')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'lkpd'
                    ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-2xs'
                    : 'bg-emerald-50/80 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>2. LKPD Siswa Interaktif</span>
              </button>
            </>
          )}

          {/* If in Stage 3 Tools */}
          {['asesmen-soal', 'asesmen-kktp', 'remedial-pengayaan'].includes(currentSubView) && (
            <>
              <button
                onClick={() => handleSetSubView('asesmen-soal')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'asesmen-soal'
                    ? 'bg-purple-700 text-white border-purple-700 font-bold shadow-2xs'
                    : 'bg-purple-50/80 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>1. Kisi-Kisi & Bank Soal</span>
              </button>
              <button
                onClick={() => handleSetSubView('asesmen-kktp')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'asesmen-kktp'
                    ? 'bg-purple-700 text-white border-purple-700 font-bold shadow-2xs'
                    : 'bg-purple-50/80 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>2. KKTP & Nilai e-Rapor</span>
              </button>
              <button
                onClick={() => handleSetSubView('remedial-pengayaan')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'remedial-pengayaan'
                    ? 'bg-purple-700 text-white border-purple-700 font-bold shadow-2xs'
                    : 'bg-purple-50/80 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Remedial & Pengayaan</span>
              </button>
            </>
          )}

          {/* If in Stage 4 Tools */}
          {['p5-projek', 'laporan-piket', 'buku-poin-pelanggaran', 'piket-bk-ekskul', 'adaptor-identitas'].includes(currentSubView) && (
            <>
              <button
                onClick={() => handleSetSubView('p5-projek')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'p5-projek'
                    ? 'bg-amber-700 text-white border-amber-700 font-bold shadow-2xs'
                    : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>1. Modul P5</span>
              </button>
              <button
                onClick={() => handleSetSubView('laporan-piket')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'laporan-piket'
                    ? 'bg-red-700 text-white border-red-700 font-bold shadow-2xs'
                    : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. Laporan Piket</span>
              </button>
              <button
                onClick={() => handleSetSubView('buku-poin-pelanggaran')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'buku-poin-pelanggaran'
                    ? 'bg-amber-700 text-white border-amber-700 font-bold shadow-2xs'
                    : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>3. Buku Poin Pelanggaran</span>
              </button>
              <button
                onClick={() => handleSetSubView('adaptor-identitas')}
                className={`py-1 px-2.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentSubView === 'adaptor-identitas'
                    ? 'bg-slate-800 text-white border-slate-800 font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>4. Adaptor Identitas</span>
              </button>
            </>
          )}
        </div>
      </div>

      {currentSubView === 'rme-kalkulator' ? (
        <RmeKalkulatorGenerator
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
          onApplyToProtaProsem={() => handleSetSubView('prota-prosem')}
        />
      ) : currentSubView === 'atp' ? (
        <AtpGenerator
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
        />
      ) : currentSubView === 'cp-bskap' ? (
        <CPViewerAndCustomizer
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
        />
      ) : currentSubView === 'prota-prosem' ? (
        <ProtaProsemGenerator
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
        />
      ) : currentSubView === 'modul-ajar' ? (
        <ModulAjarGenerator
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
        />
      ) : currentSubView === 'lkpd' ? (
        <LkpdGenerator
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
        />
      ) : currentSubView === 'asesmen-soal' ? (
        <AsesmenSoalGenerator
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
        />
      ) : currentSubView === 'asesmen-kktp' ? (
        <AsesmenKKTPGenerator
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
        />
      ) : currentSubView === 'remedial-pengayaan' ? (
        <RemedialPengayaanGenerator
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
        />
      ) : currentSubView === 'p5-projek' ? (
        <P5ProjekGenerator
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
        />
      ) : currentSubView === 'laporan-piket' ? (
        <PiketBkEkstraGenerator school={school} teacher={teacher} year={year} initialTab="piket" />
      ) : currentSubView === 'buku-poin-pelanggaran' ? (
        <PiketBkEkstraGenerator school={school} teacher={teacher} year={year} initialTab="poin-pelanggaran" />
      ) : currentSubView === 'piket-bk-ekskul' ? (
        <PiketBkEkstraGenerator school={school} teacher={teacher} year={year} initialTab="piket" />
      ) : currentSubView === 'adaptor-identitas' ? (
        <IdentitasReplacerGenerator
          school={school}
          teacher={teacher}
          year={year}
          selectedAssignmentSubject={selectedAssignmentSubject}
          selectedClassLabel={selectedClassLabel}
        />
      ) : (
        <>
          {/* ── PROGRESS & STAGE SUMMARY CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Total Overall Progress Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Progres Administrasi</span>
              <span className="font-bold text-blue-700">{stats.percent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-3">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> {stats.lengkap} Lengkap
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-semibold">
              <Clock className="w-3.5 h-3.5" /> {stats.draf} Draf
            </span>
            <span className="flex items-center gap-1 text-rose-600 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" /> {stats.perluDiisi} Isi
            </span>
          </div>
        </div>

        {/* Tahap 1: Perencanaan Card */}
        <div
          onClick={() => setSelectedCategory('perencanaan')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm flex flex-col justify-between ${
            selectedCategory === 'perencanaan'
              ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                1. Perencanaan
              </span>
              <span className="font-bold text-blue-700">{stats.perencanaanPct}%</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">CP, ATP, Modul Ajar, Prota & Promes, KKTP</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-100/80">
            <span className="font-semibold text-slate-800">{stats.perencanaanLengkap} / {stats.perencanaanTotal} Selesai</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-0.5">
              Lihat <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Tahap 2: Pelaksanaan Card */}
        <div
          onClick={() => setSelectedCategory('pelaksanaan')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm flex flex-col justify-between ${
            selectedCategory === 'pelaksanaan'
              ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                2. Pelaksanaan
              </span>
              <span className="font-bold text-emerald-700">{stats.pelaksanaanPct}%</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">Jurnal KBM, Presensi, P5, Remedial & Pengayaan</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-100/80">
            <span className="font-semibold text-slate-800">{stats.pelaksanaanLengkap} / {stats.pelaksanaanTotal} Selesai</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-0.5">
              Lihat <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Tahap 3: Evaluasi & Asesmen Card */}
        <div
          onClick={() => setSelectedCategory('evaluasi')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm flex flex-col justify-between ${
            selectedCategory === 'evaluasi'
              ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-500/20'
              : 'bg-white border-slate-200 hover:border-purple-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                3. Evaluasi & Asesmen
              </span>
              <span className="font-bold text-purple-700">{stats.evaluasiPct}%</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">Diagnostik, Bank Soal, Daftar Nilai, Analisis & Leger</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-100/80">
            <span className="font-semibold text-slate-800">{stats.evaluasiLengkap} / {stats.evaluasiTotal} Selesai</span>
            <span className="text-[10px] font-bold text-purple-600 uppercase flex items-center gap-0.5">
              Lihat <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Category Stage Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSelectedCategory('semua')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCategory === 'semua'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Tahap ({docs.length})
          </button>
          <button
            onClick={() => setSelectedCategory('perencanaan')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedCategory === 'perencanaan'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            1. Perencanaan ({stats.perencanaanTotal})
          </button>
          <button
            onClick={() => setSelectedCategory('pelaksanaan')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedCategory === 'pelaksanaan'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            2. Pelaksanaan ({stats.pelaksanaanTotal})
          </button>
          <button
            onClick={() => setSelectedCategory('evaluasi')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedCategory === 'evaluasi'
                ? 'bg-purple-600 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-300" />
            3. Evaluasi & Asesmen ({stats.evaluasiTotal})
          </button>
        </div>

        {/* Search & Select dropdown filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari dokumen (ATP, Modul, Soal...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 md:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Format Dropdown */}
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="semua">Format: Semua</option>
            <option value="DOCX">DOCX (Word)</option>
            <option value="XLSX">XLSX (Excel)</option>
            <option value="FORM">FORM (Aplikasi)</option>
            <option value="PDF">PDF</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="semua">Status: Semua</option>
            <option value="Lengkap">Lengkap</option>
            <option value="Draf">Draf</option>
            <option value="Perlu Diisi">Perlu Diisi</option>
          </select>
        </div>
      </div>

      {/* ── DOCUMENTS LIST / GRID ── */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tidak ada dokumen yang sesuai</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau sesuaikan filter tahap, format, atau status dokumen.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('semua');
              setSearchQuery('');
              setFormatFilter('semua');
              setStatusFilter('semua');
            }}
            className="text-xs text-blue-600 font-bold hover:underline pt-2 inline-block"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const isPerencanaan = doc.category === 'perencanaan';
            const isPelaksanaan = doc.category === 'pelaksanaan';
            
            return (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Accent Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isPerencanaan ? 'bg-blue-600' : isPelaksanaan ? 'bg-emerald-600' : 'bg-purple-600'
                  }`}
                />

                <div>
                  {/* Category Tag & Favorite */}
                  <div className="flex items-center justify-between gap-2 mb-2 pt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                        isPerencanaan
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : isPelaksanaan
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {doc.code} · {doc.categoryLabel}
                    </span>

                    <button
                      onClick={() => toggleFavorite(doc.id)}
                      className="text-slate-300 hover:text-amber-400 transition-colors"
                      title="Tandai Favorit"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          doc.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & Format Icon */}
                  <div className="flex items-start gap-2.5 mb-2">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        doc.format === 'DOCX'
                          ? 'bg-blue-100 text-blue-700'
                          : doc.format === 'XLSX'
                          ? 'bg-emerald-100 text-emerald-700'
                          : doc.format === 'FORM'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {doc.format === 'DOCX' ? (
                        <FileText className="w-5 h-5" />
                      ) : doc.format === 'XLSX' ? (
                        <FileSpreadsheet className="w-5 h-5" />
                      ) : (
                        <FileCode className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                        {doc.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Metadata & Actions */}
                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Diperbarui: {doc.lastUpdated}</span>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        doc.status === 'Lengkap'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : doc.status === 'Draf'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {doc.status === 'Lengkap' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : doc.status === 'Draf' ? (
                        <Clock className="w-3 h-3 text-amber-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                      )}
                      {doc.status}
                    </span>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActivePreviewDoc(doc)}
                        className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Pratinjau</span>
                      </button>
                      <button
                        onClick={() => handleDownloadTemplate(doc)}
                        className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        <span>Unduh {doc.format}</span>
                      </button>
                    </div>

                    {(doc.code === 'ADM-P01' || doc.code === 'DOC-01' || doc.code === 'DOC-02') && (
                      <button
                        onClick={() => handleSetSubView('cp-bskap')}
                        className="w-full py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Buka Master CP BSKAP & Editor KOP</span>
                      </button>
                    )}

                    {(doc.code === 'ADM-P02' || doc.title.toLowerCase().includes('atp') || doc.title.toLowerCase().includes('alur tujuan')) && (
                      <button
                        onClick={() => handleSetSubView('atp')}
                        className="w-full py-1.5 px-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-900 border border-blue-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span>Buka Generator ATP (Alur Tujuan)</span>
                      </button>
                    )}

                    {(doc.code === 'ADM-P04' || doc.code === 'ADM-P05') && (
                      <button
                        onClick={() => handleSetSubView('prota-prosem')}
                        className="w-full py-1.5 px-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-800 border border-indigo-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Buka Generator PROTA & PROSEM</span>
                      </button>
                    )}

                    {(doc.code === 'ADM-P03' || doc.title.toLowerCase().includes('modul ajar') || doc.title.toLowerCase().includes('rpp')) && (
                      <button
                        onClick={() => handleSetSubView('modul-ajar')}
                        className="w-full py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Buka Generator Modul Ajar (RPP)</span>
                      </button>
                    )}

                    {(doc.code === 'ADM-P03' || doc.title.toLowerCase().includes('lkpd') || doc.title.toLowerCase().includes('lembar kerja')) && (
                      <button
                        onClick={() => handleSetSubView('lkpd')}
                        className="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-900 border border-teal-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                        <span>Buka Generator LKPD Siswa</span>
                      </button>
                    )}

                    {(doc.code === 'ADM-E02' || doc.title.toLowerCase().includes('soal') || doc.title.toLowerCase().includes('kisi-kisi')) && (
                      <button
                        onClick={() => handleSetSubView('asesmen-soal')}
                        className="w-full py-1.5 px-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-900 border border-purple-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
                        <span>Buka Generator Kisi-Kisi & Kartu Soal</span>
                      </button>
                    )}

                    {(doc.code === 'ADM-E01' || doc.code === 'ADM-E03' || doc.code === 'ADM-E05' || doc.code === 'ADM-P06' || doc.category === 'evaluasi') && (
                      <button
                        onClick={() => handleSetSubView('asesmen-kktp')}
                        className="w-full py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Buka Generator KKTP & Nilai e-Rapor</span>
                      </button>
                    )}

                    {(doc.code === 'ADM-P04' || doc.category === 'projek' || doc.title.toLowerCase().includes('p5') || doc.title.toLowerCase().includes('profil pelajar pancasila')) && (
                      <button
                        onClick={() => handleSetSubView('p5-projek')}
                        className="w-full py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-600" />
                        <span>Buka Generator Modul & Rapor P5</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
      </>
      )}

      {/* ── DOCUMENT PREVIEW MODAL ── */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded text-[10px] font-bold">
                  {activePreviewDoc.code}
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  {activePreviewDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePreviewDoc(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Document Body (Styled with Times New Roman Official Format) */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 document-page bg-white text-black text-xs leading-normal">
              {/* Kop Header Standar Dokumen */}
              <div className="text-center border-b border-black pb-3 space-y-1">
                <h1 className="text-sm font-bold uppercase tracking-wider">
                  PERANGKAT ADMINISTRASI GURU KURIKULUM MERDEKA
                </h1>
                <h2 className="text-xs font-bold uppercase">
                  {school.name.toUpperCase()}
                </h2>
                <div className="text-[11px] font-bold">
                  TAHUN PELAJARAN {year.label}
                </div>
              </div>

              {/* Document Sub Metadata */}
              <table className="w-full text-xs font-serif" style={{ border: 'none' }}>
                <tbody>
                  <tr style={{ border: 'none' }}>
                    <td style={{ border: 'none', width: '50%' }}>
                      <div><strong>NAMA DOKUMEN:</strong> {activePreviewDoc.title}</div>
                      <div><strong>KODE ADMINISTRASI:</strong> {activePreviewDoc.code}</div>
                      <div><strong>MATA PELAJARAN:</strong> {teacher.subject}</div>
                    </td>
                    <td style={{ border: 'none', width: '50%', textAlign: 'left' }}>
                      <div><strong>GURU MATA PELAJARAN:</strong> {teacher.name}</div>
                      <div><strong>NIP:</strong> {teacher.nip || '----------------'}</div>
                      <div><strong>FASE / KELAS:</strong> Fase D / {selectedClassLabel}</div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Sample Official Template Structure Preview */}
              <div className="border border-black p-4 space-y-3 bg-slate-50/50 rounded">
                <div className="font-bold uppercase text-[11px] underline">
                  I. PANDUAN DAN SISTEMATIKA DOKUMEN ({activePreviewDoc.code})
                </div>
                <p className="text-justify leading-relaxed">
                  Dokumen ini disusun sebagai bagian dari pemenuhan administrasi pembelajaran Kurikulum Merdeka di {school.name}. Dokumen mencakup penetapan alur tujuan, indikator ketercapaian, serta strategi asesmen yang selaras dengan Capaian Pembelajaran (CP) terbaru.
                </p>

                <div className="font-bold uppercase text-[11px] underline pt-2">
                  II. DESKRIPSI DAN RINGKASAN ISI DOKUMEN
                </div>
                <p className="text-justify leading-relaxed">
                  {activePreviewDoc.description}
                </p>

                <div className="pt-3">
                  <table className="w-full border-collapse border border-black text-[11px]">
                    <thead>
                      <tr className="bg-slate-200 border-b border-black">
                        <th className="border border-black px-2 py-1 text-center font-bold">No</th>
                        <th className="border border-black px-2 py-1 text-left font-bold">Komponen Utama Dokumen</th>
                        <th className="border border-black px-2 py-1 text-center font-bold">Status Pemenuhan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="border border-black text-center py-1">1</td>
                        <td className="border border-black px-2 py-1">Identitas Sekolah, Mata Pelajaran, & Fase/Kelas</td>
                        <td className="border border-black text-center py-1 font-bold text-emerald-800">Lengkap</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border border-black text-center py-1">2</td>
                        <td className="border border-black px-2 py-1">Kesesuaian dengan BSKAP Capaian Pembelajaran (CP) Terbaru</td>
                        <td className="border border-black text-center py-1 font-bold text-emerald-800">Sesuai Standard</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border border-black text-center py-1">3</td>
                        <td className="border border-black px-2 py-1">Pemetaan Lampiran, Rubrik Asesmen, & Lembar Kerja</td>
                        <td className="border border-black text-center py-1 font-bold text-slate-800">
                          {activePreviewDoc.status}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tanda Tangan Official */}
              <div className="pt-6 flex justify-between text-xs font-serif">
                <div className="text-center w-52">
                  <div>Mengetahui,</div>
                  <div>Kepala {school.name}</div>
                  <div className="h-16" />
                  <div className="font-bold underline">{school.headmasterName}</div>
                  <div>NIP. {school.headmasterNip}</div>
                </div>

                <div className="text-center w-52">
                  <div>Bantan, 14 Juli 2025</div>
                  <div>Guru Mata Pelajaran</div>
                  <div className="h-16" />
                  <div className="font-bold underline">{teacher.name}</div>
                  <div>NIP. {teacher.nip}</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Format: <strong className="text-slate-800">{activePreviewDoc.format}</strong> · Status: <strong className="text-emerald-700">{activePreviewDoc.status}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActivePreviewDoc(null);
                    showToast(`Mencetak dokumen ${activePreviewDoc.code}...`);
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Draft</span>
                </button>
                <button
                  onClick={() => {
                    setActivePreviewDoc(null);
                    handleDownloadTemplate(activePreviewDoc);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File {activePreviewDoc.format}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
