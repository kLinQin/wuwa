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
  <span
    class="icon-mask"
    style:mask-image={fontMode.value === 'boring' ? 'url(/icons/font-boring.svg)' : 'url(/icons/font-elegant.svg)'}
    style:-webkit-mask-image={fontMode.value === 'boring' ? 'url(/icons/font-boring.svg)' : 'url(/icons/font-elegant.svg)'}
  ></span>
</button>
