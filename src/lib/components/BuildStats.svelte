<script lang="ts">
  let { stats }: { stats: any } = $props();
</script>

<div class="section">
  <h3>Recommended Stats</h3>
  <table class="stats-table">
    <tbody>
      {#each Object.entries(stats) as [k, v]}
        <tr>
          <td class="k">{k}</td>
          <td class="v">{v}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .section h3 {
    margin: 0 0 var(--sp-3) 0;
    font-size: var(--fs-md);
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }
  .stats-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); margin-top: var(--sp-2); }
  .stats-table td { padding: var(--sp-2); border-bottom: 1px solid var(--border); }
  .stats-table tr:last-child td { border-bottom: none; }
  .stats-table .k { color: var(--text-muted); }
  .stats-table .v { text-align: right; font-weight: var(--fw-medium); }
</style>
