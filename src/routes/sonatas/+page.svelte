<script lang="ts">
  import type { PageProps } from './$types';
  import DataCard from '#lib/components/DataCard.svelte';
  let { data }: PageProps = $props();
  let q = $state('');
  const items = $derived(
    data.items.filter((s: any) => s.name.toLowerCase().includes(q.toLowerCase()))
  );
</script>

<svelte:head><title>Sonatas — WuWa DB</title></svelte:head>
<h1>Sonatas</h1>

<div class="toolbar">
  <input placeholder="Search name..." bind:value={q} />
</div>
<p class="count">{items.length} sonatas</p>

<div class="grid">
  {#each items as s}
    <DataCard item={s} kind="sonata" />
  {/each}
</div>
