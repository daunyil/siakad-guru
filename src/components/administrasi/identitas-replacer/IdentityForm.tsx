import React from 'react';
import {
  CheckCircle2,
  Search,
  Wand2,
  AlertTriangle,
} from 'lucide-react';
import type { TargetIdentityState, OldIdentityState } from './types';

interface IdentityFormProps {
  targetIdentity: TargetIdentityState;
  oldIdentity: OldIdentityState;
  defaultDistrict: string;
  defaultFormattedDate: string;
  enableSmartPatternReplace: boolean;
  highlightReplacements: boolean;
  includeExtraKop: boolean;
  includeExtraSignature: boolean;
  onTargetSchoolChange: (val: string) => void;
  onTargetTeacherChange: (val: string) => void;
  onTargetTeacherNipChange: (val: string) => void;
  onTargetHeadmasterChange: (val: string) => void;
  onTargetHeadmasterNipChange: (val: string) => void;
  onTargetYearChange: (val: string) => void;
  onTargetPlaceChange: (val: string) => void;
  onTargetDateChange: (val: string) => void;
  onTargetDateLocationChange: (val: string) => void;
  onOldSchoolChange: (val: string) => void;
  onOldTeacherChange: (val: string) => void;
  onOldTeacherNipChange: (val: string) => void;
  onOldHeadmasterChange: (val: string) => void;
  onOldHeadmasterNipChange: (val: string) => void;
  onOldYearChange: (val: string) => void;
  onOldPlaceChange: (val: string) => void;
  onOldDateChange: (val: string) => void;
  onOldDateLocationChange: (val: string) => void;
  onAutoDetect: () => void;
  onValidateDefaults: () => void;
  onToggleSmartPattern: (val: boolean) => void;
  onToggleHighlight: (val: boolean) => void;
  onToggleExtraKop: (val: boolean) => void;
  onToggleExtraSignature: (val: boolean) => void;
}

