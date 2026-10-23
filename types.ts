export type LangChoice = 'hy' | 'ru' | 'both' | 'hidden';

export interface SentenceItem {
  id: string | number;
  es: string;
  hy: string;
  ru: string;
  options?: { key: string; labelEs: string; labelHy: string; labelRu: string }[];
  correctAnswer?: string;
  explanationEs?: string;
  explanationHy?: string;
  explanationRu?: string;
  extraMeta?: Record<string, string>;
}

export interface ExerciseData {
  id: string;
  number: number;
  titleEs: string;
  titleHy: string;
  titleRu: string;
  instructionEs: string;
  instructionHy: string;
  instructionRu: string;
  type: 'choice' | 'true_false' | 'fill_blank' | 'table' | 'transform' | 'text_reading';
  options?: { key: string; labelEs: string; labelHy: string; labelRu: string }[];
  wordBank?: string[];
  readingTextEs?: string;
  readingTextHy?: string;
  readingTextRu?: string;
  readingTitleEs?: string;
  readingTitleHy?: string;
  readingTitleRu?: string;
  questions: SentenceItem[];
  extraNotes?: { es: string; hy: string; ru: string };
}

export interface FigureTheory {
  name: string;
  level: 'fónico' | 'morfosintáctico' | 'semántico';
  nameHy: string;
  nameRu: string;
  explanationEs: string;
  explanationHy: string;
  explanationRu: string;
  exampleEs: string;
  exampleHy: string;
  exampleRu: string;
}

export interface ExamQuestion {
  id: number;
  questionEs: string;
  questionHy: string;
  questionRu: string;
  options: { key: string; textEs: string; textHy: string; textRu: string }[];
  correctKey: string;
  explanationEs: string;
  explanationHy: string;
  explanationRu: string;
}

export interface MasteryItem {
  id: number;
  es: string;
  hy: string;
  ru: string;
}

export interface OralQuestion {
  id: number;
  es: string;
  hy: string;
  ru: string;
  answerEs: string;
  answerHy: string;
  answerRu: string;
}
