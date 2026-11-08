<script lang="ts">
  import Tabs from '#lib/components/Tabs.svelte';

  let { build, echoes = [], sonatas = [] }: { build: any; echoes?: any[]; sonatas?: any[] } = $props();

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

<div class="section">
  <h3>Echo Setup</h3>

  {#if build?.echoDetails?.sets?.length > 0}
    <Tabs tabs={echoTabs} activeTab={activeEchoSet} onchange={(id) => activeEchoSet = id} />

    {@const activeSet = build.echoDetails.sets[parseInt(activeEchoSet)]}

    {#if activeSet}
      <div class="echo-card">
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

        <div class="echo-bottom-grid">
          <div class="stats-box">
            <h4 class="box-header">Main Stats</h4>
            <table class="main-stats-table">
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
              <h4 class="box-header">Substats</h4>
              <table class="main-stats-table">
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
  .section h3 {
    margin: 0 0 var(--sp-3) 0;
    font-size: var(--fs-md);
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }

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
  .no-echo { width: 64px; height: 64px; border-radius: var(--radius); background: var(--bg-hover); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-muted); text-align: center; border: 1px solid var(--border); }

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

  .stats-box .box-header, .substats-box .box-header {
    margin: 0 calc(var(--sp-3) * -1) var(--sp-3) calc(var(--sp-3) * -1);
    padding: var(--sp-2) var(--sp-3);
    color: var(--accent);
    background: var(--bg-hover);
    border-bottom: 1px solid var(--border);
  }

  .main-stats-table {
    width: calc(100% + var(--sp-3) * 2);
    margin-left: calc(var(--sp-3) * -1);
    margin-right: calc(var(--sp-3) * -1);
    border-collapse: collapse;
    font-size: var(--fs-sm);
  }
  .main-stats-table th, .main-stats-table td {
    padding: 4px var(--sp-2);
    border-bottom: 1px solid var(--border);
    text-align: left;
    white-space: nowrap;
  }
  .main-stats-table th {
    color: var(--text-muted);
    font-weight: var(--fw-medium);
    font-size: var(--fs-xs);
    text-transform: uppercase;
  }
  .main-stats-table tr:last-child td { border-bottom: none; }
  .main-stats-table .cost { font-family: var(--font-mono); width: 1%; white-space: nowrap; color: var(--text-muted); }
  .main-stats-table .stat { font-weight: var(--fw-medium); width: 99%; }
</style>
