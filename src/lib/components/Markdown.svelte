<script lang="ts">
  import { md } from '#lib/md';
  import BottomSheet from './BottomSheet.svelte';

  type SkillInfo = { type?: string; name?: string; description?: string };

  let {
    text,
    class: cls = '',
    skillsMap
  }: {
    text: string | null | undefined;
    class?: string;
    skillsMap?: Record<string, SkillInfo>;
  } = $props();

  const html = $derived(md(text, skillsMap));

  let sheetOpen = $state(false);
  let activeSkill = $state<{ name: string; info: SkillInfo } | null>(null);

  function onClick(e: MouseEvent) {
    if (!skillsMap) return;
    const btn = (e.target as HTMLElement)?.closest('[data-skill]') as HTMLElement | null;
    if (!btn) return;
    const name = btn.getAttribute('data-skill');
    if (!name) return;
    const info = skillsMap[name];
    if (!info) return;
    activeSkill = { name, info };
    sheetOpen = true;
  }
</script>

<div class="md {cls}" onclick={onClick}>{@html html}</div>

<BottomSheet bind:open={sheetOpen} title={activeSkill?.name || ''}>
  {#if activeSkill}
    {#if activeSkill.info.type}
      <p class="skill-type">{activeSkill.info.type}</p>
    {/if}
    {#if activeSkill.info.description}
      <p class="skill-desc">{activeSkill.info.description}</p>
    {:else}
      <p class="skill-desc">No description available.</p>
    {/if}
  {/if}
</BottomSheet>

<style>
  .skill-type {
    margin: 0 0 var(--sp-2) 0;
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    text-transform: uppercase;
    font-weight: var(--fw-bold);
    letter-spacing: 0.05em;
  }
  .skill-desc {
    margin: 0;
    line-height: 1.6;
    color: var(--text-body);
    font-size: var(--fs-sm);
  }
</style>
