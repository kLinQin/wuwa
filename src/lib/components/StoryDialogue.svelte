<script lang="ts">
  let { speaker, text }: { speaker?: string; text: string } = $props();
</script>

<div class="dialogue">
  {#if speaker}
    <div class="speaker-row">
      <span class="speaker">{speaker}</span>
    </div>
  {/if}
  <p class="line">{text}</p>
</div>

<style>
  .dialogue {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--sp-3);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: var(--sp-2);
  }
  .speaker-row {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
  }
  .speaker {
    font-size: var(--fs-sm);
    font-weight: var(--fw-bold);
    color: var(--accent);
  }
  .line {
    margin: 0;
    font-size: var(--fs-sm);
    line-height: 1.6;
    color: var(--text-body);
  }
</style>
