<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="min-h-screen p-4">
  <h1 class="text-2xl font-bold">Error {$page.status}</h1>
  <p class="mt-4 text-red-500">{$page.error.message}</p>
  <p class="mt-4">Return to <a href="/entry" class="text-blue-500">home page</a></p>
</div>