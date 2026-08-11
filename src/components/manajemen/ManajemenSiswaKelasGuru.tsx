import React, { useState, useMemo } from 'react';
import type {
  SchoolProfile,
  TeacherProfile,
  AcademicYear,
  ClassRoster,
  TeachingAssignment,
  Student,
} from '../../types';
import {
  Users,
  Building,
  UserCheck,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Upload,
  Download,
  Printer,
  Sparkles,
  School,
  BookOpen,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  UserPlus,
  ShieldCheck,
  Layers,
  ArrowUpDown,
  RefreshCw,
  User,
  Star,
  Award,
  Zap
} from 'lucide-react';

interface ManajemenSiswaKelasGuruProps {
  school: SchoolProfile;
  setSchool: React.Dispatch<React.SetStateAction<SchoolProfile>>;
  teacher: TeacherProfile;
  setTeacher: React.Dispatch<React.SetStateAction<TeacherProfile>>;
  teachers: TeacherProfile[];
  setTeachers: React.Dispatch<React.SetStateAction<TeacherProfile[]>>;
  year: AcademicYear;
  setYear: React.Dispatch<React.SetStateAction<AcademicYear>>;
  rosters: ClassRoster[];
  setRosters: React.Dispatch<React.SetStateAction<ClassRoster[]>>;
  assignments: TeachingAssignment[];
  setAssignments: React.Dispatch<React.SetStateAction<TeachingAssignment[]>>;
}

