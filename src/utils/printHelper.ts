/**
 * Print & Document Export Helper Utility for AI Studio preview environment
 * Handles printing inside iFrames with window popup fallbacks and new tab openers.
 */

export interface PrintOptions {
  documentSelector?: string;
  docTitle?: string;
  orientation?: 'portrait' | 'landscape';
  margin?: string;
  paperSize?: 'A4' | 'F4' | 'Letter' | 'Legal';
}

/**
 * Triggers printing using a popup window to bypass iFrame restrictions
 */
export function printViaNewWindow(options: PrintOptions = {}) {
  const {
    documentSelector = '.document-page',
    docTitle = 'Dokumen Resmi',
    orientation = 'portrait',
    margin = '15mm',
    paperSize = 'A4',
  } = options;

  const docElement = document.querySelector(documentSelector);
  
  if (!docElement) {
    try {
      window.print();
    } catch (e) {
      console.error('Direct window.print failed:', e);
      alert('Gagal mencetak dokumen. Silakan buka aplikasi di tab baru browser.');
    }
    return;
  }

  const printWindow = window.open('', '_blank', 'width=950,height=1000,scrollbars=yes');
  
  if (!printWindow) {
    alert(
      'Popup diblokir oleh browser. Silakan izinkan popup untuk situs ini atau gunakan tombol "Buka di Tab Baru".'
    );
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${docTitle}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
          
          body {
            font-family: 'Times New Roman', Times, Georgia, serif !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            padding: 20px;
            margin: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: ${paperSize} ${orientation};
            margin: ${margin};
          }

          mark {
            background-color: #fef08a !important;
            color: #451a03 !important;
            border-bottom: 2px solid #f59e0b !important;
            padding: 1px 4px !important;
            border-radius: 3px !important;
            font-weight: 600 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print,
          .print\:hidden,
          [class*="print:hidden"],
          aside,
          header,
          button,
          .no-print * {
            display: none !important;
          }

          .print-only {
            display: inline-block !important;
          }

          .document-page {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }

          table, th, td {
            border-color: #000000 !important;
          }

          input[type="number"], input[type="text"] {
            border: none !important;
            background: transparent !important;
          }
        </style>
      </head>
      <body onload="setTimeout(() => { window.print(); window.close(); }, 500)">
        <div class="document-page">
          ${docElement.innerHTML}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
}

/**
 * Opens current application in a new browser tab
 */
export function openAppInNewTab() {
  window.open(window.location.href, '_blank');
}

/**
 * Smart print wrapper with automatic fallback
 */
export function smartPrint(options: PrintOptions = {}) {
  try {
    printViaNewWindow(options);
  } catch {
    try {
      window.print();
    } catch {
      openAppInNewTab();
    }
  }
}
