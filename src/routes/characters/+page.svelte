<script lang="ts">
  import type { PageProps } from './$types';
  import PageGrid from '#lib/components/PageGrid.svelte';
  import DataCard from '#lib/components/DataCard.svelte';
  let { data }: PageProps = $props();
</script>

<PageGrid title="Characters" items={data.items} countLabel="characters">
  {#snippet children(c)}
    <DataCard item={c} kind="character" href={`/characters/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} />
  {/snippet}
</PageGrid>
