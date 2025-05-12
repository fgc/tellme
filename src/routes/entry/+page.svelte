<!-- src/routes/entry/+page.svelte -->
<script lang="ts">
  import MoodSelector from '$lib/components/MoodSelector.svelte';
  import { entryStore } from '$lib/stores/entryStore';
  import { goto } from '$app/navigation';

  let selectedMood: number | null = null;

  $: if (selectedMood !== null) {
    entryStore.update(store => ({ ...store, mood: selectedMood }));
    goto('/entry/details');
  }
</script>

<h1 class="text-2xl font-bold mb-4">Select Your Mood</h1>
<div class="bg-white p-6 rounded-lg shadow">
  <MoodSelector bind:selectedMood />
</div>
