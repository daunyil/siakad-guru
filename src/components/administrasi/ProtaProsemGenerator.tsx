import React, { useState, useMemo } from 'react';
import type {
  CPSubject,
  CPTujuanPembelajaran,
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
} from '../../types';
import { initialCpSubjects, findCpSubjectId } from '../../data/cpMasterData';
import { smartPrint } from '../../utils/printHelper';
import {
  Calendar,
  Printer,
  CheckCircle2,
  Settings,
  Sparkles,
} from 'lucide-react';
import { ImportKaldikModal } from './ImportKaldikModal';
import { NationalHolidaysSyncModal } from './prota-prosem/NationalHolidaysSyncModal';

// Re-export types and presets for backward compatibility across the app
export type { WeekStatus, RegionalKaldik, MonthCol, KopData } from './prota-prosem/types';
export { REGIONAL_KALDIK_PRESETS } from './prota-prosem/kaldikPresets';

import type { WeekStatus, MonthCol, KopData } from './prota-prosem/types';
import { REGIONAL_KALDIK_PRESETS } from './prota-prosem/kaldikPresets';
import { KopEditor } from './prota-prosem/KopEditor';
import { ProtaTable } from './prota-prosem/ProtaTable';
import { ProsemTable } from './prota-prosem/ProsemTable';

interface ProtaProsemGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
}

