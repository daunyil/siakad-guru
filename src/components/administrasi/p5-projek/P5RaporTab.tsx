import React from 'react';
import type { P5StudentAssessment } from './types';

interface P5RaporTabProps {
  students: P5StudentAssessment[];
  selectedClass: string;
  selectedDimensions: string[];
  projectTitle: string;
}

export const P5RaporTab: React.FC<P5RaporTabProps> = ({
  students,
  selectedClass,
  selectedDimensions,
  projectTitle,
}) => {
  return (
    <div className="space-y-4 font-sans">
      <h4 className="font-bold text-xs uppercase underline font-serif">
        REKAPITULASI CATATAN PROSES DALAM RAPOR PROJEK (P5)
      </h4>

      <div className="space-y-3">
        {students.map((student, idx) => (
          <div key={student.id} className="border border-black p-3 rounded bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-300 pb-1.5 font-bold">
              <span>
                {idx + 1}. {student.name} (NISN: {student.nisn})
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                Kelas {selectedClass}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] pt-1">
              {selectedDimensions.map((dim) => {
                const level = student.grades[dim] || 'BSH';
                return (
                  <div key={dim} className="bg-white border p-1.5 rounded flex items-center justify-between">
                    <span className="font-medium text-slate-700">{dim}:</span>
                    <span
                      className={`font-black px-1.5 py-0.5 rounded text-[9px] ${
                        level === 'SB'
                          ? 'bg-blue-600 text-white'
                          : level === 'BSH'
                          ? 'bg-emerald-600 text-white'
                          : level === 'MB'
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {level === 'SB'
                        ? 'Sangat Berkembang'
                        : level === 'BSH'
                        ? 'Berkembang Sesuai Harapan'
                        : level === 'MB'
                        ? 'Mulai Berkembang'
                        : 'Belum Berkembang'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] font-serif text-slate-800 pt-1 leading-relaxed border-t border-slate-200">
              <strong>Catatan Proses Rapor P5:</strong> Dalam mengerjakan projek "{projectTitle}", {student.name} {student.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
