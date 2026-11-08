<script lang="ts">
  import Icons from '#lib/components/Icons.svelte';
  import '../app.css';
  import favicon from '#lib/assets/favicon.svg';
  import ThemeToggle from '#lib/components/ThemeToggle.svelte';
  import FontToggle from '#lib/components/FontToggle.svelte';
  import { page } from '$app/state';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/characters', label: 'Characters' },
    { href: '/weapons', label: 'Weapons' },
    { href: '/echoes', label: 'Echoes' },
    { href: '/sonatas', label: 'Sonatas' },
    { href: '/stories', label: 'Stories' },
    { href: '/quests', label: 'Quests' },
    { href: '/calendar', label: 'Calendar' },
  ];

  let open = $state(false);

  // hide nav on mobile saat scroll down
  let visible = $state(true);
  let last_scroll = 0;
  function handle_scroll() {
    const s = window.scrollY;
    visible = s < 50 || s < last_scroll;
    last_scroll = s;
  }

  $effect(() => { open; /* close saat route ganti */ });
  $effect(() => { page.url.pathname; open = false; });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Icons />
<svelte:window onscroll={handle_scroll} />

<nav class:visible class:open>
  <div class="nav-inner">
  <a class="home-link" href="/" aria-label="WuWa DB">
    <span class="brand-name">WuWa DB</span>
    <span class="brand-page">{page.url.pathname === '/' ? 'homepage' : page.url.pathname.slice(1)}</span>
  </a>

  <div class="desktop links">
    {#each nav as n}
      <a href={n.href} aria-current={page.url.pathname === n.href || (n.href !== '/' && page.url.pathname.startsWith(n.href)) ? 'page' : null}>
        {n.label}
      </a>
    {/each}
  </div>

  <div class="menu">
    <FontToggle />
    <ThemeToggle />
    <button class="raised icon mobile-only" aria-label="Menu" aria-pressed={open} onclick={() => (open = !open)}>
      <svg width="24" height="24" fill="currentColor" style="display: block;">
        <use href={open ? '#close' : '#menu'} />
      </svg>
    </button>
  </div>
  </div>
</nav>

{#if open}
  <div class="mobile-menu">
    {#each nav as n}
      <a href={n.href} aria-current={page.url.pathname === n.href ? 'page' : null}>
        {n.label}
      </a>
    {/each}
  </div>
{/if}

<main>
  <div class="content">{@render children()}</div>
</main>

<style>
  /* ===== Nav base ===== */
  nav {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 100;
    height: var(--nav-h);
    background: var(--bg-elev);
    font-family: var(--font-ui);
    /* mobile: di bawah */
    bottom: 0;
    top: unset;
    border-top: 1px solid var(--border);
  }

  /* isi nav: lebar maks 1024px, di tengah */
  .nav-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    max-width: var(--max-content);
    margin: 0 auto;
    padding: 0 var(--sp-4);
  }
  .home-link {
    justify-self: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.1;
    text-decoration: none;
    color: var(--text);
    min-width: 0;
  }
  .brand-name { font-weight: var(--fw-medium); white-space: nowrap; font-size: var(--fs-sm); }
  .brand-page { font-size: var(--fs-xs); color: var(--text-muted); white-space: nowrap; text-transform: lowercase; }

  .links { display: none; justify-self: center; gap: var(--sp-1); height: 100%; align-items: stretch; }
  .links a {
    display: flex;
    align-items: center;
    padding: 0 var(--sp-3);
    color: inherit;
    text-decoration: none;
    font-size: var(--fs-sm);
    white-space: nowrap;
    box-shadow: inset 0 -1px 0 0 transparent;
  }
  .links a:hover { box-shadow: inset 0 -1px 0 0 var(--border); }
  .links a[aria-current="page"] { color: var(--accent); box-shadow: inset 0 -1px 0 0 currentColor; }

  .menu { display: flex; gap: var(--sp-2); justify-self: end; }

  /* ===== Main scroll area ===== */
  :global(body) {
    overflow: hidden;
  }

  main {
    height: 100vh;
    height: 100dvh;
    overflow-y: auto;
    overflow-x: hidden;
    max-width: var(--max-content);
    margin: 0 auto;
    padding: var(--content-pad);
    padding-bottom: calc(var(--nav-h) + var(--content-pad)); /* space untuk nav bawah (mobile) */
  }
  main::-webkit-scrollbar { display: none; }
  .content { max-width: var(--max-content); margin: 0 auto; }

  /* ===== Mobile menu ===== */
  .mobile-menu {
    position: fixed;
    left: 0;
    right: 0;
    bottom: var(--nav-h);
    z-index: 99;
    background: var(--bg-elev);
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: var(--sp-2);
    max-height: 60vh;
    overflow-y: auto;
  }
  .mobile-menu a {
    padding: var(--sp-3);
    color: inherit;
    text-decoration: none;
    font-size: var(--fs-md);
  }
  .mobile-menu a:hover { background: var(--bg-hover); }
  .mobile-menu a[aria-current="page"] { color: var(--accent); }

  /* ===== Mobile nav auto-hide (slide down) ===== */
  @media (max-width: 831px) {
    nav {
      top: unset;
      bottom: 0;
      transition: transform 0.2s;
    }
    nav:not(.visible):not(.open):not(:focus-within) {
      transform: translateY(100%);
    }
  }

  /* ===== Desktop: nav di atas ===== */
  @media (min-width: 832px) {
    .nav-inner {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
    }
    nav {
      top: 0;
      bottom: unset;
      border-top: none;
      border-bottom: 1px solid var(--border);
    }
    .links { display: flex; }
    .mobile-only { display: none; }
    .mobile-menu { display: none; }
    main {
      height: calc(100dvh - var(--nav-h));
      margin: var(--nav-h) auto 0;
      padding-top: var(--content-pad);
      padding-bottom: var(--content-pad);
    }
  }
</style>
