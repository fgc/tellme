<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  const links = [
    { path: '/entry', icon: '📅', label: 'Log' },
    { path: '/weekly', icon: '📊', label: 'View' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ];
</script>

<nav class="fixed bottom-0 w-full bg-white border-t-2 border-gray-100">
  <div class="flex justify-around p-4">
    {#each links as link}
      <button
        on:click={() => goto(link.path)}
        class="flex flex-col items-center text-sm font-medium"
        class:font-bold={$page.url.pathname === link.path}
      >
        <span class="text-2xl">{link.icon}</span>
        <span class:text-blue-500={$page.url.pathname === link.path}>{link.label}</span>
      </button>
    {/each}
  </div>
</nav>