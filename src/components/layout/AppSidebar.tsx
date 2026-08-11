import React from 'react';
import type { MainModule, RekapTab, TeacherProfile, SchoolProfile } from '../../types';
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
  FileSpreadsheet,
  CheckSquare,
  Star,
  ChevronDown,
  AlertTriangle,
  LayoutDashboard,
  MapPin,
  RotateCcw,
  BookMarked,
  Building2,
  ListOrdered,
  FileBadge,
  Puzzle,
  RefreshCw,
  Folder,
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
}) => {
  const query = sidebarSearch.toLowerCase().trim();

  // Helper check if group should show up during search
  const isGroupVisible = (keywords: string) => {
    if (!query) return true;
    return keywords.toLowerCase().includes(query);
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
      {/* Sidebar Header */}
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

      {/* Quick Search */}
      {!isSidebarCollapsed && (
        <div className="p-2.5 border-b border-slate-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Cari menu / dokumen..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-2.5 py-1.5 focus:outline-hidden focus:border-blue-500"
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

      {/* Menu Navigation Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 text-xs">

        {/* ── 📊 DASHBOARD UTAMA ── */}
        {isGroupVisible('dashboard utama ringkasan analytics kbm overview') && (
          <div className="space-y-1">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => setExpandedGroups(prev => ({ ...prev, dashboard: !prev.dashboard }))}
                className="w-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
                  <span>📊 DASHBOARD UTAMA</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups.dashboard !== false ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-sky-400 uppercase py-1">DASH</div>
            )}

            {(expandedGroups.dashboard !== false || isSidebarCollapsed || query) && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => {
                    setMainModule('dashboard');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Ringkasan & Analytics KBM"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <BarChart3 className="w-4 h-4 text-sky-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">Ringkasan & Analytics KBM</span>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 1. 📝 KBM & EVALUASI HARIAN (Rutinitas Eksekusi Kelas) ── */}
        {isGroupVisible('1 kbm evaluasi harian absensi tatap muka presensi bulanan jurnal agenda mengajar daftar nilai siswa kktp deskripsi rapor remedial pengayaan') && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => setExpandedGroups(prev => ({ ...prev, kbm: !prev.kbm }))}
                className="w-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate">1. 📝 KBM & EVALUASI HARIAN</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups.kbm !== false ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-blue-400 uppercase py-1">KBM</div>
            )}

            {(expandedGroups.kbm !== false || isSidebarCollapsed || query) && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => {
                    setMainModule('rekap');
                    setTab('tatap-muka');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Absensi Tatap Muka"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'rekap' && tab === 'tatap-muka'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">📌 Absensi Tatap Muka</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('rekap');
                    setTab('absensi-bulanan');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Presensi Bulanan"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'rekap' && tab === 'absensi-bulanan'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Calendar className="w-4 h-4 text-sky-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">📅 Presensi Bulanan</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('rekap');
                    setTab('jurnal');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Jurnal Agenda Mengajar"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'rekap' && tab === 'jurnal'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <FileText className="w-4 h-4 text-purple-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">📖 Jurnal Agenda Mengajar</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('rekap');
                    setTab('nilai');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Daftar Nilai Siswa"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'rekap' && tab === 'nilai'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Award className="w-4 h-4 text-amber-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">💯 Daftar Nilai Siswa</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('asesmen-kktp');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="KKTP & Deskripsi Rapor"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'asesmen-kktp'
                      ? 'bg-purple-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <CheckSquare className="w-4 h-4 text-pink-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">🎯 KKTP & Deskripsi Rapor</span>}
                </button>

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
                  {!isSidebarCollapsed && <span className="truncate">🔄 Remedial & Pengayaan</span>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 2. 🗺️ PERENCANAAN KURIKULUM (Dokumen Makro) ── */}
        {isGroupVisible('2 perencanaan kurikulum dokumen makro master cp bskap atp generator prota prosem') && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => setExpandedGroups(prev => ({ ...prev, kurikulum: !prev.kurikulum }))}
                className="w-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">2. 🗺️ PERENCANAAN KURIKULUM</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups.kurikulum !== false ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-amber-400 uppercase py-1">KUR</div>
            )}

            {(expandedGroups.kurikulum !== false || isSidebarCollapsed || query) && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('cp-bskap');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Master CP BSKAP"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'cp-bskap'
                      ? 'bg-amber-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <FileBadge className="w-4 h-4 text-amber-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">📜 Master CP BSKAP</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('atp');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="ATP Generator"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'atp'
                      ? 'bg-amber-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Layers className="w-4 h-4 text-blue-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">🛣️ ATP Generator</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('prota-prosem');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="PROTA & PROSEM"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'prota-prosem'
                      ? 'bg-amber-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Calendar className="w-4 h-4 text-indigo-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">🗓️ PROTA & PROSEM</span>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 3. 📄 PERANGKAT AJAR & ASESMEN (Bahan Ajar KBM) ── */}
        {isGroupVisible('3 perangkat ajar asesmen bahan ajar kbm modul ajar rpp lkpd siswa 3-tier kisi-kisi soal modul rapor p5') && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => setExpandedGroups(prev => ({ ...prev, perangkat: !prev.perangkat }))}
                className="w-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate">3. 📄 PERANGKAT AJAR & ASESMEN</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups.perangkat !== false ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-emerald-400 uppercase py-1">AJAR</div>
            )}

            {(expandedGroups.perangkat !== false || isSidebarCollapsed || query) && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('modul-ajar');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Modul Ajar (RPP)"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'modul-ajar'
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">📑 Modul Ajar (RPP)</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('lkpd');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="LKPD Siswa (3-Tier)"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'lkpd'
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Puzzle className="w-4 h-4 text-teal-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">🧩 LKPD Siswa (3-Tier)</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('asesmen-soal');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Kisi-Kisi & Soal"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'asesmen-soal'
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <CheckSquare className="w-4 h-4 text-purple-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">🎯 Kisi-Kisi & Soal</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('p5-projek');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Modul & Rapor P5"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'p5-projek'
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Star className="w-4 h-4 text-amber-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">🇮🇩 Modul & Rapor P5</span>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 4. ⚡ CHEAT TOOLS & ADAPTOR (Shortcut Produktivitas) ── */}
        {isGroupVisible('4 cheat tools adaptor shortcut produktivitas adaptor identitas docx batch replacer hot kalkulator rme jam rme katalog dokumen') && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => setExpandedGroups(prev => ({ ...prev, cheat: !prev.cheat }))}
                className="w-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate">4. ⚡ CHEAT TOOLS & ADAPTOR</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups.cheat !== false ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-purple-400 uppercase py-1">FAST</div>
            )}

            {(expandedGroups.cheat !== false || isSidebarCollapsed || query) && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('adaptor-identitas');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Adaptor Identitas (.docx Batch Replacer)"
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'adaptor-identitas'
                      ? 'bg-purple-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <RefreshCw className="w-4 h-4 text-purple-300 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">Adaptor Identitas</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded shadow-xs">
                      HOT
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('rme-kalkulator');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Kalkulator RME & Jam"
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'rme-kalkulator'
                      ? 'bg-purple-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Calculator className="w-4 h-4 text-blue-300 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">Kalkulator RME & Jam</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[9px] bg-blue-400 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      RME
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('katalog');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Katalog Semua Dokumen Administrasi"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'katalog'
                      ? 'bg-purple-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Folder className="w-4 h-4 text-amber-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">📁 Katalog Dokumen</span>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 5. 🛡️ TUGAS TAMBAHAN & KEDISIPLINAN (Operasional Sekolah) ── */}
        {isGroupVisible('5 tugas tambahan kedisiplinan operasional sekolah laporan piket buku poin pelanggaran') && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => setExpandedGroups(prev => ({ ...prev, tugas: !prev.tugas }))}
                className="w-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span className="truncate">5. 🛡️ TUGAS TAMBAHAN</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups.tugas !== false ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-full text-center text-[9px] font-bold text-red-400 uppercase py-1">TGS</div>
            )}

            {(expandedGroups.tugas !== false || isSidebarCollapsed || query) && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('laporan-piket');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Laporan Piket"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'laporan-piket'
                      ? 'bg-red-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">📋 Laporan Piket</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('administrasi');
                    setAdminSubView('buku-poin-pelanggaran');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Buku Poin Pelanggaran"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'administrasi' && adminSubView === 'buku-poin-pelanggaran'
                      ? 'bg-red-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <BookMarked className="w-4 h-4 text-amber-400 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">📕 Buku Poin Pelanggaran</span>}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 6. ⚙️ MASTER DATA & PENGATURAN (Basis Data & Sistem) ── */}
        {isGroupVisible('6 master data pengaturan basis data sistem siswa kelas guru profil sekolah sistem') && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <button
                onClick={() => setExpandedGroups(prev => ({ ...prev, master: !prev.master }))}
                className="w-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">6. ⚙️ MASTER DATA & PENGATURAN</span>
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
                  {!isSidebarCollapsed && <span className="truncate">👥 Siswa, Kelas & Guru</span>}
                </button>

                <button
                  onClick={() => {
                    setMainModule('manajemen');
                    setIsMobileSidebarOpen(false);
                  }}
                  title="Profil Sekolah & Sistem"
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    mainModule === 'manajemen'
                      ? 'bg-slate-700 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Building2 className="w-4 h-4 text-blue-300 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">🏫 Profil Sekolah & Sistem</span>}
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer Profile inside Sidebar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/70">
        <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-blue-800 text-blue-100 border border-blue-600/50 flex items-center justify-center font-bold text-xs shrink-0">
            {teacher.name.charAt(0)}
          </div>
          {!isSidebarCollapsed && (
            <div className="truncate text-xs">
              <div className="font-bold text-slate-100 truncate">{teacher.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{school.name}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

