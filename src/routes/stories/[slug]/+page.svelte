<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '#lib/components/DataSection.svelte';
  import DetailHeader from '#lib/components/DetailHeader.svelte';
  import ExpandableImage from '#lib/components/ExpandableImage.svelte';

  let { data }: PageProps = $props();
  const item = $derived(data.item);
  const chapters = $derived((item.Chapters || []).filter((c: any) => c.Dialogues && c.Dialogues.length));
</script>

<svelte:head><title>{item.Name} — WuWa DB</title></svelte:head>

<div class="detail-page">
  {#if item.MaleTexture || item.FemaleTexture}
    <ExpandableImage src={item.MaleTexture || item.FemaleTexture} alt={item.Name} maxHeight={240} />
  {/if}

  <DetailHeader
    hideDetails={true}
    title={item.Name}

    badges={[
      ...(item.Description ? [{ label: item.Description, prefix: 'Type' }] : [])
    ]}
  />

  {#if item.QuestDesc}
    <DataSection title="Overview">
      <p class="desc">{item.QuestDesc}</p>
    </DataSection>
  {/if}

  {#if chapters.length}
    <DataSection title="Story">
      <div class="chapters">
        {#each chapters as chap, ci}
          {#each chap.Dialogues as d}
            <div class="dialogue">
              {#if d.Speaker}
                <span class="speaker">{d.Speaker}</span>
              {/if}
              <p class="line">{d.PlotLineKey}</p>
            </div>
          {/each}
        {/each}
      </div>
    </DataSection>
  {/if}
</div>

<style>
  .detail-page { padding: var(--content-pad); display: flex; flex-direction: column; gap: var(--sp-5); max-width: var(--max-content); margin: 0 auto; }



  .desc { line-height: 1.6; color: var(--text-body); font-size: var(--fs-sm); }
  .chapters { display: flex; flex-direction: column; gap: var(--sp-3); }
  .dialogue { display: flex; flex-direction: column; gap: 2px; padding: var(--sp-2) var(--sp-3); background: var(--bg-hover); border-radius: var(--radius); }
  .speaker { font-size: var(--fs-xs); color: var(--accent); font-weight: var(--fw-medium); }
  .line { margin: 0; font-size: var(--fs-sm); line-height: 1.6; color: var(--text-body); }
</style>
