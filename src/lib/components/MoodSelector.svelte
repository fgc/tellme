<!-- src/lib/components/MoodSelector.svelte -->
<script lang="ts">
  export let selectedMood: number | null = null;
  const moods = [
    { value: 1, label: 'Awful', icon: '😠', color: 'bg-red-200' },
    { value: 2, label: 'Bad', icon: '😞', color: 'bg-orange-200' },
    { value: 3, label: 'Neutral', icon: '😐', color: 'bg-yellow-200' },
    { value: 4, label: 'Good', icon: '😊', color: 'bg-green-200' },
    { value: 5, label: 'Great', icon: '😄', color: 'bg-blue-200' }
  ];

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