<script lang="ts">
  import type { Snippet } from 'svelte';
  import SkillCard from './SkillCard.svelte';

  let {
    icon,
    typeLabel,
    name,
    text,
    sl = 'auto',
    tl = 'id',
    children
  }: {
    icon?: string;
    typeLabel: string;
    name: string;
    text: string;
    sl?: string;
    tl?: string;
    children?: Snippet<[{ translated: boolean; text: string }]>;
  } = $props();

  let result = $state<string | null>(null);
  let loading = $state(false);
  let error = $state<string | null>(null);

  async function toggle() {
    if (result) { result = null; error = null; return; }
    if (!text) return;
    loading = true; error = null;
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sl, tl })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const j = await res.json();
      result = j.text || '';
    } catch (e: any) {
      error = e?.message || 'Translate failed';
    } finally {
      loading = false;
    }
  }
</script>

<SkillCard {icon} {typeLabel} {name}>
  {#snippet actions()}
    <button
      class="raised icon"
      onclick={toggle}
      disabled={loading}
      aria-pressed={!!result}
      title={error || 'Translate'}
      aria-label="Translate"
    >
      {loading ? '…' : result ? 'A' : '文'}
    </button>
  {/snippet}
  {#if children}
    {@render children({ translated: !!result, text: result ?? text })}
  {:else}
    <p>{result ?? text}</p>
  {/if}
</SkillCard>

<style>
  .raised.icon { padding: 2px 8px; font-size: var(--fs-xs); line-height: 1; }
  .raised:disabled { opacity: 0.6; cursor: wait; }
</style>
