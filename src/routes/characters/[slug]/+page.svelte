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

  let { data }: PageProps = $props();
  const item = data.item;
  const materialsMap = data.materialsMap || {};
  const teamsMap = data.teamsMap || {};
  const rolesMap = data.rolesMap || {};
  const sonatasMap = data.sonatasMap || {};

  const elementNames: Record<number, string> = {
    1: 'Glacio', 2: 'Fusion', 3: 'Electro', 4: 'Aero', 5: 'Spectro', 6: 'Havoc'
  };
  const weaponNames: Record<number, string> = {
    1: 'Broadblade', 2: 'Sword', 3: 'Pistol', 4: 'Gauntlet', 5: 'Rectifier'
  };

  const elName = $derived(elementNames[item.element as number] ?? '');
  const wpName = $derived(weaponNames[item.weapon as number] ?? '');

  // Resolve team slugs to full objects if possible, or just use names from build
  const resolvedTeams = $derived(
    item.build?.teams?.map((tSlug: string) => teamsMap[tSlug]).filter(Boolean) || []
  );

  // Map role IDs to names
  const roleLabels = $derived(
    (item.roles || []).map(id => rolesMap[id]?.name || ('Role ' + id)).join(', ')
  );

  // Map sonata IDs to names
  const sonataLabels = $derived(
    (item.sonatas || []).map(id => sonatasMap[id]?.name || ('Sonata ' + id)).join(', ')
  );
</script>

<svelte:head><title>{item.name} — WuWa DB</title></svelte:head>

<div class="detail-page">
  <!-- Banner Background -->
  {#if item.imageBanner}
    <div class="banner-bg" style="background-image: url({item.imageBanner})"></div>
  {/if}

  <header class="char-header card">
    <img src={item.icon || item.image} alt={item.name} class="char-avatar" />
    <div class="char-info">
      <h1>{item.name}</h1>
      <div class="tags">
        {#if elName}<span class="badge">{elName}</span>{/if}
        {#if wpName}<span class="badge">{wpName}</span>{/if}
        <span class="badge stars">{'★'.repeat(item.rarity)}</span>
        {#if item.class}<span class="badge">{item.class}</span>{/if}
        {#if roleLabels}<span class="badge muted">{roleLabels}</span>{/if}
        {#if sonataLabels}<span class="badge muted">{sonataLabels}</span>{/if}
      </div>
      <p class="meta-text">v{item.version} • {item.faction}</p>
    </div>
  </header>

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

  {#if item.materials}
    <DataSection title="Ascension Materials">
      <MaterialList materials={item.materials} map={materialsMap} />
    </DataSection>
  {/if}

  {#if item.recommendedStats || item.build}
    <DataSection title="Build Guide">
      <BuildView stats={item.recommendedStats} build={item.build} />
    </DataSection>
  {/if}

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
</div>

<style>
  .detail-page {
    position: relative;
    max-width: var(--max-content);
    margin: 0 auto;
    padding: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
  }

  /* Banner */
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

  /* Header Card */
  .char-header {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    padding: var(--sp-4);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(4px);
  }
  .char-avatar {
    width: 80px;
    height: 80px;
    border-radius: var(--radius);
    object-fit: cover;
    background: var(--bg-hover);
  }
  .char-info h1 {
    margin: 0 0 var(--sp-2);
    font-size: var(--fs-xl);
  }
  .tags {
    display: flex;
    gap: var(--sp-2);
    flex-wrap: wrap;
    margin-bottom: var(--sp-2);
  }
  .stars {
    color: #f5c518;
  }
  .muted {
    background: var(--bg-hover);
    color: var(--text-muted);
  }
  .small {
    font-size: var(--fs-xs);
    padding: 1px 4px;
  }
  .meta-text {
    color: var(--text-muted);
    font-size: var(--fs-sm);
    margin: 0;
  }

  /* Changelog */
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
