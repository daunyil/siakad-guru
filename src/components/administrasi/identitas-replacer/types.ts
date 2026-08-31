import type { SchoolProfile, TeacherProfile, AcademicYear } from '../../../types';

export interface IdentitasReplacerGeneratorProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  year: AcademicYear;
  selectedAssignmentSubject?: string;
  selectedClassLabel?: string;
}

export interface UploadedFileItem {
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

export interface TargetIdentityState {
  targetSchool: string;
  targetTeacher: string;
  targetTeacherNip: string;
  targetHeadmaster: string;
  targetHeadmasterNip: string;
  targetYear: string;
  targetSemester: string;
  targetPlace: string;
  targetDate: string;
  targetDateLocation: string;
}

export interface OldIdentityState {
  oldSchool: string;
  oldTeacher: string;
  oldTeacherNip: string;
  oldHeadmaster: string;
  oldHeadmasterNip: string;
  oldYear: string;
  oldPlace: string;
  oldDate: string;
  oldDateLocation: string;
}

export interface ValidationDefaultsResult {
  place: string;
  date: string;
  dateLoc: string;
  wasAutofilled: boolean;
}
