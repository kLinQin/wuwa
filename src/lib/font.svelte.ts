import { browser } from '$app/env';

type FontMode = 'elegant' | 'boring';

let current = $state<FontMode>('elegant');

if (browser) {
  current = (localStorage.getItem('svelte:font') as FontMode) ?? 'elegant';
}

function apply(m: FontMode) {
  if (!browser) return;
  document.documentElement.classList.remove('font-elegant');
  document.documentElement.classList.remove('font-boring');
  document.documentElement.classList.add('font-' + m);
  try { localStorage.setItem('svelte:font', m); } catch {}
}

export const fontMode = {
  get value() { return current; },
  set(m: FontMode) { current = m; apply(m); },
  toggle() {
    current = current === 'elegant' ? 'boring' : 'elegant';
    apply(current);
  }
};
