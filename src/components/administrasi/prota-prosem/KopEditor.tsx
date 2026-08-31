import React from 'react';
import { X } from 'lucide-react';
import type { KopData } from './types';

interface KopEditorProps {
  kop: KopData;
  setKop: React.Dispatch<React.SetStateAction<KopData>>;
  onClose: () => void;
}

export const KopEditor: React.FC<KopEditorProps> = ({ kop, setKop, onClose }) => {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 shadow-sm space-y-4 no-print">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase">
          Identitas Kop Dokumen & Tanda Tangan Prota/Prosem
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Nama Sekolah</label>
          <input
            type="text"
            value={kop.schoolName}
            onChange={(e) => setKop({ ...kop, schoolName: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">Kepala Sekolah</label>
          <input
            type="text"
            value={kop.headmasterName}
            onChange={(e) => setKop({ ...kop, headmasterName: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">NIP Kepala Sekolah</label>
          <input
            type="text"
            value={kop.headmasterNip}
            onChange={(e) => setKop({ ...kop, headmasterNip: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">Nama Guru</label>
          <input
            type="text"
            value={kop.teacherName}
            onChange={(e) => setKop({ ...kop, teacherName: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">NIP Guru</label>
          <input
            type="text"
            value={kop.teacherNip}
            onChange={(e) => setKop({ ...kop, teacherNip: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">Kota & Tanggal Penetapan</label>
          <input
            type="text"
            value={kop.dateLocation}
            onChange={(e) => setKop({ ...kop, dateLocation: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
      </div>
    </div>
  );
};
