import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
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

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const load: PageServerLoad = async ({ params, fetch }) => {
  const [c1, c2, prolog] = await Promise.all([
    loadJSON('quests/story/chapter_1.json', fetch),
    loadJSON('quests/story/chapter_2.json', fetch),
    loadJSON('quests/prolog/prologue-stories.json', fetch),
  ]);

  const allQuests = [
    ...(c1 ?? []).map((x: any) => ({ ...x, type: 'Chapter 1' })),
    ...(c2 ?? []).map((x: any) => ({ ...x, type: 'Chapter 2' })),
    ...(prolog ?? []).map((x: any) => ({ ...x, type: 'Prologue' })),
  ];

  const quest = allQuests.find(q => toSlug(q.title) === params.slug);
  if (!quest) throw error(404, 'Quest not found');

  return { quest };
};
