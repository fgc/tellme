<script lang="ts">
  export let type: 'primary' | 'secondary' | 'danger' = 'primary';
  export let disabled = false;
  export let className = '';
</script>

<button
  class={`px-4 py-2 rounded-lg font-medium transition-all duration-200
    ${type === 'primary' ? 'bg-accent-700 text-white hover:bg-accent-800' : ''}
    ${type === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''}
    ${type === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}`}
  {disabled}
>
  <slot />
</button>
