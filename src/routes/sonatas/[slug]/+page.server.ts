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
  const allSonatas = await loadJSON('sonatas/sonatas.json', fetch);

  if (!allSonatas) {
    throw new Error('Sonata data not found');
  }

  const item = allSonatas.find((s: any) => s.slug === params.slug);

  if (!item) {
    throw new Error('Sonata not found');
  }

  // Load echoes index to find associated echoes
  const echoesIndex = await loadJSON('echoes/index.json', fetch);

  let associatedEchoes: any[] = [];
  if (echoesIndex && Array.isArray(echoesIndex)) {
    associatedEchoes = echoesIndex.filter((e: any) =>
      e.sonatas && e.sonatas.includes(item.id)
    ).map((e: any) => ({
      name: e.name,
      slug: e.slug,
      image: e.image,
      cost: e.cost
    }));
  }

  return {
    item,
    associatedEchoes
  };
};
