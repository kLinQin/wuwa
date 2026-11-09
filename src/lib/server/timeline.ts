import { loadWuwaJSON } from './wuwa';

const __timelineCache = new Map<string, { data: any; t: number }>();
const __timelineTTL = 5 * 60 * 1000;

export async function getTimeline(fetchFn: typeof fetch): Promise<{ banners: any[]; activities: any[] }> {
  const __cached = __timelineCache.get('default');
  if (__cached && Date.now() - __cached.t < __timelineTTL) return __cached.data;

  try {
    const data = await loadWuwaJSON('events/events.json', fetchFn);
    if (!data) return { banners: [], activities: [] };
    const result = {
      banners: data.banners || [],
      activities: data.activities || []
    };
    __timelineCache.set('default', { data: result, t: Date.now() });
    return result;
  } catch (e) {
    console.log('[timeline] error:', e);
    return { banners: [], activities: [] };
  }
}
