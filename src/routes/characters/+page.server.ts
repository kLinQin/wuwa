import type { PageServerLoad } from './$types';
import { loadWuwaJSON } from '../../lib/server/wuwa';
import { listCharacters } from '../../lib/server/adapters';

export const load: PageServerLoad = async ({ fetch }) => {
  const [items, elements, weaponsConst, sonatasConst] = await Promise.all([
    listCharacters(),
    loadWuwaJSON('constants/elements.json', fetch),
    loadWuwaJSON('constants/weapons.json', fetch),
    loadWuwaJSON('sonatas/sonatas.json', fetch)
  ]);
  return { elements, weaponsConst, sonatasConst, items };
};
