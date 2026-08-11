import React, { useState, useMemo } from 'react';
import type { TeachingAssignment, AcademicYear, SchoolProfile, AttendanceRecord, TeachingJournal } from '../../types';
import { generateProsemSchedule, ScheduledMeeting } from '../../lib/prosemScheduler';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  Filter,
  BookOpen,
  Sliders,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface ProsemAbsensiScheduleViewProps {
  assignment: TeachingAssignment;
  year: AcademicYear;
  school?: SchoolProfile;
  teacherName?: string;
  teacherNip?: string;
  attendanceRecords: AttendanceRecord[];
  teachingJournals: TeachingJournal[];
  onOpenExpressForMeeting: (dateISO: string, meetingNum: number, tpTitle: string) => void;
}

export const ProsemAbsensiScheduleView: React.FC<ProsemAbsensiScheduleViewProps> = ({
  assignment,
  year,
  school,
  teacherName,
  teacherNip,
  attendanceRecords,
  teachingJournals,
  onOpenExpressForMeeting,
}) => {
  const [dayOfWeek, setDayOfWeek] = useState<string>('Kamis');
  const [filterStatus, setFilterStatus] = useState<'all' | 'kbm' | 'completed' | 'pending'>('all');
  const [jpIntra, setJpIntra] = useState<number>(2);
  const [jpKo, setJpKo] = useState<number>(1);

  // Generate full Prosem schedule with Intrakurikuler & Kokurikuler breakdown
  const rawSchedule = useMemo(() => {
    const classGrade = assignment.classLabel.startsWith('VIII')
      ? 'VIII'
      : assignment.classLabel.startsWith('IX')
      ? 'IX'
      : 'VII';

    const totalJp = assignment.totalJpPerWeek || 3;

    return generateProsemSchedule(
      year.label,
      year.semester,
      assignment.subject,
      classGrade,
      undefined,
      dayOfWeek,
      totalJp,
      jpIntra,
      jpKo
    );
  }, [year.label, year.semester, assignment, dayOfWeek, jpIntra, jpKo]);

  // Enrich with real attendance data
  const enrichedSchedule = useMemo(() => {
    return rawSchedule.map((item) => {
      if (item.status !== 'kbm') {
        return { ...item, hasAttendance: false, presentCount: 0, totalCount: 0, journal: null };
      }

      const recordsForDate = attendanceRecords.filter(
        (r) => r.classId === assignment.classId && r.date === item.dateISO
      );
      const journalForDate = teachingJournals.find(
        (j) => j.classId === assignment.classId && j.date === item.dateISO
      );

      const hasAttendance = recordsForDate.length > 0;
      const presentCount = recordsForDate.filter((r) => r.status === 'present').length;
      const sickCount = recordsForDate.filter((r) => r.status === 'sick').length;
      const excusedCount = recordsForDate.filter((r) => r.status === 'excused').length;
      const absentCount = recordsForDate.filter((r) => r.status === 'absent').length;

      return {
        ...item,
        hasAttendance,
        presentCount,
        sickCount,
        excusedCount,
        absentCount,
        totalCount: recordsForDate.length,
        journal: journalForDate,
      };
    });
  }, [rawSchedule, attendanceRecords, teachingJournals, assignment.classId]);

  // Filtered schedule
  const filteredSchedule = useMemo(() => {
    return enrichedSchedule.filter((item) => {
      if (filterStatus === 'kbm') return item.status === 'kbm';
      if (filterStatus === 'completed') return item.status === 'kbm' && item.hasAttendance;
      if (filterStatus === 'pending') return item.status === 'kbm' && !item.hasAttendance;
      return true;
    });
  }, [enrichedSchedule, filterStatus]);

  // Stats Summary
  const stats = useMemo(() => {
    const totalKbm = enrichedSchedule.filter((i) => i.status === 'kbm').length;
    const completed = enrichedSchedule.filter((i) => i.status === 'kbm' && i.hasAttendance).length;
    const pending = totalKbm - completed;
    const nonKbm = enrichedSchedule.filter((i) => i.status !== 'kbm').length;
    return { totalKbm, completed, pending, nonKbm };
  }, [enrichedSchedule]);

  return (
    <div className="space-y-6 font-sans">
      {/* ── BANNER HEADER & CONTROL BAR ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-md border border-slate-800 space-y-4 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Presensi Mapped to Prosem & Kaldik
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Kelas {assignment.classLabel} • {assignment.subject}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Pemetaan Presensi Berdasarkan Program Semester ({year.label} Sem {year.semester})
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Tanggal pertemuan telah dipetakan secara matematis sesuai Kaldik dan alokasi TP di Prosem. Guru tinggal memilih pertemuan yang akan diisi atau diedit presensinya.
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-3 gap-2 shrink-0 text-center">
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <div className="text-[10px] text-slate-300 font-semibold uppercase">Total KBM</div>
              <div className="text-lg font-black text-white">{stats.totalKbm} <span className="text-[10px] font-normal">Prt</span></div>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-400/30 p-2.5 rounded-xl">
              <div className="text-[10px] text-emerald-200 font-semibold uppercase">Sudah Diisi</div>
              <div className="text-lg font-black text-emerald-300">{stats.completed} <span className="text-[10px] font-normal">Prt</span></div>
            </div>
            <div className="bg-amber-500/20 border border-amber-400/30 p-2.5 rounded-xl">
              <div className="text-[10px] text-amber-200 font-semibold uppercase">Belum Diisi</div>
              <div className="text-lg font-black text-amber-300">{stats.pending} <span className="text-[10px] font-normal">Prt</span></div>
            </div>
          </div>
        </div>

        {/* Filter & Kokurikuler Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-300">Jadwal Hari Mengajar:</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-white rounded-lg font-bold outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
              </select>
            </div>

            {/* Kokurikuler Breakdown Setting */}
            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Sebaran JP/Pekan:
              </span>
              <div className="flex items-center gap-1 text-[11px]">
                <label className="text-slate-300">Intra:</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={jpIntra}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setJpIntra(val);
                  }}
                  className="w-10 px-1 py-0.5 bg-slate-900 border border-slate-600 rounded text-center font-bold text-blue-300"
                />
                <span className="text-slate-400">JP</span>
              </div>
              <span className="text-slate-500 font-black">+</span>
              <div className="flex items-center gap-1 text-[11px]">
                <label className="text-slate-300">Ko-Kurikuler:</label>
                <input
                  type="number"
                  min={0}
                  max={4}
                  value={jpKo}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setJpKo(val);
                  }}
                  className="w-10 px-1 py-0.5 bg-slate-900 border border-slate-600 rounded text-center font-bold text-amber-300"
                />
                <span className="text-slate-400">JP</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua ({enrichedSchedule.length})
              </button>
              <button
                onClick={() => setFilterStatus('kbm')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  filterStatus === 'kbm'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hanya KBM ({stats.totalKbm})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  filterStatus === 'pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⏳ Belum Presensi ({stats.pending})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  filterStatus === 'completed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✓ Tuntas ({stats.completed})
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            💡 Alokasi: <span className="text-blue-300 font-bold">{jpIntra} JP Tatap Muka</span> + <span className="text-amber-300 font-bold">{jpKo} JP Kokurikuler/P5</span> per minggu.
          </div>
        </div>
      </div>

      {/* ── PRINTABLE DOCUMENT CANVAS ── */}
      <div className="document-page bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 text-black text-xs font-serif leading-tight overflow-x-auto">
        {/* KOP HEAD */}
        <div className="text-center mb-4 border-b-2 border-black pb-3">
          <h1 className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-900">
            JADWAL PERTEMUAN KBM & STATUS PRESENSI SISWA
          </h1>
          <h2 className="text-xs font-bold uppercase text-slate-800">
            PEMETAAN PROGRAM SEMESTER (PROSEM) & KALDIK {year.label}
          </h2>
          <p className="text-[11px] font-sans italic text-slate-600 mt-0.5">
            {school?.name || 'SMP NEGERI 8 BANTAN'} | Mata Pelajaran: {assignment.subject} | Kelas: {assignment.classLabel} ({dayOfWeek})
          </p>
        </div>

        {/* SCHEDULING TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-[11px] font-sans">
            <thead>
              <tr className="bg-slate-200 text-center font-bold border-b border-black">
                <th className="border border-black px-1.5 py-2 w-12">Prt. Ke</th>
                <th className="border border-black px-2 py-2 w-36 text-left">Hari & Tanggal Kaldik</th>
                <th className="border border-black px-2 py-2 w-28 text-center">Bulan & Pekan</th>
                <th className="border border-black px-2 py-2 w-20 text-center">Status Kaldik</th>
                <th className="border border-black px-3 py-2 text-left">Target TP / Materi Prosem</th>
                <th className="border border-black px-2 py-2 w-36 text-center">Status Presensi</th>
                <th className="border border-black px-2 py-2 w-28 text-center no-print">Aksi Express</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border border-black p-6 text-center italic text-slate-500">
                    Tidak ada pertemuan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredSchedule.map((item, idx) => {
                  const isKbm = item.status === 'kbm';

                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      KBM
                    </span>
                  );
                  if (item.status === 'mpls') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                        MPLS
                      </span>
                    );
                  } else if (item.status === 'sts') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        STS
                      </span>
                    );
                  } else if (item.status === 'sas') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-900 border border-orange-300">
                        SAS / ASAS
                      </span>
                    );
                  } else if (item.status === 'rapor') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                        RAPOR
                      </span>
                    );
                  } else if (item.status === 'libur') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                        LIBUR
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={`${item.dateISO}-${idx}`}
                      className={`border-b border-black hover:bg-slate-50 transition-colors ${
                        !isKbm ? 'bg-slate-50/70 text-slate-600' : ''
                      }`}
                    >
                      {/* Meeting number */}
                      <td className="border border-black text-center font-bold py-2">
                        {isKbm ? (
                          <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-950 font-black rounded text-[11px]">
                            {item.meetingNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="border border-black px-2 py-2 font-bold text-slate-900">
                        {item.dateFormatted}
                      </td>

                      {/* Month & Week */}
                      <td className="border border-black px-2 py-2 text-center text-slate-700">
                        {item.monthName} (Pekan {item.weekIndexInMonth})
                      </td>

                      {/* Kaldik status */}
                      <td className="border border-black px-2 py-2 text-center">{statusBadge}</td>

                      {/* Material TP */}
                      <td className="border border-black px-3 py-2">
                        {isKbm ? (
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <span className="font-bold text-blue-900">[{item.tpCode}]</span>{' '}
                                <span className="font-medium text-slate-800">{item.tpTitle}</span>
                              </div>
                              <div className="shrink-0 flex items-center gap-1 text-[9px] font-bold">
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-900 rounded border border-blue-200">
                                  {item.jpIntra} JP Intra
                                </span>
                                {item.jpKo > 0 && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded border border-amber-200">
                                    {item.jpKo} JP Ko
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-500 font-sans italic mt-0.5 flex items-center justify-between">
                              <span>Elemen: {item.elementName}</span>
                              <span className="text-slate-600 font-bold">Total: {item.jp} JP/Pekan</span>
                            </div>
                          </div>
                        ) : (
                          <div className="italic text-slate-500 font-serif">{item.tpTitle}</div>
                        )}
                      </td>

                      {/* Attendance status */}
                      <td className="border border-black px-2 py-2 text-center">
                        {isKbm ? (
                          item.hasAttendance ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded text-[10px] border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Terisi ({item.presentCount} Hadir)
                              </span>
                              {(item.sickCount > 0 || item.excusedCount > 0 || item.absentCount > 0) && (
                                <div className="text-[9px] text-slate-600 font-bold">
                                  {item.sickCount > 0 && <span className="text-amber-700 mr-1">S:{item.sickCount}</span>}
                                  {item.excusedCount > 0 && <span className="text-blue-700 mr-1">I:{item.excusedCount}</span>}
                                  {item.absentCount > 0 && <span className="text-rose-700">A:{item.absentCount}</span>}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-900 font-bold rounded text-[10px] border border-amber-300">
                              <Clock className="w-3 h-3 text-amber-600" />
                              ⏳ Belum Presensi
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 italic text-[10px]">Non-KBM</span>
                        )}
                      </td>

                      {/* Action Express */}
                      <td className="border border-black px-2 py-2 text-center no-print">
                        {isKbm ? (
                          <button
                            type="button"
                            onClick={() =>
                              onOpenExpressForMeeting(
                                item.dateISO,
                                item.meetingNumber,
                                `[${item.tpCode}] ${item.tpTitle}`
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 mx-auto ${
                              item.hasAttendance
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                            }`}
                          >
                            <Zap className="w-3 h-3 fill-current" />
                            <span>{item.hasAttendance ? 'Edit Presensi' : 'Isi Absen'}</span>
                          </button>
                        ) : (
                          <span className="text-slate-300 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="pt-8 flex justify-between font-serif text-xs">
          <div className="text-center w-56">
            <div>Mengetahui,</div>
            <div>Kepala {school?.name || 'SMP NEGERI 8 BANTAN'}</div>
            <div className="h-16" />
            <div className="font-bold underline">{school?.headmasterName || 'Drs. H. M. YUSUF, M.Pd.'}</div>
            <div>NIP. {school?.headmasterNip || '19680512 199403 1 004'}</div>
          </div>

          <div className="text-center w-56">
            <div>Bantan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div>Guru Mata Pelajaran</div>
            <div className="h-16" />
            <div className="font-bold underline">{teacherName || 'SITI AMINAH, S.Pd.'}</div>
            <div>NIP. {teacherNip || '19850410 201001 2 015'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
