export interface NationalHoliday {
  date: string; // YYYY-MM-DD
  title: string;
  type: 'national' | 'cuti_bersama';
  monthName: string; // "Juli", "Agustus", etc.
  semester: 'ganjil' | 'genap';
  year: number;
  dayName?: string;
}

// Built-in Official Dataset (SKB 3 Menteri) for Academic Years 2024/2025, 2025/2026, 2026/2027
export const OFFICIAL_INDONESIA_HOLIDAYS: NationalHoliday[] = [
  // ================= 2024 =================
  // Semester Ganjil 2024/2025 (Juli - Desember 2024)
  { date: '2024-07-07', title: 'Tahun Baru Islam 1446 Hijriah', type: 'national', monthName: 'Juli', semester: 'ganjil', year: 2024 },
  { date: '2024-08-17', title: 'Proklamasi Kemerdekaan Republik Indonesia Ke-79', type: 'national', monthName: 'Agustus', semester: 'ganjil', year: 2024 },
  { date: '2024-09-16', title: 'Maulid Nabi Muhammad SAW', type: 'national', monthName: 'September', semester: 'ganjil', year: 2024 },
  { date: '2024-12-25', title: 'Hari Raya Natal', type: 'national', monthName: 'Desember', semester: 'ganjil', year: 2024 },
  { date: '2024-12-26', title: 'Cuti Bersama Hari Raya Natal', type: 'cuti_bersama', monthName: 'Desember', semester: 'ganjil', year: 2024 },

  // ================= 2025 =================
  // Semester Genap 2024/2025 (Januari - Juni 2025)
  { date: '2025-01-01', title: 'Tahun Baru 2025 Masehi', type: 'national', monthName: 'Januari', semester: 'genap', year: 2025 },
  { date: '2025-01-27', title: 'Isra Mikraj Nabi Muhammad SAW', type: 'national', monthName: 'Januari', semester: 'genap', year: 2025 },
  { date: '2025-01-28', title: 'Cuti Bersama Tahun Baru Imlek', type: 'cuti_bersama', monthName: 'Januari', semester: 'genap', year: 2025 },
  { date: '2025-01-29', title: 'Tahun Baru Imlek 2576 Kongzili', type: 'national', monthName: 'Januari', semester: 'genap', year: 2025 },
  { date: '2025-03-01', title: 'Perkiraan Libur Awal Bulan Ramadan 1446 H', type: 'cuti_bersama', monthName: 'Maret', semester: 'genap', year: 2025 },
  { date: '2025-03-24', title: 'Libur Sebelum Hari Raya Idul Fitri 1446 H (Minggu 1 Lebaran)', type: 'cuti_bersama', monthName: 'Maret', semester: 'genap', year: 2025 },
  { date: '2025-03-28', title: 'Cuti Bersama Hari Raya Nyepi', type: 'cuti_bersama', monthName: 'Maret', semester: 'genap', year: 2025 },
  { date: '2025-03-29', title: 'Hari Suci Nyepi Tahun Baru Saka 1947', type: 'national', monthName: 'Maret', semester: 'genap', year: 2025 },
  { date: '2025-03-31', title: 'Hari Raya Idul Fitri 1446 Hijriah (Hari Pertama)', type: 'national', monthName: 'Maret', semester: 'genap', year: 2025 },
  { date: '2025-04-01', title: 'Hari Raya Idul Fitri 1446 Hijriah (Hari Kedua)', type: 'national', monthName: 'April', semester: 'genap', year: 2025 },
  { date: '2025-04-02', title: 'Cuti Bersama Idul Fitri 1446 H', type: 'cuti_bersama', monthName: 'April', semester: 'genap', year: 2025 },
  { date: '2025-04-03', title: 'Cuti Bersama Idul Fitri 1446 H', type: 'cuti_bersama', monthName: 'April', semester: 'genap', year: 2025 },
  { date: '2025-04-04', title: 'Cuti Bersama Idul Fitri 1446 H', type: 'cuti_bersama', monthName: 'April', semester: 'genap', year: 2025 },
  { date: '2025-04-07', title: 'Libur Sesudah Hari Raya Idul Fitri 1446 H (Minggu 2 Lebaran)', type: 'cuti_bersama', monthName: 'April', semester: 'genap', year: 2025 },
  { date: '2025-04-11', title: 'Akhir Libur Hari Raya Idul Fitri 1446 H (Kaldik Sekolah)', type: 'cuti_bersama', monthName: 'April', semester: 'genap', year: 2025 },
  { date: '2025-04-18', title: 'Wafat Yesus Kristus', type: 'national', monthName: 'April', semester: 'genap', year: 2025 },
  { date: '2025-04-20', title: 'Hari Paskah', type: 'national', monthName: 'April', semester: 'genap', year: 2025 },
  { date: '2025-05-01', title: 'Hari Buruh Internasional', type: 'national', monthName: 'Mei', semester: 'genap', year: 2025 },
  { date: '2025-05-12', title: 'Hari Raya Waisak 2569 BE', type: 'national', monthName: 'Mei', semester: 'genap', year: 2025 },
  { date: '2025-05-13', title: 'Cuti Bersama Hari Raya Waisak', type: 'cuti_bersama', monthName: 'Mei', semester: 'genap', year: 2025 },
  { date: '2025-05-29', title: 'Kenaikan Yesus Kristus', type: 'national', monthName: 'Mei', semester: 'genap', year: 2025 },
  { date: '2025-05-30', title: 'Cuti Bersama Kenaikan Yesus Kristus', type: 'cuti_bersama', monthName: 'Mei', semester: 'genap', year: 2025 },
  { date: '2025-06-01', title: 'Hari Lahir Pancasila', type: 'national', monthName: 'Juni', semester: 'genap', year: 2025 },
  { date: '2025-06-06', title: 'Hari Raya Idul Adha 1446 Hijriah', type: 'national', monthName: 'Juni', semester: 'genap', year: 2025 },
  { date: '2025-06-09', title: 'Cuti Bersama Idul Adha 1446 H', type: 'cuti_bersama', monthName: 'Juni', semester: 'genap', year: 2025 },
  { date: '2025-06-27', title: 'Tahun Baru Islam 1447 Hijriah', type: 'national', monthName: 'Juni', semester: 'genap', year: 2025 },

  // Semester Ganjil 2025/2026 (Juli - Desember 2025)
  { date: '2025-08-17', title: 'Proklamasi Kemerdekaan RI Ke-80', type: 'national', monthName: 'Agustus', semester: 'ganjil', year: 2025 },
  { date: '2025-09-05', title: 'Maulid Nabi Muhammad SAW', type: 'national', monthName: 'September', semester: 'ganjil', year: 2025 },
  { date: '2025-12-25', title: 'Hari Raya Natal', type: 'national', monthName: 'Desember', semester: 'ganjil', year: 2025 },
  { date: '2025-12-26', title: 'Cuti Bersama Hari Raya Natal', type: 'cuti_bersama', monthName: 'Desember', semester: 'ganjil', year: 2025 },

  // ================= 2026 =================
  // Semester Genap 2025/2026 (Januari - Juni 2026)
  { date: '2026-01-01', title: 'Tahun Baru 2026 Masehi', type: 'national', monthName: 'Januari', semester: 'genap', year: 2026 },
  { date: '2026-01-16', title: 'Isra Mikraj Nabi Muhammad SAW', type: 'national', monthName: 'Januari', semester: 'genap', year: 2026 },
  { date: '2026-02-17', title: 'Tahun Baru Imlek 2577 Kongzili', type: 'national', monthName: 'Februari', semester: 'genap', year: 2026 },
  { date: '2026-02-18', title: 'Perkiraan Libur Awal Ramadan 1447 H', type: 'cuti_bersama', monthName: 'Februari', semester: 'genap', year: 2026 },
  { date: '2026-03-16', title: 'Libur Sebelum Hari Raya Idul Fitri 1447 H (Minggu 1 Lebaran)', type: 'cuti_bersama', monthName: 'Maret', semester: 'genap', year: 2026 },
  { date: '2026-03-19', title: 'Hari Suci Nyepi Tahun Baru Saka 1948', type: 'national', monthName: 'Maret', semester: 'genap', year: 2026 },
  { date: '2026-03-20', title: 'Hari Raya Idul Fitri 1447 Hijriah (Hari Pertama)', type: 'national', monthName: 'Maret', semester: 'genap', year: 2026 },
  { date: '2026-03-21', title: 'Hari Raya Idul Fitri 1447 Hijriah (Hari Kedua)', type: 'national', monthName: 'Maret', semester: 'genap', year: 2026 },
  { date: '2026-03-23', title: 'Cuti Bersama Idul Fitri 1447 H', type: 'cuti_bersama', monthName: 'Maret', semester: 'genap', year: 2026 },
  { date: '2026-03-24', title: 'Cuti Bersama Idul Fitri 1447 H', type: 'cuti_bersama', monthName: 'Maret', semester: 'genap', year: 2026 },
  { date: '2026-03-27', title: 'Libur Sesudah Hari Raya Idul Fitri 1447 H (Minggu 2 Lebaran)', type: 'cuti_bersama', monthName: 'Maret', semester: 'genap', year: 2026 },
  { date: '2026-04-03', title: 'Wafat Yesus Kristus', type: 'national', monthName: 'April', semester: 'genap', year: 2026 },
  { date: '2026-05-01', title: 'Hari Buruh Internasional', type: 'national', monthName: 'Mei', semester: 'genap', year: 2026 },
  { date: '2026-05-14', title: 'Kenaikan Yesus Kristus', type: 'national', monthName: 'Mei', semester: 'genap', year: 2026 },
  { date: '2026-05-31', title: 'Hari Raya Waisak 2570 BE', type: 'national', monthName: 'Mei', semester: 'genap', year: 2026 },
  { date: '2026-06-01', title: 'Hari Lahir Pancasila', type: 'national', monthName: 'Juni', semester: 'genap', year: 2026 },
  { date: '2026-06-16', title: 'Tahun Baru Islam 1448 Hijriah', type: 'national', monthName: 'Juni', semester: 'genap', year: 2026 },

  // Semester Ganjil 2026/2027 (Juli - Desember 2026)
  { date: '2026-08-17', title: 'Proklamasi Kemerdekaan RI Ke-81', type: 'national', monthName: 'Agustus', semester: 'ganjil', year: 2026 },
  { date: '2026-08-25', title: 'Maulid Nabi Muhammad SAW', type: 'national', monthName: 'Agustus', semester: 'ganjil', year: 2026 },
  { date: '2026-12-25', title: 'Hari Raya Natal', type: 'national', monthName: 'Desember', semester: 'ganjil', year: 2026 },
  { date: '2026-12-26', title: 'Cuti Bersama Hari Raya Natal', type: 'cuti_bersama', monthName: 'Desember', semester: 'ganjil', year: 2026 },
];

