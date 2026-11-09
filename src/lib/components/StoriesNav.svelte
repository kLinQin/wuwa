<script lang="ts">
  let { groups, activeId = '' }: { groups: any[]; activeId?: string } = $props();
  const slugify = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }
</script>

<div class="nav-sticky">
  {#each groups as group}
    {@const id = 'group-' + slugify(group.name)}
    <button class="raised small-btn" aria-pressed={activeId === id} onclick={() => scrollTo(id)}>
      {group.name || 'Other'}
    </button>
  {/each}
</div>

<style>
  .nav-sticky {
    position: sticky;
    top: 0;
    box-shadow: 0 -4px 0 0 var(--bg);
    z-index: 50;
    background: var(--bg);
    padding: var(--sp-2) 0;
    margin: 0 calc(var(--content-pad) * -1);
    padding-left: var(--content-pad);
    padding-right: var(--content-pad);
    display: flex;
    gap: var(--sp-2);
    overflow-x: auto;
    white-space: nowrap;
    border-bottom: 1px solid var(--border);
  }
  .nav-sticky::-webkit-scrollbar { display: none; }

  @media (min-width: 832px) {
    .nav-sticky {
      top: 0; 
    }
  }
  .small-btn { padding: 4px 8px; font-size: var(--fs-xs); cursor: pointer; }
</style>
