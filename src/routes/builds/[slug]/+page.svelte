<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '../../../lib/components/DataSection.svelte';
  import BuildView from '../../../lib/components/BuildView.svelte';
  import TeamList from '../../../lib/components/TeamList.svelte';
  import ChartView from '../../../lib/components/ChartView.svelte';
  import Tabs from '../../../lib/components/Tabs.svelte';
  import BottomSheet from '../../../lib/components/BottomSheet.svelte';
  import DetailHeader from '../../../lib/components/DetailHeader.svelte';

  let props: PageProps = $props();
  const item = $derived(props.data.item);
  const echoesIndex = $derived(props.data.echoesIndex || []);
  const sonatasList = $derived(props.data.sonatasList || []);
  const weaponsList = $derived(props.data.weaponsIndex || []);
  const teamsMap = $derived(props.data.teamsMap || {});
  const rolesMap = $derived(props.data.rolesMap || {});
  const sonatasMap = $derived(props.data.sonatasMap || {});
  let activeTab = $state('overview');
  let isTeamNoteOpen = $state(false);
  let currentTeamNote = $state('');

  const tabList = [
    { id: 'overview', label: 'Overview' },
    { id: 'teams', label: 'Teams' },
    { id: 'stats', label: 'Stats' },
    { id: 'lore', label: 'Changelog' }
  ];

  const elementNames: Record<number, string> = { 1: 'Glacio', 2: 'Fusion', 3: 'Electro', 4: 'Aero', 5: 'Spectro', 6: 'Havoc' };
  const weaponNames: Record<number, string> = { 1: 'Broadblade', 2: 'Sword', 3: 'Pistol', 4: 'Gauntlet', 5: 'Rectifier' };
  const elName = $derived(elementNames[item.element as number] ?? '');
  const wpName = $derived(weaponNames[item.weapon as number] ?? '');

  const resolvedTeams = $derived(item.build?.teams?.map((t: string) => teamsMap[t]).filter(Boolean) || []);
  const roleLabels = $derived((item.roles || []).map((id: any) => rolesMap[id]?.name || ('Role ' + id)));
  const sonataLabels = $derived((item.sonatas || []).map((id: any) => sonatasMap[id]?.name || ('Sonata ' + id)));
</script>

<svelte:head><title>{item.name} Build — WWI</title></svelte:head>

<div class="detail-page">
  

  <DetailHeader
    title={item.name + ' Build'}
    image={item.icon || item.image}
    badges={[
      ...(elName ? [{ label: elName, prefix: 'Element' }] : []),
      ...(wpName ? [{ label: wpName, prefix: 'Weapon' }] : []),
      { label: '★'.repeat(item.rarity), type: 'star' },
      ...sonataLabels.map((sonata: any) => ({ label: sonata, type: 'muted', prefix: 'Sonata' })),
      ...roleLabels.map((role: any) => ({ label: role, type: 'muted', prefix: 'Role' }))
    ]}
  />

  <Tabs tabs={tabList} activeTab={activeTab} onchange={(id) => activeTab = id} />

  {#if activeTab === 'overview'}
    {#if item.recommendedStats || item.build}
      <DataSection title="Build Guide">
        <BuildView stats={item.recommendedStats} build={item.build} echoes={echoesIndex} sonatas={sonatasList} weapons={weaponsList} />
      </DataSection>
    {/if}
  {/if}

  {#if activeTab === 'teams'}
    {#if resolvedTeams.length > 0}
      <DataSection title="Recommended Teams">
        {#snippet actions()}
          {#if item.build?.teamNote}
            <button
              class="raised small-btn"
              onclick={() => { currentTeamNote = item.build.teamNote; isTeamNoteOpen = true; }}
            >ℹ Note</button>
          {/if}
        {/snippet}
        <TeamList teams={resolvedTeams} />
      </DataSection>
    {/if}
  {/if}

  {#if activeTab === 'stats'}
    {#if item.analysisCharts}
      <DataSection title="Analysis & Stats">
        <ChartView charts={item.analysisCharts} />
      </DataSection>
    {/if}
  {/if}

  {#if activeTab === 'lore'}
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

<BottomSheet bind:open={isTeamNoteOpen} title="Team Note">
  <p style="white-space: pre-line; line-height: 1.6;">{currentTeamNote}</p>
</BottomSheet>

<style>
  .detail-page { position: relative; width: 100%; padding: var(--content-pad); display: flex; flex-direction: column; gap: var(--sp-5); }
  .changelog-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--sp-2); font-size: var(--fs-sm); }
  .changelog-list li { display: flex; align-items: baseline; gap: var(--sp-2); }
  .log-date { font-family: var(--font-mono); color: var(--text-secondary); white-space: nowrap; }
  .log-text { color: var(--text-body); }
</style>
