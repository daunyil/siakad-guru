import React from 'react';
import type { CPSubject, CPTujuanPembelajaran, AcademicYear } from '../../../types';
import type { KopData, ModulAjarFormState } from './types';

interface ModulAjarCanvasProps {
  currentSubject: CPSubject;
  selectedGrade: 'VII' | 'VIII' | 'IX';
  year: AcademicYear;
  kop: KopData;
  currentTpItem: { elementName: string; tp: CPTujuanPembelajaran } | undefined;
  formState: ModulAjarFormState;
  setFormState: React.Dispatch<React.SetStateAction<ModulAjarFormState>>;
}

export const ModulAjarCanvas: React.FC<ModulAjarCanvasProps> = ({
  currentSubject,
  selectedGrade,
  year,
  kop,
  currentTpItem,
  formState,
  setFormState,
}) => {
  const {
    meetingNumber,
    timeAllocation,
    learningModel,
    p3Dimensions,
    sarpras,
    targetSiswa,
    pemahamanBermakna,
    pertanyaanPemantik,
    kegiatanAwal,
    kegiatanInti,
    kegiatanPenutup,
    asesmenDiagnostik,
    asesmenFormatif,
    asesmenSumatif,
    remedial,
    pengayaan,
  } = formState;

  return (
    <div className="bg-white border border-slate-300 rounded-2xl shadow-lg p-8 md:p-12 space-y-6 document-page text-black font-serif text-xs leading-relaxed">
      {/* KOP HEADER */}
      <div className="text-center border-b-2 border-black pb-4 space-y-1">
        <h1 className="text-base md:text-lg font-bold uppercase tracking-wider">
          MODUL AJAR KURIKULUM MERDEKA
        </h1>
        <h2 className="text-xs md:text-sm font-bold uppercase">
          MATA PELAJARAN {currentSubject.subjectName.toUpperCase()} - FASE D
        </h2>
        <h3 className="text-xs font-bold uppercase">{kop.schoolName}</h3>
        <p className="text-[11px] font-sans italic text-slate-600">
          Tahun Pelajaran {year.label}
        </p>
      </div>

      {/* I. INFORMASI UMUM */}
      <div className="space-y-3">
        <div className="bg-slate-800 text-white px-3 py-1 font-sans font-bold uppercase text-[11px] rounded-xs">
          I. INFORMASI UMUM
        </div>

        <table className="w-full border-collapse border border-black text-[11px] font-sans">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-48 bg-slate-100 border-r border-black p-2 font-bold">
                Nama Penyusun / Guru
              </td>
              <td className="p-2 font-medium">{kop.teacherName} (NIP. {kop.teacherNip})</td>
            </tr>
            <tr className="border-b border-black">
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Satuan Pendidikan
              </td>
              <td className="p-2 font-medium">{kop.schoolName}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Tahun Ajaran / Jenjang / Kelas
              </td>
              <td className="p-2 font-medium">
                {year.label} / SMP / Kelas {selectedGrade}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Mata Pelajaran / Elemen
              </td>
              <td className="p-2 font-bold text-blue-900">
                {currentSubject.subjectName} / Elemen: {currentTpItem?.elementName}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Alokasi Waktu & Pertemuan
              </td>
              <td className="p-2 font-medium">
                {timeAllocation} (Pertemuan Ke-{meetingNumber})
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Profil Pelajar Pancasila
              </td>
              <td className="p-2 font-medium">{p3Dimensions.join(', ')}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Sarana & Prasarana
              </td>
              <td className="p-2 font-medium">{sarpras}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Target Peserta Didik
              </td>
              <td className="p-2 font-medium">{targetSiswa}</td>
            </tr>
            <tr>
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Model Pembelajaran
              </td>
              <td className="p-2 font-bold text-emerald-900">{learningModel}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* II. KOMPONEN INTI */}
      <div className="space-y-4">
        <div className="bg-slate-800 text-white px-3 py-1 font-sans font-bold uppercase text-[11px] rounded-xs">
          II. KOMPONEN INTI
        </div>

        {/* A. Tujuan Pembelajaran */}
        <div className="space-y-1">
          <h4 className="font-bold font-sans uppercase text-xs underline">
            A. Tujuan Pembelajaran (TP)
          </h4>
          <div className="p-3 bg-blue-50/60 border border-black font-sans text-[11px] font-bold text-blue-950">
            [{currentTpItem?.tp.code}] {currentTpItem?.tp.title}
          </div>
        </div>

        {/* B. Pemahaman Bermakna */}
        <div className="space-y-1">
          <h4 className="font-bold font-sans uppercase text-xs underline">
            B. Pemahaman Bermakna
          </h4>
          <textarea
            rows={2}
            value={pemahamanBermakna}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, pemahamanBermakna: e.target.value }))
            }
            className="w-full p-2 border border-black font-serif text-xs rounded-none bg-transparent resize-y"
          />
        </div>

        {/* C. Pertanyaan Pemantik */}
        <div className="space-y-1">
          <h4 className="font-bold font-sans uppercase text-xs underline">
            C. Pertanyaan Pemantik
          </h4>
          <div className="space-y-1 font-serif">
            {pertanyaanPemantik.map((q, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="font-bold">{idx + 1}.</span>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => {
                    const next = [...pertanyaanPemantik];
                    next[idx] = e.target.value;
                    setFormState((prev) => ({ ...prev, pertanyaanPemantik: next }));
                  }}
                  className="w-full border-b border-black font-serif text-xs px-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* D. Kegiatan Pembelajaran (Sintaks Model) */}
        <div className="space-y-3 font-sans">
          <h4 className="font-bold uppercase text-xs underline font-serif">
            D. Kegiatan Pembelajaran ({learningModel})
          </h4>

          {/* 1. Kegiatan Pendahuluan */}
          <div className="border border-black">
            <div className="bg-slate-200 px-3 py-1 font-bold text-[11px] border-b border-black">
              1. Kegiatan Pendahuluan (10 - 15 Menit)
            </div>
            <textarea
              rows={4}
              value={kegiatanAwal}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, kegiatanAwal: e.target.value }))
              }
              className="w-full p-2.5 font-serif text-xs leading-relaxed bg-transparent resize-y outline-none"
            />
          </div>

          {/* 2. Kegiatan Inti */}
          <div className="border border-black">
            <div className="bg-blue-100 px-3 py-1 font-bold text-[11px] border-b border-black text-blue-950">
              2. Kegiatan Inti Sintaks Pembelajaran (50 - 60 Menit)
            </div>
            <textarea
              rows={10}
              value={kegiatanInti}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, kegiatanInti: e.target.value }))
              }
              className="w-full p-2.5 font-serif text-xs leading-relaxed bg-transparent resize-y outline-none"
            />
          </div>

          {/* 3. Kegiatan Penutup */}
          <div className="border border-black">
            <div className="bg-slate-200 px-3 py-1 font-bold text-[11px] border-b border-black">
              3. Kegiatan Penutup & Refleksi (10 - 15 Menit)
            </div>
            <textarea
              rows={4}
              value={kegiatanPenutup}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, kegiatanPenutup: e.target.value }))
              }
              className="w-full p-2.5 font-serif text-xs leading-relaxed bg-transparent resize-y outline-none"
            />
          </div>
        </div>

        {/* E. Asesmen Pembelajaran */}
        <div className="space-y-2 font-sans">
          <h4 className="font-bold uppercase text-xs underline font-serif">
            E. Asesmen Pembelajaran
          </h4>

          <table className="w-full border-collapse border border-black text-[11px]">
            <thead>
              <tr className="bg-slate-200 text-center font-bold">
                <th className="border border-black p-1.5 w-32">Jenis Asesmen</th>
                <th className="border border-black p-1.5 text-left">Bentuk & Teknik Penilaian</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-slate-50">
                  Asesmen Diagnostik
                </td>
                <td className="border border-black p-1">
                  <input
                    type="text"
                    value={asesmenDiagnostik}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, asesmenDiagnostik: e.target.value }))
                    }
                    className="w-full px-1 font-serif text-xs"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-slate-50">
                  Asesmen Formatif
                </td>
                <td className="border border-black p-1">
                  <input
                    type="text"
                    value={asesmenFormatif}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, asesmenFormatif: e.target.value }))
                    }
                    className="w-full px-1 font-serif text-xs"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-slate-50">
                  Asesmen Sumatif
                </td>
                <td className="border border-black p-1">
                  <input
                    type="text"
                    value={asesmenSumatif}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, asesmenSumatif: e.target.value }))
                    }
                    className="w-full px-1 font-serif text-xs"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* F. Pengayaan & Remedial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
          <div className="border border-black p-2.5 space-y-1">
            <span className="font-bold text-xs block text-emerald-900 border-b border-black pb-1">
              F1. Program Pengayaan
            </span>
            <textarea
              rows={3}
              value={pengayaan}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, pengayaan: e.target.value }))
              }
              className="w-full font-serif text-xs bg-transparent outline-none resize-y"
            />
          </div>
          <div className="border border-black p-2.5 space-y-1">
            <span className="font-bold text-xs block text-amber-900 border-b border-black pb-1">
              F2. Program Remedial
            </span>
            <textarea
              rows={3}
              value={remedial}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, remedial: e.target.value }))
              }
              className="w-full font-serif text-xs bg-transparent outline-none resize-y"
            />
          </div>
        </div>
      </div>

      {/* III. LAMPIRAN MODUL AJAR (LKPD) */}
      <div className="space-y-3 pt-2">
        <div className="bg-slate-800 text-white px-3 py-1 font-sans font-bold uppercase text-[11px] rounded-xs">
          III. LAMPIRAN MODUL AJAR
        </div>

        <div className="border-2 border-dashed border-black p-4 space-y-3">
          <h4 className="font-bold text-center uppercase text-xs underline">
            LEMBAR KERJA PESERTA DIDIK (LKPD) PERTEMUAN KE-{meetingNumber}
          </h4>
          <div className="text-[11px] font-sans space-y-1">
            <div><strong>Kelompok / Anggota:</strong> ................................................................</div>
            <div><strong>Mata Pelajaran / TP:</strong> {currentSubject.subjectName} / [{currentTpItem?.tp.code}]</div>
          </div>

          <div className="border-t border-black pt-2 space-y-2 font-serif">
            <div className="font-bold">Petunjuk Pengerjaan:</div>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Bacalah setiap instruksi soal dan materi pendukung dengan cermat.</li>
              <li>Diskusikan bersama rekan sekelompokmu untuk merumuskan jawaban terbaik.</li>
              <li>Tuliskan hasil diskusi pada kolom jawaban yang telah disediakan bawah ini.</li>
            </ol>

            <div className="border border-black p-3 space-y-2 mt-3 bg-slate-50">
              <div className="font-bold text-xs text-blue-950">Soal Diskusi Kelompok:</div>
              <p className="italic text-xs">
                "Jelaskan bagaimana konsep {currentTpItem?.elementName} ({currentTpItem?.tp.title}) dapat menjadi solusi pemecahan masalah riil di lingkungan sekitar kalian!"
              </p>
              <div className="border-b border-dotted border-black h-12" />
              <div className="border-b border-dotted border-black h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* TANDA TANGAN DOKUMEN */}
      <div className="pt-8 flex justify-between font-serif text-xs">
        <div className="text-center w-56">
          <div>Mengetahui,</div>
          <div>Kepala {kop.schoolName}</div>
          <div className="h-20" />
          <div className="font-bold underline">{kop.headmasterName}</div>
          <div>NIP. {kop.headmasterNip}</div>
        </div>

        <div className="text-center w-56">
          <div>{kop.dateLocation}</div>
          <div>Guru Mata Pelajaran</div>
          <div className="h-20" />
          <div className="font-bold underline">{kop.teacherName}</div>
          <div>NIP. {kop.teacherNip}</div>
        </div>
      </div>
    </div>
  );
};
