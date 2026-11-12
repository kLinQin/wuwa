<script lang="ts">
  import ChartBar from '#lib/components/ChartBar.svelte';
  import ChartVertical from '#lib/components/ChartVertical.svelte';
  import ChartRadar from '#lib/components/ChartRadar.svelte';
  import ChartPolar from '#lib/components/ChartPolar.svelte';
  import BottomSheet from '#lib/components/BottomSheet.svelte';

  let { charts }: { charts: any[] } = $props();

  let isDetailOpen = $state(false);
  let selectedData = $state<any>(null);

  function handleTap(item: any) {
    selectedData = item;
    isDetailOpen = true;
  }
</script>

<div class="chart-list">
  {#each charts as c}
    <div class="chart-card surface">
      <h4>{c.title}</h4>

      {#if c.chartType === 'radar'}
        <ChartRadar data={c.data} />
      {:else if c.chartType === 'polar'}
        <ChartPolar data={c.data} />
      {:else if c.chartType === 'bar'}
        <ChartBar data={c.data} onTap={handleTap} />
      {:else}
        <ChartVertical data={c.data} onTap={handleTap} />
      {/if}

      {#if c.note}
        <div class="note-wrapper">
          <p class="note">{c.note}</p>
        </div>
      {/if}
    </div>
  {/each}
</div>

<BottomSheet bind:open={isDetailOpen} title="Detail Stats">
  {#if selectedData}
    <div class="detail-row">
      <span class="detail-label">Name</span>
      <span class="detail-val">{selectedData.type}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Value</span>
      <span class="detail-val">{selectedData.value.toLocaleString()}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Percentage</span>
      <span class="detail-val">{selectedData.percentage}%</span>
    </div>
    {#if selectedData.imagePath}
      <img src={selectedData.imagePath} alt="" style="width: 100%; border-radius: var(--radius); margin-top: var(--sp-3);" />
    {/if}
  {/if}
</BottomSheet>

<style>
  .chart-list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }
  .chart-card {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    transition: border-color 0.15s;
  }
  .chart-card h4 {
    margin: 0;
    font-size: var(--fs-md);
    color: var(--accent);
    border-left: 4px solid var(--accent);
    padding-left: var(--sp-2);
    font-weight: var(--fw-medium);
  }
  .note-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--sp-2);
    border-top: 1px solid var(--border);
    padding-top: var(--sp-2);
  }
  .note {
    font-size: var(--fs-2xs);
    color: var(--text-secondary);
    line-height: 1.4;
    margin: 0;
    text-align: right;
    font-style: italic;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: var(--sp-2) 0;
    border-bottom: 1px solid var(--border);
    font-size: var(--fs-sm);
  }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: var(--text-secondary); }
  .detail-val {
    font-weight: var(--fw-medium);
    text-align: right;
  }
</style>
