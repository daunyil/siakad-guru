import React from 'react';
import type { MonthCol, WeekStatus, TpAllocationItem } from './types';
import { KaldikControlBar } from './KaldikControlBar';
import { Sparkles } from 'lucide-react';

interface ProsemTableProps {
  selectedSemester: 'ganjil' | 'genap';
  setSelectedSemester: (sem: 'ganjil' | 'genap') => void;
  selectedRegionId: string;
  onSelectRegionPreset: (regionId: string) => void;
  onOpenImportModal: () => void;
  onOpenNationalHolidaysModal?: () => void;
  activeMonths: MonthCol[];
  activeSemesterAllocations: TpAllocationItem[];
  ganjilTags: Record<string, WeekStatus>;
  genapTags: Record<string, WeekStatus>;
  handleToggleWeekTag: (semester: 'ganjil' | 'genap', monthName: string, weekIdx: number) => void;
  jpPerWeek: number;
  jpIntraPerWeek?: number;
  jpKoPerWeek?: number;
  onAutoOptimizeJp?: (targetCadangan?: number) => void;
  targetCadanganPerSem?: number;
  setTargetCadanganPerSem?: (val: number) => void;
}

export const ProsemTable: React.FC<ProsemTableProps> = ({
  selectedSemester,
  setSelectedSemester,
  selectedRegionId,
  onSelectRegionPreset,
  onOpenImportModal,
  onOpenNationalHolidaysModal,
  activeMonths,
  activeSemesterAllocations,
  ganjilTags,
  genapTags,
  handleToggleWeekTag,
  jpPerWeek,
  jpIntraPerWeek = 2,
  jpKoPerWeek = 1,
  onAutoOptimizeJp,
  targetCadanganPerSem = 4,
  setTargetCadanganPerSem,
}) => {
  const targetMap = selectedSemester === 'ganjil' ? ganjilTags : genapTags;

  // Calculate total KBM weeks in calendar
  let totalKbmWeeks = 0;
  activeMonths.forEach((m) => {
    for (let wIdx = 0; wIdx < m.weeks; wIdx++) {
      const key = `${m.name}-${wIdx}`;
      const status = targetMap[key] || 'kbm';
      if (status === 'kbm') {
        totalKbmWeeks++;
      }
    }
  });

  // Calculate total weeks used by TPs
  let tpWeeksSum = 0;
  activeSemesterAllocations.forEach((item) => {
    tpWeeksSum += Math.ceil(item.jp / jpPerWeek);
  });

  const cadanganWeeks = Math.max(0, totalKbmWeeks - tpWeeksSum);
  const cadanganJp = cadanganWeeks * jpPerWeek;
  const ratioIntra = Math.min(1, Math.max(0, jpIntraPerWeek / jpPerWeek));
  const cadanganIntra = Math.round(cadanganJp * ratioIntra);
  const cadanganKo = Math.max(0, cadanganJp - cadanganIntra);

  // Totals for TP
  const totalTpIntra = activeSemesterAllocations.reduce((acc, a) => acc + a.jpIntra, 0);
  const totalTpKo = activeSemesterAllocations.reduce((acc, a) => acc + a.jpKo, 0);
  const totalTpJp = activeSemesterAllocations.reduce((acc, a) => acc + a.jp, 0);

  const grandIntra = totalTpIntra + cadanganIntra;
  const grandKo = totalTpKo + cadanganKo;
  const grandJp = totalTpJp + cadanganJp;

  return (
    <div className="space-y-4 font-sans">
      {/* Alert Banner when Jam Cadangan in Prosem is large */}
      {cadanganJp > 8 && (
        <div className="bg-amber-50 border-2 border-amber-300 text-amber-950 p-4 rounded-2xl space-y-2 no-print shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs uppercase text-amber-900 tracking-tight">
                  Jam Cadangan Semester {selectedSemester.toUpperCase()} Terlalu Banyak ({cadanganJp} JP / {cadanganWeeks} Pekan)
                </h5>
                <p className="text-[11px] text-amber-800 font-medium">
                  Klik tombol optimasi di bawah untuk secara otomatis meratakan jam pelajaran ke seluruh TP dan menyisakan cadangan efektif.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-amber-300 text-[11px]">
                <span className="font-bold text-slate-700">Target Cadangan:</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={targetCadanganPerSem}
                  onChange={(e) => setTargetCadanganPerSem?.(parseInt(e.target.value) || 0)}
                  className="w-10 px-1 py-0.5 border rounded-md font-extrabold text-center text-amber-900 bg-amber-50/50"
                />
                <span className="text-slate-500 font-bold">JP</span>
              </div>

              <button
                type="button"
                onClick={() => onAutoOptimizeJp?.(targetCadanganPerSem)}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>⚡ Optimalkan Matriks Prosem</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regional Kaldik Control Bar (No Print) */}
      <KaldikControlBar
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
        selectedRegionId={selectedRegionId}
        onSelectRegionPreset={onSelectRegionPreset}
        onOpenImportModal={onOpenImportModal}
        onOpenNationalHolidaysModal={onOpenNationalHolidaysModal}
      />

      {/* Matrix Prosem Grid */}
      <div className="overflow-x-auto border border-black rounded-xs">
        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="bg-slate-200 border-b border-black text-center font-bold">
              <th className="border border-black px-1 py-1.5 w-8" rowSpan={2}>
                No
              </th>
              <th className="border border-black px-2 py-1.5 text-left min-w-[220px]" rowSpan={2}>
                Materi / Tujuan Pembelajaran (TP)
              </th>
              <th className="border border-black px-1 py-1 text-center" colSpan={3}>
                Alokasi JP
              </th>
              {activeMonths.map((m) => (
                <th
                  key={m.name}
                  colSpan={m.weeks}
                  className="border border-black px-1 py-1 uppercase"
                >
                  {m.name}
                </th>
              ))}
            </tr>
            <tr className="bg-slate-100 border-b border-black text-center font-bold">
              <th className="border border-black px-0.5 py-1 w-8 text-[9px] text-blue-900 bg-blue-50/80">Intra</th>
              <th className="border border-black px-0.5 py-1 w-8 text-[9px] text-amber-900 bg-amber-50/80">Ko (P5)</th>
              <th className="border border-black px-0.5 py-1 w-9 text-[9px] font-black">Total</th>
              {activeMonths.map((m) =>
                Array.from({ length: m.weeks }).map((_, wIdx) => {
                  const key = `${m.name}-${wIdx}`;
                  const status = targetMap[key] || 'kbm';

                  let badgeColor = 'bg-slate-700 text-white';
                  if (status === 'mpls') badgeColor = 'bg-purple-200 text-purple-900 border-purple-400';
                  else if (status === 'sts') badgeColor = 'bg-amber-200 text-amber-900 border-amber-400';
                  else if (status === 'sas') badgeColor = 'bg-orange-200 text-orange-900 border-orange-400';
                  else if (status === 'rapor') badgeColor = 'bg-emerald-200 text-emerald-900 border-emerald-400';
                  else if (status === 'libur') badgeColor = 'bg-rose-200 text-rose-900 border-rose-400';

                  return (
                    <th
                      key={`${m.name}-w${wIdx}`}
                      onClick={() => handleToggleWeekTag(selectedSemester, m.name, wIdx)}
                      title={`Klik untuk ubah status pekan (${status.toUpperCase()})`}
                      className={`border border-black px-0.5 py-0.5 w-6 cursor-pointer select-none transition-opacity hover:opacity-80 ${badgeColor}`}
                    >
                      <div>{wIdx + 1}</div>
                      {status !== 'kbm' && (
                        <div className="text-[7px] font-black uppercase tracking-tighter scale-90">
                          {status}
                        </div>
                      )}
                    </th>
                  );
                })
              )}
            </tr>
          </thead>
          <tbody>
            {activeSemesterAllocations.length === 0 ? (
              <tr>
                <td colSpan={30} className="border border-black p-4 text-center italic text-slate-500">
                  Tidak ada TP dialokasikan pada Semester {selectedSemester}. Silakan sesuaikan di tab PROTA.
                </td>
              </tr>
            ) : (
              (() => {
                let kbmCounter = 0;

                return (
                  <>
                    {/* Render TP Rows */}
                    {activeSemesterAllocations.map((item, idx) => {
                      const weeksNeeded = Math.ceil(item.jp / jpPerWeek);
                      const startKbmIndex = kbmCounter;
                      kbmCounter += weeksNeeded;

                      let currentKbmIndex = 0;

                      return (
                        <tr key={item.tp.code} className="border-b border-black hover:bg-slate-50">
                          <td className="border border-black text-center font-bold">{idx + 1}</td>
                          <td className="border border-black px-2 py-1 font-medium">
                            <span className="font-bold text-blue-900">[{item.tp.code}]</span>{' '}
                            {item.tp.title}
                          </td>
                          <td className="border border-black text-center font-bold text-blue-900 bg-blue-50/20">
                            {item.jpIntra}
                          </td>
                          <td className="border border-black text-center font-bold text-amber-900 bg-amber-50/20">
                            {item.jpKo}
                          </td>
                          <td className="border border-black text-center font-black bg-slate-50">{item.jp}</td>

                          {/* Render Weeks Cells */}
                          {activeMonths.map((m) =>
                            Array.from({ length: m.weeks }).map((_, wIdx) => {
                              const key = `${m.name}-${wIdx}`;
                              const status = targetMap[key] || 'kbm';

                              if (status !== 'kbm') {
                                let bgStyle = 'bg-slate-100 text-slate-500';
                                if (status === 'mpls') bgStyle = 'bg-purple-100 text-purple-800 font-bold';
                                else if (status === 'sts') bgStyle = 'bg-amber-100 text-amber-800 font-bold';
                                else if (status === 'sas') bgStyle = 'bg-orange-100 text-orange-800 font-bold';
                                else if (status === 'rapor') bgStyle = 'bg-emerald-100 text-emerald-800 font-bold';
                                else if (status === 'libur') bgStyle = 'bg-rose-100 text-rose-800 font-bold';

                                return (
                                  <td
                                    key={`${m.name}-${wIdx}`}
                                    className={`border border-black text-center text-[8px] uppercase font-bold px-0.5 ${bgStyle}`}
                                  >
                                    {status}
                                  </td>
                                );
                              }

                              const thisKbmIdx = currentKbmIndex;
                              currentKbmIndex++;

                              const isActiveForThisTp =
                                thisKbmIdx >= startKbmIndex &&
                                thisKbmIdx < startKbmIndex + weeksNeeded;

                              return (
                                <td
                                  key={`${m.name}-${wIdx}`}
                                  className={`border border-black text-center font-bold ${
                                    isActiveForThisTp
                                      ? 'bg-blue-600 text-white print:bg-slate-800'
                                      : ''
                                  }`}
                                >
                                  {isActiveForThisTp ? (
                                    <div className="flex flex-col items-center leading-none py-0.5">
                                      <span>{jpPerWeek}</span>
                                      {item.jpKo > 0 && (
                                        <span
                                          className="text-[6.5px] text-amber-200 font-normal scale-90 -mt-0.5"
                                          title={`${item.jpIntra} JP Intra + ${item.jpKo} JP Kokurikuler (P5)`}
                                        >
                                          ({item.jpIntra}+{item.jpKo})
                                        </span>
                                      )}
                                    </div>
                                  ) : ''}
                                </td>
                              );
                            })
                          )}
                        </tr>
                      );
                    })}

                    {/* Dedicated Jam Cadangan Row */}
                    {cadanganJp > 0 && (() => {
                      let currentKbmIndex = 0;
                      return (
                        <tr className="border-b-2 border-black bg-emerald-50/60 font-bold">
                          <td className="border border-black text-center text-emerald-900 font-black">
                            {activeSemesterAllocations.length + 1}
                          </td>
                          <td className="border border-black px-2 py-1.5 text-emerald-950 font-bold">
                            <span className="text-emerald-800 font-black uppercase">[CADANGAN]</span>{' '}
                            Alokasi Cadangan / Jam Cadangan (Ulangan Harian, Remedial, Pengayaan & Evaluasi)
                          </td>
                          <td className="border border-black text-center text-blue-900 bg-blue-50/40">
                            {cadanganIntra}
                          </td>
                          <td className="border border-black text-center text-amber-900 bg-amber-50/40">
                            {cadanganKo}
                          </td>
                          <td className="border border-black text-center font-black bg-emerald-100 text-emerald-900">
                            {cadanganJp}
                          </td>

                          {/* Render Weeks Cells for Cadangan */}
                          {activeMonths.map((m) =>
                            Array.from({ length: m.weeks }).map((_, wIdx) => {
                              const key = `${m.name}-${wIdx}`;
                              const status = targetMap[key] || 'kbm';

                              if (status !== 'kbm') {
                                let bgStyle = 'bg-slate-100 text-slate-500';
                                if (status === 'mpls') bgStyle = 'bg-purple-100 text-purple-800 font-bold';
                                else if (status === 'sts') bgStyle = 'bg-amber-100 text-amber-800 font-bold';
                                else if (status === 'sas') bgStyle = 'bg-orange-100 text-orange-800 font-bold';
                                else if (status === 'rapor') bgStyle = 'bg-emerald-100 text-emerald-800 font-bold';
                                else if (status === 'libur') bgStyle = 'bg-rose-100 text-rose-800 font-bold';

                                return (
                                  <td
                                    key={`cad-${m.name}-${wIdx}`}
                                    className={`border border-black text-center text-[8px] uppercase font-bold px-0.5 ${bgStyle}`}
                                  >
                                    {status}
                                  </td>
                                );
                              }

                              const thisKbmIdx = currentKbmIndex;
                              currentKbmIndex++;

                              const isCadanganWeek =
                                thisKbmIdx >= tpWeeksSum && thisKbmIdx < totalKbmWeeks;

                              return (
                                <td
                                  key={`cad-${m.name}-${wIdx}`}
                                  className={`border border-black text-center font-bold ${
                                    isCadanganWeek
                                      ? 'bg-emerald-600 text-white print:bg-emerald-800'
                                      : ''
                                  }`}
                                  title={isCadanganWeek ? `Alokasi Cadangan/Remedial (${jpPerWeek} JP)` : ''}
                                >
                                  {isCadanganWeek ? (
                                    <div className="flex flex-col items-center leading-none py-0.5">
                                      <span>{jpPerWeek}</span>
                                      <span className="text-[6px] text-emerald-100 scale-90 -mt-0.5">
                                        Cadangan
                                      </span>
                                    </div>
                                  ) : ''}
                                </td>
                              );
                            })
                          )}
                        </tr>
                      );
                    })()}
                  </>
                );
              })()
            )}

            {/* Total JP Efektif per Pekan Row */}
            <tr className="bg-slate-200 border-t-2 border-black font-black text-[9.5px]">
              <td colSpan={2} className="border border-black px-2 py-1 text-right uppercase">
                JUMLAH TOTAL JP EFEKTIF SEMESTER (TP + CADANGAN)
              </td>
              <td className="border border-black text-center text-blue-900">{grandIntra}</td>
              <td className="border border-black text-center text-amber-900">{grandKo}</td>
              <td className="border border-black text-center font-black bg-blue-100 text-blue-950">
                {grandJp} JP
              </td>
              {activeMonths.map((m) =>
                Array.from({ length: m.weeks }).map((_, wIdx) => {
                  const key = `${m.name}-${wIdx}`;
                  const status = targetMap[key] || 'kbm';
                  return (
                    <td
                      key={`total-${m.name}-${wIdx}`}
                      className={`border border-black text-center font-black ${
                        status === 'kbm' ? 'bg-blue-50 text-blue-900' : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {status === 'kbm' ? jpPerWeek : '-'}
                    </td>
                  );
                })
              )}
            </tr>

            {/* Non-Effective Agenda Row Summary */}
            <tr className="bg-slate-100 border-t border-black font-bold">
              <td colSpan={2} className="border border-black px-2 py-1 text-right">
                Kegiatan Non-KBM (MPLS, STS, SAS, Rapor, Libur)
              </td>
              <td className="border border-black text-center text-[9px] text-blue-900">-</td>
              <td className="border border-black text-center text-[9px] text-amber-900">-</td>
              <td className="border border-black text-center text-[9px] font-black">-</td>
              {activeMonths.map((m) =>
                Array.from({ length: m.weeks }).map((_, wIdx) => {
                  const key = `${m.name}-${wIdx}`;
                  const status = targetMap[key] || 'kbm';
                  return (
                    <td
                      key={`summary-${m.name}-${wIdx}`}
                      className={`border border-black text-center text-[8px] font-black uppercase ${
                        status !== 'kbm' ? 'bg-slate-200 text-slate-800' : ''
                      }`}
                    >
                      {status !== 'kbm' ? status : ''}
                    </td>
                  );
                })
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Keterangan Warna PROSEM */}
      <div className="flex flex-wrap items-center gap-4 text-[10px] pt-2 font-sans">
        <span className="font-bold">Keterangan Matriks Prosem:</span>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-600 rounded-xs" />
          <span>KBM Efektif Pembelajaran Materi TP ({jpPerWeek} JP/Minggu)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-emerald-600 rounded-xs" />
          <span>Jam Cadangan / Ulangan / Remedial ({jpPerWeek} JP/Minggu)</span>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-bold">
          <span>💡 Sebaran Kurikulum Merdeka: Intrakurikuler ({jpIntraPerWeek} JP) + Kokurikuler / P5 ({jpKoPerWeek} JP)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-purple-200 border border-purple-400 rounded-xs" />
          <span>MPLS</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-amber-200 border border-amber-400 rounded-xs" />
          <span>STS</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-orange-200 border border-orange-400 rounded-xs" />
          <span>SAS</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-emerald-200 border border-emerald-400 rounded-xs" />
          <span>Pembagian Rapor</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-rose-200 border border-rose-400 rounded-xs" />
          <span>Libur Semester</span>
        </div>
      </div>
    </div>
  );
};
