<script lang="ts">
  import type { PageProps } from './$types';
  import PageGrid from '#lib/components/PageGrid.svelte';
  import DataCard from '#lib/components/DataCard.svelte';
  import InlineFilter from '#lib/components/InlineFilter.svelte';
  let { data }: PageProps = $props();

  let wp = $state('all');
  let rr = $state('all');

  const filtered = $derived(data.items.filter((w: any) =>
    (wp === 'all' || w.weaponType === wp) &&
    (rr === 'all' || w.rarity === rr)
  ));
</script>

<PageGrid title="Weapons" items={filtered} countLabel="weapons">
  {#snippet filters()}
    <InlineFilter label="Type" bind:value={wp} options={data.weaponsConst.map((w: any) => ({ value: w.id, label: w.name }))} />
    <InlineFilter label="Rarity" bind:value={rr} options={[{value: 5, label: '5 Star'}, {value: 4, label: '4 Star'}, {value: 3, label: '3 Star'}, {value: 2, label: '2 Star'}, {value: 1, label: '1 Star'}]} />
  {/snippet}
  {#snippet children(w)}
    <DataCard item={w} kind="weapon" href={`/weapons/${w.slug}`} />
  {/snippet}
</PageGrid>
