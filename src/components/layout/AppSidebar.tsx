import React from 'react';
import type { MainModule, RekapTab, TeacherProfile, SchoolProfile, UserRole } from '../../types';
import {
  FolderTree,
  BarChart3,
  Calendar,
  BookOpen,
  Award,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Search,
  Calculator,
  Layers,
  ShieldCheck,
  CheckSquare,
  Star,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  RotateCcw,
  BookMarked,
  Building2,
  FileBadge,
  Puzzle,
  RefreshCw,
  Folder,
  Zap,
  Printer,
  ShieldAlert,
  Scan,
  CreditCard,
  GraduationCap,
  HeartHandshake,
  UserCheck,
  UserX,
  SlidersHorizontal,
} from 'lucide-react';

interface AppSidebarProps {
  mainModule: MainModule;
  setMainModule: (mod: MainModule) => void;
  tab: RekapTab;
  setTab: (tab: RekapTab) => void;
  adminSubView: string;
  setAdminSubView: (subView: string) => void;
  sidebarSearch: string;
  setSidebarSearch: (val: string) => void;
  expandedGroups: Record<string, boolean>;
  setExpandedGroups: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (val: boolean) => void;
  teacher: TeacherProfile;
  school: SchoolProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenBackupModal?: () => void;
  onOpenBarcodeScanner?: () => void;
  onOpenCardGenerator?: () => void;
  onOpenTeacherSwitcher?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  mainModule,
  setMainModule,
  tab,
  setTab,
  adminSubView,
  setAdminSubView,
  sidebarSearch,
  setSidebarSearch,
  expandedGroups,
  setExpandedGroups,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  teacher,
  school,
  currentRole,
  setCurrentRole,
  onOpenBackupModal,
  onOpenBarcodeScanner,
  onOpenCardGenerator,
  onOpenTeacherSwitcher,
}) => {
  const query = sidebarSearch.toLowerCase().trim();

  // Helper check if group should show up during search
  const isGroupVisible = (keywords: string) => {
    if (!query) return true;
    return keywords.toLowerCase().includes(query);
  };

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: prev[key] === undefined ? false : !prev[key],
    }));
  };

  return (
    <aside
      className={`bg-slate-950 text-white border-r border-slate-800 transition-all duration-300 flex flex-col no-print z-40 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } ${
        isMobileSidebarOpen
          ? 'fixed inset-y-0 left-0 w-72 shadow-2xl z-50'
          : 'hidden md:flex relative'
      }`}
    >
      {/* ── SIDEBAR HEADER ── */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-extrabold text-white text-xs shadow-md shrink-0">
            KM
          </div>
          {!isSidebarCollapsed && (
            <div>
              <h1 className="font-extrabold text-sm text-white leading-none">Guru Admin</h1>
              <p className="text-[10px] text-blue-400 font-semibold mt-0.5">Kurikulum Merdeka</p>
            </div>
          )}
        </div>

        {/* Toggle Collapse Desktop */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Close Mobile */}
        {isMobileSidebarOpen && (
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── ROLE SWITCHER (SUBJECT TEACHER VS GURU PIKET) ── */}
      {!isSidebarCollapsed ? (
        <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-blue-400" />
              <span>Status Peran Aktif:</span>
            </span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                currentRole === 'guru_piket'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {currentRole === 'guru_piket' ? '🛡️ Piket' : '🎓 Mapel'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
            <button
              onClick={() => setCurrentRole('subject_teacher')}
              title="Masuk sebagai Guru Mata Pelajaran (Subject Teacher)"
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                currentRole === 'subject_teacher'
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="truncate">Guru Mapel</span>
            </button>

            <button
              onClick={() => setCurrentRole('guru_piket')}
              title="Masuk sebagai Guru Piket (Duty / Gate Teacher)"
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                currentRole === 'guru_piket'
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="truncate">Guru Piket</span>
            </button>
          </div>
        </div>
      ) : (
        /* Collapsed Role Icon Trigger */
        <div className="p-2 border-b border-slate-800/80 flex justify-center">
          <button
            onClick={() => setCurrentRole(currentRole === 'guru_piket' ? 'subject_teacher' : 'guru_piket')}
            title={`Peran Aktif: ${currentRole === 'guru_piket' ? 'Guru Piket' : 'Guru Mapel'}. Klik untuk beralih.`}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              currentRole === 'guru_piket'
                ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40 hover:bg-rose-600/50'
                : 'bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50'
            }`}
          >
            {currentRole === 'guru_piket' ? (
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            ) : (
              <GraduationCap className="w-4 h-4 text-blue-400" />
            )}
          </button>
        </div>
      )}

      {/* ── SEARCH BAR ── */}
      {!isSidebarCollapsed && (
        <div className="p-2.5 border-b border-slate-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder={currentRole === 'guru_piket' ? "Cari fitur piket / kasus..." : "Cari fitur / menu..."}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-6 py-1.5 focus:outline-hidden focus:border-blue-500"
            />
            {sidebarSearch && (
              <button
                onClick={() => setSidebarSearch('')}
                className="absolute right-2 top-2 text-[10px] text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── MENU NAVIGATION (STRUCTURED BY TEACHER ROLE & WORKFLOW) ── */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ROLE-BASED DYNAMIC TOP SECTION                                 */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {currentRole === 'guru_piket' ? (
          /* ──────────────────────────────────────────────────────────── */
          /* 🛡️ GURU PIKET PRIMARY NAVIGATION SECTION                    */
          /* ──────────────────────────────────────────────────────────── */
          <div className="space-y-1 bg-gradient-to-b from-rose-950/30 to-slate-950/30 p-1.5 rounded-2xl border border-rose-500/30">
            {!isSidebarCollapsed ? (
              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                  <span>1. RUTINITAS GURU PIKET</span>
                </span>
                <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded font-bold animate-pulse">
                  Piket Aktif
                </span>
              </div>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-rose-400 uppercase py-1">PIKET</div>
            )}

            {/* Dashboard Utama (In Piket Mode) */}
            <button
              onClick={() => {
                setMainModule('dashboard');
                setIsMobileSidebarOpen(false);
              }}
              title="Dashboard Utama Piket"
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                mainModule === 'dashboard'
                  ? 'bg-rose-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <LayoutDashboard className="w-4 h-4 text-rose-400 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <div className="truncate font-bold">Dashboard Piket</div>
                  <div className="text-[10px] text-rose-300 truncate">Ringkasan Gerbang & Kasus</div>
                </div>
              )}
            </button>

            {/* Scan Presensi Barcode / QR (Gerbang Pagi) */}
            {onOpenBarcodeScanner && (
              <button
                onClick={() => {
                  onOpenBarcodeScanner();
                  setIsMobileSidebarOpen(false);
                }}
                title="Scan Barcode Siswa (Gerbang & Presensi)"
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-rose-600/30 to-amber-600/30 hover:from-rose-600/50 hover:to-amber-600/50 text-rose-200 border border-rose-500/40 shadow-xs ${
                  isSidebarCollapsed ? 'justify-center' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Scan className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                  {!isSidebarCollapsed && <span className="truncate">Scan QR / Barcode Gerbang</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded shadow-2xs">
                    GERBANG
                  </span>
                )}
              </button>
            )}

            {/* Absen Piket Cepat (Semua Kelas) */}
            <button
              onClick={() => {
                setMainModule('administrasi');
                setAdminSubView('laporan-piket');
                setIsMobileSidebarOpen(false);
              }}
              title="Absen Piket Semua Kelas"
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                mainModule === 'administrasi' && adminSubView === 'laporan-piket'
                  ? 'bg-rose-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <UserX className="w-4 h-4 text-amber-400 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <div className="truncate font-bold">Absen Piket Gerbang / Kelas</div>
                  <div className="text-[10px] text-slate-400 truncate">Catat Sakit, Izin, Alpa, Bolos</div>
                </div>
              )}
            </button>

            {/* Buku Pelanggaran & Poin Disiplin */}
            <button
              onClick={() => {
                setMainModule('administrasi');
                setAdminSubView('buku-poin-pelanggaran');
                setIsMobileSidebarOpen(false);
              }}
              title="Catat Poin Pelanggaran Siswa"
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                mainModule === 'administrasi' && adminSubView === 'buku-poin-pelanggaran'
                  ? 'bg-rose-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <div className="truncate font-bold">Catat Pelanggaran Siswa</div>
                  <div className="text-[10px] text-slate-400 truncate">Poin Disiplin & Disposisi BK</div>
                </div>
              )}
            </button>

            {/* Rujukan BK & SP Siswa */}
            <button
              onClick={() => {
                setMainModule('administrasi');
                setAdminSubView('bimbingan-konseling');
                setIsMobileSidebarOpen(false);
              }}
              title="Rujukan Guru BK & SP Panggilan"
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                mainModule === 'administrasi' && adminSubView === 'bimbingan-konseling'
                  ? 'bg-rose-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <HeartHandshake className="w-4 h-4 text-pink-400 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <div className="truncate font-bold">Rujukan BK & Konseling</div>
                  <div className="text-[10px] text-slate-400 truncate">Surat Panggilan Orang Tua</div>
                </div>
              )}
            </button>
          </div>
        ) : (
          /* ──────────────────────────────────────────────────────────── */
          /* 🎓 SUBJECT TEACHER PRIMARY NAVIGATION SECTION               */
          /* ──────────────────────────────────────────────────────────── */
          isGroupVisible('harian daily dashboard kbm jurnal tatap muka presensi mengajar piket pelanggaran') && (
            <div className="space-y-1">
              {!isSidebarCollapsed ? (
                <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>1. RUTINITAS GURU MAPEL</span>
                  </span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-bold">
                    KBM Harian
                  </span>
                </div>
              ) : (
                <div className="w-full text-center text-[9px] font-bold text-amber-400 uppercase py-1">KBM</div>
              )}

              {/* Dashboard Utama */}
              <button
                onClick={() => {
                  setMainModule('dashboard');
                  setIsMobileSidebarOpen(false);
                }}
                title="Dashboard Utama"
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  mainModule === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4 text-sky-400 shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">Dashboard Utama</span>}
              </button>

              {/* Scan Presensi Barcode / QR */}
              {onOpenBarcodeScanner && (
                <button
                  onClick={() => {
                    onOpenBarcodeScanner();
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Scan Barcode & QR Presensi"
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 text-blue-200 border border-blue-500/40 shadow-xs ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Scan className="w-4 h-4 text-blue-400 shrink-0 animate-pulse" />
                    {!isSidebarCollapsed && <span className="truncate">Scan Barcode / QR</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[9px] bg-blue-500 text-white font-black px-1.5 py-0.2 rounded shadow-2xs">
                      SCAN
                    </span>
                  )}
                </button>
              )}

              {/* KBM Hari Ini (Jurnal & Presensi Tatap Muka) */}
              <button
                onClick={() => {
                  setMainModule('rekap');
                  setTab('jurnal');
                  setIsMobileSidebarOpen(false);
                }}
                title="KBM Hari Ini (Jurnal & Presensi)"
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  mainModule === 'rekap' && (tab === 'jurnal' || tab === 'tatap-muka')
                    ? 'bg-emerald-600 text-white shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                {!isSidebarCollapsed && (
                  <div className="text-left flex-1 min-w-0">
                    <div className="truncate font-bold">KBM Hari Ini</div>
                    <div className="text-[10px] text-slate-400 truncate">Jurnal Mengajar & Presensi JP</div>
                  </div>
                )}
              </button>

              {/* Guru Piket & Ketertiban (Shortcut in Mapel view) */}
              <button
                onClick={() => {
                  setMainModule('administrasi');
                  setAdminSubView('laporan-piket');
                  setIsMobileSidebarOpen(false);
                }}
                title="Guru Piket & Ketertiban"
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  mainModule === 'administrasi' && (adminSubView === 'laporan-piket' || adminSubView === 'buku-poin-pelanggaran')
                    ? 'bg-rose-600 text-white shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                {!isSidebarCollapsed && (
                  <div className="text-left flex-1 min-w-0">
                    <div className="truncate font-bold">Guru Piket & Disiplin</div>
                    <div className="text-[10px] text-slate-400 truncate">Absen Piket & Kasus Siswa</div>
                  </div>
                )}
              </button>
            </div>
          )
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 2. PENILAIAN & ASESMEN (PERIODIK / SUMATIF / RAPOR)           */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {isGroupVisible('penilaian asesmen nilai kktp rapor sumatif formatif pts pas remedial pengayaan') && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => toggleGroup('asesmen')}
                className="w-full px-2 py-1 text-[10px] font-black uppercase tracking-wider text-purple-400 hover:text-purple-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate">2. PENILAIAN & ASESMEN</span>
                </span>
                <span className="text-[9px] text-slate-500 font-normal">Periodik</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups.asesmen !== false ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-purple-400 uppercase py-1">NIL</div>
            )}

            {(expandedGroups.asesmen !== false || isSidebarCollapsed || query) && (
              <div className="space-y-1 pl-1">
                {/* Daftar Nilai Siswa */}
                <button
                  onClick={() => {
                    setMainModule('rekap');
                    setTab('nilai');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Daftar Nilai (TP, PTS, PAS)"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'rekap' && tab === 'nilai'
                      ? 'bg-purple-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Award className="w-4 h-4 text-purple-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Daftar Nilai (Formatif & Sumatif)</span>}
                </button>

                {/* KKTP & Deskripsi e-Rapor */}
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('asesmen-kktp');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="KKTP & Deskripsi e-Rapor"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'asesmen-kktp'
                      ? 'bg-purple-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <CheckSquare className="w-4 h-4 text-pink-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">KKTP & Deskripsi e-Rapor</span>}
                </button>

                {/* Program Remedial & Pengayaan */}
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('remedial-pengayaan');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Remedial & Pengayaan"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'remedial-pengayaan'
                      ? 'bg-purple-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <RotateCcw className="w-4 h-4 text-amber-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Remedial & Pengayaan</span>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 3. PERANGKAT AJAR (PERENCANAAN / AWAL SEMESTER)               */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {isGroupVisible('perangkat ajar prota prosem atp cp modul ajar rpp lkpd p5 adaptasi') && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => toggleGroup('perangkat')}
                className="w-full px-2 py-1 text-[10px] font-black uppercase tracking-wider text-sky-400 hover:text-sky-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-sky-400" />
                  <span className="truncate">3. PERANGKAT AJAR</span>
                </span>
                <span className="text-[9px] text-slate-500 font-normal">Perencanaan</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups.perangkat !== false ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-sky-400 uppercase py-1">DOC</div>
            )}

            {(expandedGroups.perangkat !== false || isSidebarCollapsed || query) && (
              <div className="space-y-1 pl-1">
                {/* PROTA & PROSEM */}
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('prota-prosem');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="PROTA & PROSEM (Alokasi JP)"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'prota-prosem'
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Calendar className="w-4 h-4 text-sky-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">PROTA & PROSEM</span>}
                </button>

                {/* ATP & CP BSKAP */}
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('atp');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Alur Tujuan Pembelajaran (ATP)"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'atp'
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Layers className="w-4 h-4 text-blue-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Alur Tujuan Pembelajaran (ATP)</span>}
                </button>

                {/* Modul Ajar (RPP Merdeka) */}
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('modul-ajar');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Modul Ajar (RPP)"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'modul-ajar'
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Modul Ajar (RPP)</span>}
                </button>

                {/* LKPD & Kisi-Kisi Soal */}
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('lkpd');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="LKPD & Kisi-Kisi Soal"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && (adminSubView === 'lkpd' || adminSubView === 'asesmen-soal')
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Puzzle className="w-4 h-4 text-teal-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">LKPD & Bank Soal</span>}
                </button>

                {/* Projek P5 */}
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('p5-projek');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Modul & Rapor Projek P5"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'p5-projek'
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Star className="w-4 h-4 text-amber-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Modul Projek P5</span>}
                </button>

                {/* Adaptor Identitas Dokumen */}
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('adaptor-identitas');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Adaptor Identitas (.docx Batch Replacer)"
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'adaptor-identitas'
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <RefreshCw className="w-4 h-4 text-purple-300 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">Adaptor Identitas Docx</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded shadow-xs">
                      HOT
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 4. LAPORAN & SUPERVISI (CETAK PERIODIK / AKHIR SEMESTER)       */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {isGroupVisible('laporan cetak supervisi rekap absensi bulanan leger nilai buku kerja jurnal piket') && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => toggleGroup('laporan')}
                className="w-full px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 hover:text-emerald-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate">4. PUSAT CETAK & LAPORAN</span>
                </span>
                <span className="text-[9px] text-slate-500 font-normal">Supervisi</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups.laporan !== false ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-emerald-400 uppercase py-1">PDF</div>
            )}

            {(expandedGroups.laporan !== false || isSidebarCollapsed || query) && (
              <div className="space-y-1 pl-1">
                {/* Cetak Rekap Presensi Bulanan */}
                <button
                  onClick={() => {
                    setMainModule('rekap');
                    setTab('absensi-bulanan');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Cetak Rekap Presensi Bulanan"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'rekap' && tab === 'absensi-bulanan'
                      ? 'bg-emerald-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Rekap Presensi Bulanan</span>}
                </button>

                {/* Cetak Leger Nilai */}
                <button
                  onClick={() => {
                    setMainModule('rekap');
                    setTab('nilai');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Cetak Leger & Daftar Nilai"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'rekap' && tab === 'nilai'
                      ? 'bg-emerald-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Award className="w-4 h-4 text-amber-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Cetak Leger & Buku Nilai</span>}
                </button>

                {/* Cetak Laporan Piket & BK */}
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('laporan-piket');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Cetak Laporan Piket & BK"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'laporan-piket'
                      ? 'bg-emerald-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Cetak Laporan Piket & BK</span>}
                </button>

                {/* Cetak Kartu Pelajar & Barcode */}
                {onOpenCardGenerator && (
                  <button
                    onClick={() => {
                      onOpenCardGenerator();
                      setIsMobileSidebarOpen(false);
                    }}
                    title="Cetak Kartu Siswa (Barcode & QR)"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all text-slate-300 hover:text-white hover:bg-slate-800/80 ${
                      isSidebarCollapsed ? 'justify-center' : ''
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-sky-400 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">Cetak Kartu Siswa (Barcode)</span>}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* 5. MASTER DATA & PENGATURAN                                    */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {isGroupVisible('master data siswa kelas guru profil sekolah sistem backup cadangan') && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => toggleGroup('master')}
                className="w-full px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">5. MASTER DATA & SISTEM</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups.master !== false ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-slate-400 uppercase py-1">SYS</div>
            )}

            {(expandedGroups.master !== false || isSidebarCollapsed || query) && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => {
                    setMainModule('manajemen');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Siswa, Kelas & Guru"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'manajemen'
                      ? 'bg-slate-700 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Users className="w-4 h-4 text-emerald-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Data Siswa, Kelas & Guru</span>}
                </button>

                {onOpenBackupModal && (
                  <button
                    onClick={() => {
                      onOpenBackupModal();
                      setIsMobileSidebarOpen(false);
                    }}
                    title="Cadangkan & Pulihkan Data"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 transition-all ${
                      isSidebarCollapsed ? 'justify-center' : ''
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">Cadangkan / Pulihkan Data</span>}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── FOOTER PROFILE WITH ACTIVE ROLE DISPLAY ── */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90">
        <div className={`flex items-center justify-between gap-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <button
            type="button"
            onClick={onOpenTeacherSwitcher}
            title="Klik untuk Pilih / Ganti Profil Guru & Mapel"
            className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border group-hover:scale-105 transition-transform ${
              currentRole === 'guru_piket'
                ? 'bg-rose-900/80 text-rose-100 border-rose-600/60'
                : 'bg-blue-800 text-blue-100 border-blue-600/50'
            }`}>
              {teacher.name.charAt(0)}
            </div>
            {!isSidebarCollapsed && (
              <div className="truncate text-xs min-w-0">
                <div className="font-bold text-slate-100 truncate group-hover:text-blue-300 transition-colors flex items-center gap-1">
                  <span>{teacher.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                    currentRole === 'guru_piket' ? 'bg-rose-400 animate-pulse' : 'bg-blue-400'
                  }`} />
                  <span>{currentRole === 'guru_piket' ? 'Guru Piket' : teacher.subject || 'Guru Mapel'}</span>
                  <span className="text-[9px] text-blue-400 underline ml-0.5 font-semibold">(Ganti)</span>
                </div>
              </div>
            )}
          </button>

          {!isSidebarCollapsed && (
            <button
              onClick={() => setCurrentRole(currentRole === 'guru_piket' ? 'subject_teacher' : 'guru_piket')}
              className="text-[10px] text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-md transition-colors"
              title="Ganti Peran (Guru Mapel / Piket)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
