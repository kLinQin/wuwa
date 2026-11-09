<script lang="ts">
  import type { Snippet } from 'svelte';
  type Header = string | { label: string; align?: 'left' | 'right' };
  let {
    title,
    headers = [],
    class: cls = '',
    children
  }: {
    title?: string;
    headers?: Header[];
    class?: string;
    children: Snippet;
  } = $props();
  const norm = (h: Header) => typeof h === 'string' ? { label: h, align: 'left' as const } : { align: 'left' as const, ...h };
</script>

<div class="surface data-table-wrap">
  {#if title}
    <h4 class="box-header box-header-inset">{title}</h4>
  {/if}
  <table class="data-table {cls}">
    {#if headers.length}
      <thead><tr>{#each headers as h}{@const n = norm(h)}<th class={n.align === 'right' ? 'num' : ''}>{n.label}</th>{/each}</tr></thead>
    {/if}
    <tbody>
      {@render children()}
    </tbody>
  </table>
</div>
