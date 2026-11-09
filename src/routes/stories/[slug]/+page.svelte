<script lang="ts">
  import type { PageProps } from './$types';
  import DataSection from '#lib/components/DataSection.svelte';
  import DetailHeader from '#lib/components/DetailHeader.svelte';
  import ExpandableImage from '#lib/components/ExpandableImage.svelte';
  import StoryDialogue from '#lib/components/StoryDialogue.svelte';
  import StoryDetailNav from '#lib/components/StoryDetailNav.svelte';

  let { data }: PageProps = $props();
  const item = $derived(data.item);
  const chapters = $derived((item.Chapters || []).filter((c: any) => c.Dialogues && c.Dialogues.length));

  
  const speakers = $derived.by(() => {
    const set = new Set<string>();
    for (const c of chapters) {
      for (const d of c.Dialogues) {
        if (d.Speaker) set.add(d.Speaker);
      }
    }
    return Array.from(set).map(s => ({
      name: s,
      id: 'speaker-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }));
  });

  let activeId = $state('');

  
  $effect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeId = entry.target.id;
        }
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );
    const els = document.querySelectorAll('.speaker-anchor');
    els.forEach((s) => observer.observe(s));
    return () => els.forEach((s) => observer.unobserve(s));
  });

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<svelte:head><title>{item.Name} — WWI</title></svelte:head>

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

  <StoryDetailNav {speakers} {activeId} />

  {#if item.QuestDesc}
    <DataSection title="Overview">
      <p class="desc">{item.QuestDesc}</p>
    </DataSection>
  {/if}

  {#if chapters.length}
    <DataSection title="Story">
      <div class="chapters">
        {#each chapters as chap}
          {#each chap.Dialogues as d, i}
            {#if d.Speaker}
              {@const sid = 'speaker-' + d.Speaker.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              {#if i === 0 || chap.Dialogues[i - 1].Speaker !== d.Speaker}
                <div id={sid} class="speaker-anchor"></div>
              {/if}
            {/if}
            <StoryDialogue speaker={d.Speaker} text={d.PlotLineKey} />
          {/each}
        {/each}
      </div>
    </DataSection>
  {/if}
</div>

<style>
  .detail-page { padding: var(--content-pad); display: flex; flex-direction: column; gap: var(--sp-5); max-width: var(--max-content); margin: 0 auto; }

  .speaker-anchor { scroll-margin-top: calc(var(--nav-h) + 60px); }
  .desc { line-height: 1.6; color: var(--text-body); font-size: var(--fs-sm); }
  .chapters { display: flex; flex-direction: column; gap: var(--sp-3); }
</style>
