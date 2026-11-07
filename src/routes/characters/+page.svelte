<script lang="ts">
  import type { PageProps } from './$types';
  import DataCard from '#lib/components/DataCard.svelte';
  let { data }: PageProps = $props();
  let q = $state('');
  const items = $derived(
    data.items.filter((c: any) => c.name.toLowerCase().includes(q.toLowerCase()))
  );
</script>

<svelte:head><title>Characters — WuWa DB</title></svelte:head>
<h1>Characters</h1>

<div class="toolbar">
  <input placeholder="Search name..." bind:value={q} />
</div>
<p class="count">{items.length} characters</p>

<div class="grid">
  {#each items as c}
    <DataCard item={c} kind="character" href={`/characters/${c.id}`} />
  {/each}
</div>
