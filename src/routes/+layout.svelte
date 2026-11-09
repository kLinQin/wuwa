<script lang="ts">
  import Icons from '#lib/components/Icons.svelte';
  import '../app.css';
  
  import ThemeToggle from '#lib/components/ThemeToggle.svelte';
  import FontToggle from '#lib/components/FontToggle.svelte';
  import { page } from '$app/state';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/characters', label: 'Characters' },
    { href: '/builds', label: 'Builds' },
    { href: '/weapons', label: 'Weapons' },
    { href: '/echoes', label: 'Echoes' },
    { href: '/sonatas', label: 'Sonatas' },
    { href: '/stories', label: 'Stories' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/about', label: 'About' },
  ];

  let open = $state(false);
  const pageLabel = $derived((() => {
    const p = page.url.pathname;
    if (p === '/') return 'homepage';
    const parts = p.split('/').filter(Boolean);
    return parts.map((seg, i) => {
      if (i === parts.length - 1 && i > 0) {
        const item = (page.data as any)?.item;
        if (item?.name) return item.name;
      }
      return seg.charAt(0).toUpperCase() + seg.slice(1);
    }).join(' / ');
  })());

  
  let visible = $state(true);
  let last_scroll = 0;
  function handle_scroll() {
    const s = window.scrollY;
    visible = s < 50 || s < last_scroll;
    last_scroll = s;
  }

  $effect(() => { open;  });
  $effect(() => { page.url.pathname; open = false; });
</script>


<Icons />
<svelte:window onscroll={handle_scroll} />

<nav class:visible class:open>
  <div class="nav-inner">
  <a class="home-link" href="/" aria-label="WWI">
    <svg class="brand-logo" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="4" width="40" height="40" rx="6" fill="var(--bg-hover)" />
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M33.25 11.487s-2.525 5.117-3.248 6.483s-3.696 7.795-1.205 11.893c0 0-1.998-.38-3.02-2.938"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M26.401 28.346s.228 2.558.625 3.353c0 0-4.44-1.857-2.403-7.633m10.531-9.587s1.136 4.32-.285 6.763c-1.42 2.444-3.554 3.762-3.554 3.762s1.844-3.172 1.875-5.303"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M32.753 21.435s-2.161 2.708-4.59 3.462m6.313-12.343s.694-3.366-1.346-3.13c-2.04.235-2.694-.759-2.694-.759s-.706-.156-1.046-.078s-2.71-2.907-10.632 4.306m15.642-.078s3.145-.68 5.738 8.118c0 0 .52 1.483-.674 3.504c-.997 1.69-.454 2.39-.454 2.39"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M38.9 25.793s-1.27 1.855-3.267 2.45c0 0 1.316-1.61 1.394-2.708"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M38.126 22.763s-.523 4.838-5.336 5.073c0 0 6.905-7.087 3.113-11.01"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M34.543 22.161s.883 1.278.412 2.926m-.13-14.652s1.743-.766.978 2.677m-1.53 14.663s.425 1.913 2.38 2.805c0 0-.213.765-1.19 1.658c0 0-.723.34-.255 1.148c0 0-.978.722-2.04.68m1.105.084l.297.936s-1.403.722-2.168 3.612l-5.185-.382s-1.147.34-1.615 3.697m-1.661-15.147s-1.399 1.93-.506 4.012c.892 2.083-7.31-4.038.17-12.028"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M21.267 18.935s-5.27 6.333-2.508 9.478c0 0 .383-2.763 1.785-4.335"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M17.867 26.67s-1.828 2.508 2.677 5.44c0 0 1.233.638 1.403.086c.17-.553.85 1.105.85 1.105h0m7.068-25.123s.253-1.407-1.095-2.597m-10.166 6.801s2.934-6.82 6.424-4.362m.555.08s1.19-1.666-.793-2.539M14.784 5.5c-.455 1.276-.383 2.044-.224 2.44c.158.397.317 2.38.317 2.38s2.731-.447 3.779 2.286m-.046.456s-1.275 2.186-1.776 2.186c0 0 .501-2.323-3.462-3.416c0 0 1.184-.729 1.367-1.594M5.677 12.56s1.682-1.138 7.376-.865"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5.674 17.298s3.234-2.277 3.78-2.779s2.39-2.043 4.35-2.453m2.848 3.364s-3.143 6.742-3.189 10.432m-7.835-3.28s2.187.729 3.827 2.551s3.234 1.777 3.234 1.777s.592-.137.774-.957"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M13.099 26.545s-5.057-4.19 3.28-11.023m-9.977-3.458s1.85-3.405 5.55-6.514"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M17.391 21s-2.188 6.171-5.778 7.237c0 0 3.534 1.01 5.33-2.3m1.738-5.553s2.58-8.135 7.35-9.818"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M13.13 28.288s-5.556 5.054-3.2 9.99c0 0 .393-2.355 1.178-3.365"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M11.052 33.96s.393 5.104 6.732 5.833c0 0-2.468-1.907-2.861-5.89m-4.488 2.861s1.346 5.105 3.254 5.61"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M13.408 38.167s3.31 4.263 4.32 4.207m-2.244-14.529s1.458 9.76 8.863 8.863c0 0-1.907 4.488-8.639-.168"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M18.738 38.503s3.478 3.59 5.61 2.469c0 0 .084 1.042-.596 1.528m-3.836-10.56s-1.122 1.739-.842 2.86M8.92 24.928S5.837 26.525 5.5 27.03m3.983 6.618L7.406 36.54s-.393.617-1.74.28m17.952 1.515s1.178 1.178 2.076 2.637m3.599-14.744c.195-.098 1.758-1.417 3.175-1.075m-.733.391s.391 1.319-.342 2.491l-1.807-1.856"/><rect width="37" height="37" x="5.5" y="5.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" rx="4" ry="4"/>
    </svg>
    <div class="brand-text">
      <span class="brand-name">WWI</span>
      <span class="brand-page">{pageLabel}</span>
    </div>
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
  
  nav {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 100;
    height: var(--nav-h);
    background: var(--bg-elev);
    font-family: var(--font-ui);
    
    bottom: 0;
    top: unset;
    border-top: 1px solid var(--border);
  }

  
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
    flex-direction: row;
    align-items: center;
    gap: 8px;
    justify-content: flex-start;
    line-height: 1.1;
    text-decoration: none;
    color: var(--text-body);
    min-width: 0;
  }
  .home-link:focus, .home-link:focus-visible { outline: none; }
  .brand-logo {
    width: 45px; height: 45px;
    display: block; flex-shrink: 0;
  }
  .brand-text { display: flex; flex-direction: column; line-height: 1.1; }
  .home-link { display: flex; align-items: center; gap: 8px; }

  .brand-name { font-weight: var(--fw-medium); white-space: nowrap; font-size: var(--fs-sm); }
  .brand-page { font-size: var(--fs-xs); color: var(--text-secondary); white-space: nowrap; text-transform: lowercase; }

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
    padding-bottom: calc(var(--nav-h) - 20px); 
  }
  main::-webkit-scrollbar { display: none; }
  .content { max-width: var(--max-content); margin: 0 auto; }

  
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
