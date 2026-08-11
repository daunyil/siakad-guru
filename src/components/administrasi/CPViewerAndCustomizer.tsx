import React, { useState, useMemo } from 'react';
import type {
  CPSubject,
  CPElement,
  CPTujuanPembelajaran,
  DocumentKopSettings,
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
} from '../../types';
import { initialCpSubjects } from '../../data/cpMasterData';
import { smartPrint, openAppInNewTab } from '../../utils/printHelper';
import {
  Building,
  User,
  Search,
  Plus,
  Trash2,
  Edit2,
  Printer,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  FileText,
  BookOpen,
  Sparkles,
  Layers,
  Calendar,
  X,
  FileCode,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CPViewerAndCustomizerProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  onUpdateSchoolInfo?: (updated: Partial<SchoolProfile>) => void;
  onUpdateTeacherInfo?: (updated: Partial<TeacherProfile>) => void;
}

export const CPViewerAndCustomizer: React.FC<CPViewerAndCustomizerProps> = ({
  school,
  teacher,
  year,
}) => {
  // Master State for CP Subjects
  const [cpSubjects, setCpSubjects] = useState<CPSubject[]>(initialCpSubjects);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialCpSubjects[0]?.id || ''
  );

  // KOP & Document Identity Settings
  const [kopSettings, setKopSettings] = useState<DocumentKopSettings>({
    schoolName: school.name || 'SMP NEGERI 1 BANTAN',
    npsn: school.npsn || '10401234',
    address: school.address || 'Jl. Soekarno-Hatta No. 45, Bantan, Kab. Bengkalis',
    headmasterName: school.headmasterName || 'Drs. H. M. YUSUF, M.Pd.',
    headmasterNip: school.headmasterNip || '19680512 199403 1 004',
    teacherName: teacher.name || 'SITI AMINAH, S.Pd.',
    teacherNip: teacher.nip || '19850410 201001 2 015',
    dateLocation: 'Bantan, 14 Juli 2025',
  });

  const [isEditingKop, setIsEditingKop] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('semua');

  // Modal / Import states
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');
  const [importFileName, setImportFileName] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Active Editing CP State
  const [editingTp, setEditingTp] = useState<{
    elementId: string;
    tpCode: string;
    tp: CPTujuanPembelajaran;
  } | null>(null);

  const [newTpElementId, setNewTpElementId] = useState<string | null>(null);
  const [newTpData, setNewTpData] = useState<CPTujuanPembelajaran>({
    code: 'TP-NEW-01',
    title: '',
    jp: 12,
    classGrade: 'VII',
    rubrikSingkat: '',
  });

  // Current Subject Selection
  const currentSubject = useMemo(() => {
    return (
      cpSubjects.find((s) => s.id === selectedSubjectId) || cpSubjects[0]
    );
  }, [cpSubjects, selectedSubjectId]);

  // Filtered elements & TPs based on search query
  const filteredElements = useMemo(() => {
    if (!currentSubject) return [];

    return currentSubject.elements
      .map((element) => {
        const matchesElement =
          element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          element.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchingTps = element.tpList.filter((tp) => {
          const matchesGrade =
            gradeFilter === 'semua' || tp.classGrade === gradeFilter;
          const matchesSearch =
            tp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tp.rubrikSingkat &&
              tp.rubrikSingkat.toLowerCase().includes(searchQuery.toLowerCase()));

          return matchesGrade && (matchesElement || matchesSearch);
        });

        return {
          ...element,
          tpList: matchingTps,
        };
      })
      .filter(
        (element) =>
          element.tpList.length > 0 ||
          element.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [currentSubject, searchQuery, gradeFilter]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  // Reset to default standard BSKAP
  const handleResetToStandard = () => {
    setCpSubjects(initialCpSubjects);
    showToast('Data CP & ATP berhasil dikembalikan ke Standar Resmi BSKAP 032/H/KR/2024.');
  };

  // Delete TP
  const handleDeleteTp = (elementId: string, tpCode: string) => {
    setCpSubjects((prev) =>
      prev.map((subj) => {
        if (subj.id !== currentSubject.id) return subj;
        return {
          ...subj,
          elements: subj.elements.map((elem) => {
            if (elem.id !== elementId) return elem;
            return {
              ...elem,
              tpList: elem.tpList.filter((tp) => tp.code !== tpCode),
            };
          }),
        };
      })
    );
    showToast(`TP ${tpCode} berhasil dihapus.`);
  };

  // Save Edit TP
  const handleSaveEditTp = () => {
    if (!editingTp) return;
    setCpSubjects((prev) =>
      prev.map((subj) => {
        if (subj.id !== currentSubject.id) return subj;
        return {
          ...subj,
          elements: subj.elements.map((elem) => {
            if (elem.id !== editingTp.elementId) return elem;
            return {
              ...elem,
              tpList: elem.tpList.map((tp) =>
                tp.code === editingTp.tpCode ? editingTp.tp : tp
              ),
            };
          }),
        };
      })
    );
    setEditingTp(null);
    showToast('Tujuan Pembelajaran berhasil diperbarui.');
  };

  // Add New TP
  const handleAddNewTp = (elementId: string) => {
    if (!newTpData.title.trim()) {
      showToast('Judul Tujuan Pembelajaran tidak boleh kosong.');
      return;
    }

    setCpSubjects((prev) =>
      prev.map((subj) => {
        if (subj.id !== currentSubject.id) return subj;
        return {
          ...subj,
          elements: subj.elements.map((elem) => {
            if (elem.id !== elementId) return elem;
            return {
              ...elem,
              tpList: [...elem.tpList, newTpData],
            };
          }),
        };
      })
    );

    setNewTpElementId(null);
    setNewTpData({
      code: `TP-${Math.floor(100 + Math.random() * 900)}`,
      title: '',
      jp: 12,
      classGrade: 'VII',
      rubrikSingkat: '',
    });
    showToast('Tujuan Pembelajaran baru berhasil ditambahkan.');
  };

  // Import Custom JSON / Document CP
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    if (!importText.trim()) {
      showToast('Konten import kosong.');
      return;
    }

    try {
      // If it is JSON format matching CPSubject
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        setCpSubjects(parsed);
        setSelectedSubjectId(parsed[0]?.id || '');
        showToast('Berhasil mengimpor daftar Capaian Pembelajaran dari file!');
      } else if (parsed.subjectName && parsed.elements) {
        setCpSubjects((prev) => [parsed, ...prev]);
        setSelectedSubjectId(parsed.id || 'custom-imported');
        showToast(`Berhasil mengimpor CP ${parsed.subjectName}!`);
      } else {
        throw new Error('Format JSON tidak sesuai struktur CP.');
      }
      setIsImportModalOpen(false);
      setImportText('');
    } catch {
      // Fallback: create custom subject from raw text content
      const newCustomSubject: CPSubject = {
        id: `custom-${Date.now()}`,
        subjectName: importFileName ? importFileName.replace(/\.[^/.]+$/, '') : 'Mata Pelajaran Kustom',
        phase: 'Fase D',
        skNumber: 'Dokumen Kustom/Imported Guru',
        generalDescription: importText.slice(0, 300) + '...',
        elements: [
          {
            id: 'custom-elem-1',
            name: 'Elemen Pembelajaran Kustom',
            description: 'Elemen hasil import dokumen mandiri.',
            tpList: [
              {
                code: 'TP-IMP-01',
                title: 'Tujuan Pembelajaran dari hasil import teks dokumen.',
                jp: 18,
                classGrade: 'VII',
                rubrikSingkat: 'Hasil parsial impor dokumen mandiri.',
              },
            ],
          },
        ],
      };

      setCpSubjects((prev) => [newCustomSubject, ...prev]);
      setSelectedSubjectId(newCustomSubject.id);
      setIsImportModalOpen(false);
      setImportText('');
      showToast('Dokumen CP Kustom berhasil diimpor dan disesuaikan Kop Sekolah!');
    }
  };

  // Export CP data to JSON
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(cpSubjects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `CP_BSKAP_2024_${currentSubject.subjectName.replace(/\s+/g, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File JSON CP berhasil diunduh.');
  };

  const handlePrintDocument = () => {
    smartPrint({
      documentSelector: '.document-page',
      docTitle: `Dokumen CP BSKAP - ${currentSubject.subjectName}`,
      orientation: 'portrait',
    });
  };

  return (
    <div className="space-y-6">
      {/* ── TOAST NOTIFICATION ── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── HEADER BANNER: OFFICIAL BSKAP CP & IDENTITAS DOKUMEN ── */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Resmi BSKAP No. 032/H/KR/2024
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Fase D (SMP / MTs)
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Master Capaian Pembelajaran (CP) & Pengatur Identitas Sekolah
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Dokumen Capaian Pembelajaran resmi pemerintah yang terintegrasi secara otomatis dengan identitas nama sekolah, NIP Kepala Sekolah, dan Guru. Dapat disesuaikan, ditambahkan TP, atau mengimpor file CP dari sekolah Anda sendiri.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <span>{kopSettings.schoolName}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>{kopSettings.teacherName}</span>
              </div>
              <button
                onClick={() => setIsEditingKop(!isEditingKop)}
                className="px-2.5 py-1 bg-blue-600/80 hover:bg-blue-500 text-white rounded-lg border border-blue-400/40 text-[11px] font-bold transition-all flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                <span>{isEditingKop ? 'Sembunyikan Form Kop' : 'Edit Kop Sekolah & Guru'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import Dokumen CP Mandiri</span>
            </button>

            <button
              onClick={handleResetToStandard}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              title="Reset ke Standar BSKAP"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset Standar BSKAP</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── EDIT FORM KOP DOKUMEN & IDENTITAS SEKOLAH (EXPANDABLE) ── */}
      {isEditingKop && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200 no-print">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pengatur Kop Dokumen & Identitas Tanda Tangan
              </h3>
            </div>
            <button
              onClick={() => setIsEditingKop(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Satuan Pendidikan / Sekolah</label>
              <input
                type="text"
                value={kopSettings.schoolName}
                onChange={(e) =>
                  setKopSettings({ ...kopSettings, schoolName: e.target.value })
                }
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NPSN & Alamat Sekolah</label>
              <input
                type="text"
                value={kopSettings.address}
                onChange={(e) =>
                  setKopSettings({ ...kopSettings, address: e.target.value })
                }
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={kopSettings.headmasterName}
                onChange={(e) =>
                  setKopSettings({ ...kopSettings, headmasterName: e.target.value })
                }
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={kopSettings.headmasterNip}
                onChange={(e) =>
                  setKopSettings({ ...kopSettings, headmasterNip: e.target.value })
                }
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Guru Mata Pelajaran</label>
              <input
                type="text"
                value={kopSettings.teacherName}
                onChange={(e) =>
                  setKopSettings({ ...kopSettings, teacherName: e.target.value })
                }
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Guru Mata Pelajaran</label>
              <input
                type="text"
                value={kopSettings.teacherNip}
                onChange={(e) =>
                  setKopSettings({ ...kopSettings, teacherNip: e.target.value })
                }
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kota & Tanggal Penetapan Dokumen</label>
              <input
                type="text"
                value={kopSettings.dateLocation}
                onChange={(e) =>
                  setKopSettings({ ...kopSettings, dateLocation: e.target.value })
                }
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setIsEditingKop(false);
                  showToast('Identitas Kop Dokumen & Tanda Tangan diperbarui.');
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simpan Perubahan Identitas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SELECTOR SUBJECT TABS & FILTERS ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Subject Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {cpSubjects.map((subj) => (
              <button
                key={subj.id}
                onClick={() => setSelectedSubjectId(subj.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedSubjectId === subj.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{subj.subjectName}</span>
                <span className="text-[10px] opacity-80 bg-black/20 px-1.5 py-0.2 rounded-full">
                  {subj.elements.length} Elemen
                </span>
              </button>
            ))}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintDocument}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Filter Inputs */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              <input
                type="text"
                placeholder="Cari elemen atau kata kunci TP (e.g., Aljabar, Pancasila...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Filter Tingkat/Kelas:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="semua">Semua Tingkat (VII, VIII, IX)</option>
              <option value="VII">Kelas VII (SMP)</option>
              <option value="VIII">Kelas VIII (SMP)</option>
              <option value="IX">Kelas IX (SMP)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── OFFICIAL DOCUMENT CANVAS PREVIEW (TIMES NEW ROMAN GOVERNMENT FORMAT) ── */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-lg p-8 md:p-12 space-y-6 document-page text-black font-serif text-xs leading-normal">
        {/* KOP OFFICIAL DOKUMEN DINAS */}
        <div className="text-center border-b-2 border-black pb-4 space-y-1">
          <h1 className="text-sm md:text-base font-bold uppercase tracking-wider">
            CAPAIAN PEMBELAJARAN (CP) & ALUR TUJUAN PEMBELAJARAN (ATP)
          </h1>
          <h2 className="text-xs md:text-sm font-bold uppercase">
            KURIKULUM MERDEKA - FASE D (SMP/MTs)
          </h2>
          <h3 className="text-xs font-bold uppercase">
            {kopSettings.schoolName}
          </h3>
          <p className="text-[11px] font-sans font-normal italic text-slate-600">
            {kopSettings.address} · NPSN: {kopSettings.npsn}
          </p>
        </div>

        {/* METADATA DOKUMEN TABLE */}
        <div className="bg-slate-50/80 p-3 rounded border border-slate-300 font-sans text-[11px] grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <div><strong>MATA PELAJARAN:</strong> {currentSubject.subjectName}</div>
            <div><strong>ACUAN REGULASI:</strong> {currentSubject.skNumber}</div>
            <div><strong>FASE / KELAS:</strong> {currentSubject.phase} (Kelas VII, VIII, IX)</div>
          </div>
          <div>
            <div><strong>GURU MATA PELAJARAN:</strong> {kopSettings.teacherName} (NIP. {kopSettings.teacherNip})</div>
            <div><strong>KEPALA SEKOLAH:</strong> {kopSettings.headmasterName} (NIP. {kopSettings.headmasterNip})</div>
            <div><strong>TAHUN PELAJARAN:</strong> {year.label}</div>
          </div>
        </div>

        {/* RANGKUMAN DESKRIPSI UMUM CP */}
        <div className="space-y-1.5 font-serif">
          <h4 className="font-bold text-xs uppercase underline">
            I. RASIONAL DAN CAPAIAN PEMBELAJARAN UMUM
          </h4>
          <p className="text-justify leading-relaxed">
            {currentSubject.generalDescription}
          </p>
        </div>

        {/* ELEMEN CP & ALUR TUJUAN PEMBELAJARAN (TABLE) */}
        <div className="space-y-3 font-serif">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase underline">
              II. CAPAIAN PEMBELAJARAN PER ELEMEN DAN PEMETAAN TUJUAN PEMBELAJARAN (ATP)
            </h4>
          </div>

          {filteredElements.map((element, elemIndex) => (
            <div
              key={element.id}
              className="border border-black p-4 space-y-3 rounded-none bg-white relative group"
            >
              {/* Header Elemen */}
              <div className="flex items-start justify-between border-b border-black pb-2 gap-2">
                <div>
                  <h5 className="font-bold text-xs uppercase text-slate-900">
                    ELEMEN {elemIndex + 1}: {element.name}
                  </h5>
                  <p className="text-[11px] text-justify mt-1 leading-relaxed">
                    <strong>Capaian Elemen:</strong> {element.description}
                  </p>
                </div>

                <button
                  onClick={() => setNewTpElementId(element.id)}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-sans text-[10px] font-bold shrink-0 no-print flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah TP</span>
                </button>
              </div>

              {/* Table TP Per Elemen */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black font-sans text-[11px]">
                  <thead>
                    <tr className="bg-slate-200 border-b border-black text-center font-bold">
                      <th className="border border-black px-2 py-1.5 w-12">Kode</th>
                      <th className="border border-black px-2 py-1.5 text-left">
                        Tujuan Pembelajaran (TP)
                      </th>
                      <th className="border border-black px-2 py-1.5 w-16">Kelas</th>
                      <th className="border border-black px-2 py-1.5 w-16">Alokasi</th>
                      <th className="border border-black px-2 py-1.5 text-left">
                        Rubrik / Indikator Singkat
                      </th>
                      <th className="border border-black px-2 py-1.5 w-16 no-print">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {element.tpList.map((tp) => (
                      <tr key={tp.code} className="border-b border-black hover:bg-slate-50/80">
                        <td className="border border-black text-center font-bold py-1.5 text-blue-900">
                          {tp.code}
                        </td>
                        <td className="border border-black px-2 py-1.5 leading-snug font-medium">
                          {tp.title}
                        </td>
                        <td className="border border-black text-center font-semibold">
                          {tp.classGrade}
                        </td>
                        <td className="border border-black text-center font-semibold">
                          {tp.jp} JP
                        </td>
                        <td className="border border-black px-2 py-1.5 text-slate-700 italic">
                          {tp.rubrikSingkat || '-'}
                        </td>
                        <td className="border border-black text-center py-1.5 no-print">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() =>
                                setEditingTp({
                                  elementId: element.id,
                                  tpCode: tp.code,
                                  tp: { ...tp },
                                })
                              }
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Edit TP"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTp(element.id, tp.code)}
                              className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                              title="Hapus TP"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Form Input Tambah TP Baru */}
              {newTpElementId === element.id && (
                <div className="bg-blue-50/90 border border-blue-300 p-3 rounded font-sans text-xs space-y-2 no-print">
                  <div className="font-bold text-blue-900 flex items-center justify-between">
                    <span>Tambah Tujuan Pembelajaran Baru untuk Elemen {element.name}</span>
                    <button
                      onClick={() => setNewTpElementId(null)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700">Kode TP</label>
                      <input
                        type="text"
                        value={newTpData.code}
                        onChange={(e) =>
                          setNewTpData({ ...newTpData, code: e.target.value })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700">Kelas/Tingkat</label>
                      <select
                        value={newTpData.classGrade}
                        onChange={(e) =>
                          setNewTpData({
                            ...newTpData,
                            classGrade: e.target.value as 'VII' | 'VIII' | 'IX',
                          })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-bold"
                      >
                        <option value="VII">Kelas VII</option>
                        <option value="VIII">Kelas VIII</option>
                        <option value="IX">Kelas IX</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700">Alokasi JP</label>
                      <input
                        type="number"
                        value={newTpData.jp}
                        onChange={(e) =>
                          setNewTpData({
                            ...newTpData,
                            jp: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-bold"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                      <button
                        onClick={() => handleAddNewTp(element.id)}
                        className="w-full py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs shadow-xs"
                      >
                        Simpan TP
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700">Rumusan Tujuan Pembelajaran (TP)</label>
                    <input
                      type="text"
                      placeholder="e.g. Menganalisis konsep aljabar dalam pemecahan masalah sehari-hari..."
                      value={newTpData.title}
                      onChange={(e) =>
                        setNewTpData({ ...newTpData, title: e.target.value })
                      }
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* LEMBAR TANDA TANGAN KEPALA SEKOLAH & GURU */}
        <div className="pt-8 flex justify-between font-serif text-xs">
          <div className="text-center w-56">
            <div>Mengetahui,</div>
            <div>Kepala {kopSettings.schoolName}</div>
            <div className="h-20" />
            <div className="font-bold underline">{kopSettings.headmasterName}</div>
            <div>NIP. {kopSettings.headmasterNip}</div>
          </div>

          <div className="text-center w-56">
            <div>{kopSettings.dateLocation}</div>
            <div>Guru Mata Pelajaran</div>
            <div className="h-20" />
            <div className="font-bold underline">{kopSettings.teacherName}</div>
            <div>NIP. {kopSettings.teacherNip}</div>
          </div>
        </div>
      </div>

      {/* ── MODAL EDIT TP SPECIFIC ── */}
      {editingTp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Edit Tujuan Pembelajaran ({editingTp.tp.code})
              </h3>
              <button
                onClick={() => setEditingTp(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode TP</label>
                <input
                  type="text"
                  value={editingTp.tp.code}
                  onChange={(e) =>
                    setEditingTp({
                      ...editingTp,
                      tp: { ...editingTp.tp, code: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rumusan Tujuan Pembelajaran</label>
                <textarea
                  rows={3}
                  value={editingTp.tp.title}
                  onChange={(e) =>
                    setEditingTp({
                      ...editingTp,
                      tp: { ...editingTp.tp, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas/Tingkat</label>
                  <select
                    value={editingTp.tp.classGrade}
                    onChange={(e) =>
                      setEditingTp({
                        ...editingTp,
                        tp: {
                          ...editingTp.tp,
                          classGrade: e.target.value as 'VII' | 'VIII' | 'IX',
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alokasi JP</label>
                  <input
                    type="number"
                    value={editingTp.tp.jp}
                    onChange={(e) =>
                      setEditingTp({
                        ...editingTp,
                        tp: {
                          ...editingTp.tp,
                          jp: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Indikator / Rubrik Penilaian Singkat</label>
                <input
                  type="text"
                  value={editingTp.tp.rubrikSingkat || ''}
                  onChange={(e) =>
                    setEditingTp({
                      ...editingTp,
                      tp: { ...editingTp.tp, rubrikSingkat: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setEditingTp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEditTp}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL IMPORT DOKUMEN MANDIRI ── */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-2xl w-full space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Import Dokumen / CP Mandiri (Word / JSON / Teks)
                </h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Punya dokumen CP atau Modul Ajar dari sekolah sendiri? Upload file JSON/Teks atau tempelkan rumusan CP di bawah ini untuk ditampilkan dengan Kop Sekolah otomatis.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih File Dokumen (JSON, TXT, DOCX)
                </label>
                <input
                  type="file"
                  accept=".json,.txt,.doc,.docx"
                  onChange={handleImportFile}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Atau Tempelkan Teks Dokumen / JSON Struktur CP
                </label>
                <textarea
                  rows={6}
                  placeholder="Tempelkan isi teks CP atau format JSON di sini..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleApplyImport}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Proses Import Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
