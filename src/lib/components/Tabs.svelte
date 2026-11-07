<script lang="ts">
  let { tabs, activeTab, onchange }: { tabs: { id: string; label: string }[]; activeTab: string; onchange: (id: string) => void } = $props();
</script>

<div class="tabs">
  {#each tabs as tab}
    <button
      class="raised"
      aria-pressed={activeTab === tab.id}
      onclick={() => onchange(tab.id)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    gap: var(--sp-2);
    margin-bottom: var(--sp-4);
    overflow-x: auto;
  }
</style>
