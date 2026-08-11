import { initialCpSubjects } from '../data/cpMasterData';
import { REGIONAL_KALDIK_PRESETS } from '../components/administrasi/prota-prosem/kaldikPresets';
import type { WeekStatus } from '../components/administrasi/prota-prosem/types';

export interface ScheduledMeeting {
  meetingNumber: number;
  dateISO: string; // e.g. "2025-07-17"
  dateFormatted: string; // e.g. "Kamis, 17 Juli 2025"
  monthName: string; // e.g. "Juli"
  weekIndexInMonth: number; // 0..4
  status: WeekStatus; // 'kbm' | 'mpls' | 'sts' | 'sas' | 'rapor' | 'libur'
  tpCode: string;
  tpTitle: string;
  elementName: string;
  jp: number;
  jpIntra: number;
  jpKo: number;
}

// Months & number of weeks in Indonesian Academic Calendar
export const MONTHS_GANJIL = [
  { name: 'Juli', monthNum: 7, yearOffset: 0, weeks: 4 },
  { name: 'Agustus', monthNum: 8, yearOffset: 0, weeks: 5 },
  { name: 'September', monthNum: 9, yearOffset: 0, weeks: 4 },
  { name: 'Oktober', monthNum: 10, yearOffset: 0, weeks: 4 },
  { name: 'November', monthNum: 11, yearOffset: 0, weeks: 5 },
  { name: 'Desember', monthNum: 12, yearOffset: 0, weeks: 4 },
];

export const MONTHS_GENAP = [
  { name: 'Januari', monthNum: 1, yearOffset: 1, weeks: 5 },
  { name: 'Februari', monthNum: 2, yearOffset: 1, weeks: 4 },
  { name: 'Maret', monthNum: 3, yearOffset: 1, weeks: 4 },
  { name: 'April', monthNum: 4, yearOffset: 1, weeks: 4 },
  { name: 'Mei', monthNum: 5, yearOffset: 1, weeks: 5 },
  { name: 'Juni', monthNum: 6, yearOffset: 1, weeks: 4 },
];

const DAY_MAP: Record<string, number> = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
};

/**
 * Calculates specific calendar date for a week within a month
 */
function getSpecificDateForWeek(
  year: number,
  monthNum: number,
  weekIdx: number,
  dayOfWeekName: string = 'Kamis'
): { dateISO: string; dateFormatted: string } {
  const targetDay = DAY_MAP[dayOfWeekName] ?? 4; // Default Kamis
  
  // Start from day 1 of month
  const firstOfMonth = new Date(year, monthNum - 1, 1);
  const firstDay = firstOfMonth.getDay();

  // Find first occurrence of target day in month
  let dayOffset = (targetDay - firstDay + 7) % 7;
  if (dayOffset === 0) dayOffset = 0;

  // Calculate day for weekIdx (0-indexed week)
  const targetDate = new Date(year, monthNum - 1, 1 + dayOffset + weekIdx * 7);

  // If target date exceeds month, cap it within month
  if (targetDate.getMonth() !== monthNum - 1) {
    targetDate.setDate(targetDate.getDate() - 7);
  }

  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');
  const dateISO = `${yyyy}-${mm}-${dd}`;

  const monthNamesID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const dateFormatted = `${dayOfWeekName}, ${targetDate.getDate()} ${monthNamesID[targetDate.getMonth()]} ${yyyy}`;

  return { dateISO, dateFormatted };
}

/**
 * Generate full schedule of meetings mapped from Prosem & Kaldik
 */
