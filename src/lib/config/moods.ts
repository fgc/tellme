import { 
  IconMoodSadFilled,
  IconMoodConfuzedFilled,
  IconMoodNeutralFilled,
  IconMoodSmileFilled,
  IconMoodHappyFilled
} from '@tabler/icons-svelte';

export const moods = [
  { 
    value: 1, 
    label: 'Awful', 
    icon: IconMoodSadFilled, 
    color: 'bg-red-600',
    textColor: 'text-white',
    unselectedColor: 'text-gray-400 opacity-50'
  },
  { 
    value: 2, 
    label: 'Bad', 
    icon: IconMoodConfuzedFilled, 
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    unselectedColor: 'text-gray-400 opacity-50'
  },
  { 
    value: 3, 
    label: 'Neutral', 
    icon: IconMoodNeutralFilled, 
    color: 'bg-yellow-300',
    textColor: 'text-gray-800',
    unselectedColor: 'text-gray-400 opacity-50'
  },
  { 
    value: 4, 
    label: 'Good', 
    icon: IconMoodSmileFilled, 
    color: 'bg-green-400',
    textColor: 'text-green-400',
    unselectedColor: 'text-gray-400 opacity-50'
  },
  { 
    value: 5, 
    label: 'Great', 
    icon: IconMoodHappyFilled, 
    color: 'bg-blue-400',
    textColor: 'text-white',
    unselectedColor: 'text-gray-400 opacity-50'
  }
] as const;
