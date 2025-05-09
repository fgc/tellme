<!-- src/lib/components/MoodSelector.svelte -->
<script lang="ts">
  import { moods } from '$lib/config/moods';
  import { onMount } from 'svelte';
  export let selectedMood: number | null = null;

  function selectMood(value: number) {
    selectedMood = value;
  }

  onMount(() => {
    console.log('MoodSelector mounted');
    console.log('Available moods:', moods);
    console.log('Tabler icons loaded:', {
      IconMoodSadFilled: !!moods[0].icon,
      IconMoodConfuzedFilled: !!moods[1].icon,
      IconMoodNeutralFilled: !!moods[2].icon,
      IconMoodSmileFilled: !!moods[3].icon,
      IconMoodHappyFilled: !!moods[4].icon
    });
  });
</script>


<div class="flex justify-center gap-4 p-4">
  {#each moods as mood}
    <button
      aria-label={mood.label}
      on:click={() => selectMood(mood.value)}
      class="p-4 rounded-full transition-all duration-200 hover:scale-110
        {selectedMood === mood.value 
          ? `${mood.color} scale-125 shadow-lg ring-4 ring-offset-2 ring-opacity-50 ${mood.textColor}`
          : `${mood.unselectedColor} hover:opacity-100`}"
    >
      <span class="text-4xl">
        <svelte:component this={mood.icon} class="fill-current {selectedMood === mood.value ? mood.textColor : mood.unselectedColor}" />
      </span>
    </button>
  {/each}
</div>

{#if selectedMood !== null}
  <p class="text-center text-gray-600 mt-2">
    Selected: {moods.find(m => m.value === selectedMood)?.label}
  </p>
{/if}
