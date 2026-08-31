import React, { useState, useEffect } from 'react';
import { Flag, Calendar, Sparkles, RefreshCw, CheckCircle2, AlertCircle, X, ShieldCheck, Download } from 'lucide-react';
import type { WeekStatus } from './types';
import {
  NationalHoliday,
  OFFICIAL_INDONESIA_HOLIDAYS,
  getHolidaysForAcademicYear,
  fetchLiveIndonesianHolidays,
  convertHolidaysToWeekTags,
} from '../../../lib/nationalHolidays';

interface NationalHolidaysSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicYear: string; // e.g. "2024/2025" or "2025/2026"
  currentGanjilTags: Record<string, WeekStatus>;
  currentGenapTags: Record<string, WeekStatus>;
  onApplyNationalHolidays: (
    newGanjilTags: Record<string, WeekStatus>,
    newGenapTags: Record<string, WeekStatus>,
    countApplied: number
  ) => void;
}

export const NationalHolidaysSyncModal: React.FC<NationalHolidaysSyncModalProps> = ({
  isOpen,
  onClose,
  academicYear,
  currentGanjilTags,
  currentGenapTags,
  onApplyNationalHolidays,
}) => {
  const [selectedYearOption, setSelectedYearOption] = useState<string>(academicYear || '2025/2026');
  const [holidays, setHolidays] = useState<NationalHoliday[]>([]);
  const [selectedHolidayDates, setSelectedHolidayDates] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveApiUsed, setIsLiveApiUsed] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load holidays whenever selectedYearOption changes
  useEffect(() => {
    if (isOpen) {
      loadHolidaysForYear(selectedYearOption);
    }
  }, [isOpen, selectedYearOption]);

  const loadHolidaysForYear = async (yearLabel: string) => {
    setIsLoading(true);
    setStatusMessage(null);

    // Initial load from built-in SKB 3 Menteri dataset
    const baseHolidays = getHolidaysForAcademicYear(yearLabel);
    setHolidays(baseHolidays);

    // Select all by default
    const allDates = new Set(baseHolidays.map((h) => h.date));
    setSelectedHolidayDates(allDates);

    // Parse years to attempt live API fetch
    const match = yearLabel.match(/(\d{4})\/(\d{4})/);
    const startYr = match ? parseInt(match[1], 10) : 2025;
    const endYr = match ? parseInt(match[2], 10) : 2026;

    try {
      const [liveGanjil, liveGenap] = await Promise.all([
        fetchLiveIndonesianHolidays(startYr),
        fetchLiveIndonesianHolidays(endYr),
      ]);

      const filteredGanjil = liveGanjil.filter((h) => h.semester === 'ganjil');
      const filteredGenap = liveGenap.filter((h) => h.semester === 'genap');
      const mergedLive = [...filteredGanjil, ...filteredGenap];

      if (mergedLive.length > 0) {
        setHolidays(mergedLive);
        setSelectedHolidayDates(new Set(mergedLive.map((h) => h.date)));
        setIsLiveApiUsed(true);
        setStatusMessage(`Data Hari Libur berhasil tersinkronisasi langsung via API Kalender Indonesia / SKB 3 Menteri (${mergedLive.length} Hari Libur).`);
      } else {
        setIsLiveApiUsed(false);
        setStatusMessage(`Memakai Data Standar Resmi SKB 3 Menteri (${baseHolidays.length} Hari Libur).`);
      }
    } catch {
      setIsLiveApiUsed(false);
      setStatusMessage(`Memakai Data Standar Resmi SKB 3 Menteri (${baseHolidays.length} Hari Libur).`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const toggleSelectHoliday = (dateStr: string) => {
    const next = new Set(selectedHolidayDates);
    if (next.has(dateStr)) {
      next.delete(dateStr);
    } else {
      next.add(dateStr);
    }
    setSelectedHolidayDates(next);
  };

  const handleSelectAll = () => {
    setSelectedHolidayDates(new Set(holidays.map((h) => h.date)));
  };

  const handleDeselectAll = () => {
    setSelectedHolidayDates(new Set());
  };

  const handleApply = () => {
    const activeHolidays = holidays.filter((h) => selectedHolidayDates.has(h.date));
    const { ganjilTags, genapTags } = convertHolidaysToWeekTags(activeHolidays);

    // Merge with current tags so we preserve non-conflicting STS/SAS/MPLS/Rapor tags
    const mergedGanjil = { ...currentGanjilTags };
    Object.entries(ganjilTags).forEach(([key, tag]) => {
      // Apply libur tag
      if (!mergedGanjil[key] || mergedGanjil[key] === 'kbm') {
        mergedGanjil[key] = tag;
      } else {
        // Tag exists (e.g. sts/sas/rapor), overwrite to libur if national holiday takes priority
        mergedGanjil[key] = tag;
      }
    });

    const mergedGenap = { ...currentGenapTags };
    Object.entries(genapTags).forEach(([key, tag]) => {
      if (!mergedGenap[key] || mergedGenap[key] === 'kbm') {
        mergedGenap[key] = tag;
      } else {
        mergedGenap[key] = tag;
      }
    });

    onApplyNationalHolidays(mergedGanjil, mergedGenap, activeHolidays.length);
    onClose();
  };

  const ganjilHolidays = holidays.filter((h) => h.semester === 'ganjil');
  const genapHolidays = holidays.filter((h) => h.semester === 'genap');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-rose-800 to-red-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
              <Flag className="w-6 h-6 text-red-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight">Sync & Tarik Hari Libur Nasional</h3>
                <span className="px-2 py-0.5 bg-red-500/30 border border-red-300/40 rounded-full text-[10px] font-bold uppercase tracking-wider text-red-100 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-red-200" /> SKB 3 Menteri / Kalender Nasional
                </span>
              </div>
              <p className="text-xs text-red-100 mt-0.5">
                Integrasi otomatis tanggal merah & cuti bersama resmi Republik Indonesia ke Kalender Pendidikan (Kaldik) & Prosem.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-red-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Options */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600" />
            <span className="font-bold text-slate-700">Tahun Ajaran Target:</span>
            <select
              value={selectedYearOption}
              onChange={(e) => setSelectedYearOption(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-red-500"
            >
              <option value="2024/2025">Tahun Ajaran 2024/2025</option>
              <option value="2025/2026">Tahun Ajaran 2025/2026</option>
              <option value="2026/2027">Tahun Ajaran 2026/2027</option>
            </select>
            <button
              onClick={() => loadHolidaysForYear(selectedYearOption)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Menarik Data...' : 'Refresh API Kalender'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-semibold transition-colors"
            >
              Pilih Semua
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-semibold transition-colors"
            >
              Kosongkan
            </button>
            <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
              {selectedHolidayDates.size} Terpilih
            </span>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {statusMessage}
            </span>
            {isLiveApiUsed && (
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                Live Online Feed
              </span>
            )}
          </div>
        )}

        {/* Holidays Grid Content */}
        <div className="p-5 max-h-[55vh] overflow-y-auto space-y-6">
          {/* Semester Ganjil Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                Semester Ganjil (Juli - Desember)
              </h4>
              <span className="text-xs text-slate-500 font-bold">
                {ganjilHolidays.length} Hari Libur Resmi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {ganjilHolidays.map((item) => {
                const isSelected = selectedHolidayDates.has(item.date);
                const formattedDate = new Date(item.date).toLocaleDateString('id-ID', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={item.date + item.title}
                    onClick={() => toggleSelectHoliday(item.date)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-red-50/80 border-red-300 text-slate-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-red-600 rounded-xs focus:ring-red-500 cursor-pointer"
                        />
                        <span className="font-bold text-slate-900">{formattedDate}</span>
                        {item.type === 'cuti_bersama' && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-bold">
                            Cuti Bersama
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-slate-800 pl-6">{item.title}</p>
                      <div className="pl-6 text-[10px] text-slate-500">
                        Mapped ke: <strong className="text-slate-700">{item.monthName}</strong> (Minggu Ke-{item.date ? Math.min(5, Math.floor(new Date(item.date).getDate() / 7) + 1) : 1})
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Semester Genap Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                Semester Genap (Januari - Juni)
              </h4>
              <span className="text-xs text-slate-500 font-bold">
                {genapHolidays.length} Hari Libur Resmi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {genapHolidays.map((item) => {
                const isSelected = selectedHolidayDates.has(item.date);
                const formattedDate = new Date(item.date).toLocaleDateString('id-ID', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={item.date + item.title}
                    onClick={() => toggleSelectHoliday(item.date)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 text-slate-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded-xs focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="font-bold text-slate-900">{formattedDate}</span>
                        {item.type === 'cuti_bersama' && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-bold">
                            Cuti Bersama
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-slate-800 pl-6">{item.title}</p>
                      <div className="pl-6 text-[10px] text-slate-500">
                        Mapped ke: <strong className="text-slate-700">{item.monthName}</strong> (Minggu Ke-{item.date ? Math.min(5, Math.floor(new Date(item.date).getDate() / 7) + 1) : 1})
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600 space-y-0.5">
            <span className="font-bold text-slate-800">Catatan Pemetaan:</span>
            <p className="text-[11px] text-slate-500">
              Hari libur nasional yang diterapkan akan otomatis menandai pekan bersangkutan sebagai status <span className="font-bold text-red-600">LIBUR</span> di Kaldik & Program Semester (Prosem).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleApply}
              disabled={selectedHolidayDates.size === 0}
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Terapkan {selectedHolidayDates.size} Hari Libur ke Kaldik</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
