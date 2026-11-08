<script lang="ts">
  let { title, image, badges = [], color }: {
    title: string;
    image: string;
    badges?: { label: string; type?: 'accent' | 'star' | 'muted'; prefix?: string }[];
    meta?: string;
    color?: string;
  } = $props();
</script>

<header class="detail-header" style="--sonata-color: {color || 'var(--border)'}">
  <div class="title-row">
    <h1 class="title">{title}</h1>
  </div>

  <div class="content-row">
    {#if image}
      <div class="img-wrapper">
        <div class="img-container">
          <img src={image} alt={title} class="header-img" width="140" height="140" />
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
          {#each badges.filter(b => b.type !== 'star' && b.prefix !== 'Role' && b.prefix !== 'Sonata') as b}
            <div class="row-group">
              {#if b.prefix}<span class="badge-prefix">{b.prefix}</span>{/if}
              <span class="badge" class:accent={b.type === 'accent'} class:muted={b.type === 'muted'}>{b.label}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  {#if badges.some(b => b.prefix === 'Role' || b.prefix === 'Sonata')}
    <div class="bottom-tags">
      {#if badges.some(b => b.prefix === 'Sonata')}
        {@const sonatas = badges.filter(b => b.prefix === 'Sonata')}
        <div class="row-group">
          <span class="badge-prefix">Sonata</span>
          <div class="chips-wrapper">
            {#each sonatas as b}
              <span class="badge muted">{b.label}</span>
            {/each}
          </div>
        </div>
      {/if}

      {#if badges.some(b => b.prefix === 'Role')}
        {@const roles = badges.filter(b => b.prefix === 'Role')}
        <div class="row-group">
          <span class="badge-prefix">Role</span>
          <div class="chips-wrapper">
            {#each roles as b}
              <span class="badge muted">{b.label}</span>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</header>

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
    gap: var(--sp-2); /* Lebih rapat */
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
    align-items: flex-start; /* Gambar dan Info sejajar dari atas */
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
    width: 140px;
    height: 140px;
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

  /* --- BAGIAN ATAS (Element, Weapon, dll) --- */
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

  /* --- BAGIAN BAWAH (Role & Sonata) --- */
  .bottom-tags {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    width: 100%;
    padding-top: var(--sp-2);
    border-top: 1px solid var(--border);
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

  .badge-prefix {
    font-size: var(--fs-sm);
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .badge.accent {
    background: var(--accent);
    color: var(--text-inverse);
    border-color: var(--accent);
  }

  .badge.muted {
    background: var(--bg-hover);
    color: var(--text-muted);
  }
</style>
