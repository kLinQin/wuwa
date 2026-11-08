<script lang="ts">
  import Tabs from '#lib/components/Tabs.svelte';

  let { stats, build, echoes = [], sonatas = [] }: { stats?: any; build?: any; echoes?: any[]; sonatas?: any[] } = $props();

  let activeEchoSet = $state('0');

  const echoTabs = $derived(
    build?.echoDetails?.sets?.map((set: any, i: number) => ({
      id: i.toString(),
      label: set.label || 'Set ' + (i + 1)
    })) || []
  );

  function getEchoImage(name: string) {
    const found = echoes.find((e: any) => e.name.toLowerCase() === name.toLowerCase());
    return found ? found.image : '';
  }

  function getSonataImage(name: string) {
    const found = sonatas.find((s: any) => s.name.toLowerCase() === name.toLowerCase());
    return found ? found.image : '';
  }
</script>

<div class="build-view">
  {#if stats || build}

    <div class="row">
      <div class="col">
        {#if stats}
          <div class="section">
            <h3>Recommended Stats</h3>
            <table class="stats-table">
              <tbody>
                {#each Object.entries(stats) as [k, v]}
                  <tr>
                    <td class="k">{k}</td>
                    <td class="v">{v}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>

      <div class="col">
        {#if build?.bestEcho || build?.echoDetails}
          <div class="section">
            <h3>Echo Setup</h3>

            {#if build.echoDetails?.sets?.length > 0}
              <Tabs tabs={echoTabs} activeTab={activeEchoSet} onchange={(id) => activeEchoSet = id} />

              {@const activeSet = build.echoDetails.sets[parseInt(activeEchoSet)]}

              {#if activeSet}
                <div class="echo-card">

                  <!-- BARIS 1: Gambar Echo (Kiri) & Sonata (Kanan) -->
                  <div class="echo-top-grid">
                    <div class="echo-img-box">
                      {#if build.bestEcho?.[0]}
                        {@const mainImg = getEchoImage(build.bestEcho[0])}
                        {#if mainImg}
                          <img src={mainImg} alt={build.bestEcho[0]} class="main-echo-img" />
                        {/if}
                        <span class="main-echo-name">{build.bestEcho[0]}</span>
                      {:else}
                        <div class="no-echo">No Main Echo</div>
                      {/if}
                    </div>

                    <div class="sonata-box">
                      {#if activeSet.sonataCustom}
                        {#each activeSet.sonataCustom as sonata}
                          {@const img = getSonataImage(sonata.name)}
                          <div class="echo-img-box">
                            {#if img}
                              <img src={img} alt={sonata.name} class="main-echo-img" />
                            {/if}
                            <span class="main-echo-name">{sonata.name} ({sonata.set})</span>
                          </div>
                        {/each}
                      {/if}
                    </div>
                  </div>

                  <!-- BARIS 2: Main Stats (Kiri) & Substats (Kanan) -->
                  <div class="echo-bottom-grid">
                    <div class="stats-box">
                      <h4>Main Stats</h4>
                      <div class="stats-list">
                        {#each activeSet.stats as st}
                          <span class="stat-chip">C{st.cost}: {st.stat}</span>
                        {/each}
                      </div>
                    </div>

                    <div class="substats-box">
                      {#if build.echoDetails.substats}
                        <h4>Substats</h4>
                        <ol class="substats-list">
                          {#each build.echoDetails.substats as sub}
                            <li>{sub}</li>
                          {/each}
                        </ol>
                      {/if}
                    </div>
                  </div>

                  {#if build.echoDetails.note}
                    <p class="note-text">{build.echoDetails.note}</p>
                  {/if}
                </div>
              {/if}
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <div class="row">
      <div class="col">
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

      <div class="col">
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
    </div>

  {/if}
</div>

<style>
  .build-view {
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
  }

  .row {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-5);
    align-items: start;
  }

  @media (min-width: 768px) {
    .row {
      grid-template-columns: 1fr 1fr;
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
    min-width: 0;
  }

  .section {
    display: flex;
    flex-direction: column;
  }

  .section h3 {
    margin: 0 0 var(--sp-3) 0;
    font-size: var(--fs-md);
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }

  /* --- Recommended Stats --- */
  .stats-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); margin-top: var(--sp-2); }
  .stats-table td { padding: var(--sp-2); border-bottom: 1px solid var(--border); }
  .stats-table tr:last-child td { border-bottom: none; }
  .stats-table .k { color: var(--text-muted); }
  .stats-table .v { text-align: right; font-weight: var(--fw-medium); }

  /* --- Echo Card --- */
  .echo-card {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  /* BARIS 1: Gambar & Sonata */
  .echo-top-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-4);
    align-items: center;
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-3);

    /* Tarik keluar dari padding .echo-card agar garis full width */
    margin-left: calc(var(--sp-3) * -1);
    margin-right: calc(var(--sp-3) * -1);
    padding-left: var(--sp-3);
    padding-right: var(--sp-3);
  }

  .echo-img-box, .sonata-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .main-echo-img {
    width: 64px;
    height: 64px;
    object-fit: contain;
    border-radius: var(--radius); /* Kotak mengikuti variabel global */
    background: var(--bg-hover);
    border: 1px solid var(--border);
    padding: 4px; /* Jarak aman di dalam kotak */
  }
  .main-echo-name { font-size: var(--fs-xs); text-align: center; line-height: 1.2; }
  .sonata-box .main-echo-name { color: var(--accent); }
  .no-echo { width: 64px; height: 64px; border-radius: var(--radius); background: var(--bg-hover); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-muted); text-align: center; border: 1px solid var(--border); }

  /* BARIS 2: Stats & Substats */
  .echo-bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-4);
    padding-top: var(--sp-3);
    font-size: var(--fs-sm);
    align-items: start;
  }

  .stats-box, .substats-box {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .stats-box h4, .substats-box h4 {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--text);
  }

  .stats-list { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
  .stat-chip { background: var(--bg-hover); padding: 2px 6px; border-radius: var(--radius); font-family: var(--font-mono); font-size: var(--fs-xs); }
  .substats-list { margin: 0; padding-left: var(--sp-4); font-size: var(--fs-xs); }

  .note-text { font-size: var(--fs-xs); color: var(--text-muted); margin-top: var(--sp-3); white-space: pre-line; font-style: italic; }

  /* --- Weapon & Rotations --- */
  .best-weapon { font-size: var(--fs-sm); margin-bottom: var(--sp-3); }
  .weapon-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); margin-top: var(--sp-2); }
  .weapon-table th, .weapon-table td { text-align: left; padding: var(--sp-2); border-bottom: 1px solid var(--border); }
  .weapon-table th { color: var(--text-muted); font-weight: var(--fw-medium); }

  .rotation-card { padding: var(--sp-3); margin-bottom: var(--sp-3); }
  .rotation-card h4 { margin: 0 0 var(--sp-2) 0; font-size: var(--fs-sm); }
  .steps, .priority-list { margin: 0; padding-left: var(--sp-4); font-size: var(--fs-sm); line-height: 1.6; }
</style>
