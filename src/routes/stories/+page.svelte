<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
  let q = $state('');
  const items = $derived(
    data.items.filter((s: any) => s.name.toLowerCase().includes(q.toLowerCase()))
  );
</script>

<svelte:head><title>Stories — WuWa DB</title></svelte:head>
<h1>Stories</h1>

<div class="toolbar">
  <input placeholder="Search name..." bind:value={q} />
</div>
<p class="count">{items.length} stories</p>

<div class="list">
  {#each items as s}
    <a href={'/stories/' + s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')} class="row card-link">
      <div class="name">{s.name}</div>
      <div class="desc">{s.description ?? ''}</div>
    </a>
  {/each}
</div>
