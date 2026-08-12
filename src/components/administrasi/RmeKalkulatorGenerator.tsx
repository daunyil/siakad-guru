import React, { useState, useMemo } from 'react';
import type { SchoolProfile, TeacherProfile, AcademicYear } from '../../types';
import { STANDARD_SUBJECT_OPTIONS } from '../../data/sampleData';
import { smartPrint } from '../../utils/printHelper';
import {
  Calculator,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Info,
  Layers,
  Plus,
  Trash2,
  RefreshCw,
  BookOpen,
  User,
  Check,
  Users,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sun,
  ShieldCheck
} from 'lucide-react';
import ExcelJS from 'exceljs';

export type WeekStatusRme = 'kbm' | 'mpls' | 'sts' | 'sas' | 'rapor' | 'libur_nas' | 'libur';

export interface MonthConfig {
  name: string;
  monthIdx: number; // 0..11
  semester: 'ganjil' | 'genap';
  weeksCount: number; // 4 or 5
  weekStatuses: WeekStatusRme[]; // length = weeksCount
  nonEffectiveNote?: string;
}

export interface NationalHoliday {
  id: string;
  dateStr: string; // e.g., '2025-08-17' or '17 Agustus 2025'
  isoDate?: string; // YYYY-MM-DD
  name: string;
  category: 'keagamaan' | 'nasional' | 'cuti_bersama';
  semester: 'ganjil' | 'genap';
  monthName: string;
}

interface RmeKalkulatorGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
  onApplyToProtaProsem?: (ganjilWeeks: number, genapWeeks: number) => void;
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const SHORT_DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const DEFAULT_HOLIDAYS_2025_2026: NationalHoliday[] = [
  // Semester Ganjil (Juli - Desember 2025)
  { id: 'h1', isoDate: '2025-07-07', dateStr: '07 Juli 2025', name: 'Tahun Baru Islam 1447 H', category: 'keagamaan', semester: 'ganjil', monthName: 'Juli' },
  { id: 'h2', isoDate: '2025-08-17', dateStr: '17 Agustus 2025', name: 'HUT Kemerdekaan RI ke-80', category: 'nasional', semester: 'ganjil', monthName: 'Agustus' },
  { id: 'h3', isoDate: '2025-09-05', dateStr: '05 September 2025', name: 'Maulid Nabi Muhammad SAW', category: 'keagamaan', semester: 'ganjil', monthName: 'September' },
  { id: 'h4', isoDate: '2025-12-25', dateStr: '25 Desember 2025', name: 'Hari Raya Natal', category: 'keagamaan', semester: 'ganjil', monthName: 'Desember' },
  { id: 'h5', isoDate: '2025-12-26', dateStr: '26 Desember 2025', name: 'Cuti Bersama Natal', category: 'cuti_bersama', semester: 'ganjil', monthName: 'Desember' },

  // Semester Genap (Januari - Juni 2026)
  { id: 'h6', isoDate: '2026-01-01', dateStr: '01 Januari 2026', name: 'Tahun Baru 2026 Masehi', category: 'nasional', semester: 'genap', monthName: 'Januari' },
  { id: 'h7', isoDate: '2026-01-16', dateStr: '16 Januari 2026', name: 'Isra Mi\'raj Nabi Muhammad SAW', category: 'keagamaan', semester: 'genap', monthName: 'Januari' },
  { id: 'h8', isoDate: '2026-02-17', dateStr: '17 Februari 2026', name: 'Tahun Baru Imlek 2577', category: 'keagamaan', semester: 'genap', monthName: 'Februari' },
  { id: 'h9', isoDate: '2026-03-19', dateStr: '19 Maret 2026', name: 'Hari Raya Nyepi 1948', category: 'keagamaan', semester: 'genap', monthName: 'Maret' },
  { id: 'h10', isoDate: '2026-03-20', dateStr: '20 Maret 2026', name: 'Hari Raya Idul Fitri 1447 H (Hari 1)', category: 'keagamaan', semester: 'genap', monthName: 'Maret' },
  { id: 'h11', isoDate: '2026-03-21', dateStr: '21 Maret 2026', name: 'Hari Raya Idul Fitri 1447 H (Hari 2)', category: 'keagamaan', semester: 'genap', monthName: 'Maret' },
  { id: 'h12', isoDate: '2026-04-03', dateStr: '03 April 2026', name: 'Wafat Isa Almasih (Jumat Agung)', category: 'keagamaan', semester: 'genap', monthName: 'April' },
  { id: 'h13', isoDate: '2026-05-01', dateStr: '01 Mei 2026', name: 'Hari Buruh Internasional', category: 'nasional', semester: 'genap', monthName: 'Mei' },
  { id: 'h14', isoDate: '2026-05-14', dateStr: '14 Mei 2026', name: 'Kenaikan Isa Almasih', category: 'keagamaan', semester: 'genap', monthName: 'Mei' },
  { id: 'h15', isoDate: '2026-05-27', dateStr: '27 Mei 2026', name: 'Hari Raya Idul Adha 1447 H', category: 'keagamaan', semester: 'genap', monthName: 'Mei' },
  { id: 'h16', isoDate: '2026-06-01', dateStr: '01 Juni 2026', name: 'Hari Lahir Pancasila', category: 'nasional', semester: 'genap', monthName: 'Juni' },
];

const MONTH_DATA_GANJIL: { name: string; monthIdx: number; weeksCount: number; defaultNote: string }[] = [
  { name: 'Juli', monthIdx: 6, weeksCount: 5, defaultNote: '1 Minggu MPLS / Transisi' },
  { name: 'Agustus', monthIdx: 7, weeksCount: 4, defaultNote: 'HUT RI ke-80' },
  { name: 'September', monthIdx: 8, weeksCount: 4, defaultNote: '1 Minggu Sumatif Tengah Semester (STS)' },
  { name: 'Oktober', monthIdx: 9, weeksCount: 5, defaultNote: '-' },
  { name: 'November', monthIdx: 10, weeksCount: 4, defaultNote: '-' },
  { name: 'Desember', monthIdx: 11, weeksCount: 4, defaultNote: '1 Mgg SAS, 1 Mgg Rapor, 2 Mgg Libur Semester' },
];

