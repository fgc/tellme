<script lang="ts">
  import { onMount } from 'svelte';
  import { addEntry, getAllEntries, type Entry } from '$lib/db';

  onMount(async () => {
    // Test entry creation
    const testEntry: Omit<Entry, 'id' | 'timestamp'> = {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      mood: 3,
      activities: ['exercise', 'reading'],
      notes: 'Productive day'
    };

    //await addEntry(testEntry);

    // Verify entries
    const entries = await getAllEntries();
    console.log('Stored entries:', entries);
  });
</script>

<h1>Database Test</h1>
<p>Check browser console for database operations output</p>
