import React, { useState, useMemo, useRef } from 'react';
import type { SchoolProfile, TeacherProfile, AcademicYear } from '../../types';
import { smartPrint } from '../../utils/printHelper';
import mammoth from 'mammoth';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import {
  FileText,
  Sparkles,
  Printer,
  Copy,
  Check,
  Building,
  User,
  Calendar,
  Search,
  RefreshCw,
  Download,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  FileCheck,
  Upload,
  FileType,
  Eye,
  Settings2,
  Wand2,
  Layers,
  FileSpreadsheet,
  CheckSquare,
  ShieldCheck,
  FolderArchive,
  ArrowRight,
  Info
} from 'lucide-react';
import { SAMPLE_INTERNET_DOCS } from '../../data/sampleDocsPresets';
import { processDocxArrayBuffer } from '../../utils/docxProcessor';

interface IdentitasReplacerGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
}

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  arrayBuffer: ArrayBuffer;
  extractedText: string;
  extractedHtml: string;
  replacementCount: number;
  processedBlob: Blob | null;
  status: 'pending' | 'processing' | 'done' | 'error';
}

export const IdentitasReplacerGenerator: React.FC<IdentitasReplacerGeneratorProps> = ({
  school,
  teacher,
  year,
}) => {
  // Preset or custom document text & HTML
  const [selectedPresetId, setSelectedPresetId] = useState<string>('modul-matematika');
  const [docText, setDocText] = useState<string>(SAMPLE_INTERNET_DOCS[0].content);
  const [docHtml, setDocHtml] = useState<string | null>(null);

  // Multiple Uploaded Docx Files State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false);

  // Target identity values (Defaults to active profiles)
  const defaultDistrict = school.district || 'Kota';
  const defaultFormattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const [targetSchool, setTargetSchool] = useState<string>(school.name);
  const [targetTeacher, setTargetTeacher] = useState<string>(teacher.name);
  const [targetTeacherNip, setTargetTeacherNip] = useState<string>(teacher.nip || '----------------');
  const [targetHeadmaster, setTargetHeadmaster] = useState<string>(school.headmasterName);
  const [targetHeadmasterNip, setTargetHeadmasterNip] = useState<string>(school.headmasterNip || '----------------');
  const [targetYear, setTargetYear] = useState<string>(year.label);
  const [targetSemester, setTargetSemester] = useState<string>(year.semester === 1 ? 'Ganjil' : 'Genap');

  // Tempat & Tanggal Target
  const [targetPlace, setTargetPlace] = useState<string>(defaultDistrict);
  const [targetDate, setTargetDate] = useState<string>(defaultFormattedDate);
  const [targetDateLocation, setTargetDateLocation] = useState<string>(`${defaultDistrict}, ${defaultFormattedDate}`);

  // Detected/Old Identity fields to replace
  const [oldSchool, setOldSchool] = useState<string>('SMP Negeri 1 Jakarta');
  const [oldTeacher, setOldTeacher] = useState<string>('Budi Santoso, S.Pd., M.Pd.');
  const [oldTeacherNip, setOldTeacherNip] = useState<string>('19820510 200801 1 012');
  const [oldHeadmaster, setOldHeadmaster] = useState<string>('Dr. H. Mulyadi, M.Pd.');
  const [oldHeadmasterNip, setOldHeadmasterNip] = useState<string>('19700312 199503 1 002');
  const [oldYear, setOldYear] = useState<string>('2023/2024');

  // Tempat & Tanggal Lama
  const [oldPlace, setOldPlace] = useState<string>('Jakarta');
  const [oldDate, setOldDate] = useState<string>('17 Juli 2023');
  const [oldDateLocation, setOldDateLocation] = useState<string>('Jakarta, 17 Juli 2023');

  // Handlers to sync place & date with dateLocation
  const handleTargetPlaceChange = (val: string) => {
    setTargetPlace(val);
    if (targetDate) {
      setTargetDateLocation(`${val}, ${targetDate}`);
    } else {
      setTargetDateLocation(val);
    }
  };

  const handleTargetDateChange = (val: string) => {
    setTargetDate(val);
    if (targetPlace) {
      setTargetDateLocation(`${targetPlace}, ${val}`);
    } else {
      setTargetDateLocation(val);
    }
  };

  const handleTargetDateLocationChange = (val: string) => {
    setTargetDateLocation(val);
    if (val.includes(',')) {
      const parts = val.split(',');
      setTargetPlace(parts[0].trim());
      setTargetDate(parts.slice(1).join(',').trim());
    }
  };

  const handleOldPlaceChange = (val: string) => {
    setOldPlace(val);
    if (oldDate) {
      setOldDateLocation(`${val}, ${oldDate}`);
    } else {
      setOldDateLocation(val);
    }
  };

  const handleOldDateChange = (val: string) => {
    setOldDate(val);
    if (oldPlace) {
      setOldDateLocation(`${oldPlace}, ${val}`);
    } else {
      setOldDateLocation(val);
    }
  };

  const handleOldDateLocationChange = (val: string) => {
    setOldDateLocation(val);
    if (val.includes(',')) {
      const parts = val.split(',');
      setOldPlace(parts[0].trim());
      setOldDate(parts.slice(1).join(',').trim());
    }
  };

  // Display & Formatting Options
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'batch'>('preview');
  const [previewLayoutMode, setPreviewLayoutMode] = useState<'structured' | 'raw'>('structured');
  const [enableSmartPatternReplace, setEnableSmartPatternReplace] = useState<boolean>(true);
  const [includeExtraKop, setIncludeExtraKop] = useState<boolean>(false);
  const [includeExtraSignature, setIncludeExtraSignature] = useState<boolean>(false);
  const [highlightReplacements, setHighlightReplacements] = useState<boolean>(true);

  const [copied, setCopied] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  // Simple validation before replacing documents: if date or place is empty, fill with default (today & school district) and show warning
  const validateAndApplyDefaults = (): { place: string; date: string; dateLoc: string; wasAutofilled: boolean } => {
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
      setStatusMessage(`⚠️ Tempat/Tanggal kosong diisi otomatis dengan nilai default (${p}, ${d}) agar dokumen rapi tanpa placeholder tertinggal!`);
      setTimeout(() => setStatusMessage(null), 4500);
    }

    return { place: p, date: d, dateLoc: dl, wasAutofilled };
  };

  // Auto detect identities from docText
  const handleAutoDetect = () => {
    let detectedCount = 0;

    const schoolMatch = docText.match(/(?:Satuan Pendidikan|Sekolah|SMPN|SMP|SMAN|SMA|SDN|SD)\s*[:=]?\s*([^\n\r]+)/i);
    if (schoolMatch && schoolMatch[1]) {
      setOldSchool(schoolMatch[1].trim());
      detectedCount++;
    }

    const teacherMatch = docText.match(/(?:Nama Penyusun|Nama Guru|Guru Mata Pelajaran|Penyusun|Guru)\s*[:=]?\s*([^\n\r]+)/i);
    if (teacherMatch && teacherMatch[1]) {
      setOldTeacher(teacherMatch[1].trim());
      detectedCount++;
    }

    const nipMatch = docText.match(/(?:NIP)\s*[:=.]?\s*([0-9\s-]+)/i);
    if (nipMatch && nipMatch[1]) {
      setOldTeacherNip(nipMatch[1].trim());
      detectedCount++;
    }

    const yearMatch = docText.match(/(?:Tahun Pelajaran|Tahun Ajaran)\s*[:=]?\s*([^\n\r]+)/i);
    if (yearMatch && yearMatch[1]) {
      setOldYear(yearMatch[1].trim());
      detectedCount++;
    }

    const headmasterMatch = docText.match(/(?:Kepala Sekolah|Kepala SMP[^\n\r]*|Kepala\s+Sekolah)\n+([^\n\r]+)/i);
    if (headmasterMatch && headmasterMatch[1]) {
      setOldHeadmaster(headmasterMatch[1].trim());
      detectedCount++;
    }

    // Auto detect Tempat & Tanggal
    const dateLocMatch = docText.match(/([A-Z][a-zA-A\s]+),\s*(\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+\d{4})/i);
    if (dateLocMatch) {
      const fullDL = dateLocMatch[0].trim();
      setOldDateLocation(fullDL);
      if (dateLocMatch[1]) setOldPlace(dateLocMatch[1].trim());
      if (dateLocMatch[2]) setOldDate(dateLocMatch[2].trim());
      detectedCount++;
    }

    setStatusMessage(`Berhasil mendeteksi ${detectedCount} bidang identitas lama dari dokumen!`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Perform text string replacements
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
      { tags: ['{{MATA_PELAJARAN}}', '{MATA_PELAJARAN}', '[MATA_PELAJARAN]'], newVal: teacher.subject || 'Matematika' },
    ];

    tagReplacements.forEach(({ tags, newVal }) => {
      tags.forEach((tag) => {
        replaceInText(tag, newVal);
      });
    });

    if (enableSmartPatternReplace) {
      replaceInText(/(Satuan\s+Pendidikan|Nama\s+Sekolah|Sekolah)\s*[:=]\s*([^\n\r]+)/gi, `$1 : ${targetSchool}`);
      replaceInText(/(Nama\s+Penyusun|Nama\s+Guru|Penyusun|Guru\s+Mata\s+Pelajaran)\s*[:=]\s*([^\n\r]+)/gi, `$1 : ${targetTeacher}`);
      replaceInText(/(NIP(?:\s*Guru|\s*Penyusun)?)\s*[:=.]?\s*([0-9\s-]+)/gi, `$1 : ${targetTeacherNip}`);
      replaceInText(/(NIP(?:\s*Kepala\s*Sekolah|\s*Kepsek))\s*[:=.]?\s*([0-9\s-]+)/gi, `$1 : ${targetHeadmasterNip}`);
      replaceInText(/(Tahun\s+Pelajaran|Tahun\s+Ajaran)\s*[:=]\s*([^\n\r]+)/gi, `$1 : ${targetYear}`);
      replaceInText(/(Semester)\s*[:=]\s*([^\n\r]+)/gi, `$1 : ${targetSemester}`);
      if (effectiveDateLocation) {
        replaceInText(/(Kota|Tempat|Kabupaten)\s*(?:,?\s*Tanggal|\/Tanggal)?\s*[:=]\s*([^\n\r]+)/gi, `$1 : ${effectiveDateLocation}`);
      }
      if (effectiveDate) {
        replaceInText(/(Tanggal\s+Pengesahan|Tanggal\s+Penyusunan|Tanggal\s+Pembuatan)\s*[:=]\s*([^\n\r]+)/gi, `$1 : ${effectiveDate}`);
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
      tagReplacements.forEach(({ tags, newVal }) => {
        tags.forEach((tag) => {
          if (html?.includes(tag)) {
            const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            html = html.replace(new RegExp(escaped, 'g'), newVal);
          }
        });
      });

      directReplacements.forEach(({ oldVal, newVal }) => {
        if (oldVal && oldVal.trim().length > 1 && oldVal !== newVal) {
          const escaped = oldVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          html = html?.replace(new RegExp(escaped, 'gi'), newVal) || null;
        }
      });
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
  ]);

  const insertTagAtCursor = (tag: string) => {
    setDocText((prev) => prev + ` ${tag} `);
    setStatusMessage(`Tag ${tag} ditambahkan ke dalam dokumen!`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setDocHtml(null);
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
  };

  // Single File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      try {
        const arrayBuffer = await file.arrayBuffer();

        // Extract both Raw Text and HTML
        const rawResult = await mammoth.extractRawText({ arrayBuffer });
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer });

        if (rawResult.value) {
          setDocText(rawResult.value);
          setDocHtml(htmlResult.value || null);
          setSelectedPresetId('custom-upload');
          setStatusMessage(`Berhasil memuat file Word "${file.name}"! (${rawResult.value.length} Karakter)`);

          setTimeout(() => handleAutoDetect(), 300);
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
      setSelectedPresetId('custom-upload');
      setStatusMessage(`Berhasil memuat file teks "${file.name}"!`);
      setTimeout(() => handleAutoDetect(), 300);
    } else {
      alert('Mohon pilih file dengan format .docx (Microsoft Word) atau .txt');
    }
  };

  // Batch Multi-File Upload Handler
  const handleBatchFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        id: Math.random().toString(36).substr(2, 9),
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
    setStatusMessage(`Berhasil menambahkan ${newItems.length} file .docx untuk proses masal!`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Process Batch Files with JSZip XML Engine
  const handleRunBatchProcess = async () => {
    if (uploadedFiles.length === 0) return;

    const { place: validPlace, date: validDate, dateLoc: validDateLoc } = validateAndApplyDefaults();

    setIsProcessingBatch(true);
    setStatusMessage('Memproses seluruh file Word secara presisi tanpa merusak XML/Layout...');

    const updatedList = [...uploadedFiles];

    for (let i = 0; i < updatedList.length; i++) {
      const item = updatedList[i];
      item.status = 'processing';
      setUploadedFiles([...updatedList]);

      try {
        const { blob, count } = await processDocxArrayBuffer(item.arrayBuffer, {
          targetSchool,
          targetTeacher,
          targetTeacherNip,
          targetHeadmaster,
          targetHeadmasterNip,
          targetYear,
          targetSemester,
          targetDateLocation: validDateLoc,
          targetPlace: validPlace,
          targetDate: validDate,
          subject: teacher.subject || 'Matematika',
          oldSchool,
          oldTeacher,
          oldTeacherNip,
          oldHeadmaster,
          oldHeadmasterNip,
          oldYear,
          oldDateLocation,
          oldPlace,
          oldDate,
          enableSmartPattern: enableSmartPatternReplace,
        });

        item.processedBlob = blob;
        item.replacementCount = count;
        item.status = 'done';
      } catch (err) {
        console.error(err);
        item.status = 'error';
      }

      setUploadedFiles([...updatedList]);
    }

    setIsProcessingBatch(false);
    setStatusMessage('Seluruh file .docx berhasil diadaptasi! Siap diunduh secara masal.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Batch Download as Individual Files or Zip Bundle
  const handleDownloadBatchItem = (item: UploadedFileItem) => {
    if (item.processedBlob) {
      saveAs(item.processedBlob, `Adaptasi_${item.name}`);
    }
  };

  const handleDownloadAllBatchZip = async () => {
    const doneItems = uploadedFiles.filter((item) => item.processedBlob && item.status === 'done');
    if (doneItems.length === 0) {
      alert('Belum ada file yang selesai diproses.');
      return;
    }

    const zip = new JSZip();
    doneItems.forEach((item) => {
      if (item.processedBlob) {
        zip.file(`Adaptasi_${item.name}`, item.processedBlob);
      }
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `Batch_Modul_Ajar_Teradaptasi_${school.name.replace(/\s+/g, '_')}.zip`);
    setStatusMessage('Arsip .ZIP berisi semua file .docx teradaptasi berhasil diunduh!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCopyText = () => {
    validateAndApplyDefaults();
    navigator.clipboard.writeText(processedText);
    setCopied(true);
    setStatusMessage('Teks hasil dokumen berhasil disalin ke clipboard!');
    setTimeout(() => {
      setCopied(false);
      setStatusMessage(null);
    }, 2500);
  };

  const handlePrint = () => {
    validateAndApplyDefaults();
    smartPrint({
      documentSelector: '.document-page',
      docTitle: `Dokumen Hasil Adaptasi Identitas - ${school.name}`,
      orientation: 'portrait',
    });
  };

  // Single DOCX Download via XML JSZip Engine (100% Formatting Preserved)
  const handleDownloadDocx = async () => {
    const { place: validPlace, date: validDate, dateLoc: validDateLoc } = validateAndApplyDefaults();

    // Check if we have an uploaded DOCX file
    const customUploadedFile = uploadedFiles[0];
    if (customUploadedFile && customUploadedFile.arrayBuffer) {
      try {
        const { blob, count } = await processDocxArrayBuffer(customUploadedFile.arrayBuffer, {
          targetSchool,
          targetTeacher,
          targetTeacherNip,
          targetHeadmaster,
          targetHeadmasterNip,
          targetYear,
          targetSemester,
          targetDateLocation: validDateLoc,
          targetPlace: validPlace,
          targetDate: validDate,
          subject: teacher.subject || 'Matematika',
          oldSchool,
          oldTeacher,
          oldTeacherNip,
          oldHeadmaster,
          oldHeadmasterNip,
          oldYear,
          oldDateLocation,
          oldPlace,
          oldDate,
          enableSmartPattern: enableSmartPatternReplace,
        });

        saveAs(blob, `Modul_Ajar_Teradaptasi_${teacher.name.replace(/\s+/g, '_')}.docx`);
        setStatusMessage(`File .docx presisi berhasil diunduh! (${count} penggantian identitas)`);
        setTimeout(() => setStatusMessage(null), 3000);
        return;
      } catch (err) {
        console.error('JSZip XML replacement fallback to generator:', err);
      }
    }

    // Default Fallback
    try {
      const lines = processedText.split('\n');
      const paragraphs = lines.map((line) => {
        const isHeader = line.toUpperCase() === line && line.length > 3 && line.length < 80;
        const isBold =
          line.startsWith('MODUL') ||
          line.startsWith('MATA PELAJARAN') ||
          line.startsWith('A.') ||
          line.startsWith('B.') ||
          line.startsWith('C.') ||
          line.startsWith('D.') ||
          line.startsWith('E.') ||
          line.startsWith('F.');

        return new Paragraph({
          children: [
            new TextRun({
              text: line,
              bold: isHeader || isBold,
              size: isHeader ? 24 : 22,
              font: 'Arial',
            }),
          ],
          spacing: { after: 120 },
        });
      });

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Modul_Ajar_Teradaptasi_${teacher.name.replace(/\s+/g, '_')}.docx`);
      setStatusMessage('File .docx berhasil diunduh! Siap dibuka langsung di Microsoft Word.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh file .docx. Anda dapat menggunakan tombol "Salin Teks" sebagai alternatif.');
    }
  };

  // Render Highlighted Text
  const renderedHighlightedText = useMemo(() => {
    if (!highlightReplacements) return processedText;

    const termsToHighlight = [
      targetSchool,
      targetTeacher,
      targetTeacherNip,
      targetHeadmaster,
      targetHeadmasterNip,
      targetYear,
      targetSemester,
      targetDateLocation,
      targetPlace,
      targetDate,
    ].filter((t) => t && t.trim().length > 1);

    if (termsToHighlight.length === 0) return processedText;

    const escaped = termsToHighlight.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escaped})`, 'gi');

    const parts = processedText.split(regex);
    return parts.map((part, index) => {
      const isMatch = termsToHighlight.some((t) => t.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark
            key={index}
            className="bg-amber-200 text-amber-950 px-1 py-0.5 rounded font-semibold border-b-2 border-amber-500 print:bg-amber-200 print:text-amber-950 print:border-b-2 print:border-amber-500 print:px-1 print:py-0.5 print:rounded"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  }, [
    processedText,
    highlightReplacements,
    targetSchool,
    targetTeacher,
    targetTeacherNip,
    targetHeadmaster,
    targetHeadmasterNip,
    targetYear,
    targetSemester,
    targetDateLocation,
    targetPlace,
    targetDate,
  ]);

  // Render Structured Document with Aligned Tables and Signature Blocks
  const renderStructuredDocument = () => {
    const highlightTerms = [
      targetSchool,
      targetTeacher,
      targetTeacherNip,
      targetHeadmaster,
      targetHeadmasterNip,
      targetYear,
      targetSemester,
      targetDateLocation,
      targetPlace,
      targetDate,
    ];

    const renderWithHighlight = (text: string) => {
      if (!highlightReplacements) return text;
      const validTerms = highlightTerms.filter((t) => t && t.trim().length > 1);
      if (validTerms.length === 0) return text;

      const escaped = validTerms.map((t) => t.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = text.split(regex);

      return parts.map((part, i) => {
        const isMatch = validTerms.some((t) => t.trim().toLowerCase() === part.trim().toLowerCase());
        if (isMatch) {
          return (
            <mark
              key={i}
              className="bg-amber-200 text-amber-950 px-1 py-0.5 rounded font-semibold border-b-2 border-amber-500 print:bg-amber-200 print:text-amber-950 print:border-b-2 print:border-amber-500 print:px-1 print:py-0.5 print:rounded"
            >
              {part}
            </mark>
          );
        }
        return part;
      });
    };

    const lines = processedText.split(/\r?\n/);

    // Detect signature block starting index near the bottom (last 25 lines)
    let signatureStartIndex = -1;
    for (let i = lines.length - 1; i >= Math.max(0, lines.length - 25); i--) {
      const line = lines[i].trim();
      if (
        line.toLowerCase().startsWith('mengetahui') ||
        (line.toLowerCase().includes('kepala') && line.toLowerCase().includes('guru'))
      ) {
        signatureStartIndex = i;
        break;
      }
    }

    const contentLines = signatureStartIndex >= 0 ? lines.slice(0, signatureStartIndex) : lines;

    const blocks: React.ReactNode[] = [];
    let kvGroup: { label: string; val: string }[] = [];

    const flushKvGroup = (keyPrefix: string) => {
      if (kvGroup.length > 0) {
        blocks.push(
          <div key={`kv-${keyPrefix}`} className="my-3 overflow-x-auto">
            <table className="w-full text-xs font-serif border-collapse">
              <tbody>
                {kvGroup.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100/60 last:border-none">
                    <td className="py-1 pr-2 font-medium text-slate-800 whitespace-nowrap min-w-[160px] sm:min-w-[200px] align-top">
                      {renderWithHighlight(item.label)}
                    </td>
                    <td className="py-1 px-1 text-center font-bold text-slate-700 align-top w-4">:</td>
                    <td className="py-1 pl-2 text-slate-900 font-semibold align-top">
                      {renderWithHighlight(item.val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        kvGroup = [];
      }
    };

    contentLines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushKvGroup(`blank-${idx}`);
        return;
      }

      // Divider line
      if (trimmed.startsWith('---') || trimmed.startsWith('___') || trimmed.startsWith('***')) {
        flushKvGroup(`hr-${idx}`);
        blocks.push(<hr key={`hr-${idx}`} className="my-4 border-t-2 border-slate-300 print:border-black" />);
        return;
      }

      // Title line (e.g. MODUL AJAR KURIKULUM MERDEKA)
      const isDocTitle =
        (trimmed.startsWith('MODUL AJAR') || trimmed.startsWith('RENCANA PELAKSANAAN') || trimmed.startsWith('RPP')) &&
        idx < 5;

      if (isDocTitle) {
        flushKvGroup(`title-${idx}`);
        blocks.push(
          <div key={`title-${idx}`} className="text-center font-bold text-sm sm:text-base text-slate-900 uppercase tracking-wide mb-1">
            {renderWithHighlight(trimmed)}
          </div>
        );
        return;
      }

      // Subtitle line (e.g. MATA PELAJARAN: MATEMATIKA ...)
      if (trimmed.startsWith('MATA PELAJARAN:') && idx < 5) {
        flushKvGroup(`subtitle-${idx}`);
        blocks.push(
          <div key={`subtitle-${idx}`} className="text-center font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b-2 border-slate-900">
            {renderWithHighlight(trimmed)}
          </div>
        );
        return;
      }

      // Section Header (e.g. A. INFORMASI UMUM or 1. TUJUAN PEMBELAJARAN or 1. IDENTITAS MODUL)
      const isSectionHeader = /^[A-Z1-9]\.\s+[A-Z0-9\s/()-]{3,}$/.test(trimmed);
      if (isSectionHeader) {
        flushKvGroup(`sec-${idx}`);
        blocks.push(
          <div key={`sec-${idx}`} className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider mt-5 mb-2 pb-1 border-b border-slate-400 print:border-black flex items-center gap-2">
            <span>{renderWithHighlight(trimmed)}</span>
          </div>
        );
        return;
      }

      // Key-Value pair (e.g., Label : Value)
      const kvMatch = trimmed.match(/^([^:=]+)\s*[:=]\s*(.+)$/);
      if (kvMatch) {
        const label = kvMatch[1].trim();
        const val = kvMatch[2].trim();
        if (label.length < 40 && !label.toLowerCase().includes('http')) {
          kvGroup.push({ label, val });
          return;
        }
      }

      // Standard paragraph or list item
      flushKvGroup(`p-${idx}`);

      const isListItem = /^(?:[-*•]|\d+\.|\w\.)\s+/.test(trimmed);

      blocks.push(
        <p
          key={`p-${idx}`}
          className={`text-xs text-slate-900 leading-relaxed ${
            isListItem ? 'pl-4 my-1' : 'my-1.5 text-justify'
          }`}
        >
          {renderWithHighlight(trimmed)}
        </p>
      );
    });

    flushKvGroup('end');

    const effectivePlace = targetPlace ? targetPlace.trim() : defaultDistrict;
    const effectiveDate = targetDate ? targetDate.trim() : defaultFormattedDate;
    const effectiveDateLoc = targetDateLocation ? targetDateLocation.trim() : `${effectivePlace}, ${effectiveDate}`;

    // Signature 2-Column Block
    const renderSignatures = () => (
      <div className="mt-10 pt-6 border-t-2 border-slate-900 print:border-black page-break-inside-avoid">
        <table className="w-full text-xs font-serif border-none" style={{ border: 'none' }}>
          <tbody>
            <tr style={{ border: 'none' }}>
              <td style={{ border: 'none', width: '50%', verticalAlign: 'top' }} className="pr-4">
                <div className="text-slate-800">Mengetahui,</div>
                <div className="font-bold text-slate-900 mt-0.5">Kepala {renderWithHighlight(targetSchool)}</div>
                <div className="h-16" /> {/* signature space */}
                <div className="font-bold underline text-slate-900">{renderWithHighlight(targetHeadmaster)}</div>
                <div className="text-slate-700 text-[11px] mt-0.5">NIP. {renderWithHighlight(targetHeadmasterNip)}</div>
              </td>

              <td style={{ border: 'none', width: '50%', verticalAlign: 'top' }} className="pl-4">
                <div className="text-slate-800">{renderWithHighlight(effectiveDateLoc)}</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  Guru Mata Pelajaran {teacher.subject || 'Matematika'}
                </div>
                <div className="h-16" /> {/* signature space */}
                <div className="font-bold underline text-slate-900">{renderWithHighlight(targetTeacher)}</div>
                <div className="text-slate-700 text-[11px] mt-0.5">NIP. {renderWithHighlight(targetTeacherNip)}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );

    return (
      <div className="space-y-1">
        {blocks}
        {renderSignatures()}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-800/40 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                100% Client-Side DOCX XML Preserving
              </span>
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Batch Multi-File Replacer
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Generator Adaptor Identitas Dokumen / Modul Ajar (.docx)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Adaptasi file Word Modul Ajar/RPP dari internet secara masal tanpa merusak format tabel, Kop Sekolah, logo, dan tata letak asli! Ubah nama sekolah, guru, NIP, dan kepala sekolah secara otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Penggantian Terdeteksi</div>
              <div className="text-lg font-black text-emerald-400">{replacementStats} Identitas</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Preset Chooser & Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 uppercase">Pilih Contoh Dokumen Internet atau Upload .docx:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_INTERNET_DOCS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {preset.title.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Identity Settings Grid (Old vs Target) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Target Identity Box (New Identity) */}
          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Identitas Baru (Target Sekolah & Guru Anda)
              </h3>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Data Resmi Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Sekolah Target</label>
                <input
                  type="text"
                  value={targetSchool}
                  onChange={(e) => setTargetSchool(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Penyusun / Guru</label>
                <input
                  type="text"
                  value={targetTeacher}
                  onChange={(e) => setTargetTeacher(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIP Guru</label>
                <input
                  type="text"
                  value={targetTeacherNip}
                  onChange={(e) => setTargetTeacherNip(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Kepala Sekolah</label>
                <input
                  type="text"
                  value={targetHeadmaster}
                  onChange={(e) => setTargetHeadmaster(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={targetHeadmasterNip}
                  onChange={(e) => setTargetHeadmasterNip(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tahun Ajaran Target</label>
                <input
                  type="text"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tempat / Kota Pengesahan</label>
                <input
                  type="text"
                  value={targetPlace}
                  onChange={(e) => handleTargetPlaceChange(e.target.value)}
                  placeholder="misal: Jakarta"
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tanggal Pengesahan</label>
                <input
                  type="text"
                  value={targetDate}
                  onChange={(e) => handleTargetDateChange(e.target.value)}
                  placeholder="misal: 17 Juli 2024"
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tempat & Tanggal (Gabungan)</label>
                <input
                  type="text"
                  value={targetDateLocation}
                  onChange={(e) => handleTargetDateLocationChange(e.target.value)}
                  placeholder="misal: Jakarta, 17 Juli 2024"
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {(!targetPlace.trim() || !targetDate.trim() || !targetDateLocation.trim()) && (
                <div className="sm:col-span-2 bg-amber-50 border border-amber-300 p-2.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      <strong>Peringatan Validasi:</strong> Tempat atau Tanggal masih kosong. Saat proses replace berjalan, nilai akan otomatis diisi default (<strong>{defaultDistrict}, {defaultFormattedDate}</strong>) agar dokumen rapi & tanpa placeholder tertinggal.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => validateAndApplyDefaults()}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-md transition-all whitespace-nowrap self-end sm:self-auto"
                  >
                    Isi Default Hari Ini
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Old Identity Box (Lama) */}
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <Search className="w-4 h-4 text-amber-600" />
                Identitas Lama yang Akan Diganti (Search Text)
              </h3>
              <button
                onClick={handleAutoDetect}
                className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-900 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all"
              >
                <Wand2 className="w-3 h-3" />
                Auto-Deteksi Teks
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Sekolah Lama</label>
                <input
                  type="text"
                  value={oldSchool}
                  onChange={(e) => setOldSchool(e.target.value)}
                  placeholder="misal: SMP Negeri 1 Jakarta"
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Penyusun Lama</label>
                <input
                  type="text"
                  value={oldTeacher}
                  onChange={(e) => setOldTeacher(e.target.value)}
                  placeholder="misal: Budi Santoso, S.Pd."
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIP Guru Lama</label>
                <input
                  type="text"
                  value={oldTeacherNip}
                  onChange={(e) => setOldTeacherNip(e.target.value)}
                  placeholder="misal: 19820510 200801 1 012"
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Kepala Sekolah Lama</label>
                <input
                  type="text"
                  value={oldHeadmaster}
                  onChange={(e) => setOldHeadmaster(e.target.value)}
                  placeholder="misal: Dr. H. Mulyadi, M.Pd."
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIP Kepala Lama</label>
                <input
                  type="text"
                  value={oldHeadmasterNip}
                  onChange={(e) => setOldHeadmasterNip(e.target.value)}
                  placeholder="misal: 19700312 199503 1 002"
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tahun Ajaran Lama</label>
                <input
                  type="text"
                  value={oldYear}
                  onChange={(e) => setOldYear(e.target.value)}
                  placeholder="misal: 2023/2024"
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tempat/Kota Lama</label>
                <input
                  type="text"
                  value={oldPlace}
                  onChange={(e) => handleOldPlaceChange(e.target.value)}
                  placeholder="misal: Jakarta"
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tanggal Lama</label>
                <input
                  type="text"
                  value={oldDate}
                  onChange={(e) => handleOldDateChange(e.target.value)}
                  placeholder="misal: 17 Juli 2023"
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tempat & Tanggal Lama (Gabungan)</label>
                <input
                  type="text"
                  value={oldDateLocation}
                  onChange={(e) => handleOldDateLocationChange(e.target.value)}
                  placeholder="misal: Jakarta, 17 Juli 2023"
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Smart Replacement Options Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-700 font-medium">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={enableSmartPatternReplace}
                onChange={(e) => setEnableSmartPatternReplace(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Ganti Otomatis Fuzzy Label (`Satuan Pendidikan : ...` dll)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={highlightReplacements}
                onChange={(e) => setHighlightReplacements(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Sorot Teks Terganti (Highlight)</span>
            </label>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeExtraKop}
                onChange={(e) => setIncludeExtraKop(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>+ Kop Header</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeExtraSignature}
                onChange={(e) => setIncludeExtraSignature(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>+ Tabel TTD</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Workspace (Editor / Preview / Batch Tabs) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        {/* Workspace Tab Header */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'preview'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Pratinjau Dokumen Rapi</span>
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'editor'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Editor Teks Langsung</span>
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'batch'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FolderArchive className="w-4 h-4" />
              <span>Proses Masal (Batch .docx) {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".docx,.doc,.txt"
              className="hidden"
            />

            <input
              type="file"
              ref={batchFileInputRef}
              onChange={handleBatchFileUpload}
              accept=".docx"
              multiple
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              title="Unggah 1 file Modul Ajar .docx"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah .docx</span>
            </button>

            <button
              onClick={() => batchFileInputRef.current?.click()}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              title="Unggah banyak file Word sekaligus"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Unggah Masal (.docx)</span>
            </button>

            <button
              onClick={handleDownloadDocx}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              title="Unduh dokumen hasil adaptasi langsung dalam format Microsoft Word (.docx)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Word (.docx)</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 bg-slate-100/50">
          {activeTab === 'batch' ? (
            /* Batch Processing View */
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FolderArchive className="w-5 h-5 text-purple-600" />
                      Pengolah Dokumen Masal (.docx Batch Replacer Engine)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unggah multiple file Modul Ajar / RPP Word. Sistem akan mengganti seluruh XML text runs secara langsung tanpa mengubah tata letak.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => batchFileInputRef.current?.click()}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-purple-600" />
                      <span>Tambah File .docx</span>
                    </button>

                    <button
                      onClick={handleRunBatchProcess}
                      disabled={uploadedFiles.length === 0 || isProcessingBatch}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isProcessingBatch ? 'animate-spin' : ''}`} />
                      <span>{isProcessingBatch ? 'Memproses Batch...' : 'Proses Semua File Sekarang'}</span>
                    </button>

                    {uploadedFiles.some((f) => f.status === 'done') && (
                      <button
                        onClick={handleDownloadAllBatchZip}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Unduh Semua (.ZIP)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Uploaded Files Table */}
                {uploadedFiles.length === 0 ? (
                  <div
                    onClick={() => batchFileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50 p-8 rounded-2xl text-center space-y-3 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Belum ada file masal yang diunggah</h4>
                      <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-1">
                        Klik di sini atau tombol "Tambah File .docx" di atas untuk memilih beberapa dokumen Modul Ajar Word sekaligus dari komputer Anda.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[10px] font-bold">
                        <tr>
                          <th className="p-3">Nama File Word (.docx)</th>
                          <th className="p-3">Ukuran</th>
                          <th className="p-3">Status Prosessor</th>
                          <th className="p-3 text-center">Hasil Penggantian</th>
                          <th className="p-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {uploadedFiles.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-medium text-slate-900 flex items-center gap-2">
                              <FileType className="w-4 h-4 text-blue-600 shrink-0" />
                              <span className="truncate max-w-xs">{item.name}</span>
                            </td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">
                              {(item.size / 1024).toFixed(1)} KB
                            </td>
                            <td className="p-3">
                              {item.status === 'pending' && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                                  Menunggu
                                </span>
                              )}
                              {item.status === 'processing' && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold animate-pulse flex items-center gap-1 w-fit">
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  Mengganti XML...
                                </span>
                              )}
                              {item.status === 'done' && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Selesai Presisi
                                </span>
                              )}
                              {item.status === 'error' && (
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold">
                                  Gagal
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center font-bold text-emerald-600 font-mono">
                              {item.status === 'done' ? `${item.replacementCount} Identitas` : '-'}
                            </td>
                            <td className="p-3 text-right">
                              {item.status === 'done' && (
                                <button
                                  onClick={() => handleDownloadBatchItem(item)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-2xs"
                                >
                                  Unduh .docx
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'editor' ? (
            <div className="space-y-4">
              {/* Word File Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 p-4 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-700 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <FileType className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      Punya File Microsoft Word (.docx) Modul Ajar / RPP dari Internet?
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Klik di sini untuk mengunggah file <strong>.docx</strong> secara langsung, atau Anda juga bisa salin-tempel (Ctrl+A &amp; Ctrl+V) teks dari Word ke area di bawah.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold rounded-lg shrink-0 shadow-xs flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih File .docx</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900">
                  Sisipkan Tag Placeholder Cepat (Klik untuk menambahkan ke dalam dokumen):
                </span>
                <span className="text-[11px] text-slate-500 font-mono">{docText.length} Karakter Teks</span>
              </div>

              {/* Quick Tag Insert Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => insertTagAtCursor('{{NAMA_SEKOLAH}}')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
                >
                  + {"{{NAMA_SEKOLAH}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTagAtCursor('{{NAMA_GURU}}')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
                >
                  + {"{{NAMA_GURU}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTagAtCursor('{{NIP_GURU}}')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
                >
                  + {"{{NIP_GURU}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTagAtCursor('{{NAMA_KEPSEK}}')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
                >
                  + {"{{NAMA_KEPSEK}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTagAtCursor('{{NIP_KEPSEK}}')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
                >
                  + {"{{NIP_KEPSEK}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTagAtCursor('{{TAHUN_AJARAN}}')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
                >
                  + {"{{TAHUN_AJARAN}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTagAtCursor('{{MATA_PELAJARAN}}')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
                >
                  + {"{{MATA_PELAJARAN}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTagAtCursor('{{TEMPAT}}')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
                >
                  + {"{{TEMPAT}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTagAtCursor('{{TANGGAL}}')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
                >
                  + {"{{TANGGAL}}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertTagAtCursor('{{KOTA_TANGGAL}}')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg text-[11px] font-mono font-bold transition-all"
                >
                  + {"{{KOTA_TANGGAL}}"}
                </button>
              </div>

              <textarea
                value={docText}
                onChange={(e) => {
                  setDocText(e.target.value);
                  setDocHtml(null);
                }}
                rows={20}
                className="w-full p-4 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed shadow-inner"
                placeholder="Tempelkan isi dokumen / modul ajar Word atau PDF dari internet di sini atau gunakan tag placeholder..."
              />
            </div>
          ) : (
            /* Document Print View / Clean View */
            <div className="space-y-4">
              {/* Layout Mode Control Switcher (No-print) */}
              <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs print:hidden">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Mode Tampilan Preview Dokumen:</span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPreviewLayoutMode('structured')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                      previewLayoutMode === 'structured'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Presisi Rapi (Tabel & Align Resmi)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewLayoutMode('raw')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                      previewLayoutMode === 'raw'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Teks Mentah (Raw Text)</span>
                  </button>
                </div>
              </div>

              {/* Document Page Card */}
              <div className="document-page max-w-4xl mx-auto bg-white p-8 md:p-12 border border-slate-300 shadow-xl rounded-xl font-serif text-slate-900 leading-relaxed space-y-6">
                {/* Optional Header Standard Kop Dokumen */}
                {includeExtraKop && (
                  <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                    <h1 className="text-base font-bold uppercase tracking-wider text-slate-900">
                      {targetSchool.toUpperCase()}
                    </h1>
                    <h2 className="text-xs font-bold uppercase text-slate-800">
                      PERANGKAT PEMBELAJARAN / MODUL AJAR KURIKULUM MERDEKA
                    </h2>
                    <div className="text-xs font-bold text-slate-700">
                      TAHUN PELAJARAN {targetYear}
                    </div>
                  </div>
                )}

                {/* Render converted Word HTML or Clean Structured Text */}
                {processedHtml ? (
                  <div
                    className="prose prose-slate max-w-none text-xs font-serif leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: processedHtml }}
                  />
                ) : previewLayoutMode === 'structured' ? (
                  renderStructuredDocument()
                ) : (
                  <pre className="whitespace-pre-wrap font-serif text-xs leading-relaxed text-justify text-slate-900 overflow-x-auto">
                    {renderedHighlightedText}
                  </pre>
                )}

                {/* Optional Signatures Footer (if in Raw mode or extra requested) */}
                {includeExtraSignature && previewLayoutMode === 'raw' && (
                  <div className="pt-8 border-t border-slate-300">
                    <table className="w-full text-xs font-serif" style={{ border: 'none' }}>
                      <tbody>
                        <tr style={{ border: 'none' }}>
                          <td style={{ border: 'none', width: '50%' }}>
                            <div>Mengetahui,</div>
                            <div className="font-bold">Kepala {targetSchool}</div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <div className="font-bold underline">{targetHeadmaster}</div>
                            <div>NIP. {targetHeadmasterNip}</div>
                          </td>

                          <td style={{ border: 'none', width: '50%', textAlign: 'left' }}>
                            <div>{targetDateLocation}</div>
                            <div className="font-bold">Guru Mata Pelajaran</div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <div className="font-bold underline">{targetTeacher}</div>
                            <div>NIP. {targetTeacherNip}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
