import type { PageServerLoad } from './$types';
import { loadWuwaJSON } from '../lib/server/wuwa';
import { listCharacters, listWeapons, listEchoes, listSonatas } from '../lib/server/adapters';

export const load: PageServerLoad = async ({ fetch }) => {
  const [events, home, characters, weapons, echoes, sonatas] = await Promise.all([
    loadWuwaJSON('events/events.json', fetch),
    loadWuwaJSON('home/sidebar-banner.json', fetch),
    listCharacters().catch(() => []),
    listWeapons().catch(() => []),
    listEchoes().catch(() => []),
    listSonatas().catch(() => [])
  ]);
  return { events, home, characters, weapons, echoes, sonatas };
};
