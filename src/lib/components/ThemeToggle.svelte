<script lang="ts">
  import { theme } from '#lib/theme.svelte';
</script>

<button
  onclick={() => theme.toggle()}
  class="raised icon"
  type="button"
  aria-pressed={theme.value === 'dark'}
  aria-label="Toggle theme"
>
  <svg width="24" height="24" fill="currentColor">
    <use href={theme.value === 'dark' ? '#theme-dark' : '#theme-light'} />
  </svg>
</button>
<style>
  button { display: flex; align-items: center; justify-content: center; }
</style>
