import React from 'react';
import { Edit3, Settings, BookOpen, Sparkles, Check, BookmarkCheck, LayoutGrid, Layers, FileCheck, ArrowRight } from 'lucide-react';
import type { CPSubject, CPTujuanPembelajaran } from '../../../types';
import { type BukuSiswaSubject, type BukuSiswaBab, type BukuSiswaSubBab, type LKPDVariation, resolveLkpdVariations } from '../../../data/bukuSiswaData';

interface ModulAjarFormProps {
  subjects: CPSubject[];
  selectedSubjectId: string;
  setSelectedSubjectId: (id: string) => void;
  selectedGrade: 'VII' | 'VIII' | 'IX';
  setSelectedGrade: (grade: 'VII' | 'VIII' | 'IX') => void;
  meetingNumber: number;
  setMeetingNumber: (num: number) => void;
  timeAllocation: string;
  setTimeAllocation: (alloc: string) => void;
  gradeTps: { elementName: string; tp: CPTujuanPembelajaran }[];
  selectedTpCode: string;
  setSelectedTpCode: (code: string) => void;
  allP3Options: string[];
  p3Dimensions: string[];
  toggleP3Dimension: (dim: string) => void;
  learningModel: string;
  setLearningModel: (model: string) => void;
  sarpras: string;
  setSarpras: (sarpras: string) => void;
  isEditingKop: boolean;
  setIsEditingKop: (val: boolean) => void;
  // Buku Siswa Integration
  bukuSiswaSubject?: BukuSiswaSubject;
  selectedBabId: string;
  setSelectedBabId: (id: string) => void;
  selectedSubBabId: string;
  setSelectedSubBabId: (id: string) => void;
  onApplyBukuSiswaSubBab: (bab: BukuSiswaBab, subBab: BukuSiswaSubBab) => void;
  selectedLkpdVariationId?: string;
  onSelectLkpdVariation?: (variation: LKPDVariation) => void;
}

