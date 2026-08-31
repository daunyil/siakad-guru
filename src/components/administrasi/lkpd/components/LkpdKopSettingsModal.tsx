import React from 'react';
import { Building, User, X, CheckCircle2 } from 'lucide-react';
import type { DocumentKopSettings } from '../../../../types';

interface LkpdKopSettingsModalProps {
  isOpen: boolean;
  kopSettings: DocumentKopSettings;
  onChangeKop: (updated: Partial<DocumentKopSettings>) => void;
  onClose: () => void;
}

export const LkpdKopSettingsModal: React.FC<LkpdKopSettingsModalProps> = ({
  isOpen,
  kopSettings,
  onChangeKop,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-slate-900/90 text-white rounded-2xl p-4 md:p-6 border border-slate-700 shadow-2xl space-y-4 no-print animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">
            Pengaturan Kop Surat & Identitas Satuan Pendidikan
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">Nama Satuan Pendidikan:</label>
          <input
            type="text"
            value={kopSettings.schoolName}
            onChange={(e) => onChangeKop({ schoolName: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">NPSN Sekolah:</label>
          <input
            type="text"
            value={kopSettings.npsn}
            onChange={(e) => onChangeKop({ npsn: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">Alamat Sekolah:</label>
          <input
            type="text"
            value={kopSettings.address}
            onChange={(e) => onChangeKop({ address: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">Nama Kepala Sekolah:</label>
          <input
            type="text"
            value={kopSettings.headmasterName}
            onChange={(e) => onChangeKop({ headmasterName: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">NIP Kepala Sekolah:</label>
          <input
            type="text"
            value={kopSettings.headmasterNip}
            onChange={(e) => onChangeKop({ headmasterNip: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">Nama Guru Pengampu:</label>
          <input
            type="text"
            value={kopSettings.teacherName}
            onChange={(e) => onChangeKop({ teacherName: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">NIP Guru:</label>
          <input
            type="text"
            value={kopSettings.teacherNip}
            onChange={(e) => onChangeKop({ teacherNip: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">Tempat & Tanggal Dokumen:</label>
          <input
            type="text"
            value={kopSettings.dateLocation}
            onChange={(e) => onChangeKop({ dateLocation: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={onClose}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Simpan & Terapkan Kop</span>
        </button>
      </div>
    </div>
  );
};
