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
  // Load all weapon types to find the specific one by slug
  const types = ['broadblade', 'sword', 'pistol', 'gauntlet', 'rectifier'];

  let weaponData = null;

  // In dev/local mode, we can check files individually or load all indices
  // For simplicity in this script, let's assume we load the index first if available,
  // but since weapons are grouped by type, we iterate types.

  for (const type of types) {
    const items = await loadJSON(`weapons/${type}.json`, fetch);
    if (items && Array.isArray(items)) {
      const match = items.find((w: any) => w.slug === params.slug);
      if (match) {
        weaponData = match;
        break;
      }
    }
  }

  if (!weaponData) {
    // Fallback: Check global index if it contains full details (usually it doesn't, just summary)
    // But based on previous checks, index.json has summaries.
    // If not found in type files, throw 404.
    throw new Error('Weapon not found');
  }

  return { item: weaponData };
};