export const ModulAjarForm: React.FC<ModulAjarFormProps> = ({
  subjects,
  selectedSubjectId,
  setSelectedSubjectId,
  selectedGrade,
  setSelectedGrade,
  meetingNumber,
  setMeetingNumber,
  timeAllocation,
  setTimeAllocation,
  gradeTps,
  selectedTpCode,
  setSelectedTpCode,
  allP3Options,
  p3Dimensions,
  toggleP3Dimension,
  learningModel,
  setLearningModel,
  sarpras,
  setSarpras,
  isEditingKop,
  setIsEditingKop,
  bukuSiswaSubject,
  selectedBabId,
  setSelectedBabId,
  selectedSubBabId,
  setSelectedSubBabId,
  onApplyBukuSiswaSubBab,
  selectedLkpdVariationId,
  onSelectLkpdVariation,
}) => {
  const currentBab = bukuSiswaSubject?.babList.find((b) => b.id === selectedBabId) || bukuSiswaSubject?.babList[0];
  const currentSubBab = currentBab?.subBabList.find((s) => s.id === selectedSubBabId) || currentBab?.subBabList[0];

  const handleBabChange = (babId: string) => {
    setSelectedBabId(babId);
    const targetBab = bukuSiswaSubject?.babList.find((b) => b.id === babId);
    if (targetBab && targetBab.subBabList.length > 0) {
      const firstSub = targetBab.subBabList[0];
      setSelectedSubBabId(firstSub.id);
      onApplyBukuSiswaSubBab(targetBab, firstSub);
    }
  };

  const handleSubBabChange = (subBabId: string) => {
    setSelectedSubBabId(subBabId);
    if (currentBab) {
      const targetSub = currentBab.subBabList.find((s) => s.id === subBabId);
      if (targetSub) {
        onApplyBukuSiswaSubBab(currentBab, targetSub);
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Parameter & Rujukan Kurikulum Modul Ajar
            </h3>
            <p className="text-[11px] text-slate-500">
              Sinkronkan modul ajar langsung dengan Buku Siswa resmi Kemendikbudristek RI
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditingKop(!isEditingKop)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 self-start sm:self-center"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{isEditingKop ? 'Tutup Pengaturan Kop' : 'Edit Kop Sekolah & TTD'}</span>
        </button>
      </div>

      {/* ── BUKU SISWA INTEGRATION BOX (KHUSUS PENDIDIKAN PANCASILA KELAS 7 & MAPEL LAIN) ── */}
      {bukuSiswaSubject ? (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-xs">
                <BookOpen className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-emerald-950">
                    Buku Siswa Terverifikasi: {bukuSiswaSubject.subjectName} Kelas {bukuSiswaSubject.classGrade}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                    Resmi BSKAP Kemendikbudristek
                  </span>
                </div>
                <p className="text-[10.5px] text-emerald-800 font-medium">
                  {bukuSiswaSubject.bookTitle} · ISBN: {bukuSiswaSubject.isbn}
                </p>
              </div>
            </div>

            {currentBab && currentSubBab && (
              <button
                type="button"
                onClick={() => onApplyBukuSiswaSubBab(currentBab, currentSubBab)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Terapkan Bab Ini ke Modul</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Pilih Bab */}
            <div>
              <label className="block font-bold text-emerald-900 mb-1 flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                Pilih Bab / Materi Utama Buku Siswa:
              </label>
              <select
                value={selectedBabId}
                onChange={(e) => handleBabChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-bold text-emerald-950 shadow-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {bukuSiswaSubject.babList.map((bab) => (
                  <option key={bab.id} value={bab.id}>
                    Semester {bab.semester}: {bab.title} ({bab.subBabList.length} Sub-Bab)
                  </option>
                ))}
              </select>
            </div>

            {/* Pilih Sub-Bab */}
            <div>
              <label className="block font-bold text-emerald-900 mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                Pilih Sub-Bab & Pertemuan Buku Siswa:
              </label>
              <select
                value={selectedSubBabId}
                onChange={(e) => handleSubBabChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-bold text-teal-950 shadow-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {currentBab?.subBabList.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    [{sub.code}] {sub.title} ({sub.pages})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentSubBab && (
            <div className="bg-white/90 border border-emerald-300 rounded-xl p-3.5 text-xs text-slate-700 shadow-2xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                <div>
                  <span className="font-extrabold text-emerald-950">Fokus Pembelajaran: </span>
                  <span className="italic font-medium text-slate-800">{currentSubBab.tujuanPembelajaran}</span>
                </div>
                <div className="flex items-center gap-3 font-semibold text-[11px] text-emerald-800 shrink-0">
                  <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">📖 Rujukan: {currentSubBab.pages}</span>
                  <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">⏱️ {currentSubBab.alokasiWaktu}</span>
                  <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">🧩 {currentSubBab.modelPembelajaran.split('&')[0]}</span>
                </div>
              </div>

              {/* DROPDOWN PILIHAN VARIASI MODEL LKPD (COMPACT) */}
              {(() => {
                const activeVariations = resolveLkpdVariations(currentSubBab);
                const selectedVar = activeVariations.find(
                  (v) => v.id === selectedLkpdVariationId
                ) || activeVariations[0];

                return (
                  <div className="pt-2 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="p-1 bg-emerald-700 text-emerald-100 rounded-md">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                      <label htmlFor="lkpd-variation-select-form" className="text-xs font-extrabold text-emerald-950">
                        Variasi Model LKPD:
                      </label>
                    </div>

                    <div className="flex-1 flex items-center gap-2">
                      <select
                        id="lkpd-variation-select-form"
                        value={selectedVar?.id || ''}
                        onChange={(e) => {
                          const chosen = activeVariations.find((v) => v.id === e.target.value);
                          if (chosen) onSelectLkpdVariation?.(chosen);
                        }}
                        className="w-full text-xs font-semibold text-slate-800 bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs cursor-pointer"
                      >
                        {activeVariations.map((v) => (
                          <option key={v.id} value={v.id}>
                            [{v.badge}] {v.title}
                          </option>
                        ))}
                      </select>

                      {selectedVar?.badge && (
                        <span className="hidden md:inline-flex shrink-0 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-1 rounded-md">
                          {selectedVar.badge}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ) : null}

      {/* 1. Selection Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-600 mb-1">Mata Pelajaran</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Kelas</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as 'VII' | 'VIII' | 'IX')}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
          >
            <option value="VII">Kelas VII (SMP)</option>
            <option value="VIII">Kelas VIII (SMP)</option>
            <option value="IX">Kelas IX (SMP)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Pertemuan Ke-</label>
          <input
            type="number"
            min={1}
            value={meetingNumber}
            onChange={(e) => setMeetingNumber(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Alokasi Waktu</label>
          <input
            type="text"
            value={timeAllocation}
            onChange={(e) => setTimeAllocation(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
          />
        </div>
      </div>

      {/* 2. Choose TP Dropdown */}
      <div className="text-xs space-y-1">
        <label className="block font-bold text-slate-700">
          Tujuan Pembelajaran (TP) Acuan Modul:
        </label>
        <select
          value={selectedTpCode}
          onChange={(e) => setSelectedTpCode(e.target.value)}
          className="w-full px-3 py-2 bg-blue-50/50 border border-blue-300 rounded-xl font-bold text-blue-950"
        >
          {gradeTps.map((item) => (
            <option key={item.tp.code} value={item.tp.code}>
              [{item.tp.code}] {item.elementName} - {item.tp.title} ({item.tp.jp} JP)
            </option>
          ))}
        </select>
      </div>

      {/* 3. Profil Pelajar Pancasila Badges Checkboxes */}
      <div className="space-y-1.5 text-xs">
        <label className="block font-bold text-slate-700">
          Dimensi Profil Pelajar Pancasila (P3):
        </label>
        <div className="flex flex-wrap gap-2">
          {allP3Options.map((dim) => {
            const isSelected = p3Dimensions.includes(dim);
            return (
              <button
                key={dim}
                type="button"
                onClick={() => toggleP3Dimension(dim)}
                className={`px-3 py-1 rounded-full border transition-all text-[11px] font-bold ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {dim}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Model Pembelajaran & Sarpras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-600 mb-1">Model Pembelajaran</label>
          <select
            value={learningModel}
            onChange={(e) => setLearningModel(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
          >
            <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
            <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
            <option value="Discovery / Inquiry Learning">Discovery / Inquiry Learning</option>
            <option value="Discovery Learning & Diskusi Kelompok">Discovery Learning & Diskusi Kelompok</option>
            <option value="Contextual Teaching and Learning (CTL)">Contextual Teaching and Learning (CTL)</option>
            <option value="Role Playing / Simulasi Sidang">Role Playing / Simulasi Sidang</option>
            <option value="Cooperative Learning (Jigsaw)">Cooperative Learning (Jigsaw)</option>
            <option value="Direct Instruction (Tatap Muka Dituntun)">Direct Instruction</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Sarana & Prasarana</label>
          <input
            type="text"
            value={sarpras}
            onChange={(e) => setSarpras(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
