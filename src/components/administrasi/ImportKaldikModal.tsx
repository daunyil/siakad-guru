import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Info,
  Building2,
  Calendar,
  Copy,
  Code2,
  Check,
  Flag,
} from 'lucide-react';
import ExcelJS from 'exceljs';
import { WeekStatus, REGIONAL_KALDIK_PRESETS } from './ProtaProsemGenerator';
import {
  getHolidaysForAcademicYear,
  convertHolidaysToWeekTags,
} from '../../lib/nationalHolidays';

interface ImportKaldikModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyKaldik: (
    ganjilTags: Record<string, WeekStatus>,
    genapTags: Record<string, WeekStatus>,
    sourceInfo: string
  ) => void;
}

export const ImportKaldikModal: React.FC<ImportKaldikModalProps> = ({
  isOpen,
  onClose,
  onApplyKaldik,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'excel' | 'preset' | 'national'>('prompt');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Scanned / Parsed Result State
  const [parsedGanjil, setParsedGanjil] = useState<Record<string, WeekStatus>>({});
  const [parsedGenap, setParsedGenap] = useState<Record<string, WeekStatus>>({});
  const [detectedSource, setDetectedSource] = useState<string>('');

  // Prompt Generator & Paste State
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [pastedJsonInput, setPastedJsonInput] = useState<string>('');

  const promptTemplate = `Tolong analisis gambar/dokumen Kalender Pendidikan (Kaldik) ini.
Identifikasi status tiap pekan/minggu untuk Semester Ganjil (Juli-Desember) dan Semester Genap (Januari-Juni).
Gunakan salah satu dari status berikut:
- "mpls" (Masa Pengenalan Lingkungan Sekolah)
- "sts" (Sumatif Tengah Semester / PTS)
- "sas" (Sumatif Akhir Semester / PAS)
- "rapor" (Penyerahan Rapor)
- "libur" (Libur Semester / Libur Keagamaan)
- "kbm" (Kegiatan Belajar Mengajar efektif)

Berikan respon HANYA dalam format JSON murni seperti contoh ini:
{
  "ganjilTags": {
    "Juli-0": "mpls",
    "September-2": "sts",
    "Desember-1": "sas",
    "Desember-2": "rapor",
    "Desember-3": "libur"
  },
  "genapTags": {
    "Januari-0": "kbm",
    "Maret-1": "sts",
    "Juni-1": "sas",
    "Juni-2": "rapor",
    "Juni-3": "libur"
  }
}`;

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptTemplate);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleParsePastedJson = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!pastedJsonInput.trim()) {
      setErrorMsg('Harap tempelkan (paste) hasil teks/JSON dari AI terlebih dahulu.');
      return;
    }

    try {
      const jsonMatch = pastedJsonInput.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Format teks tidak mengandung struktur JSON yang valid.');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.ganjilTags && !parsed.genapTags) {
        throw new Error('JSON tidak memiliki properti "ganjilTags" atau "genapTags".');
      }

      setParsedGanjil(parsed.ganjilTags || {});
      setParsedGenap(parsed.genapTags || {});
      setDetectedSource('Hasil Salin-Tempel Prompt AI');
      setSuccessMsg('Berhasil mengurai teks JSON hasil AI External!');
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Gagal membaca JSON. Pastikan Anda menyalin seluruh teks balasan JSON dari ChatGPT/Gemini.');
    }
  };

  // Handle Excel File Upload (.xlsx / .csv)
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets[0];
      const detectedGanjil: Record<string, WeekStatus> = {};
      const detectedGenap: Record<string, WeekStatus> = {};

      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          const val = String(cell.value || '').toLowerCase();

          // Rule match keywords
          if (val.includes('mpls') || val.includes('mopd')) {
            detectedGanjil['Juli-0'] = 'mpls';
          }
          if (val.includes('pts') || val.includes('sts') || val.includes('tengah semester')) {
            detectedGanjil['September-2'] = 'sts';
            detectedGenap['Maret-1'] = 'sts';
          }
          if (val.includes('pas') || val.includes('sas') || val.includes('pat') || val.includes('akhir semester')) {
            detectedGanjil['Desember-1'] = 'sas';
            detectedGenap['Juni-1'] = 'sas';
          }
          if (val.includes('rapor') || val.includes('rapot')) {
            detectedGanjil['Desember-2'] = 'rapor';
            detectedGenap['Juni-2'] = 'rapor';
          }
          if (val.includes('libur') || val.includes('ramadhan') || val.includes('idul fitri')) {
            detectedGanjil['Desember-3'] = 'libur';
            detectedGenap['Juni-3'] = 'libur';
          }
        });
      });

      // Merge with base preset defaults if empty
      const finalGanjil = { ...REGIONAL_KALDIK_PRESETS[0].ganjilTags, ...detectedGanjil };
      const finalGenap = { ...REGIONAL_KALDIK_PRESETS[0].genapTags, ...detectedGenap };

      setParsedGanjil(finalGanjil);
      setParsedGenap(finalGenap);
      setDetectedSource(`File Excel: ${file.name}`);
      setSuccessMsg(`Berhasil membaca file Excel "${file.name}"! Status pekan telah dipetakan.`);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Gagal membaca file Excel. Pastikan format file berupa .xlsx valid.');
    } finally {
      setLoading(false);
    }
  };

  // Apply parsed tags to parent Prosem
  const handleApply = () => {
    if (Object.keys(parsedGanjil).length === 0 && Object.keys(parsedGenap).length === 0) {
      // Default to Jabar if empty
      onApplyKaldik(
        REGIONAL_KALDIK_PRESETS[0].ganjilTags,
        REGIONAL_KALDIK_PRESETS[0].genapTags,
        'Preset Kaldik Disdik'
      );
    } else {
      onApplyKaldik(parsedGanjil, parsedGenap, detectedSource || 'Impor Kaldik');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Impor / Pindai Kalender Pendidikan (Kaldik)</h3>
              <p className="text-xs text-blue-100">
                Pilih opsi impor dari Prompt AI Eksternal, File Excel Kaldik, atau Preset Dinas Provinsi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-1.5 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all ${
              activeTab === 'prompt'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Prompt External AI</span>
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all ${
              activeTab === 'excel'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Unggah Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => setActiveTab('preset')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all ${
              activeTab === 'preset'
                ? 'bg-white text-purple-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Preset Dinas Provinsi</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('national');
              const h2025 = getHolidaysForAcademicYear('2025/2026');
              const { ganjilTags, genapTags } = convertHolidaysToWeekTags(h2025);
              setParsedGanjil(ganjilTags);
              setParsedGenap(genapTags);
              setDetectedSource('SKB 3 Menteri / Kalender Hari Libur Nasional RI');
              setSuccessMsg('Otomatis memuat Hari Libur Nasional & Cuti Bersama RI.');
            }}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all ${
              activeTab === 'national'
                ? 'bg-white text-red-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-red-600" />
            <span>Libur Nasional (SKB 3)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Status Feedback Alerts */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: EXTERNAL PROMPT GENERATOR & PASTE */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3.5 space-y-2 text-xs text-indigo-900">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-indigo-950">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    Langkah 1: Salin Prompt Standar ini ke ChatGPT / Gemini / Claude
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all flex items-center gap-1 shadow-xs"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Tersalin!' : 'Salin Prompt'}</span>
                  </button>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-indigo-200 font-mono text-[11px] text-slate-700 max-h-28 overflow-y-auto whitespace-pre-wrap select-all">
                  {promptTemplate}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Langkah 2: Tempel (Paste) Teks Balasan JSON dari AI External Di Sini:
                </label>
                <textarea
                  rows={4}
                  value={pastedJsonInput}
                  onChange={(e) => setPastedJsonInput(e.target.value)}
                  placeholder="Tempelkan teks JSON dari ChatGPT/Gemini di sini... Contoh: { &quot;ganjilTags&quot;: { &quot;Juli-0&quot;: &quot;mpls&quot; } }"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleParsePastedJson}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Urai Teks JSON & Pratinjau Pemetaan</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EXCEL UPLOAD */}
          {activeTab === 'excel' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">Parsing File Excel (.xlsx)</p>
                  <p className="text-emerald-700">
                    Sistem membaca sel tabel di file Excel Kalender Pendidikan Anda untuk mengekstrak kata kunci agenda
                    seperti MPLS, STS, PAS/SAS, dan Libur.
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-400 transition-all group relative cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleExcelUpload}
                  disabled={loading}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-white rounded-full shadow-xs text-emerald-600 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      {loading ? 'Sedang Membaca Excel...' : 'Pilih / Tarik File Excel Kalender (.xlsx)'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Mendukung format spreadsheet Excel resmi dari sekolah atau dinas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REGIONAL PRESET SELECTION */}
          {activeTab === 'preset' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Pilih Acuan Kalender Pendidikan Dinas Provinsi / Kementerian:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {REGIONAL_KALDIK_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setParsedGanjil(p.ganjilTags);
                      setParsedGenap(p.genapTags);
                      setDetectedSource(`Preset: ${p.name}`);
                      setSuccessMsg(`Preset ${p.name} dipilih.`);
                    }}
                    className="p-3 border border-slate-200 hover:border-purple-400 rounded-xl bg-slate-50 hover:bg-purple-50/50 text-left transition-all space-y-1 group"
                  >
                    <span className="font-bold text-xs text-slate-800 group-hover:text-purple-900 block">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      {p.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: NATIONAL HOLIDAYS (SKB 3 MENTERI) */}
          {activeTab === 'national' && (
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl space-y-1 text-xs">
                <span className="font-bold text-red-900 flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-red-600" />
                  Kalender Libur Nasional & Cuti Bersama RI (SKB 3 Menteri)
                </span>
                <p className="text-red-800 leading-relaxed text-[11px]">
                  Peta tanggal merah otomatis disesuaikan dengan Keputusan Bersama 3 Menteri (Menteri Agama, Menteri Ketenagakerjaan, Menteri PANRB). Pekan yang memuat tanggal merah ditandai sebagai status <strong>LIBUR</strong>.
                </p>
              </div>

              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => {
                    const h2025 = getHolidaysForAcademicYear('2025/2026');
                    const { ganjilTags, genapTags } = convertHolidaysToWeekTags(h2025);
                    setParsedGanjil(ganjilTags);
                    setParsedGenap(genapTags);
                    setDetectedSource('Kalender Hari Libur Nasional TA 2025/2026');
                    setSuccessMsg('Memuat Libur Nasional TA 2025/2026.');
                  }}
                  className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-colors text-center"
                >
                  Muat TA 2025/2026
                </button>
                <button
                  onClick={() => {
                    const h2024 = getHolidaysForAcademicYear('2024/2025');
                    const { ganjilTags, genapTags } = convertHolidaysToWeekTags(h2024);
                    setParsedGanjil(ganjilTags);
                    setParsedGenap(genapTags);
                    setDetectedSource('Kalender Hari Libur Nasional TA 2024/2025');
                    setSuccessMsg('Memuat Libur Nasional TA 2024/2025.');
                  }}
                  className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors text-center"
                >
                  Muat TA 2024/2025
                </button>
              </div>
            </div>
          )}

          {/* Parsed Summary Preview Box */}
          {Object.keys(parsedGanjil).length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Pratinjau Hasil Pemetaan Kaldik
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                  {detectedSource || 'Terpindai'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-700">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold block text-blue-900 text-[10px] uppercase">
                    Semester Ganjil:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(parsedGanjil).map(([key, st]) => (
                      <span
                        key={key}
                        className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 border border-slate-200 uppercase"
                      >
                        {key}: <span className="text-blue-700">{st}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold block text-blue-900 text-[10px] uppercase">
                    Semester Genap:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(parsedGenap).map(([key, st]) => (
                      <span
                        key={key}
                        className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 border border-slate-200 uppercase"
                      >
                        {key}: <span className="text-emerald-700">{st}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Catatan:</strong> Setelah memuat data Kaldik, Anda tetap dapat melakukan penyesuaian manual (misal klik status per minggu) langsung di tabel Program Semester (Prosem) apabila ada kegiatan internal sekolah secara spesifik.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Terapkan ke Prosem & Hitung JP Efektif
          </button>
        </div>
      </div>
    </div>
  );
};
