import React from 'react';
import { Sparkles, Check, Layers } from 'lucide-react';
import type { CPSubject, CPTujuanPembelajaran, AcademicYear } from '../../../types';
import type { KopData, ModulAjarFormState } from './types';
import type { LKPDVariation } from '../../../data/bukuSiswaData';

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
    pendekatanMetode,
    kompetensiAwal,
    p3Dimensions,
    sarpras,
    targetSiswa,
    iktpList,
    pemahamanBermakna,
    pertanyaanPemantik,
    bukuSiswaTitle,
    bukuSiswaBab,
    bukuSiswaSubBab,
    bukuSiswaPages,
    kegiatanAwal,
    kegiatanInti,
    kegiatanPenutup,
    asesmenDiagnostik,
    asesmenFormatif,
    asesmenSumatif,
    refleksiGuru,
    refleksiSiswa,
    remedial,
    pengayaan,
    lkpdTitle,
    lkpdBadge,
    lkpdInstructions,
    lkpdQuestions,
    lkpdRubrik,
    bahanBacaanGuruSiswa,
    glosarium,
    daftarPustaka,
  } = formState;

  // Default IKTP if not set
  const defaultIktp = iktpList && iktpList.length > 0 ? iktpList : [
    `Menjelaskan konsep esensial ${bukuSiswaSubBab || currentTpItem?.tp.title || currentSubject.subjectName} secara runtut dan tepat.`,
    `Mengidentifikasi dan menganalisis keterkaitan materi dengan fenomena riil dalam kehidupan bermasyarakat.`,
    `Merumuskan ide gagasan atau solusi pemecahan masalah secara kolaboratif melalui unjuk kerja lembar kerja (LKPD).`,
    `Mempresentasikan hasil diskusi kelompok dengan argumen yang logis, santun, dan bertanggung jawab.`
  ];

  // Default Kompetensi Awal
  const effectiveKompetensiAwal = kompetensiAwal || `Peserta didik telah memiliki pengetahuan dasar tentang konsep ${currentTpItem?.elementName || 'materi pokok'} dan norma-norma kehidupan bermasyarakat dari jenjang atau fase sebelumnya.`;

  // Default Refleksi Guru
  const defaultRefleksiGuru = refleksiGuru && refleksiGuru.length > 0 ? refleksiGuru : [
    { no: 1, pertanyaan: 'Apakah seluruh peserta didik aktif dan terlibat penuh dalam proses pembelajaran berkelompok?' },
    { no: 2, pertanyaan: 'Bagian materi atau fase sintaks pembelajaran mana yang paling menantang bagi peserta didik?' },
    { no: 3, pertanyaan: 'Apakah alokasi waktu yang direncanakan sudah memadai untuk menyelesaikan seluruh tahapan dan LKPD?' },
    { no: 4, pertanyaan: 'Strategi perbaikan apa yang perlu dipersiapkan untuk pertemuan berikutnya?' }
  ];

  // Default Refleksi Siswa
  const defaultRefleksiSiswa = refleksiSiswa && refleksiSiswa.length > 0 ? refleksiSiswa : [
    { no: 1, pertanyaan: 'Apa hal paling berharga dan menarik yang kamu pelajari pada pertemuan hari ini?' },
    { no: 2, pertanyaan: 'Bagian materi mana yang menurutmu masih sulit dipahami atau memerlukan bantuan penjelasan guru?' },
    { no: 3, pertanyaan: 'Bagaimana kontribusi dan peranmu saat berdiskusi dan menyelesaikan tugas bersama kelompok?' },
    { no: 4, pertanyaan: 'Sikap positif apa yang ingin kamu terapkan dalam kehidupan sehari-hari setelah mempelajari materi ini?' }
  ];

  return (
    <div className="bg-white border border-slate-300 rounded-2xl shadow-lg p-6 sm:p-10 md:p-14 space-y-6 document-page text-black font-serif text-xs leading-relaxed max-w-5xl mx-auto">
      {/* ── KOP RESMI LEMBAGA ── */}
      <div className="text-center pb-2">
        {kop.governmentAgency && (
          <h4 className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-800">
            {kop.governmentAgency}
          </h4>
        )}
        <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-black">
          {kop.schoolName}
        </h2>
        {kop.schoolAddress && (
          <p className="text-[10px] font-sans text-slate-700 italic">
            {kop.schoolAddress}
          </p>
        )}
        {/* Double Line Separator Resmi Kop */}
        <div className="border-b-[2.5px] border-black mt-2.5" />
        <div className="border-b-[1px] border-black mt-0.5 mb-3" />
      </div>

      {/* ── JUDUL DOKUMEN MODUL AJAR ── */}
      <div className="text-center space-y-1 pb-2">
        <h1 className="text-sm md:text-base font-bold uppercase tracking-wider underline">
          MODUL AJAR KURIKULUM MERDEKA
        </h1>
        <h2 className="text-xs md:text-sm font-bold uppercase text-slate-900">
          FASE D (SMP/MTs) — KELAS {selectedGrade}
        </h2>
        <p className="text-[11px] font-sans text-slate-700 font-semibold">
          Mata Pelajaran: {currentSubject.subjectName} | {kop.academicSemester || 'Semester Ganjil'} | Tahun Pelajaran {year.label}
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          I. INFORMASI UMUM
      ══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <div className="bg-slate-900 text-white px-3 py-1 font-sans font-bold uppercase text-[11px] tracking-wide flex justify-between items-center rounded-xs">
          <span>I. INFORMASI UMUM</span>
          <span className="text-[9px] font-normal text-slate-300">Format Standar BSKAP Kemendikbudristek RI</span>
        </div>

        {/* Tabel Identitas Modul */}
        <table className="w-full border-collapse border border-black text-[11px] font-sans">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-56 bg-slate-100 border-r border-black p-2 font-bold">
                Nama Penyusun / Guru
              </td>
              <td className="p-2 font-medium">
                {kop.teacherName} {kop.teacherNip && `(NIP. ${kop.teacherNip})`}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Satuan Pendidikan
              </td>
              <td className="p-2 font-medium">{kop.schoolName}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Tahun Ajaran / Jenjang / Kelas / Smt
              </td>
              <td className="p-2 font-medium">
                {year.label} / SMP / Kelas {selectedGrade} / {kop.academicSemester || 'Semester Ganjil'}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Mata Pelajaran & Elemen CP
              </td>
              <td className="p-2 font-bold text-blue-950">
                {currentSubject.subjectName} — <span className="font-semibold text-slate-800">Elemen: {currentTpItem?.elementName}</span>
              </td>
            </tr>
            {bukuSiswaTitle && (
              <tr className="border-b border-black">
                <td className="bg-slate-100 border-r border-black p-2 font-bold">
                  Rujukan Buku Teks Siswa & Panduan Guru
                </td>
                <td className="p-2 font-medium text-slate-950">
                  <div className="font-bold text-emerald-950">{bukuSiswaTitle}</div>
                  {bukuSiswaBab && <div>• {bukuSiswaBab}</div>}
                  {bukuSiswaSubBab && (
                    <div>
                      • {bukuSiswaSubBab}{' '}
                      {bukuSiswaPages && (
                        <span className="font-bold text-emerald-800">[{bukuSiswaPages}]</span>
                      )}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-600 italic">Pusat Perbukuan, BSKAP Kemendikbudristek RI</div>
                </td>
              </tr>
            )}
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
                Target Peserta Didik
              </td>
              <td className="p-2 font-medium">
                {targetSiswa || 'Peserta Didik Reguler / Tipikal (28–32 Siswa), mengakomodasi gaya belajar visual, auditori, dan kinestetik'}
              </td>
            </tr>
            <tr>
              <td className="bg-slate-100 border-r border-black p-2 font-bold">
                Model, Pendekatan & Metode
              </td>
              <td className="p-2 font-medium">
                <span className="font-bold text-emerald-950">{learningModel}</span>
                <span className="text-slate-700 block text-[10.5px]">
                  {pendekatanMetode || 'Pendekatan Saintifik & Deep Learning; Metode: Diskusi Terbimbing, Penyelidikan Berkelompok, Tanya Jawab, Penugasan LKPD, dan Presentasi.'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* B. Kompetensi Awal */}
        <div className="space-y-1 pt-1">
          <h4 className="font-bold font-sans uppercase text-xs text-slate-900">
            B. Kompetensi Awal (Prasyarat Belajar)
          </h4>
          <div className="p-2.5 bg-slate-50 border border-black font-serif text-xs leading-relaxed text-slate-900">
            <textarea
              rows={2}
              value={effectiveKompetensiAwal}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, kompetensiAwal: e.target.value }))
              }
              className="w-full bg-transparent resize-y outline-none font-serif text-xs print:hidden"
            />
            <div className="hidden print:block whitespace-pre-wrap">
              {effectiveKompetensiAwal}
            </div>
          </div>
        </div>

        {/* C. Profil Pelajar Pancasila (P3) */}
        <div className="space-y-1 pt-1">
          <h4 className="font-bold font-sans uppercase text-xs text-slate-900">
            C. Profil Pelajar Pancasila (P3)
          </h4>
          <div className="p-2.5 bg-slate-50 border border-black font-serif text-xs space-y-1">
            <p className="font-bold font-sans text-[11px] text-slate-900">
              Dimensi yang dikembangkan dalam modul ajar ini:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-800">
              {p3Dimensions.map((dim, idx) => (
                <li key={idx}>
                  <strong>{dim}</strong>: Ditanamkan melalui kegiatan beriman saat pembuka, bernalar kritis saat menelaah materi, bergotong royong saat berdiskusi LKPD, dan mandiri dalam mengerjakan evaluasi.
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* D. Sarana dan Prasarana */}
        <div className="space-y-1 pt-1">
          <h4 className="font-bold font-sans uppercase text-xs text-slate-900">
            D. Sarana dan Prasarana Pembelajaran
          </h4>
          <div className="p-2.5 bg-slate-50 border border-black font-serif text-xs leading-relaxed">
            <textarea
              rows={2}
              value={sarpras}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, sarpras: e.target.value }))
              }
              className="w-full bg-transparent resize-y outline-none font-serif text-xs print:hidden"
            />
            <div className="hidden print:block whitespace-pre-wrap text-slate-900">
              {sarpras}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          II. KOMPONEN INTI
      ══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4 pt-2">
        <div className="bg-slate-900 text-white px-3 py-1 font-sans font-bold uppercase text-[11px] tracking-wide flex justify-between items-center rounded-xs">
          <span>II. KOMPONEN INTI</span>
          <span className="text-[9px] font-normal text-slate-300">Capaian, Sintaks Pembelajaran & Asesmen</span>
        </div>

        {/* A. Capaian & Tujuan Pembelajaran */}
        <div className="space-y-2">
          <h4 className="font-bold font-sans uppercase text-xs text-slate-900">
            A. Capaian & Tujuan Pembelajaran (TP) serta Indikator (IKTP)
          </h4>
          <div className="border border-black p-3 bg-blue-50/50 space-y-2 text-xs">
            <div>
              <span className="font-bold font-sans text-[11px] block text-blue-950 uppercase">
                1. Capaian Pembelajaran (CP) Elemen {currentTpItem?.elementName}:
              </span>
              <p className="italic text-slate-800 pt-0.5">
                "Peserta didik mampu memahami, menganalisis, dan mempraktikkan konsep dasar dalam elemen {currentTpItem?.elementName} secara kritis, mandiri, dan berkeadaban dalam bingkai persatuan NKRI."
              </p>
            </div>
            <div className="border-t border-blue-200 pt-2">
              <span className="font-bold font-sans text-[11px] block text-blue-950 uppercase">
                2. Tujuan Pembelajaran (TP) Spesifik Pertemuan:
              </span>
              <div className="p-2 bg-white border border-blue-300 font-sans font-bold text-[11px] text-blue-950 mt-1">
                [{currentTpItem?.tp.code}] {currentTpItem?.tp.title}
              </div>
            </div>
            <div className="border-t border-blue-200 pt-2">
              <span className="font-bold font-sans text-[11px] block text-blue-950 uppercase">
                3. Indikator Ketercapaian Tujuan Pembelajaran (IKTP):
              </span>
              <ol className="list-decimal list-inside space-y-1 font-serif text-slate-900 pt-1">
                {defaultIktp.map((iktp, iIdx) => (
                  <li key={iIdx}>{iktp}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* B. Pemahaman Bermakna */}
        <div className="space-y-1">
          <h4 className="font-bold font-sans uppercase text-xs text-slate-900">
            B. Pemahaman Bermakna (Essential Understanding)
          </h4>
          <div className="border border-black p-2.5 bg-slate-50">
            <textarea
              rows={2}
              value={pemahamanBermakna}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, pemahamanBermakna: e.target.value }))
              }
              className="w-full font-serif text-xs bg-transparent resize-y outline-none print:hidden"
            />
            <div className="hidden print:block font-serif text-xs leading-relaxed text-slate-900 whitespace-pre-wrap">
              {pemahamanBermakna}
            </div>
          </div>
        </div>

        {/* C. Pertanyaan Pemantik */}
        <div className="space-y-1">
          <h4 className="font-bold font-sans uppercase text-xs text-slate-900">
            C. Pertanyaan Pemantik (Driving Questions)
          </h4>
          <div className="border border-black p-2.5 bg-slate-50 space-y-1.5 font-serif">
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
                  className="w-full border-b border-black font-serif text-xs px-1 bg-transparent print:hidden"
                />
                <span className="hidden print:inline font-serif text-xs text-slate-900">{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* D. Persiapan Pembelajaran */}
        <div className="space-y-1">
          <h4 className="font-bold font-sans uppercase text-xs text-slate-900">
            D. Persiapan Pembelajaran
          </h4>
          <div className="border border-black p-2.5 bg-slate-50 font-serif text-xs space-y-1 text-slate-900">
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Guru menyiapkan modul ajar, materi presentasi/slide, dan lembar kerja peserta didik (LKPD) yang dicetak sesuai jumlah kelompok.</li>
              <li>Guru memeriksa kesiapan perangkat proyektor LCD, laptop, pengeras suara, dan bahan ajar pendukung di ruang kelas.</li>
              <li>Guru memetakan kesiapan belajar peserta didik untuk mendukung proses pembelajaran berdiferensiasi yang inklusif.</li>
            </ol>
          </div>
        </div>

        {/* E. Kegiatan Pembelajaran (Sintaks Model & Diferensiasi) */}
        <div className="space-y-3 font-sans">
          <h4 className="font-bold uppercase text-xs text-slate-900">
            E. Langkah-Langkah Kegiatan Pembelajaran ({learningModel})
          </h4>

          {/* 1. Pendahuluan */}
          <div className="border border-black">
            <div className="bg-slate-200 px-3 py-1 font-bold text-[11px] border-b border-black flex justify-between items-center">
              <span>1. Kegiatan Pendahuluan (Orientasi, Apersepsi, Motivasi, Pemberian Acuan)</span>
              <span className="text-[10px] font-semibold text-slate-700">10 – 15 Menit</span>
            </div>
            <textarea
              rows={5}
              value={kegiatanAwal}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, kegiatanAwal: e.target.value }))
              }
              className="w-full p-2.5 font-serif text-xs leading-relaxed bg-transparent resize-y outline-none print:hidden"
            />
            <div className="hidden print:block p-2.5 font-serif text-xs leading-relaxed whitespace-pre-wrap text-slate-900">
              {kegiatanAwal}
            </div>
          </div>

          {/* 2. Kegiatan Inti */}
          <div className="border border-black">
            <div className="bg-blue-100 px-3 py-1 font-bold text-[11px] border-b border-black text-blue-950 flex justify-between items-center">
              <span>2. Kegiatan Inti: Sintaks Model {learningModel} & Diferensiasi (Konten, Proses, Produk)</span>
              <span className="text-[10px] font-semibold text-blue-900">50 – 60 Menit</span>
            </div>
            <textarea
              rows={18}
              value={kegiatanInti}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, kegiatanInti: e.target.value }))
              }
              className="w-full p-3 font-serif text-xs leading-relaxed bg-transparent resize-y outline-none print:hidden focus:ring-1 focus:ring-blue-400"
            />
            <div className="hidden print:block p-3 font-serif text-xs leading-relaxed whitespace-pre-wrap text-slate-950">
              {kegiatanInti}
            </div>
          </div>

          {/* 3. Penutup */}
          <div className="border border-black">
            <div className="bg-slate-200 px-3 py-1 font-bold text-[11px] border-b border-black flex justify-between items-center">
              <span>3. Kegiatan Penutup (Rangkuman, Refleksi, Umpan Balik, Tindak Lanjut & Doa)</span>
              <span className="text-[10px] font-semibold text-slate-700">10 – 15 Menit</span>
            </div>
            <textarea
              rows={5}
              value={kegiatanPenutup}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, kegiatanPenutup: e.target.value }))
              }
              className="w-full p-2.5 font-serif text-xs leading-relaxed bg-transparent resize-y outline-none print:hidden"
            />
            <div className="hidden print:block p-2.5 font-serif text-xs leading-relaxed whitespace-pre-wrap text-slate-900">
              {kegiatanPenutup}
            </div>
          </div>
        </div>

        {/* F. Asesmen Pembelajaran */}
        <div className="space-y-2 font-sans">
          <h4 className="font-bold uppercase text-xs text-slate-900">
            F. Asesmen Pembelajaran (Diagnostik, Formatif, Sumatif)
          </h4>

          <table className="w-full border-collapse border border-black text-[11px]">
            <thead>
              <tr className="bg-slate-200 text-center font-bold">
                <th className="border border-black p-1.5 w-40">Jenis Asesmen</th>
                <th className="border border-black p-1.5 text-left">Bentuk Penilaian & Instrumen Standar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-slate-50">
                  1. Asesmen Diagnostik (Awal)
                </td>
                <td className="border border-black p-1.5 font-serif text-xs">
                  <input
                    type="text"
                    value={asesmenDiagnostik}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, asesmenDiagnostik: e.target.value }))
                    }
                    className="w-full px-1 font-serif text-xs print:hidden"
                  />
                  <span className="hidden print:inline">{asesmenDiagnostik}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-slate-50">
                  2. Asesmen Formatif (Proses)
                </td>
                <td className="border border-black p-1.5 font-serif text-xs">
                  <input
                    type="text"
                    value={asesmenFormatif}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, asesmenFormatif: e.target.value }))
                    }
                    className="w-full px-1 font-serif text-xs print:hidden"
                  />
                  <span className="hidden print:inline">{asesmenFormatif}</span>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-bold bg-slate-50">
                  3. Asesmen Sumatif (Akhir)
                </td>
                <td className="border border-black p-1.5 font-serif text-xs">
                  <input
                    type="text"
                    value={asesmenSumatif}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, asesmenSumatif: e.target.value }))
                    }
                    className="w-full px-1 font-serif text-xs print:hidden"
                  />
                  <span className="hidden print:inline">{asesmenSumatif}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* G. Instrumen Refleksi Pendidik & Peserta Didik */}
        <div className="space-y-3 font-sans">
          <h4 className="font-bold uppercase text-xs text-slate-900">
            G. Instrumen Refleksi Pendidik dan Peserta Didik
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tabel Refleksi Guru */}
            <div className="border border-black">
              <div className="bg-slate-200 px-2.5 py-1 font-bold text-[11px] border-b border-black text-slate-900">
                Tabel Refleksi Guru:
              </div>
              <table className="w-full border-collapse text-[10.5px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-black text-left font-bold">
                    <th className="p-1 border-r border-black w-8 text-center">No</th>
                    <th className="p-1">Pertanyaan Refleksi</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultRefleksiGuru.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-300 last:border-b-0 font-serif">
                      <td className="p-1 border-r border-black text-center font-sans">{item.no}</td>
                      <td className="p-1 text-slate-900">{item.pertanyaan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tabel Refleksi Peserta Didik */}
            <div className="border border-black">
              <div className="bg-slate-200 px-2.5 py-1 font-bold text-[11px] border-b border-black text-slate-900">
                Tabel Refleksi Peserta Didik:
              </div>
              <table className="w-full border-collapse text-[10.5px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-black text-left font-bold">
                    <th className="p-1 border-r border-black w-8 text-center">No</th>
                    <th className="p-1">Pertanyaan Refleksi Diri</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultRefleksiSiswa.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-300 last:border-b-0 font-serif">
                      <td className="p-1 border-r border-black text-center font-sans">{item.no}</td>
                      <td className="p-1 text-slate-900">{item.pertanyaan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* H. Pengayaan & Remedial */}
        <div className="space-y-1 font-sans">
          <h4 className="font-bold uppercase text-xs text-slate-900">
            H. Program Pengayaan dan Remedial
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-black p-2.5 space-y-1 bg-slate-50">
              <span className="font-bold text-xs block text-emerald-950 border-b border-black pb-1">
                1. Program Pengayaan (Bagi yang Memenuhi KKTP)
              </span>
              <textarea
                rows={3}
                value={pengayaan}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, pengayaan: e.target.value }))
                }
                className="w-full font-serif text-xs bg-transparent outline-none resize-y print:hidden"
              />
              <div className="hidden print:block font-serif text-xs leading-relaxed text-slate-900 whitespace-pre-wrap">
                {pengayaan}
              </div>
            </div>
            <div className="border border-black p-2.5 space-y-1 bg-slate-50">
              <span className="font-bold text-xs block text-amber-950 border-b border-black pb-1">
                2. Program Remedial (Bagi yang Perlu Bimbingan)
              </span>
              <textarea
                rows={3}
                value={remedial}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, remedial: e.target.value }))
                }
                className="w-full font-serif text-xs bg-transparent outline-none resize-y print:hidden"
              />
              <div className="hidden print:block font-serif text-xs leading-relaxed text-slate-900 whitespace-pre-wrap">
                {remedial}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          III. LAMPIRAN DOKUMEN RESMI
      ══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4 pt-4 border-t-2 border-slate-400">
        <div className="bg-slate-900 text-white px-3 py-1 font-sans font-bold uppercase text-[11px] tracking-wide flex justify-between items-center rounded-xs">
          <span>III. LAMPIRAN DOKUMEN MODUL AJAR</span>
          <span className="text-[9px] font-normal text-slate-300">LKPD Resmi, Rubrik, Bahan Bacaan, Glosarium & Pustaka</span>
        </div>

        {/* ── LAMPIRAN 1: LEMBAR KERJA PESERTA DIDIK (LKPD) ── */}
        <div className="border-2 border-black p-5 space-y-3 bg-white">
          {/* Quick interactive switcher in preview (hidden in print) */}
          {formState.lkpdVariations && formState.lkpdVariations.length > 0 && (
            <div className="no-print print:hidden mb-3 p-2.5 bg-emerald-50/90 border border-emerald-300 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <label htmlFor="lkpd-variation-select-canvas">Pilihan Model LKPD Lampiran:</label>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <select
                  id="lkpd-variation-select-canvas"
                  value={formState.selectedLkpdVariationId || formState.lkpdVariations[0]?.id || ''}
                  onChange={(e) => {
                    const v = formState.lkpdVariations?.find((item) => item.id === e.target.value);
                    if (v) {
                      setFormState((prev) => ({
                        ...prev,
                        lkpdTitle: v.title,
                        lkpdBadge: v.badge,
                        lkpdType: v.type,
                        lkpdInstructions: v.instructions,
                        lkpdQuestions: v.questions,
                        lkpdRubrik: v.targetRubrik,
                        selectedLkpdVariationId: v.id,
                      }));
                    }
                  }}
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-emerald-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  {formState.lkpdVariations.map((v) => (
                    <option key={v.id} value={v.id}>
                      [{v.badge}] {v.title}
                    </option>
                  ))}
                </select>
                <span className="hidden md:inline text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                  Otomatis update lembar kerja & rubrik
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center text-center gap-1 border-b border-black pb-3">
            {lkpdBadge && (
              <span className="inline-block px-2.5 py-0.5 bg-slate-100 border border-black font-sans text-[10px] font-bold uppercase tracking-wider">
                {lkpdBadge}
              </span>
            )}
            <h3 className="font-bold text-center uppercase text-sm font-sans tracking-wide text-black">
              {lkpdTitle || `LEMBAR KERJA PESERTA DIDIK (LKPD) PERTEMUAN KE-${meetingNumber}`}
            </h3>
            <p className="text-[11px] font-sans text-slate-700">
              Mata Pelajaran: {currentSubject.subjectName} | Kelas {selectedGrade} | {bukuSiswaPages ? `Rujukan Buku Siswa: ${bukuSiswaPages}` : ''}
            </p>
          </div>

          {/* Identitas Kelompok Siswa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans border-b border-black pb-3">
            <div className="space-y-1">
              <div><strong>Nama Kelompok:</strong> ................................................................</div>
              <div><strong>Kelas / Semester:</strong> {selectedGrade} / {kop.academicSemester || 'Semester Ganjil'}</div>
            </div>
            <div className="space-y-1">
              <div><strong>Anggota Kelompok:</strong></div>
              <div>1. .................................................... 3. ....................................................</div>
              <div>2. .................................................... 4. ....................................................</div>
            </div>
          </div>

          {/* Petunjuk Pengerjaan */}
          <div className="space-y-2 font-serif text-xs">
            <div className="font-bold font-sans text-xs uppercase text-slate-900">
              A. Petunjuk Pengerjaan:
            </div>
            {lkpdInstructions && lkpdInstructions.length > 0 ? (
              <ol className="list-decimal list-inside space-y-1">
                {lkpdInstructions.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ol>
            ) : (
              <ol className="list-decimal list-inside space-y-1">
                <li>Bacalah setiap instruksi soal dan stimulus materi pendukung dengan cermat.</li>
                <li>Diskusikan bersama rekan sekelompokmu untuk merumuskan jawaban terbaik.</li>
                <li>Tuliskan hasil diskusi pada kolom jawaban yang telah disediakan bawah ini.</li>
                <li>Persiapkan salah satu anggota kelompok untuk mempresentasikan hasil karya di depan kelas.</li>
              </ol>
            )}

            {/* Aktivitas & Soal Diskusi Kelompok */}
            <div className="border border-black p-3 space-y-3 mt-3 bg-slate-50">
              <div className="font-bold font-sans text-xs uppercase text-blue-950 border-b border-blue-200 pb-1">
                B. Aktivitas & Lembar Diskusi / Penyelidikan Kelompok:
              </div>
              {lkpdQuestions && lkpdQuestions.length > 0 ? (
                <div className="space-y-3">
                  {lkpdQuestions.map((q, i) => (
                    <div key={i} className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-950">{i + 1}. {q}</p>
                      <div className="border border-dotted border-black p-2 bg-white min-h-[50px] text-slate-400 italic text-[10px]">
                        [Kolom Jawaban / Resume Analisis Kelompok]
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="italic text-xs text-slate-900">
                    "Jelaskan bagaimana konsep {currentTpItem?.elementName} ({currentTpItem?.tp.title}) dapat menjadi solusi pemecahan masalah riil di lingkungan sekitar kalian!"
                  </p>
                  <div className="border-b border-dotted border-black h-8" />
                  <div className="border-b border-dotted border-black h-8" />
                  <div className="border-b border-dotted border-black h-8" />
                </div>
              )}
            </div>

            {/* Rubrik Penilaian Unjuk Kerja Berjenjang */}
            {lkpdRubrik && lkpdRubrik.length > 0 && (
              <div className="mt-3 pt-3 border-t border-black space-y-1.5 font-sans">
                <div className="font-bold text-[11px] uppercase tracking-wide text-slate-900">
                  C. Rubrik Penilaian Unjuk Kerja LKPD (Skala 1 - 4):
                </div>
                <table className="w-full border-collapse border border-black text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-center font-bold">
                      <th className="border border-black p-1.5 w-32">Kriteria Penilaian</th>
                      <th className="border border-black p-1.5">Sangat Baik (4)</th>
                      <th className="border border-black p-1.5">Baik (3)</th>
                      <th className="border border-black p-1.5">Cukup (2)</th>
                      <th className="border border-black p-1.5">Perlu Bimbingan (1)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lkpdRubrik.map((rubrik, rIdx) => (
                      <tr key={rIdx}>
                        <td className="border border-black p-1.5 font-semibold bg-slate-50">{rubrik.kriteria}</td>
                        <td className="border border-black p-1.5">{rubrik.skor4}</td>
                        <td className="border border-black p-1.5">{rubrik.skor3}</td>
                        <td className="border border-black p-1.5">{rubrik.skor2}</td>
                        <td className="border border-black p-1.5">{rubrik.skor1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── LAMPIRAN 2: BAHAN BACAAN GURU & SISWA ── */}
        {(bahanBacaanGuruSiswa || bukuSiswaSubBab) && (
          <div className="border border-black p-3 space-y-1.5 font-sans bg-slate-50">
            <span className="font-bold block uppercase text-[11px] bg-slate-200 p-1 border-b border-black text-slate-900">
              Lampiran 2: Bahan Bacaan Guru dan Peserta Didik
            </span>
            <p className="font-serif text-xs leading-relaxed pt-1 text-slate-900">
              {bahanBacaanGuruSiswa || `Materi ajar esensial bersumber dari ${bukuSiswaTitle || 'Buku Teks Kemendikbudristek RI'}, ${bukuSiswaBab || ''} (${bukuSiswaSubBab || ''}) ${bukuSiswaPages || ''}. Pendidik dan peserta didik dianjurkan memperkaya wawasan melalui studi literasi perpustakaan, artikel ilmiah terverifikasi, dan situs resmi kementerian terkait.`}
            </p>
          </div>
        )}

        {/* ── LAMPIRAN 3 & 4: GLOSARIUM & DAFTAR PUSTAKA ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 font-sans text-[11px]">
          {glosarium && (
            <div className="border border-black p-3 space-y-1 bg-slate-50">
              <span className="font-bold block uppercase text-[10px] bg-slate-200 p-1 border-b border-black text-slate-900">
                Lampiran 3: Glosarium Istilah Penting
              </span>
              <p className="font-serif text-xs leading-relaxed pt-1 text-slate-900">{glosarium}</p>
            </div>
          )}
          {daftarPustaka && (
            <div className="border border-black p-3 space-y-1 bg-slate-50">
              <span className="font-bold block uppercase text-[10px] bg-slate-200 p-1 border-b border-black text-slate-900">
                Lampiran 4: Daftar Pustaka
              </span>
              <p className="font-serif text-xs leading-relaxed pt-1 text-slate-900">{daftarPustaka}</p>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LEMBAR PENGESAHAN DOKUMEN (TANDA TANGAN RESMI)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="pt-8 flex justify-between font-serif text-xs border-t border-slate-300">
        <div className="text-center w-60">
          <div>Mengetahui,</div>
          <div className="font-bold">Kepala {kop.schoolName}</div>
          <div className="h-20" />
          <div className="font-bold underline text-black">{kop.headmasterName}</div>
          <div>NIP. {kop.headmasterNip}</div>
        </div>

        <div className="text-center w-60">
          <div>{kop.dateLocation}</div>
          <div className="font-bold">Guru Mata Pelajaran</div>
          <div className="h-20" />
          <div className="font-bold underline text-black">{kop.teacherName}</div>
          <div>NIP. {kop.teacherNip}</div>
        </div>
      </div>
    </div>
  );
};
