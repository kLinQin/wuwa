<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '../../../lib/components/DataSection.svelte';
  import SkillList from '../../../lib/components/SkillList.svelte';
  import SequenceList from '../../../lib/components/SequenceList.svelte';
  import Tabs from '../../../lib/components/Tabs.svelte';
  import DetailHeader from '../../../lib/components/DetailHeader.svelte';
  import MaterialList from '../../../lib/components/MaterialList.svelte';
  import Slider from '../../../lib/components/Slider.svelte';
  import Accordion from '../../../lib/components/Accordion.svelte';

  let props: PageProps = $props();
  const item = $derived(props.data.item);
  const sonatasMap = $derived(props.data.sonatasMap || {});
  let activeTab = $state('overview');
  let kitTab = $state('skills');
  let loreTab = $state('stories');
  let charLevel = $state(90);
  const levelStats = $derived(item.levelStats || {});
  const statNames = $derived(Object.keys((levelStats[1] as any) || {}));
  const currentStats = $derived((levelStats as any)[charLevel] || {});

  const tabList = [
    { id: 'overview', label: 'Overview' },
    { id: 'kit', label: 'Kit & Sequences' },
    { id: 'lore', label: 'Lore' }
  ];

  const elementNames: Record<number, string> = { 1: 'Glacio', 2: 'Fusion', 3: 'Electro', 4: 'Aero', 5: 'Spectro', 6: 'Havoc' };
  const weaponNames: Record<number, string> = { 1: 'Broadblade', 2: 'Sword', 3: 'Pistol', 4: 'Gauntlet', 5: 'Rectifier' };
  const elName = $derived(elementNames[item.element as number] ?? '');
  const wpName = $derived(weaponNames[item.weapon as number] ?? '');
  const sonataLabels = $derived((item.sonatas || []).map((id: any) => sonatasMap[id]?.name || ('Sonata ' + id)));

  const loreTabs = [
    { id: 'stories', label: 'Stories' },
    { id: 'words', label: 'Voice Lines' },
    { id: 'goods', label: 'Items' }
  ];

  const loreItems = $derived(
    loreTab === 'stories' ? (item.stories || [])
    : loreTab === 'words' ? (item.words || [])
    : (item.goods || [])
  );
</script>

<svelte:head><title>{item.name} — WuWa DB</title></svelte:head>

