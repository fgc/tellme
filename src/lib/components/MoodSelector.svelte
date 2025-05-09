<!-- src/lib/components/MoodSelector.svelte -->
<script lang="ts">
  import { moods } from '$lib/config/moods';
  export let selectedMood: number | null = null;

  function selectMood(value: number) {
    selectedMood = value === selectedMood ? null : value;
  }
</script>


<div class="flex justify-center gap-4 p-4">
  {#each moods as mood}
    <button
      aria-label={mood.label}
      on:click={() => selectMood(mood.value)}
      class="p-4 rounded-full transition-all duration-200 hover:scale-110 {mood.color}
        {selectedMood === mood.value ? 'scale-125 shadow-lg' : ''}"
    >
      <span class="text-4xl">{mood.icon}</span>
    </button>
  {/each}
</div>

{#if selectedMood !== null}
  <p class="text-center text-gray-600 mt-2">
    Selected: {moods.find(m => m.value === selectedMood)?.label}
  </p>
{/if}
