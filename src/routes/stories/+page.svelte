<script lang="ts">
  import type { PageProps } from './$types';
  import PageGrid from '#lib/components/PageGrid.svelte';
  let { data }: PageProps = $props();
</script>

<svelte:head><title>Stories — WuWa DB</title></svelte:head>

<PageGrid title="Stories" items={data.items} countLabel="stories">
  {#snippet children(s)}
    <a href={'/stories/' + s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')} class="row card-link">
      <div class="name">{s.name}</div>
      <div class="desc">{s.description ?? ''}</div>
    </a>
  {/snippet}
</PageGrid>

<style>
  .row {
    grid-column: 1 / -1; /* Agar list memanjang penuh, bukan kotak-kotak */
    display: flex;
    flex-direction: column;
    padding: var(--sp-3);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--bg-elev);
    text-decoration: none;
    color: var(--text);
  }
  .row:hover {
    background: var(--bg-hover);
  }
  .row .name {
    font-weight: var(--fw-medium);
    font-size: var(--fs-md);
  }
  .row .desc {
    font-size: var(--fs-sm);
    color: var(--text-muted);
    margin-top: var(--sp-1);
  }
</style>
