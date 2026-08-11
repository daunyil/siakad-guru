import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type {
  TeachingAssignment,
  AcademicYear,
  ClassRoster,
  TeachingJournal,
  AttendanceRecord,
  SchoolProfile,
} from '../types';

export interface StudentAbsenceSummary {
  studentId: string;
  name: string;
  number: number;
  nisn?: string;
  sickCount: number;
  excusedCount: number;
  absentCount: number; // Alpa
  lateCount: number;
  totalNonPresent: number;
  warningLevel: 'none' | 'warning' | 'danger';
  warningMessage: string;
  absenceDates: { date: string; status: string }[];
}

export function computeStudentAbsenceSummaries(
  roster: ClassRoster,
  records: AttendanceRecord[],
  classId: string
): StudentAbsenceSummary[] {
  const classRecords = records.filter((r) => r.classId === classId);

  return roster.students.map((student) => {
    const studentRecs = classRecords.filter((r) => r.studentId === student.id);
    let sickCount = 0;
    let excusedCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    const absenceDates: { date: string; status: string }[] = [];

    studentRecs.forEach((r) => {
      if (r.status === 'sick') {
        sickCount++;
        absenceDates.push({ date: r.date, status: 'Sakit' });
      } else if (r.status === 'excused') {
        excusedCount++;
        absenceDates.push({ date: r.date, status: 'Izin' });
      } else if (r.status === 'absent') {
        absentCount++;
        absenceDates.push({ date: r.date, status: 'Alpa' });
      } else if (r.status === 'late') {
        lateCount++;
        absenceDates.push({ date: r.date, status: 'Terlambat' });
      }
    });

    const totalNonPresent = sickCount + excusedCount + absentCount;

    let warningLevel: 'none' | 'warning' | 'danger' = 'none';
    let warningMessage = 'Kehadiran Baik';

    if (absentCount >= 3) {
      warningLevel = 'danger';
      warningMessage = `⚠️ Peringatan Dini: Alpa ${absentCount}x (Perlu Surat Panggilan BK/Orang Tua)`;
    } else if (totalNonPresent >= 3) {
      warningLevel = 'warning';
      warningMessage = `⚠️ Perhatian: Tidak Hadir Total ${totalNonPresent}x (S:${sickCount}, I:${excusedCount}, A:${absentCount})`;
    } else if (absentCount > 0) {
      warningLevel = 'warning';
      warningMessage = `Tercatat Alpa ${absentCount}x`;
    }

    return {
      studentId: student.id,
      name: student.name,
      number: student.number,
      nisn: student.nisn,
      sickCount,
      excusedCount,
      absentCount,
      lateCount,
      totalNonPresent,
      warningLevel,
      warningMessage,
      absenceDates,
    };
  });
}

/**
 * Export Jurnal KBM Harian & Rekap Absensi to formatted Excel (.xlsx) file
 */
