import React from 'react';
import type { GradeBook, TeachingAssignment, ClassRoster } from '../../types';
import { Edit3, CheckCircle2 } from 'lucide-react';

interface QuickScoreEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeBook: GradeBook;
  currentAssignment: TeachingAssignment;
  currentRoster: ClassRoster;
  editStudentId: string;
  setEditStudentId: (id: string) => void;
  editPts: number;
  setEditPts: (val: number) => void;
  editPas: number;
  setEditPas: (val: number) => void;
  editUlangan: Record<number, number>;
  setEditUlangan: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  editTugas: Record<number, number>;
  setEditTugas: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  handleKdCountChange: (count: number) => void;
  handleSaveStudentScore: () => void;
}

export const QuickScoreEditModal: React.FC<QuickScoreEditModalProps> = ({
  isOpen,
  onClose,
  gradeBook,
  currentAssignment,
  currentRoster,
  editStudentId,
  setEditStudentId,
  editPts,
  setEditPts,
  editPas,
  setEditPas,
  editUlangan,
  setEditUlangan,
  editTugas,
  setEditTugas,
  handleKdCountChange,
  handleSaveStudentScore,
}) => {
  if (!isOpen) return null;

  const liveSumKD = Array.from({ length: gradeBook.kdCount }, (_, i) => {
    const kdNum = i + 1;
    const u = editUlangan[kdNum] ?? 75;
    const t = editTugas[kdNum] ?? 80;
    return Math.round((u + t) / 2);
  }).reduce((a, b) => a + b, 0);

  const liveAvgKD = liveSumKD / (gradeBook.kdCount || 1);
  const liveFinalScore = Math.round((liveAvgKD + editPts + editPas) / 3);
  const livePredikat = liveFinalScore >= 90 ? 'A' : liveFinalScore >= 80 ? 'B' : liveFinalScore >= 70 ? 'C' : 'D';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3 shrink-0">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-600" />
            <span>Input / Edit Nilai Siswa (KD / TP & Exam)</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pilih Siswa ({currentAssignment.classLabel})
              </label>
              <select
                value={editStudentId}
                onChange={(e) => {
                  const sid = e.target.value;
                  setEditStudentId(sid);
                  const ent = gradeBook.entries.find((x) => x.studentId === sid);
                  if (ent) {
                    setEditPts(ent.pts ?? 80);
                    setEditPas(ent.pas ?? 85);
                    setEditUlangan({ ...(ent.ulanganScores || {}) });
                    setEditTugas({ ...(ent.tugasScores || {}) });
                  }
                }}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                {currentRoster.students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.number}. {s.name} ({s.nisn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah KD / TP ({currentAssignment.subject})
              </label>
              <select
                value={gradeBook.kdCount}
                onChange={(e) => handleKdCountChange(Number(e.target.value))}
                className="w-full bg-white border border-blue-300 text-blue-900 rounded-lg p-2 font-bold"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map((num) => (
                  <option key={num} value={num}>
                    {num} Kompetensi Dasar / TP
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* KD / TP Scores Grid */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>
                {gradeBook.isPaSplit
                  ? 'Nilai Formatif (Ulangan) & Sumatif (Tugas) per TP:'
                  : 'Nilai Tujuan Pembelajaran (TP 1 - TP ' + gradeBook.kdCount + '):'}
              </span>
              <span className="text-[11px] font-normal text-slate-500">Total: {gradeBook.kdCount} TP</span>
            </h4>
            <div className={`grid gap-2 max-h-60 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/50 ${
              gradeBook.isPaSplit ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
            }`}>
              {Array.from({ length: gradeBook.kdCount }, (_, i) => {
                const kdNum = i + 1;
                const uVal = editUlangan[kdNum] ?? 75;
                const tVal = editTugas[kdNum] ?? 80;
                const tpScore = Math.round((uVal + tVal) / 2);

                if (!gradeBook.isPaSplit) {
                  return (
                    <div key={kdNum} className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                      <div className="font-bold text-slate-800 text-[11px] text-center">
                        TP {kdNum}
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={uVal}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditUlangan((prev) => ({ ...prev, [kdNum]: val }));
                          setEditTugas((prev) => ({ ...prev, [kdNum]: val }));
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 font-bold text-blue-900 text-center text-xs"
                      />
                    </div>
                  );
                }

                return (
                  <div key={kdNum} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="font-bold text-slate-800 flex justify-between text-[11px]">
                      <span>TP {kdNum}</span>
                      <span className="text-blue-600">Rata: {tpScore}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <span className="text-[9px] text-slate-500 block">Ulangan</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={uVal}
                          onChange={(e) =>
                            setEditUlangan((prev) => ({ ...prev, [kdNum]: Number(e.target.value) }))
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 font-semibold text-slate-800 text-center text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block">Tugas</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={tVal}
                          onChange={(e) =>
                            setEditTugas((prev) => ({ ...prev, [kdNum]: Number(e.target.value) }))
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 font-semibold text-slate-800 text-center text-xs"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PTS & PAS */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nilai PTS (Tengah Semester)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={editPts}
                onChange={(e) => setEditPts(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900 text-center"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nilai PAS (Akhir Semester)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={editPas}
                onChange={(e) => setEditPas(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900 text-center"
              />
            </div>
          </div>

          {/* Live Preview Score Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Hasil Kalkulasi Otomatis</div>
              <div className="text-xs text-blue-900 font-medium">
                Rata-rata KD: <b>{Math.round(liveAvgKD)}</b> · PTS: <b>{editPts}</b> · PAS: <b>{editPas}</b>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-[10px] text-blue-600 font-medium">Nilai Akhir (NA)</div>
                <div className="text-xl font-extrabold text-blue-900">{liveFinalScore}</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                liveFinalScore >= 85
                  ? 'text-emerald-800 bg-emerald-100'
                  : liveFinalScore >= 75
                  ? 'text-blue-800 bg-blue-100'
                  : 'text-amber-800 bg-amber-100'
              }`}>
                Predikat {livePredikat}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            onClick={handleSaveStudentScore}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
