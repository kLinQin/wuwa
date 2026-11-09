<script lang="ts">
  import { goto } from '$app/navigation';

  let { speakers, activeId }: { speakers: any[]; activeId: string } = $props();
  let scrollAreaEl: HTMLDivElement;

  $effect(() => {
    if (!activeId || !scrollAreaEl) return;
    const activeBtn = scrollAreaEl.querySelector('[aria-pressed="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<div class="nav-sticky">
  <button class="raised small-btn back-btn" onclick={() => goto('/stories')}>
    <svg width="16" height="16"><use href="#arrow-left" /></svg>
    Back
  </button>

  <div class="divider"></div>

  <div class="scroll-area" bind:this={scrollAreaEl}>
    {#each speakers as sp}
      <button class="raised small-btn" aria-pressed={activeId === sp.id} onclick={() => scrollTo(sp.id)}>
        {sp.name}
      </button>
    {/each}
  </div>
</div>

<style>
  .nav-sticky {
    position: sticky;
    top: 0;
    box-shadow: 0 -4px 0 0 var(--bg);
    z-index: 50;
    background: var(--bg);
    padding: var(--sp-2) 0;
    margin: calc(var(--content-pad) * -1) calc(var(--content-pad) * -1) 0 calc(var(--content-pad) * -1);
    padding-left: var(--content-pad);
    padding-right: var(--content-pad);
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border);
  }

  .scroll-area {
    display: flex;
    gap: var(--sp-2);
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
    flex: 1;
  }
  .scroll-area::-webkit-scrollbar { display: none; }

  .small-btn { padding: 4px 8px; font-size: var(--fs-xs); cursor: pointer; flex-shrink: 0; }
  .back-btn { display: flex; align-items: center; gap: 4px; font-size: var(--fs-sm); padding: 4px 12px; margin-right: var(--sp-2); }
  .divider { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; margin-right: var(--sp-2); }
</style>
