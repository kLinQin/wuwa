<script lang="ts">
  let { title, type, blocks }: {
    title: string;
    type?: string;
    blocks: any[];
  } = $props();
</script>

<div class="reader-page">
  <h2>{title}</h2>
  {#if type}
    <span class="badge">{type}</span>
  {/if}
  <div class="reader">
    {#each blocks as block}
      {#if block.type === 'text'}
        <p class="block-text">{block.value}</p>
      {:else if block.type === 'image'}
        <div class="block-img">
          <img src={block.value} alt="" loading="lazy" />
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .reader-page {
    padding: var(--sp-4);
  }
  .badge {
    font-size: var(--fs-xs);
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 2px 6px;
    border-radius: var(--radius);
    display: inline-block;
    margin-bottom: var(--sp-2);
  }
  .reader {
    margin-top: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }
  .block-img img {
    width: 100%;
    height: auto;
    border-radius: var(--radius);
  }
  .block-text {
    line-height: 1.6;
    white-space: pre-wrap;
  }
</style>
