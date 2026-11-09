<script lang="ts">
  import type { PageProps } from './$types';
  import Accordion from '#lib/components/Accordion.svelte';

  let { data }: PageProps = $props();
</script>

<svelte:head><title>Stories — WuWa DB</title></svelte:head>

<div class="page">
  <h1>Stories</h1>

  {#each data.groups as group}
    <section class="group">
      <h2>{group.name}</h2>
      {#each group.chapters as chap}
        {#if chap.stories.length}
          <Accordion title={chap.group || '(ungrouped)'}>
            <div class="story-list">
              {#each chap.stories as s}
                <a href={`/stories/${s.id}`} class="story-row">
                  {#if s.areaIcon}
                    <img src={s.areaIcon} alt={s.name} class="story-icon" />
                  {/if}
                  <div class="story-info">
                    <span class="story-name">{s.name}</span>
                    {#if s.questDesc}<span class="story-desc">{s.questDesc}</span>{/if}
                  </div>
                </a>
              {/each}
            </div>
          </Accordion>
        {/if}
      {/each}
    </section>
  {/each}
</div>

<style>
  .page { padding: var(--content-pad); display: flex; flex-direction: column; gap: var(--sp-5); max-width: var(--max-content); margin: 0 auto; }
  h1 { font-size: var(--fs-xl); margin: 0; }
  .group { display: flex; flex-direction: column; gap: var(--sp-3); }
  h2 { font-size: var(--fs-lg); color: var(--accent); margin: 0; }
  .story-list { display: flex; flex-direction: column; gap: var(--sp-2); }
  .story-row { display: flex; align-items: center; gap: var(--sp-2); padding: var(--sp-2); background: var(--bg-hover); border-radius: var(--radius); text-decoration: none; color: var(--text-body); }
  .story-row:hover { background: var(--bg-elev); }
  .story-icon { width: 32px; height: 32px; object-fit: contain; flex-shrink: 0; }
  .story-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .story-name { font-size: var(--fs-sm); font-weight: var(--fw-medium); }
  .story-desc { font-size: var(--fs-xs); color: var(--text-secondary); line-height: 1.4; }
</style>
