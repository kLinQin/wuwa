import { browser } from '$app/env';

type Theme = 'dark' | 'light';

function read(): Theme {
  if (!browser) return 'dark';
  const saved = localStorage.getItem('theme');
  return saved === 'light' ? 'light' : 'dark';
}

function apply(t: Theme) {
  if (!browser) return;
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
}

const initial = read();
if (browser) document.documentElement.setAttribute('data-theme', initial);

let current = $state<Theme>(initial);

export const theme = {
  get value() { return current; },
  set(t: Theme) { current = t; apply(t); },
  toggle() { current = current === 'dark' ? 'light' : 'dark'; apply(current); }
};
