<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '#lib/components/DataSection.svelte';

  let { data }: PageProps = $props();
  const item = data.item;
  const sonatasMap = data.sonatasMap || {};

  const elementNames: Record<number, string> = {
    1: 'Glacio', 2: 'Fusion', 3: 'Electro', 4: 'Aero', 5: 'Spectro', 6: 'Havoc'
  };

  const elName = $derived(elementNames[item.elementId as number] ?? '');

  // Resolve Sonata IDs to Names
  const sonataLabels = $derived(
    (item.sonatas || []).map(id => sonatasMap[id]?.name || ('Sonata ' + id)).join(', ')
  );
</script>

<svelte:head><title>{item.name} — WuWa DB</title></svelte:head>

<div class="detail-page">
  <header class="echo-header card">
    <img src={item.image} alt={item.name} class="echo-img" />
    <div class="info">
      <h1>{item.name}</h1>
      <div class="tags">
        {#if elName}<span class="badge">{elName}</span>{/if}
        <span class="badge muted">Cost {item.cost}</span>
        {#if item.rarity}<span class="badge stars">{'★'.repeat(item.rarity)}</span>{/if}
      </div>
      <p class="meta-text">v{item.version}</p>
    </div>
  </header>

  <DataSection title="Echo Skill">
    <div class="skill-desc">{@html item.description.split('\n').join('<br/>')}</div>
  </DataSection>

  {#if sonataLabels}
    <DataSection title="Associated Sonatas">
      <p class="sonata-list">{sonataLabels}</p>
    </DataSection>
  {/if}
</div>

<style>
  .detail-page {
    max-width: var(--max-content);
    margin: 0 auto;
    padding: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
  }

  .echo-header {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    padding: var(--sp-4);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .echo-img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    background: var(--bg-hover);
    border-radius: var(--radius);
  }
  .info h1 { margin: 0 0 var(--sp-2); font-size: var(--fs-xl); }
  .tags { display: flex; gap: var(--sp-2); flex-wrap: wrap; margin-bottom: var(--sp-2); }
  .stars { color: #f5c518; }
  .muted { background: var(--bg-hover); color: var(--text-muted); }
  .meta-text { color: var(--text-muted); font-size: var(--fs-sm); margin: 0; }

  .skill-desc { line-height: 1.6; color: var(--text); font-size: var(--fs-sm); }
  .sonata-list { font-size: var(--fs-sm); color: var(--accent); margin: 0; }
</style>
