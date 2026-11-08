<script lang="ts">
  let { build, onnote }: { build: any; onnote?: () => void } = $props();
</script>

{#if build?.talentPriority}
  <div class="section">
    <div class="header-row">
      <h3>Talent Priority</h3>
      {#if build?.talentPriority?.note}
        <button class="raised small-btn" onclick={onnote}>ℹ Note</button>
      {/if}
    </div>

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


  </div>
{/if}

<style>
  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }
  .header-row h3 {
    margin: 0;
    border-bottom: none;
    padding-bottom: 0;
  }
  .small-btn {
    padding: 2px 8px;
    font-size: var(--fs-xs);
    cursor: pointer;
  }
  .section h3 {
    font-size: var(--fs-md);
    color: var(--accent);
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
  .main-stats-table tr:last-child td { border-bottom: none; }
  .main-stats-table .cost { font-family: var(--font-mono); width: 1%; white-space: nowrap; color: var(--text-muted); }
  .main-stats-table .stat { font-weight: var(--fw-medium); width: 99%; }

</style>
