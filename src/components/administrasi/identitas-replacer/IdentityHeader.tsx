import React, { useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Sliders,
  FileCheck,
  Eye,
  FileText,
  FolderArchive,
  Upload,
  Layers,
  Download,
  Check,
  Copy,
  Printer,
} from 'lucide-react';
import { SAMPLE_INTERNET_DOCS } from '../../../data/sampleDocsPresets';

interface IdentityHeaderProps {
  statusMessage: string | null;
  replacementStats: number;
  selectedPresetId: string;
  uploadedDocxBuffer: ArrayBuffer | null;
  uploadedFilesCount: number;
  activeTab: 'editor' | 'preview' | 'batch';
  setActiveTab: (tab: 'editor' | 'preview' | 'batch') => void;
  onSelectPreset: (presetId: string) => void;
  onLoadWorkspaceDocx: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBatchFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadDocx: () => void;
  onCopyText: () => void;
  onPrint: () => void;
  copied: boolean;
}

export const IdentityHeader: React.FC<IdentityHeaderProps> = ({
  statusMessage,
  replacementStats,
  selectedPresetId,
  uploadedDocxBuffer,
  uploadedFilesCount,
  activeTab,
  setActiveTab,
  onSelectPreset,
  onLoadWorkspaceDocx,
  onFileUpload,
  onBatchFileUpload,
  onDownloadDocx,
  onCopyText,
  onPrint,
  copied,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-800/40 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                100% Client-Side DOCX XML Preserving
              </span>
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Batch Multi-File Replacer
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Generator Adaptor Identitas Dokumen / Modul Ajar (.docx)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Adaptasi file Word Modul Ajar/RPP dari internet secara masal tanpa merusak format tabel, Kop Sekolah, logo, dan tata letak asli! Ubah nama sekolah, guru, NIP, dan kepala sekolah secara otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Penggantian Terdeteksi</div>
              <div className="text-lg font-black text-emerald-400">{replacementStats} Identitas</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Preset Chooser Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800 uppercase">
            Pilih Contoh Dokumen Internet atau Upload .docx:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onLoadWorkspaceDocx}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedPresetId === 'modul-ajar-bab-1' && uploadedDocxBuffer
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>📄 7.1 Modul Ajar Bab 1 (File Asli Upload)</span>
          </button>

          {SAMPLE_INTERNET_DOCS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedPresetId === preset.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {preset.title.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden file inputs & Nav Workspace Tab Header */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        accept=".docx,.doc,.txt"
        className="hidden"
      />

      <input
        type="file"
        ref={batchFileInputRef}
        onChange={onBatchFileUpload}
        accept=".docx"
        multiple
        className="hidden"
      />

      <div className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'preview'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Pratinjau Dokumen Rapi</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'editor'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Editor Teks Langsung</span>
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'batch'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>Proses Masal (Batch .docx) {uploadedFilesCount > 0 && `(${uploadedFilesCount})`}</span>
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="Unggah 1 file Modul Ajar .docx"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah .docx</span>
          </button>

          <button
            onClick={() => batchFileInputRef.current?.click()}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="Unggah banyak file Word sekaligus"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Unggah Masal (.docx)</span>
          </button>

          <button
            onClick={onDownloadDocx}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="Unduh dokumen hasil adaptasi langsung dalam format Microsoft Word (.docx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Word (.docx)</span>
          </button>

          <button
            onClick={onCopyText}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <button
            onClick={onPrint}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>
    </>
  );
};
