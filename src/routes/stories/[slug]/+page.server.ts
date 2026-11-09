import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { encoreGet } from '#lib/server/encore';

export const load: PageServerLoad = async ({ params, fetch }) => {
  let item: any;
  try { item = await encoreGet(`en/story/${params.slug}`); } catch { throw error(404, 'Story not found'); }
  const proxy = (u: string) => {
    if (!u) return '';
    return u.replace('https://api-v2.encore.moe/api/resource/', '/api/img/');
  };
  item.MaleTexture = proxy(item.MaleTexture);
  item.FemaleTexture = proxy(item.FemaleTexture);
  item.AreaIcon = proxy(item.AreaIcon);
  return { item };
};
