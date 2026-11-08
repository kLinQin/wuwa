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
    justify-content: center;
    gap: var(--sp-2);
    margin: 0 0 var(--sp-2) 0; /* Jarak bawah pas (8px) */
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar {
    display: none;
  }
</style>
