import React, { useRef } from 'react';
import { FileType, Upload } from 'lucide-react';

interface TextEditorTabProps {
  docText: string;
  onDocTextChange: (text: string) => void;
  onInsertTag: (tag: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextEditorTab: React.FC<TextEditorTabProps> = ({
  docText,
  onDocTextChange,
  onInsertTag,
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const TAGS = [
    '{{NAMA_SEKOLAH}}',
    '{{NAMA_GURU}}',
    '{{NIP_GURU}}',
    '{{NAMA_KEPSEK}}',
    '{{NIP_KEPSEK}}',
    '{{TAHUN_AJARAN}}',
    '{{MATA_PELAJARAN}}',
    '{{TEMPAT}}',
    '{{TANGGAL}}',
    '{{KOTA_TANGGAL}}',
  ];

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        accept=".docx,.doc,.txt"
        className="hidden"
      />

      {/* Word File Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 p-4 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-700 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <FileType className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
              Punya File Microsoft Word (.docx) Modul Ajar / RPP dari Internet?
            </h4>
            <p className="text-[11px] text-slate-500">
              Klik di sini untuk mengunggah file <strong>.docx</strong> secara langsung, atau Anda juga bisa salin-tempel (Ctrl+A &amp; Ctrl+V) teks dari Word ke area di bawah.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-3 py-1.5 bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold rounded-lg shrink-0 shadow-xs flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Pilih File .docx</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <span className="font-bold text-slate-900">
          Sisipkan Tag Placeholder Cepat (Klik untuk menambahkan ke dalam dokumen):
        </span>
        <span className="text-[11px] text-slate-500 font-mono">{docText.length} Karakter Teks</span>
      </div>

      {/* Quick Tag Insert Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onInsertTag(tag)}
              className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
            >
              + {tag}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            const signatureTemplate = `\n\nMengetahui,\t\t\t\t\t\t\t\t\t\t{{KOTA_TANGGAL}}\nKepala {{NAMA_SEKOLAH}}\t\t\t\t\tGuru Mata Pelajaran {{MATA_PELAJARAN}}\n\n\n\n\n{{NAMA_KEPSEK}}\t\t\t\t\t\t\t\t\t{{NAMA_GURU}}\nNIP. {{NIP_KEPSEK}}\t\t\t\t\t\t\t\tNIP. {{NIP_GURU}}\n`;
            onDocTextChange(docText ? `${docText}${signatureTemplate}` : signatureTemplate);
          }}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
        >
          <span>✍️ Sisipkan Kolom TTD Sekolah (2 Kolom)</span>
        </button>
      </div>

      <textarea
        value={docText}
        onChange={(e) => onDocTextChange(e.target.value)}
        rows={20}
        className="w-full p-4 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed shadow-inner"
        placeholder="Tempelkan isi dokumen / modul ajar Word atau PDF dari internet di sini atau gunakan tag placeholder..."
      />
    </div>
  );
};
