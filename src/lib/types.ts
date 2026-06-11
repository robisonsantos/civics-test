export type QuestionType = 'standard' | 'personal_info';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  answer?: string; // For standard questions
  wikiLink?: string; // Link for "Go Deeper"
}

export interface Module {
  id: string;
  title: string;
  questions: Question[];
  masteredCount: number;
}
