<script lang="ts">
  import { onMount } from 'svelte';

  let { label, options, bind:value }: {
    label: string;
    options: { value: any; label: string }[];
    value: any;
  } = $props();

  let open = $state(false);
  let id = Math.random().toString(36).slice(2);

  let selectedLabel = $derived(
    value === 'all' ? label : options.find(o => o.value === value)?.label || label
  );

  function select(val: any) {
    value = val;
    open = false;
  }

  function toggle(e: MouseEvent) {
    e.stopPropagation();
    open = !open;
    if (open) {
      window.dispatchEvent(new CustomEvent('close-dropdowns', { detail: id }));
    }
  }

  onMount(() => {
    function handleClose(e: any) {
      if (e.detail !== id) open = false;
    }
    function handleWindowClick() {
      open = false;
    }

    window.addEventListener('close-dropdowns', handleClose);
    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('close-dropdowns', handleClose);
      window.removeEventListener('click', handleWindowClick);
    };
  });
</script>

<div class="dropdown-filter">
  <button class="raised filter-btn" class:active={open} onclick={toggle}>
    {selectedLabel}
    <span class="arrow">▾</span>
  </button>

  {#if open}
    <div class="dropdown-menu raised" onclick={(e) => e.stopPropagation()}>
      <button class="dropdown-item" class:selected={value === 'all'} onclick={() => select('all')}>All</button>
      {#each options as opt}
        <button class="dropdown-item" class:selected={value === opt.value} onclick={() => select(opt.value)}>
          {opt.label}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropdown-filter {
    position: relative;
    display: inline-block;
  }

  .filter-btn {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
    padding: var(--sp-2) var(--sp-3);
    font-size: var(--fs-sm);
    cursor: pointer;
    height: 100%;
    white-space: nowrap;
  }

  .arrow {
    font-size: 10px;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 50;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    min-width: 150px;
    max-height: 250px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    scrollbar-width: none;
  }

  .dropdown-menu::-webkit-scrollbar {
    display: none;
  }

  .dropdown-item {
    padding: var(--sp-2);
    text-align: left;
    background: none;
    border: none;
    color: var(--text);
    font-size: var(--fs-sm);
    cursor: pointer;
    border-radius: var(--radius);
  }

  .dropdown-item:hover {
    background: var(--bg-hover);
  }

  .dropdown-item.selected {
    background: var(--accent);
    color: var(--text-inverse);
  }
</style>
