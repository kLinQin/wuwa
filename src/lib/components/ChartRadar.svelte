<script lang="ts">
  let { data }: { data: any[] } = $props();

  const maxVal = $derived(
    data && data.length > 0 ? Math.max(...data.map((x: any) => x.value)) : 1
  );

  function getRadarPoints(data: any[], radius: number, cx: number, cy: number, maxVal: number) {
    const angleStep = (Math.PI * 2) / data.length;
    return data.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (d.value / maxVal) * radius;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }

  function getRadarAxes(data: any[], radius: number, cx: number, cy: number) {
    const angleStep = (Math.PI * 2) / data.length;
    return data.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      return { x1: cx, y1: cy, x2: x, y2: y };
    });
  }

  function getRankColor(index: number) {
    if (index === 0) return 'var(--rank-1)';
    if (index === 1) return 'var(--rank-2)';
    if (index === 2) return 'var(--rank-3)';
    return 'var(--rank-default)';
  }

  let hoverIndex = $state<number | null>(null);
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) - 40;
</script>

<div class="radar-chart-wrapper">
  <svg width={size} height={size} viewBox="0 0 {size} {size}">
    {#each [1, 0.75, 0.5, 0.25] as scale}
      <polygon
        points={getRadarPoints(data.map(() => ({ value: maxVal * scale })), radius, cx, cy, maxVal)}
        fill="none"
        stroke="var(--border)"
        stroke-width={scale === 1 ? 1.5 : 0.75}
        stroke-opacity={scale === 1 ? 0.9 : 0.6}
      />
    {/each}

    {#each getRadarAxes(data, radius, cx, cy) as axis, i}
      <line
        x1={axis.x1} y1={axis.y1} x2={axis.x2} y2={axis.y2}
        stroke={hoverIndex === i ? getRankColor(i) : 'var(--border)'}
        stroke-width={hoverIndex === i ? 1.5 : 0.75}
        stroke-opacity="0.7"
        style="transition: stroke 0.15s, stroke-width 0.15s;"
      />
    {/each}

    <defs>
      <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.45" />
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.08" />
      </radialGradient>
    </defs>

    <polygon
      points={getRadarPoints(data, radius, cx, cy, maxVal)}
      fill="url(#radar-fill)"
      stroke="var(--accent)"
      stroke-width="2"
      stroke-linejoin="round"
    />

    {#each getRadarPoints(data, radius, cx, cy, maxVal).split(' ') as point, i}
      {@const [x, y] = point.split(',')}
      <circle
        cx={x}
        cy={y}
        r={hoverIndex === i ? 5.5 : 3.5}
        fill={getRankColor(i)}
        stroke="var(--bg-elev)"
        stroke-width="1.5"
        style="cursor: pointer; transition: r 0.15s, fill 0.15s;"
        role="presentation"
        onmouseenter={() => hoverIndex = i}
        onmouseleave={() => hoverIndex = null}
      />
    {/each}

    {#if hoverIndex !== null && data[hoverIndex]}
      {@const hv = data[hoverIndex]}
      {@const angle = (hoverIndex * (Math.PI * 2) / data.length) - Math.PI / 2}
      {@const r = (hv.value / maxVal) * radius + 14}
      {@const tx = cx + r * Math.cos(angle)}
      {@const ty = cy + r * Math.sin(angle)}
      <g style="pointer-events: none;">
        <rect
          x={tx - 30} y={ty - 11}
          width="60" height="20" rx="4"
          fill="var(--bg-elev)" stroke={getRankColor(hoverIndex)} stroke-width="1"
        />
        <text
          x={tx} y={ty}
          text-anchor="middle" dominant-baseline="middle"
          font-size="10" font-weight="700"
          fill={getRankColor(hoverIndex)}
        >
          {hv.percentage}%
        </text>
      </g>
    {/if}

    {#each data as d, i}
      {@const angle = (i * (Math.PI * 2) / data.length) - Math.PI / 2}
      {@const lx = cx + (radius + 22) * Math.cos(angle)}
      {@const ly = cy + (radius + 22) * Math.sin(angle)}
      {@const anchor = Math.cos(angle) > 0.3 ? 'start' : Math.cos(angle) < -0.3 ? 'end' : 'middle'}
      <text
        x={lx}
        y={ly}
        text-anchor={anchor}
        dominant-baseline="middle"
        font-size="10"
        font-weight={hoverIndex === i ? 700 : 500}
        fill={hoverIndex === i ? getRankColor(i) : 'var(--text-secondary)'}
        style="cursor: pointer; transition: fill 0.15s, font-weight 0.15s;"
        role="presentation"
        onmouseenter={() => hoverIndex = i}
        onmouseleave={() => hoverIndex = null}
      >
        {d.type}
      </text>
    {/each}
  </svg>
</div>
<style>
  .radar-chart-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: var(--sp-4) 0;
    width: 100%;
    min-height: 300px;
  }
  .radar-chart-wrapper svg {
    overflow: visible;
    max-width: 100%;
    height: auto;
  }
</style>
