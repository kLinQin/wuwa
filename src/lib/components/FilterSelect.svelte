<script lang="ts">
  let { label, options, bind:value }: {
    label: string;
    options: { value: any; label: string }[];
    value: any;
  } = $props();
</script>

<label class="filter-select">
  <span>{label}</span>
  <select bind:value>
    <option value="all">All</option>
    {#each options as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
</label>

<style>
  .filter-select {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }
  select {
    padding: 2px 6px;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    color: var(--text-body);
    border-radius: var(--radius);
    outline: none;
  }
</style>
