<script lang="ts">
  import ActivitySelector from '$lib/components/ActivitySelector.svelte';
  import { entryStore, resetEntryStore } from '$lib/stores/entryStore';
  import { db, addEntry } from '$lib/db';
  import { goto } from '$app/navigation';
  import { moods } from '$lib/config/moods'; // Import moods to display the selected mood icon/label
  import { fade } from 'svelte/transition';

  let selectedActivities: string[] = [];
  let notes = '';
  let showSuccess = false;
  let isLoading = false;
  let errorMessage = '';

  // Subscribe to the store to get initial values and updates
  let currentEntry = $entryStore;
  entryStore.subscribe(value => {
    currentEntry = value;
    selectedActivities = value.activities; // Initialize selectedActivities from store
    notes = value.notes; // Initialize notes from store
  });

  // Redirect if no mood is selected (user directly accessed this page)
  if (currentEntry.mood === null) {
    goto('/entry');
  }

  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  async function saveEntry() {
    if (currentEntry.mood === null) return; // Should not happen due to redirect, but good practice

    isLoading = true;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const entry = {
      date: getTodayDate(),
      mood: currentEntry.mood,
      activities: selectedActivities, // Use local state for activities
      notes: notes.trim() // Use local state for notes
    };

    try {
      await addEntry(entry);

      // Reset form and store
      resetEntryStore();

      // Show success feedback
      showSuccess = true;
      setTimeout(() => showSuccess = false, 3000);
      errorMessage = '';

      // Navigate to the weekly view after saving
      goto('/weekly');

    } catch (error) {
      console.error('Failed to save entry:', error);
      errorMessage = error instanceof Error ? error.message : 'Failed to save entry. Please try again.';
      showSuccess = false;
      setTimeout(() => errorMessage = '', 5000);
    } finally {
      isLoading = false;
    }
  }

  // Update store when activities or notes change
  $: {
    entryStore.update(store => ({ ...store, activities: selectedActivities }));
  }
  $: {
    entryStore.update(store => ({ ...store, notes: notes }));
  }

  // Find the selected mood details for display
  $: selectedMoodDetails = moods.find(m => m.value === currentEntry.mood);

</script>

<div class="p-4 max-w-md mx-auto">
<div class="flex items-center justify-between mb-6">
  <button on:click={() => goto('/entry')} class="text-gray-600 hover:text-gray-800" aria-label="Go back">
    <span class="mdi mdi-arrow-left text-2xl"></span>
  </button>
  {#if selectedMoodDetails}
    <div class="flex items-center">
      <img src={selectedMoodDetails.icon} alt={selectedMoodDetails.label} class="w-8 h-8 mr-2" style="filter: drop-shadow(0 0 0 {selectedMoodDetails.color});" />
      <span class="text-lg font-semibold capitalize">{selectedMoodDetails.label}</span>
    </div>
  {/if}
  <!-- Placeholder for checkmark icon if needed -->
  <div class="w-6"></div>
</div>

  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-semibold mb-4 text-center">WHAT HAVE YOU BEEN UP TO?</h2>

    <div class="mb-6">
      <ActivitySelector bind:selectedActivities />
    </div>

    <div class="mb-6">
      <label for="notes-input" class="block text-sm font-medium mb-2 text-gray-700">
        Add Note...
      </label>
      <textarea
        id="notes-input"
        bind:value={notes}
        class="w-full p-3 border-none focus:ring-0 focus:border-transparent"
        rows="4"
        placeholder="Add any additional notes about your day..."
      ></textarea>
    </div>

    <div class="flex justify-end">
      <button
        on:click={saveEntry}
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={currentEntry.mood === null || isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Entry'}
      </button>
    </div>
  </div>

  {#if showSuccess}
    <div transition:fade class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg">
      Entry saved successfully!
    </div>
  {:else if errorMessage}
    <div transition:fade class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg">
      {errorMessage}
    </div>
  {/if}
</div>
