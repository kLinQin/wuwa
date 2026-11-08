import type { PageServerLoad } from './$types';
import { loadWuwaJSON } from '../../lib/server/wuwa';
import { listEchoes, listSonatas } from '../../lib/server/adapters';

export const load: PageServerLoad = async ({ fetch }) => {
  const [items, sonatasList, elements] = await Promise.all([
    listEchoes(),
    listSonatas(),
    loadWuwaJSON('constants/elements.json', fetch)
  ]);
  return { items, sonatasList, elements };
};
