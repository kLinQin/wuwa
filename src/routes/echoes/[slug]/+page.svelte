<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '#lib/components/DataSection.svelte';
  import DetailHeader from '#lib/components/DetailHeader.svelte';
  import Accordion from '#lib/components/Accordion.svelte';

  let { data }: PageProps = $props();
  const item = $derived(data.item);
  const sonatasMap = $derived(data.sonatasMap || {});

  const elementNames: Record<number, string> = {
    1: 'Glacio', 2: 'Fusion', 3: 'Electro', 4: 'Aero', 5: 'Spectro', 6: 'Havoc'
  };

  const elName = $derived(elementNames[item.elementId as number] ?? '');
</script>

<svelte:head><title>{item.name} — WWI</title></svelte:head>

<div class="detail-page">
  <DetailHeader
    hideDetails={true}
    title={item.name}
    image={item.image}
    badges={[
      ...(elName ? [{ label: elName, prefix: 'Element' }] : []),
      { label: '', prefix: 'Cost', value: String(item.cost) },
      ...(item.echoClass ? [{ label: item.echoClass, prefix: 'Class' }] : []),
      ...(item.location ? [{ label: item.location, prefix: 'Location' }] : []),
      { label: '★'.repeat(item.rarity || 0), type: 'star' }
    ]}
  />

  <DataSection title="Echo Skill">
    <div class="skill-desc">{@html item.description.split('\n').join('<br/>')}</div>
  </DataSection>

  {#if item.possibleStats}
    <DataSection title="Possible Stats">
      <p class="desc">{item.possibleStats}</p>
    </DataSection>
  {/if}

  {#if item.sonataDetails && item.sonataDetails.length}
    <DataSection title="Associated Sonatas">
      <div class="sonata-list">
        {#each item.sonataDetails as s}
          <Accordion title={s.name}>
            <div class="sonata-acc-body">
              {#if s.icon}
                <img src={s.icon} alt={s.name} class="sonata-acc-img" />
              {/if}
              <div class="sonata-acc-content">
                {#if s.description}<p class="sonata-desc">{s.description}</p>{/if}
                {#if s.effects.length}
                  <ul class="sonata-effects">
                    {#each s.effects as eff}
                      <li><strong>{eff.key} pc:</strong> {eff.description}</li>
                    {/each}
                  </ul>
                {/if}
              </div>
            </div>
          </Accordion>
        {/each}
      </div>
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

  .skill-desc { line-height: 1.6; color: var(--text-body); font-size: var(--fs-sm); }
  .sonata-list { display: flex; flex-direction: column; gap: var(--sp-3); }
  .sonata-acc-body { display: flex; flex-direction: column; align-items: center; gap: var(--sp-3); }
  .sonata-acc-img { width: 96px; height: 96px; object-fit: contain; border-radius: var(--radius); background: var(--bg-elev); }
  .sonata-acc-content { max-width: 800px; margin: 0 auto; text-align: left; width: 100%; }
  .sonata-desc { font-size: var(--fs-xs); font-style: italic; color: var(--text-secondary); margin: 0; line-height: 1.5; }
  .sonata-effects { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--sp-1); font-size: var(--fs-sm); color: var(--text-body); }
  .sonata-effects strong { color: var(--accent); }
</style>
