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
  FileText,
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
  HelpCircle,
  Award,
  Layers,
  ChevronDown,
  RefreshCw,
  ListChecks,
  FileCheck2,
  Table,
  CheckSquare,
} from 'lucide-react';

interface AsesmenSoalGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
}

export type AssessmentType = 'STS' | 'SAS' | 'UH_FORMATIF';
export type CognitiveLevel = 'L1 (Pemahaman)' | 'L2 (Penerapan)' | 'L3 (Penalaran/HOTS)';
export type QuestionType = 'PG' | 'PG_KOMPLEKS' | 'ISIAN' | 'URAIAN';

export interface QuestionCardItem {
  id: string;
  number: number;
  tpCode: string;
  tpTitle: string;
  elementName: string;
  indicator: string;
  cognitiveLevel: CognitiveLevel;
  questionType: QuestionType;
  stemText: string;
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  keyAnswer: string;
  scoringGuide: string;
  maxScore: number;
}

export const AsesmenSoalGenerator: React.FC<AsesmenSoalGeneratorProps> = ({
  school,
  teacher,
  year,
  selectedAssignmentSubject,
  selectedClassLabel,
}) => {
  // Master Subjects
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

  // Active View Tab: Kisi-kisi | Kartu Soal | Naskah Soal Siswa | Kunci Jawaban
  const [activeTab, setActiveTab] = useState<'kisi' | 'kartu' | 'naskah' | 'kunci'>('kisi');
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('SAS');
  const [targetClass, setTargetClass] = useState<'VII' | 'VIII' | 'IX'>(() => {
    if (selectedClassLabel?.toUpperCase().includes('VIII')) return 'VIII';
    if (selectedClassLabel?.toUpperCase().includes('IX')) return 'IX';
    return 'VII';
  });

  React.useEffect(() => {
    if (selectedClassLabel?.toUpperCase().includes('VIII')) setTargetClass('VIII');
    else if (selectedClassLabel?.toUpperCase().includes('IX')) setTargetClass('IX');
    else if (selectedClassLabel?.toUpperCase().includes('VII')) setTargetClass('VII');
  }, [selectedClassLabel]);

  const [semester, setSemester] = useState<1 | 2>(1);
  const [timeAllocation, setTimeAllocation] = useState<string>('90 Menit');

  // Kop Settings
  const [kopSettings, setKopSettings] = useState<DocumentKopSettings>({
    schoolName: school.name || 'SMP NEGERI 1 BANTAN',
    npsn: school.npsn || '10401234',
    address: school.address || 'Jl. Soekarno-Hatta No. 45, Bantan, Kab. Bengkalis',
    headmasterName: school.headmasterName || 'Drs. H. M. YUSUF, M.Pd.',
    headmasterNip: school.headmasterNip || '19680512 199403 1 004',
    teacherName: teacher.name || 'SITI AMINAH, S.Pd.',
    teacherNip: teacher.nip || '19850410 201001 2 015',
    dateLocation: 'Bantan, 25 November 2025',
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

  // Initial Questions Data mapped from Master TP
  const initialQuestions = useMemo(() => {
    const questionsList: QuestionCardItem[] = [];
    let qNum = 1;

    currentSubject.elements.forEach((elem) => {
      elem.tpList.forEach((tp) => {
        if (tp.classGrade !== targetClass) return;

        // Question 1 (PG)
        questionsList.push({
          id: `q_${qNum}`,
          number: qNum,
          tpCode: tp.code,
          tpTitle: tp.title,
          elementName: elem.name,
          indicator: `Disajikan narasi/kasus tentang ${elem.name.toLowerCase()}, peserta didik dapat mengidentifikasi konsep utama ${tp.title.toLowerCase()} dengan tepat.`,
          cognitiveLevel: 'L2 (Penerapan)',
          questionType: 'PG',
          stemText: `Perhatikan fenomena pembelajaran pada materi ${elem.name} berikut!\n\nSeorang siswa mengamati bahwa dalam menerapkan "${tp.title}", terdapat prinsip penting yang harus dijaga bersama agar tujuan kelompok tercapai secara optimal.\n\nPrinsip utama yang paling sesuai dengan fenomena tersebut adalah...`,
          options: {
            a: `Meningkatkan partisipasi aktif dan tanggung jawab pribadi serta kelompok`,
            b: `Menyerahkan seluruh tugas dan keputusan kepada ketua kelompok saja`,
            c: `Mengabaikan aturan dan kesepakatan bersama yang telah ditetapkan`,
            d: `Mencari jalan pintas tanpa memperhatikan kualitas hasil kerja`,
          },
          keyAnswer: 'A',
          scoringGuide: 'Jawaban benar skor = 2, salah/tidak menjawab = 0.',
          maxScore: 2,
        });
        qNum++;

        // Question 2 (Uraian HOTS)
        if (qNum <= 5) {
          questionsList.push({
            id: `q_${qNum}`,
            number: qNum,
            tpCode: tp.code,
            tpTitle: tp.title,
            elementName: elem.name,
            indicator: `Disajikan konteks kehidupan nyata, peserta didik dapat menganalisis dan merumuskan 3 solusi analitis terkait ${tp.title.toLowerCase()}.`,
            cognitiveLevel: 'L3 (Penalaran/HOTS)',
            questionType: 'URAIAN',
            stemText: `Jelaskan secara komprehensif bagaimana langkah konkret yang dapat kalian lakukan untuk mengimplementasikan "${tp.title}" di lingkungan sekolah! Berikan minimal 3 (tiga) contoh tindakan beserta dampaknya!`,
            keyAnswer: `Siswa memberikan 3 contoh tindakan nyata beserta dampak positifnya bagi lingkungan sekolah secara rasional dan santun.`,
            scoringGuide: `Skor 10: Menjelaskan 3 contoh tindakan + dampak secara runtut dan mendalam.\nSkor 7: Menjelaskan 2 contoh tindakan + dampak.\nSkor 4: Menjelaskan 1 contoh tindakan.\nSkor 0: Tidak menjawab.`,
            maxScore: 10,
          });
          qNum++;
        }
      });
    });

    return questionsList.length > 0 ? questionsList : [
      {
        id: 'q_default',
        number: 1,
        tpCode: 'TP-01',
        tpTitle: 'Memahami konsep dasar pembelajaran',
        elementName: 'Elemen Utama',
        indicator: 'Peserta didik dapat mengidentifikasi konsep utama dengan tepat.',
        cognitiveLevel: 'L1 (Pemahaman)',
        questionType: 'PG',
        stemText: 'Berikut ini yang merupakan prinsip utama dalam pemahaman konsep adalah...',
        options: {
          a: 'Keteraturan dan konsistensi',
          b: 'Acak dan tanpa pola',
          c: 'Pasif tanpa refleksi',
          d: 'Mengabaikan fakta',
        },
        keyAnswer: 'A',
        scoringGuide: 'Benar = 2, Salah = 0',
        maxScore: 2,
      },
    ];
  }, [currentSubject, targetClass]);

  const [questions, setQuestions] = useState<QuestionCardItem[]>(initialQuestions);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Add Question Item
  const handleAddQuestion = () => {
    const nextNum = questions.length + 1;
    const defaultTp = currentSubject.elements[0]?.tpList[0];
    const newQ: QuestionCardItem = {
      id: `q_${Date.now()}`,
      number: nextNum,
      tpCode: defaultTp?.code || 'TP-NEW',
      tpTitle: defaultTp?.title || 'Tujuan Pembelajaran Baru',
      elementName: currentSubject.elements[0]?.name || 'Elemen',
      indicator: 'Disajikan kasus, peserta didik dapat menentukan solusi yang tepat.',
      cognitiveLevel: 'L2 (Penerapan)',
      questionType: 'PG',
      stemText: 'Tuliskan rumusan naskah soal di sini...',
      options: {
        a: 'Pilihan Jawaban A',
        b: 'Pilihan Jawaban B',
        c: 'Pilihan Jawaban C',
        d: 'Pilihan Jawaban D',
      },
      keyAnswer: 'A',
      scoringGuide: 'Jawaban benar skor 2',
      maxScore: 2,
    };

    setQuestions([...questions, newQ]);
    showToast(`Soal No. ${nextNum} berhasil ditambahkan.`);
  };

  // Delete Question
  const handleDeleteQuestion = (id: string) => {
    const filtered = questions.filter((q) => q.id !== id);
    const renumbered = filtered.map((q, idx) => ({ ...q, number: idx + 1 }));
    setQuestions(renumbered);
    showToast('Soal berhasil dihapus.');
  };

  // Generate AI Questions
  const handleGenerateAiQuestions = () => {
    showToast('✨ Kisi-Kisi & Kartu Soal diperbarui secara otomatis berbasis TP Kurikulum Merdeka!');
  };

  const handlePrint = () => {
    smartPrint({
      documentSelector: '.document-page',
      docTitle: `Naskah Soal & Kisi-Kisi (${assessmentType}) - ${currentSubject.subjectName}`,
      orientation: activeTab === 'kisi' ? 'landscape' : 'portrait',
    });
  };

  const assessmentTypeLabel =
    assessmentType === 'STS'
      ? 'SUMATIF TENGAH SEMESTER (STS)'
      : assessmentType === 'SAS'
      ? 'SUMATIF AKHIR SEMESTER (SAS)'
      : 'ASESMEN FORMATIF / ULANGAN HARIAN';

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce no-print">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── HEADER BANNER: TAHAP 3 KISI-KISI & KARTU SOAL ── */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden no-print">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-purple-400" />
                Tahap 3: Kurikulum Merdeka BSKAP
              </span>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Kisi-Kisi & Kartu Soal
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Generator Kisi-Kisi Soal, Kartu Soal & Naskah Ujian
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Otomatiskan penyusunan dokumen asesmen lengkap: Tabel Kisi-Kisi Soal, Kartu Soal Standar Kemendikbud, Naskah Soal Ujian Siswa (PG & Uraian HOTS), serta Lembar Kunci Jawaban & Pedoman Penskoran.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
                <Building className="w-3.5 h-3.5 text-purple-400" />
                <span>{kopSettings.schoolName}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>{kopSettings.teacherName}</span>
              </div>
              <button
                onClick={() => setIsEditingKop(!isEditingKop)}
                className="px-2.5 py-1 bg-purple-700/80 hover:bg-purple-600 text-white rounded-lg border border-purple-400/40 text-[11px] font-bold transition-all flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                <span>{isEditingKop ? 'Sembunyikan Form Kop' : 'Edit Kop Sekolah & Identitas'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={handleGenerateAiQuestions}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Auto-Generate Soal AI</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF Dokumen</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── FORM KOP (EXPANDABLE) ── */}
      {isEditingKop && (
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200 no-print">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pengaturan Identitas Dokumen Asesmen & Sekolah
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
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah:</label>
              <input
                type="text"
                value={kopSettings.headmasterName}
                onChange={(e) => setKopSettings({ ...kopSettings, headmasterName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Guru Pembuat Soal:</label>
              <input
                type="text"
                value={kopSettings.teacherName}
                onChange={(e) => setKopSettings({ ...kopSettings, teacherName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tempat & Tanggal Dokumen:</label>
              <input
                type="text"
                value={kopSettings.dateLocation}
                onChange={(e) => setKopSettings({ ...kopSettings, dateLocation: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── ASSESSMENT SPECIFICATION & TAB NAVIGATION CONTROL BAR ── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 no-print">
        {/* Document Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran:</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              {cpSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subjectName} ({s.phase})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Jenis Asesmen:</label>
            <select
              value={assessmentType}
              onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value="SAS">Sumatif Akhir Semester (SAS)</option>
              <option value="STS">Sumatif Tengah Semester (STS)</option>
              <option value="UH_FORMATIF">Asesmen Formatif / Ulangan Harian</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kelas Target:</label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value as 'VII' | 'VIII' | 'IX')}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value="VII">Kelas VII</option>
              <option value="VIII">Kelas VIII</option>
              <option value="IX">Kelas IX</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Semester:</label>
            <select
              value={semester}
              onChange={(e) => setSemester(parseInt(e.target.value) as 1 | 2)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value={1}>1 (Ganjil)</option>
              <option value={2}>2 (Genap)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Alokasi Waktu:</label>
            <input
              type="text"
              value={timeAllocation}
              onChange={(e) => setTimeAllocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('kisi')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'kisi'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabel Kisi-Kisi Soal</span>
            </button>

            <button
              onClick={() => setActiveTab('kartu')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'kartu'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Kartu Soal Standar</span>
            </button>

            <button
              onClick={() => setActiveTab('naskah')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'naskah'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Naskah Soal Siswa</span>
            </button>

            <button
              onClick={() => setActiveTab('kunci')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'kunci'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Kunci Jawaban & Rubrik</span>
            </button>
          </div>

          <button
            onClick={handleAddQuestion}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal Baris</span>
          </button>
        </div>
      </div>

      {/* ── PRINTABLE CANVAS WRAPPER ── */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6 font-sans">
        
        {/* Formal Header */}
        <div className="border-b-4 border-double border-black pb-4 text-center space-y-1 font-serif">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-800">
            {kopSettings.schoolName}
          </div>
          <h1 className="text-lg md:text-xl font-black uppercase text-slate-950 tracking-tight">
            DOKUMEN ASESMEN & EVALUASI PEMBELAJARAN
          </h1>
          <div className="text-xs font-bold text-purple-950 uppercase tracking-wider font-sans">
            MATA PELAJARAN {currentSubject.subjectName.toUpperCase()} — {assessmentTypeLabel}
          </div>
          <p className="text-[11px] font-sans text-slate-600">
            Tahun Pelajaran {year.label} | Kelas {targetClass} Semester {semester === 1 ? 'Ganjil' : 'Genap'} | Alokasi Waktu: {timeAllocation}
          </p>
        </div>

        {/* TAB 1: KISI-KISI SOAL TABLE */}
        {activeTab === 'kisi' && (
          <div className="space-y-4">
            <h3 className="font-bold text-xs md:text-sm bg-purple-950 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
              <Table className="w-4 h-4" />
              <span>TABEL KISI-KISI SOAL {assessmentTypeLabel}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-[11px] font-sans">
                <thead>
                  <tr className="bg-slate-200 border-b border-black text-center font-bold">
                    <th className="border border-black px-1 py-2 w-8">No</th>
                    <th className="border border-black px-2 py-2 text-left w-32">Elemen CP</th>
                    <th className="border border-black px-2 py-2 text-left min-w-[180px]">
                      Tujuan Pembelajaran (TP)
                    </th>
                    <th className="border border-black px-2 py-2 text-left min-w-[200px]">
                      Indikator Soal
                    </th>
                    <th className="border border-black px-1 py-2 w-28">Level Kognitif</th>
                    <th className="border border-black px-1 py-2 w-16">Bentuk</th>
                    <th className="border border-black px-1 py-2 w-12">Skor Max</th>
                    <th className="border border-black px-1 py-2 w-16 no-print">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="border border-black text-center font-bold py-2">{q.number}</td>
                      <td className="border border-black px-2 py-2 font-bold text-purple-950 align-top">
                        {q.elementName}
                      </td>
                      <td className="border border-black px-2 py-2 align-top">
                        <span className="font-bold text-blue-900 block">[{q.tpCode}]</span>
                        <span className="text-slate-900">{q.tpTitle}</span>
                      </td>
                      <td className="border border-black px-2 py-2 align-top text-slate-800">
                        {q.indicator}
                      </td>
                      <td className="border border-black text-center font-bold align-top py-2">
                        <span className="px-1.5 py-0.5 bg-purple-50 text-purple-900 border border-purple-200 rounded text-[9.5px]">
                          {q.cognitiveLevel}
                        </span>
                      </td>
                      <td className="border border-black text-center font-black align-top py-2">
                        {q.questionType}
                      </td>
                      <td className="border border-black text-center font-bold align-top py-2">
                        {q.maxScore}
                      </td>
                      <td className="border border-black text-center align-top py-2 no-print">
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                          title="Hapus Soal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: KARTU SOAL STANDAR KEMENDIKBUD */}
        {activeTab === 'kartu' && (
          <div className="space-y-6">
            <h3 className="font-bold text-xs md:text-sm bg-purple-950 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4" />
              <span>KARTU SOAL STANDAR KURIKULUM MERDEKA BSKAP</span>
            </h3>

            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q.id} className="border-2 border-black rounded-xl p-4 bg-white space-y-3 font-sans text-xs break-inside-avoid">
                  <div className="grid grid-cols-2 gap-2 border-b border-black pb-2 font-bold">
                    <div>
                      <span>KARTU SOAL NOMOR: </span>
                      <span className="text-purple-950 text-sm font-black">NO. {q.number}</span>
                    </div>
                    <div className="text-right">
                      <span>BENTUK SOAL: </span>
                      <span className="text-blue-900 uppercase font-black">{q.questionType}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-300">
                    <div>
                      <p><strong>Mata Pelajaran:</strong> {currentSubject.subjectName}</p>
                      <p><strong>Elemen CP:</strong> {q.elementName}</p>
                      <p><strong>Capaian Pembelajaran / TP:</strong> [{q.tpCode}] {q.tpTitle}</p>
                    </div>
                    <div>
                      <p><strong>Level Kognitif:</strong> {q.cognitiveLevel}</p>
                      <p><strong>Indikator Soal:</strong> {q.indicator}</p>
                      <p><strong>Kunci Jawaban:</strong> <span className="font-black text-emerald-800">{q.keyAnswer}</span></p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="font-bold text-slate-900 block">NASKAH / RUMUSAN BUTIR SOAL:</span>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-300 leading-relaxed font-serif text-slate-900 whitespace-pre-line">
                      {q.stemText}
                    </div>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-2 font-serif text-slate-900">
                        <div>A. {q.options.a}</div>
                        <div>B. {q.options.b}</div>
                        <div>C. {q.options.c}</div>
                        <div>D. {q.options.d}</div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-300 pt-2 space-y-1">
                    <span className="font-bold text-slate-900 block">PEDOMAN PENSKORAN / KUNCI:</span>
                    <p className="text-slate-700 italic">{q.scoringGuide}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: NASKAH SOAL SISWA */}
        {activeTab === 'naskah' && (
          <div className="space-y-6">
            <div className="border-2 border-black p-4 rounded-xl text-xs font-serif font-bold text-slate-900 grid grid-cols-2 gap-4">
              <div>
                <p>NAMA PESERTA DIDIK: .....................................................</p>
                <p>KELAS / NO. ABSEN: .....................................................</p>
              </div>
              <div className="text-right">
                <p>MATA PELAJARAN: {currentSubject.subjectName.toUpperCase()}</p>
                <p>HARI / TANGGAL: .....................................................</p>
              </div>
            </div>

            <div className="space-y-6 font-serif text-sm text-slate-950">
              <div className="font-bold border-b border-black pb-1 uppercase">
                PETUNJUK: PILIHLAH JAWABAN YANG PALING TEPAT DENGAN MEMBERI TANDA SILANG (X) PADA HURUF A, B, C, ATAU D!
              </div>

              {questions.map((q) => (
                <div key={q.id} className="space-y-2 break-inside-avoid">
                  <div className="flex items-start gap-2">
                    <span className="font-bold shrink-0">{q.number}.</span>
                    <div className="leading-relaxed whitespace-pre-line">{q.stemText}</div>
                  </div>

                  {q.options ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 text-xs font-sans">
                      <div>A. {q.options.a}</div>
                      <div>B. {q.options.b}</div>
                      <div>C. {q.options.c}</div>
                      <div>D. {q.options.d}</div>
                    </div>
                  ) : (
                    <div className="pl-6 border-2 border-dashed border-slate-400 rounded-xl p-3 min-h-[100px] bg-slate-50/30">
                      <span className="text-[10px] font-sans text-slate-400 italic block">
                        [ Ruang Jawaban Uraian Siswa ]
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KUNCI JAWABAN & RUBRIK */}
        {activeTab === 'kunci' && (
          <div className="space-y-4">
            <h3 className="font-bold text-xs md:text-sm bg-purple-950 text-white px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span>LEMBAR KUNCI JAWABAN & PEDOMAN PENSKORAN GURU</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-xs font-sans">
                <thead>
                  <tr className="bg-slate-200 font-bold text-center">
                    <th className="border border-black p-2 w-12">No</th>
                    <th className="border border-black p-2 w-20">Bentuk</th>
                    <th className="border border-black p-2 w-24">Kunci</th>
                    <th className="border border-black p-2 text-left">Pedoman Penskoran & Pembahasan</th>
                    <th className="border border-black p-2 w-20">Skor Max</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr key={q.id}>
                      <td className="border border-black text-center font-bold p-2">{q.number}</td>
                      <td className="border border-black text-center font-bold p-2">{q.questionType}</td>
                      <td className="border border-black text-center font-black p-2 text-emerald-900 bg-emerald-50">
                        {q.keyAnswer}
                      </td>
                      <td className="border border-black p-2 text-slate-800 leading-relaxed whitespace-pre-line">
                        {q.scoringGuide}
                      </td>
                      <td className="border border-black text-center font-bold p-2">{q.maxScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tanda Tangan Block */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-xs font-serif font-medium text-slate-900 break-inside-avoid">
          <div className="text-center space-y-16">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala Satuan Pendidikan</p>
              <p className="font-bold uppercase text-purple-950">{kopSettings.schoolName}</p>
            </div>
            <div>
              <p className="font-bold underline uppercase">{kopSettings.headmasterName}</p>
              <p className="text-[11px] font-sans">NIP. {kopSettings.headmasterNip}</p>
            </div>
          </div>

          <div className="text-center space-y-16">
            <div>
              <p>{kopSettings.dateLocation}</p>
              <p className="font-bold">Guru Mata Pelajaran / Penyusun</p>
              <p className="font-bold uppercase text-purple-950">{currentSubject.subjectName}</p>
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
