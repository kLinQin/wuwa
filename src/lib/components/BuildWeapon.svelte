<script lang="ts">
  let { build }: { build: any } = $props();
</script>

<div class="section">
  <h3>Weapon</h3>
  {#if build.bestWeapon}
    <p class="best-weapon"><strong>Best:</strong> {build.bestWeapon}</p>
  {/if}
  {#if build.weaponOptions}
    <table class="weapon-table">
      <thead><tr><th>Name</th><th>DPS %</th><th>Rank</th></tr></thead>
      <tbody>
        {#each build.weaponOptions as w}
          <tr>
            <td>{w.id.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</td>
            <td>{w.percentage}%</td>
            <td>{w.rank || '-'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  {#if build.weaponNote}
    <p class="note-text">{build.weaponNote}</p>
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
  .best-weapon { font-size: var(--fs-sm); margin-bottom: var(--sp-3); }
  .weapon-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); margin-top: var(--sp-2); }
  .weapon-table th, .weapon-table td { text-align: left; padding: var(--sp-2); border-bottom: 1px solid var(--border); }
  .weapon-table th { color: var(--text-muted); font-weight: var(--fw-medium); }
  .note-text { font-size: var(--fs-xs); color: var(--text-muted); margin-top: var(--sp-3); white-space: pre-line; font-style: italic; }
</style>
