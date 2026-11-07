<script lang="ts">
  import type { PageProps } from './$types';
  import DataCard from '#lib/components/DataCard.svelte';
  let { data }: PageProps = $props();
  let q = $state('');
  const items = $derived(
    data.items.filter((w: any) => w.name.toLowerCase().includes(q.toLowerCase()))
  );
</script>

<svelte:head><title>Weapons — WuWa DB</title></svelte:head>
<h1>Weapons</h1>

<div class="toolbar">
  <input placeholder="Search name..." bind:value={q} />
</div>
<p class="count">{items.length} weapons</p>

<div class="grid">
  {#each items as w}
    <DataCard item={w} kind="weapon" />
  {/each}
</div>
