<script lang="ts">
  import type { PageProps } from './$types';
  import { goto } from '$app/navigation';
  import PageGrid from '#lib/components/PageGrid.svelte';

  let { data }: PageProps = $props();
</script>

<svelte:head><title>{data.quest.title} — WuWa DB</title></svelte:head>

<!-- Supaya header (judul & back) tetap di atas, kita panggil PageGrid di bawahnya -->
<PageGrid
  title={data.quest.title}
  items={data.quest.blocks}
  countLabel="blocks"
  searchAsLabel={true}
>
  {#snippet filters()}
    <button class="raised" onclick={() => goto('/quests')} style="height: 100%; display: flex; align-items: center; gap: 4px;">
      <svg width="16" height="16" fill="currentColor"><use href="#arrow-left" /></svg>
      Back
    </button>
  {/snippet}

  {#snippet children(item, index)}
    <!-- Jika item adalah text, dan item sebelumnya adalah gambar, kita lewati (karena sudah di-render bersama gambar) -->
    {#if item.type === 'text' && index > 0 && data.quest.blocks[index - 1].type === 'image'}
      <!-- skip, sudah dirender di blok gambar -->
    {:else}
      <div class="block-wrapper">
        {#if item.type === 'image'}
          <!-- Cek apakah blok selanjutnya adalah teks -->
          {#if index + 1 < data.quest.blocks.length && data.quest.blocks[index + 1].type === 'text'}
            <div class="side-by-side">
              <div class="block-img">
                <img src={item.value} alt="" loading="lazy" />
              </div>
              <p class="block-text">{data.quest.blocks[index + 1].value}</p>
            </div>
          {:else}
            <div class="block-img center">
              <img src={item.value} alt="" loading="lazy" />
            </div>
          {/if}
        {:else}
          <p class="block-text">{item.value}</p>
        {/if}
      </div>
    {/if}
  {/snippet}
</PageGrid>

<style>
  :global(main:has(.page-container)) {
    padding: 0 !important;
  }

  .block-wrapper {
    grid-column: 1 / -1;
    width: 100%;
  }

  .side-by-side {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
    padding: var(--sp-2) 0;
    align-items: center;
  }

  @media (min-width: 768px) {
    .side-by-side {
      flex-direction: row;
      align-items: flex-start;
    }
    .side-by-side .block-img {
      width: 40%; /* Gambar 40% di kiri */
      flex-shrink: 0;
    }
    .side-by-side .block-text {
      width: 60%; /* Teks 60% di kanan */
    }
  }

  .block-text {
    line-height: 1.6;
    white-space: pre-wrap;
    margin: 0;
    padding: var(--sp-2) 0;
  }

  .block-img {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: var(--sp-2) 0;
  }
  .block-img.center {
    justify-content: center;
  }
  .block-img img {
    width: 100%;
    height: auto;
    border-radius: var(--radius);
    object-fit: cover;
  }

  .block-img img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius);
  }
</style>
