import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { loadWuwaJSON } from '../../../lib/server/wuwa';
import { resolveCharIdBySlug, getCharacterDetail, listEchoes, listWeapons, listSonatas } from '../../../lib/server/adapters';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const encoreId = await resolveCharIdBySlug(params.slug);
  if (!encoreId) throw error(404, 'Character not found');

  const [encoreChar, buildData, materialsIndex, teamsIndex, rolesIndex, echoesIndex, weaponsIndex, sonatasList] = await Promise.all([
    getCharacterDetail(encoreId),
    loadWuwaJSON(`builds/${params.slug}.json`, fetch),
    loadWuwaJSON('materials/index.json', fetch),
    loadWuwaJSON('teams/index.json', fetch),
    loadWuwaJSON('constants/combatRoles.json', fetch),
    listEchoes().catch(() => []),
    listWeapons().catch(() => []),
    listSonatas().catch(() => [])
  ]);

  if (!encoreChar) throw error(404, 'Character not found');

  // Merge build data (recommendedStats, build, analysisCharts) from wuwa-data
  const mergedItem = {
    ...encoreChar,
    ...(buildData ? {
      recommendedStats: buildData.recommendedStats,
      build: buildData.build,
      analysisCharts: buildData.analysisCharts
    } : {})
  };

  return {
    item: mergedItem,
    materialsMap: materialsIndex ? Object.fromEntries(materialsIndex.map((m: any) => [m.id, m])) : {},
    teamsMap: teamsIndex ? Object.fromEntries(teamsIndex.map((t: any) => [t.id, t])) : {},
    rolesMap: rolesIndex ? Object.fromEntries(rolesIndex.map((r: any) => [r.id, r])) : {},
    echoesIndex,
    weaponsIndex,
    sonatasList,
    sonatasMap: Object.fromEntries(sonatasList.map((s: any) => [s.id, s]))
  };
};
