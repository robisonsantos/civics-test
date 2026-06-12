import type { Question, Module } from './types';
import content from './content.json';

/**
 * Configuration Constants
 */
export const CONFIG = {
  MIN_PASS_RATE: 0.6,
  REQUIRED_MASTERY_COUNT: 12,
} as const;

export const modules = Object.values(content) as Module[];

// Pre-index questions for O(1) lookups
const questionMap = new Map<string, Question>();

for (const module of modules) {
  for (const question of module.questions) {
    questionMap.set(question.id, question);
  }
}

export const questionsMap = questionMap;

export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getQuestionById(id: string): Question | undefined {
  return questionMap.get(id);
}
