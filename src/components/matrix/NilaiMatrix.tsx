import React from 'react';
import type { GradeEntry, GradeBook, SchoolProfile } from '../../types';

interface NilaiMatrixProps {
  records: GradeEntry[];
  gradeBook?: GradeBook | null;
  school?: SchoolProfile;
  teacherName?: string;
  teacherNip?: string;
  yearLabel?: string;
  classLabel?: string;
  subject?: string;
  semester?: 1 | 2;
}

function predikat(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  return 'D';
}

function fmtScore(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return '-';
  return String(Math.round(val));
}

export const NilaiMatrix: React.FC<NilaiMatrixProps> = ({
  records,
  gradeBook,
  school,
  teacherName,
  teacherNip,
  yearLabel = '2024/2025',
  classLabel = 'VII-A',
  subject = 'Matematika',
  semester = 1,
}) => {
  const kdCount = gradeBook?.kdCount ?? 10;
  const isPaSplit = gradeBook?.isPaSplit ?? false;
  const kdLabels = Array.from({ length: kdCount }, (_, i) => `TP ${i + 1}`);

  return (
    <div className="document-page bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 text-black text-xs font-serif leading-tight overflow-x-auto" id="rekap-nilai-doc">
      {/* ── KOP JUDUL DOKUMEN ── */}
      <div className="text-center mb-4">
        <h1 className="text-base font-bold uppercase tracking-wider text-slate-900">
          REKAP PENILAIAN HASIL BELAJAR SISWA (DAFTAR NILAI)
        </h1>
        <h2 className="text-xs font-bold uppercase text-slate-800">
          {school?.name ?? 'SMP NEGERI 8 BANTAN'} — TAHUN PELAJARAN {yearLabel}
        </h2>
      </div>

      {/* ── METADATA HEADER TABLE ── */}
      <table className="w-full border-collapse mb-4 text-[11px] font-bold text-slate-800 border-b border-black pb-2" style={{ border: 'none', borderBottom: '1px solid black', width: '100%' }}>
        <tbody>
          <tr style={{ border: 'none' }}>
            <td className="text-left align-top p-0" style={{ border: 'none', textAlign: 'left', width: '50%' }}>
              <div>MATA PELAJARAN : {subject.toUpperCase()}</div>
              <div>KELAS / SEMESTER : {classLabel} / {semester === 1 ? '1 (Ganjil)' : '2 (Genap)'}</div>
            </td>
            <td className="text-right align-top p-0" style={{ border: 'none', textAlign: 'right', width: '50%' }}>
              <div>GURU MAPEL : {teacherName ?? '----------------'}</div>
              <div>JUMLAH SISWA : {records.length} Orang</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── TABEL MATRIKS NILAI ── */}
      <div className="overflow-x-auto">
        <table className="rekap-matrix-table w-full border-collapse border border-black text-[9px] table-fixed">
          <thead>
            <tr className="bg-slate-200 border-b border-black">
              <th rowSpan={isPaSplit ? 3 : 2} className="border border-black text-center align-top font-bold w-7 bg-slate-200">
                NO.
              </th>
              <th rowSpan={isPaSplit ? 3 : 2} className="border border-black text-left px-2.5 align-top font-bold min-w-[180px] w-56 bg-slate-200">
                NAMA SISWA
              </th>
              {isPaSplit ? (
                <th colSpan={kdCount * 2} className="border border-black text-center font-bold">
                  PENILAIAN FORMATIF & SUMATIF LINGKUP MATERI
                </th>
              ) : (
                <th colSpan={kdCount} className="border border-black text-center font-bold">
                  NILAI TUJUAN PEMBELAJARAN
                </th>
              )}
              <th rowSpan={isPaSplit ? 3 : 2} className="border-y border-r border-l-2 border-black text-center align-top font-bold bg-slate-200 w-12">
                PTS
              </th>
              <th rowSpan={isPaSplit ? 3 : 2} className="border-y border-r border-black text-center align-top font-bold bg-slate-200 w-12">
                PAS
              </th>
              <th rowSpan={isPaSplit ? 3 : 2} className="border-y border-r border-black text-center align-top font-bold bg-slate-200 w-12">
                NA
              </th>
              <th rowSpan={isPaSplit ? 3 : 2} className="border border-black text-center align-top font-bold bg-slate-200 w-16">
                PREDIKAT
              </th>
            </tr>

            {isPaSplit && (
              <tr className="bg-slate-100 border-b border-black">
                <th colSpan={kdCount} className="border border-black text-center font-bold text-[8px]">
                  Ulangan Harian / Test
                </th>
                <th colSpan={kdCount} className="border border-black text-center font-bold text-[8px]">
                  Tugas / Praktik
                </th>
              </tr>
            )}

            <tr className="bg-slate-100 border-b border-black">
              {isPaSplit ? (
                <>
                  {kdLabels.map((kd) => (
                    <th key={`u-${kd}`} className="border border-black text-center text-[8px] font-bold px-1 py-0.5">
                      {kd}
                    </th>
                  ))}
                  {kdLabels.map((kd) => (
                    <th key={`t-${kd}`} className="border border-black text-center text-[8px] font-bold px-1 py-0.5">
                      {kd}
                    </th>
                  ))}
                </>
              ) : (
                kdLabels.map((kd) => (
                  <th key={kd} className="border border-black text-center text-[8px] font-bold px-1 py-0.5">
                    {kd}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={isPaSplit ? kdCount * 2 + 6 : kdCount + 6} className="border border-black text-center py-6 text-slate-500 italic">
                  Belum ada data nilai untuk kelas ini.
                </td>
              </tr>
            ) : (
              records.map((rec, idx) => (
                <tr key={rec.studentId} className="border-b border-black hover:bg-slate-50 transition-colors">
                  <td className="border border-black text-center font-medium py-1">{idx + 1}</td>
                  <td className="border border-black text-left px-2.5 font-bold text-slate-950 text-[10px] uppercase leading-snug whitespace-normal break-words py-1.5" title={rec.studentName}>
                    {rec.studentName}
                  </td>

                  {isPaSplit ? (
                    <>
                      {kdLabels.map((_, kdIdx) => {
                        const kdNum = kdIdx + 1;
                        return (
                          <td key={`u-${kdNum}`} className="border border-black text-center text-[9px]">
                            {fmtScore(rec.ulanganScores[kdNum])}
                          </td>
                        );
                      })}
                      {kdLabels.map((_, kdIdx) => {
                        const kdNum = kdIdx + 1;
                        return (
                          <td key={`t-${kdNum}`} className="border border-black text-center text-[9px]">
                            {fmtScore(rec.tugasScores[kdNum])}
                          </td>
                        );
                      })}
                    </>
                  ) : (
                    kdLabels.map((_, kdIdx) => {
                      const kdNum = kdIdx + 1;
                      return (
                        <td key={kdNum} className="border border-black text-center text-[9px]">
                          {fmtScore(rec.finalKDScores[kdNum])}
                        </td>
                      );
                    })
                  )}

                  <td className="border-y border-r border-l-2 border-black text-center font-bold bg-slate-50">
                    {fmtScore(rec.pts)}
                  </td>
                  <td className="border-y border-r border-black text-center font-bold bg-slate-50">
                    {fmtScore(rec.pas)}
                  </td>
                  <td className="border-y border-r border-black text-center font-bold bg-slate-100 text-blue-900">
                    {fmtScore(rec.finalScore)}
                  </td>
                  <td className="border border-black text-center font-bold text-[9px]">
                    <span className={`px-1.5 py-0.5 rounded ${
                      rec.finalScore >= 85
                        ? 'text-emerald-800 bg-emerald-100'
                        : rec.finalScore >= 75
                        ? 'text-blue-800 bg-blue-100'
                        : 'text-amber-800 bg-amber-100'
                    }`}>
                      {predikat(rec.finalScore)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── TTD DUA KOLOM FORMAL ── */}
      <div className="mt-8 pt-4 border-t border-slate-300">
        <table className="w-full text-[10px] text-slate-900 border-collapse" style={{ border: 'none', width: '100%' }}>
          <tbody>
            <tr style={{ border: 'none' }}>
              <td className="text-center align-top" style={{ border: 'none', width: '50%', textAlign: 'center' }}>
                <div style={{ visibility: 'hidden' }}>
                  {school?.village ?? 'Muntai'}, .................... {yearLabel.split('/')[0]}
                </div>
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala Sekolah</div>
                <div className="h-16" style={{ height: '60px' }} />
                <div className="font-bold underline uppercase">{school?.headmasterName ?? '----------------'}</div>
                <div>NIP. {school?.headmasterNip ?? '----------------'}</div>
              </td>
              <td className="text-center align-top" style={{ border: 'none', width: '50%', textAlign: 'center' }}>
                <div>{school?.village ?? 'Muntai'}, .................... {yearLabel.split('/')[0]}</div>
                <div className="font-bold">Guru Mata Pelajaran</div>
                <div className="h-16" style={{ height: '60px' }} />
                <div className="font-bold underline uppercase">{teacherName ?? '----------------'}</div>
                <div>NIP. {teacherNip ?? '----------------'}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
