<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    items,
    countLabel,
    children,
    filters,
  }: {
    title: string;
    items: any[];
    countLabel: string;
    children: Snippet<[any]>;
    filters?: Snippet;
  } = $props();

  let q = $state('');
  const filtered = $derived(
    items.filter((item: any) =>
      (item.name || item.slug || '').toLowerCase().includes(q.toLowerCase())
    )
  );
</script>

<svelte:head><title>{title} — WuWa DB</title></svelte:head>

<div class="page-container">
  <div class="page-header">
    <div class="page-header-row">
      <div class="search-box raised">
        <input placeholder="Search name..." bind:value={q} />
      </div>
      {#if filters}
        <div class="filters-container">
          {@render filters()}
        </div>
      {/if}
      <span class="count">{filtered.length} {countLabel}</span>
    </div>
  </div>

  <div class="grid-container">
    <div class="grid">
      {#each filtered as item (item.slug || item.name)}
        {@render children(item)}
      {/each}
    </div>
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
    .page-container {
      height: 100dvh; /* Mobile pakai nav bawah */
    }
  }

  .page-header {
    background: var(--bg);
    padding: 4px 0;
    flex-shrink: 0;
    margin: 0;
  }

  .page-header-row {
    display: flex;
    align-items: stretch;
    gap: var(--sp-2);
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
  }
  .page-header-row > * {
    height: 36px;
    display: flex;
    align-items: center;
  }

  .search-box {
    flex: 1;
    min-width: 150px;
    max-width: 300px;
    display: flex;
    align-items: center;
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
    gap: var(--sp-2);
    flex-wrap: wrap;
  }

  .count {
    color: var(--text-muted);
    font-size: var(--fs-sm);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .grid-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    padding-bottom: var(--sp-4);
    margin-top: -12px; /* Tarik naik */
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--sp-3);
  }
</style>
