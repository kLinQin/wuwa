<script lang="ts">
  import type { PageProps } from './$types';
  import PageGrid from '#lib/components/PageGrid.svelte';
  import DataCard from '#lib/components/DataCard.svelte';
  let { data }: PageProps = $props();
</script>

<PageGrid title="Echoes" items={data.items} countLabel="echoes">
  {#snippet children(e)}
    <DataCard item={e} kind="echo" href={`/echoes/${e.slug}`} />
  {/snippet}
</PageGrid>
