<script lang="ts">
  import { fontMode } from '#lib/font.svelte';
</script>

<button
  onclick={() => fontMode.toggle()}
  class="raised icon"
  type="button"
  aria-pressed={fontMode.value === 'boring'}
  aria-label="Toggle font"
>
  <svg width="24" height="24" fill="currentColor">
    <use href={fontMode.value === 'boring' ? '#font-boring' : '#font-elegant'} />
  </svg>
</button>
<style>
  button { display: flex; align-items: center; justify-content: center; }
</style>
