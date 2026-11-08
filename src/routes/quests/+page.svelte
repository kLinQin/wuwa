<script lang="ts">
  import type { PageProps } from './$types';
  import PageGrid from '#lib/components/PageGrid.svelte';
  import ReaderMode from '#lib/components/ReaderMode.svelte';
  import Icons from '#lib/components/Icons.svelte';

  let { data }: PageProps = $props();
  let tab = $state<'quests'|'glossary'>('quests');
  let selected = $state<any>(null);

  const currentItems = $derived(tab === 'quests' ? data.quests : data.terms);
  const currentLabel = $derived(tab === 'quests' ? 'quests' : 'terms');
</script>

<Icons />
<svelte:head><title>Quests — WuWa DB</title></svelte:head>

<PageGrid
  title={selected ? (selected.title || selected.name) : "Quests"}
  items={selected ? [{}] : currentItems}
  countLabel={currentLabel}
  searchAsLabel={true}
>
  {#snippet filters()}
    {#if selected}
      <div style="height: 100%; display: flex; align-items: center;">
        <button class="raised" style="height: 100%; display: flex; align-items: center; gap: 4px;" onclick={() => selected = null}>
          <svg width="16" height="16" fill="currentColor"><use href="#arrow-left" /></svg>
          Back
        </button>
      </div>
    {:else}
      <div style="height: 100%; display: flex; align-items: center; gap: 4px;">
        <button class="raised" style="height: 100%;" aria-pressed={tab==='quests'} onclick={() => tab='quests'}>Quests</button>
        <button class="raised" style="height: 100%;" aria-pressed={tab==='glossary'} onclick={() => tab='glossary'}>Glossary</button>
      </div>
    {/if}
  {/snippet}

  {#snippet children(item)}
    {#if selected}
      <div class="reader-wrapper">
        <ReaderMode
          title={selected.title}
          type={selected.type}
          blocks={selected.blocks}
        />
      </div>
    {:else if tab === 'quests'}
      <button class="row quest-row" onclick={() => selected = item}>
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
  .reader-wrapper {
    grid-column: 1 / -1;
    width: 100%;
  }

  .row {
    grid-column: 1 / -1;
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
