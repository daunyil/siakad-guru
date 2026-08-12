import React, { useState, useMemo } from 'react';
import type {
  CPSubject,
  CPTujuanPembelajaran,
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
} from '../../types';
import { initialCpSubjects, findCpSubjectId } from '../../data/cpMasterData';
import { smartPrint } from '../../utils/printHelper';
import {
  BookOpen,
  Sparkles,
  Printer,
  CheckCircle2,
  Settings,
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
  const activeSubjectName = selectedAssignmentSubject || teacher.subject;

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(() =>
    findCpSubjectId(initialCpSubjects, activeSubjectName)
  );

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (selectedClassLabel?.toUpperCase().includes('VIII')) setSelectedGrade('VIII');
    else if (selectedClassLabel?.toUpperCase().includes('IX')) setSelectedGrade('IX');
    else if (selectedClassLabel?.toUpperCase().includes('VII')) setSelectedGrade('VII');
  }, [selectedClassLabel]);

  // Selected TP
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
  React.useEffect(() => {
    if (gradeTps.length > 0 && !gradeTps.some((item) => item.tp.code === selectedTpCode)) {
      setSelectedTpCode(gradeTps[0].tp.code);
    }
  }, [gradeTps]);

  const currentTpItem = useMemo(() => {
    return gradeTps.find((item) => item.tp.code === selectedTpCode) || gradeTps[0];
  }, [gradeTps, selectedTpCode]);

  // Form State for Modul Ajar
  const [meetingNumber, setMeetingNumber] = useState<number>(1);
  const [timeAllocation, setTimeAllocation] = useState<string>('2 x 40 Menit (1 Pertemuan)');
  const [learningModel, setLearningModel] = useState<string>('Problem Based Learning (PBL)');
  const [p3Dimensions, setP3Dimensions] = useState<string[]>([
    'Bernalar Kritis',
    'Gotong Royong',
    'Mandiri',
  ]);

  const [sarpras, setSarpras] = useState<string>(
    'LCD Projector, Laptop, Jaringan Internet, LKPD, Buku Teks Siswa, Spidol & Papan Tulis.'
  );

  const [formState, setFormState] = useState<ModulAjarFormState>({
    meetingNumber: 1,
    timeAllocation: '2 x 40 Menit (1 Pertemuan)',
    learningModel: 'Problem Based Learning (PBL)',
    p3Dimensions: ['Bernalar Kritis', 'Gotong Royong', 'Mandiri'],
    sarpras: 'LCD Projector, Laptop, Jaringan Internet, LKPD, Buku Teks Siswa, Spidol & Papan Tulis.',
    targetSiswa: 'Peserta Didik Reguler/Tipikal (28–32 Siswa)',
    pemahamanBermakna:
      'Peserta didik mampu memahami dan mengaplikasikan konsep dasar dalam kehidupan sehari-hari secara kritis dan produktif.',
    pertanyaanPemantik: [
      'Mengapa materi ini penting untuk kita pelajari dalam kehidupan sehari-hari?',
      'Pernahkah kamu menemukan fenomena terkait topik ini di sekitar rumah atau sekolahmu?',
    ],
    kegiatanAwal:
      '1. Guru membuka pembelajaran dengan salam, doa bersama, dan memeriksa kehadiran siswa.\n2. Guru menyampaikan apersepsi dengan mengaitkan materi sebelumnya.\n3. Guru menyampaikan tujuan pembelajaran, pemahaman bermakna, dan mekanisme penilaian.',
    kegiatanInti:
      'Fase 1: Orientasi Siswa pada Masalah\n- Guru menyajikan kasus/studi fenomena riil melalui slide presentasi.\n\nFase 2: Mengorganisasi Siswa untuk Belajar\n- Siswa dibagi menjadi kelompok heterogen (4-5 siswa) dan menerima LKPD.\n\nFase 3: Membimbing Penyelidikan Individu/Kelompok\n- Siswa berdiskusi mengumpulkan informasi dari buku teks dan bahan ajar.\n\nFase 4: Mengembangkan & Menyajikan Hasil Karya\n- Masing-masing kelompok menyusun laporan singkat dan mempresentasikan hasil diskusi.\n\nFase 5: Menganalisis & Evaluasi Proses Pemecahan Masalah\n- Guru memberikan umpan balik, penguatan konsep, dan apresiasi.',
    kegiatanPenutup:
      '1. Peserta didik bersama guru menyimpulkan poin-poin utama pembelajaran hari ini.\n2. Guru melakukan refleksi singkat bersama peserta didik.\n3. Guru memberikan tugas tindak lanjut / persiapan materi pertemuan berikutnya.\n4. Pembelajaran ditutup dengan doa dan salam.',
    asesmenDiagnostik:
      'Pertanyaan lisan apersepsi di awal pembelajaran untuk mengukur pengetahuan prasyarat.',
    asesmenFormatif:
      'Penilaian Sikap (Lembar Observasi Profil Pelajar Pancasila) & Penilaian Kinerja Diskusi LKPD.',
    asesmenSumatif: 'Tes Tertulis / Kuis di akhir sub-bab.',
    remedial:
      'Bimbingan perorangan atau tutor sebaya bagi peserta didik yang belum mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).',
    pengayaan:
      'Pemberian soal-soal tingkat tinggi (HOTS) atau analisis kasus tambahan bagi peserta didik dengan pencapaian tinggi.',
  });

  // Keep meetingNumber, timeAllocation, etc in sync with formState
  React.useEffect(() => {
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
    schoolName: school.name || 'SMP NEGERI 1 BANTAN',
    headmasterName: school.headmasterName || 'Drs. H. M. YUSUF, M.Pd.',
    headmasterNip: school.headmasterNip || '19680512 199403 1 004',
    teacherName: teacher.name || 'SITI AMINAH, S.Pd.',
    teacherNip: teacher.nip || '19850410 201001 2 015',
    dateLocation: 'Bantan, 14 Juli 2025',
  });

  const [isEditingKop, setIsEditingKop] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Auto Generate Smart Preset Content when TP changes or on Auto-Fill click
  const handleAutoGenerateContent = () => {
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
      docTitle: `Modul Ajar - ${currentSubject.subjectName} (${currentTpItem?.tp.code || ''})`,
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
                Tahap 3: Modul Ajar & RPP Merdeka
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Komponen Komplit BSKAP
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Generator Modul Ajar Interaktif (RPP Merdeka)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Otomatiskan penyusunan Modul Ajar berbasis Tujuan Pembelajaran (TP). Dilengkapi Identitas, Profil Pelajar Pancasila, Pertanyaan Pemantik, Sintaks Kegiatan Pembelajaran, Asesmen, hingga Lampiran LKPD.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAutoGenerateContent}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Auto-Fill Konten TP</span>
            </button>
            <button
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
