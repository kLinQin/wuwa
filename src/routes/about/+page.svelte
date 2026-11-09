<script lang="ts">
  import Tabs from '#lib/components/Tabs.svelte';
  import DataSection from '#lib/components/DataSection.svelte';

  let activeTab = $state('web');
  const tabs = [
    { id: 'web', label: 'About Web' },
    { id: 'api', label: 'API Sources' },
    { id: 'credit', label: 'Credits' }
  ];
</script>

<svelte:head><title>About — WWI</title></svelte:head>

<div class="about-page">
  <header class="page-header">
    <h1>Information</h1>
    <p class="desc">Details about the project, data sources, and acknowledgements.</p>
  </header>

  <Tabs {tabs} {activeTab} onchange={(id) => activeTab = id} />

  <div class="content-box surface">
    {#if activeTab === 'web'}
      <DataSection title="About This Web">
        <p>
          <strong>WWI</strong> is a fast, open-source, and community-driven database for Wuthering Waves.
          Built with SvelteKit and Tailwind-inspired design, it aims to provide a clean, ad-free, and seamless experience for all Rovers.
        </p>
        <p>
          Whether you're looking for character builds, weapon stats, echo sonatas, or the latest game events, everything is organized in one place.
          All data is fetched dynamically to ensure accuracy.
        </p>
      </DataSection>
    {:else if activeTab === 'api'}
      <DataSection title="Data Sources & API">
        <ul>
          <li><strong>Encore API</strong> (api-v2.encore.moe) - Primary source for Characters, Weapons, Echoes, Sonatas, and Stories.</li>
          <li><strong>WuWa Tracker</strong> (wuwatracker.com) - Event timeline, banners, and ongoing activities.</li>
          <li><strong>KLinQin WuWa-Data</strong> (github) - Community-driven builds, stats, and team recommendations.</li>
        </ul>
        <p style="margin-top: var(--sp-3); font-size: var(--fs-sm); color: var(--text-secondary);">
          * Gambar di-proxy dan di-cache secara lokal untuk menghemat bandwidth dan mempercepat waktu muat.
        </p>
      </DataSection>
    {:else if activeTab === 'credit'}
      <DataSection title="Credits">
        <p>This project would not be possible without the amazing community:</p>
        <ul>
          <li><strong>Kuro Games</strong> - The developer and publisher of Wuthering Waves.</li>
          <li><strong>Encore</strong> - Providing an open and comprehensive API for game data.</li>
          <li><strong>WuWa Tracker</strong> - For the up-to-date event schedules and banner info.</li>
          <li><strong>Data Miners & Contributors</strong> - Everyone who datamined, formatted, and shared the raw assets.</li>
          <li><strong>You!</strong> - For visiting and using this database.</li>
        </ul>
      </DataSection>
    {/if}
  </div>
</div>

<style>
  .about-page {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--content-pad);
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }
  .page-header h1 { font-size: var(--fs-xl); margin: 0 0 var(--sp-1); }
  .page-header .desc { color: var(--text-secondary); font-size: var(--fs-sm); margin: 0; }
  .content-box { padding: var(--sp-4); }
  .content-box :global(p) { line-height: 1.6; margin-bottom: var(--sp-3); }
  .content-box :global(ul) { padding-left: var(--sp-4); line-height: 1.6; display: flex; flex-direction: column; gap: var(--sp-2); }
</style>
