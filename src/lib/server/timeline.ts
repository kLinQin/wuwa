export async function getTimeline(fetchFn: typeof fetch): Promise<{ banners: any[]; activities: any[] }> {
  try {
    const res = await fetchFn('https://wuwatracker.com/timeline', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!res.ok) { console.log('[timeline] res not ok:', res.status); return { banners: [], activities: [] }; }
    const html = await res.text();
    const matches = html.match(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/g) || [];
    let data: any = null;
    for (const m of matches) {
      if (m.includes('banners')) {
        const jsonStr = m.replace(/^self\.__next_f\.push\(\[1,"/, '').replace(/"\]\)$/, '');
        const decoded = JSON.parse('"' + jsonStr + '"');
        const idx = decoded.indexOf('{"banners"');
        if (idx >= 0) {
          const rawJson = decoded.slice(idx);
          try { data = JSON.parse(rawJson); break; }
          catch {
            const end = rawJson.lastIndexOf('}]}');
            if (end > 0) { try { data = JSON.parse(rawJson.slice(0, end + 3)); break; } catch {} }
          }
        }
      }
    }
    if (!data) { console.log('[timeline] no data found'); return { banners: [], activities: [] }; }
    const mapImg = (src: string) => src ? '/api/timeline-img?path=' + encodeURIComponent(src) : '';
    return {
      banners: (data.banners || []).map((b: any) => ({ ...b, coverImgSrc: mapImg(b.coverImgSrc) })),
      activities: (data.activities || []).map((a: any) => ({ ...a, coverImgSrc: mapImg(a.coverImgSrc) }))
    };
  } catch (e) {
    console.log('[timeline] error:', e);
    return { banners: [], activities: [] };
  }
}
