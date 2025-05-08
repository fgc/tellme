export interface Activity {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const activities: Activity[] = [
  { id: 'exercise', label: 'Exercise', icon: '🏋️', color: 'bg-red-100' },
  { id: 'reading', label: 'Reading', icon: '📖', color: 'bg-blue-100' },
  { id: 'cooking', label: 'Cooking', icon: '👩🍳', color: 'bg-green-100' },
  { id: 'social', label: 'Social', icon: '👥', color: 'bg-purple-100' },
  { id: 'work', label: 'Work', icon: '💼', color: 'bg-yellow-100' },
  { id: 'music', label: 'Music', icon: '🎵', color: 'bg-pink-100' },
  { id: 'nature', label: 'Nature', icon: '🌳', color: 'bg-emerald-100' },
  { id: 'games', label: 'Games', icon: '🎮', color: 'bg-amber-100' },
  { id: 'art', label: 'Art', icon: '🎨', color: 'bg-fuchsia-100' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: 'bg-rose-100' },
  { id: 'meditation', label: 'Meditation', icon: '🧘', color: 'bg-indigo-100' },
  { id: 'learning', label: 'Learning', icon: '🎓', color: 'bg-sky-100' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹', color: 'bg-gray-100' },
  { id: 'nap', label: 'Nap', icon: '😴', color: 'bg-lime-100' },
  { id: 'tv', label: 'TV', icon: '📺', color: 'bg-violet-100' }
];