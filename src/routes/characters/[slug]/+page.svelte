<script lang="ts">
  import DataTable from '#lib/components/DataTable.svelte';
  import type { PageProps } from './$types';
  import DataSection from '../../../lib/components/DataSection.svelte';
  import SkillList from '../../../lib/components/SkillList.svelte';
  import SequenceList from '../../../lib/components/SequenceList.svelte';
  import Tabs from '../../../lib/components/Tabs.svelte';
  import DetailHeader from '../../../lib/components/DetailHeader.svelte';
  import MaterialList from '../../../lib/components/MaterialList.svelte';
  import Slider from '../../../lib/components/Slider.svelte';
  import Accordion from '../../../lib/components/Accordion.svelte';

  function stripTags(html: string): string {
    return String(html || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }

  let mechTranslated = $state<{ descriptions: string[]; inputs: string[] } | null>(null);
  let mechLoading = $state(false);
  let mechError = $state<string | null>(null);

  async function toggleMechTranslate() {
    if (mechTranslated) { mechTranslated = null; mechError = null; return; }
    const m = item.mechanics;
    if (!m) return;
    mechLoading = true; mechError = null;
    try {
      const descText = (m.descriptions || []).join('\n');
      const inputTexts = (m.inputs || []).map((x: any) => stripTags(x.html));
      const jobs: Promise<string>[] = [
        descText ? callTranslate(descText) : Promise.resolve(''),
        ...inputTexts.map((t) => t ? callTranslate(t) : Promise.resolve(''))
      ];
      const results = await Promise.all(jobs);
      const translatedDesc = results[0];
      const translatedInputs = results.slice(1);
      mechTranslated = {
        descriptions: descText ? translatedDesc.split('\n') : [],
        inputs: translatedInputs
      };
    } catch (e: any) {
      mechError = e?.message || 'Translate failed';
    } finally {
      mechLoading = false;
    }
  }

  async function callTranslate(text: string, sl = 'auto', tl = 'id'): Promise<string> {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sl, tl })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    return j.text || '';
  }

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

  const skillsMap = $derived.by(() => {
    const map: Record<string, { type: string; name: string; description: string }> = {};
    const labels: Record<string, string> = {
      basic: 'Basic Attack', skill: 'Resonance Skill', liberation: 'Resonance Liberation',
      forte: 'Forte Circuit', intro: 'Intro Skill', outro: 'Outro Skill'
    };
    for (const k of Object.keys((item.skills as any) || {})) {
      if (k === 'inherent') continue;
      const sk = (item.skills as any)[k];
      if (sk?.name) {
        const desc = (sk.effects || []).map((e: any) => e.description).filter(Boolean).join('\n');
        map[sk.name] = { type: labels[k] || k, name: sk.name, description: desc };
      }
    }
    for (const inh of ((item.skills as any)?.inherent || [])) {
      if (inh?.name) {
        const desc = (inh.effects || []).map((e: any) => e.description).filter(Boolean).join('\n');
        map[inh.name] = { type: 'Inherent Skill', name: inh.name, description: desc };
      }
    }
    return map;
  });
</script>

<svelte:head><title>{item.name} — WWI</title></svelte:head>

<div class="detail-page">
  

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
        <DataTable headers={['Stat', { label: `Lv.${charLevel}`, align: 'right' }]}>
          {#each statNames as name}
            <tr><td>{name}</td><td class="num">{lvStats[name] ?? '-'}</td></tr>
          {/each}
        </DataTable>
      </DataSection>
    {/if}

    {#if item.mechanics}
      <DataSection title="Basic Mechanics">
        {#snippet actions()}
          <button
            class="raised"
            onclick={toggleMechTranslate}
            disabled={mechLoading}
            aria-pressed={!!mechTranslated}
            title={mechError || 'Translate Basic Mechanics'}
          >
            {mechLoading ? 'Translating…' : mechTranslated ? 'Original' : 'Translate'}
          </button>
        {/snippet}
        <div class="mech">
          <div class="mech-left">
            {#if item.mechanics.icon}
              <img src={item.mechanics.icon} alt="Forte" class="mech-icon" />
            {/if}
          </div>
          <div class="mech-right">
            {#if item.mechanics.descriptions.length}
              <ul class="mech-list">
                {#each (mechTranslated?.descriptions ?? item.mechanics.descriptions) as d}
                  <li>{d}</li>
                {/each}
              </ul>
            {/if}
            {#if item.mechanics.inputs.length}
              <div class="mech-inputs">
                <span class="mech-label">Input Details</span>
                <ul class="mech-list">
                  {#if mechTranslated}
                    {#each mechTranslated.inputs as t}
                      <li>{t}</li>
                    {/each}
                  {:else}
                    {#each item.mechanics.inputs as i}
                      <li>{@html i.html}</li>
                    {/each}
                  {/if}
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
          <SequenceList sequences={item.sequences} skillsMap={skillsMap} charSlug={item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} />
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
  .desc { line-height: 1.6; color: var(--text-body); }
  .kit-content { min-height: 400px; }

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

</style>
