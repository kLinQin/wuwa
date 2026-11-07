<script lang="ts">
  let { charts }: { charts: any[] } = $props();
</script>

<div class="chart-list">
  {#each charts as c}
    <div class="chart-card raised">
      <h4>{c.title}</h4>

      {#if c.chartType === 'bar'}
        <div class="bar-chart">
          {#each c.data as d}
            <div class="bar-row">
              <span class="label">{d.type}</span>
              <div class="track">
                <div class="fill" style:width="{Math.min(100, (d.value / Math.max(...c.data.map(x=>x.value))) * 100)}%"></div>
              </div>
              <span class="val">{d.percentage}%</span>
            </div>
          {/each}
        </div>
      {:else if c.chartType === 'radar'}
         <!-- Simplified radar representation as list for now -->
         <ul class="radar-list">
           {#each c.data as d}
             <li><strong>{d.type}:</strong> {d.percentage}%</li>
           {/each}
         </ul>
      {/if}

      {#if c.note}
        <p class="note">{c.note}</p>
      {/if}
    </div>
  {/each}
</div>

<style>
  .chart-list { display: flex; flex-direction: column; gap: var(--sp-4); }
  .chart-card { padding: var(--sp-3); }
  .chart-card h4 { margin: 0 0 var(--sp-2) 0; font-size: var(--fs-md); color: var(--accent); }

  /* Bar Chart Styles */
  .bar-chart { display: flex; flex-direction: column; gap: var(--sp-1); }
  .bar-row { display: grid; grid-template-columns: 80px 1fr 50px; align-items: center; gap: var(--sp-2); font-size: var(--fs-xs); }
  .label { text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .track { background: var(--bg-hover); height: 8px; border-radius: 4px; overflow: hidden; }
  .fill { background: var(--accent); height: 100%; transition: width 0.3s ease; }
  .val { text-align: left; font-family: var(--font-mono); }

  /* Radar List Styles */
  .radar-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: var(--sp-1); font-size: var(--fs-sm); }
  .radar-list li { background: var(--bg-elev); padding: var(--sp-1) var(--sp-2); border-radius: var(--radius); border: 1px solid var(--border); }

  .note { margin-top: var(--sp-2); font-size: var(--fs-xs); color: var(--text-muted); }
</style>
