<script lang="ts">
  import { page } from '$app/stores';
</script>

<nav class="fixed bottom-0 w-full bg-white border-t-2 border-gray-100">
  <div class="flex justify-around p-4">
    <a
      href="/entry"
      class="flex flex-col items-center text-sm font-medium"
      class:font-bold={$page.url.pathname === '/entry'}
    >
      <span class="text-2xl">📅</span>
      <span class:text-blue-500={$page.url.pathname === '/entry'}>Log</span>
    </a>
    
    <a
      href="/weekly"
      class="flex flex-col items-center text-sm font-medium"
      class:font-bold={$page.url.pathname === '/weekly'}
    >
      <span class="text-2xl">📊</span>
      <span class:text-blue-500={$page.url.pathname === '/weekly'}>View</span>
    </a>
    
    <a
      href="/settings"
      class="flex flex-col items-center text-sm font-medium"
      class:font-bold={$page.url.pathpathname === '/settings'}
    >
      <span class="text-2xl">⚙️</span>
      <span class:text-blue-500={$page.url.pathname === '/settings'}>Settings</span>
    </a>
  </div>
</nav>