import { db, updateProgress } from './db';
import { getQuestionById } from './data';

/**
 * Process an answer for a given question and update the mastery state.
 *
 * Implements logic from the project plan:
 * - If correct, streak += 1; otherwise, streak = 0.
 * - If streak >= 3, mark as mastered.
 * - "personal_info" questions skip the streak requirement.
 */
export async function processAnswer(questionId: string, isCorrect: boolean) {
  const question = getQuestionById(questionId);

  // Handle personal information items (e.g., names of representatives)
  if (question?.type === 'personal_info') {
    await updateProgress(questionId, { viewed: true });
    return { isMastered: true, streak: 0 };
  }

  // Standard progression logic
  // Note: To maintain streak across a session in a real app,
  // we would pass the current_streak as part of state or use a context manager.
  let streak = 0; // Currently mocked for simple implementation

  if (isCorrect) {
    streak += 1;
  } else {
    streak = 0;
  }

  let isMastered = false;
  if (streak >= 3) {
    isMastered = true;
    await updateProgress(questionId, { masteredCount: 1 });
  }

  return { isMastered, streak };
}
