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
    } catch (e: any) {
      if (e?.code !== 'ENOENT') throw e;
    }
  }
  const res = await fetchFn(`${REMOTE}/${file}`);
  if (!res.ok) throw new Error('Failed to load ' + file);
  return await res.json();
}

export const load: PageServerLoad = async ({ fetch }) => {
  const [events, characters, weapons, echoes, sonatas, home] = await Promise.all([
    loadJSON('events/events.json', fetch),
    loadJSON('resonators/index.json', fetch),
    loadJSON('weapons/index.json', fetch),
    loadJSON('echoes/echoes.json', fetch),
    loadJSON('sonatas/sonatas.json', fetch),
    loadJSON('home/sidebar-banner.json', fetch),
  ]);
  return { events, characters, weapons, echoes, sonatas, home };
};
