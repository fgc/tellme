<!-- src/lib/components/MoodSelector.svelte -->
<script lang="ts">
  import { moods } from '$lib/config/moods';
  export let selectedMood: number | null = null;

  function selectMood(value: number) {
    selectedMood = value === selectedMood ? null : value;
  }
</script>


<div class="flex justify-center gap-1 p-0">
  {#each moods as mood}
    <button
      aria-label={mood.label}
      on:click={() => selectMood(mood.value)}
      class="p-0 rounded-full transition-all duration-200 hover:scale-110 bg-transparent border-none
        {selectedMood === mood.value ? 'scale-125 shadow-lg' : ''}"
    >
      <img src={mood.icon} alt={mood.label} class="w-24 h-24" />
    </button>
  {/each}
</div>

{#if selectedMood !== null}
  <p class="text-center text-gray-600 mt-2 capitalize">
    Selected: {moods.find(m => m.value === selectedMood)?.label}
  </p>
{/if}

<style>
  /* If the SVGs need their internal colors overridden,
     you might need to target specific SVG elements here.
     For now, assuming the background color is sufficient. */
</style>
