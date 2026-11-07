<script lang="ts">
  let { materials, map }: { materials: any; map?: Record<number, any> } = $props();
  
  function getMat(id: number) {
    return map?.[id] || { name: 'ID:' + id, image: '' };
  }
</script>

<div class="mat-list">
  {#if materials.ascension}
    <div class="mat-group">
      <h3>Ascension Costs</h3>
      <table>
        <thead><tr><th>Lvl</th><th>Items</th></tr></thead>
        <tbody>
          {#each materials.ascension as step, i}
            <tr>
              <td>{step.level || (i * 10 + 1)}+</td>
              <td>
                <div class="items">
                  {#each step.cost || [] as c}
                    {@const m = getMat(c.item)}
                    <span class="item-chip" title={m.description}>
                      {#if m.image}<img src={m.image} alt="" class="mini-icon" />{/if}
                      {m.name.replace(/_/g, ' ')} x{c.amount.toLocaleString()}
                    </span>
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
  
  {#if materials.skills?.totalCosts}
    <div class="mat-group">
      <h3>Skill Max Costs</h3>
      <div class="items total-costs">
        {#each materials.skills.totalCosts as c}
          {@const m = getMat(c.item)}
          <span class="item-chip" title={m.description}>
             {#if m.image}<img src={m.image} alt="" class="mini-icon" />{/if}
             {m.name.replace(/_/g, ' ')} x{c.amount.toLocaleString()}
          </span>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .mat-list { width: 100%; }
  .mat-group { margin-bottom: var(--sp-4); }
  table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); }
  th, td { text-align: left; padding: var(--sp-2); border-bottom: 1px solid var(--border); vertical-align: top; }
  th { color: var(--text-muted); font-weight: var(--fw-medium); }
  .items { display: flex; flex-wrap: wrap; gap: var(--sp-1); }
  .item-chip { 
    background: var(--bg-elev); 
    border: 1px solid var(--border); 
    padding: 2px 6px; 
    border-radius: var(--radius); 
    font-family: var(--font-mono); 
    font-size: var(--fs-xs); 
    display: inline-flex; 
    align-items: center; 
    gap: 4px;
  }
  .mini-icon { width: 16px; height: 16px; object-fit: contain; }
</style>