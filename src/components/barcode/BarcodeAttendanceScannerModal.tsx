import React, { useState, useEffect, useRef } from 'react';
import type { ClassRoster, AttendanceRecord, TeachingAssignment, Student, SchoolProfile } from '../../types';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Scan,
  Camera,
  Keyboard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Users,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Printer,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface BarcodeAttendanceScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  rosters: ClassRoster[];
  currentAssignment: TeachingAssignment;
  school: SchoolProfile;
  attendanceRecords: AttendanceRecord[];
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
  onOpenCardGenerator?: () => void;
}

interface ScanLogItem {
  id: string;
  studentName: string;
  studentNisn: string;
  studentNis: string;
  classLabel: string;
  scannedAt: string;
  status: 'present' | 'late';
  lateMinutes?: number;
}

export const BarcodeAttendanceScannerModal: React.FC<BarcodeAttendanceScannerModalProps> = ({
  isOpen,
  onClose,
  rosters,
  currentAssignment,
  school,
  attendanceRecords,
  onUpdateAttendance,
  onOpenCardGenerator,
}) => {
  // Mode selection: 'kbm' (class teaching session) or 'gate' (piket gerbang pagi)
  const [scanMode, setScanMode] = useState<'kbm' | 'gate'>('kbm');
  const [selectedClassId, setSelectedClassId] = useState<string>(currentAssignment.classId || rosters[0]?.classId || 'cls-7a');
  
  // Gate cutoff time (HH:mm)
  const [gateCutoffTime, setGateCutoffTime] = useState<string>('07:15');

  // Input method: 'camera' | 'usb_gun'
  const [inputMethod, setInputMethod] = useState<'camera' | 'usb_gun'>('camera');
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
  
  // Camera scanning state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const manualInputRef = useRef<HTMLInputElement | null>(null);

  // Audio feedback setting
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Today's ISO Date
  const todayISO = new Date().toISOString().split('T')[0];

  // Scan history logs during current session
  const [scanLogs, setScanLogs] = useState<ScanLogItem[]>([]);
  const [lastScannedStudent, setLastScannedStudent] = useState<{
    student: Student;
    classLabel: string;
    status: 'present' | 'late';
    timeStr: string;
    lateMinutes: number;
    message: string;
  } | null>(null);

  // Real-time clock display
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio API Beep Generator
  const playBeep = (type: 'success' | 'warning' | 'error') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6 note
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === 'warning') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(550, ctx.currentTime);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Find all students across rosters for barcode lookup
  const allStudentsMap = React.useMemo(() => {
    const map = new Map<string, { student: Student; classLabel: string; classId: string }>();
    rosters.forEach((roster) => {
      roster.students.forEach((s) => {
        // Map by NISN, NIS, ID, and raw formatted string
        if (s.nisn) map.set(s.nisn.trim().toLowerCase(), { student: s, classLabel: roster.classLabel, classId: roster.classId });
        if (s.nis) map.set(s.nis.trim().toLowerCase(), { student: s, classLabel: roster.classLabel, classId: roster.classId });
        if (s.id) map.set(s.id.trim().toLowerCase(), { student: s, classLabel: roster.classLabel, classId: roster.classId });
      });
    });
    return map;
  }, [rosters]);

  // Current active roster for class mode
  const activeClassRoster = React.useMemo(() => {
    return rosters.find((r) => r.classId === selectedClassId) || rosters[0];
  }, [rosters, selectedClassId]);

  // Present students in active class today
  const presentStudentIdsInActiveClass = React.useMemo(() => {
    const set = new Set<string>();
    attendanceRecords
      .filter((r) => r.classId === selectedClassId && r.date === todayISO && (r.status === 'present' || r.status === 'late'))
      .forEach((r) => set.add(r.studentId));
    return set;
  }, [attendanceRecords, selectedClassId, todayISO]);

  // Total attended count vs total roster
  const activeClassStats = React.useMemo(() => {
    const total = activeClassRoster?.students?.length || 0;
    const attended = presentStudentIdsInActiveClass.size;
    const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
    return { total, attended, unrecorded: Math.max(0, total - attended), pct };
  }, [activeClassRoster, presentStudentIdsInActiveClass]);

  // Core Barcode Scanning Process Logic
  const handleProcessBarcode = (scannedRawText: string) => {
    if (!scannedRawText || !scannedRawText.trim()) return;
    const rawClean = scannedRawText.trim().toLowerCase();

    // Check if code matches any student (by NISN, NIS, or ID)
    const match = allStudentsMap.get(rawClean);

    if (!match) {
      playBeep('error');
      setLastScannedStudent({
        student: { id: 'unknown', name: `Kode Barcode: ${scannedRawText}`, nis: '-', nisn: scannedRawText, number: 0, gender: 'L' },
        classLabel: 'Tidak Dikenal',
        status: 'late',
        timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        lateMinutes: 0,
        message: '⚠️ Kode barcode / NISN tidak terdaftar di database siswa.',
      });
      return;
    }

    const { student, classLabel, classId } = match;

    // Check if in KBM mode and scanned student is from a different class
    if (scanMode === 'kbm' && classId !== selectedClassId) {
      playBeep('warning');
      setLastScannedStudent({
        student,
        classLabel,
        status: 'late',
        timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        lateMinutes: 0,
        message: `ℹ️ Siswa ini terdaftar di Kelas ${classLabel} (bukan kelas ${activeClassRoster?.classLabel} yang dipilih). Tetap dicatat!`,
      });
    }

    // Determine status (present vs late)
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeInMin = currentHour * 60 + currentMin;

    const [cutHourStr, cutMinStr] = gateCutoffTime.split(':');
    const cutHour = parseInt(cutHourStr, 10) || 7;
    const cutMin = parseInt(cutMinStr, 10) || 15;
    const cutoffTimeInMin = cutHour * 60 + cutMin;

    let finalStatus: 'present' | 'late' = 'present';
    let lateMinutes = 0;

    if (scanMode === 'gate' && currentTimeInMin > cutoffTimeInMin) {
      finalStatus = 'late';
      lateMinutes = currentTimeInMin - cutoffTimeInMin;
    }

    // Update Attendance Records
    const targetClassId = classId || selectedClassId;
    const updatedRecords = attendanceRecords.filter(
      (r) => !(r.studentId === student.id && r.date === todayISO && r.classId === targetClassId)
    );

    updatedRecords.push({
      id: `att-scan-${Date.now()}-${student.id}`,
      studentId: student.id,
      classId: targetClassId,
      date: todayISO,
      status: finalStatus,
    });

    onUpdateAttendance(updatedRecords);

    // Audio beep
    playBeep(finalStatus === 'late' ? 'warning' : 'success');

    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Update scan log
    const newLogItem: ScanLogItem = {
      id: `log-${Date.now()}`,
      studentName: student.name,
      studentNisn: student.nisn || student.nis || '-',
      studentNis: student.nis || '-',
      classLabel: classLabel,
      scannedAt: timeStr,
      status: finalStatus,
      lateMinutes: lateMinutes > 0 ? lateMinutes : undefined,
    };

    setScanLogs((prev) => [newLogItem, ...prev.slice(0, 49)]); // Keep last 50 logs

    setLastScannedStudent({
      student,
      classLabel,
      status: finalStatus,
      timeStr,
      lateMinutes,
      message:
        finalStatus === 'late'
          ? `⚠️ Terlambat ${lateMinutes} Menit (Lewat batas ${gateCutoffTime} WIB)`
          : `✅ Presensi Berhasil: Hadir Tepat Waktu`,
    });
  };

  // Setup / Teardown Camera Scanner
  useEffect(() => {
    if (!isOpen) {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
      setIsCameraActive(false);
      return;
    }

    // Get available cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setAvailableCameras(devices);
          // Prefer back camera if available (facing environment)
          const backCam = devices.find((d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('belakang'));
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        }
      })
      .catch((err) => {
        console.warn('Camera enumeration error:', err);
      });
  }, [isOpen]);

  // Start / Stop Scanner when camera selection or input method changes
  useEffect(() => {
    if (!isOpen || inputMethod !== 'camera') {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
        setIsCameraActive(false);
      }
      return;
    }

    const scannerElementId = 'qr-camera-reader-viewport';
    const scannerEl = document.getElementById(scannerElementId);
    if (!scannerEl) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }

      const html5QrCode = new Html5Qrcode(scannerElementId);
      scannerRef.current = html5QrCode;

      const cameraIdToUse = selectedCameraId || { facingMode: 'environment' };

      html5QrCode
        .start(
          cameraIdToUse,
          {
            fps: 15,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Debounce scan calls
            handleProcessBarcode(decodedText);
          },
          () => {
            // Ignore frame parse misses
          }
        )
        .then(() => {
          setIsCameraActive(true);
          setCameraError(null);
        })
        .catch((err) => {
          console.error('Camera start failure:', err);
          setCameraError('Gagal mengakses kamera. Pastikan izin kamera telah diberikan atau gunakan scanner USB.');
          setIsCameraActive(false);
        });
    }, 200);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [isOpen, inputMethod, selectedCameraId]);

  // Focus manual input on USB mode
  useEffect(() => {
    if (isOpen && inputMethod === 'usb_gun') {
      setTimeout(() => {
        manualInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, inputMethod]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* ── HEADER MODAL ── */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-md">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base md:text-lg text-white leading-tight">
                  Scanner Barcode & QR Presensi
                </h2>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-400/20">
                  Kartu Siswa
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pindai kartu pelajar siswa menggunakan kamera HP/Laptop atau alat pemindai barcode USB.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-blue-600/30 border-blue-400/40 text-blue-300 hover:bg-blue-600/50'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={soundEnabled ? 'Suara Beep Aktif' : 'Suara Beep Mati'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Beep ON' : 'Beep Mute'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── TOP CONTROLS & MODE SELECTOR ── */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setScanMode('kbm')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                scanMode === 'kbm'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Presensi Jam KBM Kelas</span>
            </button>

            <button
              onClick={() => setScanMode('gate')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                scanMode === 'gate'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Presensi Gerbang Piket Pagi</span>
            </button>
          </div>

          {/* Conditional Controls per Mode */}
          <div className="flex items-center gap-2">
            {scanMode === 'kbm' ? (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">Kelas Aktif:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 font-bold rounded-xl px-2.5 py-1 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {rosters.map((r) => (
                    <option key={r.classId} value={r.classId}>
                      Kelas {r.classLabel} ({r.students.length} Siswa)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-xl font-medium text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Jam Sekarang:</span>
                  <strong className="text-slate-900 font-bold">{currentTimeStr}</strong>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-bold">Batas Terlambat:</span>
                  <input
                    type="time"
                    value={gateCutoffTime}
                    onChange={(e) => setGateCutoffTime(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 font-extrabold rounded-xl px-2 py-0.5 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Input Device Switcher */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setInputMethod('camera')}
                className={`p-1.5 px-2 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  inputMethod === 'camera'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Gunakan Kamera HP / Laptop"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Kamera Live</span>
              </button>

              <button
                onClick={() => setInputMethod('usb_gun')}
                className={`p-1.5 px-2 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  inputMethod === 'usb_gun'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Gunakan Alat Scanner Barcode USB / Input NISN"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Scanner Barcode Gun / Ketik</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN BODY (SCANNER + FEEDBACK & LOGS) ── */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT: SCANNER VIEWPORT (7 COLS) */}
          <div className="lg:col-span-6 flex flex-col space-y-3">
            {/* Input Method View */}
            {inputMethod === 'camera' ? (
              <div className="bg-slate-950 rounded-3xl p-3 text-white border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-inner min-h-[310px]">
                {/* Viewport for Html5Qrcode */}
                <div id="qr-camera-reader-viewport" className="w-full max-w-[320px] rounded-2xl overflow-hidden shadow-xl border border-slate-800 bg-black" />

                {cameraError && (
                  <div className="p-4 text-center max-w-sm space-y-2">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-xs text-amber-200">{cameraError}</p>
                    <button
                      onClick={() => setInputMethod('usb_gun')}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500"
                    >
                      Beralih ke Input Barcode Gun / Manual
                    </button>
                  </div>
                )}

                {/* Camera selector if multiple cameras available */}
                {availableCameras.length > 1 && (
                  <div className="mt-3 w-full flex items-center justify-between text-[11px] px-2 text-slate-400">
                    <span>Pilih Kamera:</span>
                    <select
                      value={selectedCameraId}
                      onChange={(e) => setSelectedCameraId(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs"
                    >
                      {availableCameras.map((cam) => (
                        <option key={cam.id} value={cam.id}>
                          {cam.label || `Kamera ${cam.id.slice(0, 5)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 text-center mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>Arahkan Barcode atau QR Code Kartu Siswa ke kotak pemindaian di atas</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 flex flex-col justify-center space-y-4 shadow-inner min-h-[310px]">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center mx-auto mb-2">
                    <Scan className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="font-extrabold text-base text-white">
                    Mode Barcode Laser Gun / Manual NISN
                  </h3>
                  <p className="text-xs text-slate-400">
                    Arahkan tembakan laser scanner barcode USB ke kartu pelajar siswa, atau ketik NISN lalu tekan Enter.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (manualCodeInput) {
                      handleProcessBarcode(manualCodeInput);
                      setManualCodeInput('');
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <input
                      ref={manualInputRef}
                      type="text"
                      value={manualCodeInput}
                      onChange={(e) => setManualCodeInput(e.target.value)}
                      placeholder="Scan Barcode atau Ketik NISN / NIS..."
                      className="w-full bg-slate-950 border-2 border-blue-500 text-white font-mono text-center text-lg py-3 px-4 rounded-2xl focus:outline-hidden focus:ring-4 focus:ring-blue-500/30 shadow-lg tracking-wider placeholder:text-slate-600 placeholder:text-sm placeholder:font-sans"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Catat Kehadiran Siswa (Enter)</span>
                  </button>
                </form>

                <div className="text-[11px] text-slate-400 text-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  💡 Scanner barcode USB akan otomatis menekan tombol <strong>Enter</strong> setelah memindai kartu pelajar siswa.
                </div>
              </div>
            )}

            {/* Quick Stats Banner */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">
                    {scanMode === 'kbm' ? `Kelas ${activeClassRoster?.classLabel}` : 'Seluruh Siswa Sekolah'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {scanMode === 'kbm'
                      ? `${activeClassStats.attended} Hadir dari ${activeClassStats.total} Siswa (${activeClassStats.pct}%)`
                      : `${scanLogs.length} Siswa Terpindai Hari Ini`}
                  </div>
                </div>
              </div>

              {onOpenCardGenerator && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCardGenerator();
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cetak Kartu Siswa</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: LAST SCANNED FEEDBACK & REALTIME LOGS (6 COLS) */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {/* LAST SCANNED FEEDBACK POPUP CARD */}
            {lastScannedStudent ? (
              <div
                className={`rounded-3xl p-4 border-2 shadow-md transition-all animate-in zoom-in-95 duration-150 ${
                  lastScannedStudent.status === 'late'
                    ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                    : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-white text-base shadow-md shrink-0 ${
                        lastScannedStudent.status === 'late' ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}
                    >
                      {lastScannedStudent.student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            lastScannedStudent.status === 'late'
                              ? 'bg-rose-200 text-rose-800'
                              : 'bg-emerald-200 text-emerald-800'
                          }`}
                        >
                          {lastScannedStudent.status === 'late' ? 'Terlambat' : 'Hadir Tepat Waktu'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {lastScannedStudent.timeStr}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-900 leading-tight mt-0.5">
                        {lastScannedStudent.student.name}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        Kelas <strong>{lastScannedStudent.classLabel}</strong> · NISN: {lastScannedStudent.student.nisn || lastScannedStudent.student.nis}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {lastScannedStudent.status === 'late' ? (
                      <AlertTriangle className="w-6 h-6 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    )}
                  </div>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 text-xs font-semibold flex items-center justify-between">
                  <span>{lastScannedStudent.message}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-3xl p-6 border border-dashed border-slate-300 text-center flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Scan className="w-8 h-8 text-slate-300 animate-pulse" />
                <p className="text-xs font-semibold">
                  Belum ada siswa yang dipindai sesi ini.
                </p>
                <p className="text-[11px] text-slate-400">
                  Hasil scan kartu pelajar akan langsung muncul di sini secara real-time.
                </p>
              </div>
            )}

            {/* REAL-TIME SESSION SCAN LOGS */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex-1 flex flex-col min-h-[220px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                    Riwayat Pemindaian Sesi Ini ({scanLogs.length})
                  </h4>
                </div>
                {scanLogs.length > 0 && (
                  <button
                    onClick={() => setScanLogs([])}
                    className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold"
                  >
                    Bersihkan Log
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 max-h-56 pr-1">
                {scanLogs.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Riwayat scan akan tercatat otomatis di bawah ini.
                  </div>
                ) : (
                  scanLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            log.status === 'late' ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                        />
                        <div className="truncate">
                          <div className="font-bold text-slate-800 truncate">{log.studentName}</div>
                          <div className="text-[10px] text-slate-500 truncate">
                            Kelas {log.classLabel} · NISN: {log.studentNisn}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            log.status === 'late'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {log.status === 'late' ? `Terlambat (${log.lateMinutes}m)` : 'Hadir'}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.scannedAt}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER MODAL ── */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Data presensi otomatis tersimpan ke Jurnal KBM & Buku Rekapitulasi Sekolah.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Selesai & Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
