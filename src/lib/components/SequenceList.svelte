<script lang="ts">
  import SkillCard from './SkillCard.svelte';

  let { sequences, charSlug }: { sequences: any[]; charSlug: string } = $props();

  function getSeqIcon(stage: string) {
    const num = stage.replace(/[^0-9]/g, '');
    return `/icons/sequences/${charSlug}/${charSlug}-${num}.webp`;
  }
</script>

<div class="seq-list">
  <div class="grid-2">
    {#each sequences as s}
      <SkillCard icon={getSeqIcon(s.stage)} typeLabel={s.stage} name={s.name}>
        <ul class="effects">
          {#each s.effects || [] as eff}
            <li>
              {#if eff.isTitleVisible && eff.title}<strong>{eff.title}</strong>{/if}
              <span>{eff.description}</span>
            </li>
          {/each}
        </ul>
      </SkillCard>
    {/each}
  </div>
</div>

<style>
  .seq-list { display: flex; flex-direction: column; gap: var(--sp-3); }
  .effects { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--sp-2); font-size: var(--fs-sm); }
  .effects li { background: var(--bg-hover); padding: var(--sp-2); border-radius: var(--radius); line-height: 1.5; }
  .effects strong { display: block; margin-bottom: 2px; color: var(--text-body); }
</style>
