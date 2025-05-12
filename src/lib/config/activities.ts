export interface Activity {
  id: string;
  label: string;
  icon: string;
}

export const activities: Activity[] = [
  { id: 'exercise', label: 'Exercise', icon: 'mdi-run' },
  { id: 'reading', label: 'Reading', icon: 'mdi-book' },
  { id: 'cooking', label: 'Cooking', icon: 'mdi-chef-hat' },
  { id: 'social', label: 'Social', icon: 'mdi-account-group' },
  { id: 'work', label: 'Work', icon: 'mdi-briefcase' },
  { id: 'music', label: 'Music', icon: 'mdi-music' },
  { id: 'nature', label: 'Nature', icon: 'mdi-tree' },
  { id: 'games', label: 'Games', icon: 'mdi-gamepad-variant' },
  { id: 'art', label: 'Art', icon: 'mdi-palette' },
  { id: 'shopping', label: 'Shopping', icon: 'mdi-cart' },
  { id: 'meditation', label: 'Meditation', icon: 'mdi-meditation' },
  { id: 'learning', label: 'Learning', icon: 'mdi-school' },
  { id: 'cleaning', label: 'Cleaning', icon: 'mdi-broom' },
  { id: 'nap', label: 'Nap', icon: 'mdi-sleep' },
  { id: 'tv', label: 'TV', icon: 'mdi-television' }
];
