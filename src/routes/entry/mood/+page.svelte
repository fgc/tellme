<script lang="ts">
  import MoodSelector from '$lib/components/MoodSelector.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let selectedMood: number | null = null;

  function proceedToActivities() {
    if (selectedMood !== null) {
      goto(`/entry/activities?mood=${selectedMood}`);
    }
  }

  // Ensure component is fully mounted before any redirects
  onMount(() => {
    console.log('MoodSelector mounted');
  });
</script>

<div class="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
  <h1 class="text-2xl font-bold mb-6 text-center">How are you feeling today?</h1>
  
  <MoodSelector bind:selectedMood />

  <div class="mt-8 flex justify-center">
    <button
      on:click={proceedToActivities}
      disabled={selectedMood === null}
      class="px-6 py-3 bg-accent-700 text-white rounded-lg hover:bg-accent-800 
        disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Continue
    </button>
  </div>
</div>