export function generateProsemSchedule(
  yearLabel: string = '2025/2026',
  semester: 1 | 2 = 1,
  subjectId?: string,
  classGrade: 'VII' | 'VIII' | 'IX' = 'VII',
  kaldikTags?: Record<string, WeekStatus>,
  dayOfWeek: string = 'Kamis',
  jpPerWeek: number = 3,
  customJpIntra?: number,
  customJpKo?: number
): ScheduledMeeting[] {
  const baseYear = parseInt(yearLabel.split('/')[0]) || 2025;
  const isGanjil = semester === 1;
  const monthCols = isGanjil ? MONTHS_GANJIL : MONTHS_GENAP;
  const defaultTags = isGanjil
    ? REGIONAL_KALDIK_PRESETS[0].ganjilTags
    : REGIONAL_KALDIK_PRESETS[0].genapTags;
  const activeTags = kaldikTags && Object.keys(kaldikTags).length > 0 ? kaldikTags : defaultTags;

  const jpIntra = customJpIntra !== undefined ? customJpIntra : Math.max(1, jpPerWeek - 1);
  const jpKo = customJpKo !== undefined ? customJpKo : Math.max(0, jpPerWeek - jpIntra);

  // Find subject TPs
  const normalizedSubj = (subjectId || '').toLowerCase();
  const currentSubject =
    initialCpSubjects.find((s) => {
      const sId = s.id.toLowerCase();
      const sName = s.subjectName.toLowerCase();
      return (
        sId === normalizedSubj ||
        sName === normalizedSubj ||
        sName.includes(normalizedSubj) ||
        normalizedSubj.includes(sName.split(' ')[0])
      );
    }) || initialCpSubjects[0];
  const allGradeTps: { code: string; title: string; elementName: string; jp: number; semester?: 1 | 2 }[] = [];

  if (currentSubject) {
    currentSubject.elements.forEach((elem) => {
      elem.tpList.forEach((tp) => {
        if (tp.classGrade === classGrade || !tp.classGrade) {
          allGradeTps.push({
            code: tp.code,
            title: tp.title,
            elementName: elem.name,
            jp: tp.jp || 3,
            semester: tp.semester,
          });
        }
      });
    });
  }

  // Check if any TP has explicit semester tag
  const targetSem = isGanjil ? 1 : 2;
  const hasExplicitSemester = allGradeTps.some((t) => t.semester !== undefined);

  let activeTps: typeof allGradeTps = [];
  if (hasExplicitSemester) {
    activeTps = allGradeTps.filter((t) => t.semester === targetSem || t.semester === undefined);
  } else {
    // Fallback: roughly half for Ganjil / half for Genap
    const halfLength = Math.ceil(allGradeTps.length / 2);
    activeTps = isGanjil ? allGradeTps.slice(0, halfLength) : allGradeTps.slice(halfLength);
  }

  const result: ScheduledMeeting[] = [];
  let meetingCounter = 1;
  let tpIndex = 0;
  let currentTpRemainingJp = activeTps[0]?.jp || jpPerWeek;

  monthCols.forEach((m) => {
    const actualYear = baseYear + m.yearOffset;

    for (let wIdx = 0; wIdx < m.weeks; wIdx++) {
      const tagKey = `${m.name}-${wIdx}`;
      const status: WeekStatus = activeTags[tagKey] || 'kbm';

      const { dateISO, dateFormatted } = getSpecificDateForWeek(
        actualYear,
        m.monthNum,
        wIdx,
        dayOfWeek
      );

      // Current TP info
      const isPastActiveTps = tpIndex >= activeTps.length;
      const currTp = !isPastActiveTps && activeTps[tpIndex]
        ? activeTps[tpIndex]
        : {
            code: 'CADANGAN',
            title: 'Alokasi Cadangan / Jam Cadangan (Ulangan, Remedial & Pengayaan)',
            elementName: 'Jam Cadangan',
            jp: jpPerWeek,
          };

      if (status === 'kbm') {
        result.push({
          meetingNumber: meetingCounter,
          dateISO,
          dateFormatted,
          monthName: m.name,
          weekIndexInMonth: wIdx + 1,
          status: 'kbm',
          tpCode: currTp.code,
          tpTitle: currTp.title,
          elementName: currTp.elementName,
          jp: jpPerWeek,
          jpIntra,
          jpKo,
        });

        meetingCounter++;
        currentTpRemainingJp -= jpPerWeek;

        if (currentTpRemainingJp <= 0) {
          tpIndex++;
          currentTpRemainingJp = activeTps[tpIndex]?.jp || jpPerWeek;
        }
      } else {
        // Non-KBM weeks (e.g. STS, SAS, MPLS, Libur)
        let nonKbmTitle = 'Kegiatan Khusus Sekolah';
        if (status === 'mpls') nonKbmTitle = 'Masa Pengenalan Lingkungan Sekolah (MPLS)';
        else if (status === 'sts') nonKbmTitle = 'Sumatif Tengah Semester (STS)';
        else if (status === 'sas') nonKbmTitle = 'Sumatif Akhir Semester (SAS) / ASAS';
        else if (status === 'rapor') nonKbmTitle = 'Penyerahan Rapor & Evaluasi Semester';
        else if (status === 'libur') nonKbmTitle = 'Libur Semester / Hari Libur Nasional';

        result.push({
          meetingNumber: 0, // Non-KBM
          dateISO,
          dateFormatted,
          monthName: m.name,
          weekIndexInMonth: wIdx + 1,
          status,
          tpCode: status.toUpperCase(),
          tpTitle: nonKbmTitle,
          elementName: 'Kaldik non-KBM',
          jp: 0,
          jpIntra: 0,
          jpKo: 0,
        });
      }
    }
  });

  return result;
}
