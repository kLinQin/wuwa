import type { PageServerLoad } from './$types';
import { listSonatas } from '../../lib/server/adapters';

export const load: PageServerLoad = async () => {
  const items = await listSonatas();
  return { items };
};
