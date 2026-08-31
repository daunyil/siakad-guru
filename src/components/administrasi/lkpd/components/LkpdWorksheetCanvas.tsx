import React from 'react';
import { Plus, Users, Award, BookOpen, Target, Sparkles } from 'lucide-react';
import type { DocumentKopSettings } from '../../../../types';
import type { CompleteLkpdPackage, LkpdQuestion } from '../types';
import { LkpdQuestionRenderer } from './LkpdQuestionRenderer';
import { LkpdReflectionSection } from './LkpdReflectionSection';
import { LkpdRubricSection } from './LkpdRubricSection';

interface LkpdWorksheetCanvasProps {
  lkpd: CompleteLkpdPackage;
  kopSettings: DocumentKopSettings;
  onAddQuestion: () => void;
  onDeleteQuestion: (id: string) => void;
}

export const LkpdWorksheetCanvas: React.FC<LkpdWorksheetCanvasProps> = ({
  lkpd,
  kopSettings,
  onAddQuestion,
  onDeleteQuestion,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-8 space-y-6 printable-content">
      {/* ── KOP SURAT RESMI SEKOLAH ── */}
      <div className="border-b-4 border-double border-black pb-4 text-center space-y-1">
        <h2 className="text-base md:text-lg font-black uppercase tracking-wider text-black">
          PEMERINTAH KABUPATEN BENGKALIS
        </h2>
        <h2 className="text-sm md:text-base font-black uppercase tracking-wider text-black">
          DINAS PENDIDIKAN
        </h2>
        <h1 className="text-lg md:text-xl font-black uppercase tracking-wider text-blue-950 font-serif">
          {kopSettings.schoolName}
        </h1>
        <p className="text-xs text-slate-700 font-medium">
          NPSN: {kopSettings.npsn} | {kopSettings.address}
        </p>
      </div>

      {/* ── JUDUL DOKUMEN LKPD ── */}
      <div className="text-center space-y-1 pt-1">
        <div className="inline-block px-3 py-0.5 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-1">
          LEMBAR KERJA PESERTA DIDIK (LKPD) • KURIKULUM MERDEKA
        </div>
        <h2 className="text-base md:text-xl font-black uppercase tracking-wide text-slate-950 font-serif">
          {lkpd.title}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-700 pt-1">
          <span>Mata Pelajaran: <strong>{lkpd.subjectName}</strong></span>
          <span>•</span>
          <span>Fase / Kelas: <strong>D / Kelas {lkpd.targetClass}</strong></span>
          <span>•</span>
          <span>Semester: <strong>{lkpd.semester}</strong></span>
          <span>•</span>
          <span>Alokasi Waktu: <strong>{lkpd.timeAllocation}</strong></span>
        </div>
      </div>

      {/* ── IDENTITAS KELOMPOK PESERTA DIDIK ── */}
      <div className="border-2 border-black rounded-xl p-3.5 bg-slate-50/70 text-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Nama Kelompok:</span>
            <span className="border-b border-black flex-1 font-bold">..............................</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Kelas / Ruang:</span>
            <span className="border-b border-black flex-1 font-bold">Kelas {lkpd.targetClass} ...</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Hari / Tanggal:</span>
            <span className="border-b border-black flex-1 font-bold">..............................</span>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-700 block">
            Anggota Kelompok & Nomor Absen:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-1.5 border border-dashed border-slate-400 rounded bg-white">1. .................................</div>
            <div className="p-1.5 border border-dashed border-slate-400 rounded bg-white">2. .................................</div>
            <div className="p-1.5 border border-dashed border-slate-400 rounded bg-white">3. .................................</div>
            <div className="p-1.5 border border-dashed border-slate-400 rounded bg-white">4. .................................</div>
          </div>
        </div>
      </div>

      {/* ── SECTION A: IDENTITAS CAPAIAN PEMBELAJARAN & TUJUAN ── */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs md:text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>A. TUJUAN PEMBELAJARAN & PEMAHAMAN BERMAKNA</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-mono font-bold">
            {lkpd.tpCode}
          </span>
        </h3>
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs space-y-2">
          <div>
            <span className="font-bold text-slate-800">Elemen Capaian Pembelajaran:</span>{' '}
            <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {lkpd.elementName}
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-800">Tujuan Pembelajaran (TP):</span>{' '}
            <span className="text-slate-900 font-semibold">{lkpd.tpTitle}</span>
          </div>
          {lkpd.pemahamanBermakna && (
            <div>
              <span className="font-bold text-slate-800">Pemahaman Bermakna (Big Idea):</span>{' '}
              <span className="text-slate-800 italic">{lkpd.pemahamanBermakna}</span>
            </div>
          )}
          <div>
            <span className="font-bold text-slate-800">Dimensi Profil Pelajar Pancasila:</span>{' '}
            <span className="italic text-slate-700 font-medium">{lkpd.p5Dimensions.join(' • ')}</span>
          </div>
          <div>
            <span className="font-bold text-slate-800">Sumber Belajar & Media:</span>{' '}
            <span className="text-slate-700">{lkpd.toolsAndMaterials}</span>
          </div>
        </div>
      </div>

      {/* ── SECTION B: PETUNJUK UMUM BELAJAR ── */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs md:text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
          <span>B. PETUNJUK UMUM BELAJAR</span>
        </h3>
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs space-y-2">
          <ol className="list-decimal list-inside space-y-1 text-slate-800">
            {lkpd.generalInstructions.map((inst, idx) => (
              <li key={idx} className="leading-relaxed font-medium">
                {inst}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── SECTION C: WACANA PEMANTIK & STIMULUS KONTEKSTUAL ── */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs md:text-sm bg-emerald-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-300" />
          <span>{lkpd.stimulusTitle}</span>
        </h3>
        <div className="bg-emerald-50/50 p-4 rounded-xl border-2 border-emerald-300 text-xs leading-relaxed text-slate-900 font-serif italic whitespace-pre-line shadow-xs">
          {lkpd.stimulusText}
        </div>
      </div>

      {/* ── SECTION D: LANGKAH-LANGKAH AKTIVITAS BELAJAR ── */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs md:text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center justify-between">
          <span>{lkpd.activityStepsTitle}</span>
          <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded font-medium">
            {lkpd.activityBadge}
          </span>
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-800 font-medium pl-2">
          {lkpd.activitySteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-bold text-emerald-800 shrink-0">•</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── SECTION E: LEMBAR HASIL DISKUSI & INSTRUMEN AKTIVITAS ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 rounded-lg">
          <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider">
            {lkpd.questionsTitle}
          </h3>
          <button
            onClick={onAddQuestion}
            className="flex items-center gap-1 text-[11px] bg-emerald-700 hover:bg-emerald-600 px-2 py-0.5 rounded-md font-semibold text-white no-print cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pertanyaan</span>
          </button>
        </div>

        <div className="space-y-4">
          {lkpd.questions.map((q, idx) => (
            <LkpdQuestionRenderer
              key={q.id}
              question={q}
              index={idx}
              onDelete={onDeleteQuestion}
            />
          ))}
        </div>
      </div>

      {/* ── SECTION F: REFLEKSI PEMBELAJARAN ── */}
      <LkpdReflectionSection
        reflectionDetail={lkpd.reflectionDetail}
        reflectionQuestions={lkpd.reflectionQuestions}
      />

      {/* ── SECTION G: RUBRIK PENILAIAN GURU ── */}
      <LkpdRubricSection rubricCriteria={lkpd.rubricCriteria} />

      {/* ── TANDA TANGAN GURU & KEPALA SEKOLAH ── */}
      <div className="pt-6 border-t-2 border-black grid grid-cols-2 gap-8 text-xs text-center break-inside-avoid">
        <div className="space-y-16">
          <div>
            <p className="font-medium text-slate-700">Mengetahui,</p>
            <p className="font-bold uppercase text-slate-900">Kepala {kopSettings.schoolName}</p>
          </div>
          <div className="space-y-0.5">
            <p className="font-bold underline text-slate-900">{kopSettings.headmasterName}</p>
            <p className="text-[11px] text-slate-600">NIP. {kopSettings.headmasterNip}</p>
          </div>
        </div>

        <div className="space-y-16">
          <div>
            <p className="font-medium text-slate-700">{kopSettings.dateLocation}</p>
            <p className="font-bold uppercase text-slate-900">Guru Mata Pelajaran</p>
          </div>
          <div className="space-y-0.5">
            <p className="font-bold underline text-slate-900">{kopSettings.teacherName}</p>
            <p className="text-[11px] text-slate-600">NIP. {kopSettings.teacherNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
