<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '#lib/components/DataSection.svelte';
  import DetailHeader from '#lib/components/DetailHeader.svelte';
  import Slider from '#lib/components/Slider.svelte';

  let { data }: PageProps = $props();
  const item = $derived(data.item);

  const weaponTypes: Record<number, string> = {
    1: 'Broadblade', 2: 'Sword', 3: 'Pistol', 4: 'Gauntlet', 5: 'Rectifier'
  };

  const typeName = $derived(weaponTypes[item.weaponType as number] ?? '');
  let wLevel = $state(90);
  let wRefine = $state(1);
  const statsObj = $derived((item.stats || {}) as Record<string, any>);
  const baseAtk = $derived((statsObj['90']?.[0]) ?? 0);
  const subVal = $derived((statsObj['90']?.[1]) ?? 0);
  const currentStats = $derived(statsObj[String(wLevel)] || [0, 0]);





</script>

<svelte:head><title>{item.name} — WuWa DB</title></svelte:head>

<div class="detail-page">
  <DetailHeader
    hideDetails={true}
    title={item.name}
    image={item.image}
    badges={[
      ...(typeName ? [{ label: typeName, prefix: 'Type' }] : []),
      { label: '★'.repeat(item.rarity), type: 'star' },
      { label: '', prefix: 'Base ATK', value: String(baseAtk) },
      { label: '', prefix: item.subStat, value: subVal + (item.subStat.includes('%') ? '%' : '') }
    ]}
  />

  <DataSection title="Base Stats">
    <div style="margin-bottom: var(--sp-3);">
      <Slider label="Weapon Level" value={wLevel} min={1} max={90} onchange={(v) => wLevel = v} />
    </div>
    <table class="stats-table">
      <thead>
        <tr>
          <th>Stat</th>
          <th>Lv. {wLevel}</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>ATK</td><td>{currentStats[0]}</td></tr>
        <tr><td>{item.subStat}</td><td>{currentStats[1]}{item.subStat.includes('%') ? '%' : ''}</td></tr>
      </tbody>
    </table>
  </DataSection>

  {#if item.passive}
    <DataSection title="Passive Skill">
      <h3>{item.passive.name}</h3>
      <p class="desc">
        {item.passive.refinements && item.passive.refinements.length > 0
          ? item.passive.refinements[wRefine - 1]
          : item.passive.description}
      </p>

      {#if item.passive.refinements && item.passive.refinements.length > 0}
        <div class="refinements" style="margin-top: var(--sp-4);">
          <Slider label="Refinement Rank" value={wRefine} min={1} max={5} suffix="" onchange={(v) => wRefine = v} />
        </div>
      {/if}
    </DataSection>
  {/if}

  {#if item.lore}
    <DataSection title="Lore">
      <p class="lore-text">{item.lore}</p>
    </DataSection>
  {/if}
</div>

<style>
  .detail-page {
    width: 100%;
    padding: var(--content-pad);
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
  }

  

  /* Stats Table */
  .stats-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--fs-sm);
    font-family: var(--font-mono);
    table-layout: fixed;
  }
  .stats-table th, .stats-table td {
    text-align: left;
    padding: var(--sp-2);
    border-bottom: 1px solid var(--border);
    font-variant-numeric: tabular-nums;
  }
  .stats-table th:nth-child(2), .stats-table td:nth-child(2) {
    width: 30%;
    text-align: right;
  }
  .stats-table th { color: var(--text-secondary); font-weight: var(--fw-medium); }
  .stats-table tr:last-child td { border-bottom: none; }

  /* Passive & Lore */
  .desc { line-height: 1.6; color: var(--text-body); margin-bottom: var(--sp-3); }
  .lore-text { white-space: pre-line; line-height: 1.6; color: var(--text-secondary); font-style: italic; }
</style>