export const IdentityForm: React.FC<IdentityFormProps> = ({
  targetIdentity,
  oldIdentity,
  defaultDistrict,
  defaultFormattedDate,
  enableSmartPatternReplace,
  highlightReplacements,
  includeExtraKop,
  includeExtraSignature,
  onTargetSchoolChange,
  onTargetTeacherChange,
  onTargetTeacherNipChange,
  onTargetHeadmasterChange,
  onTargetHeadmasterNipChange,
  onTargetYearChange,
  onTargetPlaceChange,
  onTargetDateChange,
  onTargetDateLocationChange,
  onOldSchoolChange,
  onOldTeacherChange,
  onOldTeacherNipChange,
  onOldHeadmasterChange,
  onOldHeadmasterNipChange,
  onOldYearChange,
  onOldPlaceChange,
  onOldDateChange,
  onOldDateLocationChange,
  onAutoDetect,
  onValidateDefaults,
  onToggleSmartPattern,
  onToggleHighlight,
  onToggleExtraKop,
  onToggleExtraSignature,
}) => {
  const isTargetDateOrPlaceMissing =
    !targetIdentity.targetPlace.trim() ||
    !targetIdentity.targetDate.trim() ||
    !targetIdentity.targetDateLocation.trim();

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
      {/* Identity Settings Grid (Old vs Target) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Target Identity Box (New Identity) */}
        <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Identitas Baru (Target Sekolah & Guru Anda)
            </h3>
            <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Data Resmi Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Sekolah Target</label>
              <input
                type="text"
                value={targetIdentity.targetSchool}
                onChange={(e) => onTargetSchoolChange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Penyusun / Guru</label>
              <input
                type="text"
                value={targetIdentity.targetTeacher}
                onChange={(e) => onTargetTeacherChange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIP Guru</label>
              <input
                type="text"
                value={targetIdentity.targetTeacherNip}
                onChange={(e) => onTargetTeacherNipChange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Kepala Sekolah</label>
              <input
                type="text"
                value={targetIdentity.targetHeadmaster}
                onChange={(e) => onTargetHeadmasterChange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={targetIdentity.targetHeadmasterNip}
                onChange={(e) => onTargetHeadmasterNipChange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tahun Ajaran Target</label>
              <input
                type="text"
                value={targetIdentity.targetYear}
                onChange={(e) => onTargetYearChange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tempat / Kota Pengesahan</label>
              <input
                type="text"
                value={targetIdentity.targetPlace}
                onChange={(e) => onTargetPlaceChange(e.target.value)}
                placeholder="misal: Jakarta"
                className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tanggal Pengesahan</label>
              <input
                type="text"
                value={targetIdentity.targetDate}
                onChange={(e) => onTargetDateChange(e.target.value)}
                placeholder="misal: 17 Juli 2024"
                className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tempat & Tanggal (Gabungan)</label>
              <input
                type="text"
                value={targetIdentity.targetDateLocation}
                onChange={(e) => onTargetDateLocationChange(e.target.value)}
                placeholder="misal: Jakarta, 17 Juli 2024"
                className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {isTargetDateOrPlaceMissing && (
              <div className="sm:col-span-2 bg-amber-50 border border-amber-300 p-2.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>Peringatan Validasi:</strong> Tempat atau Tanggal masih kosong. Saat proses replace berjalan, nilai akan otomatis diisi default (<strong>{defaultDistrict}, {defaultFormattedDate}</strong>) agar dokumen rapi & tanpa placeholder tertinggal.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onValidateDefaults}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-md transition-all whitespace-nowrap self-end sm:self-auto"
                >
                  Isi Default Hari Ini
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Old Identity Box (Lama) */}
        <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
              <Search className="w-4 h-4 text-amber-600" />
              Identitas Lama yang Akan Diganti (Search Text)
            </h3>
            <button
              type="button"
              onClick={() => onAutoDetect()}
              className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-900 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all"
            >
              <Wand2 className="w-3 h-3" />
              Auto-Deteksi Teks
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Sekolah Lama</label>
              <input
                type="text"
                value={oldIdentity.oldSchool}
                onChange={(e) => onOldSchoolChange(e.target.value)}
                placeholder="misal: SMP Negeri 1 Jakarta"
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Penyusun Lama</label>
              <input
                type="text"
                value={oldIdentity.oldTeacher}
                onChange={(e) => onOldTeacherChange(e.target.value)}
                placeholder="misal: Budi Santoso, S.Pd."
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIP Guru Lama</label>
              <input
                type="text"
                value={oldIdentity.oldTeacherNip}
                onChange={(e) => onOldTeacherNipChange(e.target.value)}
                placeholder="misal: 19820510 200801 1 012"
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Kepala Sekolah Lama</label>
              <input
                type="text"
                value={oldIdentity.oldHeadmaster}
                onChange={(e) => onOldHeadmasterChange(e.target.value)}
                placeholder="misal: Dr. H. Mulyadi, M.Pd."
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIP Kepala Lama</label>
              <input
                type="text"
                value={oldIdentity.oldHeadmasterNip}
                onChange={(e) => onOldHeadmasterNipChange(e.target.value)}
                placeholder="misal: 19700312 199503 1 002"
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tahun Ajaran Lama</label>
              <input
                type="text"
                value={oldIdentity.oldYear}
                onChange={(e) => onOldYearChange(e.target.value)}
                placeholder="misal: 2023/2024"
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tempat/Kota Lama</label>
              <input
                type="text"
                value={oldIdentity.oldPlace}
                onChange={(e) => onOldPlaceChange(e.target.value)}
                placeholder="misal: Jakarta"
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tanggal Lama</label>
              <input
                type="text"
                value={oldIdentity.oldDate}
                onChange={(e) => onOldDateChange(e.target.value)}
                placeholder="misal: 17 Juli 2023"
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tempat & Tanggal Lama (Gabungan)</label>
              <input
                type="text"
                value={oldIdentity.oldDateLocation}
                onChange={(e) => onOldDateLocationChange(e.target.value)}
                placeholder="misal: Jakarta, 17 Juli 2023"
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Smart Replacement Options Toolbar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-slate-700 font-medium">
            <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={enableSmartPatternReplace}
                onChange={(e) => onToggleSmartPattern(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">Smart Replace Label Otomatis (`Satuan Pendidikan : ...` dll)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={highlightReplacements}
                onChange={(e) => onToggleHighlight(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Sorot Teks Terganti (Highlight Visual)</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
              includeExtraKop
                ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}>
              <input
                type="checkbox"
                checked={includeExtraKop}
                onChange={(e) => onToggleExtraKop(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>+ Kop Surat Sekolah</span>
            </label>

            <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
              includeExtraSignature
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold ring-1 ring-emerald-400'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}>
              <input
                type="checkbox"
                checked={includeExtraSignature}
                onChange={(e) => onToggleExtraSignature(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>✍️ + Kolom Pengesahan TTD Sekolah</span>
            </label>
          </div>
        </div>

        {includeExtraSignature && (
          <div className="bg-emerald-100/70 border border-emerald-300/80 rounded-lg px-3 py-2 text-[11px] text-emerald-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>
                <strong>Kolom Pengesahan TTD Aktif:</strong> Format tanda tangan 2 kolom resmi (Mengetahui Kepala Sekolah & Guru Mata Pelajaran lengkap dengan Titimangsa & NIP) otomatis disuntikkan ke bagian akhir file Word <strong>.docx</strong> serta tampilan <strong>Naskah A4 Resmi</strong>.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
