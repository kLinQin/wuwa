<script lang="ts">
  import type { PageProps } from './$types';
  import DataCard from '#lib/components/DataCard.svelte';
  let { data }: PageProps = $props();
  let q = $state('');
  const items = $derived(
    data.items.filter((e: any) => e.name.toLowerCase().includes(q.toLowerCase()))
  );
</script>

<svelte:head><title>Echoes — WuWa DB</title></svelte:head>
<h1>Echoes</h1>

<div class="toolbar">
  <input placeholder="Search name..." bind:value={q} />
</div>
<p class="count">{items.length} echoes</p>

<div class="grid">
  {#each items as e}
    <DataCard item={e} kind="echo" href={`/echoes/${e.slug}`} />
  {/each}
</div>
