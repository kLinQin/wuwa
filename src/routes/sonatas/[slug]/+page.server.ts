import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { resolveSonataIdBySlug, getSonataDetail, listEchoes } from '../../../lib/server/adapters';

export const load: PageServerLoad = async ({ params }) => {
  const id = await resolveSonataIdBySlug(params.slug);
  if (!id) throw error(404, 'Sonata not found');
  const [item, echoesAll] = await Promise.all([getSonataDetail(id), listEchoes()]);
  if (!item) throw error(404, 'Sonata not found');
  const associatedEchoes = echoesAll.filter((e: any) => (e.sonatas || []).includes(item.id));
  return { item, associatedEchoes };
};
