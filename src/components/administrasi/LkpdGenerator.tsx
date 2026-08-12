import React, { useState, useMemo } from 'react';
import type {
  CPSubject,
  CPTujuanPembelajaran,
  DocumentKopSettings,
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
} from '../../types';
import { initialCpSubjects, findCpSubjectId } from '../../data/cpMasterData';
import { smartPrint } from '../../utils/printHelper';
import {
  FileSpreadsheet,
  BookOpen,
  Building,
  User,
  Plus,
  Trash2,
  Edit3,
  Printer,
  Sparkles,
  Settings,
  X,
  CheckCircle2,
  FileText,
  HelpCircle,
  HelpCircle as QuestionIcon,
  Download,
  Users,
  Award,
  Layers,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

interface LkpdGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
}

export interface LkpdQuestion {
  id: string;
  type: 'essay' | 'table' | 'multiple_choice';
  questionText: string;
  tableHeaders?: string[];
  tableRowsCount?: number;
  mcOptions?: string[];
}

export interface LkpdData {
  title: string;
  meetingNumber: number;
  timeAllocation: string;
  targetClass: 'VII' | 'VIII' | 'IX';
  semester: 1 | 2;
  subjectId: string;
  elementName: string;
  tpCode: string;
  tpTitle: string;
  p5Dimensions: string[];
  toolsAndMaterials: string;
  generalInstructions: string[];
  stimulusText: string;
  activitySteps: string[];
  questions: LkpdQuestion[];
  reflectionQuestions: string[];
  rubricCriteria: Array<{
    aspect: string;
    score4: string;
    score3: string;
    score2: string;
    score1: string;
  }>;
}

