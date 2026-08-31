import React, { useState, useMemo, useEffect } from 'react';
import type {
  CPSubject,
  CPTujuanPembelajaran,
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
} from '../../types';
import { initialCpSubjects, findCpSubjectId } from '../../data/cpMasterData';
import {
  masterBukuSiswaData,
  findBukuSiswaSubject,
  resolveLkpdVariations,
  type BukuSiswaBab,
  type BukuSiswaSubBab,
  type LKPDVariation,
} from '../../data/bukuSiswaData';
import { smartPrint } from '../../utils/printHelper';
import {
  BookOpen,
  Sparkles,
  Printer,
  CheckCircle2,
  BookmarkCheck,
} from 'lucide-react';

import type { KopData, ModulAjarFormState } from './modul-ajar/types';
import { ModulAjarKopEditor } from './modul-ajar/ModulAjarKopEditor';
import { ModulAjarForm } from './modul-ajar/ModulAjarForm';
import { ModulAjarCanvas } from './modul-ajar/ModulAjarCanvas';

interface ModulAjarGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
}

export const ModulAjarGenerator: React.FC<ModulAjarGeneratorProps> = ({
  school,
  teacher,
  year,
  selectedAssignmentSubject,
  selectedClassLabel,
}) => {
  // Master Subjects Data
  const [subjects] = useState<CPSubject[]>(initialCpSubjects);
  const activeSubjectName = selectedAssignmentSubject || teacher.subject || 'Pendidikan Pancasila';

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(() =>
    findCpSubjectId(initialCpSubjects, activeSubjectName)
  );

  useEffect(() => {
    const targetSubjectId = findCpSubjectId(subjects, activeSubjectName);
    if (targetSubjectId) {
      setSelectedSubjectId(targetSubjectId);
    }
  }, [activeSubjectName, subjects]);

  const [selectedGrade, setSelectedGrade] = useState<'VII' | 'VIII' | 'IX'>(() => {
    if (selectedClassLabel?.toUpperCase().includes('VIII')) return 'VIII';
    if (selectedClassLabel?.toUpperCase().includes('IX')) return 'IX';
    return 'VII';
  });

  useEffect(() => {
    if (selectedClassLabel?.toUpperCase().includes('VIII')) setSelectedGrade('VIII');
    else if (selectedClassLabel?.toUpperCase().includes('IX')) setSelectedGrade('IX');
    else if (selectedClassLabel?.toUpperCase().includes('VII')) setSelectedGrade('VII');
  }, [selectedClassLabel]);

  // Selected Subject & TPs
  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  }, [subjects, selectedSubjectId]);

  const gradeTps = useMemo(() => {
    if (!currentSubject) return [];
    const list: { elementName: string; tp: CPTujuanPembelajaran }[] = [];
    currentSubject.elements.forEach((elem) => {
      elem.tpList.forEach((tp) => {
        if (tp.classGrade === selectedGrade || !tp.classGrade) {
          list.push({
            elementName: elem.name,
            tp,
          });
        }
      });
    });
    return list;
  }, [currentSubject, selectedGrade]);

  const [selectedTpCode, setSelectedTpCode] = useState<string>('');

  // Automatically pick first TP when list changes
  useEffect(() => {
    if (gradeTps.length > 0 && !gradeTps.some((item) => item.tp.code === selectedTpCode)) {
      setSelectedTpCode(gradeTps[0].tp.code);
    }
  }, [gradeTps, selectedTpCode]);

  const currentTpItem = useMemo(() => {
    return gradeTps.find((item) => item.tp.code === selectedTpCode) || gradeTps[0];
  }, [gradeTps, selectedTpCode]);

  // Buku Siswa Integration
  const bukuSiswaSubject = useMemo(() => {
    return findBukuSiswaSubject(currentSubject.subjectName, selectedGrade);
  }, [currentSubject.subjectName, selectedGrade]);

  const [selectedBabId, setSelectedBabId] = useState<string>('bab-1-pkn-7');
  const [selectedSubBabId, setSelectedSubBabId] = useState<string>('sub-1a');

  // Form State for Modul Ajar
  const [meetingNumber, setMeetingNumber] = useState<number>(1);
  const [timeAllocation, setTimeAllocation] = useState<string>('2 x 40 Menit (Pertemuan Ke-1)');
  const [learningModel, setLearningModel] = useState<string>('Discovery Learning & Diskusi Kelompok');
  const [p3Dimensions, setP3Dimensions] = useState<string[]>([
    'Beriman & Bertakwa kepada Tuhan YME',
    'Berkebinekaan Global',
    'Bernalar Kritis',
  ]);

  const initialSubBab = masterBukuSiswaData[0]?.babList[0]?.subBabList[0];
  const initialVariations = initialSubBab ? resolveLkpdVariations(initialSubBab) : [];
  const initialDefaultVariation = initialVariations[0];

  const [sarpras, setSarpras] = useState<string>(
    initialSubBab?.sarpras || 'Buku Siswa Kemendikbud Hal. 1-9, Peta Wilayah Nusantara Kuno, Video Dokumenter Sejarah, LCD Proyektor, LKPD.'
  );

  const [formState, setFormState] = useState<ModulAjarFormState>({
    meetingNumber: 1,
    timeAllocation: initialSubBab?.alokasiWaktu || '2 x 40 Menit (Pertemuan Ke-1)',
    learningModel: initialSubBab?.modelPembelajaran || 'Discovery Learning & Diskusi Kelompok',
    p3Dimensions: initialSubBab?.p3Dimensions || ['Beriman & Bertakwa kepada Tuhan YME', 'Berkebinekaan Global', 'Bernalar Kritis'],
    sarpras: initialSubBab?.sarpras || 'Buku Siswa Kemendikbud Hal. 1-9, Peta Wilayah Nusantara Kuno, Video Dokumenter Sejarah, LCD Proyektor, LKPD.',
    targetSiswa: 'Peserta Didik Reguler / Tipikal (28–32 Siswa)',
    kompetensiAwal: 'Peserta didik telah memahami pengantar nilai-nilai dasar persatuan dan norma-norma kehidupan bermasyarakat dari fase sebelumnya.',
    pendekatanMetode: 'Pendekatan Saintifik & Deep Learning; Metode: Diskusi Terbimbing, Penyelidikan Berkelompok, Tanya Jawab, Penugasan LKPD, dan Presentasi.',
    iktpList: [
      'Menjelaskan latar historis dan substansi materi secara runtut dan mendalam.',
      'Mengidentifikasi dan menganalisis keterkaitan materi dengan fenomena riil kehidupan berbangsa.',
      'Menyelesaikan studi kasus atau penugasan LKPD kelompok secara kolaboratif.',
      'Mempresentasikan hasil telaah kritis di hadapan kelas dengan santun dan bertanggung jawab.'
    ],
    pemahamanBermakna: initialSubBab?.pemahamanBermakna || 'Nilai-nilai luhur Pancasila (ketuhanan, kemanusiaan, gotong royong, dan keadilan) telah lama hidup dan dipraktikkan oleh nenek moyang bangsa Indonesia jauh sebelum Indonesia merdeka.',
    pertanyaanPemantik: initialSubBab?.pertanyaanPemantik || [
      'Mengapa nilai-nilai Pancasila dikatakan digali dari bumi pertiwi Indonesia sendiri?',
      'Bagaimana perikehidupan masyarakat Nusantara masa lampau mencerminkan nilai ketuhanan dan persatuan?',
      'Apa dampak penjajahan terhadap timbulnya rasa senasib sepenanggungan para pejuang bangsa?',
    ],
    bukuSiswaTitle: 'Buku Panduan Guru dan Buku Siswa Pendidikan Pancasila SMP Kelas VII (Kemendikbudristek RI)',
    bukuSiswaBab: masterBukuSiswaData[0]?.babList[0]?.title || 'Bab I: Sejarah Kelahiran Pancasila',
    bukuSiswaSubBab: initialSubBab?.title || 'Sub-Bab A: Latar Sejarah Kelahiran Pancasila',
    bukuSiswaPages: initialSubBab?.pages || 'Hal. 1 – 9',
    kegiatanAwal: initialSubBab?.kegiatanAwal || '',
    kegiatanInti: initialSubBab?.kegiatanInti || '',
    kegiatanPenutup: initialSubBab?.kegiatanPenutup || '',
    asesmenDiagnostik: initialSubBab?.asesmenDiagnostik || '',
    asesmenFormatif: initialSubBab?.asesmenFormatif || '',
    asesmenSumatif: initialSubBab?.asesmenSumatif || '',
    remedial: initialSubBab?.remedial || '',
    pengayaan: initialSubBab?.pengayaan || '',
    lkpdTitle: initialDefaultVariation?.title || initialSubBab?.lkpdTitle || 'LKPD 1.A: Jejak Nilai Luhur Bangsa pada Masa Awal Sejarah Nusantara',
    lkpdBadge: initialDefaultVariation?.badge || 'Studi Kasus Kontekstual',
    lkpdType: initialDefaultVariation?.type || 'studi_kasus',
    lkpdInstructions: initialDefaultVariation?.instructions || initialSubBab?.lkpdInstructions || [],
    lkpdQuestions: initialDefaultVariation?.questions || initialSubBab?.lkpdQuestions || [],
    lkpdVariations: initialVariations,
    selectedLkpdVariationId: initialDefaultVariation?.id,
    lkpdRubrik: initialDefaultVariation?.targetRubrik,
    bahanBacaanGuruSiswa: 'Buku Siswa dan Buku Panduan Guru Pendidikan Pancasila SMP Kemendikbudristek RI, serta bahan ajar digital kurikulum merdeka.',
    glosarium: initialSubBab?.glosarium || '',
    daftarPustaka: initialSubBab?.daftarPustaka || '',
  });

  // Apply authentic Buku Siswa data to Modul Ajar Form State
  const applyBukuSiswaSubBab = (bab: BukuSiswaBab, subBab: BukuSiswaSubBab) => {
    // Derive meeting number from subBab code or sequence
    const meetingMatch = subBab.alokasiWaktu.match(/Pertemuan (?:Ke-)?(\d+)/i);
    const parsedMeeting = meetingMatch ? parseInt(meetingMatch[1]) : meetingNumber;

    setMeetingNumber(parsedMeeting);
    setTimeAllocation(subBab.alokasiWaktu);
    setLearningModel(subBab.modelPembelajaran);
    setP3Dimensions(subBab.p3Dimensions);
    setSarpras(subBab.sarpras);

    const variations = resolveLkpdVariations(subBab);
    const defaultVariation = variations[0];

    setFormState((prev) => ({
      ...prev,
      meetingNumber: parsedMeeting,
      timeAllocation: subBab.alokasiWaktu,
      learningModel: subBab.modelPembelajaran,
      p3Dimensions: subBab.p3Dimensions,
      sarpras: subBab.sarpras,
      kompetensiAwal: `Peserta didik telah memahami pengantar konsep materi ${subBab.title} dan norma-norma kehidupan bermasyarakat dari materi sebelumnya.`,
      pendekatanMetode: `Pendekatan Saintifik & Deep Learning (${subBab.modelPembelajaran}); Metode: Diskusi Terbimbing, Penyelidikan Berkelompok, Tanya Jawab, Penugasan LKPD, dan Presentasi.`,
      iktpList: [
        `Menjelaskan substansi esensial ${subBab.title} secara runtut dan mendalam.`,
        `Menganalisis keterkaitan materi ${subBab.title} dengan realitas kehidupan berbangsa dan bernegara.`,
        `Menyelesaikan aktivitas unjuk kerja kelompok pada ${defaultVariation?.title || subBab.lkpdTitle} secara kolaboratif.`,
        `Mempresentasikan hasil kerja dengan argumen yang sistematis, logis, dan santun.`
      ],
      bukuSiswaTitle: bukuSiswaSubject?.bookTitle || 'Buku Siswa Kemendikbudristek RI',
      bukuSiswaBab: bab.title,
      bukuSiswaSubBab: subBab.title,
      bukuSiswaPages: subBab.pages,
      pemahamanBermakna: subBab.pemahamanBermakna,
      pertanyaanPemantik: subBab.pertanyaanPemantik,
      kegiatanAwal: subBab.kegiatanAwal,
      kegiatanInti: subBab.kegiatanInti,
      kegiatanPenutup: subBab.kegiatanPenutup,
      asesmenDiagnostik: subBab.asesmenDiagnostik,
      asesmenFormatif: subBab.asesmenFormatif,
      asesmenSumatif: subBab.asesmenSumatif,
      remedial: subBab.remedial,
      pengayaan: subBab.pengayaan,
      lkpdTitle: defaultVariation?.title || subBab.lkpdTitle,
      lkpdBadge: defaultVariation?.badge || 'Aktivitas Resmi Buku Siswa',
      lkpdType: defaultVariation?.type || 'studi_kasus',
      lkpdInstructions: defaultVariation?.instructions || subBab.lkpdInstructions,
      lkpdQuestions: defaultVariation?.questions || subBab.lkpdQuestions,
      lkpdVariations: variations,
      selectedLkpdVariationId: defaultVariation?.id,
      lkpdRubrik: defaultVariation?.targetRubrik,
      bahanBacaanGuruSiswa: `${bukuSiswaSubject?.bookTitle || 'Buku Siswa Kemendikbudristek RI'}, ${bab.title} (${subBab.title}), ${subBab.pages}. Disertai sumber digital Rumah Belajar & Portal Kemendikbudristek.`,
      glosarium: subBab.glosarium,
      daftarPustaka: subBab.daftarPustaka,
    }));

    showToast(`📘 Modul Ajar disinkronkan dengan ${bab.title} (${subBab.title})!`);
  };

  // Handle LKPD Variation Selection
  const handleSelectLkpdVariation = (variation: LKPDVariation) => {
    setFormState((prev) => ({
      ...prev,
      lkpdTitle: variation.title,
      lkpdBadge: variation.badge,
      lkpdType: variation.type,
      lkpdInstructions: variation.instructions,
      lkpdQuestions: variation.questions,
      lkpdRubrik: variation.targetRubrik,
      selectedLkpdVariationId: variation.id,
    }));
    showToast(`📋 Variasi LKPD diterapkan: ${variation.badge}`);
  };

  // Auto-switch bab and sub-bab when changing grade or bukuSiswaSubject
  useEffect(() => {
    if (bukuSiswaSubject && bukuSiswaSubject.babList.length > 0) {
      const firstBab = bukuSiswaSubject.babList[0];
      const firstSubBab = firstBab.subBabList[0];
      if (firstBab && firstSubBab) {
        setSelectedBabId(firstBab.id);
        setSelectedSubBabId(firstSubBab.id);
        applyBukuSiswaSubBab(firstBab, firstSubBab);
      }
    }
  }, [bukuSiswaSubject?.id]);

  // Keep meetingNumber, timeAllocation, etc in sync with formState
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      meetingNumber,
      timeAllocation,
      learningModel,
      p3Dimensions,
      sarpras,
    }));
  }, [meetingNumber, timeAllocation, learningModel, p3Dimensions, sarpras]);

  // Kop & Signatures
  const [kop, setKop] = useState<KopData>({
    governmentAgency: school.subdistrict ? `PEMERINTAH KABUPATEN BENGKALIS / DINAS PENDIDIKAN` : 'PEMERINTAH KABUPATEN BENGKALIS / DINAS PENDIDIKAN',
    schoolName: school.name || 'SMP NEGERI 1 BANTAN',
    schoolAddress: school.address || 'Jl. Utama No. 12, Kec. Bantan, Kab. Bengkalis, Riau - Kode Pos 28754',
    headmasterName: school.headmasterName || 'Drs. H. M. YUSUF, M.Pd.',
    headmasterNip: school.headmasterNip || '19680512 199403 1 004',
    teacherName: teacher.name || 'SITI AMINAH, S.Pd.',
    teacherNip: teacher.nip || '19850410 201001 2 015',
    dateLocation: `${school.subdistrict || 'Bantan'}, 14 Juli 2025`,
    academicSemester: 'Semester Ganjil (I)',
  });

  const [isEditingKop, setIsEditingKop] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Auto Generate Smart Preset Content when TP changes or on Auto-Fill click
  const handleAutoGenerateContent = () => {
    if (bukuSiswaSubject) {
      const currentBab = bukuSiswaSubject.babList.find((b) => b.id === selectedBabId) || bukuSiswaSubject.babList[0];
      const currentSub = currentBab.subBabList.find((s) => s.id === selectedSubBabId) || currentBab.subBabList[0];
      applyBukuSiswaSubBab(currentBab, currentSub);
      return;
    }

    if (!currentTpItem) return;
    const tpTitle = currentTpItem.tp.title;
    const elemName = currentTpItem.elementName;

    setFormState((prev) => ({
      ...prev,
      pemahamanBermakna: `Dengan mempelajari ${elemName} khususnya mengenai ${tpTitle.toLowerCase()}, peserta didik mampu berpikir kritis, menganalisis masalah riil, dan menerapkan solusinya dalam kehidupan bermasyarakat.`,
      pertanyaanPemantik: [
        `Apa yang terjadi jika kita tidak memahami ${tpTitle.toLowerCase()} dalam konteks kehidupan sehari-hari?`,
        `Bagaimana langkah nyata yang dapat kita lakukan untuk mengaplikasikan konsep ${elemName} ini?`,
      ],
      kegiatanAwal: `1. Guru menyapa peserta didik, memimpin doa, dan mendata kehadiran.\n2. Guru melakukan apersepsi tentang ${elemName}.\n3. Guru menyampaikan TP [${currentTpItem.tp.code}]: "${tpTitle}" serta skema asesmen.`,
      kegiatanInti: `Fase 1 (Orientasi Masalah):\n- Guru memberikan pemantik materi ${tpTitle.toLowerCase()}.\n\nFase 2 (Diskusi Terbimbing):\n- Peserta didik mengamati lembar kerja (LKPD) kelompok.\n\nFase 3 (Penyelidikan):\n- Mengumpulkan data dan mendiskusikan pemecahan masalah ${elemName}.\n\nFase 4 (Presentasi & Feedback):\n- Kelompok mempresentasikan rumusan solusi di depan kelas.`,
    }));

    showToast('✨ Modul Ajar berhasil diderivasi secara otomatis dari TP!');
  };

  const toggleP3Dimension = (dim: string) => {
    if (p3Dimensions.includes(dim)) {
      setP3Dimensions(p3Dimensions.filter((d) => d !== dim));
    } else {
      setP3Dimensions([...p3Dimensions, dim]);
    }
  };

  const handlePrint = () => {
    smartPrint({
      documentSelector: '.document-page',
      docTitle: `Modul Ajar - ${currentSubject.subjectName} Kelas ${selectedGrade} (${formState.bukuSiswaSubBab || currentTpItem?.tp.code || ''})`,
      orientation: 'portrait',
    });
  };

  const allP3Options = [
    'Beriman & Bertakwa kepada Tuhan YME',
    'Berkebinekaan Global',
    'Gotong Royong',
    'Mandiri',
    'Bernalar Kritis',
    'Kreatif',
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Modul Ajar Kurikulum Merdeka
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sinkron Buku Siswa BSKAP Kemendikbudristek
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Generator Modul Ajar Berbasis Buku Siswa
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Modul Ajar telah disesuaikan langsung dengan bab, sub-bab, pertanyaan pemantik, halaman buku teks, aktivitas LKPD, serta glosarium dari <strong>Buku Siswa Pendidikan Pancasila SMP Kelas VII Kemendikbudristek RI</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAutoGenerateContent}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Muat Materi Buku Siswa</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Modul / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KOP EDITOR PANEL ── */}
      {isEditingKop && (
        <ModulAjarKopEditor
          kop={kop}
          setKop={setKop}
          onClose={() => setIsEditingKop(false)}
        />
      )}

      {/* ── TOOLBAR FORM BUILDER ── */}
      <ModulAjarForm
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        setSelectedSubjectId={setSelectedSubjectId}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        meetingNumber={meetingNumber}
        setMeetingNumber={setMeetingNumber}
        timeAllocation={timeAllocation}
        setTimeAllocation={setTimeAllocation}
        gradeTps={gradeTps}
        selectedTpCode={selectedTpCode}
        setSelectedTpCode={setSelectedTpCode}
        allP3Options={allP3Options}
        p3Dimensions={p3Dimensions}
        toggleP3Dimension={toggleP3Dimension}
        learningModel={learningModel}
        setLearningModel={setLearningModel}
        sarpras={sarpras}
        setSarpras={setSarpras}
        isEditingKop={isEditingKop}
        setIsEditingKop={setIsEditingKop}
        bukuSiswaSubject={bukuSiswaSubject}
        selectedBabId={selectedBabId}
        setSelectedBabId={setSelectedBabId}
        selectedSubBabId={selectedSubBabId}
        setSelectedSubBabId={setSelectedSubBabId}
        onApplyBukuSiswaSubBab={applyBukuSiswaSubBab}
        selectedLkpdVariationId={formState.selectedLkpdVariationId}
        onSelectLkpdVariation={handleSelectLkpdVariation}
      />

      {/* ── OFFICIAL MODUL AJAR PRINT CANVAS ── */}
      <ModulAjarCanvas
        currentSubject={currentSubject}
        selectedGrade={selectedGrade}
        year={year}
        kop={kop}
        currentTpItem={currentTpItem}
        formState={formState}
        setFormState={setFormState}
      />
    </div>
  );
};
