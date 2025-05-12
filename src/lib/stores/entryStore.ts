import { writable } from 'svelte/store';

export interface EntryStore {
  mood: number | null;
  activities: string[];
  notes: string;
}

const initialEntryState: EntryStore = {
  mood: null,
  activities: [],
  notes: '',
};

export const entryStore = writable<EntryStore>(initialEntryState);

export function resetEntryStore() {
  entryStore.set(initialEntryState);
}
