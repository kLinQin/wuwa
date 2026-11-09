<script lang="ts">
  import Tabs from '#lib/components/Tabs.svelte';

  let { build, echoes = [], sonatas = [], onnote }: { build: any; echoes?: any[]; sonatas?: any[]; onnote?: () => void } = $props();

  let activeEchoSet = $state('0');
  let sonataIndex = $state(0);
  let echoIndex = $state(0);

  function nextEcho(max: number) {
    echoIndex = Math.min(echoIndex + 1, max - 1);
  }
  function prevEcho() {
    echoIndex = Math.max(echoIndex - 1, 0);
  }

  function nextSonata(max: number) {
    sonataIndex = Math.min(sonataIndex + 1, max - 1);
  }
  function prevSonata() {
    sonataIndex = Math.max(sonataIndex - 1, 0);
  }

  const echoTabs = $derived(
    build?.echoDetails?.sets?.map((set: any, i: number) => ({
      id: i.toString(),
      label: set.label || 'Set ' + (i + 1)
    })) || []
  );

  function getEchoBySlug(slug: string) {
    if (!slug) return null;
    return echoes.find((e: any) => e.slug === slug) || null;
  }

  function getEchoImage(name: string) {
    const found = echoes.find((e: any) => e.name.toLowerCase() === name.toLowerCase());
    return found ? found.image : '';
  }

  function getSonataImage(name: string) {
    const found = sonatas.find((s: any) => s.name.toLowerCase() === name.toLowerCase());
    return found ? found.image : '';
  }
</script>

<div class="section">
  <div class="section-head">
    <h3>Echo Setup</h3>
    {#if build?.echoDetails?.note}
      <button class="raised small-btn" onclick={onnote}>ℹ Note</button>
    {/if}
  </div>

  {#if build?.echoDetails?.sets?.length > 0}
    <Tabs tabs={echoTabs} activeTab={activeEchoSet} onchange={(id) => activeEchoSet = id} />

    {@const activeSet = build.echoDetails.sets[parseInt(activeEchoSet)]}

    {#if activeSet}
      <div class="echo-card">
        <div class="echo-top-grid">
          <!-- ECHO -->
          <div class="echo-img-box">
            {#if getEchoBySlug(activeSet.echoSlug)}
              {@const primaryEcho = getEchoBySlug(activeSet.echoSlug)}
              <img src={primaryEcho.image} alt={primaryEcho.name} class="main-echo-img" />
              <span class="main-echo-name">{primaryEcho.name}</span>
            {:else if build.bestEcho && build.bestEcho.length > 0}
              {@const activeEchoName = build.bestEcho[echoIndex] || build.bestEcho[0]}
              {@const mainImg = getEchoImage(activeEchoName)}
              {#if mainImg}
                <img src={mainImg} alt={activeEchoName} class="main-echo-img" />
              {/if}
              <span class="main-echo-name">{activeEchoName}</span>
            {:else}
              <div class="no-echo">No Main Echo</div>
            {/if}

            {#if !activeSet.echoSlug && build.bestEcho && build.bestEcho.length > 0}
            <div class="sonata-nav">
              <button class="raised" onclick={() => prevEcho()} disabled={!build.bestEcho || build.bestEcho.length <= 1 || echoIndex === 0}>←</button>
              <span class="sonata-indicator">{build.bestEcho?.length > 0 ? echoIndex + 1 : 0} / {build.bestEcho?.length || 1}</span>
              <button class="raised" onclick={() => nextEcho(build.bestEcho?.length || 1)} disabled={!build.bestEcho || build.bestEcho.length <= 1 || echoIndex >= build.bestEcho.length - 1}>→</button>
            </div>
            {/if}
          </div>

          <!-- SONATA -->
          <div class="sonata-box">
            {#if activeSet.sonataCustom && activeSet.sonataCustom.length > 0}
              {@const sonata = activeSet.sonataCustom[sonataIndex] || activeSet.sonataCustom[0]}
              {@const img = getSonataImage(sonata.name)}
              <div class="echo-img-box">
                {#if img}
                  <img src={img} alt={sonata.name} class="main-echo-img" />
                {/if}
                <span class="main-echo-name">{sonata.name} ({sonata.set})</span>
              </div>
            {:else}
              <div class="no-echo">No Sonata</div>
            {/if}

            <div class="sonata-nav">
              <button class="raised" onclick={() => prevSonata()} disabled={!activeSet.sonataCustom || activeSet.sonataCustom.length <= 1 || sonataIndex === 0}>←</button>
              <span class="sonata-indicator">{activeSet.sonataCustom?.length > 0 ? sonataIndex + 1 : 0} / {activeSet.sonataCustom?.length || 1}</span>
              <button class="raised" onclick={() => nextSonata(activeSet.sonataCustom?.length || 1)} disabled={!activeSet.sonataCustom || activeSet.sonataCustom.length <= 1 || sonataIndex >= activeSet.sonataCustom.length - 1}>→</button>
            </div>
          </div>
        </div>

        <div class="echo-bottom-grid">
          <div class="stats-box">
            <h4 class="box-header box-header-inset">Main Stats</h4>
            <table class="stat-table">
              <thead><tr><th>Cost</th><th>Stat</th></tr></thead>
              <tbody>
                {#each activeSet.stats as st}
                  <tr>
                    <td class="cost">C{st.cost}</td>
                    <td class="stat">{st.stat}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>

          <div class="substats-box">
            {#if build.echoDetails.substats}
              <h4 class="box-header box-header-inset">Substats</h4>
              <table class="stat-table">
                <thead><tr><th>No</th><th>Stat</th></tr></thead>
                <tbody>
                  {#each build.echoDetails.substats as sub, i}
                    <tr>
                      <td class="cost">{i + 1}.</td>
                      <td class="stat">{sub}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>

  .echo-card {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .echo-top-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-4);
    align-items: center;
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-3);
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
    border-radius: var(--radius);
    background: var(--bg-hover);
    border: 1px solid var(--border);
    padding: 4px;
  }
  .main-echo-name { font-size: var(--fs-xs); text-align: center; line-height: 1.2; }
  .sonata-box .main-echo-name { color: var(--accent); }

  .sonata-nav {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
    margin-top: var(--sp-1);
  }

  .sonata-nav button {
    width: 20px;
    height: 20px;
    padding: 0;
    font-size: var(--fs-2xs);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sonata-nav button:disabled {
    opacity: 0.3;
  }

  .sonata-indicator {
    font-size: var(--fs-2xs);
    color: var(--text-secondary);
  }
  .no-echo { width: 64px; height: 64px; border-radius: var(--radius); background: var(--bg-hover); display: flex; align-items: center; justify-content: center; font-size: var(--fs-2xs); color: var(--text-secondary); text-align: center; border: 1px solid var(--border); }

  .echo-bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-3);
    padding-top: 4px;
    font-size: var(--fs-sm);
    align-items: start;
  }

  .stats-box, .substats-box {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    padding: 0 var(--sp-3) var(--sp-3) var(--sp-3);
    overflow: hidden;
  }


</style>
