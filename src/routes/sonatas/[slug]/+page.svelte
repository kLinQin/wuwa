<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '#lib/components/DataSection.svelte';
  import DataCard from '#lib/components/DataCard.svelte';

  let { data }: PageProps = $props();
  const item = $derived(data.item);
  const echoes = $derived(data.associatedEchoes || []);
</script>

<svelte:head><title>{item.name} — WuWa DB</title></svelte:head>

<div class="detail-page">
  <header class="sonata-header card" style="--sonata-color: {item.color}">
    <img src={item.image} alt={item.name} class="sonata-img" />
    <div class="info">
      <h1>{item.name}</h1>
      <p class="meta-text">v{item.version}</p>
    </div>
  </header>

  <DataSection title="Fetters">
    <div class="fetters-list">
      {#each item.fetters as f}
        <div class="fetter-item raised">
          <span class="key-badge">{f.key} pcs</span>
          <p class="desc">{f.effectDescription}</p>
        </div>
      {/each}
    </div>
  </DataSection>

  {#if echoes.length > 0}
    <DataSection title="Associated Echoes">
      <div class="grid">
        {#each echoes as e}
          <DataCard item={e} kind="echo" href={'/echoes/' + e.slug} />
        {/each}
      </div>
    </DataSection>
  {/if}
</div>

<style>
  .detail-page {
    width: 100%;
    padding: var(--content-pad);
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
  }

  .sonata-header {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    padding: var(--sp-4);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-left: 4px solid var(--sonata-color, var(--accent));
    border-radius: var(--radius);
  }
  .sonata-img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    background: var(--bg-hover);
    border-radius: var(--radius);
  }
  .info h1 { margin: 0 0 var(--sp-1); font-size: var(--fs-xl); color: var(--sonata-color, var(--text-body)); }
  .meta-text { color: var(--text-secondary); font-size: var(--fs-sm); margin: 0; }

  .fetters-list { display: flex; flex-direction: column; gap: var(--sp-3); }
  .fetter-item { padding: var(--sp-3); display: flex; flex-direction: column; gap: var(--sp-2); }
  .key-badge {
    background: var(--sonata-color, var(--accent));
    color: #fff;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: var(--fs-xs);
    font-weight: var(--fw-bold);
    align-self: flex-start;
  }
  .desc { margin: 0; line-height: 1.5; font-size: var(--fs-sm); }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--sp-3);
  }
</style>
