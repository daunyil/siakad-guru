import React, { useState, useMemo } from 'react';
import type { SchoolProfile, TeacherProfile, AcademicYear } from '../../types';
import { smartPrint } from '../../utils/printHelper';
import {
  Sparkles,
  Printer,
  Settings,
  CheckCircle2,
  Compass,
} from 'lucide-react';

import type { P5StudentAssessment, P5ActivityStage, KopData } from './p5-projek/types';
import { P5_THEMES } from './p5-projek/P5ThemeData';
import { P5KopEditor } from './p5-projek/P5KopEditor';
import { P5ControlBar } from './p5-projek/P5ControlBar';
import { P5ModulTab } from './p5-projek/P5ModulTab';
import { P5RubrikTab } from './p5-projek/P5RubrikTab';
import { P5RaporTab } from './p5-projek/P5RaporTab';

interface P5ProjekGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
}

export const P5ProjekGenerator: React.FC<P5ProjekGeneratorProps> = ({
  school,
  teacher,
  year,
  selectedAssignmentSubject,
  selectedClassLabel,
}) => {
  // Theme and Project Settings
  const [selectedThemeId, setSelectedThemeId] = useState<string>('gaya-hidup');
  const [projectTitle, setProjectTitle] = useState<string>(P5_THEMES[0].defaultProjectTitle);
  const targetPhase = 'Fase D (Kelas VII-IX)';
  const [selectedGrade, setSelectedGrade] = useState<'VII' | 'VIII' | 'IX'>(() => {
    if (selectedClassLabel?.toUpperCase().includes('VIII')) return 'VIII';
    if (selectedClassLabel?.toUpperCase().includes('IX')) return 'IX';
    return 'VII';
  });
  const [selectedClass, setSelectedClass] = useState<string>(selectedClassLabel || 'VII-A');

  React.useEffect(() => {
    if (selectedClassLabel) {
      setSelectedClass(selectedClassLabel);
      if (selectedClassLabel.toUpperCase().includes('VIII')) setSelectedGrade('VIII');
      else if (selectedClassLabel.toUpperCase().includes('IX')) setSelectedGrade('IX');
      else if (selectedClassLabel.toUpperCase().includes('VII')) setSelectedGrade('VII');
    }
  }, [selectedClassLabel]);
  const [totalJp, setTotalJp] = useState<number>(48);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'modul' | 'rubrik' | 'rapor'>('modul');

  // Selected Dimensions for this Project
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([
    'Gotong Royong',
    'Bernalar Kritis',
    'Kreatif',
  ]);

  // Activity Stages
  const [activities] = useState<P5ActivityStage[]>([
    {
      stage: '1. Pengenalan',
      title: 'Eksplorasi Lingkungan & Identifikasi Masalah Sampah',
      jp: 12,
      desc: 'Siswa mengamati kondisi sampah di lingkungan sekolah, mendengarkan paparan narasumber, dan mendokumentasikan temuan.',
    },
    {
      stage: '2. Kontekstualisasi',
      title: 'Analisis Jenis Sampah & Perancangan Solusi Kompos',
      jp: 12,
      desc: 'Siswa mengelompokkan sampah organik dan anorganik, memetakan potensi komposter, serta menyusun rancangan kerja tim.',
    },
    {
      stage: '3. Aksi',
      title: 'Pembuatan Pupuk Kompos Organik & Bioaktivator',
      jp: 16,
      desc: 'Siswa mempraktikkan secara langsung pengolahan sampah daun dan sisa makanan menjadi pupuk siap pakai.',
    },
    {
      stage: '4. Refleksi & Tindak Lanjut',
      title: 'Gelar Karya P5 & Uji Petik Keberhasilan Produk',
      jp: 8,
      desc: 'Pameran hasil pupuk kompos, presentasi laporan kelompok, evaluasi dampak lingkungan, dan komitmen keberlanjutan.',
    },
  ]);

  // Students P5 Assessment Records
  const [students, setStudents] = useState<P5StudentAssessment[]>([
    {
      id: 'std-p5-1',
      nisn: '0081234501',
      name: 'Ahmad Fauzi',
      grades: { 'Gotong Royong': 'BSH', 'Bernalar Kritis': 'BSH', 'Kreatif': 'SB' },
      notes: 'Sangat proaktif dalam merancang wadah komposter dan tanggap membantu rekan tim.',
    },
    {
      id: 'std-p5-2',
      nisn: '0081234502',
      name: 'Anisa Rahmawati',
      grades: { 'Gotong Royong': 'SB', 'Bernalar Kritis': 'SB', 'Kreatif': 'BSH' },
      notes: 'Menunjukkan kemampuan analisis kritis yang luar biasa saat menguji kadar kelembapan tanah.',
    },
    {
      id: 'std-p5-3',
      nisn: '0081234503',
      name: 'Bagus Pratama',
      grades: { 'Gotong Royong': 'MB', 'Bernalar Kritis': 'BSH', 'Kreatif': 'MB' },
      notes: 'Perlu ditingkatkan konsistensinya dalam pembagian tugas kelompok saat tahapan Aksi.',
    },
    {
      id: 'std-p5-4',
      nisn: '0081234504',
      name: 'Citra Dewi',
      grades: { 'Gotong Royong': 'BSH', 'Bernalar Kritis': 'BSH', 'Kreatif': 'BSH' },
      notes: 'Mengikuti seluruh alur aktivitas P5 dengan tekun dan disiplin.',
    },
    {
      id: 'std-p5-5',
      nisn: '0081234505',
      name: 'Dion Saputra',
      grades: { 'Gotong Royong': 'SB', 'Bernalar Kritis': 'SB', 'Kreatif': 'SB' },
      notes: 'Sangat kreatif merancang kemasan produk kompos serta memimpin presentasi pameran.',
    },
  ]);

  // Kop & Signatures
  const [kop, setKop] = useState<KopData>({
    schoolName: school.name || 'SMP NEGERI 1 BANTAN',
    headmasterName: school.headmasterName || 'Drs. H. M. YUSUF, M.Pd.',
    headmasterNip: school.headmasterNip || '19680512 199403 1 004',
    teacherName: teacher.name || 'SITI AMINAH, S.Pd.',
    teacherNip: teacher.nip || '19850410 201001 2 015',
    dateLocation: 'Bantan, 20 Juli 2025',
  });

  const [isEditingKop, setIsEditingKop] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const currentTheme = useMemo(() => {
    return P5_THEMES.find((t) => t.id === selectedThemeId) || P5_THEMES[0];
  }, [selectedThemeId]);

  // Handle Theme Change Auto Fill
  const handleThemeChange = (themeId: string) => {
    setSelectedThemeId(themeId);
    const theme = P5_THEMES.find((t) => t.id === themeId);
    if (theme) {
      setProjectTitle(theme.defaultProjectTitle);
      setSelectedDimensions(theme.dimensions);
      showToast(`Tema P5 diperbarui: ${theme.name}`);
    }
  };

  // Toggle Dimension Selection
  const toggleDimension = (dim: string) => {
    setSelectedDimensions((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
    );
  };

  // Handle Grade Change per Student Dimension
  const handleStudentGradeChange = (
    studentId: string,
    dimension: string,
    level: 'BB' | 'MB' | 'BSH' | 'SB'
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          grades: {
            ...s.grades,
            [dimension]: level,
          },
        };
      })
    );
  };

  const handlePrint = () => {
    smartPrint({
      documentSelector: '.document-page',
      docTitle: `Dokumen P5 - ${projectTitle}`,
      orientation: activeTab === 'rapor' ? 'landscape' : 'portrait',
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Tahap 5: Perencanaan & Rapor P5 Merdeka
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Rubrik Capaian BB, MB, BSH, SB
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Modul Projek Penguatan Profil Pelajar Pancasila (P5)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Rancang modul projek P5 berbasis 7 Tema Resmi BSKAP, susun alur tahapan aktivitas, petakan rubrik pencapaian 6 Dimensi Profil Pelajar Pancasila, hingga cetak Rapor P5 otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditingKop(!isEditingKop)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>{isEditingKop ? 'Tutup Pengatur Kop' : 'Atur Kop Dokumen'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KOP EDITOR PANEL ── */}
      {isEditingKop && (
        <P5KopEditor
          kop={kop}
          setKop={setKop}
          onClose={() => setIsEditingKop(false)}
        />
      )}

      {/* ── TOOLBAR & CONFIGURATION PANEL ── */}
      <P5ControlBar
        selectedThemeId={selectedThemeId}
        handleThemeChange={handleThemeChange}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        totalJp={totalJp}
        setTotalJp={setTotalJp}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
        selectedDimensions={selectedDimensions}
        toggleDimension={toggleDimension}
        currentTheme={currentTheme}
      />

      {/* ── OFFICIAL PRINT DOKUMEN CANVAS ── */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-lg p-8 md:p-12 space-y-6 document-page text-black font-serif text-xs leading-normal">
        {/* KOP OFFICIAL */}
        <div className="text-center border-b-2 border-black pb-4 space-y-1">
          <h1 className="text-sm md:text-base font-bold uppercase tracking-wider">
            {activeTab === 'modul'
              ? 'MODUL PERENCANAAN PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5)'
              : activeTab === 'rubrik'
              ? 'RUBRIK & LEMBAR OBSERVASI ASESMEN P5'
              : 'RAPOR PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5)'}
          </h1>
          <h2 className="text-xs md:text-sm font-bold uppercase">
            KURIKULUM MERDEKA - TAHUN PELAJARAN {year.label}
          </h2>
          <h3 className="text-xs font-bold uppercase">{kop.schoolName}</h3>
          <p className="text-[11px] font-sans italic text-slate-600">
            Tema: {currentTheme.name} | Kelas {selectedGrade} ({selectedClass})
          </p>
        </div>

        {/* METADATA SUMMARY */}
        <div className="bg-amber-50/50 p-3 rounded border border-amber-200 font-sans text-[11px] grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <div><strong>TEMA PROJEK:</strong> {currentTheme.name}</div>
            <div><strong>JUDUL PROJEK:</strong> {projectTitle}</div>
            <div><strong>FASE / KELAS:</strong> {targetPhase} / {selectedClass}</div>
          </div>
          <div>
            <div><strong>TOTAL ALOKASI WAKTU:</strong> {totalJp} JP</div>
            <div><strong>KOORDINATOR PROJEK:</strong> {kop.teacherName}</div>
            <div><strong>DIMENSI FOKUS:</strong> {selectedDimensions.join(', ')}</div>
          </div>
        </div>

        {/* ── TAB 1: MODUL PERENCANAAN PROJEK ── */}
        {activeTab === 'modul' && (
          <P5ModulTab
            currentTheme={currentTheme}
            projectTitle={projectTitle}
            selectedDimensions={selectedDimensions}
            activities={activities}
          />
        )}

        {/* ── TAB 2: RUBRIK & OBSERVASI ASESMEN SISWA ── */}
        {activeTab === 'rubrik' && (
          <P5RubrikTab
            selectedDimensions={selectedDimensions}
            students={students}
            handleStudentGradeChange={handleStudentGradeChange}
          />
        )}

        {/* ── TAB 3: CATATAN RAPOR P5 ── */}
        {activeTab === 'rapor' && (
          <P5RaporTab
            students={students}
            selectedClass={selectedClass}
            selectedDimensions={selectedDimensions}
            projectTitle={projectTitle}
          />
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
            <div>Koordinator / Guru P5</div>
            <div className="h-20" />
            <div className="font-bold underline">{kop.teacherName}</div>
            <div>NIP. {kop.teacherNip}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