<div class="detail-page">
  {#if item.imageBanner}
    <div class="banner-bg" style="background-image: url({item.imageBanner})"></div>
  {/if}

  <DetailHeader
    title={item.name}
    roleDetails={item.roles || []}
    image={item.icon || item.image}
    badges={[
      ...(elName ? [{ label: elName, prefix: 'Element' }] : []),
      ...(wpName ? [{ label: wpName, prefix: 'Weapon' }] : []),
      { label: '★'.repeat(item.rarity), type: 'star' },
      ...(item.favor?.birthday ? [{ label: item.favor.birthday, prefix: 'Birthday' }] : []),
      ...(item.favor?.sex ? [{ label: item.favor.sex, prefix: 'Sex' }] : []),
      ...(item.favor?.country ? [{ label: item.favor.country, prefix: 'Country' }] : []),
      ...(item.favor?.influence ? [{ label: item.favor.influence, prefix: 'Influence' }] : []),
      ...(item.favor?.cvEn ? [{ label: item.favor.cvEn, prefix: 'CV EN' }] : []),
      ...(item.favor?.cvJp ? [{ label: item.favor.cvJp, prefix: 'CV JP' }] : []),
    ]}
  />

  <Tabs tabs={tabList} activeTab={activeTab} onchange={(id) => activeTab = id} />

  {#if activeTab === 'overview'}
    {#if item.intro}
      <DataSection title="Introduction">
        <p class="desc">{item.intro}</p>
      </DataSection>
    {/if}

    {#if item.levelStats}
      {@const lvStats = item.levelStats[charLevel] || {}}
      {@const statNames = Object.keys(item.levelStats[1] || {})}
      <DataSection title="Base Stats">
        <div style="margin-bottom: var(--sp-3);">
          <Slider label="Character Level" value={charLevel} min={1} max={90} onchange={(v) => charLevel = v} />
        </div>
        <table class="stats-table">
          <thead><tr><th>Stat</th><th>Lv.{charLevel}</th></tr></thead>
          <tbody>
            {#each statNames as name}
              <tr><td>{name}</td><td>{lvStats[name] ?? '-'}</td></tr>
            {/each}
          </tbody>
        </table>
      </DataSection>
    {/if}

    {#if item.mechanics}
      <DataSection title="Basic Mechanics">
        <div class="mech">
          <div class="mech-left">
            {#if item.mechanics.icon}
              <img src={item.mechanics.icon} alt="Forte" class="mech-icon" />
            {/if}
          </div>
          <div class="mech-right">
            {#if item.mechanics.descriptions.length}
              <ul class="mech-list">
                {#each item.mechanics.descriptions as d}
                  <li>{d}</li>
                {/each}
              </ul>
            {/if}
            {#if item.mechanics.inputs.length}
              <div class="mech-inputs">
                <span class="mech-label">Input Details</span>
                <ul class="mech-list">
                  {#each item.mechanics.inputs as i}
                    <li>{@html i.html}</li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        </div>
      </DataSection>
    {/if}

    {#if item.materials}
      <DataSection title="Ascension & Skill Materials">
        <MaterialList materials={item.materials} map={item.itemMap} />
      </DataSection>
    {/if}

  {/if}

  {#if activeTab === 'kit'}
    <DataSection title="Skills & Sequences">
      <Tabs
        tabs={[{ id: 'skills', label: 'Skills' }, { id: 'sequences', label: 'Sequences' }]}
        activeTab={kitTab}
        onchange={(id) => kitTab = id}
      />
      <div class="kit-content">
        {#if kitTab === 'skills' && item.skills}
          <SkillList skills={item.skills} charSlug={item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} />
        {/if}
        {#if kitTab === 'sequences' && item.sequences}
          <SequenceList sequences={item.sequences} charSlug={item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} />
        {/if}
      </div>
    </DataSection>
  {/if}

  {#if activeTab === 'lore'}
    <DataSection title="Lore">
      <Tabs tabs={loreTabs} activeTab={loreTab} onchange={(id) => loreTab = id} />
      <div class="lore-content">
        {#if loreItems.length === 0}
          <p class="desc">No entries.</p>
        {:else}
          {#each loreItems as entry}
            <Accordion title={entry.title || '(untitled)'} image={entry.pic || ''}>
              {entry.content}
            </Accordion>
          {/each}
        {/if}
      </div>
    </DataSection>
  {/if}
</div>

<style>
  .detail-page { position: relative; width: 100%; padding: var(--content-pad); display: flex; flex-direction: column; gap: var(--sp-5); }
  .banner-bg { position: absolute; top: 0; left: 0; right: 0; height: 200px; background-size: cover; background-position: center; opacity: 0.3; z-index: -1; mask-image: linear-gradient(to bottom, black 0%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%); }
  .desc { line-height: 1.6; color: var(--text-body); }
  .kit-content { min-height: 400px; }

  .stats-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); font-family: var(--font-mono); table-layout: fixed; }
  .stats-table th, .stats-table td { text-align: left; padding: var(--sp-2); border-bottom: 1px solid var(--border); font-variant-numeric: tabular-nums; }
  .stats-table th:nth-child(2), .stats-table td:nth-child(2) { width: 30%; text-align: right; }
  .stats-table th { color: var(--text-secondary); font-weight: var(--fw-medium); }
  .stats-table tr:last-child td { border-bottom: none; }

  .kv { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--sp-1); font-size: var(--fs-sm); color: var(--text-body); }
  .kv strong { color: var(--text-secondary); font-weight: var(--fw-medium); margin-right: var(--sp-2); }

  .slider-row { display: flex; align-items: center; gap: var(--sp-3); margin-bottom: var(--sp-3); }
  .slider-row input[type=range] { flex: 1; }
  .lvl-badge { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--accent); min-width: 60px; text-align: right; }

  .mech { display: grid; grid-template-columns: 1fr; gap: var(--sp-3); align-items: start; }
  .mech-left { display: flex; justify-content: center; }
  .mech-right { display: flex; flex-direction: column; gap: var(--sp-3); min-width: 0; }

  @media (min-width: 768px) {
    .mech { grid-template-columns: 240px 1fr; }
  }
  .mech-icon { width: 160px; height: 160px; object-fit: contain; }
  @media (min-width: 768px) {
    .mech-icon { width: 240px; height: 240px; }
  }
  .mech-list { margin: 0; padding-left: var(--sp-4); display: flex; flex-direction: column; gap: var(--sp-2); font-size: var(--fs-sm); line-height: 1.5; color: var(--text-body); }
  .mech-inputs { display: flex; flex-direction: column; gap: var(--sp-2); }
  .mech-label { font-size: var(--fs-sm); color: var(--text-secondary); font-weight: var(--fw-medium); }
  .mech-list :global(img) { display: inline-block; vertical-align: middle; height: 20px; }

  .lore-content { display: flex; flex-direction: column; gap: var(--sp-2); margin-top: var(--sp-3); }
  .lore-entry { background: var(--bg-hover); padding: var(--sp-2) var(--sp-3); border-radius: var(--radius); }
  .lore-entry summary { cursor: pointer; color: var(--accent); font-size: var(--fs-sm); font-weight: var(--fw-medium); }
  .lore-body { margin-top: var(--sp-2); white-space: pre-line; line-height: 1.6; font-size: var(--fs-sm); color: var(--text-body); }
</style>
