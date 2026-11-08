<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    items,
    countLabel,
    children,
  }: {
    title: string;
    items: any[];
    countLabel: string;
    children: Snippet<[any]>;
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
      <input placeholder="Search name..." bind:value={q} />
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
  }

  .page-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
  }

  .page-header-row input {
    width: 100%;
    max-width: 400px;
    padding: var(--sp-2);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
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
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--sp-3);
  }
</style>
