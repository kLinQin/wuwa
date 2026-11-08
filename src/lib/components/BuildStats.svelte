<script lang="ts">
  let { stats }: { stats: any } = $props();
</script>

<div class="section">
  <h3>Recommended Stats</h3>
  <table class="stat-table stats-table">
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
  .stats-table { margin-top: var(--sp-2); }
  .stats-table td { padding: var(--sp-2); }
  .stats-table .k { color: var(--text-secondary); }
  .stats-table .v { text-align: right; font-weight: var(--fw-medium); }
</style>
