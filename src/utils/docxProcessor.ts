import JSZip from 'jszip';

export interface DocxReplacements {
  targetSchool: string;
  targetTeacher: string;
  targetTeacherNip: string;
  targetHeadmaster: string;
  targetHeadmasterNip: string;
  targetYear: string;
  targetSemester: string;
  targetDateLocation: string;
  targetPlace?: string;
  targetDate?: string;
  subject: string;
  oldSchool: string;
  oldTeacher: string;
  oldTeacherNip: string;
  oldHeadmaster: string;
  oldHeadmasterNip: string;
  oldYear: string;
  oldDateLocation: string;
  oldPlace?: string;
  oldDate?: string;
  enableSmartPattern: boolean;
  includeExtraSignature?: boolean;
  includeExtraKop?: boolean;
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createDocxSignatureTable(
  xmlDoc: Document,
  replacements: DocxReplacements,
  dateLoc: string
): Element {
  const parser = new DOMParser();
  const tableXmlString = `
<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:tblPr>
    <w:tblW w:w="0" w:type="auto"/>
    <w:tblBorders>
      <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
      <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
      <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
      <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
      <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
      <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
    </w:tblBorders>
    <w:tblLayout w:type="fixed"/>
  </w:tblPr>
  <w:tblGrid>
    <w:gridCol w:w="4600"/>
    <w:gridCol w:w="4600"/>
  </w:tblGrid>
  <w:tr>
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="4600" w:type="dxa"/>
      </w:tcPr>
      <w:p>
        <w:pPr><w:jc w:val="left"/><w:spacing w:after="40"/></w:pPr>
        <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr><w:t>Mengetahui,</w:t></w:r>
      </w:p>
      <w:p>
        <w:pPr><w:jc w:val="left"/><w:spacing w:after="100"/></w:pPr>
        <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>Kepala ${escapeXml(replacements.targetSchool)}</w:t></w:r>
      </w:p>
      <w:p><w:pPr><w:spacing w:before="680" w:after="0"/><w:jc w:val="left"/></w:pPr><w:r><w:t></w:t></w:r></w:p>
      <w:p>
        <w:pPr><w:jc w:val="left"/><w:spacing w:after="30"/></w:pPr>
        <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:u w:val="single"/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(replacements.targetHeadmaster)}</w:t></w:r>
      </w:p>
      <w:p>
        <w:pPr><w:jc w:val="left"/><w:spacing w:after="0"/></w:pPr>
        <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="22"/></w:rPr><w:t>NIP. ${escapeXml(replacements.targetHeadmasterNip || '-')}</w:t></w:r>
      </w:p>
    </w:tc>
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="4600" w:type="dxa"/>
      </w:tcPr>
      <w:p>
        <w:pPr><w:jc w:val="left"/><w:spacing w:after="40"/></w:pPr>
        <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(dateLoc)}</w:t></w:r>
      </w:p>
      <w:p>
        <w:pPr><w:jc w:val="left"/><w:spacing w:after="100"/></w:pPr>
        <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>Guru Mata Pelajaran ${escapeXml(replacements.subject || 'Mata Pelajaran')}</w:t></w:r>
      </w:p>
      <w:p><w:pPr><w:spacing w:before="680" w:after="0"/><w:jc w:val="left"/></w:pPr><w:r><w:t></w:t></w:r></w:p>
      <w:p>
        <w:pPr><w:jc w:val="left"/><w:spacing w:after="30"/></w:pPr>
        <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:u w:val="single"/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(replacements.targetTeacher)}</w:t></w:r>
      </w:p>
      <w:p>
        <w:pPr><w:jc w:val="left"/><w:spacing w:after="0"/></w:pPr>
        <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="22"/></w:rPr><w:t>NIP. ${escapeXml(replacements.targetTeacherNip || '-')}</w:t></w:r>
      </w:p>
    </w:tc>
  </w:tr>
</w:tbl>
`;
  const parsedTbl = parser.parseFromString(tableXmlString, 'application/xml');
  return xmlDoc.importNode(parsedTbl.documentElement, true);
}

function createDocxKopHeader(xmlDoc: Document, replacements: DocxReplacements): Element[] {
  const parser = new DOMParser();
  const kopXmlString = `
<w:wrapper xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="40"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(replacements.targetSchool.toUpperCase())}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="40"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>PERANGKAT PEMBELAJARAN / MODUL AJAR KURIKULUM MERDEKA</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="140"/><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="4" w:color="000000"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="22"/></w:rPr><w:t>TAHUN PELAJARAN ${escapeXml(replacements.targetYear)}</w:t></w:r>
  </w:p>
  <w:p><w:pPr><w:spacing w:after="160"/></w:pPr></w:p>
</w:wrapper>
`;
  const parsed = parser.parseFromString(kopXmlString, 'application/xml');
  const nodes = Array.from(parsed.documentElement.childNodes).filter(
    (n) => n.nodeType === Node.ELEMENT_NODE
  ) as Element[];
  return nodes.map((n) => xmlDoc.importNode(n, true));
}

// Helper Function: Pure JSZip XML DOCX Processing Engine with 100% Layout & Formatting Preservation
export async function processDocxArrayBuffer(
  arrayBuffer: ArrayBuffer,
  replacements: DocxReplacements
): Promise<{ blob: Blob; count: number }> {
  const zip = await JSZip.loadAsync(arrayBuffer);
  let totalReplacementCount = 0;

  // XML files to inspect inside the docx container (body, header, footer, footnotes)
  const targetXmlFiles = Object.keys(zip.files).filter((fileName) => {
    return (
      fileName.startsWith('word/document') ||
      fileName.startsWith('word/header') ||
      fileName.startsWith('word/footer') ||
      fileName.startsWith('word/footnotes') ||
      fileName.startsWith('word/endnotes')
    );
  });

  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  // Compute fallbacks if place/date values are blank
  const fallbackPlace = replacements.targetPlace?.trim() || 'Kota';
  const fallbackDate =
    replacements.targetDate?.trim() ||
    new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const fallbackDateLocation = replacements.targetDateLocation?.trim() || `${fallbackPlace}, ${fallbackDate}`;

  // Tag replacements mapping
  const tagList: Array<{ tags: string[]; val: string }> = [
    { tags: ['{{NAMA_SEKOLAH}}', '{NAMA_SEKOLAH}', '[NAMA_SEKOLAH]'], val: replacements.targetSchool },
    { tags: ['{{NAMA_GURU}}', '{NAMA_GURU}', '[NAMA_GURU]'], val: replacements.targetTeacher },
    { tags: ['{{NIP_GURU}}', '{NIP_GURU}', '[NIP_GURU]'], val: replacements.targetTeacherNip },
    { tags: ['{{NAMA_KEPSEK}}', '{NAMA_KEPSEK}', '[NAMA_KEPSEK]'], val: replacements.targetHeadmaster },
    { tags: ['{{NIP_KEPSEK}}', '{NIP_KEPSEK}', '[NIP_KEPSEK]'], val: replacements.targetHeadmasterNip },
    { tags: ['{{TAHUN_AJARAN}}', '{TAHUN_AJARAN}', '[TAHUN_AJARAN]'], val: replacements.targetYear },
    { tags: ['{{SEMESTER}}', '{SEMESTER}', '[SEMESTER]'], val: replacements.targetSemester },
    { tags: ['{{KOTA_TANGGAL}}', '{KOTA_TANGGAL}', '[KOTA_TANGGAL]', '{{TEMPAT_TANGGAL}}', '{TEMPAT_TANGGAL}'], val: fallbackDateLocation },
    { tags: ['{{TEMPAT}}', '{TEMPAT}', '[TEMPAT]', '{{KOTA}}', '{KOTA}', '[KOTA]'], val: fallbackPlace },
    { tags: ['{{TANGGAL}}', '{TANGGAL}', '[TANGGAL]', '{{TANGGAL_PENGESAHAN}}', '{TANGGAL_PENGESAHAN}'], val: fallbackDate },
    { tags: ['{{MATA_PELAJARAN}}', '{MATA_PELAJARAN}', '[MATA_PELAJARAN]'], val: replacements.subject || 'Pendidikan Pancasila' },
  ];

  // Smart label patterns mapping
  const smartRules = [
    {
      labelRegex: /^(Nama\s+Penyusun|Nama\s+Guru|Guru\s+Mata\s+Pelajaran|Guru\s+Pengampu|Nama\s+Pendidik|Penyusun)\b/i,
      targetVal: replacements.targetTeacher,
    },
    {
      labelRegex: /^(Satuan\s+Pendidikan|Nama\s+Sekolah|Nama\s+Satuan\s+Pendidikan|Sekolah|Instansi|Unit\s+Kerja)\b/i,
      targetVal: replacements.targetSchool,
    },
    {
      labelRegex: /^(Tahun\s+Pelajaran|Tahun\s+Ajaran|Tahun\s+Akademik)\b/i,
      targetVal: replacements.targetYear,
    },
    {
      labelRegex: /^(Semester)\b/i,
      targetVal: replacements.targetSemester,
    },
    {
      labelRegex: /^(NIP(?:\s*Guru|\s*Penyusun|\s*Pendidik)?)\b/i,
      targetVal: replacements.targetTeacherNip,
    },
    {
      labelRegex: /^(NIP(?:\s*Kepala\s*Sekolah|\s*Kepsek|\s*KS))\b/i,
      targetVal: replacements.targetHeadmasterNip,
    },
    {
      labelRegex: /^(Nama\s+Kepala\s+Sekolah|Kepala\s+Sekolah|Kepala\s+Satuan\s+Pendidikan)\b/i,
      targetVal: replacements.targetHeadmaster,
    },
    {
      labelRegex: /^(Kota|Tempat|Kabupaten)\s*(?:,?\s*Tanggal|\/Tanggal)?\b/i,
      targetVal: fallbackDateLocation,
    },
    {
      labelRegex: /^(Tanggal\s+Pengesahan|Tanggal\s+Penyusunan|Tanggal\s+Pembuatan|Titimangsa)\b/i,
      targetVal: fallbackDate,
    },
  ];

  // Direct old-to-new list
  const directList: Array<{ oldVal?: string; newVal?: string }> = [
    { oldVal: replacements.oldSchool, newVal: replacements.targetSchool },
    { oldVal: replacements.oldTeacher, newVal: replacements.targetTeacher },
    { oldVal: replacements.oldTeacherNip, newVal: replacements.targetTeacherNip },
    { oldVal: replacements.oldHeadmaster, newVal: replacements.targetHeadmaster },
    { oldVal: replacements.oldHeadmasterNip, newVal: replacements.targetHeadmasterNip },
    { oldVal: replacements.oldYear, newVal: replacements.targetYear },
    { oldVal: replacements.oldDateLocation, newVal: fallbackDateLocation },
    { oldVal: replacements.oldPlace, newVal: fallbackPlace },
    { oldVal: replacements.oldDate, newVal: fallbackDate },
  ];

  for (const fileName of targetXmlFiles) {
    const file = zip.files[fileName];
    if (!file || file.dir) continue;

    const xmlText = await file.async('string');
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) continue;

    let xmlModified = false;

    // 1. Process all Paragraphs (<w:p>) using Surgical Run-Level Modification
    const paragraphs = Array.from(xmlDoc.getElementsByTagName('w:p'));

    for (const para of paragraphs) {
      const runs = Array.from(para.getElementsByTagName('w:r'));
      if (runs.length === 0) continue;

      const pText = (para.textContent || '').trim();
      if (!pText) continue;

      let paraHandledBySmartRule = false;

      // A. Smart Rule Matching: Preserve all tabs (<w:tab/>) & run properties (<w:rPr>)
      if (replacements.enableSmartPattern) {
        for (const rule of smartRules) {
          if (!rule.targetVal || rule.targetVal.trim().length === 0) continue;
          if (rule.targetVal === '----------------') continue;

          if (rule.labelRegex.test(pText)) {
            // Locate the specific run containing the colon ':' or '=' separator
            let colonRunIdx = -1;
            let colonTextNode: Element | null = null;

            for (let rIdx = 0; rIdx < runs.length; rIdx++) {
              const tNodes = Array.from(runs[rIdx].getElementsByTagName('w:t'));
              for (const tn of tNodes) {
                if (tn.textContent && (tn.textContent.includes(':') || tn.textContent.includes('='))) {
                  colonRunIdx = rIdx;
                  colonTextNode = tn;
                  break;
                }
              }
              if (colonRunIdx !== -1) break;
            }

            if (colonTextNode && colonRunIdx !== -1) {
              const orig = colonTextNode.textContent || '';
              const sepIdx = orig.indexOf(':') !== -1 ? orig.indexOf(':') : orig.indexOf('=');
              const prefix = orig.substring(0, sepIdx + 1);

              // Update the text node containing the colon, keeping tabs in other runs untouched!
              colonTextNode.textContent = `${prefix} ${rule.targetVal}`;
              colonTextNode.setAttribute('xml:space', 'preserve');

              // Clear text in subsequent runs of this paragraph that belonged to the old value
              for (let nextR = colonRunIdx + 1; nextR < runs.length; nextR++) {
                const nextTNodes = Array.from(runs[nextR].getElementsByTagName('w:t'));
                for (const ntn of nextTNodes) {
                  ntn.textContent = '';
                }
              }

              xmlModified = true;
              totalReplacementCount++;
              paraHandledBySmartRule = true;
              break;
            }
          }
        }
      }

      // If smart rule already handled this paragraph cleanly, skip further changes on it
      if (paraHandledBySmartRule) continue;

      // B. Tag Placeholders inside Individual Runs
      tagList.forEach(({ tags, val }) => {
        if (!val || val.trim().length === 0) return;
        tags.forEach((tag) => {
          runs.forEach((r) => {
            const tNodes = Array.from(r.getElementsByTagName('w:t'));
            tNodes.forEach((tn) => {
              if (tn.textContent && tn.textContent.includes(tag)) {
                const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                tn.textContent = tn.textContent.replace(new RegExp(esc, 'g'), val);
                tn.setAttribute('xml:space', 'preserve');
                xmlModified = true;
                totalReplacementCount++;
              }
            });
          });
        });
      });

      // C. Direct Replacement for Known Old Values inside Individual Runs
      directList.forEach(({ oldVal, newVal }) => {
        if (oldVal && oldVal.trim().length > 1 && newVal && oldVal !== newVal) {
          const trimmedOld = oldVal.trim();
          const escaped = trimmedOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escaped, 'gi');

          runs.forEach((r) => {
            const tNodes = Array.from(r.getElementsByTagName('w:t'));
            tNodes.forEach((tn) => {
              if (tn.textContent && regex.test(tn.textContent)) {
                tn.textContent = tn.textContent.replace(regex, newVal);
                tn.setAttribute('xml:space', 'preserve');
                xmlModified = true;
                totalReplacementCount++;
              }
            });
          });
        }
      });
    }

