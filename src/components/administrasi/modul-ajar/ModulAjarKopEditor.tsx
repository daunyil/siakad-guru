import React from 'react';
import { X } from 'lucide-react';
import type { KopData } from './types';

interface ModulAjarKopEditorProps {
  kop: KopData;
  setKop: React.Dispatch<React.SetStateAction<KopData>>;
  onClose: () => void;
}

export const ModulAjarKopEditor: React.FC<ModulAjarKopEditorProps> = ({
  kop,
  setKop,
  onClose,
}) => {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 shadow-xs space-y-4 no-print">
      <div className="flex items-center justify-between border-b pb-2">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase">
            Pengaturan Identitas Kop Lembaga & Tanda Tangan
          </h3>
          <p className="text-[11px] text-slate-500">
            Kop surat resmi ini akan muncul di bagian atas dokumen Modul Ajar dan lembar pengesahan
          </p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="md:col-span-2">
          <label className="block font-bold text-slate-700 mb-1">Dinas / Instansi Pembina</label>
          <input
            type="text"
            value={kop.governmentAgency || ''}
            placeholder="PEMERINTAH KABUPATEN BENGKALIS / DINAS PENDIDIKAN"
            onChange={(e) => setKop({ ...kop, governmentAgency: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">Semester</label>
          <input
            type="text"
            value={kop.academicSemester || ''}
            placeholder="Semester Ganjil (I)"
            onChange={(e) => setKop({ ...kop, academicSemester: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
          <input
            type="text"
            value={kop.schoolName}
            onChange={(e) => setKop({ ...kop, schoolName: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-bold text-slate-700 mb-1">Alamat & Kontak Sekolah</label>
          <input
            type="text"
            value={kop.schoolAddress || ''}
            placeholder="Jl. Utama No. 12, Kec. Bantan, Kab. Bengkalis, Riau - Kode Pos 28754"
            onChange={(e) => setKop({ ...kop, schoolAddress: e.target.value })}
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
          <label className="block font-bold text-slate-700 mb-1">Tanggal & Tempat Penetapan</label>
          <input
            type="text"
            value={kop.dateLocation}
            onChange={(e) => setKop({ ...kop, dateLocation: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">Nama Guru Penyusun</label>
          <input
            type="text"
            value={kop.teacherName}
            onChange={(e) => setKop({ ...kop, teacherName: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">NIP Guru Penyusun</label>
          <input
            type="text"
            value={kop.teacherNip}
            onChange={(e) => setKop({ ...kop, teacherNip: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
          />
        </div>
      </div>
    </div>
  );
};

