<script lang="ts">
  let { data }: { data: any[] } = $props();

  const maxVal = $derived(
    data && data.length > 0 ? Math.max(...data.map((x: any) => x.value)) : 1
  );

  let hoverIndex = $state<number | null>(null);
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = (size / 2) - 30;

  
  const barThickness = 12;
  const gap = 4;

  
  function getArcPath(startAngle: number, endAngle: number, innerR: number, outerR: number) {
    
    const p1 = polarToCartesian(cx, cy, outerR, startAngle);
    const p2 = polarToCartesian(cx, cy, outerR, endAngle);
    const p3 = polarToCartesian(cx, cy, innerR, endAngle);
    const p4 = polarToCartesian(cx, cy, innerR, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', p1.x, p1.y,
      'A', outerR, outerR, 0, largeArcFlag, 0, p2.x, p2.y,
      'L', p3.x, p3.y,
      'A', innerR, innerR, 0, largeArcFlag, 1, p4.x, p4.y,
      'Z'
    ].join(' ');
  }

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }
</script>

<div class="polar-chart-wrapper">
  <svg width={size} height={size} viewBox="0 0 {size} {size}">
    {#each data as d, i}
      {@const ratio = d.value / maxVal}
      {@const angleSpan = 360 / data.length}
      {@const startAngle = i * angleSpan + (gap / 2)}
      {@const endAngle = (i + 1) * angleSpan - (gap / 2)}

      <!-- Background track -->
      <path
        d={getArcPath(startAngle, endAngle, maxRadius - barThickness, maxRadius)}
        fill="var(--bg-hover)"
        opacity="0.6"
      />

      <!-- Bar data -->
      <path
        d={getArcPath(startAngle, startAngle + (endAngle - startAngle) * ratio, maxRadius - barThickness, maxRadius)}
        fill={hoverIndex === i ? 'var(--accent-hover)' : 'var(--accent)'}
        style="cursor: pointer; transition: fill 0.15s;"
        role="presentation"
        onmouseenter={() => hoverIndex = i}
        onmouseleave={() => hoverIndex = null}
      />

      <!-- Label -->
      {@const midAngle = startAngle + (endAngle - startAngle) / 2}
      {@const labelPos = polarToCartesian(cx, cy, maxRadius + 14, midAngle)}
      <text
        x={labelPos.x}
        y={labelPos.y}
        text-anchor={midAngle > 90 && midAngle < 270 ? 'end' : 'start'}
        dominant-baseline="middle"
        font-size="9"
        font-weight={hoverIndex === i ? 700 : 400}
        fill={hoverIndex === i ? 'var(--accent)' : 'var(--text-secondary)'}
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
  .polar-chart-wrapper {
    display: flex;
    justify-content: center;
    margin: var(--sp-3) 0;
    width: 100%;
  }
  .polar-chart-wrapper svg {
    overflow: visible;
    max-width: 100%;
    height: auto;
  }
</style>
