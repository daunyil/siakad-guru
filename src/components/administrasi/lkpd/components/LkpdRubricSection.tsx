import React from 'react';

interface RubricItem {
  aspect: string;
  score4: string;
  score3: string;
  score2: string;
  score1: string;
}

interface LkpdRubricSectionProps {
  rubricCriteria: RubricItem[];
}

export const LkpdRubricSection: React.FC<LkpdRubricSectionProps> = ({
  rubricCriteria,
}) => {
  return (
    <div className="space-y-2 break-inside-avoid">
      <h3 className="font-bold text-xs md:text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center justify-between">
        <span>G. RUBRIK & LEMBAR PENILAIAN GURU</span>
        <span className="text-[10px] font-normal normal-case opacity-80">
          Disiplin Penilaian 4 Kategori (Skor 1-4)
        </span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black text-[10px] font-sans">
          <thead>
            <tr className="bg-slate-200 font-bold text-center">
              <th className="border border-black p-1.5 w-32">Aspek Penilaian</th>
              <th className="border border-black p-1.5">Sangat Baik (Skor 4)</th>
              <th className="border border-black p-1.5">Baik (Skor 3)</th>
              <th className="border border-black p-1.5">Cukup (Skor 2)</th>
              <th className="border border-black p-1.5">Perlu Bimbingan (Skor 1)</th>
            </tr>
          </thead>
          <tbody>
            {rubricCriteria.map((rub, idx) => (
              <tr key={idx}>
                <td className="border border-black p-1.5 font-bold bg-slate-50 text-slate-900">
                  {rub.aspect}
                </td>
                <td className="border border-black p-1.5 text-slate-800">{rub.score4}</td>
                <td className="border border-black p-1.5 text-slate-800">{rub.score3}</td>
                <td className="border border-black p-1.5 text-slate-800">{rub.score2}</td>
                <td className="border border-black p-1.5 text-slate-800">{rub.score1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nilai & Catatan Guru Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
        <div className="border-2 border-black rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-xs uppercase block text-slate-900">NILAI LKPD KELOMPOK</span>
            <span className="text-[10px] text-slate-600 block">
              Rumus: (Total Skor Diperoleh / Total Skor Maks) x 100
            </span>
          </div>
          <div className="w-20 h-14 border-2 border-black rounded-lg flex items-center justify-center font-black text-xl text-emerald-950 bg-slate-50">
            / 100
          </div>
        </div>

        <div className="border-2 border-black rounded-xl p-3 space-y-1 text-xs">
          <span className="font-bold text-slate-900 block">Catatan & Umpan Balik Guru:</span>
          <div className="border-b border-dotted border-slate-400 w-full h-3" />
          <div className="border-b border-dotted border-slate-400 w-full h-3" />
        </div>
      </div>
    </div>
  );
};
