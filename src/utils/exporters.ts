/**
 * Export and Print Utilities for Rekap Semester
 * Provides HTML-based Excel download, Word document export, and Print triggers.
 */

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  TextRun,
  BorderStyle,
  PageOrientation,
  VerticalAlign,
  ShadingType,
} from 'docx';
import type { MarginPreset, ScalePreset } from '../types';

/**
 * Downloads a table/matrix as a native Excel file (.xlsx) using ExcelJS
 */
export async function exportToExcel(elementId: string, filename: string, _title: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert(`Elemen dengan ID #${elementId} tidak ditemukan untuk di-export.`);
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Guru Admin Flow';
    workbook.lastModifiedBy = 'Guru Admin Flow';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Rekap Data', {
      pageSetup: {
        orientation: 'landscape',
        paperSize: 9, // A4
        showGridLines: true,
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      },
    });

    let currentRowIndex = 1;

    // 1. Process Headings inside element if any (e.g., h1, h2, h3, title divs)
    const headings = element.querySelectorAll('h1, h2, h3, .doc-title');
    headings.forEach((heading) => {
      const text = (heading.textContent || '').trim();
      if (text) {
        const row = worksheet.getRow(currentRowIndex);
        row.getCell(1).value = text;
        row.getCell(1).font = { name: 'Calibri', size: 14, bold: true };
        row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        currentRowIndex++;
      }
    });

    if (headings.length > 0) {
      currentRowIndex++; // spacer row
    }

    // 2. Process all tables inside element
    const tables = element.querySelectorAll('table');

    tables.forEach((table) => {
      const isMatrixTable = table.classList.contains('rekap-matrix-table') || table.querySelector('th') !== null;
      const isHeaderOrFooterTable = !table.classList.contains('rekap-matrix-table');

      // Grid tracker for rowSpan and colSpan
      const occupied: Record<number, Record<number, boolean>> = {};

      const trs = table.querySelectorAll('tr');
      trs.forEach((tr) => {
        let colIndex = 1;

        const cells = tr.querySelectorAll('th, td');
        cells.forEach((cell) => {
          // Find next unoccupied column index in currentRowIndex
          while (occupied[currentRowIndex] && occupied[currentRowIndex][colIndex]) {
            colIndex++;
          }

          const rowSpan = parseInt(cell.getAttribute('rowspan') || '1', 10);
          const colSpan = parseInt(cell.getAttribute('colspan') || '1', 10);

          // Mark occupied cells
          for (let r = 0; r < rowSpan; r++) {
            const targetR = currentRowIndex + r;
            if (!occupied[targetR]) occupied[targetR] = {};
            for (let c = 0; c < colSpan; c++) {
              occupied[targetR][colIndex + c] = true;
            }
          }

          // Merge cells if span > 1
          if (rowSpan > 1 || colSpan > 1) {
            worksheet.mergeCells(
              currentRowIndex,
              colIndex,
              currentRowIndex + rowSpan - 1,
              colIndex + colSpan - 1
            );
          }

          const excelCell = worksheet.getCell(currentRowIndex, colIndex);
          const rawText = (cell.textContent || '').trim();

          // Preserving strings for NISN / NIP or leading zeros
          if (/^0\d+/.test(rawText) || rawText.includes('NIP.') || cell.classList.contains('nisn-col')) {
            excelCell.value = rawText;
            excelCell.numFmt = '@';
          } else if (!isNaN(Number(rawText)) && rawText !== '' && !rawText.includes('-') && !rawText.includes('/')) {
            excelCell.value = Number(rawText);
          } else {
            excelCell.value = rawText;
          }

          // Determine alignment
          let align: 'left' | 'center' | 'right' = 'center';
          if (cell.classList.contains('text-left') || (cell as HTMLElement).style.textAlign === 'left') {
            align = 'left';
          } else if (cell.classList.contains('text-right') || (cell as HTMLElement).style.textAlign === 'right') {
            align = 'right';
          }

          const isBold =
            cell.tagName === 'TH' ||
            cell.classList.contains('font-bold') ||
            (cell as HTMLElement).style.fontWeight === 'bold';

          excelCell.font = {
            name: 'Calibri',
            size: isMatrixTable ? 10 : 11,
            bold: isBold,
          };

          excelCell.alignment = {
            vertical: 'middle',
            horizontal: align,
            wrapText: true,
          };

          // Background Fill for header cells
          if (cell.tagName === 'TH' || cell.classList.contains('bg-slate-100') || cell.classList.contains('bg-slate-200')) {
            excelCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE2E8F0' },
            };
          }

          // Borders for matrix data table
          if (isMatrixTable && !isHeaderOrFooterTable) {
            excelCell.border = {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } },
            };
          }

          colIndex += colSpan;
        });

        currentRowIndex++;
      });

      currentRowIndex++; // Blank line between tables
    });

    // Auto-fit Column Widths
    worksheet.columns.forEach((column) => {
      let maxLen = 8;
      column.eachCell?.({ includeEmpty: false }, (cell) => {
        const val = cell.value ? cell.value.toString() : '';
        if (val.length > maxLen && val.length < 50) {
          maxLen = val.length;
        }
      });
      column.width = Math.min(Math.max(maxLen + 3, 10), 35);
    });

    // Save File
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel via ExcelJS:', error);
    alert('Gagal mengekspor file Excel. Silakan coba lagi.');
  }
}

