import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { resolveCharIdBySlug, getCharacterDetail, listEchoes, listWeapons, listSonatas } from '../../../lib/server/adapters';
import { loadWuwaJSON } from '../../../lib/server/wuwa';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const [encoreId, buildData] = await Promise.all([
    resolveCharIdBySlug(params.slug),
    loadWuwaJSON(`builds/${params.slug}.json`, fetch)
  ]);
  if (!encoreId) throw error(404, 'Character not found');
  if (!buildData) throw error(404, 'Build not found');

  const [encoreChar, wuwaChar, teamsIndex, rolesIndex, echoesIndex, weaponsIndex, sonatasList] = await Promise.all([
    getCharacterDetail(encoreId),
    loadWuwaJSON(`resonators/${params.slug}.json`, fetch),
    loadWuwaJSON('teams/index.json', fetch),
    loadWuwaJSON('constants/combatRoles.json', fetch),
    listEchoes().catch(() => []),
    listWeapons().catch(() => []),
    listSonatas().catch(() => [])
  ]);
  if (!encoreChar) throw error(404, 'Character not found');

  const item = {
    ...encoreChar,
    ...(wuwaChar ? {
      icon: wuwaChar.icon || encoreChar.icon,
      image: wuwaChar.image || encoreChar.image,
      imageBanner: wuwaChar.imageBanner || encoreChar.imageBanner
    } : {}),
    recommendedStats: buildData.recommendedStats,
    build: buildData.build,
    analysisCharts: buildData.analysisCharts,
    changelog: buildData.changelog || []
  };

  return {
    item,
    teamsMap: teamsIndex ? Object.fromEntries(teamsIndex.map((t: any) => [t.id, t])) : {},
    rolesMap: rolesIndex ? Object.fromEntries(rolesIndex.map((r: any) => [r.id, r])) : {},
    echoesIndex,
    weaponsIndex,
    sonatasList,
    sonatasMap: Object.fromEntries(sonatasList.map((s: any) => [s.id, s]))
  };
};
