import React from 'react';
import type { JurnalMatrix as JurnalMatrixType, SchoolProfile } from '../../types';
import { Zap, BookOpen, Edit3 } from 'lucide-react';

interface JurnalMatrixProps {
  matrix: JurnalMatrixType;
  school?: SchoolProfile;
  teacherName?: string;
  teacherNip?: string;
  yearLabel?: string;
  classLabel?: string;
  subject?: string;
  semester?: 1 | 2;
  onOpenExpressForMeeting?: (dateISO: string, meetingNum: number, tpTitle: string) => void;
}

function formatDateIndo(dateISO: string): string {
  if (!dateISO) return '-';
  const parts = dateISO.split('-');
  if (parts.length !== 3) return dateISO;
  
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  
  return `${days[d.getDay()]}, ${parts[2]}/${Number(parts[1])}/${parts[0]}`;
}

export const JurnalMatrix: React.FC<JurnalMatrixProps> = ({
  matrix,
  school,
  teacherName,
  teacherNip,
  yearLabel = '2024/2025',
  classLabel = 'VII-A',
  subject = 'Matematika',
  semester = 1,
  onOpenExpressForMeeting,
}) => {
  const { rows } = matrix;

  return (
    <div className="space-y-3">
      {onOpenExpressForMeeting && (
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-3.5 rounded-xl shadow-md border border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-lg font-black shadow-xs">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Auto-Sync Jurnal & Presensi Express</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded font-mono">
                  ATP Linked
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Isi jurnal & presensi 1-klik terhubung langsung dengan Alur Tujuan Pembelajaran (ATP) Prosem.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenExpressForMeeting(new Date().toISOString().split('T')[0], 1, 'Auto-Sync ATP')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>+ Input Jurnal Express Today</span>
          </button>
        </div>
      )}

      <div className="document-page bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 text-black text-xs font-serif leading-tight overflow-x-auto" id="rekap-jurnal-doc">
        {/* ── KOP JUDUL DOKUMEN ── */}
        <div className="text-center mb-4">
          <h1 className="text-base font-bold uppercase tracking-wider text-slate-900">
            JURNAL AGENDA MENGAJAR GURU
          </h1>
          <h2 className="text-xs font-bold uppercase text-slate-800">
            {school?.name ?? 'SMP NEGERI 8 BANTAN'}
          </h2>
          <div className="text-[11px] font-bold text-slate-800">
            TAHUN PELAJARAN {yearLabel}
          </div>
        </div>

        {/* ── METADATA HEADER TABLE ── */}
        <table className="w-full border-collapse mb-4 text-[11px] font-bold text-slate-800" style={{ border: 'none', width: '100%' }}>
          <tbody>
            <tr style={{ border: 'none' }}>
              <td className="text-left align-top p-0" style={{ border: 'none', textAlign: 'left', width: '50%' }}>
                <div>MATA PELAJARAN : {subject}</div>
                <div>KELAS / SEMESTER : {classLabel} / {semester === 1 ? '1 (Ganjil)' : '2 (Genap)'}</div>
              </td>
              <td className="text-right align-top p-0" style={{ border: 'none', textAlign: 'right', width: '50%' }}>
                <div>NAMA GURU : {teacherName ?? '----------------'}</div>
                <div>NIP : {teacherNip ?? '----------------'}</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── TABEL MATRIKS JURNAL ── */}
        <div className="overflow-x-auto">
          <table className="rekap-matrix-table w-full border-collapse border border-black text-[9.5px] table-fixed">
            <thead>
              <tr className="bg-slate-100 border-b border-black">
                <th className="border border-black text-center align-middle font-bold w-8 py-1.5">
                  NO.
                </th>
                <th className="border border-black text-center px-1 align-middle font-bold w-28">
                  HARI / TANGGAL
                </th>
                <th className="border border-black text-center align-middle font-bold w-14">
                  JAM KE-
                </th>
                <th className="border border-black text-center px-2 align-middle font-bold w-60">
                  MATERI / TUJUAN PEMBELAJARAN
                </th>
                <th className="border border-black text-center px-2 align-middle font-bold w-60">
                  KEGIATAN PEMBELAJARAN
                </th>
                <th className="border border-black text-center px-1 align-middle font-bold w-24">
                  SISWA TIDAK HADIR
                </th>
                <th className="border border-black text-center align-middle font-bold w-16">
                  KET
                </th>
                {onOpenExpressForMeeting && (
                  <th className="border border-black text-center align-middle font-bold w-16 no-print">
                    AKSI
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={onOpenExpressForMeeting ? 8 : 7} className="border border-black text-center py-6 text-slate-500 italic">
                    Belum ada data jurnal mengajar untuk kelas ini.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => {
                  const endPeriod = row.startPeriod + row.durationJP - 1;
                  const jamKe = row.durationJP > 1 ? `${row.startPeriod} - ${endPeriod}` : `${row.startPeriod}`;
                  const kegiatanTxt = row.actualMaterialTitle || row.note || 'KBM terlaksana sesuai rencana pembelajaran.';

                  return (
                    <tr key={row.sessionId || idx} className="border-b border-black hover:bg-slate-50 transition-colors">
                      <td className="border border-black text-center font-medium py-2">{idx + 1}</td>
                      <td className="border border-black text-center px-1 font-medium">
                        {formatDateIndo(row.dateISO)}
                      </td>
                      <td className="border border-black text-center font-medium">
                        {jamKe}
                      </td>
                      <td className="border border-black text-left px-2 leading-tight">
                        <div className="text-slate-900 font-medium">{row.plannedMaterialTitle ?? '-'}</div>
                      </td>
                      <td className="border border-black text-left px-2 leading-tight text-slate-900">
                        <div>{kegiatanTxt}</div>
                      </td>
                      <td className="border border-black text-center px-1 text-[9px]">
                        {row.absentStudents.length === 0 ? (
                          <span>-</span>
                        ) : (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {row.absentStudents.map((s, i) => (
                              <span key={i} className="bg-rose-50 text-rose-800 px-1 rounded border border-rose-200">
                                {s.name} ({s.reason})
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="border border-black text-center px-1 font-medium text-[9px]">
                        <span className={`px-1 rounded ${row.realizationStatus === 'done' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                          {row.keterangan ?? 'Tuntas'}
                        </span>
                      </td>
                      {onOpenExpressForMeeting && (
                        <td className="border border-black text-center px-1 py-1 no-print">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenExpressForMeeting(
                                row.dateISO,
                                row.meetingNumber,
                                row.plannedMaterialTitle || 'Materi TP'
                              )
                            }
                            className="px-1.5 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[9px] rounded transition-colors inline-flex items-center gap-0.5"
                            title="Edit Express Jurnal & Presensi"
                          >
                            <Zap className="w-2.5 h-2.5 fill-current" />
                            <span>Edit</span>
                          </button>
                        </td>
                      )}
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
    </div>
  );
};
