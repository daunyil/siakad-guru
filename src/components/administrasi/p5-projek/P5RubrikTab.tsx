import React from 'react';
import type { P5StudentAssessment } from './types';

interface P5RubrikTabProps {
  selectedDimensions: string[];
  students: P5StudentAssessment[];
  handleStudentGradeChange: (
    studentId: string,
    dimension: string,
    level: 'BB' | 'MB' | 'BSH' | 'SB'
  ) => void;
}

export const P5RubrikTab: React.FC<P5RubrikTabProps> = ({
  selectedDimensions,
  students,
  handleStudentGradeChange,
}) => {
  return (
    <div className="space-y-4 font-sans">
      <h4 className="font-bold text-xs uppercase underline font-serif">
        RUBRIK PENILAIAN KARAKTER PROFIL PELAJAR PANCASILA
      </h4>

      {/* Kategori Rubrik BSKAP Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] font-sans">
        <div className="p-2 bg-red-50 border border-red-300 rounded text-red-900">
          <div className="font-bold">BB (Belum Berkembang)</div>
          <div className="text-[9px] text-red-800">
            Peserta didik belum menunjukkan ketercapaian kriteria subelemen.
          </div>
        </div>
        <div className="p-2 bg-amber-50 border border-amber-300 rounded text-amber-900">
          <div className="font-bold">MB (Mulai Berkembang)</div>
          <div className="text-[9px] text-amber-800">
            Peserta didik mulai menunjukkan ketercapaian namun belum konsisten.
          </div>
        </div>
        <div className="p-2 bg-emerald-50 border border-emerald-300 rounded text-emerald-900">
          <div className="font-bold">BSH (Berkembang Sesuai Harapan)</div>
          <div className="text-[9px] text-emerald-800">
            Peserta didik mencapai ketercapaian kriteria secara konsisten.
          </div>
        </div>
        <div className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-900">
          <div className="font-bold">SB (Sangat Berkembang)</div>
          <div className="text-[9px] text-blue-800">
            Peserta didik melampaui ketercapaian kriteria dan menginspirasi teman.
          </div>
        </div>
      </div>

      {/* Tabel Penilaian Siswa */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="bg-slate-200 border-b border-black text-center font-bold">
              <th className="border border-black px-1 py-1.5 w-8" rowSpan={2}>
                No
              </th>
              <th className="border border-black px-2 py-1.5 text-left min-w-[140px]" rowSpan={2}>
                Nama Peserta Didik
              </th>
              <th className="border border-black px-1 py-1 uppercase" colSpan={selectedDimensions.length}>
                Capaian Dimensi PPP
              </th>
              <th className="border border-black px-2 py-1.5 text-left min-w-[180px]" rowSpan={2}>
                Catatan Proses & Catatan Kualitatif
              </th>
            </tr>
            <tr className="bg-slate-100 border-b border-black text-center font-bold">
              {selectedDimensions.map((dim) => (
                <th key={dim} className="border border-black px-1 py-1 w-24">
                  {dim}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student.id} className="border-b border-black hover:bg-slate-50">
                <td className="border border-black text-center font-bold">{idx + 1}</td>
                <td className="border border-black px-2 py-1 font-bold text-slate-900">
                  {student.name}
                  <div className="text-[9px] text-slate-500 font-normal">NISN: {student.nisn}</div>
                </td>

                {/* Dimension Ratings */}
                {selectedDimensions.map((dim) => {
                  const level = student.grades[dim] || 'BSH';
                  return (
                    <td key={dim} className="border border-black text-center p-1">
                      <select
                        value={level}
                        onChange={(e) =>
                          handleStudentGradeChange(
                            student.id,
                            dim,
                            e.target.value as 'BB' | 'MB' | 'BSH' | 'SB'
                          )
                        }
                        className={`w-full py-0.5 font-bold rounded text-[10px] text-center outline-none ${
                          level === 'SB'
                            ? 'bg-blue-100 text-blue-900'
                            : level === 'BSH'
                            ? 'bg-emerald-100 text-emerald-900'
                            : level === 'MB'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-900'
                        }`}
                      >
                        <option value="BB">BB</option>
                        <option value="MB">MB</option>
                        <option value="BSH">BSH</option>
                        <option value="SB">SB</option>
                      </select>
                    </td>
                  );
                })}

                <td className="border border-black px-2 py-1 text-slate-800 text-[10px]">
                  {student.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
