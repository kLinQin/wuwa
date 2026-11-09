<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    icon,
    typeLabel,
    name,
    children
  }: {
    icon?: string;
    typeLabel: string;
    name: string;
    children?: Snippet;
  } = $props();
</script>

<div class="skill-card surface">
  <div class="header">
    {#if icon}
      <img src={icon} alt={name} class="icon" onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')} />
    {/if}
    <div class="title">
      <span class="type">{typeLabel}</span>
      <span class="name">{name}</span>
    </div>
  </div>

  <div class="body">
    {@render children?.()}
  </div>
</div>

<style>
  .skill-card {
    padding: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    justify-content: flex-start;
    height: 100%;
  }

  .header {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
    flex-shrink: 0;
  }

  .icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    background: var(--bg-elev);
    border-radius: var(--radius);
    padding: 2px;
    border: 1px solid var(--border);
  }

  .title {
    display: flex;
    flex-direction: column;
  }

  .type {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    text-transform: uppercase;
  }

  .name {
    font-size: var(--fs-md);
    font-weight: var(--fw-medium);
    color: var(--accent);
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }
</style>