    // 2. Table-Aware Scanner: Inspect multi-cell rows inside <w:tbl> without modifying table structure
    const tables = Array.from(xmlDoc.getElementsByTagName('w:tbl'));
    for (const table of tables) {
      const rows = Array.from(table.getElementsByTagName('w:tr'));
      for (const row of rows) {
        const cells = Array.from(row.getElementsByTagName('w:tc'));
        if (cells.length >= 2) {
          const cell0Paras = Array.from(cells[0].getElementsByTagName('w:p'));
          const cell0Text = cell0Paras
            .map((p) => Array.from(p.getElementsByTagName('w:t')).map((t) => t.textContent || '').join(''))
            .join(' ')
            .trim();

          let targetVal: string | null = null;
          if (/^(Satuan\s+Pendidikan|Nama\s+Sekolah|Sekolah|Instansi)\b/i.test(cell0Text) && replacements.targetSchool) {
            targetVal = replacements.targetSchool;
          } else if (/^(Nama\s+Penyusun|Nama\s+Guru|Guru\s+Mata\s+Pelajaran|Penyusun|Guru\s+Pengampu)\b/i.test(cell0Text) && replacements.targetTeacher) {
            targetVal = replacements.targetTeacher;
          } else if (/^(NIP(?:\s*Guru|\s*Penyusun)?)\b/i.test(cell0Text) && replacements.targetTeacherNip && replacements.targetTeacherNip !== '----------------') {
            targetVal = replacements.targetTeacherNip;
          } else if (/^(Nama\s+Kepala\s+Sekolah|Kepala\s+Sekolah|Kepala\s+SMP|Kepsek)\b/i.test(cell0Text) && replacements.targetHeadmaster) {
            targetVal = replacements.targetHeadmaster;
          } else if (/^(NIP(?:\s*Kepala|\s*Kepsek)?)\b/i.test(cell0Text) && replacements.targetHeadmasterNip && replacements.targetHeadmasterNip !== '----------------') {
            targetVal = replacements.targetHeadmasterNip;
          } else if (/^(Tahun\s+Pelajaran|Tahun\s+Ajaran|Tahun\s+Akademik)\b/i.test(cell0Text) && replacements.targetYear) {
            targetVal = replacements.targetYear;
          } else if (/^(Semester)\b/i.test(cell0Text) && replacements.targetSemester) {
            targetVal = replacements.targetSemester;
          } else if (/^(Mata\s+Pelajaran|Mapel)\b/i.test(cell0Text) && replacements.subject) {
            targetVal = replacements.subject;
          }

          if (targetVal) {
            const valCell = cells[cells.length - 1];
            const valParas = Array.from(valCell.getElementsByTagName('w:p'));
            if (valParas.length > 0) {
              const valTextNodes = Array.from(valParas[0].getElementsByTagName('w:t'));
              if (valTextNodes.length > 0) {
                const currentCellText = valTextNodes.map((n) => n.textContent || '').join('');
                if (currentCellText !== targetVal) {
                  valTextNodes[0].textContent = targetVal;
                  valTextNodes[0].setAttribute('xml:space', 'preserve');
                  for (let k = 1; k < valTextNodes.length; k++) {
                    valTextNodes[k].textContent = '';
                  }
                  xmlModified = true;
                  totalReplacementCount++;
                }
              }
            }
          }
        }
      }
    }

