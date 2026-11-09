<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '#lib/components/DataSection.svelte';
  import DataCard from '#lib/components/DataCard.svelte';
  import DetailHeader from '#lib/components/DetailHeader.svelte';

  let { data }: PageProps = $props();
  const item = $derived(data.item);
  const echoes = $derived(data.associatedEchoes || []);
  let page = $state(0);
  let viewportSize = $state(6);
  $effect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) viewportSize = 6;
      else if (w >= 768) viewportSize = 4;
      else viewportSize = 3;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  });

  const totalPages = $derived(Math.max(1, Math.ceil(echoes.length / viewportSize)));
  const visibleEchoes = $derived(echoes.slice(page * viewportSize, (page + 1) * viewportSize));
  function prev() { page = Math.max(0, page - 1); }
  function next() { page = Math.min(totalPages - 1, page + 1); }
</script>

<svelte:head><title>{item.name} — WuWa DB</title></svelte:head>

<div class="detail-page">
  <DetailHeader
    hideDetails={true}
    title={item.name}
    image={item.image}
    color={item.color}
  />

  <DataSection title="Details">
    <div class="fetters-list">
      {#each item.fetters as f}
        <div class="fetter-item surface">
          <span class="key-badge">{f.key} pcs</span>
          <p class="desc">{f.effectDescription}</p>
        </div>
      {/each}
    </div>
  </DataSection>

  {#if echoes.length > 0}
    <DataSection title="Associated Echoes">
      <div class="grid" style="grid-template-columns: repeat({viewportSize}, 1fr);">
        {#each visibleEchoes as e}
          <DataCard item={e} kind="echo" href={'/echoes/' + e.slug} />
        {/each}
      </div>
      <div class="echo-nav">
        <button class="raised" onclick={prev} disabled={page === 0} aria-label="Prev">←</button>
        <span class="page-info">{page + 1} / {totalPages}</span>
        <button class="raised" onclick={next} disabled={page >= totalPages - 1} aria-label="Next">→</button>
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

  .grid { display: grid; gap: var(--sp-3); }
  .echo-nav { display: flex; justify-content: space-between; align-items: center; margin-top: var(--sp-3); gap: var(--sp-2); }
  .page-info { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-secondary); }
</style>
