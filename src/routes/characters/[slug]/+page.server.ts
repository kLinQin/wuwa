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
  const [charData, buildData] = await Promise.all([
    loadJSON(`resonators/${params.slug}.json`, fetch),
    loadJSON(`builds/${params.slug}.json`, fetch)
  ]);

  if (!charData) {
    // Fallback to index if direct file missing
    const items = await loadJSON('resonators/index.json', fetch);
    const match = items.find((c: any) => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.slug);
    if (!match) throw new Error('Character not found');

    // If we have build data but no specific char file, merge them
    if (buildData) {
      return { item: { ...match, ...buildData } };
    }
    return { item: match };
  }

  // Merge character details with build data
  // Build keys: id, name, recommendedStats, build, analysisCharts
  // Char keys: id, name, element, rarity, weapon, version, lastUpdated, roles, sonatas, changelog, faction, affiliation, class, image, icon, imageBanner, skills, materials, sequences, favorRole

  const mergedItem = {
    ...charData,
    ...(buildData ? {
      recommendedStats: buildData.recommendedStats,
      build: buildData.build,
      analysisCharts: buildData.analysisCharts
    } : {})
  };

  // Load indices for mapping IDs to names/icons
  const [materialsIndex, teamsIndex, rolesIndex, sonatasIndex] = await Promise.all([
    loadJSON('materials/index.json', fetch),
    loadJSON('teams/index.json', fetch),
    loadJSON('roles/index.json', fetch),
    loadJSON('sonatas/index.json', fetch)
  ]);

  return {
    item: mergedItem,
    materialsMap: materialsIndex ? Object.fromEntries(materialsIndex.map(m => [m.id, m])) : {},
    teamsMap: teamsIndex ? Object.fromEntries(teamsIndex.map(t => [t.id, t])) : {},
    rolesMap: rolesIndex ? Object.fromEntries(rolesIndex.map(r => [r.id, r])) : {},
    sonatasMap: sonatasIndex ? Object.fromEntries(sonatasIndex.map(s => [s.id, s])) : {}
  };
};
