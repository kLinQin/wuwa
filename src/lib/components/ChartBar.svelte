<script lang="ts">
  import { onMount } from 'svelte';

  let { data, onTap }: { data: any[]; onTap?: (item: any) => void } = $props();

  const maxVal = $derived(
    data && data.length > 0 ? Math.max(...data.map((x: any) => x.value)) : 1
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
    
    setTimeout(() => {
      mounted = true;
    }, 50);
  });
</script>

<div class="bar-chart-wrapper">
  {#each data as d, i}
    <div
      class="bar-row"
      class:active={hoverIndex === i} onmouseenter={() => hoverIndex = i} onmouseleave={() => hoverIndex = null}
      role="button"
      tabindex="0"
      onclick={() => onTap?.(d)}
      onkeydown={(e) => e.key === 'Enter' && onTap?.(d)}
    >
      <div class="row-top">
        <span class="label" title={d.type}>{d.type}</span>
        <span class="val-group">
          <span class="val">{d.percentage}%</span>
          <span class="raw-val">({(d.value / 1000).toFixed(1)}k)</span>
        </span>
      </div>
      <div class="track">
        <div
          class="fill"
          style:width={mounted ? `${(d.value / maxVal) * 100}%` : '0%'}
          style:background={getRankColor(i)}
        ></div>
      </div>
    </div>
  {/each}
</div>

<style>
  .bar-chart-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
    width: 100%;
  }
  .bar-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--radius);
    border: 1px solid transparent;
    transition: background 0.15s, border-color 0.15s;
  }
  .bar-row:hover,
  .bar-row.active {
    background: var(--bg-hover);
    border-color: var(--border);
  }
  .row-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--sp-1);
    font-size: var(--fs-xs);
  }
  .label {
    font-weight: var(--fw-medium);
    color: var(--text-body);
    white-space: normal;
    word-break: break-word;
    overflow: visible;
    flex: 1;
    min-width: 0;
  }
  .val-group {
    display: flex;
    align-items: baseline;
    gap: 4px;
    flex-shrink: 0;
    font-family: var(--font-mono);
    line-height: 1.15;
  }
  .val {
    font-weight: var(--fw-bold);
    color: var(--text-body);
  }
  .raw-val {
    font-size: var(--fs-3xs);
    color: var(--text-secondary);
  }
  .track {
    background: var(--bg-hover);
    height: 16px;
    border-radius: var(--radius);
    overflow: hidden;
    width: 100%;
    position: relative;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.15);
  }
  .fill {
    height: 100%;
    transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);
    border-radius: var(--radius);
    position: relative;
  }
  .fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.18), transparent 60%);
    pointer-events: none;
  }

  @media (max-width: 639px) {
    .row-top { font-size: var(--fs-2xs); }
  }
</style>
