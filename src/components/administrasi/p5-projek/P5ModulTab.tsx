import React from 'react';
import type { P5ThemeOption, P5ActivityStage } from './types';

interface P5ModulTabProps {
  currentTheme: P5ThemeOption;
  projectTitle: string;
  selectedDimensions: string[];
  activities: P5ActivityStage[];
}

export const P5ModulTab: React.FC<P5ModulTabProps> = ({
  currentTheme,
  projectTitle,
  selectedDimensions,
  activities,
}) => {
  return (
    <div className="space-y-6 font-sans">
      {/* Relevansi & Deskripsi */}
      <div className="space-y-2 border-b border-slate-200 pb-4">
        <h4 className="font-bold text-xs uppercase underline font-serif">
          A. DESKRIPSI & RELEVANSI PROJEK BAGI SEKOLAH
        </h4>
        <p className="text-slate-800 leading-relaxed text-[11px]">
          {currentTheme.description} Projek bertajuk <strong>"{projectTitle}"</strong> dirancang untuk melatih kesadaran kontekstual peserta didik terhadap tantangan di lingkungan sekitar sekolah serta membentuk karakter sesuai Dimensi Profil Pelajar Pancasila.
        </p>
      </div>

      {/* Dimensi & Elemen Capaian */}
      <div className="space-y-2 border-b border-slate-200 pb-4">
        <h4 className="font-bold text-xs uppercase underline font-serif">
          B. TARGET DIMENSI, ELEMEN & SUBELEMEN PROFIL PELAJAR PANCASILA
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {selectedDimensions.map((dim, idx) => (
            <div key={dim} className="border border-black p-2.5 bg-slate-50 rounded">
              <div className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-1">
                {idx + 1}. Dimensi {dim}
              </div>
              <div className="text-[10px] text-slate-700 leading-snug">
                Target Capaian Fase D: Menunjukkan inisiatif, kerja sama, serta konsistensi tindak lanjut dalam memecahkan masalah kontekstual.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tahapan Aktivitas Projek */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase underline font-serif">
            C. TAHAPAN ALUR AKTIVITAS PROJEK ({activities.reduce((a, b) => a + b.jp, 0)} JP)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-[11px]">
            <thead>
              <tr className="bg-slate-200 text-center font-bold">
                <th className="border border-black px-2 py-1.5 w-36">Tahapan Projek</th>
                <th className="border border-black px-2 py-1.5 text-left">Fokus Aktivitas & Deskripsi KBM</th>
                <th className="border border-black px-2 py-1.5 w-16">Alokasi</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act, idx) => (
                <tr key={idx} className="border-b border-black">
                  <td className="border border-black px-2 py-2 font-bold bg-slate-50 text-slate-900">
                    {act.stage}
                  </td>
                  <td className="border border-black px-3 py-2">
                    <div className="font-bold text-slate-950">{act.title}</div>
                    <div className="text-slate-700 text-[10px] mt-0.5">{act.desc}</div>
                  </td>
                  <td className="border border-black text-center font-bold bg-amber-50">
                    {act.jp} JP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
