<script lang="ts">
  let { sequences, charSlug }: { sequences: any[]; charSlug: string } = $props();

  function getSeqIcon(stage: string) {
    // stage biasanya "S1", "S2", dst. Kita ambil angkanya saja.
    const num = stage.replace(/[^0-9]/g, '');
    return `/icons/sequences/${charSlug}/${charSlug}-${num}.webp`;
  }
</script>

<div class="seq-list">
  <div class="grid-2">
    {#each sequences as s}
      <div class="seq-card raised">
        <div class="seq-header">
          <img
            src={getSeqIcon(s.stage)}
            alt={s.name}
            class="seq-icon"
            onerror={(e) => e.currentTarget.style.display='none'}
          />
          <div class="seq-title">
            <span class="seq-stage">{s.stage}</span>
            <span class="seq-name">{s.name}</span>
          </div>
        </div>

        <ul class="effects">
          {#each s.effects || [] as eff}
            <li>
              {#if eff.isTitleVisible && eff.title}<strong>{eff.title}</strong>{/if}
              <span>{eff.description}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</div>

<style>
  .seq-list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }


  .seq-card {
    padding: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    justify-content: flex-start;
    height: 100%;
  }

  .seq-header {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
    flex-shrink: 0;
  }

  .seq-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    background: var(--bg-elev);
    border-radius: var(--radius);
    padding: 2px;
    border: 1px solid var(--border);
  }

  .seq-title {
    display: flex;
    flex-direction: column;
  }

  .seq-stage {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    text-transform: uppercase;
  }

  .seq-name {
    font-size: var(--fs-md);
    font-weight: var(--fw-medium);
    color: var(--accent);
  }

  .effects {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    font-size: var(--fs-sm);
  }

  .effects li {
    background: var(--bg-hover);
    padding: var(--sp-2);
    border-radius: var(--radius);
    line-height: 1.5;
  }

  .effects strong {
    display: block;
    margin-bottom: 2px;
    color: var(--text-body);
  }
</style>
