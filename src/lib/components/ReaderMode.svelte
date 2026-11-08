<script lang="ts">
  let { title, type, blocks, onback }: {
    title: string;
    type?: string;
    blocks: any[];
    onback: () => void;
  } = $props();
</script>

<div class="reader-page">
  <button class="raised" onclick={onback}>← Back</button>
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
    width: 100%;
    margin: 0 calc(var(--content-pad) * -1);
    max-width: calc(100% + var(--content-pad) * 2);
  }

  .badge {
    font-size: var(--fs-xs);
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 2px 6px;
    border-radius: var(--radius);
    align-self: flex-start;
    margin-bottom: var(--sp-1);
    display: inline-block;
  }

  .reader {
    margin-top: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .block-img {
    width: 100%;
    border-radius: var(--radius);
    overflow: hidden;
  }

  .block-img img {
    width: 100%;
    height: auto;
    display: block;
  }

  .block-text {
    line-height: 1.6;
    white-space: pre-wrap;
  }
</style>
