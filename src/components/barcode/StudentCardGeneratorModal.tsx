import React, { useState, useEffect } from 'react';
import type { ClassRoster, SchoolProfile, Student } from '../../types';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import {
  CreditCard,
  Printer,
  X,
  Search,
  Users,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface StudentCardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  rosters: ClassRoster[];
  school: SchoolProfile;
  initialClassId?: string;
}

interface StudentWithCode extends Student {
  classLabel: string;
  qrDataUrl: string;
  barcodeSvgId: string;
}

export const StudentCardGeneratorModal: React.FC<StudentCardGeneratorModalProps> = ({
  isOpen,
  onClose,
  rosters,
  school,
  initialClassId,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cardTheme, setCardTheme] = useState<'blue' | 'emerald' | 'purple' | 'slate'>('blue');
  const [studentsWithCodes, setStudentsWithCodes] = useState<StudentWithCode[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  // Filter students based on class & search
  const filteredStudents = React.useMemo(() => {
    let list: Array<{ student: Student; classLabel: string }> = [];
    rosters.forEach((roster) => {
      if (selectedClassId === 'all' || roster.classId === selectedClassId) {
        roster.students.forEach((s) => {
          list.push({ student: s, classLabel: roster.classLabel });
        });
      }
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.student.name.toLowerCase().includes(q) ||
          item.student.nisn.toLowerCase().includes(q) ||
          item.student.nis.toLowerCase().includes(q) ||
          item.classLabel.toLowerCase().includes(q)
      );
    }

    return list;
  }, [rosters, selectedClassId, searchQuery]);

  // Generate QR Code data URLs for each student
  useEffect(() => {
    if (!isOpen) return;
    setIsGenerating(true);

    let isMounted = true;
    const generateCodes = async () => {
      const results: StudentWithCode[] = [];

      for (const item of filteredStudents) {
        const studentCode = item.student.nisn || item.student.nis || item.student.id;
        let qrDataUrl = '';

        try {
          qrDataUrl = await QRCode.toDataURL(studentCode, {
            width: 140,
            margin: 1,
            color: {
              dark: '#0f172a',
              light: '#ffffff',
            },
          });
        } catch {
          qrDataUrl = '';
        }

        results.push({
          ...item.student,
          classLabel: item.classLabel,
          qrDataUrl,
          barcodeSvgId: `barcode-${item.student.id}`,
        });
      }

      if (isMounted) {
        setStudentsWithCodes(results);
        setIsGenerating(false);
      }
    };

    generateCodes();

    return () => {
      isMounted = false;
    };
  }, [isOpen, filteredStudents]);

  // Render Barcode Code128 SVGs using JsBarcode after DOM update
  useEffect(() => {
    if (!isOpen || isGenerating || studentsWithCodes.length === 0) return;

    const timer = setTimeout(() => {
      studentsWithCodes.forEach((student) => {
        const element = document.getElementById(student.barcodeSvgId);
        if (element) {
          const codeVal = student.nisn || student.nis || student.id;
          try {
            JsBarcode(element, codeVal, {
              format: 'CODE128',
              lineColor: '#0f172a',
              width: 1.2,
              height: 28,
              displayValue: true,
              fontSize: 9,
              font: 'monospace',
              margin: 0,
            });
          } catch {
            // fallback
          }
        }
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, isGenerating, studentsWithCodes, cardTheme]);

  // Dedicated Print Function that opens a standalone print window with exact card styling & barcodes
  const handlePrintViaWindow = () => {
    const printWindow = window.open('', '_blank', 'width=950,height=1000,scrollbars=yes');
    if (!printWindow) {
      window.print();
      return;
    }

    // Build the cards HTML directly
    const themeColors = {
      blue: {
        headerBg: 'linear-gradient(135deg, #1d4ed8, #3730a3)',
        border: '#93c5fd',
        tagBg: '#dbeafe',
        tagText: '#1e40af',
      },
      emerald: {
        headerBg: 'linear-gradient(135deg, #047857, #115e59)',
        border: '#6ee7b7',
        tagBg: '#d1fae5',
        tagText: '#065f46',
      },
      purple: {
        headerBg: 'linear-gradient(135deg, #7e22ce, #312e81)',
        border: '#d8b4fe',
        tagBg: '#f3e8ff',
        tagText: '#6b21a8',
      },
      slate: {
        headerBg: 'linear-gradient(135deg, #1e293b, #0f172a)',
        border: '#cbd5e1',
        tagBg: '#f1f5f9',
        tagText: '#1e293b',
      },
    };

    const selTheme = themeColors[cardTheme];

    let cardsHtml = '';
    studentsWithCodes.forEach((student) => {
      const codeVal = student.nisn || student.nis || student.id;
      
      // Get SVG string of barcode
      let barcodeSvgHtml = '';
      const existingSvg = document.getElementById(student.barcodeSvgId);
      if (existingSvg) {
        barcodeSvgHtml = existingSvg.outerHTML;
      } else {
        barcodeSvgHtml = `<div style="font-family:monospace;font-size:10px;font-weight:bold;letter-spacing:2px;">*${codeVal}*</div>`;
      }

      cardsHtml += `
        <div class="student-card" style="border: 2px solid ${selTheme.border};">
          <!-- CARD HEADER -->
          <div class="card-header" style="background: ${selTheme.headerBg};">
            <div class="logo-box">
              ${
                school.logo
                  ? `<img src="${school.logo}" alt="Logo" style="width:24px;height:24px;object-fit:contain;" />`
                  : `<span style="font-size:11px;font-weight:900;">KM</span>`
              }
            </div>
            <div class="school-info">
              <h4>${school.name || 'SMP NEGERI INDONESIA'}</h4>
              <p>KARTU TANDA PELAJAR · NPSN: ${school.npsn || '20212345'}</p>
            </div>
          </div>

          <!-- CARD BODY -->
          <div class="card-body">
            <div class="main-info">
              <!-- Avatar -->
              <div class="avatar-box">
                <span class="avatar-letter">${student.name.charAt(0)}</span>
                <span class="gender-tag">${student.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</span>
              </div>

              <!-- Biodata -->
              <div class="bio-box">
                <div>
                  <span class="field-label">Nama Lengkap</span>
                  <div class="student-name">${student.name}</div>
                </div>
                <div class="nisn-row">
                  <div>
                    <span class="field-label">NISN</span>
                    <div class="mono-val">${student.nisn || '-'}</div>
                  </div>
                  <div>
                    <span class="field-label">NIS</span>
                    <div class="mono-val">${student.nis || '-'}</div>
                  </div>
                </div>
                <div style="margin-top: 3px;">
                  <span class="field-label">Kelas: </span>
                  <span class="class-pill" style="background:${selTheme.tagBg};color:${selTheme.tagText};">${student.classLabel}</span>
                </div>
              </div>

              <!-- QR Code -->
              <div class="qr-box">
                ${
                  student.qrDataUrl
                    ? `<img src="${student.qrDataUrl}" alt="QR" style="width:52px;height:52px;object-fit:contain;border:1px solid #e2e8f0;border-radius:4px;" />`
                    : `<div style="width:52px;height:52px;background:#f1f5f9;"></div>`
                }
                <span class="scan-label">SCAN ME</span>
              </div>
            </div>

            <!-- FOOTER BARCODE & TTD -->
            <div class="card-footer">
              <div class="barcode-wrapper">
                ${barcodeSvgHtml}
              </div>
              <div class="ttd-wrapper">
                <div>Kepala Sekolah,</div>
                <div class="headmaster-name">${school.headmasterName || 'Kepala Sekolah'}</div>
                <div class="headmaster-nip">NIP. ${school.headmasterNip || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cetak Kartu Siswa - ${school.name || 'Sekolah'}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            body { background-color: #f8fafc; padding: 20px; color: #0f172a; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            @page { size: A4 portrait; margin: 10mm; }
            
            .no-print-bar {
              background: #0f172a; color: white; padding: 12px 20px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;
            }
            .btn-print {
              background: #10b981; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;
            }
            .btn-print:hover { background: #059669; }

            .cards-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              max-width: 800px;
              margin: 0 auto;
            }

            .student-card {
              background: #ffffff;
              border-radius: 14px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.08);
              display: flex;
              flex-direction: column;
              height: 220px;
              page-break-inside: avoid;
              break-inside: avoid;
            }

            .card-header {
              padding: 8px 12px;
              color: white;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .logo-box {
              width: 28px;
              height: 28px;
              border-radius: 6px;
              background: rgba(255,255,255,0.25);
              border: 1px solid rgba(255,255,255,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }
            .school-info h4 {
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              line-height: 1.2;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .school-info p {
              font-size: 8px;
              opacity: 0.85;
            }

            .card-body {
              padding: 10px 12px;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              background: #ffffff;
            }

            .main-info {
              display: flex;
              align-items: flex-start;
              gap: 10px;
            }

            .avatar-box {
              width: 50px;
              height: 64px;
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }
            .avatar-letter {
              font-size: 20px;
              font-weight: 900;
              color: #334155;
            }
            .gender-tag {
              font-size: 6.5px;
              font-weight: 800;
              color: #64748b;
              margin-top: 3px;
              text-transform: uppercase;
            }

            .bio-box {
              flex: 1;
              min-width: 0;
            }
            .field-label {
              font-size: 7.5px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              display: block;
            }
            .student-name {
              font-size: 12px;
              font-weight: 800;
              color: #0f172a;
              line-height: 1.2;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .nisn-row {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px;
              margin-top: 3px;
            }
            .mono-val {
              font-size: 9.5px;
              font-family: monospace;
              font-weight: 700;
              color: #1e293b;
            }
            .class-pill {
              display: inline-block;
              font-size: 8.5px;
              font-weight: 800;
              padding: 1px 5px;
              border-radius: 4px;
            }

            .qr-box {
              display: flex;
              flex-direction: column;
              align-items: center;
              flex-shrink: 0;
            }
            .scan-label {
              font-size: 7px;
              font-weight: 800;
              color: #64748b;
              margin-top: 2px;
            }

            .card-footer {
              border-top: 1px solid #f1f5f9;
              padding-top: 6px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 6px;
            }
            .barcode-wrapper {
              flex: 1;
              overflow: hidden;
            }
            .barcode-wrapper svg {
              width: 100%;
              height: 28px;
            }
            .ttd-wrapper {
              text-align: right;
              font-size: 7px;
              color: #475569;
              line-height: 1.2;
              flex-shrink: 0;
            }
            .headmaster-name {
              font-weight: 800;
              color: #0f172a;
              text-decoration: underline;
              margin-top: 4px;
            }
            .headmaster-nip {
              font-size: 6px;
              color: #64748b;
              font-family: monospace;
            }

            @media print {
              .no-print-bar { display: none !important; }
              body { background: #ffffff !important; padding: 0 !important; }
              .cards-grid { max-width: 100% !important; }
              .student-card { box-shadow: none !important; border-width: 1.5px !important; }
            }
          </style>
        </head>
        <body>
          <div class="no-print-bar">
            <div>
              <strong>Cetak Kartu Siswa & Barcode</strong>
              <div style="font-size:12px;opacity:0.8;">Total: ${studentsWithCodes.length} Siswa Terdaftar</div>
            </div>
            <button class="btn-print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
          </div>

          <div class="cards-grid">
            ${cardsHtml}
          </div>

          <script>
            // Auto open print dialog safely
            window.addEventListener('DOMContentLoaded', () => {
              setTimeout(() => {
                window.print();
              }, 400);
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleNativePrint = () => {
    // If inside iframe or browser prefers window popup, handlePrintViaWindow is safest
    handlePrintViaWindow();
  };

  if (!isOpen) return null;

  // Theme color maps
  const themeStyles = {
    blue: {
      headerBg: 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      border: 'border-blue-300',
    },
    emerald: {
      headerBg: 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      border: 'border-emerald-300',
    },
    purple: {
      headerBg: 'bg-gradient-to-r from-purple-700 to-indigo-900 text-white',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      border: 'border-purple-300',
    },
    slate: {
      headerBg: 'bg-gradient-to-r from-slate-800 to-slate-950 text-white',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      border: 'border-slate-300',
    },
  };

  const currentTheme = themeStyles[cardTheme];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 md:p-6 overflow-y-auto animate-in fade-in duration-200 print:static print:inset-auto print:bg-white print:p-0 print:m-0 print:overflow-visible print:z-auto print:block">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:h-auto print:rounded-none print:shadow-none print:border-none print:overflow-visible print:block print:w-full">
        {/* ── HEADER MODAL (NO-PRINT) ── */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base md:text-lg text-white leading-tight">
                  Pusat Cetak Kartu Pelajar & Barcode Presensi
                </h2>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/20">
                  Format Standar ID Card
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Cetak kartu tanda pelajar lengkap dengan Barcode Code128 & QR Code untuk presensi KBM dan gerbang sekolah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNativePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
              title="Buka Jendela Cetak Bebas Blank Putih"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF ({filteredStudents.length} Kartu)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── FILTER & CUSTOMIZATION BAR (NO-PRINT) ── */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 no-print">
          {/* Class selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Pilih Rombel:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Semua Kelas ({rosters.reduce((acc, r) => acc + r.students.length, 0)} Siswa)</option>
              {rosters.map((r) => (
                <option key={r.classId} value={r.classId}>
                  Kelas {r.classLabel} ({r.students.length} Siswa)
                </option>
              ))}
            </select>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama / NISN..."
              className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Warna Kartu:</span>
            <div className="flex items-center gap-1">
              {(['blue', 'emerald', 'purple', 'slate'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setCardTheme(theme)}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                    theme === 'blue'
                      ? 'bg-blue-600'
                      : theme === 'emerald'
                      ? 'bg-emerald-600'
                      : theme === 'purple'
                      ? 'bg-purple-600'
                      : 'bg-slate-800'
                  } ${cardTheme === theme ? 'border-amber-400 scale-110 shadow-xs' : 'border-transparent opacity-70'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── CARD PRINT PREVIEW CANVAS ── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/70 print:overflow-visible print:bg-white print:p-0">
          {isGenerating ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">Menghasilkan Barcode & QR Code Siswa...</p>
            </div>
          ) : studentsWithCodes.length === 0 ? (
            <div className="py-20 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold">Tidak ada siswa yang sesuai kriteria pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 print:grid-cols-2 print:gap-4">
              {studentsWithCodes.map((student) => (
                <div
                  key={student.id}
                  className={`bg-white rounded-2xl border-2 ${currentTheme.border} shadow-md overflow-hidden flex flex-col justify-between w-full max-w-[340px] mx-auto print:shadow-none print:border print:max-w-none print:break-inside-avoid`}
                  style={{ minHeight: '200px' }}
                >
                  {/* CARD HEADER / KOP */}
                  <div className={`p-2.5 ${currentTheme.headerBg} flex items-center justify-between border-b border-black/10`}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-extrabold text-white text-[11px] border border-white/30 shrink-0">
                        {school.logo ? (
                          <img src={school.logo} alt="Logo" className="w-6 h-6 object-contain" />
                        ) : (
                          'KM'
                        )}
                      </div>
                      <div className="truncate">
                        <h4 className="font-extrabold text-[11px] uppercase tracking-wide leading-tight truncate">
                          {school.name}
                        </h4>
                        <p className="text-[8px] text-white/80 truncate">
                          KARTU TANDA PELAJAR · NPSN: {school.npsn || '20212345'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CARD BODY: PHOTO + DETAILS + QR */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2 bg-white">
                    <div className="flex items-start gap-2.5">
                      {/* Avatar / Foto Siswa */}
                      <div className="w-14 h-18 rounded-xl bg-slate-100 border border-slate-300 flex flex-col items-center justify-center text-center p-1 shrink-0 overflow-hidden shadow-2xs">
                        <span className="font-black text-slate-700 text-lg">
                          {student.name.charAt(0)}
                        </span>
                        <span className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                          {student.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                        </span>
                      </div>

                      {/* Biodata Siswa */}
                      <div className="flex-1 min-w-0 text-[10px] space-y-0.5">
                        <div>
                          <span className="text-[8px] text-slate-400 font-bold uppercase block">Nama Lengkap</span>
                          <h5 className="font-extrabold text-slate-900 leading-tight truncate text-xs">
                            {student.name}
                          </h5>
                        </div>

                        <div className="grid grid-cols-2 gap-1 pt-0.5">
                          <div>
                            <span className="text-[8px] text-slate-400 font-bold block">NISN</span>
                            <span className="font-bold text-slate-800 font-mono text-[10px]">{student.nisn || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 font-bold block">NIS</span>
                            <span className="font-bold text-slate-800 font-mono text-[10px]">{student.nis || '-'}</span>
                          </div>
                        </div>

                        <div className="pt-0.5 flex items-center gap-1.5">
                          <span className="text-[8px] text-slate-400 font-bold">Kelas:</span>
                          <span className="px-1.5 py-0.2 bg-blue-100 text-blue-900 font-black rounded text-[9px]">
                            {student.classLabel}
                          </span>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="shrink-0 text-center">
                        {student.qrDataUrl ? (
                          <img
                            src={student.qrDataUrl}
                            alt="QR Code"
                            className="w-14 h-14 object-contain border border-slate-200 rounded-lg p-0.5 bg-white shadow-2xs"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-slate-100 rounded-lg" />
                        )}
                        <span className="text-[7px] text-slate-400 font-bold block mt-0.5">SCAN ME</span>
                      </div>
                    </div>

                    {/* CARD FOOTER: 1D BARCODE CODE128 & KEPALA SEKOLAH */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      {/* Barcode SVG */}
                      <div className="flex-1 overflow-hidden pr-2">
                        <svg id={student.barcodeSvgId} className="w-full h-8" />
                      </div>

                      {/* Stempel & Tanda Tangan */}
                      <div className="text-right shrink-0 text-[7px] text-slate-600 leading-tight">
                        <div>Kepala Sekolah,</div>
                        <div className="font-bold text-slate-900 mt-2 underline">{school.headmasterName}</div>
                        <div className="text-[6px] text-slate-500 font-mono">NIP. {school.headmasterNip}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FOOTER MODAL (NO-PRINT) ── */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 no-print">
          <div className="text-slate-500 text-[11px] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              Format cetak mendukung kertas A4 / HVS 80gr atau kertas PVC ID Card standar.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNativePrint}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Semua Kartu ({filteredStudents.length})</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
