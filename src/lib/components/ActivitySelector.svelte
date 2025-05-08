<script lang="ts">
  import { activities } from '$lib/config/activities';
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
      class="flex flex-col items-center p-3 rounded-lg transition-all duration-200 hover:scale-105 {activity.color}
        {selectedActivities.includes(activity.id) 
          ? 'ring-2 ring-black scale-110' 
          : 'opacity-90 hover:opacity-100'}"
    >
      <span class="text-3xl mb-2">{activity.icon}</span>
      <span class="text-sm text-center font-medium">{activity.label}</span>
      {#if selectedActivities.includes(activity.id)}
        <div class="absolute top-1 right-1 text-green-600">✓</div>
      {/if}
    </button>
  {/each}
</div>