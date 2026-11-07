<script lang="ts">
  let { sequences }: { sequences: any[] } = $props();
</script>

<div class="seq-list">
  {#each sequences as s}
    <div class="seq-item raised">
      <h4>{s.stage}: {s.name}</h4>
      <ul class="effects">
        {#each s.effects || [] as eff}
          <li>
            {#if eff.isTitleVisible && eff.title}<strong>{eff.title}</strong>{/if}
            <span>{eff.description}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>

<style>
  .seq-list { display: flex; flex-direction: column; gap: var(--sp-3); }
  .seq-item { padding: var(--sp-3); }
  .seq-item h4 { margin: 0 0 var(--sp-2) 0; font-size: var(--fs-md); color: var(--accent); }
  .effects { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--sp-1); font-size: var(--fs-sm); }
  .effects li { background: var(--bg-hover); padding: var(--sp-2); border-radius: var(--radius); }
  .effects strong { display: block; margin-bottom: 2px; color: var(--text); }
</style>
