import React, { useRef } from 'react';
import {
  FolderArchive,
  Upload,
  RefreshCw,
  Download,
  Layers,
  FileType,
  CheckCircle2,
} from 'lucide-react';
import type { UploadedFileItem } from './types';

interface BatchReplacerTabProps {
  uploadedFiles: UploadedFileItem[];
  isProcessingBatch: boolean;
  onBatchFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRunBatchProcess: () => void;
  onDownloadBatchItem: (item: UploadedFileItem) => void;
  onDownloadAllBatchZip: () => void;
}

export const BatchReplacerTab: React.FC<BatchReplacerTabProps> = ({
  uploadedFiles,
  isProcessingBatch,
  onBatchFileUpload,
  onRunBatchProcess,
  onDownloadBatchItem,
  onDownloadAllBatchZip,
}) => {
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      {/* Hidden batch file input */}
      <input
        type="file"
        ref={batchFileInputRef}
        onChange={onBatchFileUpload}
        accept=".docx"
        multiple
        className="hidden"
      />

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-purple-600" />
              Pengolah Dokumen Masal (.docx Batch Replacer Engine)
            </h3>
            <p className="text-xs text-slate-500">
              Unggah multiple file Modul Ajar / RPP Word. Sistem akan mengganti seluruh XML text runs secara langsung tanpa mengubah tata letak.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => batchFileInputRef.current?.click()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-purple-600" />
              <span>Tambah File .docx</span>
            </button>

            <button
              onClick={onRunBatchProcess}
              disabled={uploadedFiles.length === 0 || isProcessingBatch}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessingBatch ? 'animate-spin' : ''}`} />
              <span>{isProcessingBatch ? 'Memproses Batch...' : 'Proses Semua File Sekarang'}</span>
            </button>

            {uploadedFiles.some((f) => f.status === 'done') && (
              <button
                onClick={onDownloadAllBatchZip}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Semua (.ZIP)</span>
              </button>
            )}
          </div>
        </div>

        {/* Uploaded Files Table */}
        {uploadedFiles.length === 0 ? (
          <div
            onClick={() => batchFileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50 p-8 rounded-2xl text-center space-y-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Belum ada file masal yang diunggah</h4>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-1">
                Klik di sini atau tombol "Tambah File .docx" di atas untuk memilih beberapa dokumen Modul Ajar Word sekaligus dari komputer Anda.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Nama File Word (.docx)</th>
                  <th className="p-3">Ukuran</th>
                  <th className="p-3">Status Prosessor</th>
                  <th className="p-3 text-center">Hasil Penggantian</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {uploadedFiles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-medium text-slate-900 flex items-center gap-2">
                      <FileType className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate max-w-xs">{item.name}</span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">
                      {(item.size / 1024).toFixed(1)} KB
                    </td>
                    <td className="p-3">
                      {item.status === 'pending' && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                          Menunggu
                        </span>
                      )}
                      {item.status === 'processing' && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold animate-pulse flex items-center gap-1 w-fit">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Mengganti XML...
                        </span>
                      )}
                      {item.status === 'done' && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Selesai Presisi
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold">
                          Gagal
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600 font-mono">
                      {item.status === 'done' ? `${item.replacementCount} Identitas` : '-'}
                    </td>
                    <td className="p-3 text-right">
                      {item.status === 'done' && (
                        <button
                          onClick={() => onDownloadBatchItem(item)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-2xs"
                        >
                          Unduh .docx
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
