<script lang="ts">
  import { moods } from '$lib/config/moods';
  import { activities, type Activity } from '$lib/config/activities';
  import { fade } from 'svelte/transition';

  export let entry: any;
  export let isOpen = false;

  function closeModal() {
    isOpen = false;
  }
</script>

{#if isOpen}
<div
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  on:click|self={closeModal}
  on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') closeModal(); }}
  role="button"
  tabindex="0"
  transition:fade
>
  <div class="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
    <div class="flex justify-between items-start mb-4">
      <h2 class="text-xl font-bold">
        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </h2>
      <button
        on:click={closeModal}
        class="text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        &times;
      </button>
    </div>

    {#if entry && entry.mood !== undefined}
      {@const moodDetails = moods.find((m) => m.value === entry.mood)}
      {#if moodDetails}
        <div class="flex items-center mb-4">
          <img src={moodDetails.icon} alt={moodDetails.label} class="w-8 h-8 mr-2" style="filter: drop-shadow(0 0 0 {moodDetails.color});" />
          <span class="text-lg font-semibold" style="color: {moodDetails.color};">
            {#if entry.timestamp}
              <span class="text-sm text-gray-500 mr-2">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            {/if}
            {moodDetails.label.toUpperCase()}
          </span>
        </div>
      {/if}
    {/if}

    {#if entry && entry.activities && entry.activities.length > 0}
      {@const moodDetails = moods.find((m) => m.value === entry.mood)}
      <div class="mb-4">
        <h3 class="font-semibold mb-2">Activities</h3>
        <div class="flex flex-wrap items-center gap-2">
          {#each entry.activities as activityId}
            {@const activity = activities.find((a: Activity) => a.id === activityId)}
            {#if activity}
              <span class="flex items-center">
                <i class="mdi {activity.icon} text-base mr-1" style="color: {moodDetails?.color};"></i>
                {activity.label}
              </span>
            {/if}
          {/each}
        </div>
      </div>
    {/if}

    {#if entry.notes}
      <div>
        <h3 class="font-semibold mb-2">Notes</h3>
        <p class="whitespace-pre-line">{entry.notes}</p>
      </div>
    {/if}
  </div>
</div>
{/if}
