import Dexie, { type Table } from 'dexie';

export interface Entry {
  id?: number;
  date: string;
  mood: number;
  activities: string[];
  notes: string;
  timestamp: string;
}

class TellmeDB extends Dexie {
  entries!: Table<Entry>;

  constructor() {
    super('TellmeDB');
    this.version(2).stores({
      entries: '++id, date, mood, activities, notes, timestamp'
    });
  }
}

export const db = new TellmeDB();

// Basic CRUD operations
export const addEntry = async (entry: Omit<Entry, 'id' | 'timestamp'>) => {
  try {
    return await db.entries.add({
      ...entry,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding entry:', error);
    throw new Error(`Failed to save entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getEntryByDate = async (date: string) => {
  try {
    return await db.entries.get({ date });
  } catch (error) {
    console.error('Error fetching entry by date:', error);
    throw new Error(`Failed to load entry: ${error instanceof Error ? error.message : 'Database error'}`);
  }
};

export const getAllEntries = async () => {
  try {
    return await db.entries.toArray();
  } catch (error) {
    console.error('Error fetching all entries:', error);
    throw new Error(`Failed to load entries: ${error instanceof Error ? error.message : 'Database error'}`);
  }
};
