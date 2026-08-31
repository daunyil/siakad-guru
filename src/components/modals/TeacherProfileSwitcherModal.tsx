import React, { useState } from 'react';
import type { TeacherProfile, TeachingAssignment, ClassRoster } from '../../types';
import {
  User,
  Users,
  UserPlus,
  Edit3,
  Check,
  X,
  Sparkles,
  BookOpen,
  Building2,
  CheckCircle2,
  Briefcase,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface TeacherProfileSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTeacher: TeacherProfile;
  teachers: TeacherProfile[];
  onSelectTeacher: (teacher: TeacherProfile) => void;
  onUpdateTeacher: (updated: TeacherProfile) => void;
  onAddTeacher: (newTeacher: TeacherProfile, assignedClassIds: string[]) => void;
  assignments: TeachingAssignment[];
  rosters: ClassRoster[];
}

export const TeacherProfileSwitcherModal: React.FC<TeacherProfileSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentTeacher,
  teachers,
  onSelectTeacher,
  onUpdateTeacher,
  onAddTeacher,
  assignments,
  rosters,
}) => {
  const [activeTab, setActiveTab] = useState<'pilih' | 'edit' | 'tambah'>('pilih');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick edit form state
  const [editForm, setEditForm] = useState<TeacherProfile>({ ...currentTeacher });

  // Add new teacher form state
  const [addForm, setAddForm] = useState({
    name: '',
    nip: '',
    nuptk: '',
    subject: 'Bahasa Indonesia',
    status: 'PNS' as 'PNS' | 'PPPK' | 'GTT/Honorer' | 'Yayasan',
    rank: 'Penata Muda / III/a',
    role: 'Guru Mata Pelajaran',
    selectedClasses: ['cls-7a'] as string[],
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.includes(searchQuery)
  );

  const handleSelect = (t: TeacherProfile) => {
    onSelectTeacher(t);
    showToast(`Berhasil beralih ke profil: ${t.name}`);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;
    onUpdateTeacher(editForm);
    showToast(`Data profil ${editForm.name} berhasil diperbarui!`);
    setTimeout(() => {
      setActiveTab('pilih');
    }, 400);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.subject.trim()) return;

    const newId = `teacher-${Date.now()}`;
    const newTeacher: TeacherProfile = {
      id: newId,
      name: addForm.name.toUpperCase(),
      nip: addForm.nip || '-',
      nuptk: addForm.nuptk || '-',
      rank: addForm.rank,
      subject: addForm.subject,
      role: addForm.role,
      status: addForm.status,
    };

    onAddTeacher(newTeacher, addForm.selectedClasses);
    onSelectTeacher(newTeacher);
    showToast(`Guru baru "${newTeacher.name}" berhasil ditambahkan & diaktifkan!`);

    // Reset form
    setAddForm({
      name: '',
      nip: '',
      nuptk: '',
      subject: 'Bahasa Indonesia',
      status: 'PNS',
      rank: 'Penata Muda / III/a',
      role: 'Guru Mata Pelajaran',
      selectedClasses: ['cls-7a'],
    });

    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 flex items-center justify-between gap-2 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white text-sm">
              ✕
            </button>
          </div>
        )}

        {/* ── HEADER ── */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Pilih & Ganti Guru Pengajar</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                  Multi-Guru
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Beralih akun pengajar, ubah mapel, atau daftarkan guru baru dengan mudah.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── TABS ── */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 shrink-0 gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('pilih')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pilih'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Daftar Guru ({teachers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditForm({ ...currentTeacher });
                setActiveTab('edit');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Guru Aktif</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tambah')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tambah'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Tambah Guru Baru</span>
            </button>
          </div>
        </div>

        {/* ── BODY CONTENT ── */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: PILIH GURU */}
          {activeTab === 'pilih' && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama guru, mata pelajaran, atau NIP..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Current Active Banner */}
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {currentTeacher.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">
                        Profil Sedang Aktif:
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 truncate">{currentTeacher.name}</div>
                    <div className="text-xs text-slate-600 truncate">
                      Mapel: <strong className="text-blue-700">{currentTeacher.subject}</strong> · NIP: {currentTeacher.nip}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditForm({ ...currentTeacher });
                    setActiveTab('edit');
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Teachers List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 flex items-center justify-between px-1">
                  <span>Daftar Guru Terdaftar:</span>
                  <span>Klik untuk beralih profil</span>
                </div>

                {filteredTeachers.map((t) => {
                  const isActive = t.id === currentTeacher.id;
                  const teacherAssignments = assignments.filter((a) => a.teacherId === t.id);

                  return (
                    <div
                      key={t.id}
                      onClick={() => !isActive && handleSelect(t)}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/80 cursor-pointer shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 border ${
                            isActive
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {t.name.charAt(0)}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900">{t.name}</span>
                            {isActive && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-black flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>Aktif</span>
                              </span>
                            )}
                            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold">
                              {t.status}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                            <span>
                              Mata Pelajaran: <strong className="text-blue-700">{t.subject}</strong>
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-slate-500">NIP: {t.nip}</span>
                          </div>

                          {teacherAssignments.length > 0 && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 flex-wrap pt-0.5">
                              <span>Mengajar di:</span>
                              {teacherAssignments.map((asg) => (
                                <span
                                  key={asg.id}
                                  className="px-1.5 py-0.2 bg-slate-100 text-slate-700 border border-slate-200 rounded font-semibold text-[10px]"
                                >
                                  Kelas {asg.classLabel}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center justify-end">
                        {isActive ? (
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Sedang Digunakan</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(t);
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Gunakan Profil Ini</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: EDIT GURU AKTIF */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Ubah Identitas Guru:</strong> Anda dapat mengganti nama guru & mata
                  pelajaran ini ke nama asli Anda. Seluruh berkas administrasi dan lembar cetak otomatis menyesuaikan.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap & Gelar Guru <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Contoh: DRA. SITI RAHMAH, M.Pd."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mata Pelajaran Utama <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.subject}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    placeholder="Contoh: Matematika, Bahasa Indonesia, IPA"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    value={editForm.nip}
                    onChange={(e) => setEditForm({ ...editForm, nip: e.target.value })}
                    placeholder="Contoh: 19750820 200212 2 003"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    value={editForm.nuptk || ''}
                    onChange={(e) => setEditForm({ ...editForm, nuptk: e.target.value })}
                    placeholder="16 digit NUPTK"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pangkat / Golongan Ruang</label>
                  <input
                    type="text"
                    value={editForm.rank || ''}
                    onChange={(e) => setEditForm({ ...editForm, rank: e.target.value })}
                    placeholder="Contoh: Penata Tk. I / III/d"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Kepegawaian</label>
                  <select
                    value={editForm.status || 'PNS'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK</option>
                    <option value="GTT/Honorer">GTT / Guru Honorer</option>
                    <option value="Yayasan">Guru Tetap Yayasan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tugas Tambahan / Peran</label>
                  <input
                    type="text"
                    value={editForm.role || ''}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    placeholder="Contoh: Guru Mata Pelajaran / Wali Kelas VII-A"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('pilih')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: TAMBAH GURU BARU */}
          {activeTab === 'tambah' && (
            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2">
                <UserPlus className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Tambah Profil Guru Baru:</strong> Masukkan data rekan guru untuk
                  mengelola presensi, rekap nilai, dan administrasi KBM guru tersebut secara mandiri di aplikasi ini.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap & Gelar Guru <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="Contoh: BUDI SANTOSO, S.Pd., M.Kom."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mata Pelajaran Yang Diampu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.subject}
                    onChange={(e) => setAddForm({ ...addForm, subject: e.target.value })}
                    placeholder="Contoh: Bahasa Inggris, PJOK, IPA"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    value={addForm.nip}
                    onChange={(e) => setAddForm({ ...addForm, nip: e.target.value })}
                    placeholder="18 digit NIP"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Kepegawaian</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="GTT/Honorer">GTT / Honorer</option>
                    <option value="Yayasan">Guru Yayasan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    value={addForm.rank}
                    onChange={(e) => setAddForm({ ...addForm, rank: e.target.value })}
                    placeholder="Contoh: Penata Muda / III/a"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Kelas Yang Diajar Guru Ini:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {rosters.map((r) => {
                      const isChecked = addForm.selectedClasses.includes(r.classId);
                      return (
                        <button
                          key={r.classId}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setAddForm({
                                ...addForm,
                                selectedClasses: addForm.selectedClasses.filter((id) => id !== r.classId),
                              });
                            } else {
                              setAddForm({
                                ...addForm,
                                selectedClasses: [...addForm.selectedClasses, r.classId],
                              });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isChecked
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                          <span>Kelas {r.classLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('pilih')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan & Aktifkan Guru</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Data guru tersimpan aman di aplikasi ini</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
