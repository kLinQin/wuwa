import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { resolveWeaponIdBySlug, getWeaponDetail } from '../../../lib/server/adapters';

export const load: PageServerLoad = async ({ params }) => {
  const id = await resolveWeaponIdBySlug(params.slug);
  if (!id) throw error(404, 'Weapon not found');
  const item = await getWeaponDetail(id);
  if (!item) throw error(404, 'Weapon not found');
  return { item };
};
