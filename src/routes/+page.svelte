<script lang="ts">
  import type { PageProps } from './$types';
  import DataCard from '#lib/components/DataCard.svelte';
  import MiniCalendar from '#lib/components/MiniCalendar.svelte';
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

  const ongoingBanners = $derived((data.events || []).filter((e: any) => {
    if (!e.startDate || !e.endDate || e.type !== 'banner') return false;
    const n = new Date().getTime(), a = new Date(e.startDate).getTime(), b = new Date(e.endDate).getTime();
    return n >= a && n <= b;
  }));

  const ongoingChars = $derived(ongoingBanners.filter((e: any) => !/weapon/i.test(e.name)).slice(0, 3));
  const ongoingWeapons = $derived(ongoingBanners.filter((e: any) => /weapon/i.test(e.name)).slice(0, 3));
  const ongoingActivities = $derived((data.events || []).filter((e: any) => {
    if (!e.startDate || !e.endDate || e.type !== 'event') return false;
    const n = new Date().getTime(), a = new Date(e.startDate).getTime(), b = new Date(e.endDate).getTime();
    return n >= a && n <= b;
  }).slice(0, 3));
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
      <div class="scroll-item"><DataCard item={c} kind="character" href={`/characters/${c.slug || c.id}`} /></div>
    {/each}
    {#each featuredWeapons as w}
      <div class="scroll-item"><DataCard item={w} kind="weapon" href={`/weapons/${w.slug || w.id}`} /></div>
    {/each}
    {#each featuredEchoes as e}
      <div class="scroll-item"><DataCard item={e} kind="echo" href={`/echoes/${e.slug || e.id}`} /></div>
    {/each}
  </div>
</section>
{/if}

{#if ongoingChars.length > 0}
  <section class="events-home">
    <h2>Ongoing Characters</h2>
    <div class="events-scroll">
      {#each ongoingChars as ev}
        <a href="/calendar" class="event-card surface">
          {#if ev.coverImgSrc}<img src={ev.coverImgSrc} alt={ev.name} class="event-img" />{/if}
          <div class="event-info">
            <h3>{ev.name}</h3>
            <p class="date">Ends: {ev.endDate.split(' ')[0]}</p>
          </div>
        </a>
      {/each}
    </div>
  </section>
{/if}

{#if ongoingWeapons.length > 0}
  <section class="events-home">
    <h2>Ongoing Weapons</h2>
    <div class="events-scroll">
      {#each ongoingWeapons as ev}
        <a href="/calendar" class="event-card surface">
          {#if ev.coverImgSrc}<img src={ev.coverImgSrc} alt={ev.name} class="event-img" />{/if}
          <div class="event-info">
            <h3>{ev.name}</h3>
            <p class="date">Ends: {ev.endDate.split(' ')[0]}</p>
          </div>
        </a>
      {/each}
    </div>
  </section>
{/if}

{#if ongoingActivities.length > 0}
  <section class="events-home">
    <h2>Ongoing Events</h2>
    <div class="events-scroll">
      {#each ongoingActivities as ev}
        <a href="/calendar" class="event-card surface">
          {#if ev.coverImgSrc}<img src={ev.coverImgSrc} alt={ev.name} class="event-img" />{/if}
          <div class="event-info">
            <h3>{ev.name}</h3>
            <p class="date">Ends: {ev.endDate.split(' ')[0]}</p>
          </div>
        </a>
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
  .tagline { color: var(--text-secondary); font-size: var(--fs-sm); margin: 0; }

  .featured h2, .links h2 { font-size: var(--fs-md); margin: var(--sp-4) 0 var(--sp-2); }
  .featured-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--sp-2); }

  
  
  
  
  

  .events-home { margin: var(--sp-4) 0; }
  .events-home h2 { font-size: var(--fs-md); margin: 0 0 var(--sp-2); }
  .events-scroll { display: flex; overflow-x: auto; gap: var(--sp-2); padding-bottom: var(--sp-2); scrollbar-width: none; }
  .events-scroll::-webkit-scrollbar { display: none; }
  .event-card { flex: 0 0 auto; width: 240px; display: flex; flex-direction: column; text-decoration: none; color: inherit; overflow: hidden; border-radius: var(--radius); }
  .event-img { width: 100%; height: 100px; object-fit: cover; background: var(--bg-hover); }
  .event-info { padding: var(--sp-2); display: flex; flex-direction: column; gap: 2px; }
  .event-info h3 { font-size: var(--fs-sm); margin: 0; color: var(--accent); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .event-info .date { font-size: var(--fs-xs); color: var(--text-secondary); margin: 0; font-family: var(--font-mono); }

  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--sp-2); margin: var(--sp-4) 0; }
  .stat-card { text-align: center; padding: var(--sp-3); border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-elev); text-decoration: none; color: inherit; }
  .stat-card:hover { background: var(--bg-hover); }
  .stat-count { display: block; font-size: var(--fs-xl); font-weight: var(--fw-bold); }
  .stat-label { font-size: var(--fs-xs); color: var(--text-secondary); }

  .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--sp-2); list-style: none; padding: 0; }
  .menu-grid a { display: block; padding: var(--sp-3); border: 1px solid var(--border); border-radius: var(--radius); text-decoration: none; color: inherit; background: var(--bg-elev); }
  .menu-grid a:hover { background: var(--bg-hover); }
  .menu-grid strong { display: block; font-size: var(--fs-sm); }
  .menu-grid span { font-size: var(--fs-xs); color: var(--text-secondary); }

  /* Terapkan scroll horizontal untuk semua ukuran layar */
  .featured-grid, .stats, .menu-grid {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    gap: var(--sp-2);
    padding-bottom: var(--sp-2);
    scrollbar-width: none; /* Sembunyikan scrollbar (opsional) */
  }
  .featured-grid::-webkit-scrollbar,
  .stats::-webkit-scrollbar,
  .menu-grid::-webkit-scrollbar {
    display: none;
  }

  .scroll-item, .stat-card, .menu-grid > li {
    flex: 0 0 auto;
  }
  .scroll-item { width: 130px; }
  
  .stat-card { min-width: 110px; }
  .menu-grid > li { min-width: 140px; }
</style>