export async function exportKbmToExcel(params: {
  assignment: TeachingAssignment;
  year: AcademicYear;
  roster: ClassRoster;
  journals: TeachingJournal[];
  records: AttendanceRecord[];
  school?: SchoolProfile;
  teacherName?: string;
  teacherNip?: string;
}) {
  const { assignment, year, roster, journals, records, school, teacherName, teacherNip } = params;
  const tName = teacherName || (assignment as any).teacherName || '-';
  const tNip = teacherNip || (assignment as any).teacherNip || '-';

  const workbook = new ExcelJS.Workbook();
  workbook.creator = school?.name || 'Aplikasi Administrasi Guru';
  workbook.created = new Date();

  const summaries = computeStudentAbsenceSummaries(roster, records, assignment.classId);

  // ── SHEET 1: JURNAL MENGAJAR HARIAN ──
  const sheetJurnal = workbook.addWorksheet('Jurnal KBM Harian');
  sheetJurnal.views = [{ showGridLines: true }];

  // Header Titles
  sheetJurnal.mergeCells('A1:I1');
  sheetJurnal.getCell('A1').value = 'JURNAL AGENDA MENGAJAR GURU';
  sheetJurnal.getCell('A1').font = { name: 'Calibri', size: 14, bold: true };
  sheetJurnal.getCell('A1').alignment = { horizontal: 'center' };

  sheetJurnal.mergeCells('A2:I2');
  sheetJurnal.getCell('A2').value = (school?.name || 'SMP NEGERI 8 BANTAN').toUpperCase();
  sheetJurnal.getCell('A2').font = { name: 'Calibri', size: 12, bold: true };
  sheetJurnal.getCell('A2').alignment = { horizontal: 'center' };

  sheetJurnal.mergeCells('A3:I3');
  sheetJurnal.getCell('A3').value = `TAHUN PELAJARAN ${year.label} (SEMESTER ${year.semester})`;
  sheetJurnal.getCell('A3').font = { name: 'Calibri', size: 11, bold: true };
  sheetJurnal.getCell('A3').alignment = { horizontal: 'center' };

  sheetJurnal.addRow([]);

  // Metadata Row
  sheetJurnal.addRow(['MATA PELAJARAN', ':', assignment.subject, '', '', 'GURU MAPEL', ':', tName]);
  sheetJurnal.addRow(['KELAS', ':', assignment.classLabel, '', '', 'NIP GURU', ':', tNip]);
  sheetJurnal.addRow([]);

  // Table Columns
  const headerRowJrn = sheetJurnal.addRow([
    'NO',
    'TANGGAL',
    'JAM KE-',
    'PERT. KE',
    'TUJUAN PEMBELAJARAN (TP)',
    'RINCIAN KEGIATAN KBM',
    'SISWA TIDAK HADIR',
    'CATATAN KEJADIAN',
    'STATUS',
  ]);

  headerRowJrn.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRowJrn.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' }, // Dark slate
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  const sortedJournals = [...journals]
    .filter((j) => j.classId === assignment.classId)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sortedJournals.length === 0) {
    const emptyRow = sheetJurnal.addRow(['-', '-', '-', '-', 'Belum ada data jurnal mengajar', '-', '-', '-', '-']);
    emptyRow.getCell(5).alignment = { horizontal: 'center' };
  } else {
    sortedJournals.forEach((jrn, idx) => {
      // Find non-present students for this date
      const dateRecords = records.filter((r) => r.classId === assignment.classId && r.date === jrn.date);
      const absentTextList = dateRecords
        .filter((r) => r.status !== 'present')
        .map((r) => {
          const st = roster.students.find((s) => s.id === r.studentId);
          const stName = st ? st.name : r.studentId;
          const code = r.status === 'sick' ? 'S' : r.status === 'excused' ? 'I' : r.status === 'absent' ? 'A' : 'T';
          return `${stName} (${code})`;
        })
        .join(', ');

      const row = sheetJurnal.addRow([
        idx + 1,
        jrn.date,
        'Jam 1-3',
        idx + 1,
        jrn.plannedMaterialTitle || '-',
        jrn.actualMaterialTitle || '-',
        absentTextList || 'Hadir Semua',
        jrn.note || '-',
        jrn.realizationStatus === 'done' ? 'Tuntas' : 'Lanjutan',
      ]);

      row.eachCell((cell, colIndex) => {
        cell.alignment = {
          vertical: 'top',
          wrapText: true,
          horizontal: colIndex <= 4 || colIndex === 9 ? 'center' : 'left',
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
  }

  // Column widths
  sheetJurnal.getColumn(1).width = 6;
  sheetJurnal.getColumn(2).width = 14;
  sheetJurnal.getColumn(3).width = 12;
  sheetJurnal.getColumn(4).width = 10;
  sheetJurnal.getColumn(5).width = 32;
  sheetJurnal.getColumn(6).width = 36;
  sheetJurnal.getColumn(7).width = 24;
  sheetJurnal.getColumn(8).width = 26;
  sheetJurnal.getColumn(9).width = 12;

  // ── SHEET 2: REKAP PRESENSI SISWA & EARLY WARNING ──
  const sheetAbsensi = workbook.addWorksheet('Rekap Absensi & Early Warning');
  sheetAbsensi.views = [{ showGridLines: true }];

  sheetAbsensi.mergeCells('A1:I1');
  sheetAbsensi.getCell('A1').value = `REKAP PRESENSI SISWA & SISTEM PERINGATAN DINI (EARLY WARNING)`;
  sheetAbsensi.getCell('A1').font = { name: 'Calibri', size: 13, bold: true };
  sheetAbsensi.getCell('A1').alignment = { horizontal: 'center' };

  sheetAbsensi.mergeCells('A2:I2');
  sheetAbsensi.getCell('A2').value = `Kelas: ${assignment.classLabel} | Mapel: ${assignment.subject} | TP: ${year.label}`;
  sheetAbsensi.getCell('A2').font = { name: 'Calibri', size: 11, italic: true };
  sheetAbsensi.getCell('A2').alignment = { horizontal: 'center' };

  sheetAbsensi.addRow([]);

  const headerRowAbs = sheetAbsensi.addRow([
    'NO',
    'NAMA SISWA',
    'NISN',
    'SAKIT (S)',
    'IZIN (I)',
    'ALPA (A)',
    'TERLAMBAT (T)',
    'TOTAL TIDAK HADIR',
    'STATUS PERINGATAN DINI',
  ]);

  headerRowAbs.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRowAbs.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F172A' },
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  summaries.forEach((sum) => {
    const row = sheetAbsensi.addRow([
      sum.number,
      sum.name,
      sum.nisn || '-',
      sum.sickCount,
      sum.excusedCount,
      sum.absentCount,
      sum.lateCount,
      sum.totalNonPresent,
      sum.warningMessage,
    ]);

    row.eachCell((cell, colIdx) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: colIdx === 2 || colIdx === 9 ? 'left' : 'center',
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      // Highlight early warning cells
      if (colIdx === 9) {
        if (sum.warningLevel === 'danger') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFECDD3' }, // Red soft
          };
          cell.font = { bold: true, color: { argb: 'FF9F1239' } };
        } else if (sum.warningLevel === 'warning') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFEF3C7' }, // Yellow soft
          };
          cell.font = { bold: true, color: { argb: 'FF92400E' } };
        }
      }
    });
  });

  sheetAbsensi.getColumn(1).width = 6;
  sheetAbsensi.getColumn(2).width = 28;
  sheetAbsensi.getColumn(3).width = 14;
  sheetAbsensi.getColumn(4).width = 10;
  sheetAbsensi.getColumn(5).width = 10;
  sheetAbsensi.getColumn(6).width = 10;
  sheetAbsensi.getColumn(7).width = 12;
  sheetAbsensi.getColumn(8).width = 16;
  sheetAbsensi.getColumn(9).width = 42;

  // ── SHEET 3: SISWA PERLU PERHATIAN BK ──
  const warningStudents = summaries.filter((s) => s.warningLevel !== 'none');
  if (warningStudents.length > 0) {
    const sheetWarning = workbook.addWorksheet('Siswa Perlu Perhatian (BK)');
    sheetWarning.views = [{ showGridLines: true }];

    sheetWarning.mergeCells('A1:F1');
    sheetWarning.getCell('A1').value = `DAFTAR SISWA PERLU TINDAK LANJUT / DOKUMEN BUKTI KHUSUS (PERINGATAN ABSENSI)`;
    sheetWarning.getCell('A1').font = { name: 'Calibri', size: 12, bold: true };
    sheetWarning.getCell('A1').alignment = { horizontal: 'center' };

    sheetWarning.addRow([]);

    const headerW = sheetWarning.addRow(['NO', 'NAMA SISWA', 'ALPA', 'TOTAL ABSEN', 'TANGGAL KETIDAKHADIRAN', 'CATATAN REKOMENDASI']);
    headerW.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerW.eachCell((c) => {
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF991B1B' } };
      c.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    warningStudents.forEach((st, idx) => {
      const datesFormatted = st.absenceDates.map((d) => `${d.date} (${d.status})`).join(', ');
      const row = sheetWarning.addRow([
        idx + 1,
        st.name,
        st.absentCount,
        st.totalNonPresent,
        datesFormatted || '-',
        st.absentCount >= 3 ? 'Segera terbitkan Surat Panggilan Orang Tua (SP1) & koordinasi dengan BK' : 'Lakukan konseling wali kelas',
      ]);
      row.eachCell((c, colIdx) => {
        c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        c.alignment = { vertical: 'top', horizontal: colIdx <= 4 ? 'center' : 'left' };
      });
    });

    sheetWarning.getColumn(1).width = 6;
    sheetWarning.getColumn(2).width = 28;
    sheetWarning.getColumn(3).width = 10;
    sheetWarning.getColumn(4).width = 14;
    sheetWarning.getColumn(5).width = 38;
    sheetWarning.getColumn(6).width = 44;
  }

  // Generate and Download File
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const filename = `Laporan_KBM_Jurnal_Absensi_${assignment.classLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  saveAs(blob, filename);
}

/**
 * Trigger Print-Ready PDF / Official Document Window for E-Kinerja & Supervisor Audit
 */
export function printKbmReportDoc(params: {
  assignment: TeachingAssignment;
  year: AcademicYear;
  roster: ClassRoster;
  journals: TeachingJournal[];
  records: AttendanceRecord[];
  school?: SchoolProfile;
  teacherName?: string;
  teacherNip?: string;
}) {
  const { assignment, year, roster, journals, records, school, teacherName, teacherNip } = params;
  const tName = teacherName || (assignment as any).teacherName || '-';
  const tNip = teacherNip || (assignment as any).teacherNip || '-';

  const summaries = computeStudentAbsenceSummaries(roster, records, assignment.classId);

  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) {
    alert('Pop-up terblokir. Izinkan pop-up untuk mencetak dokumen laporan KBM.');
    return;
  }

  const sortedJournals = [...journals]
    .filter((j) => j.classId === assignment.classId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const journalRowsHtml = sortedJournals.map((j, idx) => {
    const dateRecs = records.filter((r) => r.classId === assignment.classId && r.date === j.date);
    const absentTxt = dateRecs
      .filter((r) => r.status !== 'present')
      .map((r) => {
        const st = roster.students.find((s) => s.id === r.studentId);
        const code = r.status === 'sick' ? 'S' : r.status === 'excused' ? 'I' : r.status === 'absent' ? 'A' : 'T';
        return `${st ? st.name : r.studentId} (${code})`;
      })
      .join(', ') || '-';

    return `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td style="text-align:center;">${j.date}</td>
        <td style="text-align:center;">Jam 1-3</td>
        <td>${j.plannedMaterialTitle || '-'}</td>
        <td>${j.actualMaterialTitle || '-'}</td>
        <td>${absentTxt}</td>
        <td>${j.note || '-'}</td>
        <td style="text-align:center;">${j.realizationStatus === 'done' ? 'Tuntas' : 'Lanjutan'}</td>
      </tr>
    `;
  }).join('');

  const warningRowsHtml = summaries
    .filter((s) => s.warningLevel !== 'none')
    .map((s, idx) => `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td>${s.name}</td>
        <td style="text-align:center; color:red; font-weight:bold;">${s.absentCount}x</td>
        <td style="text-align:center;">${s.totalNonPresent}x</td>
        <td>${s.warningMessage}</td>
      </tr>
    `)
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Laporan KBM Harian & Absensi Siswa - ${assignment.classLabel}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: 'Times New Roman', serif; font-size: 11pt; color: #000; line-height: 1.3; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 8px; }
          .header h1 { font-size: 14pt; margin: 0; text-transform: uppercase; font-weight: bold; }
          .header h2 { font-size: 12pt; margin: 2px 0; text-transform: uppercase; }
          .header p { font-size: 10pt; margin: 0; }
          
          .meta-table { width: 100%; margin-bottom: 15px; font-weight: bold; font-size: 10pt; border-collapse: collapse; }
          .meta-table td { padding: 2px 0; border: none; }
          
          table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 9.5pt; }
          table.data-table th, table.data-table td { border: 1px solid #000; padding: 5px; vertical-align: top; }
          table.data-table th { background-color: #f2f2f2; text-align: center; font-bold: true; text-transform: uppercase; }
          
          .section-title { font-size: 11pt; font-weight: bold; text-transform: uppercase; margin-top: 20px; margin-bottom: 5px; text-decoration: underline; }
          
          .ttd-table { width: 100%; margin-top: 30px; font-size: 10pt; border-collapse: collapse; }
          .ttd-table td { border: none; text-align: center; width: 50%; vertical-align: top; }
          
          .warning-box { background-color: #fff8f8; border: 1px solid #f87171; padding: 8px; font-size: 9pt; margin-bottom: 15px; }
          
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 15px; text-align: right;">
          <button onclick="window.print()" style="padding: 8px 16px; background-color: #0f172a; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Cetak / Simpan Ke PDF
          </button>
        </div>

        <div class="header">
          <h1>JURNAL AGENDA MENGAJAR & REKAP PRESENSI KBM</h1>
          <h2>${school?.name || 'SMP NEGERI 8 BANTAN'}</h2>
          <p>TAHUN PELAJARAN ${year.label} (SEMESTER ${year.semester})</p>
        </div>

        <table class="meta-table">
          <tr>
            <td>MATA PELAJARAN : ${assignment.subject}</td>
            <td style="text-align: right;">GURU MAPEL : ${tName}</td>
          </tr>
          <tr>
            <td>KELAS : ${assignment.classLabel}</td>
            <td style="text-align: right;">NIP : ${tNip}</td>
          </tr>
        </table>

        <div class="section-title">I. REKAP JURNAL AGENDA MENGAJAR HARIAN</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 25px;">NO</th>
              <th style="width: 75px;">TANGGAL</th>
              <th style="width: 55px;">JAM KE</th>
              <th>TUJUAN PEMBELAJARAN (TP)</th>
              <th>RINCIAN KEGIATAN KBM</th>
              <th style="width: 120px;">SISWA TIDAK HADIR</th>
              <th style="width: 110px;">CATATAN</th>
              <th style="width: 55px;">STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${sortedJournals.length > 0 ? journalRowsHtml : '<tr><td colspan="8" style="text-align:center;">Belum ada data jurnal mengajar.</td></tr>'}
          </tbody>
        </table>

        ${warningRowsHtml ? `
          <div class="section-title" style="color: #991b1b;">II. RINGKASAN SISTEM PERINGATAN DINI ABSENSI SISWA (EARLY WARNING)</div>
          <div class="warning-box">
            Daftar siswa di bawah ini tercatat memiliki ketidakhadiran Kumulatif ≥ 3x atau Alpa yang memerlukan perhatian khusus / tindak lanjut BK & Wali Kelas.
          </div>
          <table class="data-table">
            <thead>
              <tr style="background-color: #fef2f2;">
                <th style="width: 25px;">NO</th>
                <th>NAMA SISWA</th>
                <th style="width: 60px;">ALPA</th>
                <th style="width: 80px;">TOTAL ABSEN</th>
                <th>STATUS / REKOMENDASI</th>
              </tr>
            </thead>
            <tbody>
              ${warningRowsHtml}
            </tbody>
          </table>
        ` : ''}

        <table class="ttd-table">
          <tr>
            <td>
              <div>Mengetahui,</div>
              <div style="font-weight: bold;">Kepala Sekolah</div>
              <div style="height: 60px;"></div>
              <div style="font-weight: bold; text-decoration: underline;">${school?.headmasterName || '...........................................'}</div>
              <div>NIP. ${school?.headmasterNip || '...........................................'}</div>
            </td>
            <td>
              <div>${school?.village || 'Bantan'}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div style="font-weight: bold;">Guru Mata Pelajaran</div>
              <div style="height: 60px;"></div>
              <div style="font-weight: bold; text-decoration: underline;">${tName}</div>
              <div>NIP. ${tNip}</div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
