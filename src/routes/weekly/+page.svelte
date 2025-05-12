<script lang="ts">
  import { db } from '$lib/db';
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

    // Create a map of date to entry for easy lookup
    entries = weekEntries.reduce((acc, entry) => {
      acc[entry.date] = entry;
      return acc;
    }, {} as Record<string, any>);

    isLoading = false;
  }

  loadEntries();

  // Reactive statement to get mood details for each entry
  $: entriesWithMoodDetails = Object.keys(entries).reduce((acc, date) => {
    const entry = entries[date];
    acc[date] = {
      ...entry,
      moodDetails: moods.find(m => m.value === entry.mood)
    };
    return acc;
  }, {} as Record<string, any>);
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
            style="{entriesWithMoodDetails[date] ? `background-color: ${entriesWithMoodDetails[date].moodDetails.lighterColor}; color: ${entriesWithMoodDetails[date].moodDetails.color};` : 'background-color: white; color: gray;'}"
          > <!-- Date Header -->
            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>

          <div
            class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            on:click={() => {
              if (entries[date]) {
                selectedEntry = entries[date];
                showEntryModal = true;
              }
            }}
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (entries[date]) {
                  selectedEntry = entries[date];
                  showEntryModal = true;
                }
              }
            }}
            role="button"
            tabindex="0"
          > <!-- Entry Details -->
            {#if entriesWithMoodDetails[date]}
              <div class="flex items-center gap-4">
                {#if entriesWithMoodDetails[date].moodDetails}
                  <img src={entriesWithMoodDetails[date].moodDetails.icon} alt={entriesWithMoodDetails[date].moodDetails.label} class="w-8 h-8 mr-2" style="filter: drop-shadow(0 0 0 {entriesWithMoodDetails[date].moodDetails.color});" />
                {/if}
                <div class="flex flex-col">
                  <div class="text-sm font-semibold" style="color: {entriesWithMoodDetails[date].moodDetails.color};">
                    {#if entriesWithMoodDetails[date].moodDetails}
                      {entriesWithMoodDetails[date].moodDetails.label.toUpperCase()}
                    {/if}
                  </div>
                <div class="text-xs text-gray-600 flex flex-wrap items-center gap-2">
                  {#if entriesWithMoodDetails[date].activities.length > 0}
                    {#each entriesWithMoodDetails[date].activities as activityId}
                      {@const activity = activities.find((a: Activity) => a.id === activityId)}
                      {#if activity}
                        <span class="flex items-center">
                          <i class="mdi {activity.icon} text-base mr-1" style="color: {entriesWithMoodDetails[date].moodDetails.color};"></i>
                          {activity.label}
                        </span>
                      {/if}
                    {/each}
                  {/if}
                </div>
                {#if entriesWithMoodDetails[date].notes}
                  <div class="text-xs text-gray-600 italic">
                      Notes: {entriesWithMoodDetails[date].notes}
                    </div>
                  {/if}
                </div>
              </div>
            {:else}
              <div class="text-gray-400 text-sm">No entry</div>
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
