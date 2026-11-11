<script lang="ts">
  import DataSection from './DataSection.svelte';

  let {
    title,
    text,
    sl = 'auto',
    tl = 'id',
    children
  }: {
    title: string;
    text: string;
    sl?: string;
    tl?: string;
    children?: any;
  } = $props();

  let translated: string | null = $state(null);
  let loading = $state(false);
  let error = $state<string | null>(null);

  async function toggle() {
    if (translated) { translated = null; error = null; return; }
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
      translated = j.text || '';
    } catch (e: any) {
      error = e?.message || 'Translate failed';
    } finally {
      loading = false;
    }
  }
</script>

<DataSection title={title}>
  {#snippet actions()}
    <button
      class="raised"
      onclick={toggle}
      disabled={loading}
      aria-pressed={!!translated}
      title={error || 'Translate'}
    >
      {loading ? 'Translating…' : translated ? 'Original' : 'Translate'}
    </button>
  {/snippet}
  {#if children}
    {@render children({ translated: translated ?? text })}
  {:else}
    <p class="desc">{translated ?? text}</p>
  {/if}
</DataSection>

<style>
  .desc { line-height: 1.6; color: var(--text-body); margin: 0; }
  .raised:disabled { opacity: 0.6; cursor: wait; }
</style>
