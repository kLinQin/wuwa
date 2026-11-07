<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '#lib/components/DataSection.svelte';

  let { data }: PageProps = $props();
  const item = data.item;

  const weaponTypes: Record<number, string> = {
    1: 'Broadblade', 2: 'Sword', 3: 'Pistol', 4: 'Gauntlet', 5: 'Rectifier'
  };

  const typeName = $derived(weaponTypes[item.weaponType as number] ?? '');
</script>

<svelte:head><title>{item.name} — WuWa DB</title></svelte:head>

<div class="detail-page">
  <header class="weapon-header card">
    <img src={item.image} alt={item.name} class="weapon-img" />
    <div class="info">
      <h1>{item.name}</h1>
      <div class="tags">
        {#if typeName}<span class="badge">{typeName}</span>{/if}
        <span class="badge stars">{'★'.repeat(item.rarity)}</span>
        <span class="badge muted">{item.subStat}</span>
      </div>
      <p class="meta-text">v{item.version} • Last Updated: {item.lastUpdated || '-'}</p>
    </div>
  </header>

  <DataSection title="Base Stats">
    <table class="stats-table">
      <thead>
        <tr>
          <th>Level</th>
          <th>ATK</th>
          <th>{item.subStat}</th>
        </tr>
      </thead>
      <tbody>
        {#each Object.entries(item.stats) as [lvl, vals]}
          <tr>
            <td>{lvl}</td>
            <td>{vals[0]}</td>
            <td>{vals[1]}{item.subStat.includes('%') ? '%' : ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </DataSection>

  {#if item.passive}
    <DataSection title="Passive Skill">
      <h3>{item.passive.name}</h3>
      <p class="desc">{item.passive.description}</p>

      {#if item.passive.refinements && item.passive.refinements.length > 0}
        <div class="refinements">
          <h4>Refinement Levels</h4>
          <ol>
            {#each item.passive.refinements as ref, idx}
              <li><strong>R{idx + 1}:</strong> {ref}</li>
            {/each}
          </ol>
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
    max-width: var(--max-content);
    margin: 0 auto;
    padding: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
  }

  .weapon-header {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    padding: var(--sp-4);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .weapon-img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    background: var(--bg-hover);
    border-radius: var(--radius);
  }
  .info h1 { margin: 0 0 var(--sp-2); font-size: var(--fs-xl); }
  .tags { display: flex; gap: var(--sp-2); flex-wrap: wrap; margin-bottom: var(--sp-2); }
  .stars { color: #f5c518; }
  .muted { background: var(--bg-hover); color: var(--text-muted); }
  .meta-text { color: var(--text-muted); font-size: var(--fs-sm); margin: 0; }

  /* Stats Table */
  .stats-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--fs-sm);
    font-family: var(--font-mono);
  }
  .stats-table th, .stats-table td {
    text-align: left;
    padding: var(--sp-2);
    border-bottom: 1px solid var(--border);
  }
  .stats-table th { color: var(--text-muted); font-weight: var(--fw-medium); }
  .stats-table tr:last-child td { border-bottom: none; }

  /* Passive & Lore */
  .desc { line-height: 1.6; color: var(--text); margin-bottom: var(--sp-3); }
  .refinements h4 { margin: var(--sp-3) 0 var(--sp-2) 0; font-size: var(--fs-md); }
  .refinements ol { margin: 0; padding-left: var(--sp-4); font-size: var(--fs-sm); line-height: 1.5; }
  .refinements li { margin-bottom: var(--sp-1); }
  .lore-text { white-space: pre-line; line-height: 1.6; color: var(--text-muted); font-style: italic; }
</style>
