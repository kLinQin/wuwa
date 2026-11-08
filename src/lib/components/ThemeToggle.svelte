<script lang="ts">
  import { theme } from '#lib/theme.svelte';

  const iconId = $derived(
    theme.value === 'dark' ? '#theme-dark'
    : theme.value === 'light' ? '#theme-light'
    : '#theme-claude'
  );
</script>

<button
  onclick={() => theme.next()}
  class="raised icon"
  type="button"
  aria-label={`Toggle theme (current: ${theme.value})`}
>
  <svg width="24" height="24" fill="currentColor">
    <use href={iconId} />
  </svg>
</button>
<style>
  button { display: flex; align-items: center; justify-content: center; }
</style>
