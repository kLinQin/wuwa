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

  let hoverIndex = $state<number | null>(null);
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
        class="v-legend-item" class:active={hoverIndex === i} onmouseenter={() => hoverIndex = i} onmouseleave={() => hoverIndex = null}
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
        class="v-bar-group" class:highlight={hoverIndex === i} onmouseenter={() => hoverIndex = i} onmouseleave={() => hoverIndex = null}
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
    min-height: 360px;
    gap: var(--sp-4);
    margin-top: var(--sp-3);
  }

  .v-legend {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
    width: 42%;
    flex-shrink: 0;
    overflow-y: auto;
    border-right: 1px solid var(--border);
    padding-right: var(--sp-3);
    max-height: 360px;
  }

  .v-legend-item {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    font-size: var(--fs-xs);
    cursor: pointer;
    padding: 6px var(--sp-2);
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    transition: background 0.15s, border-color 0.15s;
  }
  .v-legend-item:hover,
  .v-legend-item.active {
    background: var(--bg-hover);
    border-color: var(--border);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 0 2px var(--bg-elev);
  }

  .legend-info {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
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
    margin-top: 2px;
  }

  .legend-pct { font-weight: var(--fw-bold); color: var(--accent); }
  .legend-diff { font-size: var(--fs-3xs); font-weight: var(--fw-bold); }
  .legend-diff.positive { color: var(--status-active); }
  .legend-diff.negative { color: var(--status-ended); }
  .legend-diff:not(.positive):not(.negative) { color: var(--text-secondary); }

  .v-chart-wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 320px;
    flex: 1;
    min-width: 0;
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-1);
    overflow-x: auto;
    position: relative;
    background-image: linear-gradient(to top, var(--border) 1px, transparent 1px);
    background-size: 100% 25%;
    background-position: bottom;
  }

  .v-bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    min-width: 24px;
    max-width: 64px;
    flex: 1;
    margin: 0 2px;
    cursor: pointer;
    position: relative;
  }

  .v-bar-group.dim { opacity: 0.35; }
  .v-bar-group.highlight { opacity: 1; }

  .v-value {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: var(--fs-2xs);
    line-height: 1.15;
    margin-bottom: 4px;
    font-family: var(--font-mono);
    font-weight: var(--fw-bold);
    color: var(--text-body);
    transition: transform 0.2s;
  }
  .v-bar-group:hover .v-value { transform: translateY(-2px); }
  .raw { font-size: var(--fs-4xs); color: var(--text-secondary); font-weight: normal; }

  .v-track {
    width: 100%;
    flex: 1;
    background: var(--bg-hover);
    border-radius: var(--radius) var(--radius) 0 0;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
    position: relative;
  }

  .v-fill {
    width: 100%;
    transition: height 0.9s cubic-bezier(0.22, 1, 0.36, 1);
    border-radius: var(--radius) var(--radius) 0 0;
    position: relative;
    box-shadow: inset 0 -2px 0 rgba(0,0,0,0.15);
  }
  .v-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, transparent 0%, rgba(255,255,255,0.15) 100%);
    border-radius: inherit;
    pointer-events: none;
  }

  @media (max-width: 639px) {
    .v-chart-layout {
      flex-direction: column-reverse;
      min-height: 0;
      gap: var(--sp-3);
    }
    .v-chart-wrapper {
      height: 240px;
      border-bottom: none;
      border-top: 1px solid var(--border);
      padding-top: var(--sp-3);
      flex: none;
      background-size: 100% 25%;
    }
    .v-bar-group { max-width: 40px; }
    .v-legend {
      width: 100%;
      max-height: none;
      flex: none;
      gap: 4px;
      border-right: none;
      padding-right: 0;
      border-bottom: 1px solid var(--border);
      padding-bottom: var(--sp-2);
      overflow-y: visible;
    }
  }
</style>
