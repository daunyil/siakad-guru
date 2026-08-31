import React, { useState, useMemo } from 'react';
import type { SchoolProfile, TeacherProfile, TeachingAssignment, ClassRoster } from '../../types';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageSquare,
  Users,
  User,
  Phone,
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export interface AbsentStudentInfo {
  id?: string;
  studentId: string;
  name: string;
  nisn?: string;
  number: number;
  status: 'sick' | 'excused' | 'absent' | 'late';
  date?: string;
  reason?: string;
}

interface WhatsAppAbsentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolProfile;
  teacher: TeacherProfile;
  assignment: TeachingAssignment;
  roster: ClassRoster;
  absentStudents: AbsentStudentInfo[];
  attendanceStats: {
    present: number;
    sick: number;
    excused: number;
    absent: number;
    late?: number;
    total: number;
  };
  customDate?: string;
  subjectTitle?: string;
}

export const WhatsAppAbsentReportModal: React.FC<WhatsAppAbsentReportModalProps> = ({
  isOpen,
  onClose,
  school,
  teacher,
  assignment,
  roster,
  absentStudents,
  attendanceStats,
  customDate,
  subjectTitle,
}) => {
  // Target destination: 'group' (Grup WA Kelas/Wali Murid) or 'homeroom_teacher' (Japri Wali Kelas)
  const [targetType, setTargetType] = useState<'group' | 'homeroom_teacher'>('group');
  
  // Custom Homeroom Teacher details (can be edited by user)
  const defaultHomeroom = useMemo(() => {
    if (assignment.classLabel.includes('7-A') || assignment.classLabel.includes('VII-A')) {
      return { name: 'TRI WAHYUNI, S.Pd.', phone: '' };
    }
    if (assignment.classLabel.includes('7-B') || assignment.classLabel.includes('VII-B')) {
      return { name: 'DRA. SITI RAHMAH, M.Pd.', phone: '' };
    }
    return { name: `Wali Kelas ${assignment.classLabel}`, phone: '' };
  }, [assignment.classLabel]);

  const [homeroomName, setHomeroomName] = useState<string>(defaultHomeroom.name);
  const [homeroomPhone, setHomeroomPhone] = useState<string>(defaultHomeroom.phone);
  const [customNote, setCustomNote] = useState<string>('');
  const [includeNisn, setIncludeNisn] = useState<boolean>(true);
  const [includeSubject, setIncludeSubject] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Formatted date
  const displayDate = useMemo(() => {
    const d = customDate ? new Date(customDate) : new Date();
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [customDate]);

  // Generate formatted WhatsApp message text
  const messageText = useMemo(() => {
    const lines: string[] = [];

    // Header
    lines.push(`*📌 LAPORAN PRESENSI KELAS ${assignment.classLabel.toUpperCase()}*`);
    lines.push(`🏛️ *${school.name || 'SMP NEGERI'}*`);
    lines.push(`📅 *Hari / Tanggal*: ${displayDate}`);
    if (includeSubject) {
      lines.push(`📚 *Mata Pelajaran*: ${subjectTitle || assignment.subject}`);
      lines.push(`👨‍🏫 *Guru Pengajar*: ${teacher.name}`);
    }
    if (targetType === 'homeroom_teacher' && homeroomName) {
      lines.push(`👤 *Yth. Wali Kelas*: ${homeroomName}`);
    } else {
      lines.push(`👥 *Tujuan*: Grup WhatsApp Kelas ${assignment.classLabel}`);
    }
    lines.push('');

    // Rekapitulasi Angka
    lines.push(`📊 *REKAPITULASI KEHADIRAN:*`);
    lines.push(`• Total Siswa : ${attendanceStats.total} Siswa`);
    lines.push(`• ✅ Hadir    : ${attendanceStats.present} Siswa`);
    lines.push(`• 🤒 Sakit (S): ${attendanceStats.sick} Siswa`);
    lines.push(`• 📝 Izin (I) : ${attendanceStats.excused} Siswa`);
    lines.push(`• ❌ Alpa (A) : ${attendanceStats.absent} Siswa`);
    if ((attendanceStats.late || 0) > 0) {
      lines.push(`• ⏰ Terlambat: ${attendanceStats.late} Siswa`);
    }
    lines.push('');

    // Detail Siswa Tidak Hadir
    lines.push(`📋 *RINCIAN SISWA TIDAK HADIR / BERHALANGAN:*`);
    if (absentStudents.length === 0) {
      lines.push(`_Alhamdulillah, seluruh siswa hadir lengkap (100% Kehadiran)._ 🎉`);
    } else {
      absentStudents.forEach((st, idx) => {
        const statusLabel =
          st.status === 'sick'
            ? '🤒 Sakit'
            : st.status === 'excused'
            ? '📝 Izin'
            : st.status === 'late'
            ? '⏰ Terlambat'
            : '❌ Alpa (Tanpa Keterangan)';
        const noAbsen = st.number ? `No. ${st.number}` : '';
        const nisnInfo = includeNisn && st.nisn ? ` (NISN: ${st.nisn})` : '';
        const reasonText = st.reason ? ` - Ket: ${st.reason}` : '';
        lines.push(`${idx + 1}. *${st.name}* [${noAbsen}]${nisnInfo}`);
        lines.push(`   └ Status: ${statusLabel}${reasonText}`);
      });
    }
    lines.push('');

    // Catatan Khusus
    if (customNote.trim()) {
      lines.push(`💬 *CATATAN GURU:*`);
      lines.push(`_${customNote.trim()}_`);
      lines.push('');
    }

    // Penutup
    lines.push(`Demikian laporan kehadiran ini disampaikan untuk menjadi perhatian dan koordinasi bersama. Terima kasih atas kerja sama Bapak/Ibu sekalian. 🙏✨`);

    return lines.join('\n');
  }, [
    assignment,
    school,
    teacher,
    displayDate,
    includeSubject,
    subjectTitle,
    targetType,
    homeroomName,
    attendanceStats,
    absentStudents,
    includeNisn,
    customNote,
  ]);

  if (!isOpen) return null;

  // Copy to clipboard handler
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = messageText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Open WhatsApp Link
  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    let url = `https://api.whatsapp.com/send?text=${encoded}`;

    if (targetType === 'homeroom_teacher' && homeroomPhone.trim()) {
      // Clean phone number: replace leading 0 with 62
      let cleanPhone = homeroomPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '62' + cleanPhone.slice(1);
      }
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    }

    // Open WhatsApp in new tab/app
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Fallback using direct anchor click
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Laporan WhatsApp Siswa Tidak Hadir
                </h2>
                <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-extrabold uppercase">
                  Kelas {assignment.classLabel}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90">
                Kirim format laporan presensi resmi secara instan ke Grup WhatsApp Kelas atau Wali Kelas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Target Selection & Customization Options */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                Pilih Target Penerima Laporan:
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {displayDate}
              </span>
            </div>

            {/* Target Options Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTargetType('group')}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  targetType === 'group'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${targetType === 'group' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs">Grup WhatsApp Kelas</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Buka WhatsApp untuk memilih grup kelas atau grup paguyuban wali murid.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('homeroom_teacher')}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  targetType === 'homeroom_teacher'
                    ? 'bg-teal-50 border-teal-500 text-teal-950 ring-2 ring-teal-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${targetType === 'homeroom_teacher' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs">Japri Pribadi Wali Kelas</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Kirim langsung ke kontak pribadi Wali Kelas {assignment.classLabel}.
                  </div>
                </div>
              </button>
            </div>

            {/* If homeroom teacher option chosen, allow inputting phone number */}
            {targetType === 'homeroom_teacher' && (
              <div className="p-3 bg-white rounded-xl border border-teal-200 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Wali Kelas:
                  </label>
                  <input
                    type="text"
                    value={homeroomName}
                    onChange={(e) => setHomeroomName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    placeholder="Nama Wali Kelas..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Wali Kelas (Opsional):
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="tel"
                      value={homeroomPhone}
                      onChange={(e) => setHomeroomPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Custom note & switches */}
            <div className="space-y-2 pt-1 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  Tambahkan Pesan / Instruksi Tambahan (Opsional):
                </label>
                <div className="flex items-center gap-3 text-[11px]">
                  <label className="flex items-center gap-1 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={includeNisn}
                      onChange={(e) => setIncludeNisn(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Sertakan NISN</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={includeSubject}
                      onChange={(e) => setIncludeSubject(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Sertakan Mapel & Guru</span>
                  </label>
                </div>
              </div>

              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Contoh: Mohon surat izin/sakit diserahkan ke ruang guru saat masuk sekolah."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* WhatsApp Message Preview Box (Styled as WhatsApp chat bubble) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Pratinjau Teks Pesan WhatsApp:
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Format Pesan</span>
                  </>
                )}
              </button>
            </div>

            {/* WA Box Bubble */}
            <div className="bg-[#EFEAE2] p-3 sm:p-4 rounded-2xl border border-slate-300 shadow-inner font-sans text-xs text-slate-900 relative overflow-hidden">
              <div className="bg-white p-4 rounded-xl rounded-tl-xs shadow-xs border border-slate-200 max-w-full space-y-2 text-slate-800 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                {messageText}
              </div>
              <div className="mt-2 text-[10px] text-slate-500 text-right flex items-center justify-end gap-1">
                <span>Format pesan WhatsApp otomatis</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3.5 px-5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Teks Tersalin' : 'Salin Pesan'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim ke WhatsApp Sekarang</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
