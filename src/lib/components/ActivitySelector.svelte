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
      class="flex flex-col items-center p-2 rounded-lg transition-all duration-200 hover:scale-105
        {selectedActivities.includes(activity.id)
          ? 'ring-2 ring-green-500 scale-110'
          : 'opacity-90 hover:opacity-100'}"
    >
      <div class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 mb-1">
        <span class="mdi {activity.icon} text-xl text-gray-700"></span>
      </div>
      <span class="text-xs text-center font-medium text-gray-700">{activity.label}</span>
      {#if selectedActivities.includes(activity.id)}
        <div class="absolute top-0 right-0 text-green-600 text-lg">✓</div>
      {/if}
    </button>
  {/each}
</div>
