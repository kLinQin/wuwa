<script lang="ts">
  import type { PageProps } from './$types';
  import PageGrid from '#lib/components/PageGrid.svelte';
  import { goto } from '$app/navigation';

  let { data }: PageProps = $props();
  let tab = $state<'quests'|'glossary'>('quests');

  const currentItems = $derived(tab === 'quests' ? data.quests : data.terms);
  const currentLabel = $derived(tab === 'quests' ? 'quests' : 'terms');
</script>

<svelte:head><title>Quests — WuWa DB</title></svelte:head>

<PageGrid title="Quests" items={currentItems} countLabel={currentLabel}>
  {#snippet filters()}
    <div style="height: 100%; display: flex; align-items: center; gap: 4px;">
      <button class="raised" style="height: 100%;" aria-pressed={tab==='quests'} onclick={() => tab='quests'}>Quests</button>
      <button class="raised" style="height: 100%;" aria-pressed={tab==='glossary'} onclick={() => tab='glossary'}>Glossary</button>
    </div>
  {/snippet}

  {#snippet children(item)}
    {#if tab === 'quests'}
      <button class="row quest-row" onclick={() => goto('/quests/' + item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))}>
        <span class="badge">{item.type}</span>
        <span class="name">{item.title}</span>
      </button>
    {:else}
      <div class="row glossary-row">
        {#if item.image}
          <img class="glossary-img" src={item.image} alt={item.name} loading="lazy" />
        {/if}
        <div class="glossary-body">
          <div class="name">{item.name}</div>
          <div class="desc">{item.description}</div>
        </div>
      </div>
    {/if}
  {/snippet}
</PageGrid>

<style>
  .row {
    grid-column: 1 / -1; /* Agar list memanjang penuh ke bawah */
    display: flex;
    flex-direction: column;
    padding: var(--sp-3);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--bg-elev);
    text-decoration: none;
    color: var(--text);
    text-align: left;
    cursor: pointer;
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

  .glossary-row {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--sp-3);
  }
  .glossary-img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .glossary-body {
    display: flex;
    flex-direction: column;
  }

  .badge {
    font-size: var(--fs-xs);
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 2px 6px;
    border-radius: var(--radius);
    align-self: flex-start;
    margin-bottom: var(--sp-1);
  }
</style>
