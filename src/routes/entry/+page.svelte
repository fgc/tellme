<!-- src/routes/entry/+page.svelte -->
<script lang="ts">
  import MoodSelector from '$lib/components/MoodSelector.svelte';
  import ActivitySelector from '$lib/components/ActivitySelector.svelte';
  import { fade } from 'svelte/transition';
  
  let selectedMood: number | null = null;
  let selectedActivities: string[] = [];
  let notes = '';
  let showSuccess = false;
  let isLoading = false;

  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  async function saveEntry() {
    if (!selectedMood) return;
    
    isLoading = true;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const entry = {
      date: getTodayDate(),
      mood: selectedMood,
      activities: selectedActivities,
      notes: notes.trim(),
      timestamp: new Date().toISOString()
    };

    console.log('Saving entry:', entry);
    
    // Reset loading state
    isLoading = false;
    
    // Show success feedback
    showSuccess = true;
    setTimeout(() => showSuccess = false, 3000);
  }
</script>

<h1 class="text-2xl font-bold mb-4">Daily Entry</h1>
<div class="bg-white p-6 rounded-lg shadow">
  <MoodSelector bind:selectedMood />
  
  <h2 class="text-lg font-semibold mt-6 mb-4">Today's Activities</h2>
  <ActivitySelector bind:selectedActivities />

<div class="mt-6">
  <label for="notes-input" class="block text-sm font-medium mb-2 text-gray-700">
    Notes (optional)
  </label>
  <textarea
    id="notes-input"
    bind:value={notes}
    class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    rows="4"
    placeholder="Add any additional notes about your day..."
  ></textarea>
</div>

  <div class="mt-6 flex justify-end gap-4">
    <button
      on:click={saveEntry}
      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      disabled={!selectedMood || isLoading}
    >
      {isLoading ? 'Saving...' : 'Save Entry'}
    </button>
  </div>
</div>

{#if showSuccess}
  <div transition:fade class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg">
    Entry saved successfully!
  </div>
{/if}