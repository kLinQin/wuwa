<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '#lib/components/DataSection.svelte';
  import SkillList from '#lib/components/SkillList.svelte';
  import MaterialList from '#lib/components/MaterialList.svelte';
  import BuildView from '#lib/components/BuildView.svelte';
  import SequenceList from '#lib/components/SequenceList.svelte';
  import ProfileInfo from '#lib/components/ProfileInfo.svelte';
  import TeamList from '#lib/components/TeamList.svelte';
  import ChartView from '#lib/components/ChartView.svelte';
  import Tabs from '#lib/components/Tabs.svelte';
  import DetailHeader from '#lib/components/DetailHeader.svelte';

  let props: PageProps = $props();
  const item = $derived(props.data.item);
  const materialsMap = $derived(props.data.materialsMap || {});
  const teamsMap = $derived(props.data.teamsMap || {});
  const rolesMap = $derived(props.data.rolesMap || {});
  const sonatasMap = $derived(props.data.sonatasMap || {});
  let activeTab = $state('overview');

  const tabList = [
    { id: 'overview', label: 'Overview' },
    { id: 'kit', label: 'Kit & Sequences' },
    { id: 'teams', label: 'Teams & Stats' },
    { id: 'lore', label: 'Lore & Changelog' }
  ];

  const elementNames: Record<number, string> = {
    1: 'Glacio', 2: 'Fusion', 3: 'Electro', 4: 'Aero', 5: 'Spectro', 6: 'Havoc'
  };
  const weaponNames: Record<number, string> = {
    1: 'Broadblade', 2: 'Sword', 3: 'Pistol', 4: 'Gauntlet', 5: 'Rectifier'
  };

  const elName = $derived(elementNames[item.element as number] ?? '');
  const wpName = $derived(weaponNames[item.weapon as number] ?? '');

  const resolvedTeams = $derived(
    item.build?.teams?.map((tSlug: string) => teamsMap[tSlug]).filter(Boolean) || []
  );

  const roleLabels = $derived(
    (item.roles || []).map(id => rolesMap[id]?.name || ('Role ' + id))
  );

  const sonataLabels = $derived(
    (item.sonatas || []).map(id => sonatasMap[id]?.name || ('Sonata ' + id))
  );
</script>

<svelte:head><title>{item.name} — WuWa DB</title></svelte:head>

<div class="detail-page">
  {#if item.imageBanner}
    <div class="banner-bg" style="background-image: url({item.imageBanner})"></div>
  {/if}

  <DetailHeader
    title={item.name}
    image={item.icon || item.image}
    badges={[
      ...(elName ? [{ label: elName, prefix: 'Element' }] : []),
      ...(wpName ? [{ label: wpName, prefix: 'Weapon' }] : []),
      { label: '★'.repeat(item.rarity), type: 'star' },
      ...(item.class ? [{ label: item.class, prefix: 'Class' }] : []),
      ...(item.faction ? [{ label: item.faction, prefix: 'Faction' }] : []),
      ...(item.version ? [{ label: 'v' + item.version, prefix: 'Version' }] : []),
      ...sonataLabels.map((sonata: string) => ({ label: sonata, type: 'muted', prefix: 'Sonata' })),
      ...roleLabels.map((role: string) => ({ label: role, type: 'muted', prefix: 'Role' }))
    ]}
  />

  <Tabs tabs={tabList} activeTab={activeTab} onchange={(id) => activeTab = id} />

  {#if activeTab === 'overview'}
    {#if item.recommendedStats || item.build}
      <DataSection title="Build Guide">
        <BuildView stats={item.recommendedStats} build={item.build} />
      </DataSection>
    {/if}
    {#if item.materials}
      <DataSection title="Ascension Materials">
        <MaterialList materials={item.materials} map={materialsMap} />
      </DataSection>
    {/if}
  {/if}

  {#if activeTab === 'kit'}
    {#if item.skills}
      <DataSection title="Skills">
        <SkillList skills={item.skills} />
      </DataSection>
    {/if}
    {#if item.sequences}
      <DataSection title="Sequences">
        <SequenceList sequences={item.sequences} />
      </DataSection>
    {/if}
  {/if}

  {#if activeTab === 'teams'}
    {#if resolvedTeams.length > 0}
      <DataSection title="Recommended Teams">
        <TeamList teams={resolvedTeams} />
      </DataSection>
    {/if}
    {#if item.analysisCharts}
      <DataSection title="Analysis & Stats">
        <ChartView charts={item.analysisCharts} />
      </DataSection>
    {/if}
  {/if}

  {#if activeTab === 'lore'}
    {#if item.favorRole}
      <DataSection title="Profile & Lore">
        <ProfileInfo info={item.favorRole} />
      </DataSection>
    {/if}
    {#if item.changelog && item.changelog.length > 0}
      <DataSection title="Changelog">
        <ul class="changelog-list">
          {#each item.changelog as log}
            <li>
              <span class="log-date">{log.time}</span>
              <span class="log-type badge small">{log.type}</span>
              <span class="log-text">{log.text}</span>
            </li>
          {/each}
        </ul>
      </DataSection>
    {/if}
  {/if}
</div>

<style>
  .detail-page {
    position: relative;
    width: 100%;
    padding: var(--content-pad);
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
  }

  .banner-bg {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 200px;
    background-size: cover;
    background-position: center;
    opacity: 0.3;
    z-index: -1;
    mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  }

  

  .changelog-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    font-size: var(--fs-sm);
  }
  .changelog-list li {
    display: flex;
    align-items: baseline;
    gap: var(--sp-2);
  }
  .log-date {
    font-family: var(--font-mono);
    color: var(--text-muted);
    white-space: nowrap;
  }
  .log-text {
    color: var(--text);
  }
</style>
