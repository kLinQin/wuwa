import type { PageServerLoad } from './$types';
import { encoreGet } from '#lib/server/encore';

export const load: PageServerLoad = async ({ fetch }) => {
  let data: any;
  try { data = await encoreGet('en/story'); } catch { return { groups: [] }; }
  const groups = (data.storyTypes || []).map((type: any) => ({
    id: type.TypeId,
    name: type.TypeDescription,
    chapters: (type.Stories || []).map((g: any) => ({
      group: g.Group || '',
      stories: (g.Stories || []).map((s: any) => ({
        id: s.Id,
        name: s.Name,
        areaIcon: (s.AreaIcon || '').replace('https://api-v2.encore.moe/api/resource/', '/api/img/'),
        questDesc: s.QuestDesc || ''
      }))
    }))
  }));
  return { groups };
};
