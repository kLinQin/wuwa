<script lang="ts">
  import type { PageProps } from './$types';
  import PageGrid from '#lib/components/PageGrid.svelte';
  import DataCard from '#lib/components/DataCard.svelte';
  import InlineFilter from '#lib/components/InlineFilter.svelte';
  let { data }: PageProps = $props();

  let sn = $state('all');

  const filtered = $derived(data.items.filter((e: any) =>
    sn === 'all' || (e.sonatas && e.sonatas.includes(sn))
  ));
</script>

<PageGrid title="Echoes" items={filtered} countLabel="echoes">
  {#snippet filters()}
    <InlineFilter label="Sonata" bind:value={sn} options={data.sonatasConst.map(s => ({ value: s.id, label: s.name }))} />
  {/snippet}
  {#snippet children(e)}
    <DataCard item={e} kind="echo" href={`/echoes/${e.slug}`} />
  {/snippet}
</PageGrid>
