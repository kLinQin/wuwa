<script lang="ts">
  const elementNames: Record<number, string> = {
    1: 'Glacio', 2: 'Fusion', 3: 'Electro', 4: 'Aero', 5: 'Spectro', 6: 'Havoc'
  };
  const weaponNames: Record<number, string> = {
    1: 'Broadblade', 2: 'Sword', 3: 'Pistol', 4: 'Gauntlet', 5: 'Rectifier'
  };

  let {
    item,
    kind = 'character',
    href
  }: {
    item: any;
    kind?: 'character' | 'weapon' | 'sonata' | 'echo';
    href?: string;
  } = $props();

  const elName = $derived(
    kind === 'character' ? (elementNames[item.element as number] ?? '') : ''
  );
  const wpName = $derived(
    kind === 'character' ? (weaponNames[item.weapon as number] ?? '')
      : kind === 'weapon' ? (weaponNames[item.weaponType as number] ?? '')
      : ''
  );
  const imgSrc = $derived(kind === 'character' ? item.icon : item.image);
  const starStr = $derived(item.rarity ? '★'.repeat(item.rarity) : '');

  // meta row only rendered when there is content
  const hasMeta = $derived(
    kind === 'character' ? !!item.class
      : kind === 'weapon' ? !!(wpName || item.subStat)
      : kind === 'sonata' ? !!item.color
      : kind === 'echo' ? item.cost != null
      : false
  );
</script>

<svelte:element this={href ? 'a' : 'div'} class="card" href={href ?? undefined}>
  {#if imgSrc}
    <div class="card-img">
      <img src={imgSrc} alt={item.name} loading="lazy" />
      {#if starStr}
        <span class="rarity">{starStr}</span>
      {/if}
      {#if elName}
        <div class="element-wrap">
          <img src={`/icons/elements/${elName.toLowerCase()}.webp`} alt={elName} />
          <span>{elName}</span>
        </div>
      {/if}
      {#if wpName}
        <div class="weapon-wrap">
          <img src={`/icons/category/${wpName.toLowerCase().replace(/s$/,'')}.webp`} alt={wpName} />
          <span>{wpName}</span>
        </div>
      {/if}
    </div>
  {/if}
  <div class="name">{item.name}</div>
  {#if hasMeta}
  <div class="meta">
    {#if kind === 'character'}
      {#if item.class}
        <span class="badge">{item.class}</span>
      {/if}
    {:else if kind === 'weapon'}
      {#if item.subStat}
        <span class="badge">{item.subStat}</span>
      {/if}
    {:else if kind === 'sonata'}
      {#if item.color}
        <span class="badge" style:color={item.color}>{item.color}</span>
      {/if}
    {:else if kind === 'echo'}
      {#if item.cost != null}
        <span class="badge">Cost {item.cost}</span>
      {/if}
    {/if}
  </div>
  {/if}
</svelte:element>
