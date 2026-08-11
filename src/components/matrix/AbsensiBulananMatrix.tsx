import React from 'react';
import type { MonthlyAttendanceMatrix, SchoolProfile } from '../../types';

interface AbsensiBulananMatrixProps {
  matrix: MonthlyAttendanceMatrix;
  school?: SchoolProfile;
  teacherName?: string;
  teacherNip?: string;
  yearLabel?: string;
  classLabel?: string;
  teacherRole?: string;
}

function statusMark(status: string | null): string {
  if (!status) return '';
  if (status === 'present') return '';
  if (status === 'sick') return 'S';
  if (status === 'excused') return 'I';
  if (status === 'late') return 'T';
  if (status === 'absent') return 'A';
  return '';
}

export const AbsensiBulananMatrix: React.FC<AbsensiBulananMatrixProps> = ({
  matrix,
  school,
  teacherName,
  teacherNip,
  yearLabel = '2024/2025',
  classLabel = 'VII-A',
  teacherRole = 'Wali Kelas / Guru Mapel',
}) => {
  const { monthName, year, daysInMonth, students } = matrix;

  return (
    <div className="document-page bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 text-black text-xs font-serif leading-tight overflow-x-auto" id="rekap-absensi-doc">
      {/* ── 1. KOP JUDUL DOKUMEN (CENTER) ── */}
      <div className="text-center mb-4">
        <h1 className="text-base font-bold uppercase tracking-wider text-slate-900">
          ABSENSI KEHADIRAN BULANAN SISWA/I {school?.name ?? 'SMP NEGERI 8 BANTAN'}
        </h1>
        <h2 className="text-xs font-bold uppercase text-slate-800">
          TAHUN PELAJARAN {yearLabel}
        </h2>
      </div>

      {/* ── 2. METADATA TERPISAH ── */}
      <table className="w-full border-collapse mb-3 text-[11px] font-bold text-slate-800 border-b border-black pb-2" style={{ border: 'none', borderBottom: '1px solid black', width: '100%' }}>
        <tbody>
          <tr style={{ border: 'none' }}>
            <td className="text-left p-0" style={{ border: 'none', textAlign: 'left', width: '50%' }}>
              KELAS : {classLabel}
            </td>
            <td className="text-right p-0" style={{ border: 'none', textAlign: 'right', width: '50%' }}>
              BULAN : {monthName} {year}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── 3. TABEL MATRIKS MONOKROM (INK-SAVER) ── */}
      <div className="overflow-x-auto">
        <table className="rekap-matrix-table w-full border-collapse border border-black text-[9px] table-fixed">
          <thead>
            {/* Super-header */}
            <tr className="bg-slate-200 border-b border-black">
              <th rowSpan={2} className="border border-black text-center align-middle font-bold px-1 w-8 bg-slate-200">
                NO.
              </th>
              <th rowSpan={2} className="border border-black text-left px-2 align-middle font-bold w-48 bg-slate-200 whitespace-nowrap">
                NAMA SISWA
              </th>
              <th rowSpan={2} className="border border-black text-center align-middle font-bold w-20 bg-slate-200">
                NISN
              </th>
              <th colSpan={daysInMonth} className="border border-black text-center font-bold">
                TANGGAL
              </th>
              <th colSpan={4} className="border-y border-r border-l-2 border-black text-center font-bold bg-slate-200 w-24">
                REKAP
              </th>
            </tr>
            {/* Date columns + Rekap columns */}
            <tr className="bg-slate-100 border-b border-black">
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th key={i + 1} className="border border-black text-center text-[8px] font-bold w-6">
                  {i + 1}
                </th>
              ))}
              <th className="border-y border-r border-l-2 border-black text-center text-[8px] font-bold bg-slate-200">S</th>
              <th className="border-y border-r border-black text-center text-[8px] font-bold bg-slate-200">I</th>
              <th className="border-y border-r border-black text-center text-[8px] font-bold bg-slate-200">A</th>
              <th className="border-y border-r border-black text-center text-[8px] font-bold bg-slate-200">JLH</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={daysInMonth + 7} className="border border-black text-center py-6 text-slate-500 italic">
                  Belum ada data siswa untuk bulan ini.
                </td>
              </tr>
            ) : (
              students.map((student, idx) => (
                <tr key={student.studentId} className="border-b border-black hover:bg-slate-50 transition-colors">
                  <td className="border border-black text-center font-medium py-1">{idx + 1}</td>
                  <td className="border border-black text-left px-2 font-medium truncate uppercase" title={student.studentName}>
                    {student.studentName}
                  </td>
                  <td className="border border-black text-center text-[8px]">{student.nisn ?? '-'}</td>
                  
                  {Array.from({ length: daysInMonth }, (_, d) => {
                    const day = d + 1;
                    const status = student.statusByDate[day];
                    const mark = statusMark(status);
                    return (
                      <td
                        key={day}
                        className={`border border-black text-center text-[9px] font-bold ${
                          mark === 'A'
                            ? 'text-red-700 bg-red-50'
                            : mark === 'S'
                            ? 'text-amber-700'
                            : mark === 'I'
                            ? 'text-blue-700'
                            : ''
                        }`}
                      >
                        {mark}
                      </td>
                    );
                  })}

                  <td className="border-y border-r border-l-2 border-black text-center font-bold bg-slate-50">
                    {student.rekap.sakit > 0 ? student.rekap.sakit : ''}
                  </td>
                  <td className="border-y border-r border-black text-center font-bold bg-slate-50">
                    {student.rekap.izin > 0 ? student.rekap.izin : ''}
                  </td>
                  <td className="border-y border-r border-black text-center font-bold bg-slate-50 text-red-600">
                    {student.rekap.alpa > 0 ? student.rekap.alpa : ''}
                  </td>
                  <td className="border-y border-r border-black text-center font-bold bg-slate-100">
                    {student.rekap.jlh > 0 ? student.rekap.jlh : ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── 4. FOOTER / TTD ── */}
      <div className="mt-8 pt-4 border-t border-slate-300">
        <table className="w-full text-[10px] text-slate-900 border-collapse" style={{ border: 'none', width: '100%' }}>
          <tbody>
            <tr style={{ border: 'none' }}>
              <td className="text-left align-bottom text-slate-600 italic" style={{ border: 'none', width: '50%', textAlign: 'left', verticalAlign: 'bottom' }}>
                Keterangan: S = Sakit | I = Izin | A = Alpa | T = Terlambat
              </td>
              <td className="text-center align-top" style={{ border: 'none', width: '50%', textAlign: 'center' }}>
                <div>{school?.village ?? 'Bantan'}, .................... {year}</div>
                <div className="font-bold mt-1">{teacherRole}</div>
                <div className="h-16" style={{ height: '60px' }} />
                <div className="font-bold underline uppercase">{teacherName ?? '___________________'}</div>
                <div>NIP. {teacherNip ?? '................................'}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
