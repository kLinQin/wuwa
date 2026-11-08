<script lang="ts">
  import type { PageProps } from './$types';
  import PageGrid from '#lib/components/PageGrid.svelte';
  import DataCard from '#lib/components/DataCard.svelte';
  let { data }: PageProps = $props();
</script>

<PageGrid title="Weapons" items={data.items} countLabel="weapons">
  {#snippet children(w)}
    <DataCard item={w} kind="weapon" href={`/weapons/${w.slug}`} />
  {/snippet}
</PageGrid>
