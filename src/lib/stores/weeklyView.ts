import { writable } from 'svelte/store';

function getCurrentWeekStart() {
  const today = new Date();
  const day = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
  return new Date(today.setDate(diff));
}

export const weekStartDate = writable<Date>(getCurrentWeekStart());
