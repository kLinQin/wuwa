import { browser } from '$app/env';

type Theme = 'dark' | 'light' | 'egg';
const ORDER: Theme[] = ['dark', 'light', 'egg'];

function read(): Theme {
  if (!browser) return 'dark';
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark' || saved === 'egg') return saved;
  return 'dark';
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
  next() {
    const i = ORDER.indexOf(current);
    current = ORDER[(i + 1) % ORDER.length];
    apply(current);
  },
  toggle() { this.next(); }
};
