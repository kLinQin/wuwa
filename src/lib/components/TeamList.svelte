<script lang="ts">
  let { teams }: { teams: any[] } = $props();
</script>

<div class="team-list">
  {#each teams as t}
    <div class="team-card raised">
      <h4>{t.name}</h4>
      <div class="slots">
        {#each t.members as slot, i}
          <div class="slot-row">
            <span class="slot-label">Slot {i + 1}</span>
            <div class="chars">
              {#if slot.length === 0}
                <span class="empty">-</span>
              {:else}
                {#each slot as c}
                  <a href="/characters/{c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}" class="char-link">{c}</a>
                {/each}
              {/if}
            </div>
          </div>
        {/each}
      </div>
      {#if t.note}
        <p class="note">{t.note}</p>
      {/if}
    </div>
  {/each}
</div>

<style>
  .team-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--sp-3); }
  .team-card { padding: var(--sp-3); }
  .team-card h4 { margin: 0 0 var(--sp-2) 0; font-size: var(--fs-md); color: var(--accent); }
  .slots { display: flex; flex-direction: column; gap: var(--sp-1); }
  .slot-row { display: flex; align-items: center; gap: var(--sp-2); font-size: var(--fs-sm); }
  .slot-label { width: 60px; color: var(--text-muted); }
  .chars { display: flex; flex-wrap: wrap; gap: var(--sp-1); }
  .char-link { color: var(--text); text-decoration: none; background: var(--bg-hover); padding: 2px 6px; border-radius: var(--radius); font-size: var(--fs-xs); }
  .char-link:hover { color: var(--accent); }
  .empty { color: var(--text-muted); opacity: 0.5; }
  .note { margin-top: var(--sp-2); font-size: var(--fs-xs); color: var(--text-muted); white-space: pre-line; }
</style>
