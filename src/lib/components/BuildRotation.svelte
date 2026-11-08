<script lang="ts">
  let { build }: { build: any } = $props();
</script>

{#if build?.talentPriority}
  <div class="section">
    <h3>Talent Priority</h3>
    <ol class="priority-list">
      {#each build.talentPriority.priority as p}
        <li>{p}</li>
      {/each}
    </ol>
    {#if build.talentPriority.note}
      <p class="note-text">{build.talentPriority.note}</p>
    {/if}
  </div>
{/if}

{#if build?.rotations}
  <div class="section">
    <h3>Rotations</h3>
    {#each build.rotations as rot}
      <div class="rotation-card raised">
        <h4>{rot.title}</h4>
        <ol class="steps">
          {#each rot.steps as step}
            <li>{step}</li>
          {/each}
        </ol>
      </div>
    {/each}
  </div>
{/if}

<style>
  .section h3 {
    margin: 0 0 var(--sp-3) 0;
    font-size: var(--fs-md);
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }
  .rotation-card { padding: var(--sp-3); margin-bottom: var(--sp-3); }
  .rotation-card h4 { margin: 0 0 var(--sp-2) 0; font-size: var(--fs-sm); }
  .steps, .priority-list { margin: 0; padding-left: var(--sp-4); font-size: var(--fs-sm); line-height: 1.6; }
  .note-text { font-size: var(--fs-xs); color: var(--text-muted); margin-top: var(--sp-2); white-space: pre-line; font-style: italic; }
</style>
