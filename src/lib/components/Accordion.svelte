<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title = '(untitled)',
    defaultOpen = false,
    image = '',
    children
  }: {
    title?: string;
    defaultOpen?: boolean;
    image?: string;
    children?: Snippet;
  } = $props();

  let open = $state(defaultOpen);
</script>

<div class="surface accordion">
  <button class="accordion-head" onclick={() => open = !open} aria-expanded={open}>
    <span class="accordion-title">{title}</span>
    <svg class="chevron" width="16" height="16"><use href={open ? '#chevron-up' : '#chevron-down'} /></svg>
  </button>
  {#if open}
    <div class="accordion-body" class:has-img={!!image}>
      {#if image}
        <div class="accordion-img-wrap">
          <img src={image} alt={title} class="accordion-img" />
        </div>
      {/if}
      <div class="accordion-text">
        {@render children?.()}
      </div>
    </div>
  {/if}
</div>

<style>
  .accordion {
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }
  .accordion-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    padding: var(--sp-2) var(--sp-3);
    color: var(--text-body);
    font-family: var(--font-ui);
    font-size: var(--fs-sm);
    cursor: pointer;
    text-align: left;
  }
  .accordion-head:hover { background: var(--bg-hover); }
  .accordion-title { font-weight: var(--fw-medium); }
  .chevron {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    transition: transform 0.15s;
  }
  .accordion-body {
    padding: 0 var(--sp-3) var(--sp-3);
  }
  .accordion-body.has-img {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-3);
  }
  .accordion-img-wrap {
    display: flex;
    justify-content: center;
  }
  .accordion-img {
    width: 96px;
    height: 96px;
    object-fit: contain;
    border-radius: var(--radius);
    background: var(--bg-elev);
  }
  .accordion-text {
    white-space: pre-line;
    line-height: 1.6;
    font-size: var(--fs-sm);
    color: var(--text-body);
  }
  @media (min-width: 768px) {
    .accordion-body.has-img {
      grid-template-columns: 96px 1fr;
    }
    .accordion-img-wrap {
      justify-content: flex-start;
    }
  }
</style>
