import type { PageServerLoad } from './$types';
import { loadWuwaJSON } from '../lib/server/wuwa';
import { listCharacters, listWeapons, listEchoes, listSonatas } from '../lib/server/adapters';
import { getTimeline } from '../lib/server/timeline';

export const load: PageServerLoad = async ({ fetch }) => {
  const [events, home, characters, weapons, echoes, sonatas] = await Promise.all([
    (async () => {
      const tl = await getTimeline(fetch);
      return [
        ...tl.banners.map(b => ({ ...b, type: 'banner' })),
        ...tl.activities.map(a => ({ ...a, type: 'event' }))
      ];
    })(),
    loadWuwaJSON('home/sidebar-banner.json', fetch),
    listCharacters().catch(() => []),
    listWeapons().catch(() => []),
    listEchoes().catch(() => []),
    listSonatas().catch(() => [])
  ]);
  return { events, home, characters, weapons, echoes, sonatas };
};