const MONTH_DATA_GENAP: { name: string; monthIdx: number; weeksCount: number; defaultNote: string }[] = [
  { name: 'Januari', monthIdx: 0, weeksCount: 5, defaultNote: 'Libur Tahun Baru & Isra Mi\'raj' },
  { name: 'Februari', monthIdx: 1, weeksCount: 4, defaultNote: 'Tahun Baru Imlek' },
  { name: 'Maret', monthIdx: 2, weeksCount: 4, defaultNote: '1 Mgg STS & Libur Idul Fitri' },
  { name: 'April', monthIdx: 3, weeksCount: 4, defaultNote: '-' },
  { name: 'Mei', monthIdx: 4, weeksCount: 5, defaultNote: 'Kenaikan Isa Almasih & Idul Adha' },
  { name: 'Juni', monthIdx: 5, weeksCount: 4, defaultNote: '1 Mgg SAS, 1 Mgg Rapor, 2 Mgg Libur Semester' },
];

export const RmeKalkulatorGenerator: React.FC<RmeKalkulatorGeneratorProps> = ({
  school,
  teacher,
  year,
  selectedAssignmentSubject,
  selectedClassLabel,
  onApplyToProtaProsem,
}) => {
  // Config States
  const [selectedYearLabel, setSelectedYearLabel] = useState<string>(year?.label || '2025/2026');
  const [selectedSemesterTab, setSelectedSemesterTab] = useState<'ganjil' | 'genap' | 'rekap_tahun'>('ganjil');
  const [viewMode, setViewMode] = useState<'kalender_angka' | 'pekan_ringkas' | 'tabel_rme'>('kalender_angka');

  // Subject & Class Info
  const activeSubject = selectedAssignmentSubject || teacher.subject || 'Pendidikan Pancasila';
  const activeClass = selectedClassLabel ? `Kelas ${selectedClassLabel}` : 'Kelas VII-A';

  const [subjectName, setSubjectName] = useState<string>(activeSubject);
  const [classGrade, setClassGrade] = useState<string>(activeClass);

  React.useEffect(() => {
    if (activeSubject) setSubjectName(activeSubject);
  }, [activeSubject]);

  React.useEffect(() => {
    if (activeClass) setClassGrade(activeClass);
  }, [activeClass]);

  // Teacher Schedule Mode ('single' vs 'double')
  const [teacherMode, setTeacherMode] = useState<'single' | 'double'>('double');
  
  // Teacher 1 Settings (e.g. Guru Utama)
  const [teacher1Name, setTeacher1Name] = useState<string>(teacher.name || 'Guru Utama');
  const [teacher1Days, setTeacher1Days] = useState<string[]>(['Senin', 'Kamis']);
  const [teacher1JpPerMeeting, setTeacher1JpPerMeeting] = useState<number>(2);

  // Teacher 2 Settings (e.g. Guru Kedua / Team Teaching)
  const [teacher2Name, setTeacher2Name] = useState<string>('Dra. Hj. Siti Rohmah (Guru 2)');
  const [teacher2Days, setTeacher2Days] = useState<string[]>(['Selasa', 'Jumat']);
  const [teacher2JpPerMeeting, setTeacher2JpPerMeeting] = useState<number>(2);

  // Intrakurikuler & P5 ratio
  const [jpIntraRatio, setJpIntraRatio] = useState<number>(3);
  const [jpP5Ratio, setJpP5Ratio] = useState<number>(1);

  // Custom Date Assignment Map: ISO "YYYY-MM-DD" -> 'g1' | 'g2' | 'both' | 'libur' | 'none'
  const [customDateAssignments, setCustomDateAssignments] = useState<Record<string, 'g1' | 'g2' | 'both' | 'libur' | 'none'>>({});

  // Holidays
  const [holidays, setHolidays] = useState<NationalHoliday[]>(DEFAULT_HOLIDAYS_2025_2026);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  // Year Parser
  const parsedYears = useMemo(() => {
    const parts = selectedYearLabel.split('/');
    const start = parseInt(parts[0]) || 2025;
    const end = parseInt(parts[1]) || start + 1;
    return { start, end };
  }, [selectedYearLabel]);

  // Helper to format ISO date string
  const formatIsoDate = (y: number, mIdx: number, d: number) => {
    const mm = String(mIdx + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Helper to check if a date is Sunday or Holiday
  const getHolidayForDate = (isoDate: string) => {
    return holidays.find((h) => h.isoDate === isoDate);
  };

  // Auto-populate schedule to customDateAssignments for a semester
  const handleAutoApplySchedule = () => {
    const newMap: Record<string, 'g1' | 'g2' | 'both' | 'libur' | 'none'> = { ...customDateAssignments };

    const processSemesterMonths = (months: typeof MONTH_DATA_GANJIL, yearVal: number) => {
      months.forEach((mObj) => {
        const daysInMonth = new Date(yearVal, mObj.monthIdx + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const dt = new Date(yearVal, mObj.monthIdx, day);
          const dayName = DAY_NAMES[dt.getDay()];
          const iso = formatIsoDate(yearVal, mObj.monthIdx, day);

          // Skip Sunday (0) or national holiday
          if (dt.getDay() === 0 || getHolidayForDate(iso)) {
            newMap[iso] = 'libur';
            continue;
          }

          const isG1 = teacher1Days.includes(dayName);
          const isG2 = teacherMode === 'double' && teacher2Days.includes(dayName);

          if (isG1 && isG2) {
            newMap[iso] = 'both';
          } else if (isG1) {
            newMap[iso] = 'g1';
          } else if (isG2) {
            newMap[iso] = 'g2';
          } else {
            newMap[iso] = 'none';
          }
        }
      });
    };

    processSemesterMonths(MONTH_DATA_GANJIL, parsedYears.start);
    processSemesterMonths(MONTH_DATA_GENAP, parsedYears.end);

    setCustomDateAssignments(newMap);
    showStatus('📅 Jadwal mengajar berhasil diterapkan otomatis ke seluruh kalender!');
  };

  // Toggle single date on calendar grid
  const handleToggleDate = (isoDate: string, isSundayOrHoliday: boolean) => {
    if (isSundayOrHoliday) return; // Sunday/Holiday cannot be toggled to KBM easily

    setCustomDateAssignments((prev) => {
      const current = prev[isoDate] || 'none';
      let next: 'g1' | 'g2' | 'both' | 'libur' | 'none';

      if (teacherMode === 'double') {
        if (current === 'none') next = 'g1';
        else if (current === 'g1') next = 'g2';
        else if (current === 'g2') next = 'both';
        else if (current === 'both') next = 'libur';
        else next = 'none';
      } else {
        if (current === 'none') next = 'g1';
        else if (current === 'g1') next = 'libur';
        else next = 'none';
      }

      return { ...prev, [isoDate]: next };
    });
  };

  // Build Calendar Matrix for a month
  const buildMonthCalendarDays = (mObj: typeof MONTH_DATA_GANJIL[0], yearVal: number) => {
    const daysInMonth = new Date(yearVal, mObj.monthIdx + 1, 0).getDate();
    const firstDayIndex = new Date(yearVal, mObj.monthIdx, 1).getDay(); // 0 = Sun, 1 = Mon ...

    const cells: Array<{
      dayNum: number | null;
      isoDate: string | null;
      dayOfWeek: number;
      isSunday: boolean;
      holiday: NationalHoliday | undefined;
      assignment: 'g1' | 'g2' | 'both' | 'libur' | 'none';
    }> = [];

    // Empty offset cells
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({
        dayNum: null,
        isoDate: null,
        dayOfWeek: i,
        isSunday: i === 0,
        holiday: undefined,
        assignment: 'none',
      });
    }

    // Actual date cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dt = new Date(yearVal, mObj.monthIdx, day);
      const dayOfWeek = dt.getDay();
      const iso = formatIsoDate(yearVal, mObj.monthIdx, day);
      const isSunday = dayOfWeek === 0;
      const holiday = getHolidayForDate(iso);

      // Default assignment if not explicitly modified
      let assignment = customDateAssignments[iso];
      if (!assignment) {
        if (isSunday || holiday) {
          assignment = 'libur';
        } else {
          const dayName = DAY_NAMES[dayOfWeek];
          const isG1 = teacher1Days.includes(dayName);
          const isG2 = teacherMode === 'double' && teacher2Days.includes(dayName);

          if (isG1 && isG2) assignment = 'both';
          else if (isG1) assignment = 'g1';
          else if (isG2) assignment = 'g2';
          else assignment = 'none';
        }
      }

      cells.push({
        dayNum: day,
        isoDate: iso,
        dayOfWeek,
        isSunday,
        holiday,
        assignment,
      });
    }

    return cells;
  };

  // Detailed Calculation Engine for a Semester
  const calcSemesterDetail = (months: typeof MONTH_DATA_GANJIL, yearVal: number) => {
    let g1DaysTotal = 0;
    let g2DaysTotal = 0;
    let bothDaysTotal = 0;
    let totalKbmDaysClass = 0;

    let totalCalendarWeeks = 0;
    let totalEffectiveWeeks = 0;
    let totalNonEffectiveWeeks = 0;

    const monthBreakdowns = months.map((mObj) => {
      const cells = buildMonthCalendarDays(mObj, yearVal);
      let mG1 = 0;
      let mG2 = 0;
      let mBoth = 0;
      let mTotalKbm = 0;

      // Group by calendar weeks to determine effective weeks
      const activeWeeksSet = new Set<number>();

      cells.forEach((cell, idx) => {
        if (cell.dayNum !== null) {
          const weekIdx = Math.floor(idx / 7);
          const st = cell.assignment;

          if (st === 'g1') {
            mG1++;
            mTotalKbm++;
            activeWeeksSet.add(weekIdx);
          } else if (st === 'g2') {
            mG2++;
            mTotalKbm++;
            activeWeeksSet.add(weekIdx);
          } else if (st === 'both') {
            mBoth++;
            mG1++;
            mG2++;
            mTotalKbm++;
            activeWeeksSet.add(weekIdx);
          }
        }
      });

      g1DaysTotal += mG1;
      g2DaysTotal += mG2;
      bothDaysTotal += mBoth;
      totalKbmDaysClass += mTotalKbm;

      const effWeeks = activeWeeksSet.size;
      const calWeeks = mObj.weeksCount;
      const nonEffWeeks = Math.max(0, calWeeks - effWeeks);

      totalCalendarWeeks += calWeeks;
      totalEffectiveWeeks += effWeeks;
      totalNonEffectiveWeeks += nonEffWeeks;

      const g1Jp = mG1 * teacher1JpPerMeeting;
      const g2Jp = mG2 * teacher2JpPerMeeting;
      const classJp = mG1 * teacher1JpPerMeeting + mG2 * teacher2JpPerMeeting;

      return {
        ...mObj,
        cells,
        mG1,
        mG2,
        mBoth,
        mTotalKbm,
        effWeeks,
        nonEffWeeks,
        g1Jp,
        g2Jp,
        classJp,
      };
    });

    const g1TotalJp = g1DaysTotal * teacher1JpPerMeeting;
    const g2TotalJp = g2DaysTotal * teacher2JpPerMeeting;
    const totalClassJp = g1TotalJp + g2TotalJp;

    return {
      monthBreakdowns,
      g1DaysTotal,
      g2DaysTotal,
      bothDaysTotal,
      totalKbmDaysClass,
      totalCalendarWeeks,
      totalEffectiveWeeks,
      totalNonEffectiveWeeks,
      g1TotalJp,
      g2TotalJp,
      totalClassJp,
    };
  };

  const ganjilStats = useMemo(
    () => calcSemesterDetail(MONTH_DATA_GANJIL, parsedYears.start),
    [parsedYears.start, teacher1Days, teacher2Days, teacher1JpPerMeeting, teacher2JpPerMeeting, teacherMode, customDateAssignments, holidays]
  );

  const genapStats = useMemo(
    () => calcSemesterDetail(MONTH_DATA_GENAP, parsedYears.end),
    [parsedYears.end, teacher1Days, teacher2Days, teacher1JpPerMeeting, teacher2JpPerMeeting, teacherMode, customDateAssignments, holidays]
  );

  const yearStats = useMemo(() => {
    return {
      totalCalWeeks: ganjilStats.totalCalendarWeeks + genapStats.totalCalendarWeeks,
      totalEffWeeks: ganjilStats.totalEffectiveWeeks + genapStats.totalEffectiveWeeks,
      totalNonEffWeeks: ganjilStats.totalNonEffectiveWeeks + genapStats.totalNonEffectiveWeeks,
      g1DaysYear: ganjilStats.g1DaysTotal + genapStats.g1DaysTotal,
      g2DaysYear: ganjilStats.g2DaysTotal + genapStats.g2DaysTotal,
      kbmDaysClassYear: ganjilStats.totalKbmDaysClass + genapStats.totalKbmDaysClass,
      g1JpYear: ganjilStats.g1TotalJp + genapStats.g1TotalJp,
      g2JpYear: ganjilStats.g2TotalJp + genapStats.g2TotalJp,
      totalClassJpYear: ganjilStats.totalClassJp + genapStats.totalClassJp,
    };
  }, [ganjilStats, genapStats]);

  // Apply to Prota
  const handleApplyToProta = () => {
    if (onApplyToProtaProsem) {
      onApplyToProtaProsem(ganjilStats.totalEffectiveWeeks, genapStats.totalEffectiveWeeks);
    }
    showStatus(`✅ Terapkan ${ganjilStats.totalEffectiveWeeks} Minggu (Ganjil) & ${genapStats.totalEffectiveWeeks} Minggu (Genap) ke Prota & Prosem!`);
  };

  // Smart Print
  const handlePrint = () => {
    smartPrint({
      documentSelector: '#rme-print-area',
      docTitle: `RME & Jadwal Mengajar - ${subjectName} - ${school.name}`,
    });
  };

  // Export to Excel
  const handleExportExcel = async () => {
    showStatus('Menyiapkan berkas Excel Rincian Minggu Efektif & Jadwal Kalender...');
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Perangkat Administrasi Merdeka AI';
      const sheet = workbook.addWorksheet('RME & Jadwal Kalender');

      // Title
      sheet.mergeCells('A1:H1');
      sheet.getCell('A1').value = 'RINCIAN MINGGU EFEKTIF (RME) & JADWAL HARI MENGAJAR';
      sheet.getCell('A1').font = { size: 14, bold: true };
      sheet.getCell('A1').alignment = { horizontal: 'center' };

      sheet.mergeCells('A2:H2');
      sheet.getCell('A2').value = `${school.name.toUpperCase()} · TAHUN AJARAN ${selectedYearLabel}`;
      sheet.getCell('A2').font = { size: 11, bold: true };
      sheet.getCell('A2').alignment = { horizontal: 'center' };

      sheet.addRow([]);

      // Identity
      sheet.addRow(['Mata Pelajaran', ':', subjectName, '', 'Mode Pengajar', ':', teacherMode === 'double' ? '2 Guru (Team Teaching)' : '1 Guru (Reguler)']);
      sheet.addRow(['Kelas / Tingkat', ':', classGrade, '', 'Guru 1', ':', `${teacher1Name} (${teacher1Days.join(', ')} - ${teacher1JpPerMeeting} JP)`]);
      if (teacherMode === 'double') {
        sheet.addRow(['Sekolah', ':', school.name, '', 'Guru 2', ':', `${teacher2Name} (${teacher2Days.join(', ')} - ${teacher2JpPerMeeting} JP)`]);
      }
      sheet.addRow([]);

      const buildSemesterSheet = (semTitle: string, statsObj: typeof ganjilStats) => {
        sheet.addRow([semTitle]);
        const titleRow = sheet.lastRow;
        if (titleRow) titleRow.font = { bold: true, size: 12 };

        const headerRow = sheet.addRow([
          'No',
          'Nama Bulan',
          'Jml Minggu Kalender',
          'Minggu Efektif',
          'Pertemuan Guru 1',
          teacherMode === 'double' ? 'Pertemuan Guru 2' : '-',
          'Total JP Kelas',
          'Catatan / Rincian',
        ]);

        headerRow.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
          cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        statsObj.monthBreakdowns.forEach((m, idx) => {
          const row = sheet.addRow([
            idx + 1,
            m.name,
            m.weeksCount,
            m.effWeeks,
            `${m.mG1} Hari (${m.g1Jp} JP)`,
            teacherMode === 'double' ? `${m.mG2} Hari (${m.g2Jp} JP)` : '-',
            `${m.classJp} JP`,
            m.defaultNote,
          ]);
          row.getCell(1).alignment = { horizontal: 'center' };
          row.getCell(3).alignment = { horizontal: 'center' };
          row.getCell(4).alignment = { horizontal: 'center' };
        });

        const totalRow = sheet.addRow([
          '',
          'JUMLAH SEMESTER',
          statsObj.totalCalendarWeeks,
          statsObj.totalEffectiveWeeks,
          `${statsObj.g1DaysTotal} Hari (${statsObj.g1TotalJp} JP)`,
          teacherMode === 'double' ? `${statsObj.g2DaysTotal} Hari (${statsObj.g2TotalJp} JP)` : '-',
          `${statsObj.totalClassJp} JP`,
          `Total Pertemuan Kelas: ${statsObj.totalKbmDaysClass} Hari`,
        ]);

        totalRow.eachCell((cell) => {
          cell.font = { bold: true };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
        });

        sheet.addRow([]);
      };

      buildSemesterSheet('SEMESTER GANJIL', ganjilStats);
      buildSemesterSheet('SEMESTER GENAP', genapStats);

      sheet.columns.forEach((col) => {
        col.width = 22;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RME_Jadwal_Mengajar_${subjectName.replace(/\s+/g, '_')}_${selectedYearLabel.replace('/', '-')}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      showStatus('✅ Berkas Excel RME & Kalender berhasil diunduh!');
    } catch (err) {
      console.error(err);
      showStatus('❌ Gagal mengekspor Excel.');
    }
  };

  const toggleDaySelection = (teacherNum: 1 | 2, dayName: string) => {
    if (teacherNum === 1) {
      setTeacher1Days((prev) =>
        prev.includes(dayName) ? prev.filter((d) => d !== dayName) : [...prev, dayName]
      );
    } else {
      setTeacher2Days((prev) =>
        prev.includes(dayName) ? prev.filter((d) => d !== dayName) : [...prev, dayName]
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {statusMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-blue-800/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-blue-400" />
                Kalkulator Presisi RME & Tanggal Kalender
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Dukungan 2 Guru (2x / Mgg per Kelas)
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Kalkulator RME, Kalender Tanggal Interaktif & Beban Mengajar
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Pilih tanggal jadwal masuk di kalender angka (1-31). Hitung otomatis jumlah pertemuan KBM, minggu efektif, serta beban JP untuk <strong className="text-blue-300">Guru 1</strong> dan <strong className="text-purple-300">Guru 2</strong> dalam 1 mapel & kelas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleApplyToProta}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Sync ke Prota & Prosem</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Settings & Multi-Teacher Configuration */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Pengaturan Jadwal Mengajar & Mode Pengajar (1 atau 2 Guru)</h3>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setTeacherMode('single')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                teacherMode === 'single'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👤 1 Guru (Reguler)
            </button>
            <button
              onClick={() => setTeacherMode('double')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                teacherMode === 'double'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👥 2 Guru (Team Teaching)
            </button>
          </div>
        </div>

        {/* Global Class & Academic Info Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">📅 Tahun Ajaran</label>
            <select
              value={selectedYearLabel}
              onChange={(e) => setSelectedYearLabel(e.target.value)}
              className="w-full px-3 py-2 bg-blue-50 border border-blue-300 text-blue-950 rounded-lg font-extrabold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="2024/2025">2024 / 2025</option>
              <option value="2025/2026">2025 / 2026</option>
              <option value="2026/2027">2026 / 2027</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Mata Pelajaran</label>
            <select
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {STANDARD_SUBJECT_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              {subjectName && !STANDARD_SUBJECT_OPTIONS.includes(subjectName) && (
                <option value={subjectName}>{subjectName}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Kelas / Rombel</label>
            <input
              type="text"
              value={classGrade}
              onChange={(e) => setClassGrade(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Aksi Cepat Jadwal</label>
            <button
              onClick={handleAutoApplySchedule}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Terapkan Hari Mengajar Ke Kalender</span>
            </button>
          </div>
        </div>

        {/* Teacher Schedules Configuration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Teacher 1 Setup Card */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-900 uppercase flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                GURU 1 (Utama / Pertama)
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                {teacher1Days.length} Hari / Minggu
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Nama Guru 1</label>
                <input
                  type="text"
                  value={teacher1Name}
                  onChange={(e) => setTeacher1Name(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">JP / Pertemuan</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={teacher1JpPerMeeting}
                  onChange={(e) => setTeacher1JpPerMeeting(parseInt(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-center"
                />
              </div>
            </div>

            {/* Days Toggle */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1.5">Jadwal Hari Mengajar Guru 1:</label>
              <div className="flex flex-wrap items-center gap-1.5">
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => {
                  const active = teacher1Days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDaySelection(1, day)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {day} {active && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Teacher 2 Setup Card (Only active in Double mode) */}
          {teacherMode === 'double' ? (
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-900 uppercase flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-600" />
                  GURU 2 (Tim Teaching / Kedua)
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                  {teacher2Days.length} Hari / Minggu
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Nama Guru 2</label>
                  <input
                    type="text"
                    value={teacher2Name}
                    onChange={(e) => setTeacher2Name(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">JP / Pertemuan</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={teacher2JpPerMeeting}
                    onChange={(e) => setTeacher2JpPerMeeting(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-center"
                  />
                </div>
              </div>

              {/* Days Toggle */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1.5">Jadwal Hari Mengajar Guru 2:</label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => {
                    const active = teacher2Days.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDaySelection(2, day)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          active
                            ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {day} {active && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center space-y-2">
              <Info className="w-6 h-6 text-slate-400" />
              <div className="text-xs font-bold text-slate-700">Mode 1 Guru Aktif</div>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Ubah ke "2 Guru (Team Teaching)" di pojok kanan atas jika 1 mata pelajaran diajar oleh 2 guru berbeda.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Guru 1 Summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Rekap Guru 1</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <User className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">
              {selectedSemesterTab === 'ganjil' ? ganjilStats.g1DaysTotal : selectedSemesterTab === 'genap' ? genapStats.g1DaysTotal : yearStats.g1DaysYear}
              <span className="text-xs font-semibold text-slate-500 ml-1">Hari KBM</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Total {selectedSemesterTab === 'ganjil' ? ganjilStats.g1TotalJp : selectedSemesterTab === 'genap' ? genapStats.g1TotalJp : yearStats.g1JpYear} JP Mengajar
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-blue-800 truncate">
            {teacher1Name} ({teacher1Days.join(', ') || 'Belum pilih hari'})
          </div>
        </div>

        {/* Guru 2 Summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              {teacherMode === 'double' ? 'Rekap Guru 2' : 'Minggu Efektif'}
            </span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <User className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            {teacherMode === 'double' ? (
              <>
                <div className="text-2xl font-black text-purple-950">
                  {selectedSemesterTab === 'ganjil' ? ganjilStats.g2DaysTotal : selectedSemesterTab === 'genap' ? genapStats.g2DaysTotal : yearStats.g2DaysYear}
                  <span className="text-xs font-semibold text-slate-500 ml-1">Hari KBM</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Total {selectedSemesterTab === 'ganjil' ? ganjilStats.g2TotalJp : selectedSemesterTab === 'genap' ? genapStats.g2TotalJp : yearStats.g2JpYear} JP Mengajar
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-black text-emerald-950">
                  {selectedSemesterTab === 'ganjil' ? ganjilStats.totalEffectiveWeeks : selectedSemesterTab === 'genap' ? genapStats.totalEffectiveWeeks : yearStats.totalEffWeeks}
                  <span className="text-xs font-semibold text-slate-500 ml-1">Minggu Efektif</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Dari total {selectedSemesterTab === 'ganjil' ? ganjilStats.totalCalendarWeeks : selectedSemesterTab === 'genap' ? genapStats.totalCalendarWeeks : yearStats.totalCalWeeks} Minggu Kalender
                </div>
              </>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-purple-800 truncate">
            {teacherMode === 'double' ? `${teacher2Name} (${teacher2Days.join(', ') || 'Belum pilih hari'})` : 'Beban KBM Terhitung Presisi'}
          </div>
        </div>

        {/* Combined Class Summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Beban Kelas</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">
              {selectedSemesterTab === 'ganjil' ? ganjilStats.totalClassJp : selectedSemesterTab === 'genap' ? genapStats.totalClassJp : yearStats.totalClassJpYear}
              <span className="text-xs font-semibold text-slate-500 ml-1">Total JP</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {selectedSemesterTab === 'ganjil' ? ganjilStats.totalKbmDaysClass : selectedSemesterTab === 'genap' ? genapStats.totalKbmDaysClass : yearStats.kbmDaysClassYear} Total Pertemuan Kelas
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Minggu Efektif: {selectedSemesterTab === 'ganjil' ? ganjilStats.totalEffectiveWeeks : selectedSemesterTab === 'genap' ? genapStats.totalEffectiveWeeks : yearStats.totalEffWeeks} Mgg</span>
          </div>
        </div>

        {/* Action Sync Card */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-4 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-100">
              <span>INTEGRASI DOKUMEN</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-xs text-blue-100 mt-1 leading-snug">
              Sync hasil hitungan {ganjilStats.totalEffectiveWeeks} & {genapStats.totalEffectiveWeeks} minggu efektif ini ke Prota & Prosem.
            </p>
          </div>
          <button
            onClick={handleApplyToProta}
            className="mt-3 py-2 px-3 bg-white hover:bg-blue-50 text-blue-950 font-extrabold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Terapkan Otomatis Sekarang</span>
          </button>
        </div>
      </div>

      {/* Main Tab & View Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-1">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setSelectedSemesterTab('ganjil')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              selectedSemesterTab === 'ganjil'
                ? 'border-blue-600 text-blue-700 font-extrabold bg-blue-50/60 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Semester Ganjil (Juli - Des)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-black">
              {ganjilStats.totalEffectiveWeeks} Mgg / {ganjilStats.totalKbmDaysClass} Prt
            </span>
          </button>

          <button
            onClick={() => setSelectedSemesterTab('genap')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              selectedSemesterTab === 'genap'
                ? 'border-blue-600 text-blue-700 font-extrabold bg-blue-50/60 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Semester Genap (Jan - Jun)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-black">
              {genapStats.totalEffectiveWeeks} Mgg / {genapStats.totalKbmDaysClass} Prt
            </span>
          </button>

          <button
            onClick={() => setSelectedSemesterTab('rekap_tahun')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              selectedSemesterTab === 'rekap_tahun'
                ? 'border-blue-600 text-blue-700 font-extrabold bg-blue-50/60 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Daftar Libur & Rekapitulasi</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        {selectedSemesterTab !== 'rekap_tahun' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto mb-1">
            <button
              onClick={() => setViewMode('kalender_angka')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'kalender_angka'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>🗓️ Kalender Angka (1-31)</span>
            </button>
            <button
              onClick={() => setViewMode('tabel_rme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'tabel_rme'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>📋 Tabel RME Ringkas</span>
            </button>
          </div>
        )}
      </div>

      {/* TAB CONTENT: SEMESTER GANJIL & GENAP */}
      {(selectedSemesterTab === 'ganjil' || selectedSemesterTab === 'genap') && (
        <div className="space-y-6">
          {/* Status Legend */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" /> Petunjuk Kalender Angka: Klik tanggal untuk ubah status mengajar
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Guru 1 ({teacher1Name.split(' ')[0]})
              </span>
              {teacherMode === 'double' && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600" /> Guru 2 ({teacher2Name.split(' ')[0]})
                </span>
              )}
              {teacherMode === 'double' && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> Kedua Guru (Tim)
                </span>
              )}
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                📌 Libur / Minggu
              </span>
            </div>
          </div>

          {/* VIEW MODE: REAL NUMBERED DATE CALENDAR (1-31) */}
          {viewMode === 'kalender_angka' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(selectedSemesterTab === 'ganjil' ? ganjilStats : genapStats).monthBreakdowns.map((m) => {
                return (
                  <div
                    key={m.name}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                  >
                    {/* Month Card Header */}
                    <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span>{m.name} {selectedSemesterTab === 'ganjil' ? parsedYears.start : parsedYears.end}</span>
                        </h4>
                        <span className="text-[11px] text-slate-300 font-medium">
                          {m.effWeeks} Minggu Efektif · {m.mTotalKbm} Hari KBM
                        </span>
                      </div>

                      <div className="text-right text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold">
                          {m.classJp} JP Total
                        </span>
                      </div>
                    </div>

                    {/* Month Grid */}
                    <div className="p-4 space-y-3 bg-slate-50/50">
                      {/* Day Name Headers */}
                      <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-200">
                        <span className="text-rose-600">Min</span>
                        <span>Sen</span>
                        <span>Sel</span>
                        <span>Rab</span>
                        <span>Kam</span>
                        <span>Jum</span>
                        <span>Sab</span>
                      </div>

                      {/* Date Cells */}
                      <div className="grid grid-cols-7 gap-1.5">
                        {m.cells.map((cell, idx) => {
                          if (cell.dayNum === null) {
                            return <div key={idx} className="h-11 bg-transparent" />;
                          }

                          const isRed = cell.isSunday || !!cell.holiday;
                          const st = cell.assignment;

                          let bgStyle = 'bg-white text-slate-800 border-slate-200 hover:border-blue-300';
                          let labelText = '';

                          if (isRed) {
                            bgStyle = 'bg-rose-50 text-rose-900 border-rose-200/80';
                          } else if (st === 'g1') {
                            bgStyle = 'bg-blue-600 text-white font-bold border-blue-700 shadow-2xs';
                            labelText = 'G1';
                          } else if (st === 'g2') {
                            bgStyle = 'bg-purple-600 text-white font-bold border-purple-700 shadow-2xs';
                            labelText = 'G2';
                          } else if (st === 'both') {
                            bgStyle = 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-2xs';
                            labelText = 'G1+2';
                          } else if (st === 'libur') {
                            bgStyle = 'bg-slate-200 text-slate-500 border-slate-300 line-through';
                          }

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => cell.isoDate && handleToggleDate(cell.isoDate, isRed)}
                              title={
                                cell.holiday
                                  ? `${cell.holiday.name}`
                                  : isRed
                                  ? 'Hari Minggu'
                                  : `Klik untuk ubah jadwal mengajar tanggal ${cell.dayNum}`
                              }
                              className={`h-11 rounded-xl border flex flex-col items-center justify-between p-1 transition-all ${bgStyle}`}
                            >
                              <span className={`text-xs font-black leading-none ${isRed && st === 'none' ? 'text-rose-600' : ''}`}>
                                {cell.dayNum}
                              </span>

                              {cell.holiday ? (
                                <span className="text-[8px] font-bold text-rose-700 truncate max-w-full px-0.5">
                                  📌 Libur
                                </span>
                              ) : labelText ? (
                                <span className="text-[9px] font-black px-1 rounded bg-black/20 text-white leading-tight">
                                  {labelText}
                                </span>
                              ) : (
                                <span className="text-[8px] opacity-0 hover:opacity-100 text-slate-400">
                                  +
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer JP Breakdown */}
                    <div className="p-3 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700">
                      <span>Rincian KBM {m.name}:</span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-extrabold">
                          G1: {m.mG1} Hari ({m.g1Jp} JP)
                        </span>
                        {teacherMode === 'double' && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded font-extrabold">
                            G2: {m.mG2} Hari ({m.g2Jp} JP)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* VIEW MODE: TABEL RINGKAS RME */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-900 text-white font-bold text-sm flex items-center justify-between">
                <span>TABEL RINCIAN MINGGU EFEKTIF & BEBAN MENGAJAR (SEMESTER {selectedSemesterTab.toUpperCase()})</span>
                <span className="text-xs font-normal text-slate-300">Tahun Ajaran {selectedYearLabel}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 text-center">
                      <th className="p-3 w-12">No</th>
                      <th className="p-3 text-left">Nama Bulan</th>
                      <th className="p-3">Minggu Kalender</th>
                      <th className="p-3">Minggu Efektif</th>
                      <th className="p-3">Hari KBM Guru 1</th>
                      {teacherMode === 'double' && <th className="p-3">Hari KBM Guru 2</th>}
                      <th className="p-3">Total JP Kelas</th>
                      <th className="p-3 text-left">Catatan Rinci</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedSemesterTab === 'ganjil' ? ganjilStats : genapStats).monthBreakdowns.map((m, idx) => (
                      <tr key={m.name} className="hover:bg-slate-50 transition-colors text-center">
                        <td className="p-3 font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900 text-left">{m.name}</td>
                        <td className="p-3">{m.weeksCount} Pekan</td>
                        <td className="p-3 font-bold text-emerald-800">{m.effWeeks} Pekan</td>
                        <td className="p-3 font-bold text-blue-900">{m.mG1} Hari ({m.g1Jp} JP)</td>
                        {teacherMode === 'double' && (
                          <td className="p-3 font-bold text-purple-900">{m.mG2} Hari ({m.g2Jp} JP)</td>
                        )}
                        <td className="p-3 font-extrabold text-slate-900">{m.classJp} JP</td>
                        <td className="p-3 text-left text-slate-600">{m.defaultNote}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold text-center">
                      <td colSpan={2} className="p-3 text-left">JUMLAH TOTAL SEMESTER</td>
                      <td className="p-3">{(selectedSemesterTab === 'ganjil' ? ganjilStats : genapStats).totalCalendarWeeks} Pekan</td>
                      <td className="p-3 text-emerald-900 font-black">{(selectedSemesterTab === 'ganjil' ? ganjilStats : genapStats).totalEffectiveWeeks} Pekan</td>
                      <td className="p-3 text-blue-900 font-black">{(selectedSemesterTab === 'ganjil' ? ganjilStats : genapStats).g1DaysTotal} Hari ({(selectedSemesterTab === 'ganjil' ? ganjilStats : genapStats).g1TotalJp} JP)</td>
                      {teacherMode === 'double' && (
                        <td className="p-3 text-purple-900 font-black">{(selectedSemesterTab === 'ganjil' ? ganjilStats : genapStats).g2DaysTotal} Hari ({(selectedSemesterTab === 'ganjil' ? ganjilStats : genapStats).g2TotalJp} JP)</td>
                      )}
                      <td className="p-3 font-black text-slate-950">{(selectedSemesterTab === 'ganjil' ? ganjilStats : genapStats).totalClassJp} JP</td>
                      <td className="p-3 text-left text-blue-950 font-bold">Total Pertemuan: {(selectedSemesterTab === 'ganjil' ? ganjilStats : genapStats).totalKbmDaysClass} Hari</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: HOLIDAY DATABASE & REKAP TAHUN */}
      {selectedSemesterTab === 'rekap_tahun' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-600" />
                  Daftar Kalender Libur Nasional & Keagamaan Resmi
                </h3>
                <p className="text-xs text-slate-500">
                  Daftar acuan libur resmi keagamaan dan nasional untuk Tahun Ajaran {selectedYearLabel}.
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full border border-rose-200">
                {holidays.length} Hari Libur Terdata
              </span>
            </div>

            {/* Holiday Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">No</th>
                    <th className="px-3 py-2">Nama Hari Besar / Libur</th>
                    <th className="px-3 py-2">Tanggal</th>
                    <th className="px-3 py-2">Semester</th>
                    <th className="px-3 py-2">Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {holidays.map((h, idx) => (
                    <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 font-bold text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-2 font-bold text-slate-900">{h.name}</td>
                      <td className="px-3 py-2 font-mono">{h.dateStr}</td>
                      <td className="px-3 py-2 capitalize font-semibold">{h.semester} ({h.monthName})</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          h.category === 'keagamaan' ? 'bg-amber-100 text-amber-800' :
                          h.category === 'nasional' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {h.category === 'keagamaan' ? 'Keagamaan' : h.category === 'nasional' ? 'Nasional' : 'Cuti Bersama'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE DOCUMENT CANVAS */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6" id="rme-print-area">
        {/* Kop Sekolah */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">{school.name}</h2>
          <p className="text-xs text-slate-600 font-medium">{school.address || 'Alamat Sekolah, Kabupaten / Kota'}</p>
          <div className="pt-2 text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            RINCIAN MINGGU EFEKTIF (RME) & JADWAL BEBAN MENGAJAR
          </div>
          <div className="text-xs font-bold text-slate-700">
            TAHUN AJARAN {selectedYearLabel}
          </div>
        </div>

        {/* Identity */}
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-800">
          <div className="space-y-1">
            <div className="flex"><span className="w-32">Mata Pelajaran</span><span>: {subjectName}</span></div>
            <div className="flex"><span className="w-32">Kelas / Tingkat</span><span>: {classGrade}</span></div>
            <div className="flex"><span className="w-32">Mode Pengajar</span><span>: {teacherMode === 'double' ? '2 Guru (Team Teaching)' : '1 Guru (Reguler)'}</span></div>
          </div>
          <div className="space-y-1">
            <div className="flex"><span className="w-32">Guru 1</span><span>: {teacher1Name} ({teacher1Days.join(', ')})</span></div>
            {teacherMode === 'double' && (
              <div className="flex"><span className="w-32">Guru 2</span><span>: {teacher2Name} ({teacher2Days.join(', ')})</span></div>
            )}
            <div className="flex"><span className="w-32">Total Beban Kelas</span><span>: {yearStats.totalClassJpYear} JP ({yearStats.kbmDaysClassYear} Pertemuan)</span></div>
          </div>
        </div>

        {/* Table Print Ganjil */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-slate-900 uppercase">I. SEMESTER GANJIL</h4>
          <table className="w-full text-xs text-left border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold text-center border-b border-slate-400">
                <th className="border border-slate-400 p-1.5 w-10">No</th>
                <th className="border border-slate-400 p-1.5">Bulan</th>
                <th className="border border-slate-400 p-1.5">Mgg Kalender</th>
                <th className="border border-slate-400 p-1.5">Mgg Efektif</th>
                <th className="border border-slate-400 p-1.5">Pertemuan Guru 1</th>
                {teacherMode === 'double' && <th className="border border-slate-400 p-1.5">Pertemuan Guru 2</th>}
                <th className="border border-slate-400 p-1.5">Total JP Kelas</th>
              </tr>
            </thead>
            <tbody>
              {ganjilStats.monthBreakdowns.map((m, idx) => (
                <tr key={m.name} className="text-center">
                  <td className="border border-slate-400 p-1.5">{idx + 1}</td>
                  <td className="border border-slate-400 p-1.5 font-bold text-left">{m.name}</td>
                  <td className="border border-slate-400 p-1.5">{m.weeksCount}</td>
                  <td className="border border-slate-400 p-1.5 font-bold text-emerald-800">{m.effWeeks}</td>
                  <td className="border border-slate-400 p-1.5">{m.mG1} Hari ({m.g1Jp} JP)</td>
                  {teacherMode === 'double' && <td className="border border-slate-400 p-1.5">{m.mG2} Hari ({m.g2Jp} JP)</td>}
                  <td className="border border-slate-400 p-1.5 font-bold">{m.classJp} JP</td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold text-center">
                <td colSpan={2} className="border border-slate-400 p-1.5 text-left">JUMLAH GANJIL</td>
                <td className="border border-slate-400 p-1.5">{ganjilStats.totalCalendarWeeks}</td>
                <td className="border border-slate-400 p-1.5 text-emerald-900 font-black">{ganjilStats.totalEffectiveWeeks}</td>
                <td className="border border-slate-400 p-1.5">{ganjilStats.g1DaysTotal} Hari ({ganjilStats.g1TotalJp} JP)</td>
                {teacherMode === 'double' && <td className="border border-slate-400 p-1.5">{ganjilStats.g2DaysTotal} Hari ({ganjilStats.g2TotalJp} JP)</td>}
                <td className="border border-slate-400 p-1.5 font-black">{ganjilStats.totalClassJp} JP</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table Print Genap */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-slate-900 uppercase">II. SEMESTER GENAP</h4>
          <table className="w-full text-xs text-left border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold text-center border-b border-slate-400">
                <th className="border border-slate-400 p-1.5 w-10">No</th>
                <th className="border border-slate-400 p-1.5">Bulan</th>
                <th className="border border-slate-400 p-1.5">Mgg Kalender</th>
                <th className="border border-slate-400 p-1.5">Mgg Efektif</th>
                <th className="border border-slate-400 p-1.5">Pertemuan Guru 1</th>
                {teacherMode === 'double' && <th className="border border-slate-400 p-1.5">Pertemuan Guru 2</th>}
                <th className="border border-slate-400 p-1.5">Total JP Kelas</th>
              </tr>
            </thead>
            <tbody>
              {genapStats.monthBreakdowns.map((m, idx) => (
                <tr key={m.name} className="text-center">
                  <td className="border border-slate-400 p-1.5">{idx + 1}</td>
                  <td className="border border-slate-400 p-1.5 font-bold text-left">{m.name}</td>
                  <td className="border border-slate-400 p-1.5">{m.weeksCount}</td>
                  <td className="border border-slate-400 p-1.5 font-bold text-emerald-800">{m.effWeeks}</td>
                  <td className="border border-slate-400 p-1.5">{m.mG1} Hari ({m.g1Jp} JP)</td>
                  {teacherMode === 'double' && <td className="border border-slate-400 p-1.5">{m.mG2} Hari ({m.g2Jp} JP)</td>}
                  <td className="border border-slate-400 p-1.5 font-bold">{m.classJp} JP</td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold text-center">
                <td colSpan={2} className="border border-slate-400 p-1.5 text-left">JUMLAH GENAP</td>
                <td className="border border-slate-400 p-1.5">{genapStats.totalCalendarWeeks}</td>
                <td className="border border-slate-400 p-1.5 text-emerald-900 font-black">{genapStats.totalEffectiveWeeks}</td>
                <td className="border border-slate-400 p-1.5">{genapStats.g1DaysTotal} Hari ({genapStats.g1TotalJp} JP)</td>
                {teacherMode === 'double' && <td className="border border-slate-400 p-1.5">{genapStats.g2DaysTotal} Hari ({genapStats.g2TotalJp} JP)</td>}
                <td className="border border-slate-400 p-1.5 font-black">{genapStats.totalClassJp} JP</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature Block */}
        <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-slate-900">
          <div className="text-center space-y-12">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala {school.name}</p>
            </div>
            <div>
              <p className="font-bold underline">{school.headmasterName || '...........................................'}</p>
              <p>NIP. {school.headmasterNip || '...........................................'}</p>
            </div>
          </div>

          <div className="text-center space-y-12">
            <div>
              <p>Ditetapkan di Sekolah,</p>
              <p className="font-bold">Guru Mata Pelajaran</p>
            </div>
            <div>
              <p className="font-bold underline">{teacher1Name}</p>
              <p>NIP. {teacher.nip || '...........................................'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
