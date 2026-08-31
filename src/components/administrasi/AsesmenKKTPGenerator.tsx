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
  Award,
  CheckCircle2,
  Printer,
  Sparkles,
  Settings,
  Users,
  Calculator,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  X,
  Edit3,
  TrendingUp,
  Sliders,
  BookOpen,
} from 'lucide-react';

interface AsesmenKKTPGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
}

interface StudentGradeRecord {
  id: string;
  nisn: string;
  name: string;
  tpScores: Record<string, number>; // tpCode -> score (0-100)
  stsScore: number; // Sumatif Tengah Semester
  sasScore: number; // Sumatif Akhir Semester
}

export const AsesmenKKTPGenerator: React.FC<AsesmenKKTPGeneratorProps> = ({
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

  const [selectedClass, setSelectedClass] = useState<string>(
    selectedClassLabel || 'VII-A'
  );

  React.useEffect(() => {
    if (selectedClassLabel) {
      setSelectedClass(selectedClassLabel);
      if (selectedClassLabel.toUpperCase().includes('VIII')) setSelectedGrade('VIII');
      else if (selectedClassLabel.toUpperCase().includes('IX')) setSelectedGrade('IX');
      else if (selectedClassLabel.toUpperCase().includes('VII')) setSelectedGrade('VII');
    }
  }, [selectedClassLabel]);
  const [selectedSemester, setSelectedSemester] = useState<'ganjil' | 'genap'>('ganjil');

  const [activeTab, setActiveTab] = useState<'kktp' | 'buku-nilai' | 'e-rapor'>('kktp');

  // KKTP Configuration
  const [kktpThreshold, setKktpThreshold] = useState<number>(75);
  const [kktpMethod, setKktpMethod] = useState<'interval' | 'rubrik' | 'skala'>('interval');

  // Subject and TPs
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

  // Initial Sample Students List
  const [students, setStudents] = useState<StudentGradeRecord[]>([
    {
      id: 'std-1',
      nisn: '0081234501',
      name: 'Ahmad Fauzi',
      tpScores: { 'TP-IND-01': 88, 'TP-IND-02': 85, 'TP-MAT-01': 80, 'TP-IPA-01': 82 },
      stsScore: 85,
      sasScore: 88,
    },
    {
      id: 'std-2',
      nisn: '0081234502',
      name: 'Anisa Rahmawati',
      tpScores: { 'TP-IND-01': 92, 'TP-IND-02': 90, 'TP-MAT-01': 88, 'TP-IPA-01': 91 },
      stsScore: 90,
      sasScore: 94,
    },
    {
      id: 'std-3',
      nisn: '0081234503',
      name: 'Bagus Pratama',
      tpScores: { 'TP-IND-01': 70, 'TP-IND-02': 68, 'TP-MAT-01': 65, 'TP-IPA-01': 72 },
      stsScore: 68,
      sasScore: 70,
    },
    {
      id: 'std-4',
      nisn: '0081234504',
      name: 'Citra Dewi',
      tpScores: { 'TP-IND-01': 85, 'TP-IND-02': 80, 'TP-MAT-01': 78, 'TP-IPA-01': 84 },
      stsScore: 82,
      sasScore: 86,
    },
    {
      id: 'std-5',
      nisn: '0081234505',
      name: 'Dion Saputra',
      tpScores: { 'TP-IND-01': 95, 'TP-IND-02': 92, 'TP-MAT-01': 90, 'TP-IPA-01': 93 },
      stsScore: 92,
      sasScore: 95,
    },
    {
      id: 'std-6',
      nisn: '0081234506',
      name: 'Eka Nurjanah',
      tpScores: { 'TP-IND-01': 78, 'TP-IND-02': 75, 'TP-MAT-01': 72, 'TP-IPA-01': 76 },
      stsScore: 75,
      sasScore: 78,
    },
  ]);

  // Kop & Signatures
  const [kop, setKop] = useState({
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

  // Update Score Handler
  const handleScoreChange = (
    studentId: string,
    field: 'sts' | 'sas' | string,
    val: number
  ) => {
    const clampedVal = Math.min(100, Math.max(0, val));
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;

        if (field === 'sts') {
          return { ...s, stsScore: clampedVal };
        }
        if (field === 'sas') {
          return { ...s, sasScore: clampedVal };
        }
        return {
          ...s,
          tpScores: {
            ...s.tpScores,
            [field]: clampedVal,
          },
        };
      })
    );
  };

  // Weightings for Final Grade Calculation (NA)
  const [weightFormatif, setWeightFormatif] = useState<number>(50); // 50%
  const [weightSts, setWeightSts] = useState<number>(25); // 25%
  const [weightSas, setWeightSas] = useState<number>(25); // 25%

  // Calculate Final Grades and Description per Student
  const processedStudents = useMemo(() => {
    return students.map((student) => {
      // Calculate Formatif Average across available TPs
      const tpValues = gradeTps.map((item) => student.tpScores[item.tp.code] || 75);
      const avgFormatif =
        tpValues.length > 0
          ? Math.round(tpValues.reduce((a, b) => a + b, 0) / tpValues.length)
          : 75;

      // Final Grade (Nilai Akhir Rapor)
      const finalGrade = Math.round(
        (avgFormatif * weightFormatif +
          student.stsScore * weightSts +
          student.sasScore * weightSas) /
          100
      );

      // Find highest & lowest TP for e-Rapor narrative
      let highestTp = gradeTps[0];
      let lowestTp = gradeTps[0];
      let highestScore = -1;
      let lowestScore = 101;

      gradeTps.forEach((item) => {
        const score = student.tpScores[item.tp.code] ?? 75;
        if (score > highestScore) {
          highestScore = score;
          highestTp = item;
        }
        if (score < lowestScore) {
          lowestScore = score;
          lowestTp = item;
        }
      });

      // Construct e-Rapor Narration
      let description = `Menunjukkan penguasaan yang sangat baik dalam ${
        highestTp ? highestTp.tp.title : 'pembelajaran'
      }.`;

      if (lowestTp && lowestScore < kktpThreshold) {
        description += ` Perlu bimbingan dan peningkatan lebih lanjut dalam ${lowestTp.tp.title}.`;
      } else if (lowestTp && lowestTp.tp.code !== highestTp?.tp.code) {
        description += ` Perlu pemantapan dalam ${lowestTp.tp.title}.`;
      }

      return {
        ...student,
        avgFormatif,
        finalGrade,
        highestTp,
        highestScore,
        lowestTp,
        lowestScore,
        isLuntas: finalGrade >= kktpThreshold,
        description,
      };
    });
  }, [students, gradeTps, weightFormatif, weightSts, weightSas, kktpThreshold]);

  // Class Metrics
  const classAvgFinal = useMemo(() => {
    if (processedStudents.length === 0) return 0;
    const total = processedStudents.reduce((acc, s) => acc + s.finalGrade, 0);
    return Math.round(total / processedStudents.length);
  }, [processedStudents]);

  const totalKetuntasan = useMemo(() => {
    return processedStudents.filter((s) => s.isLuntas).length;
  }, [processedStudents]);

  const handlePrint = () => {
    smartPrint({
      documentSelector: '.document-page',
      docTitle: `KKTP & Leger Nilai - ${currentSubject.subjectName} (${selectedClass})`,
      orientation: 'landscape',
    });
  };

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
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Tahap 4: KKTP, Asesmen & e-Rapor Merdeka
              </span>
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Formulasi e-Rapor Otomatis
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Kriteria Ketercapaian TP (KKTP) & Pengolahan Nilai Rapor
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Keloa Kriteria Ketercapaian TP, rekapitulasi nilai Formatif & Sumatif siswa, pembobotan nilai akhir, hingga generator kalimat narasi e-Rapor Kurikulum Merdeka secara presisi.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditingKop(!isEditingKop)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>{isEditingKop ? 'Tutup Pengatur Kop' : 'Atur Kop Dokumen'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KOP EDITOR PANEL ── */}
      {isEditingKop && (
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4 no-print">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase">
              Pengaturan Kop Dokumen & Pengesahan Buku Nilai
            </h3>
            <button onClick={() => setIsEditingKop(false)}>
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={kop.schoolName}
                onChange={(e) => setKop({ ...kop, schoolName: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kepala Sekolah</label>
              <input
                type="text"
                value={kop.headmasterName}
                onChange={(e) => setKop({ ...kop, headmasterName: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={kop.headmasterNip}
                onChange={(e) => setKop({ ...kop, headmasterNip: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Guru</label>
              <input
                type="text"
                value={kop.teacherName}
                onChange={(e) => setKop({ ...kop, teacherName: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Guru</label>
              <input
                type="text"
                value={kop.teacherNip}
                onChange={(e) => setKop({ ...kop, teacherNip: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal & Kota Pengesahan</label>
              <input
                type="text"
                value={kop.dateLocation}
                onChange={(e) => setKop({ ...kop, dateLocation: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TOOLBAR & SELECTION PANEL ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Mata Pelajaran:</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subjectName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Kelas:</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as 'VII' | 'VIII' | 'IX')}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
              >
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Rombel:</label>
              <input
                type="text"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Batas KKTP Minimal:</label>
              <input
                type="number"
                min={50}
                max={95}
                value={kktpThreshold}
                onChange={(e) => setKktpThreshold(parseInt(e.target.value) || 75)}
                className="w-20 px-3 py-1.5 bg-slate-50 border border-emerald-300 rounded-lg font-bold text-emerald-900 bg-emerald-50"
              />
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('kktp')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'kktp'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Rubrik KKTP
            </button>
            <button
              onClick={() => setActiveTab('buku-nilai')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'buku-nilai'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Buku Nilai Formatif & Sumatif
            </button>
            <button
              onClick={() => setActiveTab('e-rapor')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'e-rapor'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Deskripsi e-Rapor Otomatis
            </button>
          </div>
        </div>

        {/* Weighting Controls (for Buku Nilai & e-Rapor) */}
        {activeTab !== 'kktp' && (
          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs items-center">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Formula Bobot Nilai Akhir (NA):
            </span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Formatif (TP):</span>
              <input
                type="number"
                value={weightFormatif}
                onChange={(e) => setWeightFormatif(parseInt(e.target.value) || 0)}
                className="w-14 px-2 py-1 bg-white border border-slate-300 rounded font-bold text-center"
              />
              <span>%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Sumatif STS:</span>
              <input
                type="number"
                value={weightSts}
                onChange={(e) => setWeightSts(parseInt(e.target.value) || 0)}
                className="w-14 px-2 py-1 bg-white border border-slate-300 rounded font-bold text-center"
              />
              <span>%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Sumatif SAS:</span>
              <input
                type="number"
                value={weightSas}
                onChange={(e) => setWeightSas(parseInt(e.target.value) || 0)}
                className="w-14 px-2 py-1 bg-white border border-slate-300 rounded font-bold text-center"
              />
              <span>%</span>
            </div>
          </div>
        )}
      </div>

      {/* ── OFFICIAL DOCUMENT PRINT CANVAS ── */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-lg p-8 md:p-12 space-y-6 document-page text-black font-serif text-xs leading-normal">
        {/* KOP OFFICIAL */}
        <div className="text-center border-b-2 border-black pb-4 space-y-1">
          <h1 className="text-sm md:text-base font-bold uppercase tracking-wider">
            {activeTab === 'kktp'
              ? 'DOKUMEN KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)'
              : activeTab === 'buku-nilai'
              ? 'BUKU DAFTAR NILAI ASESMEN FORMATIF & SUMATIF'
              : 'LEGER & REKAPITULASI DESKRIPSI CAPAIAN RAPOR MERDEKA'}
          </h1>
          <h2 className="text-xs md:text-sm font-bold uppercase">
            KURIKULUM MERDEKA - TAHUN PELAJARAN {year.label}
          </h2>
          <h3 className="text-xs font-bold uppercase">{kop.schoolName}</h3>
          <p className="text-[11px] font-sans italic text-slate-600">
            Mata Pelajaran: {currentSubject.subjectName} | Kelas {selectedGrade} ({selectedClass})
          </p>
        </div>

        {/* METADATA DOKUMEN TABLE */}
        <div className="bg-slate-50 p-3 rounded border border-slate-300 font-sans text-[11px] grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <div><strong>SATUAN PENDIDIKAN:</strong> {kop.schoolName}</div>
            <div><strong>MATA PELAJARAN:</strong> {currentSubject.subjectName}</div>
            <div><strong>FASE / KELAS:</strong> {currentSubject.phase} / {selectedClass}</div>
          </div>
          <div>
            <div><strong>GURU MATA PELAJARAN:</strong> {kop.teacherName} (NIP. {kop.teacherNip})</div>
            <div><strong>KEPALA SEKOLAH:</strong> {kop.headmasterName} (NIP. {kop.headmasterNip})</div>
            <div><strong>STANDAR TUNTAS KKTP:</strong> Minimal Nilai {kktpThreshold}</div>
          </div>
        </div>

        {/* ── TAB 1: RUBRUK & CRITERIA KKTP ── */}
        {activeTab === 'kktp' && (
          <div className="space-y-4 font-sans">
            <h4 className="font-bold text-xs uppercase underline font-serif">
              PENETAPAN KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP) PER TP
            </h4>

            {/* Interval Explanation Card */}
            <div className="border border-black p-3 bg-slate-50 text-[11px] space-y-1">
              <div className="font-bold text-slate-900">
                Skema Kategori Interval Nilai Ketuntasan (Standardized BSKAP):
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] pt-1">
                <div className="p-1.5 bg-red-50 border border-red-300 rounded text-red-900 font-bold">
                  0 - 60: Belum Mencapai (Remedial Seluruh Bagian)
                </div>
                <div className="p-1.5 bg-amber-50 border border-amber-300 rounded text-amber-900 font-bold">
                  61 - 74: Belum Tuntas (Remedial Bagian Tertentu)
                </div>
                <div className="p-1.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 font-bold">
                  75 - 88: Sudah Tuntas (Mencapai Tujuan Pembelajaran)
                </div>
                <div className="p-1.5 bg-blue-50 border border-blue-300 rounded text-blue-900 font-bold">
                  89 - 100: Sangat Tuntas (Pemberian Pengayaan)
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-[11px]">
                <thead>
                  <tr className="bg-slate-200 text-center font-bold">
                    <th className="border border-black px-2 py-1.5 w-10">No</th>
                    <th className="border border-black px-2 py-1.5 w-24">Kode TP</th>
                    <th className="border border-black px-2 py-1.5 text-left">
                      Elemen & Tujuan Pembelajaran (TP)
                    </th>
                    <th className="border border-black px-2 py-1.5 w-24">Batas KKTP</th>
                    <th className="border border-black px-2 py-1.5 text-left">
                      Teknik Asesmen & Rubrik Deskripsi Ketuntasan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gradeTps.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="border border-black p-4 text-center italic text-slate-500">
                        Belum ada Tujuan Pembelajaran untuk kelas ini.
                      </td>
                    </tr>
                  ) : (
                    gradeTps.map((item, idx) => (
                      <tr key={item.tp.code} className="border-b border-black hover:bg-slate-50">
                        <td className="border border-black text-center font-bold">{idx + 1}</td>
                        <td className="border border-black text-center font-bold text-blue-950">
                          {item.tp.code}
                        </td>
                        <td className="border border-black px-2 py-1.5">
                          <div className="font-bold text-slate-900">{item.elementName}</div>
                          <div className="text-slate-700 leading-tight mt-0.5">{item.tp.title}</div>
                        </td>
                        <td className="border border-black text-center font-bold bg-emerald-50 text-emerald-950">
                          ≥ {kktpThreshold}
                        </td>
                        <td className="border border-black px-2 py-1.5">
                          <div className="font-bold text-slate-800">
                            {item.tp.rubrikSingkat || 'Tes Tertulis, Unjuk Kerja & Portofolio'}
                          </div>
                          <div className="text-[10px] text-slate-600 italic mt-0.5">
                            Menunjukkan pemahaman konsep dasar dan kemampuan analisis tingkat sedang.
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 2: BUKU DAFTAR NILAI FORMATIF & SUMATIF ── */}
        {activeTab === 'buku-nilai' && (
          <div className="space-y-4 font-sans">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-xs uppercase underline font-serif">
                DAFTAR NILAI KELAS {selectedClass} - SEMESTER GANJIL/GENAP
              </h4>
              <span className="text-[11px] font-bold text-emerald-800">
                Rata-Rata Kelas: {classAvgFinal} | Ketuntasan: {totalKetuntasan}/{processedStudents.length} Siswa
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                  <tr className="bg-slate-200 border-b border-black text-center font-bold">
                    <th className="border border-black px-1 py-1.5 w-8" rowSpan={2}>No</th>
                    <th className="border border-black px-1 py-1.5 w-20" rowSpan={2}>NISN</th>
                    <th className="border border-black px-2 py-1.5 text-left min-w-[140px]" rowSpan={2}>
                      Nama Peserta Didik
                    </th>
                    <th
                      className="border border-black px-1 py-1 uppercase"
                      colSpan={gradeTps.length || 1}
                    >
                      Nilai Formatif (TP)
                    </th>
                    <th className="border border-black px-1 py-1.5 w-12" rowSpan={2}>
                      Rerata Formatif
                    </th>
                    <th className="border border-black px-1 py-1.5 w-12" rowSpan={2}>
                      Sumatif STS
                    </th>
                    <th className="border border-black px-1 py-1.5 w-12" rowSpan={2}>
                      Sumatif SAS
                    </th>
                    <th className="border border-black px-1 py-1.5 w-14 bg-emerald-100 text-emerald-950" rowSpan={2}>
                      Nilai Akhir (NA)
                    </th>
                    <th className="border border-black px-1 py-1.5 w-16" rowSpan={2}>
                      Status
                    </th>
                  </tr>
                  <tr className="bg-slate-100 border-b border-black text-center font-bold">
                    {gradeTps.map((item) => (
                      <th key={item.tp.code} className="border border-black px-1 py-0.5 w-10">
                        {item.tp.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {processedStudents.map((student, idx) => (
                    <tr key={student.id} className="border-b border-black hover:bg-slate-50">
                      <td className="border border-black text-center font-bold">{idx + 1}</td>
                      <td className="border border-black text-center">{student.nisn}</td>
                      <td className="border border-black px-2 py-1 font-bold text-slate-900">
                        {student.name}
                      </td>

                      {/* TP Formatif Inputs */}
                      {gradeTps.map((item) => (
                        <td key={item.tp.code} className="border border-black text-center p-0.5">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={student.tpScores[item.tp.code] ?? 75}
                            onChange={(e) =>
                              handleScoreChange(
                                student.id,
                                item.tp.code,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-10 text-center font-bold bg-transparent outline-none"
                          />
                        </td>
                      ))}

                      <td className="border border-black text-center font-bold bg-slate-100">
                        {student.avgFormatif}
                      </td>

                      <td className="border border-black text-center p-0.5">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={student.stsScore}
                          onChange={(e) =>
                            handleScoreChange(
                              student.id,
                              'sts',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-10 text-center font-bold bg-transparent outline-none"
                        />
                      </td>

                      <td className="border border-black text-center p-0.5">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={student.sasScore}
                          onChange={(e) =>
                            handleScoreChange(
                              student.id,
                              'sas',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-10 text-center font-bold bg-transparent outline-none"
                        />
                      </td>

                      <td className="border border-black text-center font-black bg-emerald-100 text-emerald-950 text-xs">
                        {student.finalGrade}
                      </td>

                      <td
                        className={`border border-black text-center font-bold text-[9px] ${
                          student.isLuntas
                            ? 'bg-emerald-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {student.isLuntas ? 'TUNTAS' : 'REMEDIAL'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: LEGER & FORMULASI DESKRIPSI e-RAPOR ── */}
        {activeTab === 'e-rapor' && (
          <div className="space-y-4 font-sans">
            <div className="border-b pb-2">
              <h4 className="font-bold text-xs uppercase underline font-serif">
                FORMULASI DESKRIPSI CAPAIAN KOMPETENSI RAPOR MERDEKA (E-RAPOR)
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                Kalimat deskripsi narasi di bawah ini dibuat secara otomatis dengan mengevaluasi capaian tertinggi dan terendah masing-masing siswa terhadap batas KKTP (≥ {kktpThreshold}).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                  <tr className="bg-slate-200 border-b border-black text-center font-bold">
                    <th className="border border-black px-1 py-2 w-8">No</th>
                    <th className="border border-black px-2 py-2 text-left w-36">
                      Nama Peserta Didik
                    </th>
                    <th className="border border-black px-1 py-2 w-12 bg-emerald-100">
                      Nilai Rapor
                    </th>
                    <th className="border border-black px-3 py-2 text-left">
                      Capaian Kompetensi / Deskripsi Rapor (Otomatis)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processedStudents.map((student, idx) => (
                    <tr key={student.id} className="border-b border-black hover:bg-slate-50">
                      <td className="border border-black text-center font-bold">{idx + 1}</td>
                      <td className="border border-black px-2 py-1.5 font-bold text-slate-900">
                        {student.name}
                        <div className="text-[9px] text-slate-500 font-normal">NISN: {student.nisn}</div>
                      </td>
                      <td className="border border-black text-center font-black bg-emerald-100 text-emerald-950 text-xs">
                        {student.finalGrade}
                      </td>
                      <td className="border border-black px-3 py-2 text-slate-800 leading-relaxed font-serif text-[11px]">
                        {student.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
    </div>
  );
};
