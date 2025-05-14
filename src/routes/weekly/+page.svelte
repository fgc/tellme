<script lang="ts">
  import { db, type Entry } from '$lib/db';
  import { moods } from '$lib/config/moods';
  import { activities, type Activity } from '$lib/config/activities';
  import { weekStartDate } from '$lib/stores/weeklyView';
  import EntryDetailModal from '$lib/components/EntryDetailModal.svelte';

  let entries: Record<string, any> = {};
  let isLoading = true;
  let currentWeekStart: Date;
  let isCurrentWeek = true;
  let selectedEntry: any = null;
  let showEntryModal = false;

  const unsubscribe = weekStartDate.subscribe(date => {
    currentWeekStart = date;
    isCurrentWeek = isDateInCurrentWeek(date);
    loadEntries();
  });

  function isDateInCurrentWeek(date: Date) {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday of current week
    return date >= weekStart;
  }

  function getLast7Days() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }

  function navigateWeek(days: number) {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + days);
    weekStartDate.set(newDate);
  }

  async function loadEntries() {
    isLoading = true;
    const dates = getLast7Days();
    const weekEntries = await db.entries
      .where('date')
      .anyOf(dates)
      .toArray();

    // Group entries by date
    entries = weekEntries.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = [];
      }
      acc[entry.date].push(entry);
      return acc;
    }, {} as Record<string, any[]>);

    isLoading = false;
  }

  loadEntries();

  function truncateNotes(notes: string, limit: number) {
    const words = notes.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return notes;
  }

  // Reactive statement to get mood details for each entry
  $: entriesWithMoodDetails = Object.keys(entries).reduce((acc: Record<string, Array<Entry & { moodDetails: any }>>, date) => {
    acc[date] = entries[date].map((entry: Entry) => ({
      ...entry,
      moodDetails: moods.find(m => m.value === entry.mood)
    }));
    return acc;
  }, {} as Record<string, any[]>);
</script>

<div class="flex justify-between mb-4">
  <button
    on:click={() => navigateWeek(-7)}
    class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
  >
    &lt;
  </button>
  <button
    on:click={() => navigateWeek(7)}
    disabled={isCurrentWeek}
    class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    &gt;
  </button>
</div>
<div class="bg-gray-100 p-6 rounded-lg shadow">
  {#if isLoading}
    <p class="text-center text-gray-500">Loading...</p>
  {:else}
    <div class="flex flex-col gap-4"> <!-- Changed to vertical flex layout -->
      {#each getLast7Days() as date}
        <div class="bg-white rounded shadow mb-4"> <!-- Container for each day's card -->
          <div
            class="p-1 text-sm font-medium text-center"
            style="{entriesWithMoodDetails[date]?.length ? `background-color: ${entriesWithMoodDetails[date][0].moodDetails.lighterColor}; color: ${entriesWithMoodDetails[date][0].moodDetails.color};` : 'background-color: white; color: gray;'}"
          > <!-- Date Header -->
            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            {#if entriesWithMoodDetails[date]?.length > 1}
              <span class="ml-2">({entriesWithMoodDetails[date].length})</span>
            {/if}
          </div>

          <div class="p-4">
            {#if entriesWithMoodDetails[date]?.length}
              {#each entriesWithMoodDetails[date] as entry (entry.id)}
                <div
                  class="mb-3 last:mb-0 p-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  on:click={() => {
                    selectedEntry = entry;
                    showEntryModal = true;
                  }}
                  on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      selectedEntry = entry;
                      showEntryModal = true;
                    }
                  }}
                  role="button"
                  tabindex="0"
                >
                  <div class="flex items-center gap-4">
                    {#if entry.moodDetails}
                      <img src={entry.moodDetails.icon} alt={entry.moodDetails.label} class="w-6 h-6" style="filter: drop-shadow(0 0 0 {entry.moodDetails.color});" />
                    {/if}
                    <div class="flex flex-col">
                      <div class="text-sm font-semibold" style="color: {entry.moodDetails.color};">
                        {#if entry.timestamp}
                          <span class="text-xs text-gray-500 mr-2">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        {/if}
                        {entry.moodDetails?.label.toUpperCase()}
                      </div>
                      <div class="text-xs text-gray-600 flex flex-wrap items-center gap-2">
                        {#if entry.activities.length > 0}
                          {#each entry.activities as activityId}
                            {@const activity = activities.find((a: Activity) => a.id === activityId)}
                            {#if activity}
                              <span class="flex items-center">
                                <i class="mdi {activity.icon} text-base mr-1" style="color: {entry.moodDetails.color};"></i>
                                {activity.label}
                              </span>
                            {/if}
                          {/each}
                        {/if}
                      </div>
                      {#if entry.notes}
                        <div class="text-xs text-gray-600 italic">
                          Notes: {truncateNotes(entry.notes, 15)}
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            {:else}
              <div class="text-gray-400 text-sm">No entries</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<EntryDetailModal
  bind:isOpen={showEntryModal}
  entry={selectedEntry}
/>
