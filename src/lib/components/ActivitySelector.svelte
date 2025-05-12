<script lang="ts">
  import { activities } from '$lib/config/activities';
  import { entryStore } from '$lib/stores/entryStore';
  import { moods } from '$lib/config/moods';
  export let selectedActivities: string[] = [];

  function toggleActivity(activityId: string) {
    selectedActivities = selectedActivities.includes(activityId)
      ? selectedActivities.filter(id => id !== activityId)
      : [...selectedActivities, activityId];
  }
</script>

<div class="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
  {#each activities as activity}
    <button
      aria-label={activity.label}
      on:click={() => toggleActivity(activity.id)}
      class="flex flex-col items-center p-2 rounded-lg transition-all duration-200 hover:scale-105
        {selectedActivities.includes(activity.id)
          ? 'scale-105'
          : 'opacity-90 hover:opacity-100'}"
    >
      <div class="w-12 h-12 flex items-center justify-center rounded-full mb-1
        {selectedActivities.includes(activity.id)
          ? `bg-mood-${$entryStore.mood ? moods.find(m => m.value === $entryStore.mood)?.label || 'neutral' : 'neutral'}`
          : 'bg-gray-200'}">
        <span class="mdi {activity.icon} text-xl text-gray-700"></span>
      </div>
      <span class="text-xs text-center font-medium text-gray-700">{activity.label}</span>
    </button>
  {/each}
</div>
