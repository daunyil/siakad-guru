import React from 'react';
import { Calendar, Sparkles, Flag } from 'lucide-react';
import type { WeekStatus } from './types';
import { REGIONAL_KALDIK_PRESETS } from './kaldikPresets';

interface KaldikControlBarProps {
  selectedSemester: 'ganjil' | 'genap';
  setSelectedSemester: (sem: 'ganjil' | 'genap') => void;
  selectedRegionId: string;
  onSelectRegionPreset: (regionId: string) => void;
  onOpenImportModal: () => void;
  onOpenNationalHolidaysModal?: () => void;
}

export const KaldikControlBar: React.FC<KaldikControlBarProps> = ({
  selectedSemester,
  setSelectedSemester,
  selectedRegionId,
  onSelectRegionPreset,
  onOpenImportModal,
  onOpenNationalHolidaysModal,
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 no-print">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Acuan Kalender Pendidikan (Kaldik Regional / Provinsi)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Pilih Semester:</span>
          <button
            onClick={() => setSelectedSemester('ganjil')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedSemester === 'ganjil'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-300'
            }`}
          >
            Semester Ganjil (Juli - Des)
          </button>
          <button
            onClick={() => setSelectedSemester('genap')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedSemester === 'genap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-300'
            }`}
          >
            Semester Genap (Jan - Jun)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
        <div className="md:col-span-7 space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="block font-bold text-slate-700">
              Acuan Kalender Pendidikan (Kaldik):
            </label>
            <div className="flex items-center gap-1.5">
              {onOpenNationalHolidaysModal && (
                <button
                  type="button"
                  onClick={onOpenNationalHolidaysModal}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                  title="Integrasi Hari Libur Nasional & Cuti Bersama SKB 3 Menteri / Google Calendar"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Sync Libur Nasional</span>
                </button>
              )}
              <button
                type="button"
                onClick={onOpenImportModal}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Impor Kaldik (Prompt / Excel)</span>
              </button>
            </div>
          </div>
          <select
            value={selectedRegionId}
            onChange={(e) => onSelectRegionPreset(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
          >
            {REGIONAL_KALDIK_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-500 italic block">
            {REGIONAL_KALDIK_PRESETS.find((r) => r.id === selectedRegionId)?.description}
          </span>
        </div>

        <div className="md:col-span-5 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
          <span className="font-bold text-[11px] text-slate-700 block">
            Legenda Status Pekan (Klik header minggu tabel untuk ubah status):
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded">KBM (Efektif)</span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-300 rounded">
              MPLS
            </span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded">
              STS (PTS)
            </span>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-800 border border-orange-300 rounded">
              SAS (PAS)
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
              RAPOR
            </span>
            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded">
              LIBUR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

