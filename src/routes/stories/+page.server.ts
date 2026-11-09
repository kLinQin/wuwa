import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('https://api-v2.encore.moe/api/en/story');
  if (!res.ok) return { groups: [] };
  const data = await res.json();
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
