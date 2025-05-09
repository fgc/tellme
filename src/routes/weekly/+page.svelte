<script lang="ts">
  import { db } from '$lib/db';
  import { moods } from '$lib/config/moods';
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
</script>

<div class="flex justify-between mb-6">
    <button
      on:click={() => navigateWeek(-7)}
      class="px-4 py-2 bg-accent-700 text-white rounded-lg hover:bg-accent-800 transition-colors"
    >
      Previous Week
    </button>
    <button
      on:click={() => navigateWeek(7)}
      disabled={isCurrentWeek}
      class="px-4 py-2 bg-accent-700 text-white rounded-lg hover:bg-accent-800 transition-colors disabled:bg-gray-400 disabled:text-gray-700"
    >
      Next Week
    </button>
</div>
<div class="bg-white p-6 rounded-lg shadow-md">
  {#if isLoading}
    <p class="text-center text-gray-500">Loading...</p>
  {:else}
    <div class="grid grid-cols-7 gap-2">
      {#each getLast7Days() as date}
        <div 
          class="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
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
        >
          <div class="text-sm font-medium mb-1 text-center">
            <div>{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="text-xs text-gray-500">
              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
          
          {#if entries[date]}
            <div class="flex flex-col items-center">
              <div class="text-3xl mb-1 p-2 rounded-full {moods.find((m: {value: number}) => m.value === entries[date].mood)?.color}">
                <svelte:component this={moods.find((m: {value: number}) => m.value === entries[date].mood)?.icon} 
                  class="fill-current {moods.find((m: {value: number}) => m.value === entries[date].mood)?.textColor}" />
              </div>
            </div>
            <div class="text-xs text-gray-600 text-center">
              {entries[date].activities.slice(0, 3).join(', ')}
              {#if entries[date].activities.length > 3}
                +{entries[date].activities.length - 3} more
              {/if}
            </div>
          {:else}
            <div class="text-gray-500 text-sm">No entry</div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<EntryDetailModal 
  bind:isOpen={showEntryModal} 
  entry={selectedEntry} 
/>
