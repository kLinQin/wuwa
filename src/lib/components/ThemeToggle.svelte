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
  <span
    class="icon-mask"
    style:mask-image={theme.value === 'dark' ? 'url(/icons/theme-dark.svg)' : 'url(/icons/theme-light.svg)'}
    style:-webkit-mask-image={theme.value === 'dark' ? 'url(/icons/theme-dark.svg)' : 'url(/icons/theme-light.svg)'}
  ></span>
</button>
