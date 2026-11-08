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
    <div class="chips-container" onclick={(e) => e.stopPropagation()}>
      <button class="chip raised" class:selected={value === 'all'} onclick={() => select('all')}>All</button>
      {#each options as opt}
        <button class="chip raised" class:selected={value === opt.value} onclick={() => select(opt.value)}>
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

  .filter-btn.active {
    color: var(--accent);
  }

  .arrow {
    font-size: 10px;
  }

    .chips-container {
    position: absolute;
    top: calc(100% + 4px);
    /* Default: nempel di kiri tombol */
    left: 0;
    right: auto;
    z-index: 50;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 4px;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    min-width: 200px;
    max-width: 80vw;
  }

  .chips-container::-webkit-scrollbar {
    display: none;
  }

  .chip {
    padding: 0 12px;
    font-size: var(--fs-xs);
    cursor: pointer;
    white-space: nowrap;
    height: 32px;
    display: flex;
    align-items: center;
  }

  .chip.selected {
    color: var(--accent);
    border-color: var(--accent);
  }

  @media (min-width: 1025px) {
    .chips-container {
      transform: translateX(-10px);
    }
  }
</style>
