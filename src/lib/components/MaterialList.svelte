<script lang="ts">
  import Tabs from '#lib/components/Tabs.svelte';

  let { materials, map }: { materials: any; map?: Record<number, any> } = $props();

  function getMat(id: number) {
    return map?.[id] || { name: 'ID:' + id, tier: 0, image: '/icons/materials/placeholder.png' };
  }

  // Gabungkan data Ascension dan Skill
  const ascensionMats = $derived.by(() => {
    const counts: Record<number, number> = {};
    materials.ascension?.forEach((step: any) => {
      step.cost?.forEach((c: any) => {
        counts[c.item] = (counts[c.item] || 0) + c.amount;
      });
    });
    return Object.entries(counts).map(([id, amount]) => ({ id: Number(id), amount }));
  });

  const skillMats = $derived.by(() => {
    const counts: Record<number, number> = {};
    materials.skills?.totalCosts?.forEach((c: any) => {
      counts[c.item] = (counts[c.item] || 0) + c.amount;
    });
    return Object.entries(counts).map(([id, amount]) => ({ id: Number(id), amount }));
  });

  // Total gabungan
  const totalMats = $derived.by(() => {
    const counts: Record<number, number> = {};
    ascensionMats.forEach((m: any) => counts[m.id] = (counts[m.id] || 0) + m.amount);
    skillMats.forEach((m: any) => counts[m.id] = (counts[m.id] || 0) + m.amount);
    return Object.entries(counts).map(([id, amount]) => ({ id: Number(id), amount }));
  });

  function formatAmount(num: number) {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString();
  }

  function getTierStyle(tier: number) {
    switch (tier) {
      case 5: return 'tier-5';
      case 4: return 'tier-4';
      case 3: return 'tier-3';
      case 2: return 'tier-2';
      case 1: return 'tier-1';
      default: return 'tier-0';
    }
  }

  // State Tab
  let activeTab = $state('total');
  const tabs = [
    { id: 'total', label: 'Total' },
    { id: 'ascension', label: 'Ascension' },
    { id: 'skills', label: 'Skills' }
  ];

  // Data yang ditampilkan menyesuaikan tab
  const displayedMats = $derived(
    activeTab === 'total' ? totalMats :
    activeTab === 'ascension' ? ascensionMats :
    skillMats
  );
</script>

<div class="mat-list">
  <div class="tabs-container">
    <Tabs {tabs} {activeTab} onchange={(id) => activeTab = id} />
  </div>

  <div class="mat-grid">
    {#each displayedMats as m (m.id)}
      {@const mat = getMat(m.id)}
      <div class="mat-card" title={mat.name}>
        <div class="mat-img-box {getTierStyle(mat.tier)}">
          <img src={mat.image} alt={mat.name} class="mat-img" />
          <span class="mat-amount">{formatAmount(m.amount)}</span>
        </div>
        <span class="mat-name">{mat.name.replace(/_/g, ' ')}</span>
      </div>
    {/each}
  </div>

  {#if displayedMats.length === 0}
    <p class="empty-text">No materials available for this section.</p>
  {/if}
</div>

<style>
  .mat-list { width: 100%; display: flex; flex-direction: column; gap: var(--sp-4); }

  .tabs-container {
    display: flex;
    justify-content: center;
    margin-bottom: var(--sp-2);
  }

  .mat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
    gap: var(--sp-2);
  }

  .mat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: help;
  }

  .mat-img-box {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: var(--radius);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mat-card:hover .mat-img-box {
    transform: scale(1.05);
    border-color: var(--accent);
  }

  /* Warna Tier */
  .tier-5 { border-color: #f5c518 !important; background: rgba(245,197,24,0.1) !important; }
  .tier-4 { border-color: #a855f7 !important; background: rgba(168,85,247,0.1) !important; }
  .tier-3 { border-color: #3b82f6 !important; background: rgba(59,130,246,0.1) !important; }
  .tier-2 { border-color: #22c55e !important; background: rgba(34,197,94,0.1) !important; }
  .tier-1 { border-color: #9ca3af !important; background: rgba(156,163,175,0.1) !important; }
  .tier-0 { border-color: #4b5563 !important; background: rgba(75,85,99,0.1) !important; }

  .mat-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 0;
    transform: scale(1.15);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  }

  .mat-card:hover .mat-img {
    transform: scale(1.25);
  }

  .mat-amount {
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--bg-elev); /* Ikut tema */
    color: var(--text);
    font-size: 14px;
    font-weight: bold;
    padding: 1px 4px;
    border-top-left-radius: var(--radius);
    border-left: 1px solid var(--border);
    border-top: 1px solid var(--border);
    line-height: 1.2;
    z-index: 2;
    white-space: nowrap;
  }

  .mat-name {
    font-size: 10px;
    text-align: center;
    color: var(--text-muted);
    line-height: 1.1;
    max-width: 72px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-transform: uppercase;
    font-weight: var(--fw-bold);
  }

  .empty-text {
    text-align: center;
    color: var(--text-muted);
    font-size: var(--fs-sm);
    padding: var(--sp-4) 0;
  }
</style>
