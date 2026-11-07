import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const LOCAL = env.LOCAL_DATA_DIR || 'C:/Users/eggs/wuwa-data';
const REMOTE = 'https://raw.githubusercontent.com/kLinQin/wuwa-data/main';
const isDev = process.env.NODE_ENV !== 'production';

async function loadJSON(filePath: string, fetchFn: typeof fetch) {
  if (isDev) {
    try {
      const fs = await import('node:fs/promises');
      const pth = await import('node:path');
      const raw = await fs.readFile(pth.join(LOCAL, filePath), 'utf-8');
      return JSON.parse(raw);
    } catch (e: any) {
      if (e?.code !== 'ENOENT') throw e;
    }
  }
  const res = await fetchFn(`${REMOTE}/${filePath}`);
  if (!res.ok) return null;
  return await res.json();
}

export const load: PageServerLoad = async ({ params, fetch }) => {
  // Load full echoes data to find by slug
  const allEchoes = await loadJSON('echoes/echoes.json', fetch);

  if (!allEchoes) {
    throw new Error('Echo data not found');
  }

  const item = allEchoes.find((e: any) => e.slug === params.slug);

  if (!item) {
    throw new Error('Echo not found');
  }

  // Load sonatas index for mapping IDs to names
  const sonatasIndex = await loadJSON('sonatas/index.json', fetch);
  const sonatasMap = sonatasIndex ? Object.fromEntries(sonatasIndex.map(s => [s.id, s])) : {};

  return {
    item,
    sonatasMap
  };
};
