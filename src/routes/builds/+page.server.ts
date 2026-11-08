import type { PageServerLoad } from './$types';
import { listCharacters } from '../../lib/server/adapters';
import { loadWuwaJSON } from '../../lib/server/wuwa';

export const load: PageServerLoad = async ({ fetch }) => {
  const [chars, buildsIndex, resonators] = await Promise.all([
    listCharacters(),
    loadWuwaJSON('builds/index.json', fetch),
    loadWuwaJSON('resonators/index.json', fetch)
  ]);
  const slugify = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const buildSlugs = new Set<string>((buildsIndex || []).map((b: any) => b.slug || slugify(b.name)));
  const resBySlug = new Map<string, any>();
  for (const r of (resonators || [])) resBySlug.set(slugify(r.name), r);

  const withBuilds = chars
    .filter(c => buildSlugs.has(slugify(c.name)))
    .map(c => {
      const r = resBySlug.get(slugify(c.name));
      if (!r) return c;
      return { ...c, image: r.image || c.image, icon: r.icon || c.icon };
    });
  return { items: withBuilds };
};
