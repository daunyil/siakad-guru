import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { SchoolProfile, TeacherProfile, AcademicYear } from '../../../types';
import { SAMPLE_INTERNET_DOCS } from '../../../data/sampleDocsPresets';
import mammoth from 'mammoth';
import type {
  TargetIdentityState,
  OldIdentityState,
  UploadedFileItem,
  ValidationDefaultsResult,
} from './types';

interface UseIdentityReplacerParams {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
}

export function useIdentityReplacer({ school, teacher, year }: UseIdentityReplacerParams) {
  // Preset or custom document text & HTML
  const [selectedPresetId, setSelectedPresetId] = useState<string>('modul-matematika');
  const [docText, setDocText] = useState<string>(SAMPLE_INTERNET_DOCS[0].content);
  const [docHtml, setDocHtml] = useState<string | null>(null);

  // Uploaded buffers & files
  const [uploadedDocxBuffer, setUploadedDocxBuffer] = useState<ArrayBuffer | null>(null);
  const [uploadedDocxName, setUploadedDocxName] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false);

  // Status Toast Message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string, duration = 3500) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage((current) => (current === msg ? null : current));
    }, duration);
  }, []);

  // Default values
  const defaultDistrict = school.district || 'Kota';
  const defaultFormattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Target Identity State
  const [targetSchool, setTargetSchool] = useState<string>(school.name);
  const [targetTeacher, setTargetTeacher] = useState<string>(teacher.name);
  const [targetTeacherNip, setTargetTeacherNip] = useState<string>(teacher.nip || '----------------');
  const [targetHeadmaster, setTargetHeadmaster] = useState<string>(school.headmasterName);
  const [targetHeadmasterNip, setTargetHeadmasterNip] = useState<string>(school.headmasterNip || '----------------');
  const [targetYear, setTargetYear] = useState<string>(year.label);
  const [targetSemester, setTargetSemester] = useState<string>(year.semester === 1 ? 'Ganjil' : 'Genap');
  const [targetPlace, setTargetPlace] = useState<string>(defaultDistrict);
  const [targetDate, setTargetDate] = useState<string>(defaultFormattedDate);
  const [targetDateLocation, setTargetDateLocation] = useState<string>(`${defaultDistrict}, ${defaultFormattedDate}`);

  // Old Identity State (Search criteria)
  const [oldSchool, setOldSchool] = useState<string>('SMP Negeri 1 Jakarta');
  const [oldTeacher, setOldTeacher] = useState<string>('Budi Santoso, S.Pd., M.Pd.');
  const [oldTeacherNip, setOldTeacherNip] = useState<string>('19820510 200801 1 012');
  const [oldHeadmaster, setOldHeadmaster] = useState<string>('Dr. H. Mulyadi, M.Pd.');
  const [oldHeadmasterNip, setOldHeadmasterNip] = useState<string>('19700312 199503 1 002');
  const [oldYear, setOldYear] = useState<string>('2023/2024');
  const [oldPlace, setOldPlace] = useState<string>('Jakarta');
  const [oldDate, setOldDate] = useState<string>('17 Juli 2023');
  const [oldDateLocation, setOldDateLocation] = useState<string>('Jakarta, 17 Juli 2023');

  // Display Options
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'batch'>('preview');
  const [previewLayoutMode, setPreviewLayoutMode] = useState<'docx' | 'structured' | 'raw'>('docx');
  const [enableSmartPatternReplace, setEnableSmartPatternReplace] = useState<boolean>(true);
  const [includeExtraKop, setIncludeExtraKop] = useState<boolean>(false);
  const [includeExtraSignature, setIncludeExtraSignature] = useState<boolean>(false);
  const [highlightReplacements, setHighlightReplacements] = useState<boolean>(true);

  // Sync profile changes into target state
  useEffect(() => {
    if (school.name) setTargetSchool(school.name);
    if (teacher.name) setTargetTeacher(teacher.name);
    if (teacher.nip) setTargetTeacherNip(teacher.nip);
    if (school.headmasterName) setTargetHeadmaster(school.headmasterName);
    if (school.headmasterNip) setTargetHeadmasterNip(school.headmasterNip);
    if (year.label) setTargetYear(year.label);
    if (year.semester) setTargetSemester(year.semester === 1 ? 'Ganjil' : 'Genap');
  }, [school, teacher, year]);

  // Sync Target Place & Date Handlers
  const handleTargetPlaceChange = useCallback((val: string) => {
    setTargetPlace(val);
    setTargetDateLocation((prevLoc) => {
      const parts = prevLoc.split(',');
      const currentDate = parts.length > 1 ? parts.slice(1).join(',').trim() : defaultFormattedDate;
      return val ? `${val}, ${currentDate}` : currentDate;
    });
  }, [defaultFormattedDate]);

  const handleTargetDateChange = useCallback((val: string) => {
    setTargetDate(val);
    setTargetDateLocation((prevLoc) => {
      const parts = prevLoc.split(',');
      const currentPlace = parts.length > 0 && parts[0].trim() ? parts[0].trim() : defaultDistrict;
      return currentPlace ? `${currentPlace}, ${val}` : val;
    });
  }, [defaultDistrict]);

  const handleTargetDateLocationChange = useCallback((val: string) => {
    setTargetDateLocation(val);
    if (val.includes(',')) {
      const parts = val.split(',');
      setTargetPlace(parts[0].trim());
      setTargetDate(parts.slice(1).join(',').trim());
    }
  }, []);

  // Sync Old Place & Date Handlers
  const handleOldPlaceChange = useCallback((val: string) => {
    setOldPlace(val);
    setOldDateLocation((prev) => (val && prev.includes(',') ? `${val}, ${prev.split(',')[1].trim()}` : val));
  }, []);

  const handleOldDateChange = useCallback((val: string) => {
    setOldDate(val);
    setOldDateLocation((prev) => (val && prev.includes(',') ? `${prev.split(',')[0].trim()}, ${val}` : val));
  }, []);

  const handleOldDateLocationChange = useCallback((val: string) => {
    setOldDateLocation(val);
    if (val.includes(',')) {
      const parts = val.split(',');
      setOldPlace(parts[0].trim());
      setOldDate(parts.slice(1).join(',').trim());
    }
  }, []);

  // Validation before downloading/copying/printing
  const validateAndApplyDefaults = useCallback((): ValidationDefaultsResult => {
    let p = targetPlace ? targetPlace.trim() : '';
    let d = targetDate ? targetDate.trim() : '';
    let dl = targetDateLocation ? targetDateLocation.trim() : '';
    let wasAutofilled = false;

    if (!p) {
      p = defaultDistrict;
      setTargetPlace(p);
      wasAutofilled = true;
    }
    if (!d) {
      d = defaultFormattedDate;
      setTargetDate(d);
      wasAutofilled = true;
    }
    if (!dl || (p && d && !dl.includes(p))) {
      dl = `${p}, ${d}`;
      setTargetDateLocation(dl);
      wasAutofilled = true;
    }

    if (wasAutofilled) {
      showToast(
        `⚠️ Tempat/Tanggal kosong diisi otomatis dengan nilai default (${p}, ${d}) agar dokumen rapi tanpa placeholder tertinggal!`,
        4000
      );
    }

    return { place: p, date: d, dateLoc: dl, wasAutofilled };
  }, [targetPlace, targetDate, targetDateLocation, defaultDistrict, defaultFormattedDate, showToast]);

  // Auto-detection logic from text
  const handleAutoDetect = useCallback(
    (inputText?: unknown) => {
      const textToScan =
        typeof inputText === 'string' && inputText.trim().length > 0
          ? inputText
          : typeof docText === 'string'
          ? docText
          : '';

      if (!textToScan || typeof textToScan.match !== 'function') {
        return;
      }

      let detectedCount = 0;

      const schoolMatch = textToScan.match(
        /(?:Satuan\s+Pendidikan|Nama\s+Sekolah|Nama\s+Satuan\s+Pendidikan|Sekolah|Instansi)\s*[:=]\s*([^\n\r<]+)/i
      );
      if (schoolMatch && schoolMatch[1] && schoolMatch[1].trim().length > 1) {
        setOldSchool(schoolMatch[1].trim());
        detectedCount++;
      }

      const teacherMatch = textToScan.match(
        /(?:Nama\s+Penyusun|Nama\s+Guru|Guru\s+Mata\s+Pelajaran|Guru\s+Pengampu|Penyusun|Guru)\s*[:=]\s*([^\n\r<]+)/i
      );
      if (teacherMatch && teacherMatch[1] && teacherMatch[1].trim().length > 1) {
        setOldTeacher(teacherMatch[1].trim());
        detectedCount++;
      }

      const nipMatch = textToScan.match(
        /(?:NIP(?:\s*Guru|\s*Penyusun|\s*Pendidik)?)\s*[:=.]?\s*([0-9\s-._]{6,})/i
      );
      if (nipMatch && nipMatch[1] && nipMatch[1].trim().length > 3) {
        setOldTeacherNip(nipMatch[1].trim());
        detectedCount++;
      }

      const yearMatch = textToScan.match(
        /(?:Tahun\s+Pelajaran|Tahun\s+Ajaran|Tahun\s+Akademik)\s*[:=]\s*([^\n\r<]+)/i
      );
      if (yearMatch && yearMatch[1] && yearMatch[1].trim().length > 1) {
        setOldYear(yearMatch[1].trim());
        detectedCount++;
      }

      const headmasterMatch = textToScan.match(
        /(?:Kepala\s+Sekolah|Kepala\s+SMP[^\n\r]*|Kepala\s+Satuan\s+Pendidikan)\n+([^\n\r]+)/i
      );
      if (headmasterMatch && headmasterMatch[1] && headmasterMatch[1].trim().length > 1) {
        setOldHeadmaster(headmasterMatch[1].trim());
        detectedCount++;
      }

      const dateLocMatch = textToScan.match(
        /([A-Z][a-zA-Z\s]+),\s*(\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+\d{4})/i
      );
      if (dateLocMatch) {
        const fullDL = dateLocMatch[0].trim();
        setOldDateLocation(fullDL);
        if (dateLocMatch[1]) setOldPlace(dateLocMatch[1].trim());
        if (dateLocMatch[2]) setOldDate(dateLocMatch[2].trim());
        detectedCount++;
      }

      if (detectedCount > 0) {
        showToast(`Berhasil mendeteksi ${detectedCount} bidang identitas lama dari dokumen!`);
      } else {
        showToast(
          `Dokumen format template siap pakai terdeteksi. Penggantian cerdas otomatis mengadaptasi ke: ${targetSchool} - ${targetTeacher}.`
        );
      }
    },
    [docText, showToast, targetSchool, targetTeacher]
  );

  // Load Preset Handler
  const handleSelectPreset = useCallback(
    (presetId: string) => {
      setSelectedPresetId(presetId);
      setDocHtml(null);
      if (presetId === 'modul-ajar-bab-1') {
        handleLoadUploadedDocxWorkspace();
        return;
      }
      setUploadedDocxBuffer(null);
      setUploadedDocxName(null);
      setPreviewLayoutMode('structured');

      const found = SAMPLE_INTERNET_DOCS.find((d) => d.id === presetId);
      if (found) {
        setDocText(found.content);
        if (presetId === 'modul-matematika') {
          setOldSchool('SMP Negeri 1 Jakarta');
          setOldTeacher('Budi Santoso, S.Pd., M.Pd.');
          setOldTeacherNip('19820510 200801 1 012');
          setOldHeadmaster('Dr. H. Mulyadi, M.Pd.');
          setOldHeadmasterNip('19700312 199503 1 002');
          setOldYear('2023/2024');
          setOldPlace('Jakarta');
          setOldDate('17 Juli 2023');
          setOldDateLocation('Jakarta, 17 Juli 2023');
        } else if (presetId === 'rpp-pancasila') {
          setOldSchool('SMPN 2 Bandung');
          setOldTeacher('Hj. Siti Rahmah, S.Pd.');
          setOldTeacherNip('19780415 200312 2 005');
          setOldHeadmaster('Drs. Ahmad Dahlan, M.M.');
          setOldHeadmasterNip('19680101 199303 1 003');
          setOldYear('2022/2023');
          setOldPlace('Bandung');
          setOldDate('08 Januari 2023');
          setOldDateLocation('Bandung, 08 Januari 2023');
        }
      }
    },
    []
  );

  // Quick load workspace uploaded docx (7.1 Modul Ajar Bab 1.docx)
  const handleLoadUploadedDocxWorkspace = useCallback(async () => {
    try {
      showToast('Memuat file 7.1 Modul Ajar Bab 1.docx...');
      const res = await fetch('/modul_ajar_bab_1.docx');
      if (!res.ok) throw new Error('File tidak ditemukan di server');
      const arrayBuffer = await res.arrayBuffer();

      const rawResult = await mammoth.extractRawText({ arrayBuffer });
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer });

      setUploadedDocxBuffer(arrayBuffer);
      setUploadedDocxName('7.1 Modul Ajar Bab 1.docx');
      setPreviewLayoutMode('docx');
      setUploadedFiles([
        {
          id: 'uploaded-modul-bab-1',
          file: new File([arrayBuffer], '7.1 Modul Ajar Bab 1.docx'),
          name: '7.1 Modul Ajar Bab 1.docx',
          size: arrayBuffer.byteLength,
          arrayBuffer,
          extractedText: rawResult.value || '',
          extractedHtml: htmlResult.value || '',
          replacementCount: 0,
          processedBlob: null,
          status: 'pending',
        },
      ]);

      if (rawResult.value) {
        setDocText(rawResult.value);
        setDocHtml(htmlResult.value || null);
        setSelectedPresetId('modul-ajar-bab-1');
        showToast('Berhasil memuat file "7.1 Modul Ajar Bab 1.docx"! Penggantian identitas otomatis diterapkan.');
        setTimeout(() => handleAutoDetect(rawResult.value), 300);
      }
    } catch (err) {
      console.error(err);
      handleSelectPreset('modul-ajar-bab-1');
    }
  }, [handleAutoDetect, handleSelectPreset, showToast]);

  // Load 7.1 Modul Ajar Bab 1.docx automatically on initial mount
  useEffect(() => {
    handleLoadUploadedDocxWorkspace();
  }, [handleLoadUploadedDocxWorkspace]);

  // Single file upload handler
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const rawResult = await mammoth.extractRawText({ arrayBuffer });
          const htmlResult = await mammoth.convertToHtml({ arrayBuffer });

          setUploadedDocxBuffer(arrayBuffer);
          setUploadedDocxName(file.name);
          setPreviewLayoutMode('docx');
          setUploadedFiles([
            {
              id: Math.random().toString(36).substring(2, 9),
              file,
              name: file.name,
              size: file.size,
              arrayBuffer,
              extractedText: rawResult.value || '',
              extractedHtml: htmlResult.value || '',
              replacementCount: 0,
              processedBlob: null,
              status: 'pending',
            },
          ]);

          if (rawResult.value) {
            setDocText(rawResult.value);
            setDocHtml(htmlResult.value || null);
            setSelectedPresetId('custom-upload');
            showToast(`Berhasil memuat file Word "${file.name}"! Penggantian identitas otomatis aktif.`);
            setTimeout(() => handleAutoDetect(rawResult.value), 300);
          } else {
            alert('Gagal mengekstrak teks dari file Word tersebut.');
          }
        } catch (err) {
          console.error(err);
          alert('Terjadi kesalahan saat membaca file Word. Pastikan format file adalah .docx.');
        }
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setDocText(text);
        setDocHtml(null);
        setUploadedDocxBuffer(null);
        setUploadedDocxName(file.name);
        setPreviewLayoutMode('structured');
        setSelectedPresetId('custom-upload');
        showToast(`Berhasil memuat file teks "${file.name}"!`);
        setTimeout(() => handleAutoDetect(text), 300);
      } else {
        alert('Mohon pilih file dengan format .docx (Microsoft Word) atau .txt');
      }
    },
    [handleAutoDetect, showToast]
  );

  // Batch multi-file upload handler
  const handleBatchFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []) as File[];
      if (files.length === 0) return;

      const docxFiles = files.filter((f) => f.name.endsWith('.docx'));
      if (docxFiles.length === 0) {
        alert('Mohon pilih minimal 1 file dengan format .docx (Microsoft Word)');
        return;
      }

      const newItems: UploadedFileItem[] = [];

      for (const file of docxFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const rawResult = await mammoth.extractRawText({ arrayBuffer });
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer });

        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: file.size,
          arrayBuffer,
          extractedText: rawResult.value || '',
          extractedHtml: htmlResult.value || '',
          replacementCount: 0,
          processedBlob: null,
          status: 'pending',
        });
      }

      setUploadedFiles((prev) => [...prev, ...newItems]);
      setActiveTab('batch');
      showToast(`Berhasil menambahkan ${newItems.length} file .docx untuk proses masal!`);
    },
    [showToast]
  );

  // Insert tag at cursor helper
  const insertTagAtCursor = useCallback(
    (tag: string) => {
      setDocText((prev) => prev + ` ${tag} `);
      showToast(`Tag ${tag} ditambahkan ke dalam dokumen!`, 2500);
    },
    [showToast]
  );

  // Memoized Text String & HTML Replacements Calculation
  const { processedText, processedHtml, replacementStats } = useMemo(() => {
    let text = docText;
    let html = docHtml;
    let count = 0;

    const effectivePlace = targetPlace ? targetPlace.trim() : defaultDistrict;
    const effectiveDate = targetDate ? targetDate.trim() : defaultFormattedDate;
    const effectiveDateLocation = targetDateLocation ? targetDateLocation.trim() : `${effectivePlace}, ${effectiveDate}`;

    const replaceInText = (pattern: RegExp | string, replacement: string) => {
      if (!replacement) return;
      if (typeof pattern === 'string') {
        if (!pattern.trim()) return;
        const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        const matches = text.match(regex);
        if (matches) {
          count += matches.length;
          text = text.replace(regex, replacement);
        }
      } else {
        const matches = text.match(pattern);
        if (matches) {
          count += matches.length;
          text = text.replace(pattern, replacement);
        }
      }
    };

    const tagReplacements: Array<{ tags: string[]; newVal: string }> = [
      { tags: ['{{NAMA_SEKOLAH}}', '{NAMA_SEKOLAH}', '[NAMA_SEKOLAH]'], newVal: targetSchool },
      { tags: ['{{NAMA_GURU}}', '{NAMA_GURU}', '[NAMA_GURU]'], newVal: targetTeacher },
      { tags: ['{{NIP_GURU}}', '{NIP_GURU}', '[NIP_GURU]'], newVal: targetTeacherNip },
      { tags: ['{{NAMA_KEPSEK}}', '{NAMA_KEPSEK}', '[NAMA_KEPSEK]'], newVal: targetHeadmaster },
      { tags: ['{{NIP_KEPSEK}}', '{NIP_KEPSEK}', '[NIP_KEPSEK]'], newVal: targetHeadmasterNip },
      { tags: ['{{TAHUN_AJARAN}}', '{TAHUN_AJARAN}', '[TAHUN_AJARAN]'], newVal: targetYear },
      { tags: ['{{SEMESTER}}', '{SEMESTER}', '[SEMESTER]'], newVal: targetSemester },
      { tags: ['{{KOTA_TANGGAL}}', '{KOTA_TANGGAL}', '[KOTA_TANGGAL]', '{{TEMPAT_TANGGAL}}', '{TEMPAT_TANGGAL}'], newVal: effectiveDateLocation },
      { tags: ['{{TEMPAT}}', '{TEMPAT}', '[TEMPAT]', '{{KOTA}}', '{KOTA}', '[KOTA]'], newVal: effectivePlace },
      { tags: ['{{TANGGAL}}', '{TANGGAL}', '[TANGGAL]', '{{TANGGAL_PENGESAHAN}}', '{TANGGAL_PENGESAHAN}'], newVal: effectiveDate },
      { tags: ['{{MATA_PELAJARAN}}', '{MATA_PELAJARAN}', '[MATA_PELAJARAN]'], newVal: teacher.subject || 'Pendidikan Pancasila' },
    ];

    tagReplacements.forEach(({ tags, newVal }) => {
      tags.forEach((tag) => {
        replaceInText(tag, newVal);
      });
    });

    if (enableSmartPatternReplace) {
      if (targetTeacher) {
        replaceInText(/(Nama\s+Penyusun|Nama\s+Guru|Guru\s+Mata\s+Pelajaran|Guru\s+Pengampu|Nama\s+Pendidik|Penyusun)\s*[:=]\s*([^\n\r<]*)/gi, `$1 : ${targetTeacher}`);
      }
      if (targetSchool) {
        replaceInText(/(Satuan\s+Pendidikan|Nama\s+Sekolah|Nama\s+Satuan\s+Pendidikan|Sekolah|Instansi|Unit\s+Kerja)\s*[:=]\s*([^\n\r<]*)/gi, `$1 : ${targetSchool}`);
      }
      if (targetTeacherNip && targetTeacherNip !== '----------------') {
        replaceInText(/(NIP(?:\s*Guru|\s*Penyusun|\s*Pendidik)?)\s*[:=.]?\s*([0-9\s-._]*)/gi, `$1 : ${targetTeacherNip}`);
      }
      if (targetHeadmasterNip && targetHeadmasterNip !== '----------------') {
        replaceInText(/(NIP(?:\s*Kepala\s*Sekolah|\s*Kepsek|\s*KS))\s*[:=.]?\s*([0-9\s-._]*)/gi, `$1 : ${targetHeadmasterNip}`);
      }
      if (targetHeadmaster) {
        replaceInText(/(Nama\s+Kepala\s+Sekolah|Kepala\s+Sekolah|Kepala\s+Satuan\s+Pendidikan)\s*[:=]\s*([^\n\r<]*)/gi, `$1 : ${targetHeadmaster}`);
      }
      if (targetYear) {
        replaceInText(/(Tahun\s+Pelajaran|Tahun\s+Ajaran|Tahun\s+Akademik)\s*[:=]\s*([^\n\r<]*)/gi, `$1 : ${targetYear}`);
      }
      if (targetSemester) {
        replaceInText(/(Semester)\s*[:=]\s*([^\n\r<]*)/gi, `$1 : ${targetSemester}`);
      }
      if (effectiveDateLocation) {
        replaceInText(/(Kota|Tempat|Kabupaten)\s*(?:,?\s*Tanggal|\/Tanggal)?\s*[:=]\s*([^\n\r<]*)/gi, `$1 : ${effectiveDateLocation}`);
      }
      if (effectiveDate) {
        replaceInText(/(Tanggal\s+Pengesahan|Tanggal\s+Penyusunan|Tanggal\s+Pembuatan|Titimangsa)\s*[:=]\s*([^\n\r<]*)/gi, `$1 : ${effectiveDate}`);
      }
    }

    const directReplacements: Array<{ oldVal: string; newVal: string }> = [
      { oldVal: oldSchool, newVal: targetSchool },
      { oldVal: oldTeacher, newVal: targetTeacher },
      { oldVal: oldTeacherNip, newVal: targetTeacherNip },
      { oldVal: oldHeadmaster, newVal: targetHeadmaster },
      { oldVal: oldHeadmasterNip, newVal: targetHeadmasterNip },
      { oldVal: oldYear, newVal: targetYear },
      { oldVal: oldDateLocation, newVal: effectiveDateLocation },
      { oldVal: oldPlace, newVal: effectivePlace },
      { oldVal: oldDate, newVal: effectiveDate },
    ];

    directReplacements.forEach(({ oldVal, newVal }) => {
      if (oldVal && oldVal.trim().length > 1 && oldVal !== newVal) {
        replaceInText(oldVal, newVal);
        if (oldVal.toLowerCase().includes('negeri')) {
          replaceInText(oldVal.replace(/negeri\s*/i, 'N '), newVal);
          replaceInText(oldVal.replace(/negeri\s*/i, 'N'), newVal);
        }
      }
    });

    text = text.replace(/\n{4,}/g, '\n\n\n');

    if (html) {
      let modHtml = html;
      tagReplacements.forEach(({ tags, newVal }) => {
        tags.forEach((tag) => {
          if (modHtml.includes(tag)) {
            const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            modHtml = modHtml.replace(new RegExp(escaped, 'g'), newVal);
          }
        });
      });

      if (enableSmartPatternReplace) {
        if (targetTeacher) {
          modHtml = modHtml.replace(/(Nama\s+Penyusun|Nama\s+Guru|Guru\s+Mata\s+Pelajaran|Guru\s+Pengampu|Nama\s+Pendidik|Penyusun)\s*[:=]\s*([^<]*)/gi, `$1 : ${targetTeacher}`);
        }
        if (targetSchool) {
          modHtml = modHtml.replace(/(Satuan\s+Pendidikan|Nama\s+Sekolah|Nama\s+Satuan\s+Pendidikan|Sekolah|Instansi|Unit\s+Kerja)\s*[:=]\s*([^<]*)/gi, `$1 : ${targetSchool}`);
        }
        if (targetTeacherNip && targetTeacherNip !== '----------------') {
          modHtml = modHtml.replace(/(NIP(?:\s*Guru|\s*Penyusun|\s*Pendidik)?)\s*[:=.]?\s*([0-9\s-._]*)/gi, `$1 : ${targetTeacherNip}`);
        }
        if (targetHeadmasterNip && targetHeadmasterNip !== '----------------') {
          modHtml = modHtml.replace(/(NIP(?:\s*Kepala\s*Sekolah|\s*Kepsek|\s*KS))\s*[:=.]?\s*([0-9\s-._]*)/gi, `$1 : ${targetHeadmasterNip}`);
        }
        if (targetHeadmaster) {
          modHtml = modHtml.replace(/(Nama\s+Kepala\s+Sekolah|Kepala\s+Sekolah|Kepala\s+Satuan\s+Pendidikan)\s*[:=]\s*([^<]*)/gi, `$1 : ${targetHeadmaster}`);
        }
        if (targetYear) {
          modHtml = modHtml.replace(/(Tahun\s+Pelajaran|Tahun\s+Ajaran|Tahun\s+Akademik)\s*[:=]\s*([^<]*)/gi, `$1 : ${targetYear}`);
        }
        if (targetSemester) {
          modHtml = modHtml.replace(/(Semester)\s*[:=]\s*([^<]*)/gi, `$1 : ${targetSemester}`);
        }
        if (effectiveDateLocation) {
          modHtml = modHtml.replace(/(Kota|Tempat|Kabupaten)\s*(?:,?\s*Tanggal|\/Tanggal)?\s*[:=]\s*([^<]*)/gi, `$1 : ${effectiveDateLocation}`);
        }
        if (effectiveDate) {
          modHtml = modHtml.replace(/(Tanggal\s+Pengesahan|Tanggal\s+Penyusunan|Tanggal\s+Pembuatan|Titimangsa)\s*[:=]\s*([^<]*)/gi, `$1 : ${effectiveDate}`);
        }
      }

      directReplacements.forEach(({ oldVal, newVal }) => {
        if (oldVal && oldVal.trim().length > 1 && oldVal !== newVal) {
          const escaped = oldVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          modHtml = modHtml.replace(new RegExp(escaped, 'gi'), newVal);
        }
      });

      if (highlightReplacements) {
        const terms = [targetSchool, targetTeacher, targetTeacherNip, targetHeadmaster, targetHeadmasterNip, targetYear, targetSemester, effectiveDateLocation].filter((t) => t && t.trim().length > 1);
        terms.forEach((t) => {
          const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          modHtml = modHtml.replace(new RegExp(`(?![^<]*>)(${esc})`, 'gi'), `<mark class="bg-amber-200 text-amber-950 px-1 py-0.5 rounded font-semibold border-b-2 border-amber-500">$1</mark>`);
        });
      }

      html = modHtml;
    }

    return { processedText: text, processedHtml: html, replacementStats: count };
  }, [
    docText,
    docHtml,
    oldSchool,
    targetSchool,
    oldTeacher,
    targetTeacher,
    oldTeacherNip,
    targetTeacherNip,
    oldHeadmaster,
    targetHeadmaster,
    oldHeadmasterNip,
    targetHeadmasterNip,
    oldYear,
    targetYear,
    oldDateLocation,
    targetDateLocation,
    oldPlace,
    targetPlace,
    oldDate,
    targetDate,
    targetSemester,
    teacher.subject,
    enableSmartPatternReplace,
    highlightReplacements,
    defaultDistrict,
    defaultFormattedDate,
  ]);

  // Identity Objects
  const targetIdentity: TargetIdentityState = {
    targetSchool,
    targetTeacher,
    targetTeacherNip,
    targetHeadmaster,
    targetHeadmasterNip,
    targetYear,
    targetSemester,
    targetPlace,
    targetDate,
    targetDateLocation,
  };

  const oldIdentity: OldIdentityState = {
    oldSchool,
    oldTeacher,
    oldTeacherNip,
    oldHeadmaster,
    oldHeadmasterNip,
    oldYear,
    oldPlace,
    oldDate,
    oldDateLocation,
  };

  return {
    // States
    selectedPresetId,
    docText,
    setDocText,
    docHtml,
    setDocHtml,
    uploadedDocxBuffer,
    uploadedDocxName,
    uploadedFiles,
    setUploadedFiles,
    isProcessingBatch,
    setIsProcessingBatch,
    statusMessage,
    showToast,
    defaultDistrict,
    defaultFormattedDate,

    // Target Identity
    targetIdentity,
    setTargetSchool,
    setTargetTeacher,
    setTargetTeacherNip,
    setTargetHeadmaster,
    setTargetHeadmasterNip,
    setTargetYear,
    setTargetSemester,
    setTargetPlace,
    setTargetDate,
    setTargetDateLocation,
    handleTargetPlaceChange,
    handleTargetDateChange,
    handleTargetDateLocationChange,

    // Old Identity
    oldIdentity,
    setOldSchool,
    setOldTeacher,
    setOldTeacherNip,
    setOldHeadmaster,
    setOldHeadmasterNip,
    setOldYear,
    setOldPlace,
    setOldDate,
    setOldDateLocation,
    handleOldPlaceChange,
    handleOldDateChange,
    handleOldDateLocationChange,

    // Options
    activeTab,
    setActiveTab,
    previewLayoutMode,
    setPreviewLayoutMode,
    enableSmartPatternReplace,
    setEnableSmartPatternReplace,
    includeExtraKop,
    setIncludeExtraKop,
    includeExtraSignature,
    setIncludeExtraSignature,
    highlightReplacements,
    setHighlightReplacements,

    // Replacement outputs & actions
    processedText,
    processedHtml,
    replacementStats,
    validateAndApplyDefaults,
    handleAutoDetect,
    handleSelectPreset,
    handleLoadUploadedDocxWorkspace,
    handleFileUpload,
    handleBatchFileUpload,
    insertTagAtCursor,
  };
}
