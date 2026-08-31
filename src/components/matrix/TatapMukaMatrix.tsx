import React from 'react';
import type { TatapMukaAttendanceMatrix, SchoolProfile, HeaderStyleOption, HeaderLayoutOption } from '../../types';

interface TatapMukaMatrixProps {
  matrix: TatapMukaAttendanceMatrix;
  school?: SchoolProfile;
  teacherName?: string;
  teacherNip?: string;
  yearLabel?: string;
  classLabel?: string;
  subject?: string;
  semester?: 1 | 2;
  attendanceThreshold?: number; // default 0.75 (75%)
  headerStyle?: HeaderStyleOption;
  headerLayout?: HeaderLayoutOption;
}

function statusMark(status: string | null): string {
  if (!status) return '';
  if (status === 'present') return 'H';
  if (status === 'sick') return 'S';
  if (status === 'excused') return 'I';
  if (status === 'late') return 'T';
  if (status === 'absent') return 'A';
  return '';
}

function formatShortDate(dateISO?: string): string {
  if (!dateISO) return '-';
  const parts = dateISO.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateISO;
}

export const TatapMukaMatrix: React.FC<TatapMukaMatrixProps> = ({
  matrix,
  school,
  teacherName,
  teacherNip,
  yearLabel = '2024/2025',
  classLabel = 'VII-A',
  subject = 'Matematika',
  semester = 1,
  attendanceThreshold = 0.75,
  headerStyle = 'slate',
  headerLayout = 'gabung',
}) => {
  const { meetings, students } = matrix;
  const totalMeetings = meetings.length;

  // Header Theme Classes
  const getHeaderTheme = () => {
    switch (headerStyle) {
      case 'navy':
        return {
          bg1: 'bg-slate-900 text-white',
          bg2: 'bg-slate-800 text-slate-100',
          rekapBg: 'bg-slate-800 text-white',
          dateColor: 'text-blue-200',
          divider: 'border-b-2 border-slate-400',
        };
      case 'emerald':
        return {
          bg1: 'bg-emerald-900 text-white',
          bg2: 'bg-emerald-800 text-emerald-50',
          rekapBg: 'bg-emerald-800 text-white',
          dateColor: 'text-emerald-200',
          divider: 'border-b-2 border-emerald-400/80',
        };
      case 'minimalist':
        return {
          bg1: 'bg-white text-black',
          bg2: 'bg-slate-100 text-black',
          rekapBg: 'bg-slate-100 text-black',
          dateColor: 'text-slate-700',
          divider: 'border-b-2 border-black',
        };
      case 'slate':
      default:
        return {
          bg1: 'bg-slate-200 text-slate-900',
          bg2: 'bg-slate-100 text-slate-800',
          rekapBg: 'bg-slate-200 text-slate-900',
          dateColor: 'text-slate-700',
          divider: 'border-b-2 border-slate-700',
        };
    }
  };

  const theme = getHeaderTheme();

  return (
    <div className="document-page bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 text-black text-xs font-serif leading-tight overflow-x-auto" id="rekap-tatapmuka-doc">
      {/* ── KOP JUDUL DOKUMEN ── */}
      <div className="text-center mb-4">
        <h1 className="text-base font-bold uppercase tracking-wider text-slate-900">
          DAFTAR HADIR DAN REKAP TATAP MUKA SISWA
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
              <div>GURU MATA PELAJARAN : {teacherName ?? '----------------'}</div>
              <div>TOTAL PERTEMUAN : {totalMeetings} Pertemuan</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── TABEL REKAP TATAP MUKA ── */}
      <div className="overflow-x-auto">
        <table className="rekap-matrix-table w-full border-collapse border border-black text-[9px]">
          <thead>
            {headerLayout === 'gabung' ? (
              /* ── MODEL 1: GABUNG 1 ROW (PERTEMUAN & TANGGAL DALAM 1 SEL KOLOM HEADER) ── */
              <tr className={`${theme.bg1} border-b border-black`}>
                <th className="border border-black text-center align-middle font-bold w-7 py-2">
                  NO.
                </th>
                <th className="border border-black text-left px-2 align-middle font-bold w-44 whitespace-nowrap">
                  NAMA SISWA
                </th>
                <th className="border border-black text-center align-middle font-bold w-16">
                  NISN
                </th>

                {totalMeetings === 0 ? (
                  <th className="border border-black text-center text-[8px] py-2">
                    1
                  </th>
                ) : (
                  meetings.map((m) => (
                    <th key={m.meetingNumber} className="border border-black text-center align-middle text-[8px] font-bold px-0.5 py-1.5 w-7 min-w-[26px]">
                      <div className="flex flex-col items-center justify-center w-full">
                        <span className="text-[9px] font-bold leading-none">{m.meetingNumber}</span>
                        <div className={`w-full ${theme.divider} my-1`} />
                        <span className={`inline-block [writing-mode:vertical-lr] rotate-180 text-[7.5px] font-serif font-semibold ${theme.dateColor} leading-none tracking-normal`}>
                          {formatShortDate(m.dateISO)}
                        </span>
                      </div>
                    </th>
                  ))
                )}

                <th className="border-y border-r border-l-2 border-black text-center text-[8px] font-bold w-6" title="Hadir">H</th>
                <th className="border-y border-r border-black text-center text-[8px] font-bold w-6" title="Sakit">S</th>
                <th className="border-y border-r border-black text-center text-[8px] font-bold w-6" title="Izin">I</th>
                <th className="border-y border-r border-black text-center text-[8px] font-bold w-6" title="Alpa">A</th>
                <th className="border-y border-r border-black text-center align-middle font-bold w-16 px-1">
                  HADIR (%)
                </th>
              </tr>
            ) : (
              /* ── MODEL 2: BERTINGKAT 3 ROW (SEPERTI REFERENSI GAMBAR USER) ── */
              <>
                {/* BARIS 1: SUPER HEADER */}
                <tr className={`${theme.bg1} border-b border-black`}>
                  <th rowSpan={3} className="border border-black text-center align-middle font-bold w-7">
                    NO.
                  </th>
                  <th rowSpan={3} className="border border-black text-left px-2 align-middle font-bold w-44 whitespace-nowrap">
                    NAMA SISWA
                  </th>
                  <th rowSpan={3} className="border border-black text-center align-middle font-bold w-16">
                    NISN
                  </th>
                  <th colSpan={Math.max(1, totalMeetings)} className="border border-black text-center font-bold py-1 text-[10px] tracking-wide uppercase">
                    Pertemuan ke / tanggal
                  </th>
                  <th colSpan={4} className={`border-y border-r border-l-2 border-black text-center align-middle font-bold ${theme.rekapBg}`}>
                    REKAP
                  </th>
                  <th rowSpan={3} className={`border-y border-r border-black text-center align-middle font-bold ${theme.rekapBg} w-16`}>
                    HADIR (%)
                  </th>
                </tr>

                {/* BARIS 2: NOMOR PERTEMUAN (1, 2, 3, ...) & SUBHEADER H, S, I, A */}
                <tr className={`${theme.bg2} border-b border-black`}>
                  {totalMeetings === 0 ? (
                    <th className="border border-black text-center text-[8px] py-1 font-bold">1</th>
                  ) : (
                    meetings.map((m) => (
                      <th key={m.meetingNumber} className="border border-black text-center align-middle text-[9px] font-bold py-1 w-7 min-w-[26px]">
                        {m.meetingNumber}
                      </th>
                    ))
                  )}
                  <th rowSpan={2} className="border border-black text-center align-middle text-[8px] font-bold w-6" title="Hadir">H</th>
                  <th rowSpan={2} className="border border-black text-center align-middle text-[8px] font-bold w-6" title="Sakit">S</th>
                  <th rowSpan={2} className="border border-black text-center align-middle text-[8px] font-bold w-6" title="Izin">I</th>
                  <th rowSpan={2} className="border border-black text-center align-middle text-[8px] font-bold w-6" title="Alpa">A</th>
                </tr>

                {/* BARIS 3: TANGGAL PERTEMUAN (VERTIKAL) */}
                <tr className={`${theme.bg2} border-b border-black`}>
                  {totalMeetings === 0 ? (
                    <th className="border border-black text-center text-[8px] py-1">-</th>
                  ) : (
                    meetings.map((m) => (
                      <th key={m.meetingNumber} className="border border-black text-center align-middle px-0.5 py-1.5 w-7 min-w-[26px]">
                        <span className={`inline-block [writing-mode:vertical-lr] rotate-180 text-[7.5px] font-serif font-semibold ${theme.dateColor} leading-none tracking-normal`}>
                          {formatShortDate(m.dateISO)}
                        </span>
                      </th>
                    ))
                  )}
                </tr>
              </>
            )}
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={Math.max(1, totalMeetings) + 8} className="border border-black text-center py-6 text-slate-500 italic">
                  Belum ada data sesi tatap muka untuk kelas ini.
                </td>
              </tr>
            ) : (
              students.map((student, idx) => {
                let hadirCount = 0;
                let sakitCount = 0;
                let izinCount = 0;
                let alpaCount = 0;

                meetings.forEach((m) => {
                  const status = m.attendanceByStudent[student.studentId];
                  if (status === 'sick') sakitCount++;
                  else if (status === 'excused') izinCount++;
                  else if (status === 'absent') alpaCount++;
                  else hadirCount++; // present or late or default
                });

                const percentage = totalMeetings > 0 ? hadirCount / totalMeetings : 1;
                const isWarning = percentage < attendanceThreshold;

                return (
                  <tr key={student.studentId} className="border-b border-black hover:bg-slate-50 transition-colors">
                    <td className="border border-black text-center font-medium py-1">{idx + 1}</td>
                    <td className="border border-black text-left px-2 font-medium truncate uppercase" title={student.studentName}>
                      {student.studentName}
                    </td>
                    <td className="border border-black text-center text-[8px]">{student.nisn ?? '-'}</td>

                    {totalMeetings === 0 ? (
                      <td className="border border-black text-center text-[8px]">-</td>
                    ) : (
                      meetings.map((m) => {
                        const status = m.attendanceByStudent[student.studentId];
                        const mark = statusMark(status);
                        return (
                          <td
                            key={m.meetingNumber}
                            className={`border border-black text-center text-[8px] font-bold ${
                              mark === 'A'
                                ? 'text-red-700 bg-red-100'
                                : mark === 'S'
                                ? 'text-amber-700'
                                : mark === 'I'
                                ? 'text-blue-700'
                                : 'text-slate-700'
                            }`}
                          >
                            {mark || 'H'}
                          </td>
                        );
                      })
                    )}

                    <td className="border-y border-r border-l-2 border-black text-center font-bold bg-slate-50 text-slate-800">
                      {hadirCount}
                    </td>
                    <td className="border-y border-r border-black text-center font-bold bg-slate-50 text-amber-800">
                      {sakitCount}
                    </td>
                    <td className="border-y border-r border-black text-center font-bold bg-slate-50 text-blue-800">
                      {izinCount}
                    </td>
                    <td className="border-y border-r border-black text-center font-bold bg-slate-50 text-red-800">
                      {alpaCount}
                    </td>
                    <td className={`border-y border-r border-black text-center font-bold ${
                      isWarning ? 'bg-red-100 text-red-800' : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {Math.round(percentage * 100)}%
                    </td>
                  </tr>
                );
              })
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
