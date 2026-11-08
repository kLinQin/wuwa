<script lang="ts">
  let { title, image, badges = [], meta, color }: {
    title: string;
    image: string;
    badges?: { label: string; type?: 'accent' | 'star' | 'muted'; prefix?: string }[];
    meta?: string;
    color?: string;
  } = $props();
</script>

<header class="detail-header" style="--sonata-color: {color || 'var(--border)'}">

  <div class="header-bottom">
  {#if image}
    <div class="img-wrapper">
      <h1 class="title-above">{title}</h1>
      <div class="img-container">
        <img src={image} alt={title} class="header-img" />
        {#if badges.some(b => b.type === 'star')}
          {@const star = badges.find(b => b.type === 'star')}
          <span class="stars-below">{star?.label}</span>
        {/if}
      </div>
      {#if meta}
        <span class="meta-text">{meta}</span>
      {/if}
    </div>
  {/if}

  <div class="header-info">

    {#if badges.length > 0}
      <div class="tags">
        {#each badges.filter(b => b.type !== 'star') as b}
          <span class="badge-group">
            {#if b.prefix}
              <span class="badge-prefix">{b.prefix}</span>
            {/if}
            <span class="badge" class:accent={b.type === 'accent'} class:muted={b.type === 'muted'}>
              {b.label}
            </span>
          </span>
        {/each}
      </div>
    {/if}
  </div>
  </div>
</header>

<style>
  .detail-header {
    align-items: stretch;
  }




  .title-above {
    margin: 0;
    font-size: var(--fs-xl);
    text-align: center;
  }

  .img-wrapper .meta-text {
    font-size: var(--fs-sm);
    color: var(--text-muted);
    text-align: center;
  }

  .header-bottom {
    display: flex;
    align-items: flex-start; /* Memastikan kolom 2 mulai dari atas */
    gap: var(--sp-4);
    width: 100%;
  }

  /* Beri jarak pada kolom 2 agar sejajar dengan gambar (karena judul ada di atas gambar) */
  .header-info {
    margin-top: calc(var(--fs-xl) + var(--sp-2));
    padding-top: 0;
  }

  .detail-header {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    padding: var(--sp-4);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(4px);
    border-left: 4px solid var(--sonata-color);
  }

  .img-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--sp-2);
    flex-shrink: 0;
  }


  .img-container {
    position: relative;
    display: flex;
    border-radius: var(--radius);
    background: var(--bg-hover);
  }

  .header-img {
    width: 140px;
    height: 140px;
    border-radius: var(--radius);
    object-fit: contain;
  }

  .stars-below {
    position: absolute;
    bottom: 4px; /* Jarak dari garis bawah gambar */
    left: 50%;
    transform: translateX(-50%);
    color: #f5c518;
    font-size: var(--fs-sm);
    line-height: 1;
    letter-spacing: 1px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.8); /* Agar tetap terbaca di gambar terang */
  }

  .header-info {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
    flex: 1;
  }


  .meta-text {
    color: var(--text-muted);
    font-size: var(--fs-xs);
    margin: 0;
    white-space: nowrap;
  }

  .tags {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: var(--sp-2);
    width: 100%;
  }

  .badge-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid var(--border);
    padding-bottom: 2px;
  }
  .badge-group:last-child {
    border-bottom: none;
  }

  .badge-prefix {
    font-size: var(--fs-sm);
    color: var(--text-muted);
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
