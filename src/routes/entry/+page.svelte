<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  $: if ($page.url.pathname === '/entry') {
    goto('/entry/mood');
  }
</script>

<div class="p-4 text-center">
  <p>Redirecting to mood selection...</p>
</div>
