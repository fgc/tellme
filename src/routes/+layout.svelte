<script lang="ts">
  import { page } from '$app/stores';
  import Navigation from '$lib/components/Navigation.svelte';
  import "../app.css"
  const pageTitles: Record<string, string> = {
    '/entry': 'Daily Entry',
    '/weekly': 'Weekly View',
    '/settings': 'Settings'
  };
</script>

{#if $page.status === 404}
  <div class="min-h-screen p-4">
    <h1 class="text-2xl font-bold">Page not found</h1>
    <p class="mt-4">Return to <a href="/entry" class="text-blue-500">home page</a></p>
  </div>
{:else}
  <div class="min-h-screen bg-gray-50">
    <header class="sticky top-0 z-10 bg-primary-700 text-white shadow-sm p-4">
      <h1 class="text-2xl font-bold">
        {pageTitles[$page.url.pathname] || 'Tellme'}
      </h1>
    </header>
    
    <main class="pb-24 px-4 font-sans">
      <div class="max-w-3xl mx-auto py-6">
        <slot />
      </div>
    </main>
    
    <Navigation />
  </div>
{/if}
