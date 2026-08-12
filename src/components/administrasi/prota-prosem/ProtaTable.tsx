import React from 'react';
import type { TpAllocationItem } from './types';

interface ProtaTableProps {
  selectedGrade: string;
  tpAllocations: TpAllocationItem[];
  allocatedJpGanjil: number;
  allocatedJpGenap: number;
  totalAllocatedJp: number;
  totalJpGanjilAvailable: number;
  totalJpGenapAvailable: number;
  handleUpdateJp: (code: string, newJp: number, sem: 'ganjil' | 'genap') => void;
}

export const ProtaTable: React.FC<ProtaTableProps> = ({
  selectedGrade,
  tpAllocations,
  allocatedJpGanjil,
  allocatedJpGenap,
  totalAllocatedJp,
  handleUpdateJp,
}) => {
  const ganjilItems = tpAllocations.filter((a) => a.semester === 'ganjil');
  const genapItems = tpAllocations.filter((a) => a.semester === 'genap');

  const ganjilIntra = ganjilItems.reduce((acc, curr) => acc + (curr.jpIntra || 0), 0);
  const ganjilKo = ganjilItems.reduce((acc, curr) => acc + (curr.jpKo || 0), 0);

  const genapIntra = genapItems.reduce((acc, curr) => acc + (curr.jpIntra || 0), 0);
  const genapKo = genapItems.reduce((acc, curr) => acc + (curr.jpKo || 0), 0);

  const totalIntra = ganjilIntra + genapIntra;
  const totalKo = ganjilKo + genapKo;

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-bold text-xs uppercase underline font-serif">
          MATRIKS DISTRIBUSI ALOKASI WAKTU SATU TAHUN PELAJARAN (PROGRAM TAHUNAN)
        </h4>
        <div className="text-[11px] bg-amber-50 px-2.5 py-1 rounded border border-amber-300 font-bold text-amber-900 flex items-center gap-2">
          <span>💡 Sebaran Alokasi:</span>
          <span className="text-blue-900 font-bold">Intrakurikuler</span>
          <span>+</span>
          <span className="text-amber-800 font-bold">Kokurikuler (P5)</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black text-[11px]">
          <thead>
            <tr className="bg-slate-200 border-b border-black text-center font-bold">
              <th className="border border-black px-2 py-1.5 w-10" rowSpan={2}>No</th>
              <th className="border border-black px-2 py-1.5 text-left" rowSpan={2}>
                Elemen & Tujuan Pembelajaran (TP)
              </th>
              <th className="border border-black px-2 py-1.5 w-20" rowSpan={2}>Semester</th>
              <th className="border border-black px-2 py-1 text-center" colSpan={3}>
                Alokasi Waktu (JP)
              </th>
              <th className="border border-black px-2 py-1.5 w-24 no-print" rowSpan={2}>
                Aksi / Edit
              </th>
            </tr>
            <tr className="bg-slate-100 border-b border-black text-center font-bold text-[10px]">
              <th className="border border-black px-1 py-1 w-16 text-blue-900 bg-blue-50/50">Intra</th>
              <th className="border border-black px-1 py-1 w-16 text-amber-900 bg-amber-50/50">Ko (P5)</th>
              <th className="border border-black px-1 py-1 w-16 font-black">Total</th>
            </tr>
          </thead>
          <tbody>
            {tpAllocations.length === 0 ? (
              <tr>
                <td colSpan={7} className="border border-black p-4 text-center text-slate-500 italic">
                  Belum ada Tujuan Pembelajaran untuk Kelas {selectedGrade}. Silakan tambahkan TP di menu Master CP.
                </td>
              </tr>
            ) : (
              tpAllocations.map((item, idx) => (
                <tr key={item.tp.code} className="border-b border-black hover:bg-slate-50">
                  <td className="border border-black text-center font-bold">{idx + 1}</td>
                  <td className="border border-black px-2 py-1.5">
                    <div className="font-bold text-blue-950">
                      [{item.tp.code}] {item.elementName}
                    </div>
                    <div className="text-slate-800 leading-tight mt-0.5 font-medium">
                      {item.tp.title}
                    </div>
                  </td>
                  <td className="border border-black text-center font-bold capitalize">
                    Semester {item.semester}
                  </td>
                  <td className="border border-black text-center font-bold text-blue-900 bg-blue-50/20">
                    {item.jpIntra} JP
                  </td>
                  <td className="border border-black text-center font-bold text-amber-900 bg-amber-50/20">
                    {item.jpKo} JP
                  </td>
                  <td className="border border-black text-center font-black bg-slate-50">
                    {item.jp} JP
                  </td>
                  <td className="border border-black text-center py-1 no-print">
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        min={1}
                        value={item.jp}
                        onChange={(e) =>
                          handleUpdateJp(
                            item.tp.code,
                            parseInt(e.target.value) || 1,
                            item.semester
                          )
                        }
                        className="w-12 px-1 py-0.5 border text-center font-bold rounded"
                      />
                      <select
                        value={item.semester}
                        onChange={(e) =>
                          handleUpdateJp(
                            item.tp.code,
                            item.jp,
                            e.target.value as 'ganjil' | 'genap'
                          )
                        }
                        className="text-[10px] border rounded font-bold"
                      >
                        <option value="ganjil">Ganjil</option>
                        <option value="genap">Genap</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}

            {/* Summary Rows */}
            <tr className="bg-slate-100 font-bold border-t-2 border-black">
              <td colSpan={3} className="border border-black px-2 py-1.5 text-right">
                JUMLAH ALOKASI WAKTU SEMESTER GANJIL
              </td>
              <td className="border border-black text-center text-blue-900">{ganjilIntra} JP</td>
              <td className="border border-black text-center text-amber-900">{ganjilKo} JP</td>
              <td className="border border-black text-center font-black">{allocatedJpGanjil} JP</td>
              <td className="border border-black no-print" />
            </tr>
            <tr className="bg-slate-100 font-bold border-t border-black">
              <td colSpan={3} className="border border-black px-2 py-1.5 text-right">
                JUMLAH ALOKASI WAKTU SEMESTER GENAP
              </td>
              <td className="border border-black text-center text-blue-900">{genapIntra} JP</td>
              <td className="border border-black text-center text-amber-900">{genapKo} JP</td>
              <td className="border border-black text-center font-black">{allocatedJpGenap} JP</td>
              <td className="border border-black no-print" />
            </tr>
            <tr className="bg-blue-100 font-bold text-blue-950 border-t-2 border-black">
              <td colSpan={3} className="border border-black px-2 py-1.5 text-right uppercase font-black">
                JUMLAH TOTAL ALOKASI WAKTU PROTA (1 TAHUN PELAJARAN)
              </td>
              <td className="border border-black text-center text-blue-950 font-black">{totalIntra} JP</td>
              <td className="border border-black text-center text-amber-950 font-black">{totalKo} JP</td>
              <td className="border border-black text-center font-black text-sm bg-blue-200/80">
                {totalAllocatedJp} JP
              </td>
              <td className="border border-black no-print" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
