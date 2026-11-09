<script lang="ts">
  import { onMount } from 'svelte';

  let { data, onTap }: { data: any[]; onTap?: (item: any) => void } = $props();

  const maxVal = $derived(
    data && data.length > 0 ? Math.max(...data.map((x: any) => x.value)) : 1
  );

  
  const baseline = $derived(
    data && data.length > 0 ? Math.min(...data.map((x: any) => x.percentage)) : 100
  );

  function getRankColor(index: number) {
    if (index === 0) return 'var(--rank-1)';
    if (index === 1) return 'var(--rank-2)';
    if (index === 2) return 'var(--rank-3)';
    return 'var(--rank-default)';
  }

  let mounted = $state(false);
  onMount(() => {
    setTimeout(() => { mounted = true; }, 50);
  });
</script>

<div class="v-chart-layout">
  <!-- Legend (Kiri di Desktop, Bawah di Mobile) -->
  <div class="v-legend">
    {#each data as d, i}
      <div
        class="v-legend-item"
        role="button"
        tabindex="0"
        onclick={() => onTap?.(d)}
        onkeydown={(e) => e.key === 'Enter' && onTap?.(d)}
        title="{d.type}"
      >
        <div class="dot" style:background={getRankColor(i)}></div>
        <div class="legend-info">
          <span class="legend-name">{d.type}</span>
          <span class="legend-stats">
            <span class="legend-pct">{d.percentage}%</span>
            <span class="legend-diff" class:positive={d.percentage > baseline} class:negative={d.percentage < baseline}>
              {d.percentage > baseline ? '+' + (d.percentage - baseline) + '%' : d.percentage < baseline ? (d.percentage - baseline) + '%' : 'Base'}
            </span>
            <span class="legend-val">({(d.value / 1000).toFixed(1)}k)</span>
          </span>
        </div>
      </div>
    {/each}
  </div>

  <!-- Chart Area (Kanan) -->
  <div class="v-chart-wrapper">
    {#each data as d, i}
      <div
        class="v-bar-group"
        role="button"
        tabindex="0"
        onclick={() => onTap?.(d)}
        onkeydown={(e) => e.key === 'Enter' && onTap?.(d)}
        title="{d.type} - {d.percentage}%"
      >
        <!-- Value -->
        <div class="v-value">
          <span>{d.percentage}%</span>
          <span class="raw">({(d.value / 1000).toFixed(1)}k)</span>
        </div>

        <!-- Bar -->
        <div class="v-track">
          <div
            class="v-fill"
            style:height={mounted ? `${(d.value / maxVal) * 100}%` : '0%'}
            style:background={getRankColor(i)}
          ></div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .v-chart-layout {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 320px; 
    gap: 16px !important;
    margin-top: var(--sp-2);
  }

  
  .v-legend {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    width: 50%; 
    flex-shrink: 0;
    overflow-y: auto;
    border-right: 1px solid var(--border);
    padding-right: var(--sp-2);
  }

  .v-legend-item {
    display: flex;
    align-items: flex-start;
    gap: var(--sp-2);
    font-size: var(--fs-xs);
    cursor: pointer;
    padding-bottom: 4px;
    border-bottom: 1px solid transparent;
  }
  .v-legend-item:hover {
    border-bottom-color: var(--border);
  }

  .dot {
    margin-top: 4px; 
  }

  .legend-info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .legend-name {
    font-weight: var(--fw-medium);
    color: var(--text-body);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .legend-stats {
    display: flex;
    justify-content: space-between;
    gap: var(--sp-2);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: var(--fs-2xs);
  }

  .legend-pct { font-weight: var(--fw-bold); color: var(--accent); }
  .legend-diff { font-size: var(--fs-3xs); font-weight: var(--fw-bold); }
  .legend-diff.positive { color: var(--status-active); }
  .legend-diff.negative { color: var(--status-ended); }
  .legend-diff:not(.positive):not(.negative) { color: var(--text-secondary); }
  .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  
  .v-chart-wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 100%;
    flex: 1; 
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-1);
    overflow-x: auto;
    
  }

  .v-bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    width: 100%;
    max-width: 60px; 
    flex: 1;
    margin: 0 2px; 
    cursor: pointer;
  }

  .v-value {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: var(--fs-2xs);
    line-height: 1.1;
    margin-bottom: 4px;
    font-family: var(--font-mono);
  }
  .raw { font-size: var(--fs-4xs); color: var(--text-secondary); }

  .v-track {
    width: 100%;
    flex: 1;
    background: var(--bg-hover);
    border-radius: var(--radius) var(--radius) 0 0;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }

  .v-fill {
    width: 100%;
    transition: height 0.8s ease;
    border-radius: var(--radius) var(--radius) 0 0;
  }

  
  @media (max-width: 639px) {
    .v-chart-layout {
      flex-direction: column-reverse;
      height: auto !important; 
      min-height: 350px; 
      gap: var(--sp-3);
    }
    .v-chart-wrapper {
      height: 250px; 
      border-bottom: none;
      border-top: 1px solid var(--border);
      padding-top: var(--sp-3);
      align-items: flex-end;
      flex: none; 
    }
    .v-bar-group {
      height: 100% !important;
      max-width: 40px;
    }
    .v-legend {
      width: 100% !important;
      max-height: none; 
      flex: none; 
      flex-direction: column;
      flex-wrap: nowrap;
      gap: 4px; 
      border-right: none;
      padding-right: 0;
      border-bottom: 1px solid var(--border);
      padding-bottom: var(--sp-2);
      overflow-y: visible; 
    }
  }
</style>
