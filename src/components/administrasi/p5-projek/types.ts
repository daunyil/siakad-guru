export interface P5ThemeOption {
  id: string;
  name: string;
  description: string;
  defaultProjectTitle: string;
  dimensions: string[];
}

export interface P5StudentAssessment {
  id: string;
  nisn: string;
  name: string;
  grades: Record<string, 'BB' | 'MB' | 'BSH' | 'SB'>; // dimension -> level
  notes: string;
}

export interface P5ActivityStage {
  stage: string;
  title: string;
  jp: number;
  desc: string;
}

export interface KopData {
  schoolName: string;
  headmasterName: string;
  headmasterNip: string;
  teacherName: string;
  teacherNip: string;
  dateLocation: string;
}
