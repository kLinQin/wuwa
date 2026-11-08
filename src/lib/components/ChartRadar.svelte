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

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) - 40;
</script>

<div class="radar-chart-wrapper">
  <svg width={size} height={size} viewBox="0 0 {size} {size}">
    <!-- Garis Grid (Web) -->
    {#each [1, 0.75, 0.5, 0.25] as scale}
      <polygon
        points={getRadarPoints(data.map(() => ({ value: maxVal * scale })), radius, cx, cy, maxVal)}
        fill="none"
        stroke="var(--border)"
        stroke-width="1"
      />
    {/each}

    <!-- Garis Sumbu -->
    {#each getRadarAxes(data, radius, cx, cy) as axis}
      <line x1={axis.x1} y1={axis.y1} x2={axis.x2} y2={axis.y2} stroke="var(--border)" stroke-width="1" />
    {/each}

    <!-- Area Data -->
    <polygon
      points={getRadarPoints(data, radius, cx, cy, maxVal)}
      fill="var(--accent)"
      fill-opacity="0.3"
      stroke="var(--accent)"
      stroke-width="2"
    />

    <!-- Titik Data -->
    {#each getRadarPoints(data, radius, cx, cy, maxVal).split(' ') as point}
      {@const [x, y] = point.split(',')}
      <circle cx={x} cy={y} r="3" fill="var(--accent)" />
    {/each}

    <!-- Label -->
    {#each data as d, i}
      {@const angle = (i * (Math.PI * 2) / data.length) - Math.PI / 2}
      {@const lx = cx + (radius + 15) * Math.cos(angle)}
      {@const ly = cy + (radius + 15) * Math.sin(angle)}
      <text x={lx} y={ly} text-anchor="middle" dominant-baseline="middle" font-size="10" fill="var(--text-muted)">
        {d.type}
      </text>
    {/each}
  </svg>
</div>

<style>
  .radar-chart-wrapper { display: flex; justify-content: center; margin: var(--sp-2) 0; width: 100%; }
  .radar-chart-wrapper svg { overflow: visible; }
</style>
