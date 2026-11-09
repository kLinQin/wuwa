import type { PageServerLoad } from './$types';
import { getTimeline } from '../../lib/server/timeline';

export const load: PageServerLoad = async ({ fetch }) => {
  const tl = await getTimeline(fetch);
  const items = [
    ...tl.banners.map(b => ({ ...b, type: 'banner' })),
    ...tl.activities.map(a => ({ ...a, type: 'event' }))
  ];
  return { items };
};
