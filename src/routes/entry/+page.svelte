<!-- src/routes/entry/+page.svelte -->
<script lang="ts">
  import MoodSelector from '$lib/components/MoodSelector.svelte';
  import ActivitySelector from '$lib/components/ActivitySelector.svelte';
  import { entryStore, type EntryStore } from '$lib/stores/entryStore';
  import { goto } from '$app/navigation';
  let selectedMood: number | null = null;

  $: if (selectedMood !== null) {
    entryStore.update(store => ({ ...store, mood: selectedMood }));
    goto('/entry/details');
  }
</script>

<div class="flex flex-col items-center justify-center p-4 flex-grow">
  <h1 class="text-3xl font-semibold mb-2 text-center">HOW ARE YOU?</h1>
  <p class="text-gray-600 mb-8 p-6 text-center">
    <span class="mdi mdi-calendar-blank mr-1"></span>
    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
  </p>
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
    <MoodSelector bind:selectedMood />
    {#if $entryStore?.activities?.length}
      <ActivitySelector 
        selectedActivities={$entryStore.activities}
      />
    {/if}
  </div>
</div>