export const LkpdGenerator: React.FC<LkpdGeneratorProps> = ({
  school,
  teacher,
  year,
  selectedAssignmentSubject,
  selectedClassLabel,
}) => {
  // Master Subject Data
  const [cpSubjects] = useState<CPSubject[]>(initialCpSubjects);
  const activeSubjectName = selectedAssignmentSubject || teacher.subject;

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(() =>
    findCpSubjectId(initialCpSubjects, activeSubjectName)
  );

  React.useEffect(() => {
    const targetSubjectId = findCpSubjectId(cpSubjects, activeSubjectName);
    if (targetSubjectId) {
      setSelectedSubjectId(targetSubjectId);
    }
  }, [activeSubjectName, cpSubjects]);

  const currentSubject = useMemo(() => {
    return cpSubjects.find((s) => s.id === selectedSubjectId) || cpSubjects[0];
  }, [cpSubjects, selectedSubjectId]);

  // Selected TP from Subject
  const [selectedElementId, setSelectedElementId] = useState<string>(
    currentSubject?.elements[0]?.id || ''
  );

  const currentElement = useMemo(() => {
    return (
      currentSubject?.elements.find((e) => e.id === selectedElementId) ||
      currentSubject?.elements[0]
    );
  }, [currentSubject, selectedElementId]);

  const [selectedTpCode, setSelectedTpCode] = useState<string>(
    currentElement?.tpList[0]?.code || ''
  );

  const currentTp = useMemo(() => {
    return (
      currentElement?.tpList.find((t) => t.code === selectedTpCode) ||
      currentElement?.tpList[0]
    );
  }, [currentElement, selectedTpCode]);

  // Kop Settings
  const [kopSettings, setKopSettings] = useState<DocumentKopSettings>({
    schoolName: school.name || 'SMP NEGERI 1 BANTAN',
    npsn: school.npsn || '10401234',
    address: school.address || 'Jl. Soekarno-Hatta No. 45, Bantan, Kab. Bengkalis',
    headmasterName: school.headmasterName || 'Drs. H. M. YUSUF, M.Pd.',
    headmasterNip: school.headmasterNip || '19680512 199403 1 004',
    teacherName: teacher.name || 'SITI AMINAH, S.Pd.',
    teacherNip: teacher.nip || '19850410 201001 2 015',
    dateLocation: 'Bantan, 18 Juli 2025',
  });

  React.useEffect(() => {
    setKopSettings((prev) => ({
      ...prev,
      schoolName: school.name || prev.schoolName,
      npsn: school.npsn || prev.npsn,
      address: school.address || prev.address,
      headmasterName: school.headmasterName || prev.headmasterName,
      headmasterNip: school.headmasterNip || prev.headmasterNip,
      teacherName: teacher.name || prev.teacherName,
      teacherNip: teacher.nip || prev.teacherNip,
    }));
  }, [school, teacher]);

  const [isEditingKop, setIsEditingKop] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // LKPD Active State Data
  const [lkpd, setLkpd] = useState<LkpdData>({
    title: `LKPD 01: Analisis Konsep & Penerapan ${currentTp?.code || 'TP-01'}`,
    meetingNumber: 1,
    timeAllocation: '2 x 40 Menit (2 JP)',
    targetClass: 'VII',
    semester: 1,
    subjectId: currentSubject?.id || '',
    elementName: currentElement?.name || 'Pancasila',
    tpCode: currentTp?.code || 'TP-01',
    tpTitle: currentTp?.title || 'Memahami dan menganalisis konsep dasar',
    p5Dimensions: ['Gotong Royong', 'Bernalar Kritis', 'Kreatif'],
    toolsAndMaterials: 'Buku Teks Siswa, Laptop/Smartphone, Alat Tulis, Kertas Karton, Sticky Notes.',
    generalInstructions: [
      'Berdoalah terlebih dahulu sebelum memulai diskusi kelompok.',
      'Bacalah setiap petunjuk dan stimulus masalah dengan cermat.',
      'Diskusikan bersama anggota kelompok secara aktif, santun, dan saling menghargai pendapat.',
      'Tuliskan hasil analisis dan jawaban kelompok pada kolom/tabel yang telah disediakan.',
      'Persiapkan perwakilan kelompok untuk mempresentasikan hasil diskusi di depan kelas.',
    ],
    stimulusText: `Seiring perkembangan zaman dan pesatnya teknologi digital, masyarakat di sekitar kita sering menghadapi berbagai tantangan sosial dan budaya. Bacalah kasus berikut:\n\n"Dalam sebuah komunitas lingkungan sekolah, ditemukan ketidakseimbangan antara kebiasaan warga dengan aturan yang berlaku. Beberapa siswa belum memahami secara mendalam pentingnya nilai kesadaran dan kerjasama dalam menyelesaikan masalah bersama."`,
    activitySteps: [
      'Langkah 1 (Mengamati): Amati wacana/stimulus fenomena sosial di atas dan catat poin-poin utama masalah.',
      'Langkah 2 (Menanya): Perumusan masalah: Mengapa fenomena tersebut dapat terjadi dan apa dampaknya?',
      'Langkah 3 (Mengumpulkan Informasi): Carilah referensi pendukung dari buku teks atau sumber belajar digital.',
      'Langkah 4 (Mengasosiasi): Diskusikan solusi konkret yang dapat diterapkan di lingkungan sekolah.',
      'Langkah 5 (Mengomunikasikan): Susun kesimpulan kelompok dan siapkan bahan presentasi.',
    ],
    questions: [
      {
        id: 'q1',
        type: 'essay',
        questionText: 'Berdasarkan wacana stimulus di atas, analisislah 3 (tiga) faktor utama yang menyebabkan terjadinya permasalahan tersebut!',
      },
      {
        id: 'q2',
        type: 'table',
        questionText: 'Lengkapilah tabel analisis hubungan antara masalah, dampak, dan usulan solusi kelompok berikut:',
        tableHeaders: ['No', 'Bentuk Masalah', 'Dampak Sosial/Lingkungan', 'Usulan Solusi Konkret'],
        tableRowsCount: 3,
      },
      {
        id: 'q3',
        type: 'essay',
        questionText: 'Bagaimana peran aktif siswa (sebagai bagian dari generasi muda) dalam mewujudkan nilai-nilai yang sesuai dengan materi pembelajaran ini?',
      },
    ],
    reflectionQuestions: [
      'Apa hal paling berharga yang kalian pelajari selama proses diskusi kelompok hari ini?',
      'Kendala atau kesulitan apa yang kelompok kalian hadapi saat menyelesaikan LKPD ini?',
      'Nilai Karakter (P5) apa yang paling terasa berkembang dalam diri kalian selama bekerja sama?',
    ],
    rubricCriteria: [
      {
        aspect: 'Aktifitas & Kerja Sama Kelompok (P5)',
        score4: 'Seluruh anggota kelompok terlibat aktif, kooperatif, dan saling mendukung.',
        score3: 'Sebagian besar anggota kelompok aktif berdiskusi.',
        score2: 'Hanya 1-2 orang yang mendominasi diskusi kelompok.',
        score1: 'Tidak ada kerja sama yang efektif dalam kelompok.',
      },
      {
        aspect: 'Kelengkapan & Kedalaman Jawaban LKPD',
        score4: 'Jawaban sangat lengkap, analisis mendalam, tajam, dan didukung fakta.',
        score3: 'Jawaban lengkap dan analisis tepat sesuai instruksi.',
        score2: 'Jawaban kurang lengkap dan analisis masih bersifat umum.',
        score1: 'Jawaban tidak lengkap dan belum menunjukkan pemahaman konsep.',
      },
      {
        aspect: 'Presentasi & Komunikasi Hasil',
        score4: 'Penyampaian sangat jelas, percaya diri, runtut, dan siap menjawab pertanyaan.',
        score3: 'Penyampaian jelas dan runtut.',
        score2: 'Penyampaian kurang lancar dan kurang percaya diri.',
        score1: 'Tidak mampu mempresentasikan hasil diskusi.',
      },
    ],
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Sync TP selection into LKPD
  const handleSelectTp = (subjectId: string, elementId: string, tpCode: string) => {
    const subj = cpSubjects.find((s) => s.id === subjectId) || cpSubjects[0];
    const elem = subj.elements.find((e) => e.id === elementId) || subj.elements[0];
    const tp = elem.tpList.find((t) => t.code === tpCode) || elem.tpList[0];

    setSelectedSubjectId(subjectId);
    setSelectedElementId(elementId);
    setSelectedTpCode(tpCode);

    // Auto update LKPD contents
    setLkpd((prev) => ({
      ...prev,
      subjectId: subj.id,
      elementName: elem.name,
      tpCode: tp.code,
      tpTitle: tp.title,
      title: `LKPD: ${elem.name} - ${tp.code}`,
      targetClass: tp.classGrade,
      semester: tp.semester || 1,
      stimulusText: `Siswa mengamati dan menganalisis fenomena nyata terkait materi ${tp.title.toLowerCase()}. Diskusikan secara berkelompok untuk menemukan pemahaman mendalam dan penerapan nyata.`,
      questions: [
        {
          id: 'q1',
          type: 'essay',
          questionText: `Jelaskan pengertian dan konsep utama dari ${tp.title.toLowerCase()} menurut pemahaman kelompok kalian!`,
        },
        {
          id: 'q2',
          type: 'table',
          questionText: `Identifikasilah contoh penerapan dan manfaat ${tp.title.toLowerCase()} dalam kehidupan sehari-hari pada tabel di bawah ini:`,
          tableHeaders: ['No', 'Bentuk Penerapan', 'Manfaat / Dampak Positif', 'Tantangan Pembiasaan'],
          tableRowsCount: 3,
        },
        {
          id: 'q3',
          type: 'essay',
          questionText: `Apabila ditemukan hambatan dalam penerapan ${tp.title.toLowerCase()}, apakah strategi atau solusi kreatif yang dapat kalian tawarkan?`,
        },
      ],
    }));

    showToast(`LKPD disesuaikan dengan ${tp.code}: ${tp.title.slice(0, 30)}...`);
  };

  // Generate LKPD Auto AI
  const handleGenerateAiLkpd = () => {
    if (!currentTp) return;

    setLkpd((prev) => ({
      ...prev,
      title: `LKPD Interaktif: ${currentElement.name} (${currentTp.code})`,
      stimulusText: `Dalam era globalisasi dan digitalisasi, pemahaman mengenai "${currentTp.title}" menjadi sangat krusial. Perhatikan studi kasus berikut:\n\nSebuah sekolah menengah mengalami peningkatan dinamika interaksi siswa. Untuk mengoptimalkan pencapaian pembelajaran pada elemen ${currentElement.name}, para siswa diminta melakukan studi literatur, pengamatan lingkungan sekitar, dan merumuskan ide terobosan secara berkelompok.`,
      toolsAndMaterials: `Buku Teks Utama ${currentSubject.subjectName}, Bahan Ajar Digital, Kertas Plano, Spidol Warna, Sticky Notes, Laptop/Tablet.`,
      activitySteps: [
        `Langkah 1 (Klarifikasi Konsep): Bacalah uraian materi tentang ${currentTp.title.toLowerCase()} di buku teks hlm. 12-25.`,
        'Langkah 2 (Pengamatan Fenomena): Diskusikan bersama 4-5 teman sekelompok mengenai studi kasus yang disajikan.',
        'Langkah 3 (Pengisian Tabel Analisis): Isilah tabel hasil eksplorasi dengan teliti dan lengkap.',
        'Langkah 4 (Perumusan Solusi & Kesimpulan): Buatlah kesimpulan bersama dan siapkan bahan paparan presentasi.',
      ],
      questions: [
        {
          id: 'q1',
          type: 'essay',
          questionText: `Gambarkan pentingnya mempelajari dan menguasai ${currentTp.title.toLowerCase()} bagi kehidupan peserta didik saat ini!`,
        },
        {
          id: 'q2',
          type: 'table',
          questionText: `Isilah tabel perbandingan dan pemetaan konsep materi ${currentElement.name} di bawah ini:`,
          tableHeaders: ['No', 'Aspek / Indikator', 'Kondisi Ideal', 'Fakta Lapangan', 'Rencana Aksi Kelompok'],
          tableRowsCount: 4,
        },
        {
          id: 'q3',
          type: 'essay',
          questionText: `Refleksikan bagaimana kelompok kalian akan menerapkan hasil pembelajaran ini secara nyata dalam kehidupan sekolah maupun masyarakat!`,
        },
      ],
    }));

    showToast('✨ LKPD berhasil diperbarui dengan AI Template Otomatis!');
  };

  // Add Question
  const handleAddQuestion = () => {
    const newId = `q_${Date.now()}`;
    setLkpd((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: newId,
          type: 'essay',
          questionText: 'Tuliskan pertanyaan diskusi / tugas kelompok tambahan di sini...',
        },
      ],
    }));
    showToast('Pertanyaan baru ditambahkan ke LKPD.');
  };

  // Delete Question
  const handleDeleteQuestion = (id: string) => {
    setLkpd((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
    showToast('Pertanyaan dihapus dari LKPD.');
  };

  const handlePrint = () => {
    smartPrint({
      documentSelector: '.document-page',
      docTitle: `LKPD - ${lkpd.title}`,
      orientation: 'portrait',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce no-print">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── HEADER BANNER: TAHAP 2 LKPD ── */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden no-print">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                Tahap 2: Kurikulum Merdeka
              </span>
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Lembar Kerja Peserta Didik (LKPD)
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Generator LKPD Interaktif & Cetak Siap Pakai
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Menyusun Lembar Kerja Peserta Didik (LKPD) kelompok/individu berbasis Tujuan Pembelajaran (TP). Dilengkapi Identitas, Stimulus Fenomena, Langkah Kerja Penyelidikan, Tabel Diskusi, Pertanyaan Analisis, Refleksi, hingga Rubrik Penilaian Kinerja.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <span>{kopSettings.schoolName}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>{kopSettings.teacherName}</span>
              </div>
              <button
                onClick={() => setIsEditingKop(!isEditingKop)}
                className="px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg border border-emerald-400/40 text-[11px] font-bold transition-all flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                <span>{isEditingKop ? 'Sembunyikan Form Kop' : 'Edit Kop Sekolah & Identitas'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={handleGenerateAiLkpd}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Auto-Generate AI LKPD</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF LKPD</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── FORM KOP (EXPANDABLE) ── */}
      {isEditingKop && (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200 no-print">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pengaturan Identitas Dokumen LKPD & Guru
              </h3>
            </div>
            <button
              onClick={() => setIsEditingKop(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan:</label>
              <input
                type="text"
                value={kopSettings.schoolName}
                onChange={(e) => setKopSettings({ ...kopSettings, schoolName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Guru Mata Pelajaran:</label>
              <input
                type="text"
                value={kopSettings.teacherName}
                onChange={(e) => setKopSettings({ ...kopSettings, teacherName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Guru:</label>
              <input
                type="text"
                value={kopSettings.teacherNip}
                onChange={(e) => setKopSettings({ ...kopSettings, teacherNip: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tempat & Tanggal LKPD:</label>
              <input
                type="text"
                value={kopSettings.dateLocation}
                onChange={(e) => setKopSettings({ ...kopSettings, dateLocation: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TP SELECTION & LKPD CONFIG CONTROL BAR ── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 no-print">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Pilih Target Tujuan Pembelajaran (TP) dari Kurikulum Merdeka
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 1. Subject */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran:</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                const sId = e.target.value;
                const subj = cpSubjects.find((s) => s.id === sId);
                const elem = subj?.elements[0];
                const tp = elem?.tpList[0];
                if (subj && elem && tp) {
                  handleSelectTp(subj.id, elem.id, tp.code);
                }
              }}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            >
              {cpSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subjectName} ({s.phase})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Element */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Elemen CP:</label>
            <select
              value={selectedElementId}
              onChange={(e) => {
                const elemId = e.target.value;
                const elem = currentSubject.elements.find((el) => el.id === elemId);
                const tp = elem?.tpList[0];
                if (elem && tp) {
                  handleSelectTp(currentSubject.id, elem.id, tp.code);
                }
              }}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            >
              {currentSubject.elements.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. TP Code */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tujuan Pembelajaran (TP):</label>
            <select
              value={selectedTpCode}
              onChange={(e) => {
                handleSelectTp(currentSubject.id, currentElement.id, e.target.value);
              }}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            >
              {currentElement.tpList.map((t) => (
                <option key={t.code} value={t.code}>
                  [{t.code}] {t.title.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected TP Summary */}
        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Target TP Terpilih: [{currentTp?.code}] — Kelas {currentTp?.classGrade} Sem {currentTp?.semester || 1}</span>
          </div>
          <p className="text-slate-700 leading-relaxed italic">
            "{currentTp?.title}"
          </p>
        </div>

        {/* LKPD Operational Config */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Judul LKPD:</label>
            <input
              type="text"
              value={lkpd.title}
              onChange={(e) => setLkpd({ ...lkpd, title: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Pertemuan Ke-:</label>
            <input
              type="number"
              min={1}
              value={lkpd.meetingNumber}
              onChange={(e) => setLkpd({ ...lkpd, meetingNumber: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Alokasi Waktu:</label>
            <input
              type="text"
              value={lkpd.timeAllocation}
              onChange={(e) => setLkpd({ ...lkpd, timeAllocation: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Alat & Bahan:</label>
            <input
              type="text"
              value={lkpd.toolsAndMaterials}
              onChange={(e) => setLkpd({ ...lkpd, toolsAndMaterials: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ── PRINTABLE LKPD WORKSHEET CANVAS ── */}
      <div className="bg-white p-6 md:p-10 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6 font-sans">
        
        {/* Printable Formal Header LKPD */}
        <div className="border-b-4 border-double border-black pb-4 text-center space-y-1">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
            {kopSettings.schoolName}
          </div>
          <h1 className="text-lg md:text-xl font-black uppercase text-slate-950 font-serif tracking-tight">
            LEMBAR KERJA PESERTA DIDIK (LKPD)
          </h1>
          <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            MATA PELAJARAN {currentSubject.subjectName.toUpperCase()} — {lkpd.title}
          </div>
        </div>

        {/* Identitas Kelompok Box */}
        <div className="border-2 border-black p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-900">
          <div className="space-y-1">
            <p><strong>Mata Pelajaran:</strong> {currentSubject.subjectName}</p>
            <p><strong>Kelas / Semester:</strong> {lkpd.targetClass} / {lkpd.semester === 1 ? 'Ganjil' : 'Genap'}</p>
            <p><strong>Elemen CP:</strong> {lkpd.elementName}</p>
            <p><strong>Pertemuan Ke- / Alokasi:</strong> Ke-{lkpd.meetingNumber} ({lkpd.timeAllocation})</p>
          </div>

          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-400 pt-2 md:pt-0 md:pl-4">
            <div className="flex items-center justify-between">
              <span className="font-bold">NAMA KELOMPOK:</span>
              <span className="border-b border-black w-40 inline-block text-center font-bold">.........................................</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold block">Anggota Kelompok:</span>
              <ol className="list-decimal list-inside space-y-1 text-[11px] font-sans text-slate-800">
                <li className="border-b border-dotted border-slate-400 pb-0.5">1. ..........................................................................</li>
                <li className="border-b border-dotted border-slate-400 pb-0.5">2. ..........................................................................</li>
                <li className="border-b border-dotted border-slate-400 pb-0.5">3. ..........................................................................</li>
                <li className="border-b border-dotted border-slate-400 pb-0.5">4. ..........................................................................</li>
                <li className="border-b border-dotted border-slate-400 pb-0.5">5. ..........................................................................</li>
              </ol>
            </div>
          </div>
        </div>

        {/* SECTION A: TUJUAN PEMBELAJARAN & INDIKATOR */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs md:text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
            <span>A. TUJUAN PEMBELAJARAN (TP) & PROFIL PELAJAR PANCASILA</span>
          </h3>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300 text-xs space-y-2">
            <div>
              <span className="font-bold text-blue-950 block">Kode & Rumusan TP:</span>
              <p className="text-slate-900 font-medium">[{currentTp?.code}] {currentTp?.title}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="font-bold text-amber-950 text-[11px]">Dimensi P5 Dikembangkan:</span>
              {lkpd.p5Dimensions.map((d, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold border border-amber-300 rounded text-[10px]">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION B: ALAT, BAHAN & PETUNJUK UMUM */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs md:text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
            <span>B. PETUNJUK KERJA & ALAT BAHAN</span>
          </h3>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300 text-xs space-y-2">
            <div>
              <span className="font-bold text-slate-900 block">Alat & Bahan Pembelajaran:</span>
              <p className="text-slate-800">{lkpd.toolsAndMaterials}</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 block mb-1">Petunjuk Umum Pengerjaan:</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-800 leading-relaxed">
                {lkpd.generalInstructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* SECTION C: STIMULUS / FENOMENA MASALAH */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs md:text-sm bg-emerald-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
            <span>C. STIMULUS FENOMENA / STUDI KASUS PEMANTIK</span>
          </h3>
          <div className="bg-emerald-50/50 p-4 rounded-xl border-2 border-emerald-300 text-xs leading-relaxed text-slate-900 font-serif italic whitespace-pre-line shadow-xs">
            {lkpd.stimulusText}
          </div>
        </div>

        {/* SECTION D: LANGKAH-LANGKAH PENYELIDIKAN & DISKUSI KELOMPOK */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs md:text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
            <span>D. LANGKAH-LANGKAH KEGIATAN KELOMPOK</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-800 font-medium pl-2">
            {lkpd.activitySteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-blue-900 shrink-0">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION E: LEMBAR KERJA & PERTANYAAN ANALISIS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 rounded-lg">
            <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider">
              E. LEMBAR HASIL DISKUSI & PERTANYAAN ANALISIS
            </h3>
            <button
              onClick={handleAddQuestion}
              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded flex items-center gap-1 no-print"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Pertanyaan</span>
            </button>
          </div>

          <div className="space-y-6">
            {lkpd.questions.map((q, idx) => (
              <div key={q.id} className="border border-slate-300 rounded-xl p-4 bg-slate-50/40 space-y-3 relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span>{q.questionText}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 no-print"
                    title="Hapus Pertanyaan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Question Type: Table */}
                {q.type === 'table' && q.tableHeaders && (
                  <div className="overflow-x-auto pt-1">
                    <table className="w-full border-collapse border border-black text-xs">
                      <thead>
                        <tr className="bg-slate-200 font-bold text-center">
                          {q.tableHeaders.map((th, hIdx) => (
                            <th key={hIdx} className="border border-black px-2 py-1.5">
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: q.tableRowsCount || 3 }).map((_, rIdx) => (
                          <tr key={rIdx}>
                            <td className="border border-black text-center font-bold py-3 w-10">
                              {rIdx + 1}
                            </td>
                            {q.tableHeaders!.slice(1).map((_, cIdx) => (
                              <td key={cIdx} className="border border-black p-2 min-h-[40px]">
                                <span className="text-[10px] text-slate-300 block text-center italic">
                                  [ Lembar Isian Siswa ]
                                </span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Question Type: Essay Answer Space */}
                {q.type === 'essay' && (
                  <div className="border border-dashed border-slate-400 rounded-xl p-3 bg-white min-h-[100px] space-y-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Ruang Jawaban Kelompok:
                    </span>
                    <div className="space-y-4 pt-1">
                      <div className="border-b border-slate-300 w-full h-1" />
                      <div className="border-b border-slate-300 w-full h-1" />
                      <div className="border-b border-slate-300 w-full h-1" />
                      <div className="border-b border-slate-300 w-full h-1" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION F: REFLEKSI & KESIMPULAN */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs md:text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
            <span>F. REFLEKSI & KESIMPULAN DISKUSI</span>
          </h3>
          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3 text-xs">
            <span className="font-bold text-slate-900 block">Pertanyaan Refleksi Siswa:</span>
            <ol className="list-decimal list-inside space-y-2 text-slate-800">
              {lkpd.reflectionQuestions.map((ref, rIdx) => (
                <li key={rIdx} className="space-y-1">
                  <span className="font-medium">{ref}</span>
                  <div className="border-b border-dotted border-slate-400 w-full h-4" />
                </li>
              ))}
            </ol>

            <div className="pt-3">
              <span className="font-bold text-blue-950 block mb-1">Kesimpulan Akhir Kelompok:</span>
              <div className="border-2 border-slate-300 rounded-xl p-3 bg-white min-h-[80px] space-y-3">
                <div className="border-b border-slate-300 w-full h-2" />
                <div className="border-b border-slate-300 w-full h-2" />
                <div className="border-b border-slate-300 w-full h-2" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION G: RUBRIK PENILAIAN KINERJA LKPD */}
        <div className="space-y-2 break-inside-avoid">
          <h3 className="font-bold text-xs md:text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
            <span>G. RUBRIK & LEMBAR PENILAIAN GURU</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-[10px] font-sans">
              <thead>
                <tr className="bg-slate-200 font-bold text-center">
                  <th className="border border-black p-1.5 w-32">Aspek Penilaian</th>
                  <th className="border border-black p-1.5">Sangat Baik (Skor 4)</th>
                  <th className="border border-black p-1.5">Baik (Skor 3)</th>
                  <th className="border border-black p-1.5">Cukup (Skor 2)</th>
                  <th className="border border-black p-1.5">Perlu Bimbingan (Skor 1)</th>
                </tr>
              </thead>
              <tbody>
                {lkpd.rubricCriteria.map((rub, idx) => (
                  <tr key={idx}>
                    <td className="border border-black p-1.5 font-bold bg-slate-50 text-slate-900">
                      {rub.aspect}
                    </td>
                    <td className="border border-black p-1.5 text-slate-800">{rub.score4}</td>
                    <td className="border border-black p-1.5 text-slate-800">{rub.score3}</td>
                    <td className="border border-black p-1.5 text-slate-800">{rub.score2}</td>
                    <td className="border border-black p-1.5 text-slate-800">{rub.score1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Nilai & Catatan Guru Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            <div className="border-2 border-black rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs uppercase block text-slate-900">NILAI LKPD KELOMPOK</span>
                <span className="text-[10px] text-slate-600 block">Rumus: (Total Skor / 12) x 100</span>
              </div>
              <div className="w-20 h-14 border-2 border-black rounded-lg flex items-center justify-center font-black text-xl text-blue-950 bg-slate-50">
                / 100
              </div>
            </div>

            <div className="border-2 border-black rounded-xl p-3 space-y-1 text-xs">
              <span className="font-bold text-slate-900 block">Catatan & Umpan Balik Guru:</span>
              <div className="border-b border-dotted border-slate-400 w-full h-3" />
              <div className="border-b border-dotted border-slate-400 w-full h-3" />
            </div>
          </div>
        </div>

        {/* Tanda Tangan Block */}
        <div className="pt-6 grid grid-cols-2 gap-8 text-xs font-serif font-medium text-slate-900 break-inside-avoid">
          <div className="text-center space-y-16">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala Satuan Pendidikan</p>
              <p className="font-bold uppercase text-blue-950">{kopSettings.schoolName}</p>
            </div>
            <div>
              <p className="font-bold underline uppercase">{kopSettings.headmasterName}</p>
              <p className="text-[11px] font-sans">NIP. {kopSettings.headmasterNip}</p>
            </div>
          </div>

          <div className="text-center space-y-16">
            <div>
              <p>{kopSettings.dateLocation}</p>
              <p className="font-bold">Guru Mata Pelajaran</p>
              <p className="font-bold uppercase text-blue-950">{currentSubject.subjectName}</p>
            </div>
            <div>
              <p className="font-bold underline uppercase">{kopSettings.teacherName}</p>
              <p className="text-[11px] font-sans">NIP. {kopSettings.teacherNip}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
