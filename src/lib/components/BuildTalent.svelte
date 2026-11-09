<script lang="ts">
  import DataTable from '#lib/components/DataTable.svelte';
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
<DataTable title="Priority List">
          {#each build.talentPriority.priority as p, i}
            <tr>
              <td class="k">{i + 1}.</td>
              <td class="num">{p}</td>
            </tr>
          {/each}
        </DataTable>
      
      </div>
{/if}

<style>



</style>
