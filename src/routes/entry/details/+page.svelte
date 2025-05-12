<script lang="ts">
  import ActivitySelector from '$lib/components/ActivitySelector.svelte';
  import { entryStore, resetEntryStore } from '$lib/stores/entryStore';
  import { db } from '$lib/db';
  import { goto } from '$app/navigation';
  import { moods } from '$lib/config/moods'; // Import moods to display the selected mood icon/label
  import { fade } from 'svelte/transition';

  let selectedActivities: string[] = [];
  let notes = '';
  let showSuccess = false;
  let isLoading = false;

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
      notes: notes.trim(), // Use local state for notes
      timestamp: new Date().toISOString()
    };

    try {
      // Check if entry exists for this date
      const existing = await db.entries.get({ date: entry.date });

      // If exists, include its id for update
      const entryToSave = existing ? { ...entry, id: existing.id } : entry;

      await db.entries.put(entryToSave);

      // Reset form and store
      resetEntryStore();

      // Show success feedback
      showSuccess = true;
      setTimeout(() => showSuccess = false, 3000);

      // Optionally navigate back to the main entry page or another page after saving
      // goto('/entry');

    } catch (error) {
      console.error('Failed to save entry:', error);
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

<h1 class="text-2xl font-bold mb-4">Entry Details</h1>

{#if selectedMoodDetails}
  <div class="flex items-center mb-4">
    <span class="text-4xl mr-3">
      {selectedMoodDetails.icon}
    </span>
    <span class="text-lg font-semibold">
      {selectedMoodDetails.label}
    </span>
  </div>
{/if}

<div class="bg-white p-6 rounded-lg shadow">
  <h2 class="text-lg font-semibold mb-4">Today's Activities</h2>
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
{/if}
