<script lang="ts">
  import { md } from '#lib/md';
  let { text, class: cls = '' }: { text: string | null | undefined; class?: string } = $props();
  const html = $derived(md(text));
</script>

<div class="md {cls}">{@html html}</div>

