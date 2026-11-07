<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
  let tab = $state<'quests'|'glossary'>('quests');
  let selected = $state<any>(null);
  let q = $state('');

  const filtered = $derived(
    data.quests.filter((x: any) =>
      x.title.toLowerCase().includes(q.toLowerCase()) ||
      x.type.toLowerCase().includes(q.toLowerCase())
    )
  );
  const filteredTerms = $derived(
    data.terms.filter((t: any) =>
      t.name.toLowerCase().includes(q.toLowerCase())
    )
  );
</script>

<svelte:head><title>Quests — WuWa DB</title></svelte:head>
<h1>Quests</h1>

{#if selected}
  <button class="raised" onclick={() => selected = null}>← Back</button>
  <h2>{selected.title}</h2>
  <span class="badge">{selected.type}</span>
  <div class="reader">
    {#each selected.blocks as block}
      {#if block.type === 'text'}
        <p class="block-text">{block.value}</p>
      {:else if block.type === 'image'}
        <div class="block-img">
          <img src={block.value} alt="" loading="lazy" />
        </div>
      {/if}
    {/each}
  </div>
{:else}
  <div class="tabs">
    <button class="raised" aria-pressed={tab==='quests'} onclick={() => tab='quests'}>Quests ({data.quests.length})</button>
    <button class="raised" aria-pressed={tab==='glossary'} onclick={() => tab='glossary'}>Glossary ({data.terms.length})</button>
  </div>

  <div class="toolbar">
    <input placeholder="Search..." bind:value={q} />
  </div>

  {#if tab === 'quests'}
    <p class="count">{filtered.length} quests</p>
    <div class="list">
      {#each filtered as quest}
        <button class="row quest-row" onclick={() => selected = quest}>
          <span class="badge">{quest.type}</span>
          <span class="name">{quest.title}</span>
        </button>
      {/each}
    </div>
  {:else}
    <p class="count">{filteredTerms.length} terms</p>
    <div class="list">
      {#each filteredTerms as t}
        <div class="row glossary-row">
          {#if t.image}
            <img class="glossary-img" src={t.image} alt={t.name} loading="lazy" />
          {/if}
          <div class="glossary-body">
            <div class="name">{t.name}</div>
            <div class="desc">{t.description}</div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/if}
