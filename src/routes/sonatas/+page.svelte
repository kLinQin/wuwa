<script lang="ts">
  import type { PageProps } from './$types';
  import PageGrid from '#lib/components/PageGrid.svelte';
  import DataCard from '#lib/components/DataCard.svelte';
  let { data }: PageProps = $props();
</script>

<PageGrid title="Sonatas" items={data.items} countLabel="sonatas">
  {#snippet children(s)}
    <DataCard item={s} kind="sonata" href={`/sonatas/${s.slug}`} />
  {/snippet}
</PageGrid>
