import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const LOCAL = env.LOCAL_DATA_DIR || 'C:/Users/eggs/wuwa-data';
const REMOTE = 'https://raw.githubusercontent.com/kLinQin/wuwa-data/main';
const isDev = process.env.NODE_ENV !== 'production';

async function loadJSON(file: string, fetchFn: typeof fetch) {
  if (isDev) {
    try {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');
      const raw = await fs.readFile(path.join(LOCAL, file), 'utf-8');
      return JSON.parse(raw);
    } catch (e: any) { if (e?.code !== 'ENOENT') throw e; }
  }
  const res = await fetchFn(`${REMOTE}/${file}`);
  if (!res.ok) return null;
  return await res.json();
}

export const load: PageServerLoad = async ({ fetch }) => {
  const [c1, c2, prolog, glossary] = await Promise.all([
    loadJSON('quests/story/chapter_1.json', fetch),
    loadJSON('quests/story/chapter_2.json', fetch),
    loadJSON('quests/prolog/prologue-stories.json', fetch),
    loadJSON('quests/glossary/glossary.json', fetch),
  ]);

  const quests = [
    ...(c1 ?? []).map((x: any) => ({ type: 'Chapter 1', title: x.title })),
    ...(c2 ?? []).map((x: any) => ({ type: 'Chapter 2', title: x.title })),
    ...(prolog ?? []).map((x: any) => ({ type: 'Prologue', title: x.title })),
  ];
  const terms = (glossary ?? []).map((x: any) => ({ name: x.name, description: x.description }));

  return { quests, terms };
};
