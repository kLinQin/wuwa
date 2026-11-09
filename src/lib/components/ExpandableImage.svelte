<script lang="ts">
  let { src, alt = '', maxHeight = 200 }: { src: string; alt?: string; maxHeight?: number } = $props();
  let expanded = $state(false);
</script>

<div class="expandable-img-wrap">
  <img {src} {alt} class="expandable-img" style:max-height={expanded ? 'none' : maxHeight + 'px'} />
  <button class="raised expand-btn" onclick={() => expanded = !expanded}>
    {expanded ? 'Collapse' : 'Expand'}
  </button>
</div>

<style>
  .expandable-img-wrap {
    position: relative;
    width: 100%;
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--border);
    background: var(--bg-elev);
    display: flex;
    flex-direction: column;
  }
  .expandable-img {
    width: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
    transition: max-height 0.3s ease;
  }
  .expand-btn {
    position: absolute;
    bottom: var(--sp-2);
    right: var(--sp-2);
    font-size: var(--fs-xs);
    padding: 4px 8px;
    z-index: 10;
  }
</style>
