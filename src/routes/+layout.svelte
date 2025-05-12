<script lang="ts">
  import { page } from '$app/stores';
  import Navigation from '$lib/components/Navigation.svelte';
  import '../app.css'; // Import the global styles

</script>

{#if $page.status === 404}
  <div class="min-h-screen p-4">
    <h1 class="text-2xl font-bold">Page not found</h1>
    <p class="mt-4">Return to <a href="/entry" class="text-blue-500">home page</a></p>
  </div>
{:else}
  <div class="min-h-screen pb-24 px-4 bg-gray-50">
    <slot />
  </div>
  <Navigation />
{/if}
