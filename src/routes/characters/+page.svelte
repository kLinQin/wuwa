<script lang="ts">
  import type { PageProps } from './$types';
  import PageGrid from '#lib/components/PageGrid.svelte';
  import DataCard from '#lib/components/DataCard.svelte';
  import InlineFilter from '#lib/components/InlineFilter.svelte';
  let { data }: PageProps = $props();

  let el = $state('all');
  let wp = $state('all');
  let rr = $state('all');

  const filtered = $derived(data.items.filter((c: any) =>
    (el === 'all' || c.element === el) &&
    (wp === 'all' || c.weapon === wp) &&
    (rr === 'all' || c.rarity === rr)
  ));
</script>

<PageGrid title="Characters" items={filtered} countLabel="characters">
  {#snippet filters()}
    <InlineFilter label="Element" bind:value={el} options={data.elements.map((e: any) => ({ value: e.id, label: e.name }))} />
    <InlineFilter label="Weapon" bind:value={wp} options={data.weaponsConst.map((w: any) => ({ value: w.id, label: w.name }))} />
    <InlineFilter label="Rarity" bind:value={rr} options={[{value: 5, label: '5 Star'}, {value: 4, label: '4 Star'}]} />
  {/snippet}
  {#snippet children(c)}
    <DataCard item={c} kind="character" href={`/characters/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} />
  {/snippet}
</PageGrid>
