<script lang="ts">
  let { info }: { info: Record<string, any> } = $props();

  const fields = ['Birthday', 'Sex', 'Country', 'Influence', 'TalentName', 'CVNameCn', 'CVNameJp', 'CVNameKo', 'CVNameEn'];
</script>

<div class="profile-info">
  <div class="grid-stats">
    {#each fields as f}
      {#if info[f]}
        <div class="stat-box">
          <span class="label">{f.replace(/([A-Z])/g, ' $1').trim()}</span>
          <span class="value">{info[f].Content}</span>
        </div>
      {/if}
    {/each}
  </div>

  {#if info.Info}
    <div class="bio-section">
      <h3>Background</h3>
      <div class="bio-text">{@html info.Info.Content}</div>
    </div>
  {/if}

  {#if info.TalentDoc}
    <details class="doc-section">
      <summary class="raised">{info.TalentDoc.Title || 'Resonance Evaluation Report'}</summary>
      <div class="doc-content">{@html info.TalentDoc.Content}</div>
    </details>
  {/if}

  {#if info.TalentCertification}
    <details class="doc-section">
      <summary class="raised">{info.TalentCertification.Title || 'Overclock Diagnostic Report'}</summary>
      <div class="doc-content">{@html info.TalentCertification.Content}</div>
    </details>
  {/if}
</div>

<style>
  .profile-info { display: flex; flex-direction: column; gap: var(--sp-4); }
  .grid-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--sp-2); }
  .stat-box { background: var(--bg-elev); border: 1px solid var(--border); padding: var(--sp-2); border-radius: var(--radius); }
  .label { display: block; font-size: var(--fs-xs); color: var(--text-muted); margin-bottom: 2px; }
  .value { font-size: var(--fs-sm); font-weight: var(--fw-medium); }

  .bio-section h3 { margin: 0 0 var(--sp-2) 0; font-size: var(--fs-md); }
  .bio-text { font-size: var(--sm); line-height: 1.6; color: var(--text-muted); }

  .doc-section { margin-top: var(--sp-2); }
  .doc-section summary { cursor: pointer; padding: var(--sp-2) var(--sp-3); margin-bottom: var(--sp-2); }
  .doc-content { padding: var(--sp-3); background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius); font-size: var(--fs-sm); line-height: 1.6; white-space: pre-wrap; }
</style>
