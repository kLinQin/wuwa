<script lang="ts">
  let { teams }: { teams: any[] } = $props();

  let page = $state(0);
  let viewportSize = $state(3);

  $effect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 768) viewportSize = 2;
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

  function slotLabel(idx: number, total: number): string {
    if (total === 3) return ['Main DPS', 'Sub DPS', 'Support'][idx] || 'Slot ' + (idx + 1);
    return 'Slot ' + (idx + 1);
  }
</script>

<div class="team-wrapper">
  <div class="team-container" style="grid-template-columns: repeat({viewportSize}, 1fr);">
    {#each visibleTeams as t}
      <div class="team-card surface">
        <div class="team-header">
          <h4>{t.name}</h4>
        </div>

        <div class="slots">
          {#each t.members as slot, idx}
            <div class="slot">
              <span class="slot-label">{slotLabel(idx, t.members.length)}</span>
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
                        onerror={(e) => { const el = e.currentTarget as HTMLImageElement; el.style.display='none'; const sib = el.nextElementSibling as HTMLElement | null; if (sib) sib.style.display='flex'; }}
                      />
                      <span class="char-fallback" style="display: none;">{c.charAt(0)}</span>
                      <span class="char-name">{c}</span>
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
      <button class="raised" onclick={prev} disabled={page === 0} aria-label="Prev"><svg width="16" height="16" style="display:inline-block;vertical-align:middle"><use href="#arrow-left" /></svg></button>
      <span class="page-info">{page + 1} / {totalPages}</span>
      <button class="raised" onclick={next} disabled={page >= totalPages - 1} aria-label="Next"><svg width="16" height="16" style="display:inline-block;vertical-align:middle"><use href="#arrow-right" /></svg></button>
    </div>
  {/if}
</div>

<style>
  .team-wrapper { display: flex; flex-direction: column; gap: var(--sp-3); }
  .team-container { display: grid; gap: var(--sp-3); }

  .team-card {
    padding: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .team-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-2);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }
  .team-header h4 {
    margin: 0;
    font-size: var(--fs-md);
    color: var(--accent);
    font-weight: var(--fw-medium);
  }

  .slots {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .slot {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
  }
  .slot-label {
    color: var(--text-secondary);
    font-size: var(--fs-2xs);
    font-weight: var(--fw-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .chars { display: flex; flex-wrap: wrap; gap: var(--sp-2); }

  .char-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-decoration: none;
    color: inherit;
    transition: transform 0.15s;
    max-width: 76px;
  }
  .char-link:hover { transform: translateY(-2px); }
  .char-link:hover .char-avatar,
  .char-link:hover .char-fallback { border-color: var(--accent); }

  .char-avatar {
    width: 52px;
    height: 52px;
    object-fit: cover;
    border-radius: var(--radius);
    background: var(--bg-hover);
    border: 2px solid var(--border);
    transition: border-color 0.15s;
  }
  .char-avatar.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    font-size: var(--fs-sm);
  }

  .char-fallback {
    width: 52px;
    height: 52px;
    border-radius: var(--radius);
    background: var(--bg-hover);
    border: 2px solid var(--border);
    align-items: center;
    justify-content: center;
    color: var(--text-body);
    font-weight: var(--fw-bold);
    font-size: var(--fs-md);
  }

  .char-name {
    font-size: var(--fs-2xs);
    color: var(--text-body);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-weight: var(--fw-medium);
  }

  .echo-nav { display: flex; justify-content: space-between; align-items: center; gap: var(--sp-2); }
  .page-info { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-secondary); }
</style>
