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
}

// Helper Function: Pure JSZip XML DOCX Processing Engine
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

  for (const fileName of targetXmlFiles) {
    const file = zip.files[fileName];
    if (!file || file.dir) continue;

    const xmlText = await file.async('string');
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) continue;

    let xmlModified = false;
    const paragraphs = Array.from(xmlDoc.getElementsByTagName('w:p'));

    for (const para of paragraphs) {
      const textNodes = Array.from(para.getElementsByTagName('w:t'));
      if (textNodes.length === 0) continue;

      let originalParaText = textNodes.map((node) => node.textContent || '').join('');
      let updatedParaText = originalParaText;

      // Compute fallbacks if place/date values are blank
      const fallbackPlace = replacements.targetPlace?.trim() || 'Kota';
      const fallbackDate = replacements.targetDate?.trim() || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      const fallbackDateLocation = replacements.targetDateLocation?.trim() || `${fallbackPlace}, ${fallbackDate}`;

      // 1. Tag Placeholders
      const tagReplacements: Array<{ tags: string[]; newVal: string }> = [
        { tags: ['{{NAMA_SEKOLAH}}', '{NAMA_SEKOLAH}', '[NAMA_SEKOLAH]'], newVal: replacements.targetSchool },
        { tags: ['{{NAMA_GURU}}', '{NAMA_GURU}', '[NAMA_GURU]'], newVal: replacements.targetTeacher },
        { tags: ['{{NIP_GURU}}', '{NIP_GURU}', '[NIP_GURU]'], newVal: replacements.targetTeacherNip },
        { tags: ['{{NAMA_KEPSEK}}', '{NAMA_KEPSEK}', '[NAMA_KEPSEK]'], newVal: replacements.targetHeadmaster },
        { tags: ['{{NIP_KEPSEK}}', '{NIP_KEPSEK}', '[NIP_KEPSEK]'], newVal: replacements.targetHeadmasterNip },
        { tags: ['{{TAHUN_AJARAN}}', '{TAHUN_AJARAN}', '[TAHUN_AJARAN]'], newVal: replacements.targetYear },
        { tags: ['{{SEMESTER}}', '{SEMESTER}', '[SEMESTER]'], newVal: replacements.targetSemester },
        { tags: ['{{KOTA_TANGGAL}}', '{KOTA_TANGGAL}', '[KOTA_TANGGAL]', '{{TEMPAT_TANGGAL}}', '{TEMPAT_TANGGAL}'], newVal: fallbackDateLocation },
        { tags: ['{{TEMPAT}}', '{TEMPAT}', '[TEMPAT]', '{{KOTA}}', '{KOTA}', '[KOTA]'], newVal: fallbackPlace },
        { tags: ['{{TANGGAL}}', '{TANGGAL}', '[TANGGAL]', '{{TANGGAL_PENGESAHAN}}', '{TANGGAL_PENGESAHAN}'], newVal: fallbackDate },
        { tags: ['{{MATA_PELAJARAN}}', '{MATA_PELAJARAN}', '[MATA_PELAJARAN]'], newVal: replacements.subject || 'Matematika' },
      ];

      tagReplacements.forEach(({ tags, newVal }) => {
        if (!newVal) return;
        tags.forEach((tag) => {
          if (updatedParaText.includes(tag)) {
            const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'g');
            const matches = updatedParaText.match(regex);
            if (matches) {
              totalReplacementCount += matches.length;
              updatedParaText = updatedParaText.replace(regex, newVal);
            }
          }
        });
      });

      // 2. Smart Label Pattern Replacements
      if (replacements.enableSmartPattern) {
        // Label Sekolah
        const schoolPattern = /(Satuan\s+Pendidikan|Nama\s+Sekolah|Sekolah)\s*[:=]\s*([^\r\n<]+)/gi;
        updatedParaText = updatedParaText.replace(schoolPattern, (match, p1) => {
          totalReplacementCount++;
          return `${p1} : ${replacements.targetSchool}`;
        });

        // Label Penyusun/Guru
        const teacherPattern = /(Nama\s+Penyusun|Nama\s+Guru|Penyusun|Guru\s+Mata\s+Pelajaran)\s*[:=]\s*([^\r\n<]+)/gi;
        updatedParaText = updatedParaText.replace(teacherPattern, (match, p1) => {
          totalReplacementCount++;
          return `${p1} : ${replacements.targetTeacher}`;
        });

        // Label NIP Guru / Penyusun
        const nipPattern = /(NIP(?:\s*Guru|\s*Penyusun)?)\s*[:=.]?\s*([0-9\s-]+)/gi;
        updatedParaText = updatedParaText.replace(nipPattern, (match, p1) => {
          totalReplacementCount++;
          return `${p1} : ${replacements.targetTeacherNip}`;
        });

        // Label NIP Kepsek
        const nipKepsekPattern = /(NIP(?:\s*Kepala\s*Sekolah|\s*Kepsek))\s*[:=.]?\s*([0-9\s-]+)/gi;
        updatedParaText = updatedParaText.replace(nipKepsekPattern, (match, p1) => {
          totalReplacementCount++;
          return `${p1} : ${replacements.targetHeadmasterNip}`;
        });

        // Label Tahun Ajaran
        const yearPattern = /(Tahun\s+Pelajaran|Tahun\s+Ajaran)\s*[:=]\s*([^\r\n<]+)/gi;
        updatedParaText = updatedParaText.replace(yearPattern, (match, p1) => {
          totalReplacementCount++;
          return `${p1} : ${replacements.targetYear}`;
        });

        // Label Semester
        const semesterPattern = /(Semester)\s*[:=]\s*([^\r\n<]+)/gi;
        updatedParaText = updatedParaText.replace(semesterPattern, (match, p1) => {
          totalReplacementCount++;
          return `${p1} : ${replacements.targetSemester}`;
        });

        // Label Kota / Tempat / Tanggal
        if (fallbackDateLocation) {
          const dateLocPattern = /(Kota|Tempat|Kabupaten)\s*(?:,?\s*Tanggal|\/Tanggal)?\s*[:=]\s*([^\r\n<]+)/gi;
          updatedParaText = updatedParaText.replace(dateLocPattern, (match, p1) => {
            totalReplacementCount++;
            return `${p1} : ${fallbackDateLocation}`;
          });
        }

        if (fallbackDate) {
          const datePattern = /(Tanggal\s+Pengesahan|Tanggal\s+Penyusunan|Tanggal\s+Pembuatan)\s*[:=]\s*([^\r\n<]+)/gi;
          updatedParaText = updatedParaText.replace(datePattern, (match, p1) => {
            totalReplacementCount++;
            return `${p1} : ${fallbackDate}`;
          });
        }
      }

      // 3. Direct Old Values Replacement
      const directList: Array<{ oldVal?: string; newVal?: string }> = [
        { oldVal: replacements.oldSchool, newVal: replacements.targetSchool },
        { oldVal: replacements.oldTeacher, newVal: replacements.targetTeacher },
        { oldVal: replacements.oldTeacherNip, newVal: replacements.targetTeacherNip },
        { oldVal: replacements.oldHeadmaster, newVal: replacements.targetHeadmaster },
        { oldVal: replacements.oldHeadmasterNip, newVal: replacements.targetHeadmasterNip },
        { oldVal: replacements.oldYear, newVal: replacements.targetYear },
        { oldVal: replacements.oldDateLocation, newVal: replacements.targetDateLocation },
        { oldVal: replacements.oldPlace, newVal: replacements.targetPlace },
        { oldVal: replacements.oldDate, newVal: replacements.targetDate },
      ];

      directList.forEach(({ oldVal, newVal }) => {
        if (oldVal && oldVal.trim().length > 1 && oldVal !== newVal) {
          const escaped = oldVal.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escaped, 'gi');
          const matches = updatedParaText.match(regex);
          if (matches) {
            totalReplacementCount += matches.length;
            updatedParaText = updatedParaText.replace(regex, newVal);
          }

          // Flex space regex (e.g. "SMP   Negeri 1")
          const flexSpaceOld = oldVal.trim().replace(/\s+/g, '\\s+');
          const flexRegex = new RegExp(flexSpaceOld, 'gi');
          const flexMatches = updatedParaText.match(flexRegex);
          if (flexMatches) {
            totalReplacementCount += flexMatches.length;
            updatedParaText = updatedParaText.replace(flexRegex, newVal);
          }
        }
      });

      // Update XML text node if paragraph text changed
      if (updatedParaText !== originalParaText) {
        xmlModified = true;
        textNodes[0].textContent = updatedParaText;
        textNodes[0].setAttribute('xml:space', 'preserve');

        for (let i = 1; i < textNodes.length; i++) {
          textNodes[i].textContent = '';
        }
      }
    }

    if (xmlModified) {
      const updatedXmlStr = serializer.serializeToString(xmlDoc);
      zip.file(fileName, updatedXmlStr);
    }
  }

  const resultBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
  });

  return { blob: resultBlob, count: totalReplacementCount };
}
