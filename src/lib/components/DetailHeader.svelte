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
      <div class="tags">
        <!-- Tampilkan hanya Element, Weapon, Class di sini -->
        {#each badges.filter(b => b.type !== 'star' && b.prefix !== 'Role' && b.prefix !== 'Sonata') as b}
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

  <!-- Bagian Bawah: Role & Sonata Full Width -->
  {#if badges.some(b => b.prefix === 'Role' || b.prefix === 'Sonata')}
    <div class="bottom-tags">
      {#if badges.some(b => b.prefix === 'Sonata')}
        {@const sonatas = badges.filter(b => b.prefix === 'Sonata')}
        <div class="badge-group">
          <span class="badge-prefix">Sonata</span>
          <div class="chips">
            {#each sonatas as b}
              <span class="badge muted">{b.label}</span>
            {/each}
          </div>
        </div>
      {/if}

      {#if badges.some(b => b.prefix === 'Role')}
        {@const roles = badges.filter(b => b.prefix === 'Role')}
        <div class="badge-group">
          <span class="badge-prefix">Role</span>
          <div class="chips scroll-x">
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
    align-items: stretch;
  }




  .title-above {
    margin: 0;
    font-size: var(--fs-xl);
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
    flex-direction: column;
    padding: var(--sp-4);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(4px);
    border-left: 4px solid var(--sonata-color);
    gap: var(--sp-4);
  }

  .img-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: var(--sp-2);
    flex-shrink: 0;
    width: 140px; /* Kunci lebar agar tidak berubah-ubah saat gambar loading */
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




  .chips {
    display: flex;
    gap: 4px;
    justify-content: flex-end;
    flex-wrap: wrap; /* Biar turun ke bawah kalau gak pakai scroll */
  }
  .chips.scroll-x {
    overflow-x: auto;
    scrollbar-width: none;
    flex: 1;
    width: 0; /* Trik agar flexbox bisa mengecil & scroll */
    white-space: nowrap;
    justify-content: flex-end; /* Chip nempel ke kanan */
    cursor: grab;
  }
  .chips.scroll-x:active {
    cursor: grabbing;
  }
  .chips.scroll-x::-webkit-scrollbar {
    display: none;
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

  .bottom-tags {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    padding-top: var(--sp-2);
    margin-top: var(--sp-2);
    border-top: 1px solid var(--border);
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
  @media (max-width: 640px) {
    .bottom-tags .badge-group {
      flex-direction: column; /* Tumpuk label di atas, chip di bawah */
      align-items: flex-start;
      gap: 4px;
    }
    .bottom-tags .badge-prefix {
      margin-bottom: 2px;
    }
    .bottom-tags .chips.scroll-x {
      width: 100%; /* Chip ambil lebar penuh di mobile */
      justify-content: flex-start; /* Mulai dari kiri */
    }
  }
</style>
