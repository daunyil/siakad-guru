import React from 'react';
import type { P5ThemeOption } from './types';
import { P5_THEMES, PPP_DIMENSIONS } from './P5ThemeData';

interface P5ControlBarProps {
  selectedThemeId: string;
  handleThemeChange: (id: string) => void;
  selectedGrade: 'VII' | 'VIII' | 'IX';
  setSelectedGrade: (g: 'VII' | 'VIII' | 'IX') => void;
  selectedClass: string;
  setSelectedClass: (c: string) => void;
  totalJp: number;
  setTotalJp: (jp: number) => void;
  activeTab: 'modul' | 'rubrik' | 'rapor';
  setActiveTab: (tab: 'modul' | 'rubrik' | 'rapor') => void;
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  selectedDimensions: string[];
  toggleDimension: (dim: string) => void;
  currentTheme: P5ThemeOption;
}

export const P5ControlBar: React.FC<P5ControlBarProps> = ({
  selectedThemeId,
  handleThemeChange,
  selectedGrade,
  setSelectedGrade,
  selectedClass,
  setSelectedClass,
  totalJp,
  setTotalJp,
  activeTab,
  setActiveTab,
  projectTitle,
  setProjectTitle,
  selectedDimensions,
  toggleDimension,
  currentTheme,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 no-print">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Pilih Tema P5 BSKAP:</label>
            <select
              value={selectedThemeId}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg font-bold text-amber-950"
            >
              {P5_THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Kelas / Rombel:</label>
            <div className="flex items-center gap-1.5">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as 'VII' | 'VIII' | 'IX')}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
              >
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>
              <input
                type="text"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 text-center"
                placeholder="Rombel"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Total Alokasi JP:</label>
            <input
              type="number"
              min={10}
              max={120}
              value={totalJp}
              onChange={(e) => setTotalJp(parseInt(e.target.value) || 48)}
              className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 text-center"
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('modul')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'modul'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Modul Projek
          </button>
          <button
            onClick={() => setActiveTab('rubrik')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rubrik'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rubrik Penilaian
          </button>
          <button
            onClick={() => setActiveTab('rapor')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rapor'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Input Rapor P5
          </button>
        </div>
      </div>

      {/* Project Title & Dimensions Input */}
      <div className="space-y-3 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Judul Topik / Projek P5:</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full px-3.5 py-2 bg-amber-50/50 border border-amber-200 rounded-xl font-bold text-amber-950 text-sm"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5">
            Target Dimensi Profil Pelajar Pancasila (P3):
          </label>
          <div className="flex flex-wrap gap-2">
            {PPP_DIMENSIONS.map((dim) => {
              const isSelected = selectedDimensions.includes(dim);
              return (
                <button
                  key={dim}
                  type="button"
                  onClick={() => toggleDimension(dim)}
                  className={`px-3 py-1 rounded-full border transition-all text-[11px] font-bold ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600'
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

        <p className="text-[11px] italic text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          💡 <strong>Deskripsi Tema ({currentTheme.name}):</strong> {currentTheme.description}
        </p>
      </div>
    </div>
  );
};
