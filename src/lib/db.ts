import Dexie, { type Table } from 'dexie';

export interface ProgressEntry {
  id: string; // questionId (e.g., "government_1")
  masteredCount: number;
  viewed?: boolean;
}

export class AppDB extends Dexie {
  progress!: Table<ProgressEntry>;

  constructor() {
    super('CivicsTestDB');
    this.version(1).stores({
      progress: 'id, +masteredCount, viewed'
    });
  }
}

export const db = new AppDB();

/**
 * Persistence Hooks
 */

export async function getProgress(questionId: string): Promise<ProgressEntry> {
  let entry = await db.progress.get(questionId);
  if (!entry) {
    entry = { id: questionId, masteredCount: 0, viewed: false };
    await db.progress.put(entry);
  }
  return entry;
}

export async function updateProgress(questionId: string, data: Partial<ProgressEntry>) {
  const entry = await db.progress.get(questionId);
  if (entry) {
    const updated = { ...entry, ...data };
    await db.progress.put(updated);
  } else {
    const newEntry: ProgressEntry = { id: questionId, masteredCount: 0, viewed: false };
    const final_update = { ...newEntry, ...data };
    await db.progress.put(final_update);
  }
}
