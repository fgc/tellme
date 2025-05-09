<script lang="ts">
  import { fade } from 'svelte/transition';
  import { fly } from 'svelte/transition';
  
  export let message: string;
  export let type: 'success' | 'error' | 'info' = 'success';
  export let duration = 3000;
  export let isOpen = false;

  let timer: number;
  
  $: {
    clearTimeout(timer);
    if (isOpen) {
      timer = window.setTimeout(() => {
        isOpen = false;
      }, duration);
    }
  }
</script>

{#if isOpen}
<div
  class="fixed bottom-4 right-4 z-50"
  transition:fade
>
  <div
    class="px-4 py-3 rounded-lg shadow-lg
      ${type === 'success' ? 'bg-green-500 text-white' : ''}
      ${type === 'error' ? 'bg-red-500 text-white' : ''}
      ${type === 'info' ? 'bg-blue-500 text-white' : ''}"
    transition:fly={{ y: 20 }}
  >
    {message}
  </div>
</div>
{/if}
