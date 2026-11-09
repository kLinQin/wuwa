import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const res = await fetch(`https://api-v2.encore.moe/api/en/story/${params.slug}`);
  if (!res.ok) throw error(404, 'Story not found');
  const item = await res.json();
  const proxy = (u: string) => {
    if (!u) return '';
    return u.replace('https://api-v2.encore.moe/api/resource/', '/api/img/');
  };
  item.MaleTexture = proxy(item.MaleTexture);
  item.FemaleTexture = proxy(item.FemaleTexture);
  item.AreaIcon = proxy(item.AreaIcon);
  return { item };
};