/**
 * Downloads a table/matrix as a native Microsoft Word document (.docx) using docx
 */
export async function exportToWord(elementId: string, filename: string, _title: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert(`Elemen dengan ID #${elementId} tidak ditemukan untuk di-export.`);
    return;
  }

  try {
    const docChildren: (Paragraph | Table)[] = [];

    // Title / Headings
    const headings = element.querySelectorAll('h1, h2, h3, .doc-title');
    headings.forEach((h) => {
      const text = (h.textContent || '').trim();
      if (text) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text,
                bold: true,
                size: 24, // 12pt
                font: 'Times New Roman',
              }),
            ],
          })
        );
      }
    });

    // Parse Tables
    const tables = element.querySelectorAll('table');

    tables.forEach((table) => {
      const isMatrixTable = table.classList.contains('rekap-matrix-table') || table.querySelector('th') !== null;

      const borderStyle = isMatrixTable
        ? {
            top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            insideVertical: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
          }
        : {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          };

      // Grid mapping for table cells
      const trs = table.querySelectorAll('tr');
      const tableRows: TableRow[] = [];

      trs.forEach((tr) => {
        const cells = tr.querySelectorAll('th, td');
        const docxCells: TableCell[] = [];

        cells.forEach((cell) => {
          const colSpan = parseInt(cell.getAttribute('colspan') || '1', 10);
          const rowSpan = parseInt(cell.getAttribute('rowspan') || '1', 10);
          const text = (cell.textContent || '').trim();

          const isBold =
            cell.tagName === 'TH' ||
            cell.classList.contains('font-bold') ||
            (cell as HTMLElement).style.fontWeight === 'bold';

          let alignment = AlignmentType.CENTER as (typeof AlignmentType)[keyof typeof AlignmentType];
          if (cell.classList.contains('text-left') || (cell as HTMLElement).style.textAlign === 'left') {
            alignment = AlignmentType.LEFT;
          } else if (cell.classList.contains('text-right') || (cell as HTMLElement).style.textAlign === 'right') {
            alignment = AlignmentType.RIGHT;
          }

          const shading =
            cell.tagName === 'TH' || cell.classList.contains('bg-slate-100') || cell.classList.contains('bg-slate-200')
              ? { fill: 'E2E8F0', type: ShadingType.CLEAR }
              : undefined;

          docxCells.push(
            new TableCell({
              columnSpan: colSpan > 1 ? colSpan : undefined,
              rowSpan: rowSpan > 1 ? rowSpan : undefined,
              shading,
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment,
                  children: [
                    new TextRun({
                      text,
                      bold: isBold,
                      size: isMatrixTable ? 17 : 19, // ~8.5pt or 9.5pt
                      font: 'Times New Roman',
                    }),
                  ],
                }),
              ],
            })
          );
        });

        if (docxCells.length > 0) {
          tableRows.push(new TableRow({ children: docxCells }));
        }
      });

      if (tableRows.length > 0) {
        docChildren.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: borderStyle,
            rows: tableRows,
          })
        );
        docChildren.push(new Paragraph({ spacing: { after: 120 }, children: [] })); // spacer
      }
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE,
              },
              margin: {
                top: 720, // 0.5 in
                bottom: 720,
                left: 720,
                right: 720,
              },
            },
          },
          children: docChildren,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
  } catch (error) {
    console.error('Error exporting to Word via docx:', error);
    alert('Gagal mengekspor file Word. Silakan coba lagi.');
  }
}

import { printViaNewWindow } from './printHelper';

/**
 * Triggers native window.print() or popup window printing with custom injected print styles
 */
export function triggerPrint(
  elementId: string = 'rekap-tatapmuka-doc',
  margin: MarginPreset = 'rapat',
  _scale: ScalePreset = 80
) {
  const marginDxaMap: Record<MarginPreset, string> = {
    rapat: '5mm',
    normal: '10mm',
    sedang: '12mm',
    longgar: '15mm',
  };

  const selectedMargin = marginDxaMap[margin] || '5mm';

  printViaNewWindow({
    documentSelector: `#${elementId}, .document-page`,
    docTitle: 'Cetak Rekap KBM & Evaluasi',
    orientation: 'landscape',
    margin: selectedMargin,
  });
}

