import React, { useState } from 'react';
import { Download, Upload, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { saveStorageData, clearAllStorageData } from '../../utils/storage';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  allStateData: Record<string, any>;
  onRestoreSuccess: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  allStateData,
  onRestoreSuccess,
}) => {
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  if (!isOpen) return null;

  // Export all current state data as downloadable JSON
  const handleExportBackup = () => {
    try {
      const backupData = {
        app: 'SIAKAD_GURU_MERDEKA',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: allStateData,
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `siakad_guru_backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setImportStatus({
        type: 'success',
        message: 'File cadangan data (.json) berhasil diunduh!',
      });
    } catch (err) {
      setImportStatus({
        type: 'error',
        message: 'Gagal mengunduh cadangan data: ' + (err as Error).message,
      });
    }
  };

  // Import JSON backup file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed || !parsed.data || typeof parsed.data !== 'object') {
          throw new Error('Format file JSON tidak valid. Pastikan file adalah cadangan SIAKAD Guru.');
        }

        const dataObj = parsed.data;
        // Save each key to localStorage
        Object.keys(dataObj).forEach((key) => {
          saveStorageData(key, dataObj[key]);
        });

        setImportStatus({
          type: 'success',
          message: 'Data berhasil dipulihkan! Halaman akan diperbarui...',
        });

        setTimeout(() => {
          onRestoreSuccess();
          onClose();
          window.location.reload();
        }, 1200);
      } catch (err) {
        setImportStatus({
          type: 'error',
          message: (err as Error).message || 'Gagal membaca file JSON.',
        });
      }
    };
    reader.readAsText(file);
  };

  // Reset to sample default data
  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke data sampel default? Data yang Anda ketik saat ini akan terhapus.')) {
      clearAllStorageData();
      setImportStatus({
        type: 'success',
        message: 'Seluruh data direset ke default. Memperbarui halaman...',
      });
      setTimeout(() => {
        onRestoreSuccess();
        onClose();
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Cadangkan & Pulihkan Data</h2>
              <p className="text-[11px] text-slate-300">Manajemen penyimpanan lokal (localStorage)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {importStatus.type && (
            <div
              className={`p-3 rounded-xl flex items-start gap-2.5 border ${
                importStatus.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="font-semibold">{importStatus.message}</span>
            </div>
          )}

          {/* Download Backup */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Download className="w-4 h-4 text-blue-600" />
              1. Unduh Cadangan Data (.json)
            </div>
            <p className="text-slate-600 text-[11px]">
              Simpan seluruh data nilai, absensi, jurnal, jadwal, serta data guru & sekolah ke dalam file JSON di laptop/HP Anda.
            </p>
            <button
              onClick={handleExportBackup}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Unduh File JSON Sekarang
            </button>
          </div>

          {/* Import Backup */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Upload className="w-4 h-4 text-emerald-600" />
              2. Pulihkan / Impor Data dari File (.json)
            </div>
            <p className="text-slate-600 text-[11px]">
              Unggah file JSON cadangan yang pernah Anda unduh sebelumnya untuk mengembalikan seluruh data.
            </p>
            <label className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2 text-center">
              <Upload className="w-4 h-4" />
              Pilih File Backup (.json)
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset to Default */}
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px]">
                <RefreshCw className="w-3.5 h-3.5 text-amber-600" /> Reset Data Default
              </div>
              <p className="text-[10px] text-amber-800">Kembalikan ke data contoh bawaan sistem</p>
            </div>
            <button
              onClick={handleResetData}
              className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shrink-0"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
