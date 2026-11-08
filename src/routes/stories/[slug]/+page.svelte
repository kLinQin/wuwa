<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '#lib/components/DataSection.svelte';

  let { data }: PageProps = $props();
  const item = $derived(data.item);
  const lore = $derived(item.lore || {});
</script>

<svelte:head><title>{item.name} — WuWa DB</title></svelte:head>

<div class="detail-page">
  <header class="story-header card">
    <div class="info">
      <h1>{item.name}</h1>
      <p class="meta-text">{item.faction} • {item.affiliation}</p>
    </div>
  </header>

  {#if lore.description}
    <DataSection title="Overview">
      <p class="desc">{@html lore.description.split('\n').join('<br/>')}</p>
    </DataSection>
  {/if}

  {#if lore.manualEntries && lore.manualEntries.length > 0}
    <DataSection title="Manual Entries">
      <div class="entries-grid">
        {#each lore.manualEntries as entry}
          <div class="entry-box raised">
            <span class="label">{entry.title}</span>
            <span class="value">{entry.description}</span>
          </div>
        {/each}
      </div>
    </DataSection>
  {/if}

  {#if lore.report}
    <DataSection title="Resonance Report">
      {#if lore.report.resonancePower}
        <div class="report-item">
          <h4>Resonance Power</h4>
          <p>{lore.report.resonancePower}</p>
        </div>
      {/if}

      {#if lore.report.overclockDiagnostic}
        <details class="report-details">
          <summary>Overclock Diagnostic</summary>
          <pre>{@html lore.report.overclockDiagnostic.split('\n').join('<br/>')}</pre>
        </details>
      {/if}

      {#if lore.report.resonanceEvaluation}
        <details class="report-details" open>
          <summary>Resonance Evaluation</summary>
          <pre>{@html lore.report.resonanceEvaluation.split('\n').join('<br/>')}</pre>
        </details>
      {/if}
    </DataSection>
  {/if}

  {#if lore.items && lore.items.length > 0}
    <DataSection title="Key Items">
      <div class="items-list">
        {#each lore.items as it}
          <div class="item-card raised">
            {#if it.imageUrl}
              <img src={it.imageUrl} alt={it.name} class="item-img" />
            {/if}
            <div class="item-info">
              <h4>{it.name}</h4>
              <p>{it.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </DataSection>
  {/if}

  {#if lore.specialFood}
    <DataSection title="Special Food">
      <div class="food-card raised">
        {#if lore.specialFood.imageUrl}
          <img src={lore.specialFood.imageUrl} alt={lore.specialFood.name} class="food-img" />
        {/if}
        <div class="food-info">
          <h4>{lore.specialFood.name}</h4>
          <p>{lore.specialFood.description}</p>
        </div>
      </div>
    </DataSection>
  {/if}

  {#if lore.stories && lore.stories.length > 0}
    <DataSection title="Stories">
      <div class="stories-list">
        {#each lore.stories as story}
          <details class="story-block">
            <summary>{story.title}</summary>
            <div class="story-content">
              {@html story.content.split('\n').join('<br/><br/>')}
            </div>
          </details>
        {/each}
      </div>
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

  .story-header {
    padding: var(--sp-4);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .info h1 { margin: 0 0 var(--sp-1); font-size: var(--fs-xl); }
  .meta-text { color: var(--text-secondary); font-size: var(--fs-sm); margin: 0; }

  .desc { line-height: 1.6; color: var(--text-body); font-size: var(--fs-md); margin: 0; }

  /* Manual Entries */
  .entries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--sp-3);
  }
  .entry-box {
    padding: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
  }
  .label { font-size: var(--fs-xs); color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
  .value { font-size: var(--fs-sm); color: var(--text-body); font-weight: var(--fw-medium); }

  /* Report */
  .report-item { margin-bottom: var(--sp-3); }
  .report-item h4 { margin: 0 0 var(--sp-1) 0; font-size: var(--fs-md); color: var(--accent); }
  .report-item p { margin: 0; font-size: var(--fs-sm); }

  .report-details { margin-top: var(--sp-2); }
  .report-details summary { cursor: pointer; padding: var(--sp-2); background: var(--bg-hover); border-radius: var(--radius); font-size: var(--fs-sm); font-weight: var(--fw-medium); }
  .report-details pre {
    white-space: pre-wrap;
    word-break: break-word;
    font-family: inherit;
    font-size: var(--fs-sm);
    line-height: 1.6;
    margin: var(--sp-2) 0 0 0;
    padding: var(--sp-3);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  /* Items & Food */
  .items-list, .stories-list { display: flex; flex-direction: column; gap: var(--sp-3); }
  .item-card, .food-card {
    display: flex;
    align-items: flex-start;
    gap: var(--sp-3);
    padding: var(--sp-3);
  }
  .item-img, .food-img { width: 60px; height: 60px; object-fit: contain; background: var(--bg-hover); border-radius: var(--radius); }
  .item-info h4, .food-info h4 { margin: 0 0 var(--sp-1) 0; font-size: var(--fs-md); color: var(--accent); }
  .item-info p, .food-info p { margin: 0; font-size: var(--fs-sm); color: var(--text-secondary); line-height: 1.5; }

  /* Stories */
  .story-block { margin-bottom: var(--sp-2); }
  .story-block summary {
    cursor: pointer;
    padding: var(--sp-3);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: var(--fs-md);
    font-weight: var(--fw-medium);
  }
  .story-block summary:hover { background: var(--bg-hover); }
  .story-content {
    padding: var(--sp-3);
    font-size: var(--fs-sm);
    line-height: 1.8;
    color: var(--text-body);
    border-left: 2px solid var(--accent);
    margin-left: var(--sp-2);
    margin-top: var(--sp-2);
  }
</style>
