<script lang="ts">
  let { title, children, actions }: { title: string; children?: any; actions?: any } = $props();
</script>

<section class="data-section">
  <div class="section-head">
    <h2>{title}</h2>
    {#if actions}<div class="section-actions">{@render actions()}</div>{/if}
  </div>
  <div class="section-content">
    {@render children?.()}
  </div>
</section>

<style>
  .data-section {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--sp-4);
    margin-bottom: var(--sp-4);
  }
  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
  }
  .data-section h2 {
    font-size: var(--fs-lg);
    margin: 0;
    color: var(--text-body);
    border-left: 4px solid var(--accent);
    padding-left: var(--sp-2);
  }
  .section-actions { display: flex; align-items: center; gap: var(--sp-1); }
  .section-content {
    font-size: var(--fs-sm);
    line-height: 1.6;
    color: var(--text-secondary);
  }
</style>