    // 3. Inject Optional Kop Surat & Validation Signature Block into main document.xml
    if (fileName === 'word/document.xml') {
      const bodies = xmlDoc.getElementsByTagName('w:body');
      if (bodies.length > 0) {
        const body = bodies[0];

        // A. Inject Kop Header if requested
        if (replacements.includeExtraKop) {
          const kopElements = createDocxKopHeader(xmlDoc, replacements);
          const firstChild = body.firstChild;
          if (firstChild) {
            kopElements.forEach((el) => body.insertBefore(el, firstChild));
          } else {
            kopElements.forEach((el) => body.appendChild(el));
          }
          xmlModified = true;
          totalReplacementCount++;
        }

        // B. Inject Signature Table if requested
        if (replacements.includeExtraSignature) {
          const sigTableElement = createDocxSignatureTable(
            xmlDoc,
            replacements,
            fallbackDateLocation
          );
          const sectPrList = body.getElementsByTagName('w:sectPr');
          const lastSectPr = sectPrList.length > 0 ? sectPrList[sectPrList.length - 1] : null;

          // Add a spacing separator paragraph before the table
          const spacingP = xmlDoc.createElementNS(
            'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
            'w:p'
          );
          const pPr = xmlDoc.createElementNS(
            'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
            'w:pPr'
          );
          const spacing = xmlDoc.createElementNS(
            'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
            'w:spacing'
          );
          spacing.setAttribute('w:before', '240');
          spacing.setAttribute('w:after', '120');
          pPr.appendChild(spacing);
          spacingP.appendChild(pPr);

          if (lastSectPr && lastSectPr.parentNode === body) {
            body.insertBefore(spacingP, lastSectPr);
            body.insertBefore(sigTableElement, lastSectPr);
          } else {
            body.appendChild(spacingP);
            body.appendChild(sigTableElement);
          }
          xmlModified = true;
          totalReplacementCount++;
        }
      }
    }

    if (xmlModified) {
      const updatedXmlStr = serializer.serializeToString(xmlDoc);
      zip.file(fileName, updatedXmlStr);
    }
  }

  const outputBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return {
    blob: outputBlob,
    count: totalReplacementCount,
  };
}