const MONTH_NAMES_INDONESIA = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Helper to calculate week index (0 to 4) of a date in a given month
 */
export function getWeekIndexInMonth(dateStr: string): number {
  const d = new Date(dateStr);
  const dayOfMonth = d.getDate();
  // 1-7 -> 0, 8-14 -> 1, 15-21 -> 2, 22-28 -> 3, 29+ -> 4
  if (dayOfMonth <= 7) return 0;
  if (dayOfMonth <= 14) return 1;
  if (dayOfMonth <= 21) return 2;
  if (dayOfMonth <= 28) return 3;
  return 4;
}

/**
 * Fetch live public holidays from API endpoint with instant local fallback
 */
export async function fetchLiveIndonesianHolidays(year: number): Promise<NationalHoliday[]> {
  try {
    const response = await fetch(`https://tanggalmerah.upset.dev/api/holidays?year=${year}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (data && Array.isArray(data.data) && data.data.length > 0) {
      const fetched: NationalHoliday[] = data.data.map((item: any) => {
        const dateObj = new Date(item.date);
        const monthIdx = dateObj.getMonth();
        const mName = MONTH_NAMES_INDONESIA[monthIdx];
        const sem: 'ganjil' | 'genap' = monthIdx >= 6 ? 'ganjil' : 'genap';

        return {
          date: item.date,
          title: item.name || item.title || 'Hari Libur Nasional',
          type: item.is_cuti ? 'cuti_bersama' : 'national',
          monthName: mName,
          semester: sem,
          year: year,
        };
      });

      return fetched;
    }
  } catch (err) {
    console.warn('Live holiday fetch fallback to built-in dataset:', err);
  }

  // Fallback to built-in dataset
  return OFFICIAL_INDONESIA_HOLIDAYS.filter(h => h.year === year);
}

/**
 * Get all national holidays for a given Academic Year (e.g. "2024/2025" or "2025/2026")
 */
export function getHolidaysForAcademicYear(academicYearLabel: string): NationalHoliday[] {
  // Parse year e.g. "2024/2025" -> startYear 2024, endYear 2025
  let startYear = 2024;
  let endYear = 2025;

  const match = academicYearLabel.match(/(\d{4})\/(\d{4})/);
  if (match) {
    startYear = parseInt(match[1], 10);
    endYear = parseInt(match[2], 10);
  }

  // Ganjil: July - December of startYear
  const ganjilHolidays = OFFICIAL_INDONESIA_HOLIDAYS.filter(
    h => h.year === startYear && h.semester === 'ganjil'
  );

  // Genap: January - June of endYear
  const genapHolidays = OFFICIAL_INDONESIA_HOLIDAYS.filter(
    h => h.year === endYear && h.semester === 'genap'
  );

  return [...ganjilHolidays, ...genapHolidays];
}

/**
 * Maps a list of national holidays into Prosem week status tags (Record<"Bulan-MingguIdx", "libur">)
 */
export function convertHolidaysToWeekTags(holidays: NationalHoliday[]): {
  ganjilTags: Record<string, 'libur'>;
  genapTags: Record<string, 'libur'>;
  holidayDetailsByWeek: Record<string, string[]>;
} {
  const ganjilTags: Record<string, 'libur'> = {};
  const genapTags: Record<string, 'libur'> = {};
  const holidayDetailsByWeek: Record<string, string[]> = {};

  holidays.forEach((h) => {
    const weekIdx = getWeekIndexInMonth(h.date);
    const weekKey = `${h.monthName}-${weekIdx}`;

    if (h.semester === 'ganjil') {
      ganjilTags[weekKey] = 'libur';
    } else {
      genapTags[weekKey] = 'libur';
    }

    if (!holidayDetailsByWeek[weekKey]) {
      holidayDetailsByWeek[weekKey] = [];
    }
    const formattedDate = new Date(h.date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    holidayDetailsByWeek[weekKey].push(`${formattedDate}: ${h.title}`);
  });

  return { ganjilTags, genapTags, holidayDetailsByWeek };
}
