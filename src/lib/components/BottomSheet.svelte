<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    open = $bindable(false),
    title = '',
    onclose,
    children,
  }: {
    open?: boolean;
    title?: string;
    onclose?: () => void;
    children?: Snippet;
  } = $props();

  function close() {
    open = false;
    onclose?.();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) close();
  }
</script>

<svelte:window onkeydown={onKey} />

{#if open}
  <div class="sheet-backdrop" onclick={close} role="presentation"></div>
  <div class="sheet" role="dialog" aria-modal="true">
    <div class="sheet-handle"></div>
    {#if title}
      <header class="sheet-header">
        <h2>{title}</h2>
        <button class="sheet-close" onclick={close} aria-label="Close">&times;</button>
      </header>
    {/if}
    <div class="sheet-body">
      {@render children?.()}
    </div>
  </div>
{/if}

<style>
  .sheet-backdrop {
    position: fixed;
    inset: 0 0 var(--nav-h) 0;
    background: rgba(0,0,0,0.55);
    z-index: 100;
  }

  .sheet {
    position: fixed;
    left: 0;
    right: 0;
    bottom: var(--nav-h);
    z-index: 101;
    background: var(--bg-elev);
    border-top: 1px solid var(--border);
    border-radius: var(--radius) var(--radius) 0 0;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: var(--max-content);
    margin: 0 auto;
  }

  .sheet-handle {
    width: 36px;
    height: 3px;
    border-radius: 2px;
    background: var(--border);
    margin: var(--sp-2) auto var(--sp-1);
    flex-shrink: 0;
  }

  .sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-2);
    padding: var(--sp-2) var(--sp-4);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .sheet-header h2 {
    margin: 0;
    font-size: var(--fs-md);
    font-family: var(--font-ui);
  }

  .sheet-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: var(--fs-lg);
    cursor: pointer;
    line-height: 1;
    padding: 0 var(--sp-1);
  }

  .sheet-close:hover { color: var(--text-body); }

  .sheet-body {
    padding: var(--sp-4);
    overflow-y: hidden;
    flex: 1;
    min-height: 0;
  }

  @media (min-width: 832px) {
    .sheet-backdrop {
      inset: 0;
    }
    .sheet {
      bottom: 0;
      max-width: var(--max-content);
      margin: 0 auto;
      left: 0;
      right: 0;
    }
  }
</style>
