<script lang="ts">
  let { teams, teamNote, onnote }: { teams: any[]; teamNote?: string; onnote?: (note: string) => void } = $props();

  let currentIndex = $state(0);

  function nextPage() {
    currentIndex = Math.min(currentIndex + 1, teams.length - 1);
  }
  function prevPage() {
    currentIndex = Math.max(currentIndex - 1, 0);
  }

  function getCharSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
</script>

<div class="team-wrapper">
  <div class="team-container">
    {#each teams as t, i}
      <div class="team-card raised" class:show={i === currentIndex || i === currentIndex + 1 || i === currentIndex + 2}>
        <div class="team-header">
          <h4>{t.name}</h4>
          {#if teamNote}
          <button class="raised small-btn" onclick={() => onnote?.(teamNote)}>ℹ Note</button>
        {/if}
        </div>

        <div class="slots">
          {#each t.members as slot, idx}
            <div class="slot">
              <span class="slot-label">Slot {idx + 1}</span>
              <div class="chars">
                {#if slot.length === 0}
                  <div class="char-avatar empty">-</div>
                {:else}
                  {#each slot as c}
                    {@const slug = getCharSlug(c)}
                    <a href={`/characters/${slug}`} class="char-link" title={c}>
                      <img
                        src={`/icons/characters/${slug}.webp`}
                        alt={c}
                        class="char-avatar"
                        onerror={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling.style.display='flex'; }}
                      />
                      <span class="char-fallback" style="display: none;">{c.charAt(0)}</span>
                    </a>
                  {/each}
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <!-- Navigasi -->
  {#if teams.length > 1}
    <div class="nav-wrapper">
      <button class="raised nav-btn" onclick={prevPage} disabled={currentIndex === 0}>←</button>
      <span class="indicator">{currentIndex + 1} / {teams.length}</span>
      <button class="raised nav-btn" onclick={nextPage} disabled={currentIndex >= teams.length - 1}>→</button>
    </div>
  {/if}
</div>

<style>
  .team-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .team-container {
    display: grid;
    gap: var(--sp-3);
    /* Default Mobile: 1 Kolom */
    grid-template-columns: 1fr;
  }

  /* Tablet: 2 Kolom */
  @media (min-width: 768px) and (max-width: 1023px) {
    .team-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* PC: 3 Kolom */
  @media (min-width: 1024px) {
    .team-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .team-card {
    padding: var(--sp-3);
    display: none; /* Sembunyikan semua secara default */
    flex-direction: column;
    gap: var(--sp-2);
  }

  /* Tampilkan berdasarkan index */
  .team-card.show {
    display: flex;
  }

  /* Batasi jumlah yang tampil di PC (maksimal 3) */
  @media (min-width: 1024px) {
    .team-card.show:nth-child(n+4) { /* Jika mulai dari index 0, kita batasi 3 pertama */
       /* Trik ini agak rumit jika index dinamis, kita pakai trik CSS sibling */
    }
    /* Sembunyikan item ke-4 dan seterusnya yang punya class .show */
    .team-card.show ~ .team-card.show ~ .team-card.show ~ .team-card.show {
      display: none;
    }
  }

  /* Tablet (Maksimal 2) */
  @media (min-width: 768px) and (max-width: 1023px) {
    .team-card.show ~ .team-card.show ~ .team-card.show {
      display: none;
    }
  }

  .team-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }

  .team-header h4 {
    margin: 0;
    font-size: var(--fs-md);
    color: var(--accent);
  }

  .small-btn {
    padding: 2px 8px;
    font-size: var(--fs-xs);
    cursor: pointer;
  }

  .slots {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    margin-top: var(--sp-1);
  }

  .slot {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
  }

  .slot-label {
    width: 50px;
    color: var(--text-muted);
    font-size: var(--fs-xs);
    font-weight: var(--fw-medium);
    flex-shrink: 0;
  }

  .chars {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
  }

  .char-link {
    display: inline-flex;
    text-decoration: none;
  }

  .char-avatar {
    width: 36px;
    height: 36px;
    object-fit: cover;
    border-radius: 50%;
    background: var(--bg-hover);
    border: 1px solid var(--border);
  }

  .char-avatar.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: var(--fs-sm);
  }

  .char-fallback {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--bg-hover);
    border: 1px solid var(--border);
    align-items: center;
    justify-content: center;
    color: var(--text);
    font-weight: var(--fw-bold);
    font-size: var(--fs-sm);
  }

  .nav-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--sp-2);
    margin-top: var(--sp-2);
  }

  .nav-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .indicator {
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
</style>
