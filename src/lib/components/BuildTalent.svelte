<script lang="ts">
  let { build }: { build: any } = $props();
</script>

{#if build?.talentPriority}
  <div class="section">
    <h3>Talent Priority</h3>

    <div class="echo-card">
      <div class="stats-box">
        <h4 class="box-header">Priority List</h4>
        <table class="main-stats-table">
          <tbody>
            {#each build.talentPriority.priority as p, i}
              <tr>
                <td class="cost">{i + 1}.</td>
                <td class="stat">{p}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    {#if build.talentPriority.note}
      <p class="note-text">{build.talentPriority.note}</p>
    {/if}
  </div>
{/if}

<style>
  .section h3 {
    margin: 0 0 var(--sp-3) 0;
    font-size: var(--fs-md);
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }

  /* Card pembungkus mirip dengan Echo Setup */
  .echo-card {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .stats-box {
    display: flex;
    flex-direction: column;
    padding: 0 var(--sp-3) var(--sp-3) var(--sp-3);
    overflow: hidden;
  }

  .stats-box .box-header {
    margin: 0 calc(var(--sp-3) * -1) var(--sp-3) calc(var(--sp-3) * -1);
    padding: var(--sp-2) var(--sp-3);
    color: var(--accent);
    background: var(--bg-hover);
    border-bottom: 1px solid var(--border);
  }

  .main-stats-table {
    width: calc(100% + var(--sp-3) * 2);
    margin-left: calc(var(--sp-3) * -1);
    margin-right: calc(var(--sp-3) * -1);
    border-collapse: collapse;
    font-size: var(--fs-sm);
  }
  .main-stats-table th, .main-stats-table td {
    padding: 4px var(--sp-2);
    border-bottom: 1px solid var(--border);
    text-align: left;
    white-space: nowrap;
  }
  .main-stats-table tr:last-child td { border-bottom: none; }
  .main-stats-table .cost { font-family: var(--font-mono); width: 1%; white-space: nowrap; color: var(--text-muted); }
  .main-stats-table .stat { font-weight: var(--fw-medium); width: 99%; }

  .note-text { font-size: var(--fs-xs); color: var(--text-muted); margin-top: var(--sp-3); white-space: pre-line; font-style: italic; }
</style>
