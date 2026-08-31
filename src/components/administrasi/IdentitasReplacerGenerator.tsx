import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import { smartPrint } from '../../utils/printHelper';
import { processDocxArrayBuffer } from '../../utils/docxProcessor';

import type { IdentitasReplacerGeneratorProps, UploadedFileItem } from './identitas-replacer/types';
import { useIdentityReplacer } from './identitas-replacer/useIdentityReplacer';
import { IdentityHeader } from './identitas-replacer/IdentityHeader';
import { IdentityForm } from './identitas-replacer/IdentityForm';
import { DocumentPreviewTab } from './identitas-replacer/DocumentPreviewTab';
import { TextEditorTab } from './identitas-replacer/TextEditorTab';
import { BatchReplacerTab } from './identitas-replacer/BatchReplacerTab';

export const IdentitasReplacerGenerator: React.FC<IdentitasReplacerGeneratorProps> = ({
  school,
  teacher,
  year,
  selectedAssignmentSubject,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const {
    selectedPresetId,
    docText,
    setDocText,
    docHtml,
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

    // Processed Outputs & Handlers
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
  } = useIdentityReplacer({ school, teacher, year });

  const currentSubject = selectedAssignmentSubject || teacher.subject || 'Pendidikan Pancasila';

  // Copy Clean Text Handler
  const handleCopyText = () => {
    validateAndApplyDefaults();
    navigator.clipboard.writeText(processedText);
    setCopied(true);
    showToast('Teks hasil dokumen berhasil disalin ke clipboard!', 2500);
    setTimeout(() => setCopied(false), 2500);
  };

  // Print Handler
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

    let bufferToProcess: ArrayBuffer | null = uploadedDocxBuffer || (uploadedFiles[0]?.arrayBuffer ?? null);

    if (!bufferToProcess && (selectedPresetId === 'modul-ajar-bab-1' || !uploadedDocxBuffer)) {
      try {
        const res = await fetch('/modul_ajar_bab_1.docx');
        if (res.ok) {
          bufferToProcess = await res.arrayBuffer();
        }
      } catch (e) {
        console.error('Fetch original docx fallback error:', e);
      }
    }

    if (bufferToProcess) {
      try {
        const { blob, count } = await processDocxArrayBuffer(bufferToProcess, {
          targetSchool: targetIdentity.targetSchool,
          targetTeacher: targetIdentity.targetTeacher,
          targetTeacherNip: targetIdentity.targetTeacherNip,
          targetHeadmaster: targetIdentity.targetHeadmaster,
          targetHeadmasterNip: targetIdentity.targetHeadmasterNip,
          targetYear: targetIdentity.targetYear,
          targetSemester: targetIdentity.targetSemester,
          targetDateLocation: validDateLoc,
          targetPlace: validPlace,
          targetDate: validDate,
          subject: currentSubject,
          oldSchool: oldIdentity.oldSchool,
          oldTeacher: oldIdentity.oldTeacher,
          oldTeacherNip: oldIdentity.oldTeacherNip,
          oldHeadmaster: oldIdentity.oldHeadmaster,
          oldHeadmasterNip: oldIdentity.oldHeadmasterNip,
          oldYear: oldIdentity.oldYear,
          oldDateLocation: oldIdentity.oldDateLocation,
          oldPlace: oldIdentity.oldPlace,
          oldDate: oldIdentity.oldDate,
          enableSmartPattern: enableSmartPatternReplace,
          includeExtraSignature,
          includeExtraKop,
        });

        saveAs(blob, `Modul_Ajar_Teradaptasi_${teacher.name.replace(/\s+/g, '_')}.docx`);
        showToast(`File .docx presisi (100% format asli dipertahankan) berhasil diunduh! (${count} penggantian)`, 3500);
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
        sections: [{ properties: {}, children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Modul_Ajar_Teradaptasi_${teacher.name.replace(/\s+/g, '_')}.docx`);
      showToast('File .docx berhasil diunduh! Siap dibuka langsung di Microsoft Word.', 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh file .docx. Anda dapat menggunakan tombol "Salin Teks" sebagai alternatif.');
    }
  };

  // Run Batch Multi-file Processor
  const handleRunBatchProcess = async () => {
    if (uploadedFiles.length === 0) return;

    const { place: validPlace, date: validDate, dateLoc: validDateLoc } = validateAndApplyDefaults();

    setIsProcessingBatch(true);
    showToast('Memproses seluruh file Word secara presisi tanpa merusak XML/Layout...');

    const updatedList = [...uploadedFiles];

    for (let i = 0; i < updatedList.length; i++) {
      const item = updatedList[i];
      item.status = 'processing';
      setUploadedFiles([...updatedList]);

      try {
        const { blob, count } = await processDocxArrayBuffer(item.arrayBuffer, {
          targetSchool: targetIdentity.targetSchool,
          targetTeacher: targetIdentity.targetTeacher,
          targetTeacherNip: targetIdentity.targetTeacherNip,
          targetHeadmaster: targetIdentity.targetHeadmaster,
          targetHeadmasterNip: targetIdentity.targetHeadmasterNip,
          targetYear: targetIdentity.targetYear,
          targetSemester: targetIdentity.targetSemester,
          targetDateLocation: validDateLoc,
          targetPlace: validPlace,
          targetDate: validDate,
          subject: currentSubject,
          oldSchool: oldIdentity.oldSchool,
          oldTeacher: oldIdentity.oldTeacher,
          oldTeacherNip: oldIdentity.oldTeacherNip,
          oldHeadmaster: oldIdentity.oldHeadmaster,
          oldHeadmasterNip: oldIdentity.oldHeadmasterNip,
          oldYear: oldIdentity.oldYear,
          oldDateLocation: oldIdentity.oldDateLocation,
          oldPlace: oldIdentity.oldPlace,
          oldDate: oldIdentity.oldDate,
          enableSmartPattern: enableSmartPatternReplace,
          includeExtraSignature,
          includeExtraKop,
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
    showToast('Seluruh file .docx berhasil diadaptasi! Siap diunduh secara masal.', 4000);
  };

  // Individual Batch Item Download
  const handleDownloadBatchItem = (item: UploadedFileItem) => {
    if (item.processedBlob) {
      saveAs(item.processedBlob, `Adaptasi_${item.name}`);
    }
  };

  // All Batch Items Download as ZIP
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
    showToast('Arsip .ZIP berisi semua file .docx teradaptasi berhasil diunduh!', 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Stats & Action Buttons */}
      <IdentityHeader
        statusMessage={statusMessage}
        replacementStats={replacementStats}
        selectedPresetId={selectedPresetId}
        uploadedDocxBuffer={uploadedDocxBuffer}
        uploadedFilesCount={uploadedFiles.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectPreset={handleSelectPreset}
        onLoadWorkspaceDocx={handleLoadUploadedDocxWorkspace}
        onFileUpload={handleFileUpload}
        onBatchFileUpload={handleBatchFileUpload}
        onDownloadDocx={handleDownloadDocx}
        onCopyText={handleCopyText}
        onPrint={handlePrint}
        copied={copied}
      />

      {/* 2. Identity Comparison & Control Forms */}
      <IdentityForm
        targetIdentity={targetIdentity}
        oldIdentity={oldIdentity}
        defaultDistrict={defaultDistrict}
        defaultFormattedDate={defaultFormattedDate}
        enableSmartPatternReplace={enableSmartPatternReplace}
        highlightReplacements={highlightReplacements}
        includeExtraKop={includeExtraKop}
        includeExtraSignature={includeExtraSignature}
        onTargetSchoolChange={setTargetSchool}
        onTargetTeacherChange={setTargetTeacher}
        onTargetTeacherNipChange={setTargetTeacherNip}
        onTargetHeadmasterChange={setTargetHeadmaster}
        onTargetHeadmasterNipChange={setTargetHeadmasterNip}
        onTargetYearChange={setTargetYear}
        onTargetPlaceChange={handleTargetPlaceChange}
        onTargetDateChange={handleTargetDateChange}
        onTargetDateLocationChange={handleTargetDateLocationChange}
        onOldSchoolChange={setOldSchool}
        onOldTeacherChange={setOldTeacher}
        onOldTeacherNipChange={setOldTeacherNip}
        onOldHeadmasterChange={setOldHeadmaster}
        onOldHeadmasterNipChange={setOldHeadmasterNip}
        onOldYearChange={setOldYear}
        onOldPlaceChange={handleOldPlaceChange}
        onOldDateChange={handleOldDateChange}
        onOldDateLocationChange={handleOldDateLocationChange}
        onAutoDetect={handleAutoDetect}
        onValidateDefaults={validateAndApplyDefaults}
        onToggleSmartPattern={setEnableSmartPatternReplace}
        onToggleHighlight={setHighlightReplacements}
        onToggleExtraKop={setIncludeExtraKop}
        onToggleExtraSignature={setIncludeExtraSignature}
      />

      {/* 3. Main Workspace Tab Body */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden p-6 bg-slate-100/50">
        {activeTab === 'batch' ? (
          <BatchReplacerTab
            uploadedFiles={uploadedFiles}
            isProcessingBatch={isProcessingBatch}
            onBatchFileUpload={handleBatchFileUpload}
            onRunBatchProcess={handleRunBatchProcess}
            onDownloadBatchItem={handleDownloadBatchItem}
            onDownloadAllBatchZip={handleDownloadAllBatchZip}
          />
        ) : activeTab === 'editor' ? (
          <TextEditorTab
            docText={docText}
            onDocTextChange={setDocText}
            onInsertTag={insertTagAtCursor}
            onFileUpload={handleFileUpload}
          />
        ) : (
          <DocumentPreviewTab
            processedText={processedText}
            processedHtml={processedHtml}
            uploadedDocxBuffer={uploadedDocxBuffer}
            uploadedDocxName={uploadedDocxName}
            previewLayoutMode={previewLayoutMode}
            setPreviewLayoutMode={setPreviewLayoutMode}
            targetIdentity={targetIdentity}
            oldIdentity={oldIdentity}
            enableSmartPatternReplace={enableSmartPatternReplace}
            subject={currentSubject}
            highlightReplacements={highlightReplacements}
            includeExtraKop={includeExtraKop}
            includeExtraSignature={includeExtraSignature}
            defaultDistrict={defaultDistrict}
            defaultFormattedDate={defaultFormattedDate}
          />
        )}
      </div>
    </div>
  );
};
