<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const links = [
    { path: '/entry', icon: 'mdi-plus-circle-outline', label: 'Log' },
    { path: '/weekly', icon: 'mdi-chart-bar', label: 'View' },
    { path: '/settings', icon: 'mdi-cog', label: 'Settings' }
  ];
</script>

<nav class="fixed bottom-0 w-full bg-white shadow-lg">
  <div class="flex justify-around py-3">
    {#each links as link}
      <button
        on:click={() => goto(link.path)}
        class="flex flex-col items-center text-xs font-medium text-gray-600 hover:text-blue-500 transition-colors bg-transparent border-none"
        class:text-blue-500={$page.url.pathname === link.path}
      >
        <span class="mdi {link.icon} text-2xl mb-1"></span>
        <span>{link.label}</span>
      </button>
    {/each}
  </div>
</nav>
