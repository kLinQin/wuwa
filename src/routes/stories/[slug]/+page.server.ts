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
  // Load full lore data to find by slug (which matches character name/slug in lores folder)
  // Note: The filenames in lores are like 'aalto.json', so we need to map slug to filename.
  // Assuming slug is lowercase name with hyphens replaced or similar.
  // Let's check index first to get the correct id/name mapping if needed, but direct file access is faster for local dev.

  // Strategy: Try loading 'lores/<slug>.json' directly if it follows standard naming convention seen in ls output.
  // From ls output: aalto.json, sanhua.json etc. So slug likely maps directly to filename without extension.

  let item = await loadJSON(`lores/${params.slug}.json`, fetch);

  if (!item) {
    // Fallback: Check index to see if there's a mismatch between URL slug and filename
    const index = await loadJSON('lores/index.json', fetch);
    if (index && Array.isArray(index)) {
       const match = index.find((l: any) => l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.slug);
       if (match) {
         // If found in index, try loading by that specific identifier if different,
         // but since files are named after characters, this fallback might not help unless filenames differ significantly.
         // For now, assume 404 if direct file load fails and no obvious mapping exists.
         throw new Error('Story not found');
       }
    }
    throw new Error('Story not found');
  }

  return { item };
};
