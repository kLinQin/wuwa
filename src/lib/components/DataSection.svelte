<script lang="ts">
  let { title, children }: { title: string; children?: any } = $props();
</script>

<section class="data-section">
  <h2>{title}</h2>
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
  .data-section h2 {
    font-size: var(--fs-lg);
    margin: 0 0 var(--sp-3) 0;
    color: var(--text-body);
    border-left: 4px solid var(--accent);
    padding-left: var(--sp-2);
  }
  .section-content {
    font-size: var(--fs-sm);
    line-height: 1.6;
    color: var(--text-secondary);
  }
</style>
