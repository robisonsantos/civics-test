import { Question, Module } from './types';
import content from './content.json';

export const modules = Object.values(content) as Module[];

export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getQuestionById(id: string): Question | undefined {
  for (const module of modules) {
    const question = module.questions.find(q => q.id === id);
    if (question) return question;
  }
  return undefined;
}
