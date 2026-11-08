import type { PageServerLoad } from './$types';
import { loadWuwaJSON } from '../../lib/server/wuwa';
import { listWeapons } from '../../lib/server/adapters';

export const load: PageServerLoad = async ({ fetch }) => {
  const [items, weaponsConst] = await Promise.all([
    listWeapons(),
    loadWuwaJSON('constants/weapons.json', fetch)
  ]);
  return { items, weaponsConst };
};
