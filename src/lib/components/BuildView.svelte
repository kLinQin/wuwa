<script lang="ts">
  let { stats, build }: { stats?: any; build?: any } = $props();
</script>

<div class="build-view">
  {#if stats || build}

    <!-- KOLOM KIRI -->
    <div class="col">
      {#if stats}
        <div class="section">
          <h3>Recommended Stats</h3>
          <ul class="stat-grid">
            {#each Object.entries(stats) as [k, v]}
              <li><span class="k">{k}</span><span class="v">{v}</span></li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if build?.bestWeapon || build?.weaponOptions || build?.weaponNote}
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
      {/if}

      {#if build?.talentPriority}
        <div class="section">
          <h3>Talent Priority</h3>
          <ol class="priority-list">
            {#each build.talentPriority.priority as p}
              <li>{p}</li>
            {/each}
          </ol>
          {#if build.talentPriority.note}
            <p class="note-text">{build.talentPriority.note}</p>
          {/if}
        </div>
      {/if}
    </div>

    <!-- KOLOM KANAN -->
    <div class="col">
      {#if build?.bestEcho || build?.echoDetails}
        <div class="section">
          <h3>Echo Setup</h3>
          {#if build.bestEcho?.length}
            <p class="best-echo"><strong>Main Echo:</strong> {build.bestEcho.join(', ')}</p>
          {/if}

          {#if build.echoDetails?.sets}
            <div class="echo-sets">
              {#each build.echoDetails.sets as set}
                <div class="set-card raised">
                  <h4>{set.label || 'Set'}</h4>
                  {#if set.sonataCustom}
                    <p class="sonata-name">{set.sonataCustom.map((s: any) => s.name + ' (' + s.set + ')').join(', ')}</p>
                  {/if}
                  {#if set.stats}
                    <div class="stats-list">
                      {#each set.stats as st}
                        <span class="stat-chip">C{st.cost}: {st.stat}</span>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          {#if build.echoDetails?.substats}
            <div class="substats">
              <strong>Substats Priority:</strong>
              <ol>
                {#each build.echoDetails.substats as sub}
                  <li>{sub}</li>
                {/each}
              </ol>
            </div>
          {/if}

          {#if build.echoDetails?.note}
            <p class="note-text">{build.echoDetails.note}</p>
          {/if}
        </div>
      {/if}

      {#if build?.rotations}
        <div class="section">
          <h3>Rotations</h3>
          {#each build.rotations as rot}
            <div class="rotation-card raised">
              <h4>{rot.title}</h4>
              <ol class="steps">
                {#each rot.steps as step}
                  <li>{step}</li>
                {/each}
              </ol>
            </div>
          {/each}
        </div>
      {/if}
    </div>

  {/if}
</div>

<style>
  .build-view {
    display: grid;
    grid-template-columns: 1fr; /* Default mobile: 1 kolom */
    gap: var(--sp-5);
  }

  @media (min-width: 768px) {
    .build-view {
      grid-template-columns: 1fr 1fr; /* Desktop/Tablet: 2 kolom */
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
    min-width: 0; /* Mencegah luberan teks panjang */
  }

  .section h3 {
    margin: 0 0 var(--sp-3) 0;
    font-size: var(--fs-md);
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }

  /* Stats Grid */
  .stat-grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--sp-2);
  }
  .stat-grid li {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    padding: var(--sp-2);
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .stat-grid .k { font-size: var(--fs-xs); color: var(--text-muted); }
  .stat-grid .v { font-size: var(--fs-sm); font-weight: var(--fw-medium); }

  /* Echo Sets */
  .best-echo, .best-weapon { font-size: var(--fs-sm); margin-bottom: var(--sp-3); }
  .echo-sets { display: flex; flex-direction: column; gap: var(--sp-3); margin-bottom: var(--sp-3); }
  .set-card { padding: var(--sp-3); }
  .set-card h4 { margin: 0 0 var(--sp-1) 0; font-size: var(--fs-sm); color: var(--text); }
  .sonata-name { font-size: var(--fs-xs); color: var(--accent); margin: 0 0 var(--sp-2) 0; }
  .stats-list { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
  .stat-chip { background: var(--bg-hover); padding: 2px 6px; border-radius: var(--radius); font-family: var(--font-mono); font-size: var(--fs-xs); }

  .substats { font-size: var(--fs-sm); margin-bottom: var(--sp-3); }
  .substats ol { margin: var(--sp-1) 0 0 0; padding-left: var(--sp-4); }
  .note-text { font-size: var(--fs-xs); color: var(--text-muted); margin-top: var(--sp-2); white-space: pre-line; font-style: italic; }

  /* Weapon Table */
  .weapon-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); margin-top: var(--sp-2); }
  .weapon-table th, .weapon-table td { text-align: left; padding: var(--sp-2); border-bottom: 1px solid var(--border); }
  .weapon-table th { color: var(--text-muted); font-weight: var(--fw-medium); }

  /* Rotations & Priority */
  .rotation-card { padding: var(--sp-3); margin-bottom: var(--sp-3); }
  .rotation-card h4 { margin: 0 0 var(--sp-2) 0; font-size: var(--fs-sm); }
  .steps, .priority-list { margin: 0; padding-left: var(--sp-4); font-size: var(--fs-sm); line-height: 1.6; }
</style>