export const ProtaProsemGenerator: React.FC<ProtaProsemGeneratorProps> = ({
  school,
  teacher,
  year,
  selectedAssignmentSubject,
  selectedClassLabel,
}) => {
  // Master Subjects Data
  const [subjects] = useState<CPSubject[]>(initialCpSubjects);
  const activeSubjectName = selectedAssignmentSubject || teacher.subject;

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(() =>
    findCpSubjectId(initialCpSubjects, activeSubjectName)
  );

  React.useEffect(() => {
    const targetSubjectId = findCpSubjectId(subjects, activeSubjectName);
    if (targetSubjectId) {
      setSelectedSubjectId(targetSubjectId);
    }
  }, [activeSubjectName, subjects]);

  const [selectedGrade, setSelectedGrade] = useState<'VII' | 'VIII' | 'IX'>(() => {
    if (selectedClassLabel?.toUpperCase().includes('VIII')) return 'VIII';
    if (selectedClassLabel?.toUpperCase().includes('IX')) return 'IX';
    return 'VII';
  });

  React.useEffect(() => {
    if (selectedClassLabel?.toUpperCase().includes('VIII')) setSelectedGrade('VIII');
    else if (selectedClassLabel?.toUpperCase().includes('IX')) setSelectedGrade('IX');
    else if (selectedClassLabel?.toUpperCase().includes('VII')) setSelectedGrade('VII');
  }, [selectedClassLabel]);

  const [activeTab, setActiveTab] = useState<'prota' | 'prosem'>('prota');
  const [selectedSemester, setSelectedSemester] = useState<'ganjil' | 'genap'>('ganjil');

  // Pekan Efektif & Sebaran Kurikulum Settings
  const [jpPerWeek, setJpPerWeek] = useState<number>(3);
  const [jpIntraPerWeek, setJpIntraPerWeek] = useState<number>(2);
  const [jpKoPerWeek, setJpKoPerWeek] = useState<number>(1);
  const [weeksGanjil, setWeeksGanjil] = useState<number>(18);
  const [weeksGenap, setWeeksGenap] = useState<number>(18);

  const [notification, setNotification] = useState<string | null>(null);

  // Identity Kop Settings
  const [kop, setKop] = useState<KopData>({
    schoolName: school.name || 'SMP NEGERI 1 BANTAN',
    npsn: school.npsn || '10401234',
    address: school.address || 'Jl. Soekarno-Hatta No. 45, Bantan, Kab. Bengkalis',
    headmasterName: school.headmasterName || 'Drs. H. M. YUSUF, M.Pd.',
    headmasterNip: school.headmasterNip || '19680512 199403 1 004',
    teacherName: teacher.name || 'SITI AMINAH, S.Pd.',
    teacherNip: teacher.nip || '19850410 201001 2 015',
    dateLocation: 'Bantan, 14 Juli 2025',
  });

  React.useEffect(() => {
    setKop((prev) => ({
      ...prev,
      schoolName: school.name || prev.schoolName,
      npsn: school.npsn || prev.npsn,
      address: school.address || prev.address,
      headmasterName: school.headmasterName || prev.headmasterName,
      headmasterNip: school.headmasterNip || prev.headmasterNip,
      teacherName: teacher.name || prev.teacherName,
      teacherNip: teacher.nip || prev.teacherNip,
    }));
  }, [school, teacher]);

  const [isEditingKop, setIsEditingKop] = useState<boolean>(false);

  // Current Active Subject
  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  }, [subjects, selectedSubjectId]);

  // Extract all TPs for selected grade
  const gradeTps = useMemo(() => {
    if (!currentSubject) return [];
    const list: { elementId: string; elementName: string; tp: CPTujuanPembelajaran }[] = [];

    currentSubject.elements.forEach((elem) => {
      elem.tpList.forEach((tp) => {
        if (tp.classGrade === selectedGrade || !tp.classGrade) {
          list.push({
            elementId: elem.id,
            elementName: elem.name,
            tp,
          });
        }
      });
    });

    return list;
  }, [currentSubject, selectedGrade]);

  // Prota Allocation state (editable JP per TP)
  const [customJpMap, setCustomJpMap] = useState<Record<string, { jp: number; semester: 'ganjil' | 'genap' }>>({});
  const [targetCadanganPerSem, setTargetCadanganPerSem] = useState<number>(3);

  // Months definition for PROSEM
  const ganjilMonths: MonthCol[] = useMemo(() => [
    { name: 'Juli', weeks: 4 },
    { name: 'Agustus', weeks: 5 },
    { name: 'September', weeks: 4 },
    { name: 'Oktober', weeks: 4 },
    { name: 'November', weeks: 5 },
    { name: 'Desember', weeks: 4 },
  ], []);

  const genapMonths: MonthCol[] = useMemo(() => [
    { name: 'Januari', weeks: 5 },
    { name: 'Februari', weeks: 4 },
    { name: 'Maret', weeks: 4 },
    { name: 'April', weeks: 4 },
    { name: 'Mei', weeks: 5 },
    { name: 'Juni', weeks: 4 },
  ], []);

  // Regional Kaldik & Week Tagging State
  const [selectedRegionId, setSelectedRegionId] = useState<string>('riau');
  const [isKaldikModalOpen, setIsKaldikModalOpen] = useState<boolean>(false);
  const [isNationalHolidaysModalOpen, setIsNationalHolidaysModalOpen] = useState<boolean>(false);
  const [ganjilTags, setGanjilTags] = useState<Record<string, WeekStatus>>(
    REGIONAL_KALDIK_PRESETS[0].ganjilTags
  );
  const [genapTags, setGenapTags] = useState<Record<string, WeekStatus>>(
    REGIONAL_KALDIK_PRESETS[0].genapTags
  );

  // Calculate actual KBM weeks from Kaldik calendar
  const actualKbmWeeksGanjil = useMemo(() => {
    let kbm = 0;
    ganjilMonths.forEach((m) => {
      for (let w = 0; w < m.weeks; w++) {
        const tag = ganjilTags[`${m.name}-${w}`] || 'kbm';
        if (tag === 'kbm') kbm++;
      }
    });
    return kbm;
  }, [ganjilTags, ganjilMonths]);

  const actualKbmWeeksGenap = useMemo(() => {
    let kbm = 0;
    genapMonths.forEach((m) => {
      for (let w = 0; w < m.weeks; w++) {
        const tag = genapTags[`${m.name}-${w}`] || 'kbm';
        if (tag === 'kbm') kbm++;
      }
    });
    return kbm;
  }, [genapTags, genapMonths]);

  // Initialize custom JP map when subject/grade changes
  const tpAllocations = useMemo(() => {
    return gradeTps.map((item, index) => {
      const code = item.tp.code;
      const custom = customJpMap[code];
      const jp = custom ? custom.jp : item.tp.jp;
      // Respect explicit tp.semester if defined (1 = ganjil, 2 = genap), else fallback to half-split
      const defaultSemester =
        item.tp.semester === 1
          ? 'ganjil'
          : item.tp.semester === 2
          ? 'genap'
          : index < Math.ceil(gradeTps.length / 2)
          ? 'ganjil'
          : 'genap';

      const semester = custom ? custom.semester : defaultSemester;

      // Calculate Intrakurikuler & Kokurikuler breakdown per TP
      const totalJpWeek = Math.max(1, jpPerWeek);
      const ratioIntra = jpIntraPerWeek / totalJpWeek;
      const jpIntra = Math.round(jp * ratioIntra);
      const jpKo = Math.max(0, jp - jpIntra);

      return {
        ...item,
        jp,
        jpIntra,
        jpKo,
        semester,
      };
    });
  }, [gradeTps, customJpMap, jpPerWeek, jpIntraPerWeek, jpKoPerWeek]);

  // Summary calculations
  const totalJpGanjilAvailable = actualKbmWeeksGanjil * jpPerWeek;
  const totalJpGenapAvailable = actualKbmWeeksGenap * jpPerWeek;
  const totalJpYearAvailable = totalJpGanjilAvailable + totalJpGenapAvailable;

  const allocatedJpGanjil = tpAllocations
    .filter((a) => a.semester === 'ganjil')
    .reduce((acc, curr) => acc + curr.jp, 0);

  const allocatedJpGenap = tpAllocations
    .filter((a) => a.semester === 'genap')
    .reduce((acc, curr) => acc + curr.jp, 0);

  const totalAllocatedJp = allocatedJpGanjil + allocatedJpGenap;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateJp = (code: string, newJp: number, sem: 'ganjil' | 'genap') => {
    setCustomJpMap((prev) => ({
      ...prev,
      [code]: {
        jp: Math.max(1, newJp),
        semester: sem,
      },
    }));
  };

  // Smart Auto-Optimizer: Distributes available JP proportionately in exact weekly units across TPs leaving minimal Jam Cadangan (1 week default)
  const handleAutoOptimizeJp = (targetCadanganJp: number = targetCadanganPerSem) => {
    if (gradeTps.length === 0) return;

    const perWeek = Math.max(1, jpPerWeek);

    // Target cadangan in weeks (at least 0, default 1 week)
    const cadanganWeeksTarget = Math.max(0, Math.round(targetCadanganJp / perWeek));

    // Calculate available KBM weeks per semester from Kaldik
    const totalKbmGanjil = actualKbmWeeksGanjil;
    const totalKbmGenap = actualKbmWeeksGenap;

    const targetTpWeeksGanjil = Math.max(1, totalKbmGanjil - cadanganWeeksTarget);
    const targetTpWeeksGenap = Math.max(1, totalKbmGenap - cadanganWeeksTarget);

    const ganjilTps = gradeTps.filter((item, index) => {
      const custom = customJpMap[item.tp.code];
      const sem = custom
        ? custom.semester
        : item.tp.semester === 1
        ? 'ganjil'
        : item.tp.semester === 2
        ? 'genap'
        : index < Math.ceil(gradeTps.length / 2)
        ? 'ganjil'
        : 'genap';
      return sem === 'ganjil';
    });

    const genapTps = gradeTps.filter((item, index) => {
      const custom = customJpMap[item.tp.code];
      const sem = custom
        ? custom.semester
        : item.tp.semester === 1
        ? 'ganjil'
        : item.tp.semester === 2
        ? 'genap'
        : index < Math.ceil(gradeTps.length / 2)
        ? 'ganjil'
        : 'genap';
      return sem === 'genap';
    });

    const newCustomMap: Record<string, { jp: number; semester: 'ganjil' | 'genap' }> = {};

    // 1. Optimize Ganjil TPs in WEEKS
    const weightGanjilSum = ganjilTps.reduce((acc, curr) => acc + (curr.tp.jp || 10), 0);
    if (ganjilTps.length > 0 && weightGanjilSum > 0) {
      let allocatedWeeks = 0;
      ganjilTps.forEach((item, idx) => {
        let tpWeeks: number;
        if (idx === ganjilTps.length - 1) {
          tpWeeks = Math.max(1, targetTpWeeksGanjil - allocatedWeeks);
        } else {
          const w = (item.tp.jp || 10) / weightGanjilSum;
          tpWeeks = Math.max(1, Math.round(targetTpWeeksGanjil * w));
          allocatedWeeks += tpWeeks;
        }
        newCustomMap[item.tp.code] = {
          jp: tpWeeks * perWeek,
          semester: 'ganjil',
        };
      });
    }

    // 2. Optimize Genap TPs in WEEKS
    const weightGenapSum = genapTps.reduce((acc, curr) => acc + (curr.tp.jp || 10), 0);
    if (genapTps.length > 0 && weightGenapSum > 0) {
      let allocatedWeeks = 0;
      genapTps.forEach((item, idx) => {
        let tpWeeks: number;
        if (idx === genapTps.length - 1) {
          tpWeeks = Math.max(1, targetTpWeeksGenap - allocatedWeeks);
        } else {
          const w = (item.tp.jp || 10) / weightGenapSum;
          tpWeeks = Math.max(1, Math.round(targetTpWeeksGenap * w));
          allocatedWeeks += tpWeeks;
        }
        newCustomMap[item.tp.code] = {
          jp: tpWeeks * perWeek,
          semester: 'genap',
        };
      });
    }

    setCustomJpMap(newCustomMap);
  };

  // Auto-optimize TP JP on load or subject/grade/kaldik change so Jam Cadangan defaults to 1 week (3-4 JP)
  React.useEffect(() => {
    if (gradeTps.length > 0) {
      handleAutoOptimizeJp(targetCadanganPerSem);
    }
  }, [selectedSubjectId, selectedGrade, selectedRegionId, jpPerWeek, actualKbmWeeksGanjil, actualKbmWeeksGenap, gradeTps.length]);

  // Handle Preset Change
  const handleSelectRegionPreset = (regionId: string) => {
    setSelectedRegionId(regionId);
    const preset = REGIONAL_KALDIK_PRESETS.find((r) => r.id === regionId);
    if (preset) {
      setGanjilTags({ ...preset.ganjilTags });
      setGenapTags({ ...preset.genapTags });
      showToast(`Kalender Pendidikan disesuaikan dengan Preset: ${preset.name}`);
    }
  };

  const handleApplyImportedKaldik = (
    newGanjil: Record<string, WeekStatus>,
    newGenap: Record<string, WeekStatus>,
    sourceInfo: string
  ) => {
    setGanjilTags(newGanjil);
    setGenapTags(newGenap);
    setSelectedRegionId('custom');
    showToast(`Kalender Pendidikan diperbarui dari: ${sourceInfo}`);
  };

  const handleApplyNationalHolidays = (
    newGanjil: Record<string, WeekStatus>,
    newGenap: Record<string, WeekStatus>,
    countApplied: number
  ) => {
    setGanjilTags(newGanjil);
    setGenapTags(newGenap);
    setSelectedRegionId('custom');
    showToast(`Berhasil menerapkan ${countApplied} Hari Libur Nasional & Cuti Bersama ke Kaldik!`);
  };

  // Helper to toggle week tag
  const handleToggleWeekTag = (semester: 'ganjil' | 'genap', monthName: string, weekIdx: number) => {
    const key = `${monthName}-${weekIdx}`;
    const targetMap = semester === 'ganjil' ? ganjilTags : genapTags;
    const currentStatus = targetMap[key] || 'kbm';

    const order: WeekStatus[] = ['kbm', 'mpls', 'sts', 'sas', 'rapor', 'libur'];
    const nextStatus = order[(order.indexOf(currentStatus) + 1) % order.length];

    if (semester === 'ganjil') {
      setGanjilTags({ ...ganjilTags, [key]: nextStatus });
    } else {
      setGenapTags({ ...genapTags, [key]: nextStatus });
    }
    setSelectedRegionId('custom');
  };

  const activeMonths = selectedSemester === 'ganjil' ? ganjilMonths : genapMonths;
  const activeSemesterAllocations = tpAllocations.filter(
    (a) => a.semester === selectedSemester
  );

  const handlePrint = () => {
    smartPrint({
      documentSelector: '.document-page',
      docTitle: `Prota & Prosem - ${currentSubject.subjectName}`,
      orientation: activeTab === 'prosem' ? 'landscape' : 'portrait',
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Generator Otomatis Prota & Prosem
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Perhitungan JP Presisi
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Program Tahunan (PROTA) & Program Semester (PROSEM)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Otomatisasi pemetaan alokasi jam pelajaran (JP), pekan efektif, dan distribusi Tujuan Pembelajaran per minggu/bulan berdasarkan data Capaian Pembelajaran Kurikulum Merdeka.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditingKop(!isEditingKop)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-blue-400" />
              <span>{isEditingKop ? 'Tutup Pengatur Kop' : 'Atur Kop & Tanda Tangan'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── EXPANDABLE KOP EDITOR ── */}
      {isEditingKop && (
        <KopEditor
          kop={kop}
          setKop={setKop}
          onClose={() => setIsEditingKop(false)}
        />
      )}

      {/* ── SELECTION TOOLBAR & PEKAN EFEKTIF CONFIG ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Subject & Grade Selector */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Mata Pelajaran:</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subjectName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Kelas / Tingkat:</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as 'VII' | 'VIII' | 'IX')}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
              >
                <option value="VII">Kelas VII (SMP)</option>
                <option value="VIII">Kelas VIII (SMP)</option>
                <option value="IX">Kelas IX (SMP)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Total Beban JP/Minggu:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={jpPerWeek}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 3;
                    setJpPerWeek(val);
                    const intra = Math.max(1, val - 1);
                    setJpIntraPerWeek(intra);
                    setJpKoPerWeek(Math.max(0, val - intra));
                  }}
                  className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 text-center"
                />
                <div className="text-[10px] bg-amber-50 px-2 py-1 rounded border border-amber-300 flex items-center gap-1.5 font-bold">
                  <div className="flex items-center gap-0.5">
                    <span className="text-slate-600">Intra:</span>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={jpIntraPerWeek}
                      onChange={(e) => setJpIntraPerWeek(parseInt(e.target.value) || 1)}
                      className="w-8 px-0.5 py-0.2 bg-white border border-slate-300 rounded text-center text-blue-900 font-bold"
                    />
                  </div>
                  <span className="text-slate-400">+</span>
                  <div className="flex items-center gap-0.5">
                    <span className="text-slate-600">Ko (P5):</span>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={jpKoPerWeek}
                      onChange={(e) => setJpKoPerWeek(parseInt(e.target.value) || 0)}
                      className="w-8 px-0.5 py-0.2 bg-white border border-slate-300 rounded text-center text-amber-800 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Switcher: PROTA vs PROSEM */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('prota')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'prota'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Program Tahunan (PROTA)
            </button>
            <button
              onClick={() => setActiveTab('prosem')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'prosem'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Program Semester (PROSEM)
            </button>
          </div>
        </div>

        {/* Pekan Efektif Config Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-bold block">Pekan Efektif Sem. Ganjil:</span>
            <div className="flex items-center justify-between mt-1">
              <input
                type="number"
                value={weeksGanjil}
                onChange={(e) => setWeeksGanjil(parseInt(e.target.value) || 18)}
                className="w-16 px-2 py-1 bg-white border rounded font-bold text-center"
              />
              <span className="font-bold text-blue-900">
                = {totalJpGanjilAvailable} JP Total
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-bold block">Pekan Efektif Sem. Genap:</span>
            <div className="flex items-center justify-between mt-1">
              <input
                type="number"
                value={weeksGenap}
                onChange={(e) => setWeeksGenap(parseInt(e.target.value) || 18)}
                className="w-16 px-2 py-1 bg-white border rounded font-bold text-center"
              />
              <span className="font-bold text-blue-900">
                = {totalJpGenapAvailable} JP Total
              </span>
            </div>
          </div>

          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200">
            <span className="text-blue-700 font-bold block">Total JP Efektif 1 Tahun:</span>
            <span className="text-base font-black text-blue-900 block mt-1">
              {totalJpYearAvailable} JP
            </span>
            <span className="text-[10px] text-blue-600">
              ({weeksGanjil + weeksGenap} Pekan × {jpPerWeek} JP)
            </span>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex flex-col justify-between">
            <div>
              <span className="text-emerald-700 font-bold block">Status Alokasi JP TP:</span>
              <span className="text-base font-black text-emerald-900 block mt-1">
                {totalAllocatedJp} / {totalJpYearAvailable} JP
              </span>
              <span className="text-[10px] text-emerald-700 block">
                {totalAllocatedJp <= totalJpYearAvailable
                  ? '✓ Alokasi Kuota Memenuhi'
                  : '⚠️ Melebihi kuota jam efektif!'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleAutoOptimizeJp(targetCadanganPerSem)}
              className="mt-2 text-[10px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1 px-2 rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>⚡ Optimalkan JP Otomatis</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── OFFICIAL DOCUMENT PRINT CANVAS ── */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-lg p-8 md:p-12 space-y-6 document-page text-black font-serif text-xs leading-normal">
        {/* KOP OFFICIAL */}
        <div className="text-center border-b-2 border-black pb-4 space-y-1">
          <h1 className="text-sm md:text-base font-bold uppercase tracking-wider">
            {activeTab === 'prota'
              ? 'PROGRAM TAHUNAN (PROTA)'
              : `PROGRAM SEMESTER (PROSEM) ${selectedSemester.toUpperCase()}`}
          </h1>
          <h2 className="text-xs md:text-sm font-bold uppercase">
            KURIKULUM MERDEKA - TAHUN PELAJARAN {year.label}
          </h2>
          <h3 className="text-xs font-bold uppercase">{kop.schoolName}</h3>
          <p className="text-[11px] font-sans italic text-slate-600">{kop.address}</p>
        </div>

        {/* METADATA DOKUMEN TABLE */}
        <div className="bg-slate-50 p-3 rounded border border-slate-300 font-sans text-[11px] grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <div>
              <strong>MATA PELAJARAN:</strong> {currentSubject.subjectName}
            </div>
            <div>
              <strong>SATUAN PENDIDIKAN:</strong> {kop.schoolName}
            </div>
            <div>
              <strong>FASE / KELAS:</strong> {currentSubject.phase} / Kelas {selectedGrade}
            </div>
          </div>
          <div>
            <div>
              <strong>GURU MATA PELAJARAN:</strong> {kop.teacherName} (NIP. {kop.teacherNip})
            </div>
            <div>
              <strong>KEPALA SEKOLAH:</strong> {kop.headmasterName} (NIP. {kop.headmasterNip})
            </div>
            <div>
              <strong>BEBAN BELAJAR:</strong> {jpPerWeek} JP / Minggu ({jpIntraPerWeek} JP Intrakurikuler + {jpKoPerWeek} JP Kokurikuler/P5)
            </div>
          </div>
        </div>

        {/* ── TAB CONTENT: PROGRAM TAHUNAN (PROTA) ── */}
        {activeTab === 'prota' && (
          <ProtaTable
            selectedGrade={selectedGrade}
            tpAllocations={tpAllocations}
            allocatedJpGanjil={allocatedJpGanjil}
            allocatedJpGenap={allocatedJpGenap}
            totalAllocatedJp={totalAllocatedJp}
            totalJpGanjilAvailable={totalJpGanjilAvailable}
            totalJpGenapAvailable={totalJpGenapAvailable}
            handleUpdateJp={handleUpdateJp}
          />
        )}

        {/* ── TAB CONTENT: PROGRAM SEMESTER (PROSEM) ── */}
        {activeTab === 'prosem' && (
          <ProsemTable
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            selectedRegionId={selectedRegionId}
            onSelectRegionPreset={handleSelectRegionPreset}
            onOpenImportModal={() => setIsKaldikModalOpen(true)}
            onOpenNationalHolidaysModal={() => setIsNationalHolidaysModalOpen(true)}
            activeMonths={activeMonths}
            activeSemesterAllocations={activeSemesterAllocations}
            ganjilTags={ganjilTags}
            genapTags={genapTags}
            handleToggleWeekTag={handleToggleWeekTag}
            jpPerWeek={jpPerWeek}
            jpIntraPerWeek={jpIntraPerWeek}
            jpKoPerWeek={jpKoPerWeek}
            onAutoOptimizeJp={handleAutoOptimizeJp}
            targetCadanganPerSem={targetCadanganPerSem}
            setTargetCadanganPerSem={setTargetCadanganPerSem}
          />
        )}

        {/* TANDA TANGAN DOKUMEN */}
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
            <div>Guru Mata Pelajaran</div>
            <div className="h-20" />
            <div className="font-bold underline">{kop.teacherName}</div>
            <div>NIP. {kop.teacherNip}</div>
          </div>
        </div>
      </div>

      {/* Modal Import / Pindai Kaldik (Gambar AI & Excel) */}
      <ImportKaldikModal
        isOpen={isKaldikModalOpen}
        onClose={() => setIsKaldikModalOpen(false)}
        onApplyKaldik={handleApplyImportedKaldik}
      />

      {/* Modal Integrasi & Sync Hari Libur Nasional SKB 3 Menteri / Google Calendar */}
      <NationalHolidaysSyncModal
        isOpen={isNationalHolidaysModalOpen}
        onClose={() => setIsNationalHolidaysModalOpen(false)}
        academicYear={year?.label || '2025/2026'}
        currentGanjilTags={ganjilTags}
        currentGenapTags={genapTags}
        onApplyNationalHolidays={handleApplyNationalHolidays}
      />
    </div>
  );
};
