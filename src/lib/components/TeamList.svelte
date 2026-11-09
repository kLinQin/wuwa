<script lang="ts">
  let { teams, teamNote, onnote }: { teams: any[]; teamNote?: string; onnote?: (note: string) => void } = $props();

  let page = $state(0);
  let viewportSize = $state(3);

  $effect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) viewportSize = 3;
      else if (w >= 768) viewportSize = 2;
      else viewportSize = 1;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  });

  const totalPages = $derived(Math.max(1, Math.ceil(teams.length / viewportSize)));
  const visibleTeams = $derived(teams.slice(page * viewportSize, (page + 1) * viewportSize));
  function prev() { page = Math.max(0, page - 1); }
  function next() { page = Math.min(totalPages - 1, page + 1); }

  function getCharSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
</script>

<div class="team-wrapper">
  <div class="team-container" style="grid-template-columns: repeat({viewportSize}, 1fr);">
    {#each visibleTeams as t}
      <div class="team-card surface">
        <div class="team-header">
          <h4>{t.name}</h4>
          {#if teamNote}
            <button class="raised small-btn" onclick={() => onnote?.(teamNote)}>ℹ Note</button>
          {/if}
        </div>

        <div class="slots">
          {#each t.members as slot, idx}
            <div class="slot">
              <span class="slot-label">Slot {idx + 1}</span>
              <div class="chars">
                {#if slot.length === 0}
                  <div class="char-avatar empty">-</div>
                {:else}
                  {#each slot as c}
                    {@const slug = getCharSlug(c)}
                    <a href={`/characters/${slug}`} class="char-link" title={c}>
                      <img
                        src={`/icons/characters/${slug}.webp`}
                        alt={c}
                        class="char-avatar"
                        onerror={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling.style.display='flex'; }}
                      />
                      <span class="char-fallback" style="display: none;">{c.charAt(0)}</span>
                    </a>
                  {/each}
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  {#if totalPages > 1}
    <div class="echo-nav">
      <button class="raised" onclick={prev} disabled={page === 0} aria-label="Prev">←</button>
      <span class="page-info">{page + 1} / {totalPages}</span>
      <button class="raised" onclick={next} disabled={page >= totalPages - 1} aria-label="Next">→</button>
    </div>
  {/if}
</div>

<style>
  .team-wrapper { display: flex; flex-direction: column; gap: var(--sp-3); }
  .team-container { display: grid; gap: var(--sp-3); }
  .team-card { padding: var(--sp-3); display: flex; flex-direction: column; gap: var(--sp-2); }
  .team-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: var(--sp-2); }
  .team-header h4 { margin: 0; font-size: var(--fs-md); color: var(--accent); }
  .small-btn { padding: 2px 8px; font-size: var(--fs-xs); cursor: pointer; }
  .slots { display: flex; flex-direction: column; gap: var(--sp-2); margin-top: var(--sp-1); }
  .slot { display: flex; align-items: center; gap: var(--sp-2); }
  .slot-label { width: 50px; color: var(--text-secondary); font-size: var(--fs-xs); font-weight: var(--fw-medium); flex-shrink: 0; }
  .chars { display: flex; flex-wrap: wrap; gap: 4px; flex: 1; }
  .char-link { display: inline-flex; text-decoration: none; }
  .char-avatar { width: 36px; height: 36px; object-fit: cover; border-radius: 50%; background: var(--bg-hover); border: 1px solid var(--border); }
  .char-avatar.empty { display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: var(--fs-sm); }
  .char-fallback { width: 36px; height: 36px; border-radius: 50%; background: var(--bg-hover); border: 1px solid var(--border); align-items: center; justify-content: center; color: var(--text-body); font-weight: var(--fw-bold); font-size: var(--fs-sm); }
  .echo-nav { display: flex; justify-content: space-between; align-items: center; gap: var(--sp-2); }
  .page-info { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-secondary); }
</style>
