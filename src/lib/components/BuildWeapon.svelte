<script lang="ts">
  let { build, weapons = [] }: { build: any; weapons?: any[] } = $props();

  function getWeaponImage(slugOrName: string) {
    const found = weapons.find((w: any) => w.slug === slugOrName || w.name.toLowerCase() === slugOrName.toLowerCase());
    return found ? found.image : '';
  }
</script>

<div class="section">
  <h3>Weapon</h3>

  <div class="weapon-grid">
    <div class="weapon-best">
      {#if build.bestWeapon}
        {@const img = getWeaponImage(build.bestWeapon)}
        {#if img}
          <img src={img} alt={build.bestWeapon} class="weapon-img" />
        {/if}
        <span class="weapon-name accent">{build.bestWeapon}</span>
      {/if}
    </div>

    <div class="weapon-list">
      {#if build.weaponOptions}
        <table class="weapon-table">
          <thead><tr><th>Name</th><th>DPS %</th></tr></thead>
          <tbody>
            {#each build.weaponOptions as w}
              <tr>
                <td>
                  {w.id.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  {#if w.rank}<span class="rank-text">(R{w.rank})</span>{/if}
                </td>
                <td>{w.percentage}%</td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}


    </div>
  </div>

  {#if build.weaponNote}
    <p class="note-text" style="margin-top: var(--sp-3);">{build.weaponNote}</p>
  {/if}
</div>

<style>
  .section h3 {
    margin: 0 0 var(--sp-3) 0;
    font-size: var(--fs-md);
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }

  .weapon-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-4);
    margin-top: var(--sp-2);
    align-items: start;
  }

  @media (min-width: 640px) {
    .weapon-grid {
      grid-template-columns: 140px 1fr;
    }
  }

  .weapon-best {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 100%;
  }

  .weapon-img {
    width: 120px;
    height: 120px;
    object-fit: contain;
    border-radius: var(--radius);
    background: var(--bg-hover);
    border: 1px solid var(--border);
    padding: 4px;
  }

  .weapon-name {
    font-size: var(--fs-xs);
    text-align: center;
    line-height: 1.2;
  }
  .weapon-name.accent { color: var(--accent); }

  .weapon-list {
    min-width: 0;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .weapon-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); }
  .weapon-table th, .weapon-table td { text-align: left; padding: var(--sp-1) var(--sp-2); border-bottom: 1px solid var(--border); }
  .weapon-table th { color: var(--text-muted); font-weight: var(--fw-medium); font-size: var(--fs-xs); }

  .weapon-list .weapon-table th:last-child,
  .weapon-list .weapon-table td:last-child {
    width: 1%;
    white-space: nowrap;
  }

  .rank-text { font-size: var(--fs-xs); color: var(--text-muted); margin-left: 4px; }


  .note-text { font-size: var(--fs-xs); color: var(--text-muted); margin: 0; white-space: pre-line; font-style: italic; }
</style>
