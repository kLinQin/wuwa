<script lang="ts">
  let { label, options, bind:value }: {
    label: string;
    options: { value: any; label: string }[];
    value: any;
  } = $props();

  let open = $state(false);

  function select(val: any) {
    value = val;
    open = false;
    window.dispatchEvent(new CustomEvent('filter-opened', { detail: null }));
  }

  function toggle() {
    open = !open;
    if (open) {
      window.dispatchEvent(new CustomEvent('filter-opened', { detail: label }));
    } else {
      window.dispatchEvent(new CustomEvent('filter-opened', { detail: null }));
    }
  }
</script>

<div class="inline-filter" class:is-open={open}>
  {#if open}
    <div class="chips-inline">
      <button class="chip raised" class:selected={value === 'all'} onclick={() => select('all')}>All</button>
      {#each options as opt}
        <button class="chip raised" class:selected={value === opt.value} onclick={() => select(opt.value)}>
          {opt.label}
        </button>
      {/each}
    </div>
  {/if}

  <button class="raised filter-btn" class:active={open} onclick={toggle}>
    {value === 'all' ? label : options.find(o => o.value === value)?.label || label}
  </button>
</div>

<style>
  .inline-filter {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 4px;
    height: 100%;
    justify-content: flex-end;
  }

  .inline-filter.is-open {
    flex: 1;
  }

  .filter-btn {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
    padding: 0 var(--sp-3);
    font-size: var(--fs-sm);
    cursor: pointer;
    height: 100%;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .filter-btn.active {
    color: var(--accent);
  }


  .chips-inline {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;
    height: 100%;
    margin-left: auto;

    /* Lebar maksimal mengikuti layar, tapi dibatasi 1024px */
    max-width: min(100vw, var(--max-content));
    cursor: grab;
  }
  .chips-inline:active {
    cursor: grabbing;
  }
  .chips-inline:active {
    cursor: grabbing;
  }

  .chips-inline::-webkit-scrollbar { display: none; }

  .chip {
    padding: 0 10px;
    font-size: var(--fs-xs);
    cursor: pointer;
    white-space: nowrap;
    height: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  .chip.selected { color: var(--accent); }
</style>
