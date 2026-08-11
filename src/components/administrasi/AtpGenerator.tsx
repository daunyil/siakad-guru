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
import { smartPrint } from '../../utils/printHelper';
import {
  BookOpen,
  Building,
  User,
  Search,
  Plus,
  Trash2,
  Edit2,
  Printer,
  Download,
  RotateCcw,
  CheckCircle2,
  FileText,
  Sparkles,
  Layers,
  Calendar,
  X,
  Settings,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  ListOrdered,
  HelpCircle,
  Award,
  BookCheck,
} from 'lucide-react';

interface AtpGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
}

const P5_DIMENSION_OPTIONS = [
  'Beriman, Bertakwa kepada Tuhan YME, & Berakhlak Mulia',
  'Berkebinekaan Global',
  'Gotong Royong',
  'Mandiri',
  'Bernalar Kritis',
  'Kreatif',
];

export const AtpGenerator: React.FC<AtpGeneratorProps> = ({
  school,
  teacher,
  year,
}) => {
  // State for Subjects and CP Data
  const [cpSubjects, setCpSubjects] = useState<CPSubject[]>(initialCpSubjects);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialCpSubjects[0]?.id || ''
  );

  // Filters
  const [selectedGrade, setSelectedGrade] = useState<'semua' | 'VII' | 'VIII' | 'IX'>('VII');
  const [selectedSemester, setSelectedSemester] = useState<'semua' | '1' | '2'>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Kop Document Settings
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
  const [notification, setNotification] = useState<string | null>(null);

  // Editing / Adding TP Modal State
  const [editingTp, setEditingTp] = useState<{
    elementId: string;
    tpCode: string;
    tp: CPTujuanPembelajaran;
  } | null>(null);

  const [isAddingTpModal, setIsAddingTpModal] = useState<boolean>(false);
  const [selectedElementForNewTp, setSelectedElementForNewTp] = useState<string>('');
  const [newTpData, setNewTpData] = useState<CPTujuanPembelajaran>({
    code: 'TP-ATP-01',
    title: '',
    jp: 12,
    jpIntra: 8,
    jpKo: 4,
    classGrade: 'VII',
    semester: 1,
    rubrikSingkat: '',
    keywords: '',
    p5Dimensions: ['Gotong Royong', 'Bernalar Kritis'],
    glosarium: '',
    asesmenFormatif: 'Observasi diskusi kelompok, Kuis singkat harian',
    asesmenSumatif: 'Tes tertulis Pilihan Ganda & Uraian, Penilaian Produk',
  });

  // Current Subject Selection
  const currentSubject = useMemo(() => {
    return cpSubjects.find((s) => s.id === selectedSubjectId) || cpSubjects[0];
  }, [cpSubjects, selectedSubjectId]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Flattened & Ordered list of TPs for ATP view
  const atpItems = useMemo(() => {
    if (!currentSubject) return [];

    const items: Array<{
      elementId: string;
      elementName: string;
      elementDesc: string;
      tp: CPTujuanPembelajaran;
      originalIndex: number;
    }> = [];

    currentSubject.elements.forEach((element) => {
      element.tpList.forEach((tp, idx) => {
        // Grade filter
        if (selectedGrade !== 'semua' && tp.classGrade !== selectedGrade) return;
        // Semester filter
        if (selectedSemester !== 'semua' && tp.semester?.toString() !== selectedSemester) return;
        // Search query
        if (
          searchQuery.trim() !== '' &&
          !tp.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !tp.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !element.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(tp.keywords && tp.keywords.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          return;
        }

        items.push({
          elementId: element.id,
          elementName: element.name,
          elementDesc: element.description,
          tp: {
            ...tp,
            jpIntra: tp.jpIntra ?? Math.round(tp.jp * 0.75),
            jpKo: tp.jpKo ?? Math.max(0, tp.jp - Math.round(tp.jp * 0.75)),
            keywords: tp.keywords || extractKeywords(tp.title),
            p5Dimensions: tp.p5Dimensions && tp.p5Dimensions.length > 0
              ? tp.p5Dimensions
              : getDefaultP5(element.name),
            glosarium: tp.glosarium || `Istilah kunci: ${extractKeywords(tp.title)}. Prasyarat: Pemahaman konsep dasar.`,
            asesmenFormatif: tp.asesmenFormatif || 'Observasi unjuk kerja, Kuis proses, Diskusi kelompok',
            asesmenSumatif: tp.asesmenSumatif || 'Tes Tertulis akhir lingkup materi, Penilaian Kinerja/Produk',
          },
          originalIndex: idx,
        });
      });
    });

    // Sort by classGrade then semester then sequenceOrder or original index
    return items.sort((a, b) => {
      const gradeOrder = { VII: 1, VIII: 2, IX: 3 };
      const gA = gradeOrder[a.tp.classGrade] || 1;
      const gB = gradeOrder[b.tp.classGrade] || 1;
      if (gA !== gB) return gA - gB;

      const semA = a.tp.semester || 1;
      const semB = b.tp.semester || 1;
      if (semA !== semB) return semA - semB;

      const seqA = a.tp.sequenceOrder ?? a.originalIndex;
      const seqB = b.tp.sequenceOrder ?? b.originalIndex;
      return seqA - seqB;
    });
  }, [currentSubject, selectedGrade, selectedSemester, searchQuery]);

  // Total JP Summary
  const totalJpIntra = atpItems.reduce((acc, curr) => acc + (curr.tp.jpIntra || 0), 0);
  const totalJpKo = atpItems.reduce((acc, curr) => acc + (curr.tp.jpKo || 0), 0);
  const totalJpAll = totalJpIntra + totalJpKo;

  // Helper keyword extractor
  function extractKeywords(title: string): string {
    const words = title
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .filter((w) => w.length > 4 && !['menganalisis', 'memahami', 'mengidentifikasi', 'menerapkan', 'menyajikan', 'peserta', 'didik'].includes(w.toLowerCase()));
    return words.slice(0, 4).join(', ') || 'Konsep Dasar, Penerapan Nilai';
  }

  function getDefaultP5(elementName: string): string[] {
    if (elementName.toLowerCase().includes('pancasila') || elementName.toLowerCase().includes('agama')) {
      return ['Beriman, Bertakwa kepada Tuhan YME, & Berakhlak Mulia', 'Gotong Royong'];
    }
    if (elementName.toLowerCase().includes('uud') || elementName.toLowerCase().includes('nkri')) {
      return ['Berkebinekaan Global', 'Bernalar Kritis'];
    }
    return ['Bernalar Kritis', 'Mandiri', 'Kreatif'];
  }

  // Handle Auto-Fill ATP Metadata with AI / Smart Rules
  const handleAutoFillAtpMetadata = () => {
    setCpSubjects((prev) =>
      prev.map((subj) => {
        if (subj.id !== currentSubject.id) return subj;
        return {
          ...subj,
          elements: subj.elements.map((elem) => ({
            ...elem,
            tpList: elem.tpList.map((tp, idx) => {
              const intra = tp.jpIntra ?? Math.round(tp.jp * 0.75);
              const ko = tp.jpKo ?? Math.max(0, tp.jp - intra);
              const kw = tp.keywords || extractKeywords(tp.title);
              const p5 = tp.p5Dimensions && tp.p5Dimensions.length > 0 ? tp.p5Dimensions : getDefaultP5(elem.name);
              const glo = tp.glosarium || `Materi: ${kw}. Prasyarat: Pemahaman awal konsep dasar ${elem.name}.`;
              const form = tp.asesmenFormatif || 'Observasi partisipasi, Kuis harian, Lembar refleksi diri';
              const sum = tp.asesmenSumatif || 'Tes tertulis (PG/Uraian), Penilaian Produk/Aksi Nyata';

              return {
                ...tp,
                jpIntra: intra,
                jpKo: ko,
                keywords: kw,
                p5Dimensions: p5,
                glosarium: glo,
                asesmenFormatif: form,
                asesmenSumatif: sum,
                sequenceOrder: tp.sequenceOrder ?? idx + 1,
              };
            }),
          })),
        };
      })
    );
    showToast('✨ Berhasil melengkapi ATP dengan Kata Kunci, Dimensi P5, Glosarium, & Asesmen otomatis!');
  };

  // Reorder Move Up / Down
  const handleMoveTp = (elementId: string, tpCode: string, direction: 'up' | 'down') => {
    setCpSubjects((prev) =>
      prev.map((subj) => {
        if (subj.id !== currentSubject.id) return subj;
        return {
          ...subj,
          elements: subj.elements.map((elem) => {
            if (elem.id !== elementId) return elem;
            const index = elem.tpList.findIndex((t) => t.code === tpCode);
            if (index === -1) return elem;
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= elem.tpList.length) return elem;

            const newTpList = [...elem.tpList];
            const [moved] = newTpList.splice(index, 1);
            newTpList.splice(targetIndex, 0, moved);

            return {
              ...elem,
              tpList: newTpList.map((t, idx) => ({ ...t, sequenceOrder: idx + 1 })),
            };
          }),
        };
      })
    );
    showToast(`Urutan sekuensial TP ${tpCode} diperbarui.`);
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
                tp.code === editingTp.tpCode
                  ? {
                      ...editingTp.tp,
                      jp: (editingTp.tp.jpIntra || 0) + (editingTp.tp.jpKo || 0),
                    }
                  : tp
              ),
            };
          }),
        };
      })
    );

    setEditingTp(null);
    showToast('Tujuan Pembelajaran ATP berhasil diperbarui.');
  };

  // Delete TP
  const handleDeleteTp = (elementId: string, tpCode: string) => {
    if (!confirm(`Hapus TP ${tpCode} dari Alur Tujuan Pembelajaran?`)) return;

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
    showToast(`TP ${tpCode} berhasil dihapus dari ATP.`);
  };

  // Add New TP
  const handleAddNewTp = () => {
    if (!newTpData.title.trim()) {
      showToast('Judul Tujuan Pembelajaran tidak boleh kosong.');
      return;
    }

    const targetElementId = selectedElementForNewTp || currentSubject.elements[0]?.id;
    if (!targetElementId) return;

    setCpSubjects((prev) =>
      prev.map((subj) => {
        if (subj.id !== currentSubject.id) return subj;
        return {
          ...subj,
          elements: subj.elements.map((elem) => {
            if (elem.id !== targetElementId) return elem;
            return {
              ...elem,
              tpList: [
                ...elem.tpList,
                {
                  ...newTpData,
                  jp: (newTpData.jpIntra || 8) + (newTpData.jpKo || 4),
                  sequenceOrder: elem.tpList.length + 1,
                },
              ],
            };
          }),
        };
      })
    );

    setIsAddingTpModal(false);
    setNewTpData({
      code: `TP-ATP-${Math.floor(100 + Math.random() * 900)}`,
      title: '',
      jp: 12,
      jpIntra: 8,
      jpKo: 4,
      classGrade: 'VII',
      semester: 1,
      rubrikSingkat: '',
      keywords: '',
      p5Dimensions: ['Gotong Royong', 'Bernalar Kritis'],
      glosarium: '',
      asesmenFormatif: 'Observasi unjuk kerja, Kuis singkat',
      asesmenSumatif: 'Tes tertulis, Penilaian produk',
    });
    showToast('Tujuan Pembelajaran baru berhasil ditambahkan ke ATP.');
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(cpSubjects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `ATP_FaseD_${currentSubject.subjectName.replace(/\s+/g, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File JSON ATP berhasil diunduh.');
  };

  const handlePrint = () => {
    smartPrint({
      documentSelector: '.document-page',
      docTitle: `Alur Tujuan Pembelajaran (ATP) - ${currentSubject.subjectName}`,
      orientation: 'landscape',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── TOAST NOTIFICATION ── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce no-print">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── HEADER BANNER: TAHAP 1 ATP ── */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden no-print">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-blue-400" />
                Tahap 1: Kurikulum Merdeka BSKAP
              </span>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Fase D (SMP/MTs)
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Alur Tujuan Pembelajaran (ATP) & Pemetaan Sekuensial
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Menyusun urutan sekuensial Tujuan Pembelajaran (TP) dari awal hingga akhir Fase D (Kelas VII, VIII, IX). Dilengkapi alokasi JP Intrakurikuler & Kokurikuler (P5), Kata Kunci, Dimensi Profil Pelajar Pancasila, Glosarium/Asesmen Awal, serta Rencana Asesmen Formatif & Sumatif.
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
                <span>{isEditingKop ? 'Sembunyikan Form Kop' : 'Edit Kop Sekolah & NIP'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={handleAutoFillAtpMetadata}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Auto-Lengkapi AI (P5 & Asesmen)</span>
            </button>

            <button
              onClick={() => {
                setSelectedElementForNewTp(currentSubject.elements[0]?.id || '');
                setIsAddingTpModal(true);
              }}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah TP Baru</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF ATP</span>
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
                Pengatur Kop Dokumen ATP & Identitas Tanda Tangan
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
              <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan:</label>
              <input
                type="text"
                value={kopSettings.schoolName}
                onChange={(e) => setKopSettings({ ...kopSettings, schoolName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPSN Sekolah:</label>
              <input
                type="text"
                value={kopSettings.npsn}
                onChange={(e) => setKopSettings({ ...kopSettings, npsn: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah:</label>
              <input
                type="text"
                value={kopSettings.headmasterName}
                onChange={(e) => setKopSettings({ ...kopSettings, headmasterName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah:</label>
              <input
                type="text"
                value={kopSettings.headmasterNip}
                onChange={(e) => setKopSettings({ ...kopSettings, headmasterNip: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Guru Mata Pelajaran:</label>
              <input
                type="text"
                value={kopSettings.teacherName}
                onChange={(e) => setKopSettings({ ...kopSettings, teacherName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Guru Mata Pelajaran:</label>
              <input
                type="text"
                value={kopSettings.teacherNip}
                onChange={(e) => setKopSettings({ ...kopSettings, teacherNip: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tempat & Tanggal Penetapan:</label>
              <input
                type="text"
                value={kopSettings.dateLocation}
                onChange={(e) => setKopSettings({ ...kopSettings, dateLocation: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Sekolah:</label>
              <input
                type="text"
                value={kopSettings.address}
                onChange={(e) => setKopSettings({ ...kopSettings, address: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SUBJECT & FILTER CONTROL BAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Subject Selector */}
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mata Pelajaran:</span>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
              >
                {cpSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subjectName} ({s.phase})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grade & Semester Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="px-2 font-bold text-slate-500 text-[10px] uppercase">Kelas:</span>
              {(['semua', 'VII', 'VIII', 'IX'] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedGrade === grade
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {grade === 'semua' ? 'Semua Kelas' : `Kelas ${grade}`}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="px-2 font-bold text-slate-500 text-[10px] uppercase">Semester:</span>
              {(['semua', '1', '2'] as const).map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedSemester === sem
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sem === 'semua' ? 'Semua' : sem === '1' ? 'Sem. Ganjil' : 'Sem. Genap'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Tujuan Pembelajaran, Elemen, Kata Kunci, atau Kode TP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* ── METRIC STATS CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 no-print">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
            {atpItems.length}
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Total TP ATP</span>
            <span className="text-xs font-black text-slate-900">{atpItems.length} Tujuan Pembelajaran</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
            {totalJpIntra}
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Alokasi Intra</span>
            <span className="text-xs font-black text-emerald-900">{totalJpIntra} JP Pembelajaran</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
            {totalJpKo}
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Alokasi Kokurikuler</span>
            <span className="text-xs font-black text-amber-900">{totalJpKo} JP Projek (P5)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-blue-200 bg-blue-50/30 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {totalJpAll}
          </div>
          <div>
            <span className="text-[10px] text-blue-700 uppercase font-bold tracking-wider block">Total JP Keseluruhan</span>
            <span className="text-xs font-black text-blue-950">{totalJpAll} JP (Intra + P5)</span>
          </div>
        </div>
      </div>

      {/* ── PRINTABLE ATP DOCUMENT WRAPPER ── */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6">
        
        {/* Printable Formal Header */}
        <div className="space-y-4 font-serif text-slate-900 border-b-2 border-black pb-4 text-center">
          <div className="uppercase font-bold text-base md:text-lg leading-tight">
            ALUR TUJUAN PEMBELAJARAN (ATP) KURIKULUM MERDEKA
          </div>
          <div className="uppercase font-bold text-sm md:text-base text-blue-950">
            MATA PELAJARAN {currentSubject.subjectName.toUpperCase()} — {currentSubject.phase.toUpperCase()}
          </div>
          <div className="text-xs font-sans text-slate-700 space-y-0.5 pt-1">
            <p><strong>SATUAN PENDIDIKAN:</strong> {kopSettings.schoolName} (NPSN: {kopSettings.npsn})</p>
            <p><strong>TAHUN PELAJARAN:</strong> {year.label} | <strong>SK CP:</strong> {currentSubject.skNumber}</p>
          </div>
        </div>

        {/* General Description CP */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1 font-sans">
          <span className="font-bold text-blue-950 block uppercase text-[11px]">
            Capaian Pembelajaran (CP) Umum Fase D:
          </span>
          <p className="leading-relaxed italic text-slate-700">
            "{currentSubject.generalDescription}"
          </p>
        </div>

        {/* ── MATRIKS ATURAN ATP TABLE ── */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-[11px] font-sans">
            <thead>
              <tr className="bg-slate-200 border-b border-black text-center font-bold">
                <th className="border border-black px-1 py-2 w-8" rowSpan={2}>No</th>
                <th className="border border-black px-2 py-2 text-left w-36" rowSpan={2}>
                  Elemen CP
                </th>
                <th className="border border-black px-2 py-2 text-left min-w-[220px]" rowSpan={2}>
                  Tujuan Pembelajaran (TP)
                </th>
                <th className="border border-black px-1 py-2 w-14" rowSpan={2}>
                  Kelas / Sem
                </th>
                <th className="border border-black px-1 py-1 text-center" colSpan={3}>
                  Alokasi Waktu (JP)
                </th>
                <th className="border border-black px-2 py-2 text-left w-28" rowSpan={2}>
                  Kata / Frasa Kunci
                </th>
                <th className="border border-black px-2 py-2 text-left w-36" rowSpan={2}>
                  Profil Pelajar Pancasila (P5)
                </th>
                <th className="border border-black px-2 py-2 text-left w-32" rowSpan={2}>
                  Glosarium & Prasyarat
                </th>
                <th className="border border-black px-2 py-2 text-left w-36" rowSpan={2}>
                  Rencana Asesmen
                </th>
                <th className="border border-black px-1 py-2 w-20 no-print" rowSpan={2}>
                  Aksi
                </th>
              </tr>
              <tr className="bg-slate-100 border-b border-black text-center font-bold text-[10px]">
                <th className="border border-black px-1 py-1 w-10 text-blue-900 bg-blue-50/80">Intra</th>
                <th className="border border-black px-1 py-1 w-10 text-amber-900 bg-amber-50/80">Ko (P5)</th>
                <th className="border border-black px-1 py-1 w-10 font-black">Total</th>
              </tr>
            </thead>
            <tbody>
              {atpItems.length === 0 ? (
                <tr>
                  <td colSpan={12} className="border border-black p-6 text-center text-slate-500 italic">
                    Tidak ada Tujuan Pembelajaran yang cocok dengan filter kriteria pencarian.
                  </td>
                </tr>
              ) : (
                atpItems.map((item, idx) => (
                  <tr key={`${item.elementId}-${item.tp.code}`} className="hover:bg-slate-50/80 transition-colors">
                    {/* No Sekuensial */}
                    <td className="border border-black text-center font-bold text-slate-800 py-2">
                      {idx + 1}
                    </td>

                    {/* Elemen CP */}
                    <td className="border border-black px-2 py-2 font-semibold text-slate-900 align-top">
                      <div className="font-bold text-blue-950">{item.elementName}</div>
                      <div className="text-[9.5px] text-slate-500 leading-tight mt-0.5 line-clamp-2" title={item.elementDesc}>
                        {item.elementDesc}
                      </div>
                    </td>

                    {/* TP Title & Code */}
                    <td className="border border-black px-2 py-2 align-top">
                      <div className="font-bold text-blue-900 text-[10.5px]">
                        [{item.tp.code}]
                      </div>
                      <div className="text-slate-900 leading-relaxed font-medium mt-0.5">
                        {item.tp.title}
                      </div>
                      {item.tp.rubrikSingkat && (
                        <div className="text-[9.5px] text-slate-600 italic bg-amber-50/50 p-1 rounded border border-amber-200/50 mt-1">
                          💡 Indicators: {item.tp.rubrikSingkat}
                        </div>
                      )}
                    </td>

                    {/* Grade & Semester */}
                    <td className="border border-black text-center font-bold align-top py-2">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800">
                        {item.tp.classGrade}
                      </span>
                      <div className="text-[9.5px] text-slate-600 font-normal mt-0.5">
                        Sem {item.tp.semester || 1}
                      </div>
                    </td>

                    {/* JP Intra */}
                    <td className="border border-black text-center font-bold text-blue-900 bg-blue-50/20 align-top py-2">
                      {item.tp.jpIntra}
                    </td>

                    {/* JP Ko */}
                    <td className="border border-black text-center font-bold text-amber-900 bg-amber-50/20 align-top py-2">
                      {item.tp.jpKo}
                    </td>

                    {/* JP Total */}
                    <td className="border border-black text-center font-black bg-slate-50 align-top py-2">
                      {item.tp.jp}
                    </td>

                    {/* Kata / Frasa Kunci */}
                    <td className="border border-black px-2 py-2 align-top text-[10px] text-slate-800">
                      {item.tp.keywords}
                    </td>

                    {/* Dimensi Profil Pelajar Pancasila */}
                    <td className="border border-black px-2 py-2 align-top">
                      <div className="flex flex-wrap gap-1">
                        {item.tp.p5Dimensions?.map((dim, dIdx) => (
                          <span
                            key={dIdx}
                            className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[9px] font-bold leading-tight"
                          >
                            {dim}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Glosarium & Prasyarat */}
                    <td className="border border-black px-2 py-2 align-top text-[10px] text-slate-700 leading-tight">
                      {item.tp.glosarium}
                    </td>

                    {/* Rencana Asesmen */}
                    <td className="border border-black px-2 py-2 align-top text-[9.5px] space-y-1">
                      <div>
                        <span className="font-bold text-blue-900 block">Formatif:</span>
                        <span className="text-slate-700">{item.tp.asesmenFormatif}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-0.5">
                        <span className="font-bold text-emerald-900 block">Sumatif:</span>
                        <span className="text-slate-700">{item.tp.asesmenSumatif}</span>
                      </div>
                    </td>

                    {/* Action Column */}
                    <td className="border border-black px-1 py-2 text-center align-top no-print space-y-1">
                      <div className="flex items-center justify-center gap-0.5">
                        <button
                          onClick={() => handleMoveTp(item.elementId, item.tp.code, 'up')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 hover:text-blue-600"
                          title="Naikkan Urutan Sekuensial"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveTp(item.elementId, item.tp.code, 'down')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 hover:text-blue-600"
                          title="Turunkan Urutan Sekuensial"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() =>
                            setEditingTp({
                              elementId: item.elementId,
                              tpCode: item.tp.code,
                              tp: { ...item.tp },
                            })
                          }
                          className="p-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded border border-amber-300"
                          title="Edit Atribut ATP"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteTp(item.elementId, item.tp.code)}
                          className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded border border-rose-300"
                          title="Hapus TP"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-200 font-bold border-t-2 border-black text-center text-[10.5px]">
                <td colSpan={4} className="border border-black px-2 py-2 text-right uppercase font-extrabold">
                  JUMLAH TOTAL ALOKASI WAKTU PHASE D / SEMESTER
                </td>
                <td className="border border-black text-blue-950 font-bold">{totalJpIntra} JP</td>
                <td className="border border-black text-amber-950 font-bold">{totalJpKo} JP</td>
                <td className="border border-black text-black font-black text-xs">{totalJpAll} JP</td>
                <td colSpan={4} className="border border-black px-2 py-2 text-left text-slate-600 font-normal italic">
                  *Alokasi Waktu Intrakurikuler & Kokurikuler (P5) disusun sesuai Panduan Kurikulum Merdeka BSKAP.
                </td>
                <td className="border border-black no-print" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Official Signatures Block */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-xs font-serif font-medium text-slate-900 break-inside-avoid">
          <div className="text-center space-y-16">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala Satuan Pendidikan</p>
              <p className="font-bold uppercase text-blue-950">{kopSettings.schoolName}</p>
            </div>
            <div>
              <p className="font-bold underline uppercase">{kopSettings.headmasterName}</p>
              <p className="text-[11px] font-sans">NIP. {kopSettings.headmasterNip}</p>
            </div>
          </div>

          <div className="text-center space-y-16">
            <div>
              <p>{kopSettings.dateLocation}</p>
              <p className="font-bold">Guru Mata Pelajaran</p>
              <p className="font-bold uppercase text-blue-950">{currentSubject.subjectName}</p>
            </div>
            <div>
              <p className="font-bold underline uppercase">{kopSettings.teacherName}</p>
              <p className="text-[11px] font-sans">NIP. {kopSettings.teacherNip}</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── MODAL EDIT TP ATRIBUT ATP ── */}
      {editingTp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Edit Atribut ATP [{editingTp.tp.code}]
                </h3>
              </div>
              <button
                onClick={() => setEditingTp(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Tujuan Pembelajaran (TP):</label>
                <textarea
                  rows={2}
                  value={editingTp.tp.title}
                  onChange={(e) =>
                    setEditingTp({
                      ...editingTp,
                      tp: { ...editingTp.tp, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas Target:</label>
                  <select
                    value={editingTp.tp.classGrade}
                    onChange={(e) =>
                      setEditingTp({
                        ...editingTp,
                        tp: { ...editingTp.tp, classGrade: e.target.value as 'VII' | 'VIII' | 'IX' },
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester Target:</label>
                  <select
                    value={editingTp.tp.semester || 1}
                    onChange={(e) =>
                      setEditingTp({
                        ...editingTp,
                        tp: { ...editingTp.tp, semester: parseInt(e.target.value) as 1 | 2 },
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value={1}>1 (Ganjil)</option>
                    <option value={2}>2 (Genap)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-blue-900 mb-1">JP Intrakurikuler:</label>
                  <input
                    type="number"
                    min={1}
                    value={editingTp.tp.jpIntra || 0}
                    onChange={(e) =>
                      setEditingTp({
                        ...editingTp,
                        tp: { ...editingTp.tp, jpIntra: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-bold text-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-900 mb-1">JP Kokurikuler (P5):</label>
                  <input
                    type="number"
                    min={0}
                    value={editingTp.tp.jpKo || 0}
                    onChange={(e) =>
                      setEditingTp({
                        ...editingTp,
                        tp: { ...editingTp.tp, jpKo: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-bold text-amber-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata / Frasa Kunci Materi:</label>
                <input
                  type="text"
                  value={editingTp.tp.keywords || ''}
                  onChange={(e) =>
                    setEditingTp({
                      ...editingTp,
                      tp: { ...editingTp.tp, keywords: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  placeholder="Misal: Sejarah Pancasila, BPUPK, PPKI, Sila"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dimensi Profil Pelajar Pancasila (P5):</label>
                <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {P5_DIMENSION_OPTIONS.map((dim) => {
                    const isChecked = editingTp.tp.p5Dimensions?.includes(dim);
                    return (
                      <label key={dim} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const curr = editingTp.tp.p5Dimensions || [];
                            const next = e.target.checked
                              ? [...curr, dim]
                              : curr.filter((d) => d !== dim);
                            setEditingTp({
                              ...editingTp,
                              tp: { ...editingTp.tp, p5Dimensions: next },
                            });
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{dim}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Glosarium & Prasyarat Awal:</label>
                <input
                  type="text"
                  value={editingTp.tp.glosarium || ''}
                  onChange={(e) =>
                    setEditingTp({
                      ...editingTp,
                      tp: { ...editingTp.tp, glosarium: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  placeholder="Ringkasan istilah atau kemampuan prasyarat"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Rencana Asesmen Formatif:</label>
                  <input
                    type="text"
                    value={editingTp.tp.asesmenFormatif || ''}
                    onChange={(e) =>
                      setEditingTp({
                        ...editingTp,
                        tp: { ...editingTp.tp, asesmenFormatif: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Rencana Asesmen Sumatif:</label>
                  <input
                    type="text"
                    value={editingTp.tp.asesmenSumatif || ''}
                    onChange={(e) =>
                      setEditingTp({
                        ...editingTp,
                        tp: { ...editingTp.tp, asesmenSumatif: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                onClick={() => setEditingTp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEditTp}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Simpan Perubahan ATP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL TAMBAH TP BARU ── */}
      {isAddingTpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Tambah Tujuan Pembelajaran (TP) Baru ke ATP
                </h3>
              </div>
              <button
                onClick={() => setIsAddingTpModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Elemen Capaian Pembelajaran:</label>
                <select
                  value={selectedElementForNewTp}
                  onChange={(e) => setSelectedElementForNewTp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold bg-slate-50"
                >
                  {currentSubject.elements.map((elem) => (
                    <option key={elem.id} value={elem.id}>
                      {elem.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode TP:</label>
                  <input
                    type="text"
                    value={newTpData.code}
                    onChange={(e) => setNewTpData({ ...newTpData, code: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas Target:</label>
                  <select
                    value={newTpData.classGrade}
                    onChange={(e) => setNewTpData({ ...newTpData, classGrade: e.target.value as 'VII' | 'VIII' | 'IX' })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Tujuan Pembelajaran:</label>
                <textarea
                  rows={3}
                  placeholder="Misal: Menganalisis makna dan penerapan nilai-nilai Pancasila dalam era digital..."
                  value={newTpData.title}
                  onChange={(e) => setNewTpData({ ...newTpData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Alokasi JP Intrakurikuler:</label>
                  <input
                    type="number"
                    min={1}
                    value={newTpData.jpIntra}
                    onChange={(e) => setNewTpData({ ...newTpData, jpIntra: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-900 mb-1">Alokasi JP Kokurikuler (P5):</label>
                  <input
                    type="number"
                    min={0}
                    value={newTpData.jpKo}
                    onChange={(e) => setNewTpData({ ...newTpData, jpKo: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-amber-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                onClick={() => setIsAddingTpModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleAddNewTp}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Simpan TP Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
