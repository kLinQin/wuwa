<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
  let tab = $state<'quests'|'glossary'>('quests');
</script>

<svelte:head><title>Quests — WuWa DB</title></svelte:head>
<h1>Quests</h1>

<div class="tabs">
  <button class="raised" aria-pressed={tab==='quests'} onclick={() => tab='quests'}>Quests ({data.quests.length})</button>
  <button class="raised" aria-pressed={tab==='glossary'} onclick={() => tab='glossary'}>Glossary ({data.terms.length})</button>
</div>

{#if tab === 'quests'}
  <div class="list">
    {#each data.quests as q}
      <div class="row">
        <span class="badge">{q.type}</span>
        <span class="name">{q.title}</span>
      </div>
    {/each}
  </div>
{:else}
  <div class="list">
    {#each data.terms as t}
      <div class="row">
        <div class="name">{t.name}</div>
        <div class="desc">{t.description}</div>
      </div>
    {/each}
  </div>
{/if}
