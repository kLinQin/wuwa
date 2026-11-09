<script lang="ts">
  import BottomSheet from './BottomSheet.svelte';
  let { title, image, badges = [], roleDetails = [], hideDetails = false, color, imageSize = 140 }: {
    title: string;
    image: string;
    badges?: { label: string; type?: 'accent' | 'star' | 'muted'; prefix?: string; value?: string }[];
    roleDetails?: { name: string; desc: string; icon: string; color: string }[];
    hideDetails?: boolean;
    imageSize?: number;
    meta?: string;
    color?: string;
  } = $props();

  let isExpanded = $state(false);
  let sheetOpen = $state(false);
</script>

<header class="detail-header" style="--sonata-color: {color || 'var(--border)'}">
  <div class="title-row" style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="title">{title}</h1>
    {#if !hideDetails}
      <button class="raised" type="button" onclick={() => sheetOpen = true} aria-label="Details">Details</button>
    {/if}
    {#if badges.some(b => b.prefix === 'Version')}
      {@const ver = badges.find(b => b.prefix === 'Version')}
      <span class="badge version-badge">{ver?.label}</span>
    {/if}
  </div>

  <div class="content-row">
    {#if image}
      <div class="img-wrapper">
        <div class="img-container" style="width:{imageSize}px;height:{imageSize}px;">
          <img src={image} alt={title} class="header-img" width={imageSize} height={imageSize} />
          {#if badges.some(b => b.type === 'star')}
            {@const star = badges.find(b => b.type === 'star')}
            <span class="stars-below">{star?.label}</span>
          {/if}
        </div>
      </div>
    {/if}

    <div class="header-info">
      {#if badges.length > 0}
        <div class="tags-top">
          {#each badges.filter(b => b.type !== 'star' && !['Role','Sonata','Version','Sex','Influence','CV EN','CV JP','CV CN','CV KO'].includes(b.prefix || '')) as b}
            <div class="row-group">
              {#if b.prefix}<span class="badge-prefix">{b.prefix}</span>{/if}
              <span class="badge" class:accent={b.type === 'accent'} class:muted={b.type === 'muted'}>
                {b.label}{#if b.value} <span style="color:var(--accent); margin-left:4px;">{b.value}</span>{/if}
              </span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

</header>

{#if badges.some(b => ['Sex','Influence','CV EN','CV JP','CV CN','CV KO'].includes(b.prefix || '')) || roleDetails.length}
  <BottomSheet bind:open={sheetOpen} title="Details">
    <div class="bottom-tags">
      {#each ['Sex','Influence','CV EN','CV JP','CV CN','CV KO'] as prefix}
        {#if badges.some(b => b.prefix === prefix)}
          <div class="row-group">
            <span class="badge-prefix">{prefix}</span>
            <div class="chips-wrapper">
              {#each badges.filter(b => b.prefix === prefix) as b}
                <span class="badge muted">{b.label}</span>
              {/each}
            </div>
          </div>
        {/if}
      {/each}

      {#if roleDetails.length}
        <div class="row-group">
          <span class="badge-prefix">Role</span>
          <div class="role-list">
            {#each roleDetails as r}
              <div class="role-chip" title={r.desc}>
                {#if r.icon}
                  <img src={r.icon} alt={r.name} class="role-icon" />
                {/if}
                <span class="role-name" style:color={r.color || undefined}>{r.name}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </BottomSheet>
{/if}

<style>
  .detail-header {
    display: flex;
    flex-direction: column;
    padding: var(--sp-4);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(4px);
    border-left: 4px solid var(--sonata-color);
    gap: var(--sp-2); 
  }

  .title-row {
    width: 100%;
  }

  .title {
    margin: 0;
    font-size: var(--fs-xl);
  }

  .content-row {
    display: flex;
    align-items: flex-start; 
    gap: var(--sp-4);
    width: 100%;
  }

  .img-wrapper {
    flex-shrink: 0;
    width: 140px;
  }

  .img-container {
    position: relative;
    display: flex;
    border-radius: var(--radius);
    background: var(--bg-hover);
  }

  .header-img {
    width: 100%;
    height: 100%;
    border-radius: var(--radius);
    object-fit: contain;
  }

  .stars-below {
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    color: #f5c518;
    font-size: var(--fs-sm);
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  }

  .header-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  
  .tags-top {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .tags-top .row-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid var(--border);
    padding-bottom: 4px;
  }
  .tags-top .row-group:last-child {
    border-bottom: none;
  }

  
  .bottom-tags {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    width: 100%;
    padding-bottom: var(--sp-2);
  }

  .bottom-tags .row-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 4px;
  }

  .chips-wrapper {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: flex-start;
    scrollbar-width: none;
    padding-bottom: 2px;
  }
  .chips-wrapper::-webkit-scrollbar {
    display: none;
  }

  .role-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
  }
  .role-chip {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
    background: var(--bg-hover);
    padding: 4px 8px;
    border-radius: var(--radius);
    cursor: help;
  }
  .role-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
  .role-name {
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
  }

  .version-badge {
    background: var(--bg);
    color: var(--text-secondary);
    font-size: var(--fs-xs);
    border: 1px solid var(--border);
    padding: 2px 8px;
    border-radius: var(--radius);
  }

  .badge-prefix {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  .badge.accent {
    background: var(--accent);
    color: var(--text-inverse);
    border-color: var(--accent);
  }

  .badge.muted {
    background: var(--bg-hover);
    color: var(--text-secondary);
  }
</style>