export const ManajemenSiswaKelasGuru: React.FC<ManajemenSiswaKelasGuruProps> = ({
  school,
  setSchool,
  teacher,
  setTeacher,
  teachers,
  setTeachers,
  year,
  setYear,
  rosters,
  setRosters,
  assignments,
  setAssignments,
}) => {
  const [activeTab, setActiveTab] = useState<'siswa' | 'kelas' | 'guru' | 'sekolah'>('siswa');
  const [selectedClassId, setSelectedClassId] = useState<string>(rosters[0]?.classId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [teacherSearchQuery, setTeacherSearchQuery] = useState<string>('');

  // Status notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // 1. SISWA STATE & MODALS
  // ---------------------------------------------------------------------------
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState<{
    name: string;
    nis: string;
    nisn: string;
    gender: 'L' | 'P';
    number: number;
    classId: string;
  }>({
    name: '',
    nis: '',
    nisn: '',
    gender: 'L',
    number: 1,
    classId: rosters[0]?.classId || '',
  });

  // Batch import student state
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchRawText, setBatchRawText] = useState('');
  const [batchClassId, setBatchClassId] = useState(rosters[0]?.classId || '');

  // Get active roster or all students
  const currentRoster = useMemo(() => {
    if (selectedClassId === 'all') return null;
    return rosters.find((r) => r.classId === selectedClassId) || rosters[0];
  }, [rosters, selectedClassId]);

  // All students flattened for search across school
  const allStudentsWithClass = useMemo(() => {
    const list: Array<Student & { classId: string; classLabel: string }> = [];
    rosters.forEach((r) => {
      r.students.forEach((s) => {
        list.push({ ...s, classId: r.classId, classLabel: r.classLabel });
      });
    });
    return list;
  }, [rosters]);

  // Filtered students by class filter & search query
  const filteredStudents = useMemo(() => {
    let baseList = selectedClassId === 'all'
      ? allStudentsWithClass
      : (currentRoster?.students.map(s => ({ ...s, classId: currentRoster.classId, classLabel: currentRoster.classLabel })) || []);

    if (!searchQuery.trim()) return baseList;
    const q = searchQuery.toLowerCase();
    return baseList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.nis.includes(q) ||
        s.nisn.includes(q) ||
        s.classLabel.toLowerCase().includes(q)
    );
  }, [selectedClassId, currentRoster, allStudentsWithClass, searchQuery]);

  const handleOpenAddStudent = (targetClassId?: string) => {
    setEditingStudent(null);
    const clsId = targetClassId || (selectedClassId !== 'all' ? selectedClassId : rosters[0]?.classId || '');
    const targetRoster = rosters.find(r => r.classId === clsId);
    
    setStudentForm({
      name: '',
      nis: `2425${Math.floor(10 + Math.random() * 90)}`,
      nisn: `011${Math.floor(1000000 + Math.random() * 9000000)}`,
      gender: 'L',
      number: (targetRoster?.students.length || 0) + 1,
      classId: clsId,
    });
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (st: Student & { classId?: string }) => {
    setEditingStudent(st);
    const foundClassId = st.classId || selectedClassId;
    setStudentForm({
      name: st.name,
      nis: st.nis,
      nisn: st.nisn,
      gender: st.gender,
      number: st.number,
      classId: foundClassId,
    });
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim()) return;

    setRosters((prevRosters) =>
      prevRosters.map((r) => {
        if (r.classId === studentForm.classId) {
          if (editingStudent) {
            // Update existing student in this class
            const exists = r.students.some(s => s.id === editingStudent.id);
            if (exists) {
              const updatedStudents = r.students.map((s) =>
                s.id === editingStudent.id
                  ? {
                      ...s,
                      name: studentForm.name.toUpperCase(),
                      nis: studentForm.nis,
                      nisn: studentForm.nisn,
                      gender: studentForm.gender,
                      number: studentForm.number,
                    }
                  : s
              );
              return { ...r, students: updatedStudents };
            } else {
              // Moved from another class
              return {
                ...r,
                students: [
                  ...r.students,
                  {
                    id: editingStudent.id,
                    name: studentForm.name.toUpperCase(),
                    nis: studentForm.nis,
                    nisn: studentForm.nisn,
                    gender: studentForm.gender,
                    number: studentForm.number,
                  },
                ],
              };
            }
          } else {
            // Create new student
            const newSt: Student = {
              id: `s-${Date.now()}-${Math.floor(Math.random() * 100)}`,
              name: studentForm.name.toUpperCase(),
              nis: studentForm.nis,
              nisn: studentForm.nisn,
              gender: studentForm.gender,
              number: studentForm.number,
            };
            return { ...r, students: [...r.students, newSt] };
          }
        } else if (editingStudent) {
          // Remove from old class if class changed
          return {
            ...r,
            students: r.students.filter((s) => s.id !== editingStudent.id),
          };
        }
        return r;
      })
    );

    setIsStudentModalOpen(false);
    showToast(
      editingStudent
        ? `Data siswa "${studentForm.name}" berhasil diperbarui!`
        : `Siswa baru "${studentForm.name}" berhasil ditambahkan!`
    );
  };

  const handleDeleteStudent = (stId: string, stName: string, classId?: string) => {
    if (!window.confirm(`Yakin ingin menghapus siswa "${stName}"?`)) return;

    setRosters((prevRosters) =>
      prevRosters.map((r) => {
        if (!classId || r.classId === classId) {
          return {
            ...r,
            students: r.students.filter((s) => s.id !== stId),
          };
        }
        return r;
      })
    );

    showToast(`Siswa "${stName}" telah dihapus.`);
  };

  const handleBatchImport = () => {
    if (!batchRawText.trim()) return;

    const lines = batchRawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const newStudentsList: Student[] = [];
    const targetRoster = rosters.find(r => r.classId === batchClassId);

    lines.forEach((line, index) => {
      const parts = line.split(/[\t,;]+/).map((p) => p.trim());
      if (parts.length >= 1) {
        let name = parts[0];
        let gender: 'L' | 'P' = 'L';
        let nis = `2425${String((targetRoster?.students.length || 0) + index + 1).padStart(2, '0')}`;
        let nisn = `0112345${String((targetRoster?.students.length || 0) + index + 1).padStart(3, '0')}`;

        parts.forEach((p) => {
          if (p.toUpperCase() === 'L' || p.toUpperCase() === 'P') {
            gender = p.toUpperCase() as 'L' | 'P';
          } else if (/^\d{6,10}$/.test(p)) {
            if (p.length === 10) nisn = p;
            else nis = p;
          } else if (isNaN(Number(p)) && p.length > 2) {
            name = p;
          }
        });

        newStudentsList.push({
          id: `s-batch-${Date.now()}-${index}`,
          name: name.toUpperCase(),
          nis,
          nisn,
          gender,
          number: (targetRoster?.students.length || 0) + index + 1,
        });
      }
    });

    if (newStudentsList.length > 0) {
      setRosters((prevRosters) =>
        prevRosters.map((r) => {
          if (r.classId === batchClassId) {
            return {
              ...r,
              students: [...r.students, ...newStudentsList],
            };
          }
          return r;
        })
      );

      setBatchRawText('');
      setIsBatchModalOpen(false);
      showToast(`Berhasil mengimpor ${newStudentsList.length} siswa baru ke kelas ${targetRoster?.classLabel || ''}!`);
    } else {
      alert('Format teks tidak valid. Mohon tempel daftar baris nama siswa.');
    }
  };

  // Download template TXT/CSV for batch import
  const handleDownloadStudentTemplate = () => {
    const templateContent = `NAMA LENGKAP, JENIS KELAMIN (L/P), NIS, NISN\nACHMAD FAUZI, L, 242501, 0112345601\nADINDA PUTRI MAHESHWARI, P, 242502, 0112345602\nAHMAD ZAKI MUBAROK, L, 242503, 0112345603`;
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_import_siswa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------------------------------------------------------------------------
  // 2. GURU STATE & MODALS (MULTI-TEACHER)
  // ---------------------------------------------------------------------------
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacherModal, setEditingTeacherModal] = useState<TeacherProfile | null>(null);
  const [teacherFormModal, setTeacherFormModal] = useState<TeacherProfile>({
    id: '',
    name: '',
    nip: '',
    nuptk: '',
    rank: '',
    subject: '',
    role: 'Guru Mata Pelajaran',
    status: 'PNS',
  });

  const handleOpenAddTeacher = () => {
    setEditingTeacherModal(null);
    setTeacherFormModal({
      id: `teacher-${Date.now()}`,
      name: '',
      nip: '198' + Math.floor(1000000000000 + Math.random() * 9000000000000),
      nuptk: '453' + Math.floor(1000000000000 + Math.random() * 9000000000000),
      rank: 'Penata / III/c',
      subject: 'Matematika',
      role: 'Guru Mata Pelajaran',
      status: 'PNS',
    });
    setIsTeacherModalOpen(true);
  };

  const handleOpenEditTeacherModal = (t: TeacherProfile) => {
    setEditingTeacherModal(t);
    setTeacherFormModal({
      ...t,
      role: t.role || 'Guru Mata Pelajaran',
      status: t.status || 'PNS',
    });
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacherModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherFormModal.name.trim()) return;

    if (editingTeacherModal) {
      // Update existing teacher in array
      setTeachers((prev) =>
        prev.map((t) => (t.id === editingTeacherModal.id ? teacherFormModal : t))
      );
      // If currently active teacher is updated, update active teacher state
      if (teacher.id === editingTeacherModal.id) {
        setTeacher(teacherFormModal);
      }
      showToast(`Data guru "${teacherFormModal.name}" berhasil diperbarui!`);
    } else {
      // Create new teacher
      const newT: TeacherProfile = {
        ...teacherFormModal,
        id: `teacher-${Date.now()}`,
      };
      setTeachers((prev) => [...prev, newT]);
      showToast(`Guru baru "${newT.name}" berhasil ditambahkan!`);
    }

    setIsTeacherModalOpen(false);
  };

  const handleDeleteTeacher = (tId: string, tName: string) => {
    if (teachers.length <= 1) {
      alert('Tidak dapat menghapus. Sekolah harus memiliki setidaknya 1 guru terdaftar.');
      return;
    }
    if (!window.confirm(`Yakin ingin menghapus guru "${tName}" dari daftar sekolah?`)) return;

    setTeachers((prev) => prev.filter((t) => t.id !== tId));
    if (teacher.id === tId) {
      const remaining = teachers.find((t) => t.id !== tId);
      if (remaining) setTeacher(remaining);
    }
    showToast(`Guru "${tName}" telah dihapus.`);
  };

  const handleSetActiveTeacher = (t: TeacherProfile) => {
    setTeacher(t);
    showToast(`Profil aktif beralih ke "${t.name}"!`);
  };

  // Filtered teachers list
  const filteredTeachers = useMemo(() => {
    if (!teacherSearchQuery.trim()) return teachers;
    const q = teacherSearchQuery.toLowerCase();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.nip.includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        (t.role && t.role.toLowerCase().includes(q))
    );
  }, [teachers, teacherSearchQuery]);

  // ---------------------------------------------------------------------------
  // 3. KELAS STATE & MODALS
  // ---------------------------------------------------------------------------
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoster | null>(null);
  const [classForm, setClassForm] = useState<{
    classLabel: string;
    grade: number;
    parallel: string;
  }>({
    classLabel: '',
    grade: 7,
    parallel: 'C',
  });

  const handleOpenAddClass = () => {
    setEditingClass(null);
    setClassForm({ classLabel: 'VII-C', grade: 7, parallel: 'C' });
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (cls: ClassRoster) => {
    setEditingClass(cls);
    setClassForm({
      classLabel: cls.classLabel,
      grade: cls.grade,
      parallel: cls.parallel,
    });
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.classLabel.trim()) return;

    if (editingClass) {
      setRosters((prev) =>
        prev.map((r) =>
          r.classId === editingClass.classId
            ? { ...r, classLabel: classForm.classLabel, grade: classForm.grade, parallel: classForm.parallel }
            : r
        )
      );
      setAssignments((prev) =>
        prev.map((a) =>
          a.classId === editingClass.classId ? { ...a, classLabel: classForm.classLabel } : a
        )
      );
      showToast(`Kelas ${classForm.classLabel} berhasil diperbarui!`);
    } else {
      const newClassId = `cls-${Date.now()}`;
      const newRoster: ClassRoster = {
        classId: newClassId,
        classLabel: classForm.classLabel,
        grade: classForm.grade,
        parallel: classForm.parallel,
        students: [],
      };
      setRosters((prev) => [...prev, newRoster]);

      const newAsg: TeachingAssignment = {
        id: `asg-${newClassId}-mat`,
        classId: newClassId,
        classLabel: classForm.classLabel,
        subject: teacher.subject || 'Matematika',
        teacherId: teacher.id,
        totalJpPerWeek: 5,
      };
      setAssignments((prev) => [...prev, newAsg]);

      showToast(`Kelas baru ${classForm.classLabel} berhasil dibuat!`);
    }

    setIsClassModalOpen(false);
  };

  const handleDeleteClass = (clsId: string, label: string) => {
    const targetRoster = rosters.find((r) => r.classId === clsId);
    if (targetRoster && targetRoster.students.length > 0) {
      alert(`Kelas "${label}" memiliki ${targetRoster.students.length} siswa. Kosongkan siswa terlebih dahulu sebelum menghapus kelas.`);
      return;
    }

    if (!window.confirm(`Yakin ingin menghapus kelas "${label}"?`)) return;

    setRosters((prev) => prev.filter((r) => r.classId !== clsId));
    setAssignments((prev) => prev.filter((a) => a.classId !== clsId));
    if (selectedClassId === clsId && rosters.length > 1) {
      setSelectedClassId(rosters[0].classId);
    }
    showToast(`Kelas "${label}" telah dihapus.`);
  };

  // ---------------------------------------------------------------------------
  // 4. PENUGASAN MAPEL STATE
  // ---------------------------------------------------------------------------
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState<{
    teacherId: string;
    classId: string;
    subject: string;
    totalJpPerWeek: number;
  }>({
    teacherId: teacher.id,
    classId: rosters[0]?.classId || '',
    subject: teacher.subject || 'Matematika',
    totalJpPerWeek: 5,
  });

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = rosters.find((r) => r.classId === assignmentForm.classId);
    if (!cls) return;

    const assignedTeacher = teachers.find((t) => t.id === assignmentForm.teacherId) || teacher;

    const newAsg: TeachingAssignment = {
      id: `asg-${Date.now()}`,
      classId: cls.classId,
      classLabel: cls.classLabel,
      subject: assignmentForm.subject,
      teacherId: assignedTeacher.id,
      totalJpPerWeek: assignmentForm.totalJpPerWeek,
    };

    setAssignments((prev) => [...prev, newAsg]);
    setIsAssignmentModalOpen(false);
    showToast(`Penugasan ${assignmentForm.subject} di kelas ${cls.classLabel} (${assignedTeacher.name}) berhasil ditambahkan!`);
  };

  const handleDeleteAssignment = (asgId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== asgId));
    showToast('Penugasan mengajar dihapus.');
  };

  // ---------------------------------------------------------------------------
  // 5. PROFIL SEKOLAH STATE
  // ---------------------------------------------------------------------------
  const [schoolForm, setSchoolForm] = useState<SchoolProfile>({ ...school });
  const [yearForm, setYearForm] = useState<AcademicYear>({ ...year });

  const handleSaveSchoolProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSchool(schoolForm);
    setYear(yearForm);
    showToast('Profil Sekolah & Tahun Ajaran berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Banner Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-blue-800/40 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <School className="w-3 h-3" />
                Sistem Pusat Master Data Sekolah
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Sinkron Real-Time
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Manajemen Siswa, Guru, Kelas & Sekolah
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Pusat kelola data siswa, pendaftaran guru baru, pembagian rombel kelas, serta identitas sekolah. Semua data di sini langsung terhubung dengan rekap nilai, absensi, jurnal mengajar, dan dokumen Kurikulum Merdeka!
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 shrink-0">
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Total Siswa</div>
              <div className="text-base font-black text-emerald-400">
                {rosters.reduce((acc, r) => acc + r.students.length, 0)} Siswa
              </div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Total Guru</div>
              <div className="text-base font-black text-blue-400">{teachers.length} Guru</div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Total Rombel</div>
              <div className="text-base font-black text-amber-400">{rosters.length} Kelas</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HIGH PRIORITY ACTION SHORTCUT CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setActiveTab('siswa');
            handleOpenAddStudent();
          }}
          className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between group relative overflow-hidden border border-blue-400/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full">
              Form Siswa
            </span>
          </div>
          <div>
            <div className="text-xs font-extrabold text-white group-hover:underline flex items-center gap-1">
              + Tambah Siswa Baru
            </div>
            <div className="text-[10px] text-blue-100 opacity-90">Input data siswa 1 per 1</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab('siswa');
            setIsBatchModalOpen(true);
          }}
          className="p-4 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between group relative overflow-hidden border border-emerald-400/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full">
              Excel / Word
            </span>
          </div>
          <div>
            <div className="text-xs font-extrabold text-white group-hover:underline flex items-center gap-1">
              📥 Impor Banyak Siswa
            </div>
            <div className="text-[10px] text-emerald-100 opacity-90">Paste massal dari Excel</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab('guru');
            handleOpenAddTeacher();
          }}
          className="p-4 bg-gradient-to-br from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white rounded-2xl shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between group relative overflow-hidden border border-amber-400/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full">
              Form Guru
            </span>
          </div>
          <div>
            <div className="text-xs font-extrabold text-white group-hover:underline flex items-center gap-1">
              + Tambah Guru Baru
            </div>
            <div className="text-[10px] text-amber-100 opacity-90">Registrasi guru & NIP baru</div>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab('kelas');
            handleOpenAddClass();
          }}
          className="p-4 bg-gradient-to-br from-purple-600 to-indigo-800 hover:from-purple-500 hover:to-indigo-700 text-white rounded-2xl shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between group relative overflow-hidden border border-purple-400/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full">
              Rombel Kelas
            </span>
          </div>
          <div>
            <div className="text-xs font-extrabold text-white group-hover:underline flex items-center gap-1">
              + Buat Rombel Baru
            </div>
            <div className="text-[10px] text-purple-100 opacity-90">Tambah paralel VII/VIII/IX</div>
          </div>
        </button>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setActiveTab('siswa')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'siswa'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. Data Siswa ({rosters.reduce((acc, r) => acc + r.students.length, 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('guru')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'guru'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>2. Data Guru Sekolah ({teachers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kelas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'kelas'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Rombel Kelas ({rosters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sekolah')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'sekolah'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>4. Profil Sekolah & Kop</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MANAJEMEN SISWA                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'siswa' && (
        <div className="space-y-4">
          {/* Class Filter & Search Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-1">
                <School className="w-4 h-4 text-blue-600" />
                Filter Rombel:
              </span>
              <button
                onClick={() => setSelectedClassId('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedClassId === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Semua Kelas ({rosters.reduce((a, r) => a + r.students.length, 0)})
              </button>
              {rosters.map((r) => (
                <button
                  key={r.classId}
                  onClick={() => setSelectedClassId(r.classId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedClassId === r.classId
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {r.classLabel} ({r.students.length})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama, NIS, NISN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-60"
                />
              </div>

              {/* Batch Import Button */}
              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                title="Impor banyak siswa sekaligus dari Excel / Word"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Impor Massal</span>
              </button>

              {/* Add Student Button */}
              <button
                onClick={() => handleOpenAddStudent()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Siswa Baru</span>
              </button>
            </div>
          </div>

          {/* Student Table List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  {selectedClassId === 'all' ? 'Daftar Seluruh Siswa Sekolah' : `Daftar Siswa Kelas ${currentRoster?.classLabel}`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Menampilkan {filteredStudents.length} siswa registered
                </p>
              </div>

              {/* Gender ratio indicator */}
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
                  Laki-Laki: {filteredStudents.filter((s) => s.gender === 'L').length}
                </span>
                <span className="px-2.5 py-1 bg-pink-100 text-pink-800 rounded-full font-bold">
                  Perempuan: {filteredStudents.filter((s) => s.gender === 'P').length}
                </span>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-medium text-slate-500">
                  Belum ada data siswa yang sesuai filter/pencarian.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleOpenAddStudent()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Siswa Baru</span>
                  </button>
                  <button
                    onClick={() => setIsBatchModalOpen(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Impor dari Excel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4">Nama Lengkap Siswa</th>
                      <th className="py-3 px-4 w-28 text-center">Rombel Kelas</th>
                      <th className="py-3 px-4 w-28 text-center">NIS</th>
                      <th className="py-3 px-4 w-32 text-center">NISN</th>
                      <th className="py-3 px-4 w-20 text-center">L/P</th>
                      <th className="py-3 px-4 w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredStudents.map((st, idx) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-4 text-center text-slate-500 font-bold">{st.number || idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{st.name}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200">
                            {st.classLabel}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center text-slate-600 font-mono">{st.nis}</td>
                        <td className="py-2.5 px-4 text-center text-slate-600 font-mono">{st.nisn}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.gender === 'L'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-pink-100 text-pink-700'
                            }`}
                          >
                            {st.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditStudent(st)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit data siswa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(st.id, st.name, st.classId)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus siswa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MANAJEMEN GURU SEKOLAH (MULTI-TEACHER)                            */}
      {/* ========================================================================= */}
      {activeTab === 'guru' && (
        <div className="space-y-6">
          {/* Active Teacher Profile Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-300 tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Profil Guru Aktif Saya saat Ini
                </div>
                <h3 className="text-lg font-extrabold text-white">{teacher.name}</h3>
                <p className="text-xs text-slate-300 font-mono">
                  NIP: {teacher.nip || '-'} · NUPTK: {teacher.nuptk || '-'} · Mapel: {teacher.subject}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEditTeacherModal(teacher)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profil Saya</span>
              </button>
            </div>
          </div>

          {/* Teacher List Header & Actions */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Daftar Seluruh Guru Satuan Pendidikan ({teachers.length} Guru)
              </h3>
              <p className="text-[11px] text-slate-500">
                Kelola daftar guru pengampu, NIP, pangkat, status kepegawaian, dan penetapan mengajar.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari guru, NIP, mapel..."
                  value={teacherSearchQuery}
                  onChange={(e) => setTeacherSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-60"
                />
              </div>

              <button
                onClick={handleOpenAddTeacher}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Tambah Guru Baru</span>
              </button>
            </div>
          </div>

          {/* Teachers Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Nama Guru & Gelar</th>
                    <th className="py-3 px-4 w-36 text-center">NIP / NUPTK</th>
                    <th className="py-3 px-4 w-32">Pangkat / Gol</th>
                    <th className="py-3 px-4 w-32">Mata Pelajaran</th>
                    <th className="py-3 px-4 w-32 text-center">Status / Tugas</th>
                    <th className="py-3 px-4 w-36 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTeachers.map((t, idx) => {
                    const isActive = t.id === teacher.id;
                    return (
                      <tr key={t.id} className={`hover:bg-slate-50 transition-colors ${isActive ? 'bg-blue-50/50' : ''}`}>
                        <td className="py-3 px-4 text-center text-slate-500 font-bold">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{t.name}</span>
                            {isActive && (
                              <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-extrabold rounded-full uppercase tracking-wider">
                                Saya (Aktif)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-600">
                          <div>NIP: {t.nip || '-'}</div>
                          <div className="text-[10px] text-slate-400">NUPTK: {t.nuptk || '-'}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{t.rank || '-'}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{t.subject}</td>
                        <td className="py-3 px-4 text-center space-y-1">
                          <div>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                              {t.status || 'PNS'}
                            </span>
                          </div>
                          {t.role && (
                            <div className="text-[10px] text-slate-500 font-medium">{t.role}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {!isActive && (
                              <button
                                onClick={() => handleSetActiveTeacher(t)}
                                className="px-2 py-1 bg-slate-100 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold transition-colors"
                                title="Ganti ke profil guru ini"
                              >
                                Beralih Profil
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenEditTeacherModal(t)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Guru"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTeacher(t.id, t.name)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Guru"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teaching Load & Assignments */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Penugasan Mengajar Guru (Beban JP per Minggu)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Total {assignments.reduce((acc, a) => acc + a.totalJpPerWeek, 0)} Jam Pelajaran / Minggu Terdaftar
                </p>
              </div>

              <button
                onClick={() => setIsAssignmentModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Penugasan Mengajar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assignments.map((asg) => {
                const assignedTeacher = teachers.find((t) => t.id === asg.teacherId) || teacher;
                return (
                  <div
                    key={asg.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                        {asg.classLabel}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{asg.subject}</div>
                        <div className="text-[11px] text-slate-600">Guru: {assignedTeacher.name}</div>
                        <div className="text-[10px] text-slate-400">Rombel Kelas {asg.classLabel}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 bg-white border border-slate-200 font-extrabold text-emerald-700 rounded-lg">
                        {asg.totalJpPerWeek} JP
                      </span>
                      <button
                        onClick={() => handleDeleteAssignment(asg.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Penugasan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ROMBEL & KELAS                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'kelas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Daftar Rombongan Belajar (Rombel)
              </h3>
              <p className="text-[11px] text-slate-500">
                Atur kelas tingkat VII, VIII, IX dan paralel untuk pembagian mengajar.
              </p>
            </div>
            <button
              onClick={handleOpenAddClass}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Kelas Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rosters.map((r) => (
              <div
                key={r.classId}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center border border-blue-200">
                      {r.classLabel}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Kelas {r.classLabel}</h4>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Tingkat {r.grade} (Paralel {r.parallel})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditClass(r)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Nama Kelas"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(r.classId, r.classLabel)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Jumlah Anggota Siswa:</span>
                  <span className="font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {r.students.length} Siswa
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px]">
                  <span className="text-slate-500">
                    L: {r.students.filter((s) => s.gender === 'L').length} | P:{' '}
                    {r.students.filter((s) => s.gender === 'P').length}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedClassId(r.classId);
                      setActiveTab('siswa');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <span>Kelola Siswa</span>
                    <Users className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PROFIL SEKOLAH & TAHUN AJARAN                                     */}
      {/* ========================================================================= */}
      {activeTab === 'sekolah' && (
        <form onSubmit={handleSaveSchoolProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Profil Identitas Satuan Pendidikan & Kop Resmi
              </h3>
              <p className="text-[11px] text-slate-500">
                Data ini dicetak otomatis di bagian Kop Surat dan Tanda Tangan Dokumen Administrasi.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Identitas Sekolah</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left: School Profile */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1 uppercase">
                1. Identitas Sekolah
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
                <input
                  type="text"
                  value={schoolForm.name}
                  onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NPSN</label>
                  <input
                    type="text"
                    value={schoolForm.npsn}
                    onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={schoolForm.district}
                    onChange={(e) => setSchoolForm({ ...schoolForm, district: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Jalan & Desa</label>
                <input
                  type="text"
                  value={schoolForm.address}
                  onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kabupaten / Kota</label>
                  <input
                    type="text"
                    value={schoolForm.regency}
                    onChange={(e) => setSchoolForm({ ...schoolForm, regency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={schoolForm.province}
                    onChange={(e) => setSchoolForm({ ...schoolForm, province: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right: Headmaster & Academic Year */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1 uppercase">
                2. Kepala Sekolah & Tahun Ajaran
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kepala Sekolah (dengan Gelar)</label>
                <input
                  type="text"
                  value={schoolForm.headmasterName}
                  onChange={(e) => setSchoolForm({ ...schoolForm, headmasterName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={schoolForm.headmasterNip}
                  onChange={(e) => setSchoolForm({ ...schoolForm, headmasterNip: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahun Pelajaran</label>
                  <input
                    type="text"
                    value={yearForm.label}
                    onChange={(e) => setYearForm({ ...yearForm, label: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester Aktif</label>
                  <select
                    value={yearForm.semester}
                    onChange={(e) => setYearForm({ ...yearForm, semester: Number(e.target.value) as 1 | 2 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={1}>Semester 1 (Ganjil)</option>
                    <option value={2}>Semester 2 (Genap)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT / ADD SINGLE STUDENT                                         */}
      {/* ========================================================================= */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Rombel Kelas</label>
                <select
                  value={studentForm.classId}
                  onChange={(e) => setStudentForm({ ...studentForm, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {rosters.map((r) => (
                    <option key={r.classId} value={r.classId}>
                      Kelas {r.classLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: ACHMAD FAUZI"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIS</label>
                  <input
                    type="text"
                    value={studentForm.nis}
                    onChange={(e) => setStudentForm({ ...studentForm, nis: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN</label>
                  <input
                    type="text"
                    value={studentForm.nisn}
                    onChange={(e) => setStudentForm({ ...studentForm, nisn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Urut Absen</label>
                  <input
                    type="number"
                    value={studentForm.number}
                    onChange={(e) => setStudentForm({ ...studentForm, number: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT / ADD TEACHER MODAL                                           */}
      {/* ========================================================================= */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                {editingTeacherModal ? 'Edit Data Guru' : 'Tambah Guru Baru'}
              </h3>
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacherModal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Guru (dengan Gelar)</label>
                <input
                  type="text"
                  value={teacherFormModal.name}
                  onChange={(e) => setTeacherFormModal({ ...teacherFormModal, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="Contoh: DRS. AHMAD DAHLAN, M.Pd."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP Guru</label>
                  <input
                    type="text"
                    value={teacherFormModal.nip}
                    onChange={(e) => setTeacherFormModal({ ...teacherFormModal, nip: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Contoh: 19800101 200604 1 012"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    value={teacherFormModal.nuptk}
                    onChange={(e) => setTeacherFormModal({ ...teacherFormModal, nuptk: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="16 digit NUPTK"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran Utama</label>
                  <input
                    type="text"
                    value={teacherFormModal.subject}
                    onChange={(e) => setTeacherFormModal({ ...teacherFormModal, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Contoh: Matematika"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    value={teacherFormModal.rank}
                    onChange={(e) => setTeacherFormModal({ ...teacherFormModal, rank: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Contoh: Penata / III/c"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Kepegawaian</label>
                  <select
                    value={teacherFormModal.status || 'PNS'}
                    onChange={(e) => setTeacherFormModal({ ...teacherFormModal, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="PNS">PNS (Aparatur Sipil)</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Guru Honorer">Guru Honorer Sekolah</option>
                    <option value="GTY">Guru Tetap Yayasan (GTY)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan / Tugas Tambahan</label>
                  <input
                    type="text"
                    value={teacherFormModal.role || 'Guru Mata Pelajaran'}
                    onChange={(e) => setTeacherFormModal({ ...teacherFormModal, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Contoh: Wali Kelas VII-A / Guru BK"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md"
                >
                  Simpan Data Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BATCH IMPORT STUDENTS                                              */}
      {/* ========================================================================= */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Impor Banyak Siswa Sekaligus (Excel / Word)
              </h3>
              <button onClick={() => setIsBatchModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Rombel Kelas</label>
                <select
                  value={batchClassId}
                  onChange={(e) => setBatchClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {rosters.map((r) => (
                    <option key={r.classId} value={r.classId}>
                      Kelas {r.classLabel} ({r.students.length} siswa saat ini)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-slate-600 font-medium">
                  Tempelkan (paste) daftar baris nama siswa dari Excel/Word:
                </p>
                <button
                  type="button"
                  onClick={handleDownloadStudentTemplate}
                  className="text-blue-600 hover:underline font-bold flex items-center gap-1 text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  Unduh Contoh CSV
                </button>
              </div>

              <textarea
                value={batchRawText}
                onChange={(e) => setBatchRawText(e.target.value)}
                rows={9}
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder={`Contoh Format (Tiap baris 1 siswa):\nACHMAD FAUZI, L, 242501, 0112345601\nADINDA PUTRI MAHESHWARI, P, 242502, 0112345602\nAHMAD ZAKI MUBAROK, L, 242503, 0112345603`}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 font-medium">
                Sistem akan membuat NIS & NISN otomatis jika belum diisi.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={handleBatchImport}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md"
                >
                  Proses Impor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CLASS MODAL                                                       */}
      {/* ========================================================================= */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingClass ? 'Edit Nama Kelas' : 'Buat Kelas Rombel Baru'}
              </h3>
              <button onClick={() => setIsClassModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Label Kelas (Contoh: VII-C)</label>
                <input
                  type="text"
                  value={classForm.classLabel}
                  onChange={(e) => setClassForm({ ...classForm, classLabel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Grade</label>
                  <select
                    value={classForm.grade}
                    onChange={(e) => setClassForm({ ...classForm, grade: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value={7}>Kelas 7 (VII)</option>
                    <option value={8}>Kelas 8 (VIII)</option>
                    <option value={9}>Kelas 9 (IX)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Paralel</label>
                  <input
                    type="text"
                    value={classForm.parallel}
                    onChange={(e) => setClassForm({ ...classForm, parallel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold uppercase"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md">
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSIGNMENT MODAL                                                  */}
      {/* ========================================================================= */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Penugasan Mengajar</h3>
              <button onClick={() => setIsAssignmentModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Guru Pengampu</label>
                <select
                  value={assignmentForm.teacherId}
                  onChange={(e) => {
                    const selectedT = teachers.find((t) => t.id === e.target.value);
                    setAssignmentForm({
                      ...assignmentForm,
                      teacherId: e.target.value,
                      subject: selectedT?.subject || assignmentForm.subject,
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Rombel Kelas</label>
                <select
                  value={assignmentForm.classId}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                >
                  {rosters.map((r) => (
                    <option key={r.classId} value={r.classId}>
                      Kelas {r.classLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={assignmentForm.subject}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Beban JP per Minggu</label>
                <input
                  type="number"
                  value={assignmentForm.totalJpPerWeek}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, totalJpPerWeek: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  min={1}
                  max={20}
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignmentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-md">
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
