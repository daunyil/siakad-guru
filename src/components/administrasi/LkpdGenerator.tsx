import React, { useState, useMemo, useEffect } from 'react';
import type {
  CPSubject,
  DocumentKopSettings,
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
} from '../../types';
import { initialCpSubjects, findCpSubjectId } from '../../data/cpMasterData';
import {
  masterBukuSiswaData,
  findBukuSiswaSubject,
  resolveLkpdVariations,
} from '../../data/bukuSiswaData';
import { smartPrint } from '../../utils/printHelper';
import {
  LkpdHeaderBanner,
  LkpdKopSettingsModal,
  LkpdTextbookSelector,
  LkpdWorksheetCanvas,
  generateCompleteLkpdPackage,
  LKPD_ACTIVITY_OPTIONS,
  type LkpdActivityType,
  type LkpdQuestion,
  type CompleteLkpdPackage,
} from './lkpd';

interface LkpdGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
}

export type { CompleteLkpdPackage as LkpdData, LkpdQuestion, LkpdActivityType };

export const LkpdGenerator: React.FC<LkpdGeneratorProps> = ({
  school,
  teacher,
  year,
  selectedAssignmentSubject,
  selectedClassLabel,
}) => {
  // Master Subject Data
  const [cpSubjects] = useState<CPSubject[]>(initialCpSubjects);
  const activeSubjectName = selectedAssignmentSubject || teacher.subject || 'Pendidikan Pancasila';

  // Determine initial class from teacher / assignment
  const initialClassGrade: 'VII' | 'VIII' | 'IX' = useMemo(() => {
    if (
      selectedClassLabel?.toUpperCase().includes('VIII') ||
      teacher.teachingClass?.includes('8') ||
      teacher.teachingClass?.toUpperCase().includes('VIII')
    ) {
      return 'VIII';
    }
    if (
      selectedClassLabel?.toUpperCase().includes('IX') ||
      teacher.teachingClass?.includes('9') ||
      teacher.teachingClass?.toUpperCase().includes('IX')
    ) {
      return 'IX';
    }
    return 'VII';
  }, [selectedClassLabel, teacher.teachingClass]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(() =>
    findCpSubjectId(initialCpSubjects, activeSubjectName)
  );

  useEffect(() => {
    const targetSubjectId = findCpSubjectId(cpSubjects, activeSubjectName);
    if (targetSubjectId) {
      setSelectedSubjectId(targetSubjectId);
    }
  }, [activeSubjectName, cpSubjects]);

  const currentSubject = useMemo(() => {
    return cpSubjects.find((s) => s.id === selectedSubjectId) || cpSubjects[0];
  }, [cpSubjects, selectedSubjectId]);

  // ── TEXTBOOK SELECTION STATE ──
  const [selectedBukuClass, setSelectedBukuClass] = useState<'VII' | 'VIII' | 'IX'>(initialClassGrade);

  const activeBukuSiswaSubject = useMemo(() => {
    return findBukuSiswaSubject(currentSubject.subjectName, selectedBukuClass) || masterBukuSiswaData[0];
  }, [currentSubject.subjectName, selectedBukuClass]);

  const [selectedBabId, setSelectedBabId] = useState<string>(() => {
    return activeBukuSiswaSubject?.babList[0]?.id || '';
  });

  const currentBab = useMemo(() => {
    return activeBukuSiswaSubject?.babList.find((b) => b.id === selectedBabId) || activeBukuSiswaSubject?.babList[0];
  }, [activeBukuSiswaSubject, selectedBabId]);

  const [selectedSubBabId, setSelectedSubBabId] = useState<string>(() => {
    return currentBab?.subBabList[0]?.id || '';
  });

  const currentSubBab = useMemo(() => {
    return currentBab?.subBabList.find((sb) => sb.id === selectedSubBabId) || currentBab?.subBabList[0];
  }, [currentBab, selectedSubBabId]);

  // Sync selectedBabId & selectedSubBabId when activeBukuSiswaSubject changes
  useEffect(() => {
    if (activeBukuSiswaSubject) {
      const firstBab = activeBukuSiswaSubject.babList[0];
      if (firstBab) {
        setSelectedBabId(firstBab.id);
        const firstSubBab = firstBab.subBabList[0];
        if (firstSubBab) {
          setSelectedSubBabId(firstSubBab.id);
        }
      }
    }
  }, [activeBukuSiswaSubject]);

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

  useEffect(() => {
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

  // Model Aktivitas (Studi Kasus, Komparasi, Proyek Gotong Royong, Observasi, Refleksi, Analisis Konsep)
  const [selectedActivityType, setSelectedActivityType] = useState<LkpdActivityType>('studi_kasus');
  const [meetingNumber, setMeetingNumber] = useState<number>(1);

  const initialInitSubBab = masterBukuSiswaData[0]?.babList[0]?.subBabList[0];

  // LKPD Active State Data
  const [lkpd, setLkpd] = useState<CompleteLkpdPackage>(() => {
    if (initialInitSubBab && masterBukuSiswaData[0]?.babList[0]) {
      return generateCompleteLkpdPackage(
        initialInitSubBab,
        masterBukuSiswaData[0].babList[0],
        'VII',
        undefined,
        'studi_kasus',
        1,
        activeSubjectName
      );
    }

    return {
      title: 'LKPD Pertemuan 1: Jejak Nilai Luhur Bangsa pada Masa Awal Sejarah Nusantara',
      meetingNumber: 1,
      timeAllocation: '2 x 40 Menit (1 Pertemuan)',
      targetClass: 'VII',
      semester: 1,
      subjectId: 'pendidikan-pancasila',
      subjectName: 'Pendidikan Pancasila',
      elementName: 'Pancasila',
      tpCode: 'TP.VII.1.A',
      tpTitle: 'Menganalisis latar sejarah awal dan nilai-nilai kearifan Nusantara',
      pemahamanBermakna: 'Memahami bahwa nilai Pancasila telah berakar kuat sejak masa awal sejarah Nusantara.',
      pertanyaanPemantik: [
        'Bagaimana nilai-nilai luhur dipraktikkan oleh masyarakat Nusantara sejak zaman dahulu?',
      ],
      p5Dimensions: ['Beriman & Bertakwa', 'Gotong Royong', 'Bernalar Kritis'],
      toolsAndMaterials: 'Buku Siswa Kemendikbudristek, Alat Tulis, LKPD.',
      generalInstructions: [
        'Berdoalah terlebih dahulu sebelum memulai diskusi kelompok.',
        'Bacalah setiap petunjuk dan wacana pemantik pada Buku Siswa dengan cermat.',
        'Diskusikan bersama anggota kelompok secara aktif, santun, dan saling menghargai pendapat.',
        'Tuliskan hasil analisis dan jawaban kelompok pada lembar kerja yang telah disediakan.',
        'Persiapkan perwakilan kelompok untuk mempresentasikan hasil diskusi di depan kelas.',
      ],
      stimulusTitle: 'C. WACANA PEMANTIK BUKU SISWA',
      stimulusText: 'Stimulus materi pembelajaran...',
      activityType: 'studi_kasus',
      activityBadge: 'Studi Kasus Kontekstual',
      activityStepsTitle: 'D. LANGKAH-LANGKAH AKTIVITAS BELAJAR',
      activitySteps: [],
      questionsTitle: 'E. INSTRUMEN AKTIVITAS PENYELIDIKAN',
      questions: [],
      reflectionQuestions: [],
      rubricCriteria: [],
    };
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Re-generate LKPD
  const handleRegenerateLkpd = (
    forcedActivityType?: LkpdActivityType,
    forcedMeetingNumber?: number
  ) => {
    if (!currentSubBab || !currentBab) return;

    const targetMeetingNum = forcedMeetingNumber !== undefined ? forcedMeetingNumber : meetingNumber;
    const targetActivity = forcedActivityType !== undefined ? forcedActivityType : selectedActivityType;

    const newPackage = generateCompleteLkpdPackage(
      currentSubBab,
      currentBab,
      selectedBukuClass,
      undefined,
      targetActivity,
      targetMeetingNum,
      currentSubject.subjectName
    );

    setLkpd(newPackage);
    showToast(`LKPD "${newPackage.title}" (${LKPD_ACTIVITY_OPTIONS[targetActivity]?.title || targetActivity}) berhasil dimuat!`);
  };

  // Auto-sync when SubBab, Class, or Subject changes
  useEffect(() => {
    if (currentSubBab && currentBab) {
      const derivedMeeting = parseInt((currentSubBab.code || '1').replace(/[^0-9]/g, '')) || 1;
      setMeetingNumber(derivedMeeting);

      const newPackage = generateCompleteLkpdPackage(
        currentSubBab,
        currentBab,
        selectedBukuClass,
        undefined,
        selectedActivityType,
        derivedMeeting,
        currentSubject.subjectName
      );
      setLkpd(newPackage);
    }
  }, [currentSubBab, currentBab, selectedBukuClass, selectedActivityType, currentSubject.subjectName]);

  // Cycle through activity models
  const handleCycleActivity = () => {
    const activityTypes: LkpdActivityType[] = [
      'studi_kasus',
      'komparasi',
      'proyek_kreatif',
      'observasi_wawancara',
      'refleksi_komitmen',
      'analisis_konsep',
    ];
    const currentIndex = activityTypes.indexOf(selectedActivityType);
    const nextIndex = (currentIndex + 1) % activityTypes.length;
    const nextType = activityTypes[nextIndex];

    setSelectedActivityType(nextType);
    handleRegenerateLkpd(nextType);
  };

  // Add Custom Question
  const handleAddQuestion = () => {
    const newQ: LkpdQuestion = {
      id: `q_custom_${Date.now()}`,
      type: 'essay',
      questionText: 'Pertanyaan Analisis Tambahan:',
      guideHint: 'Diskusikan bersama anggota kelompok dan hubungkan dengan Tujuan Pembelajaran.',
    };
    setLkpd((prev) => ({
      ...prev,
      questions: [...prev.questions, newQ],
    }));
    showToast('Pertanyaan baru ditambahkan.');
  };

  // Delete Question
  const handleDeleteQuestion = (id: string) => {
    setLkpd((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
    showToast('Pertanyaan dihapus.');
  };

  // Format LKPD to Plain Text for Clipboard Copy
  const handleCopyText = () => {
    let text = `================================================================================\n`;
    text += `LEMBAR KERJA PESERTA DIDIK (LKPD) - KURIKULUM MERDEKA\n`;
    text += `${kopSettings.schoolName.toUpperCase()}\n`;
    text += `NPSN: ${kopSettings.npsn} | ${kopSettings.address}\n`;
    text += `================================================================================\n\n`;
    text += `JUDUL: ${lkpd.title}\n`;
    text += `Mata Pelajaran: ${lkpd.subjectName}\n`;
    text += `Fase / Kelas: D / Kelas ${lkpd.targetClass}\n`;
    text += `Semester: ${lkpd.semester}\n`;
    text += `Alokasi Waktu: ${lkpd.timeAllocation}\n\n`;

    text += `A. TUJUAN PEMBELAJARAN & PEMAHAMAN BERMAKNA\n`;
    text += `• Elemen CP: ${lkpd.elementName}\n`;
    text += `• Kode TP: ${lkpd.tpCode}\n`;
    text += `• Tujuan Pembelajaran: ${lkpd.tpTitle}\n`;
    text += `• Pemahaman Bermakna: ${lkpd.pemahamanBermakna}\n`;
    text += `• Dimensi Profil Pelajar Pancasila: ${lkpd.p5Dimensions.join(' • ')}\n`;
    text += `• Sumber Belajar: ${lkpd.toolsAndMaterials}\n\n`;

    text += `B. PETUNJUK UMUM BELAJAR\n`;
    lkpd.generalInstructions.forEach((inst, i) => {
      text += `${i + 1}. ${inst}\n`;
    });
    text += `\n`;

    text += `${lkpd.stimulusTitle}\n`;
    text += `${lkpd.stimulusText}\n\n`;

    text += `${lkpd.activityStepsTitle}\n`;
    lkpd.activitySteps.forEach((step) => {
      text += `• ${step}\n`;
    });
    text += `\n`;

    text += `${lkpd.questionsTitle}\n`;
    lkpd.questions.forEach((q, i) => {
      text += `\n[Pertanyaan ${i + 1}] ${q.questionText}\n`;
      if (q.guideHint) text += `Petunjuk: ${q.guideHint}\n`;
      if (q.type === 'case_study' && q.caseStudyNarrative) {
        text += `Wacana Kasus: "${q.caseStudyNarrative}"\n`;
      }
      if (q.sentenceStarter) {
        text += `Kalimat Pembuka Jawaban: "${q.sentenceStarter}"\n`;
      }
      if (q.type === 'matrix_table' && q.tableHeaders) {
        text += `Tabel: [${q.tableHeaders.join(' | ')}]\n`;
        q.tableRows?.forEach((r, ri) => {
          text += `Baris ${ri + 1}: ${r.aspect} -> ${r.cells?.join(' | ') || ''}\n`;
        });
      }
      if (q.type === 'action_plan' && q.actionPlanSteps) {
        q.actionPlanSteps.forEach((s, si) => {
          text += `Tahap ${si + 1} (${s.tahap}): ${s.rencanaKegiatan} | Pelaksana: ${s.pelaksana} | Target: ${s.targetHasil}\n`;
        });
      }
    });

    text += `\n\nF. REFLEKSI PEMBELAJARAN\n`;
    lkpd.reflectionQuestions.forEach((rq, i) => {
      text += `${i + 1}. ${rq}\n`;
    });

    text += `\n\nG. RUBRIK PENILAIAN GURU (Skor 1-4)\n`;
    lkpd.rubricCriteria.forEach((rub, i) => {
      text += `${i + 1}. ${rub.aspect}\n   - Skor 4 (Sangat Baik): ${rub.score4}\n   - Skor 3 (Baik): ${rub.score3}\n   - Skor 2 (Cukup): ${rub.score2}\n   - Skor 1 (Perlu Bimbingan): ${rub.score1}\n`;
    });

    text += `\n\nMengetahui,\nKepala Sekolah: ${kopSettings.headmasterName} (NIP. ${kopSettings.headmasterNip})\nGuru Pengampu: ${kopSettings.teacherName} (NIP. ${kopSettings.teacherNip})\n`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Seluruh teks LKPD berhasil disalin ke clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-300">
          {notification}
        </div>
      )}

      {/* ── TOP HEADER BANNER ── */}
      <LkpdHeaderBanner
        subjectName={currentSubject.subjectName}
        classGrade={selectedBukuClass}
        meetingNumber={lkpd.meetingNumber}
        activityType={lkpd.activityType}
        tpTitle={lkpd.tpTitle}
        isEditingKop={isEditingKop}
        onToggleEditKop={() => setIsEditingKop((prev) => !prev)}
        onCycleActivity={handleCycleActivity}
        onPrint={() => smartPrint()}
        onCopyText={handleCopyText}
      />

      {/* ── KOP SETTINGS MODAL ── */}
      <LkpdKopSettingsModal
        isOpen={isEditingKop}
        kopSettings={kopSettings}
        onChangeKop={(updated) => setKopSettings((prev) => ({ ...prev, ...updated }))}
        onClose={() => setIsEditingKop(false)}
      />

      {/* ── TEXTBOOK & ACTIVITY MODEL SELECTOR ── */}
      <LkpdTextbookSelector
        selectedBukuClass={selectedBukuClass}
        onSelectClass={(grade) => setSelectedBukuClass(grade)}
        activeBukuSiswaSubject={activeBukuSiswaSubject}
        currentBab={currentBab}
        selectedBabId={selectedBabId}
        onSelectBab={(id) => setSelectedBabId(id)}
        currentSubBab={currentSubBab}
        selectedSubBabId={selectedSubBabId}
        onSelectSubBab={(id) => setSelectedSubBabId(id)}
        selectedActivityType={selectedActivityType}
        onSelectActivityType={(act) => {
          setSelectedActivityType(act);
          handleRegenerateLkpd(act);
        }}
        meetingNumber={meetingNumber}
        onChangeMeetingNumber={(num) => {
          setMeetingNumber(num);
          handleRegenerateLkpd(undefined, num);
        }}
        onRegenerate={() => handleRegenerateLkpd()}
      />

      {/* ── WORKSHEET CANVAS (PRINTABLE A4) ── */}
      <LkpdWorksheetCanvas
        lkpd={lkpd}
        kopSettings={kopSettings}
        onAddQuestion={handleAddQuestion}
        onDeleteQuestion={handleDeleteQuestion}
      />
    </div>
  );
};
