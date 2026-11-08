import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { resolveEchoIdBySlug, getEchoDetail, listSonatas } from '../../../lib/server/adapters';

export const load: PageServerLoad = async ({ params }) => {
  const id = await resolveEchoIdBySlug(params.slug);
  if (!id) throw error(404, 'Echo not found');
  const [item, sonatasList] = await Promise.all([getEchoDetail(id), listSonatas()]);
  if (!item) throw error(404, 'Echo not found');
  return {
    item,
    sonatasMap: Object.fromEntries(sonatasList.map((s: any) => [s.id, s]))
  };
};
