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
    this.version(1).stores({
      entries: '++id, &date, mood, activities, notes, timestamp'
    });
  }
}

export const db = new TellmeDB();

// Basic CRUD operations
export const addEntry = async (entry: Omit<Entry, 'id' | 'timestamp'>) => {
  return db.entries.add({
    ...entry,
    timestamp: new Date().toISOString()
  });
};

export const getEntryByDate = async (date: string) => {
  return db.entries.get({ date });
};

export const getAllEntries = async () => {
  return db.entries.toArray();
};