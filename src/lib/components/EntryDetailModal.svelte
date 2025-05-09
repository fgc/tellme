<script lang="ts">
  import { moods } from '$lib/config/moods';
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

    <div class="flex items-center mb-4">
      <span class="text-4xl mr-3">
        {moods.find((m: {value: number}) => m.value === entry.mood)?.icon}
      </span>
      <span class="text-lg">
        {moods.find((m: {value: number}) => m.value === entry.mood)?.label}
      </span>
    </div>

    {#if entry.activities.length > 0}
      <div class="mb-4">
        <h3 class="font-semibold mb-2">Activities</h3>
        <ul class="list-disc pl-5">
          {#each entry.activities as activity}
            <li>{activity}</li>
          {/each}
        </ul>
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
