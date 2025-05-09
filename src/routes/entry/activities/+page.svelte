<script lang="ts">
  import ActivitySelector from '$lib/components/ActivitySelector.svelte';
  import { fade } from 'svelte/transition';
  import { db } from '$lib/db';
  import Button from '$lib/components/ui/Button.svelte';
  import Toast from '$lib/components/ui/Toast.svelte';
  import { page } from '$app/stores';
  
  const selectedMood: number = Number($page.url.searchParams.get('mood'));
  let selectedActivities: string[] = [];
  let notes = '';
  let showSuccess = false;
  let isLoading = false;

  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  async function saveEntry() {
    isLoading = true;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const entry = {
      date: getTodayDate(),
      mood: selectedMood,
      activities: selectedActivities,
      notes: notes.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const existing = await db.entries.get({ date: entry.date });
      const entryToSave = existing ? { ...entry, id: existing.id } : entry;
      
      await db.entries.put(entryToSave);
      
      selectedActivities = [];
      notes = '';
      showSuccess = true;
      setTimeout(() => showSuccess = false, 3000);
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      isLoading = false;
    }
  }
</script>

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
      class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
      rows="4"
      placeholder="Add any additional notes about your day..."
    ></textarea>
  </div>

  <div class="mt-6 flex justify-end gap-4">
    <Button
      on:click={saveEntry}
      type="primary"
      disabled={isLoading}
    >
      {isLoading ? 'Saving...' : 'Save Entry'}
    </Button>
  </div>
</div>

<Toast 
  bind:isOpen={showSuccess}
  message="Entry saved successfully!"
  type="success"
  duration={3000}
/>
