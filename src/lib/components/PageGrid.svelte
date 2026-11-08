<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';

  let {
    title,
    items,
    countLabel,
    children,
    filters,
    searchAsLabel = false,
  }: {
    title: string;
    items: any[];
    countLabel: string;
    children: Snippet<[any]>;
    filters?: Snippet;
    searchAsLabel?: boolean;
  } = $props();

  let q = $state('');
  let openedFilter = $state<string | null>(null);

  onMount(() => {
    function handleOpened(e: any) {
      openedFilter = e.detail;
    }
    window.addEventListener('filter-opened', handleOpened);
    return () => window.removeEventListener('filter-opened', handleOpened);
  });

  const filtered = $derived(
    items.filter((item: any) =>
      (item.name || item.slug || '').toLowerCase().includes(q.toLowerCase())
    )
  );
</script>

<svelte:head><title>{title} — WuWa DB</title></svelte:head>

<div class="page-container">
  <div class="page-header">
    {#if !openedFilter}
      <div class="search-box raised" class:read-only={searchAsLabel}>
        {#if searchAsLabel}
          <span class="label-text">{title}</span>
        {:else}
          <input placeholder="Search name..." bind:value={q} />
        {/if}
      </div>
    {/if}

    {#if filters}
      <div class="filters-container">
        <div class="filters-wrapper" class:hide-others={openedFilter !== null}>
           {@render filters()}
        </div>
      </div>
    {/if}
  </div>

  <div class="grid-container">
    <div class="grid">
      {#each filtered as item, i (item.slug || item.name || item.title || i)}
        {@render children(item)}
      {/each}
    </div>
  </div>

  <div class="total-count">
    Total: {filtered.length} {countLabel}
  </div>
</div>

<style>
  :global(main:has(.page-container)) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    overflow: hidden !important;
    height: 100%;
  }

  .page-container {
    display: flex;
    flex-direction: column;
    height: calc(100dvh - var(--nav-h));
  }
  @media (max-width: 831px) {
    .page-container { height: 100dvh; }
  }

  .page-header {
    background: var(--bg);
    padding: 4px 0;
    flex-shrink: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
  }

  .search-box {
    flex: 1;
    min-width: 150px;
    max-width: 300px;
    display: flex;
    align-items: center;
    height: 36px;
  }

  .search-box .label-text {
    width: 100%;
    padding: 0 var(--sp-2);
    color: var(--text);
    font-weight: var(--fw-medium);
    display: flex;
    align-items: center;
    height: 100%;
  }

  .search-box input {
    width: 100%;
    padding: 0 var(--sp-2);
    background: transparent;
    border: none;
    color: var(--text);
    outline: none;
    height: 100%;
  }

  .filters-container {
    display: flex;
    align-items: stretch;
    gap: var(--sp-2);
    flex-wrap: nowrap;
    height: 36px;
    overflow-x: auto;
    scrollbar-width: none;
    flex: 1;
    justify-content: flex-end;
  }

  .filters-wrapper {
    display: flex;
    align-items: stretch;
    gap: var(--sp-2);
    justify-content: flex-end;
    width: 100%;
  }

  /* CSS ini digunakan sebagai fallback, tapi utamanya dikendalikan oleh state */
  .filters-wrapper.hide-others :global(.inline-filter:not(.is-open)) {
    display: none;
  }

  

  .total-count {
    color: var(--text-muted);
    font-size: var(--fs-sm);
    text-align: right;
    padding: var(--sp-2) 0;
    flex-shrink: 0;
  }

  .grid-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    padding-bottom: var(--sp-4);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--sp-3);
  }
</style>
