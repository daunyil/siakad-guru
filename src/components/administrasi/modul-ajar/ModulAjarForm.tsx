import React from 'react';
import { Edit3, Settings } from 'lucide-react';
import type { CPSubject, CPTujuanPembelajaran } from '../../../types';

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
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5 no-print">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-blue-600" />
          Parameter Utama Modul Ajar
        </h3>

        <button
          onClick={() => setIsEditingKop(!isEditingKop)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{isEditingKop ? 'Tutup Pengaturan Kop' : 'Edit Kop Sekolah'}</span>
        </button>
      </div>

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
                    ? 'bg-blue-600 text-white border-blue-600'
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

      {/* 4. Model Pembelajaran */}
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
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
          />
        </div>
      </div>
    </div>
  );
};
