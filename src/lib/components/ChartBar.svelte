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

  // State untuk animasi
  let mounted = $state(false);
  onMount(() => {
    // Timeout kecil agar browser sempat render lebar 0 terlebih dahulu
    setTimeout(() => {
      mounted = true;
    }, 50);
  });
</script>

<div class="bar-chart-wrapper">
  {#each data as d, i}
    <div
      class="bar-row"
      role="button"
      tabindex="0"
      onclick={() => onTap?.(d)}
      onkeydown={(e) => e.key === 'Enter' && onTap?.(d)}
    >
      <span class="label" title={d.type}>{d.type}</span>
      <div class="track">
        <div
          class="fill"
          style:width={mounted ? `${(d.value / maxVal) * 100}%` : '0%'}
          style:background={getRankColor(i)}
        ></div>
      </div>
      <div class="val-group">
        <span class="val">{d.percentage}%</span>
        <span class="raw-val">({(d.value / 1000).toFixed(1)}k)</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .bar-chart-wrapper { display: flex; flex-direction: column; gap: var(--sp-2); width: 100%; }
  .bar-row {
    display: grid;
    grid-template-columns: 110px minmax(50px, 1fr) 65px;
    align-items: center;
    gap: var(--sp-2);
    font-size: var(--fs-xs);
    cursor: pointer;
  }
  .bar-row:hover .track {
    outline: 1px solid var(--border);
  }
  .label { text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: var(--fw-medium); }
  .track { background: var(--bg-hover); height: 14px; border-radius: var(--radius); overflow: hidden; width: 100%; }
  .fill { height: 100%; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
  .val-group { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.1; }
  .val { font-family: var(--font-mono); font-weight: var(--fw-bold); }
  .raw-val { font-size: var(--fs-3xs); color: var(--text-muted); font-family: var(--font-mono); }
</style>
