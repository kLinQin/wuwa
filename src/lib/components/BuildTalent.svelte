<script lang="ts">
  let { build, onnote }: { build: any; onnote?: () => void } = $props();
</script>

{#if build?.talentPriority}
  <div class="section">
    <div class="section-head">
      <h3>Talent Priority</h3>
      {#if build?.talentPriority?.note}
        <button class="raised small-btn" onclick={onnote}>ℹ Note</button>
      {/if}
    </div>

    <div class="echo-card">
      <div class="stats-box">
        <h4 class="box-header box-header-inset">Priority List</h4>
        <table class="stat-table">
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



</style>
