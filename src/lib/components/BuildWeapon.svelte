<script lang="ts">
  import DataTable from '#lib/components/DataTable.svelte';
  let { build, weapons = [], onnote }: { build: any; weapons?: any[]; onnote?: () => void } = $props();

  function getWeaponImage(slugOrName: string) {
    const found = weapons.find((w: any) => w.slug === slugOrName || w.name.toLowerCase() === slugOrName.toLowerCase());
    return found ? found.image : '';
  }
</script>

<div class="section">
  <div class="section-head">
    <h3>Weapon</h3>
    {#if build?.weaponNote}
      <button class="raised small-btn" onclick={onnote}>ℹ Note</button>
    {/if}
  </div>

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
        <DataTable title="Weapon Options" headers={['Name', { label: 'DPS %', align: 'right' }]} class="weapon-table">
          {#each build.weaponOptions as w}
            <tr>
              <td>
                {w.id.replace(/-/g, ' ').replace(/w/g, (c: string) => c.toUpperCase())}
                {#if w.rank}<span class="rank-text">(R{w.rank})</span>{/if}
              </td>
              <td class="num">{w.percentage}%</td>
            </tr>
          {/each}
        </DataTable>
      {/if}


    </div>
  </div>


</div>

<style>

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


  .weapon-list .rank-text { font-size: var(--fs-xs); color: var(--text-secondary); margin-left: 4px; }


</style>
