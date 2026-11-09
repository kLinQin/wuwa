<script lang="ts">
  import DataTable from '#lib/components/DataTable.svelte';
  let { stats }: { stats: any } = $props();
</script>

<div class="section">
  <div class="section-head">
    <h3>Recommended Stats</h3>
  </div>
<DataTable title="Stat Priority">
    {#each Object.entries(stats) as [k, v]}
      <tr>
        <td class="k">{k}</td>
        <td class="num">{v}</td>
      </tr>
    {/each}
  </DataTable>
    
</div>
