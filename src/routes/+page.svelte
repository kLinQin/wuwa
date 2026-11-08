<script lang="ts">
  import type { PageProps } from './$types';
  import DataCard from '#lib/components/DataCard.svelte';
  let { data }: PageProps = $props();
  let featuredRef: HTMLDivElement | undefined = $state();

  $effect(() => {
    const el = featuredRef;
    if (!el) return;
    let rafId = 0;
    let paused = false;
    let dir = 0.5;
    const tick = () => {
      if (!paused && el.scrollWidth > el.clientWidth) {
        const max = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= max - 1) dir = -0.5;
        else if (el.scrollLeft <= 1) dir = 0.5;
        el.scrollLeft += dir;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    el.addEventListener('pointerenter', pause);
    el.addEventListener('pointerleave', resume);
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('pointerenter', pause);
      el.removeEventListener('pointerleave', resume);
    };
  });

  const byVersion = (a: any, b: any) => parseFloat(b.version) - parseFloat(a.version);

  const featuredChars = $derived([...data.characters].sort(byVersion).slice(0, 4));
  const featuredWeapons = $derived([...data.weapons].sort(byVersion).slice(0, 4));
  const featuredEchoes = $derived([...data.echoes].sort(byVersion).slice(0, 4));
  const activeEvents = $derived(data.events.slice(0, 4));
  const stats = $derived([
    { label: 'Characters', count: data.characters.length, href: '/characters' },
    { label: 'Weapons', count: data.weapons.length, href: '/weapons' },
    { label: 'Echoes', count: data.echoes.length, href: '/echoes' },
    { label: 'Sonatas', count: data.sonatas.length, href: '/sonatas' },
  ]);
  const links = [
    { href: '/characters', label: 'Characters', desc: 'Resonators' },
    { href: '/weapons', label: 'Weapons', desc: 'Arms' },
    { href: '/echoes', label: 'Echoes', desc: 'Monsters' },
    { href: '/sonatas', label: 'Sonatas', desc: 'Echo sets' },
    { href: '/stories', label: 'Stories', desc: 'Chapters' },
    { href: '/quests', label: 'Quests', desc: 'Missions' },
    { href: '/calendar', label: 'Calendar', desc: 'Events' },
  ];
</script>

<svelte:head><title>WuWa DB</title></svelte:head>

<section class="hero">
  <h1>Wuthering Waves DB</h1>
  <p class="tagline">{data.home.sidebarTitle}</p>
</section>

{#if featuredChars.length || featuredWeapons.length || featuredEchoes.length}
<section class="featured">
  <h2>New</h2>
  <div class="featured-grid" bind:this={featuredRef}>
    {#each featuredChars as c}
      <div class="scroll-item"><DataCard item={c} kind="character" href="/characters" /></div>
    {/each}
    {#each featuredWeapons as w}
      <div class="scroll-item"><DataCard item={w} kind="weapon" href="/weapons" /></div>
    {/each}
    {#each featuredEchoes as e}
      <div class="scroll-item"><DataCard item={e} kind="echo" href="/echoes" /></div>
    {/each}
  </div>
</section>
{/if}

{#if activeEvents.length}
<section class="events">
  <h2>Events</h2>
  <div class="events-grid">
    {#each activeEvents as ev}
      <div class="event-card" style:background-image="url({ev.background})">
        <div class="event-overlay">
          <span class="event-type">{ev.type}</span>
          <strong>{ev.title}</strong>
        </div>
      </div>
    {/each}
  </div>
</section>
{/if}

<section class="stats">
  {#each stats as s}
    <a href={s.href} class="stat-card">
      <span class="stat-count">{s.count}</span>
      <span class="stat-label">{s.label}</span>
    </a>
  {/each}
</section>

<section class="links">
  <h2>Explore</h2>
  <ul class="menu-grid">
    {#each links as l}
      <li><a href={l.href}><strong>{l.label}</strong><span>{l.desc}</span></a></li>
    {/each}
  </ul>
</section>

<style>
  .hero { text-align: center; padding: var(--sp-6) 0 var(--sp-4); }
  .hero h1 { margin: 0 0 var(--sp-1); }
  .tagline { color: var(--text-muted); font-size: var(--fs-sm); margin: 0; }

  .featured h2, .events h2, .links h2 { font-size: var(--fs-md); margin: var(--sp-4) 0 var(--sp-2); }
  .featured-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--sp-2); }

  .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--sp-2); }
  .event-card { position: relative; height: var(--event-h); border-radius: var(--radius); background-size: cover; background-position: center; overflow: hidden; }
  .event-overlay { position: absolute; inset: 0; background: linear-gradient(transparent 40%, var(--overlay-dark)); display: flex; flex-direction: column; justify-content: flex-end; padding: var(--sp-2); color: var(--text-inverse); }
  .event-type { font-size: var(--fs-xs); text-transform: uppercase; opacity: 0.7; }
  .event-overlay strong { font-size: var(--fs-sm); }

  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--sp-2); margin: var(--sp-4) 0; }
  .stat-card { text-align: center; padding: var(--sp-3); border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-elev); text-decoration: none; color: inherit; }
  .stat-card:hover { background: var(--bg-hover); }
  .stat-count { display: block; font-size: var(--fs-xl); font-weight: var(--fw-bold); }
  .stat-label { font-size: var(--fs-xs); color: var(--text-muted); }

  .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--sp-2); list-style: none; padding: 0; }
  .menu-grid a { display: block; padding: var(--sp-3); border: 1px solid var(--border); border-radius: var(--radius); text-decoration: none; color: inherit; background: var(--bg-elev); }
  .menu-grid a:hover { background: var(--bg-hover); }
  .menu-grid strong { display: block; font-size: var(--fs-sm); }
  .menu-grid span { font-size: var(--fs-xs); color: var(--text-muted); }

  /* Terapkan scroll horizontal untuk semua ukuran layar */
  .featured-grid, .events-grid, .stats, .menu-grid {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    gap: var(--sp-2);
    padding-bottom: var(--sp-2);
    scrollbar-width: none; /* Sembunyikan scrollbar (opsional) */
  }
  .featured-grid::-webkit-scrollbar,
  .events-grid::-webkit-scrollbar,
  .stats::-webkit-scrollbar,
  .menu-grid::-webkit-scrollbar {
    display: none;
  }

  .scroll-item, .event-card, .stat-card, .menu-grid > li {
    flex: 0 0 auto;
  }
  .scroll-item { width: 130px; }
  .event-card { min-width: 260px; }
  .stat-card { min-width: 110px; }
  .menu-grid > li { min-width: 140px; }
</style>
