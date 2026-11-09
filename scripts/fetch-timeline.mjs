#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { extname } from 'node:path';

const URL = 'https://wuwatracker.com/timeline';
const OUT_JSON = process.env.OUT || 'C:/Users/eggs/wuwa-data/events/events.json';
const OUT_IMG_DIR = 'static/event';

mkdirSync(OUT_IMG_DIR, { recursive: true });

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function downloadCover(src, name) {
  if (!src) return '';
  const url = src.startsWith('http') ? src : 'https://wuwatracker.com' + src;
  let ext = extname(src) || '.png';
  if (!ext || ext.length > 5) ext = '.png';
  const base = slugify(name) || createHash('sha1').update(src).digest('hex').slice(0, 12);
  const filename = base + ext;
  const filePath = OUT_IMG_DIR + '/' + filename;
  if (existsSync(filePath)) return '/event/' + filename;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) { console.warn('img fail', res.status, url); return ''; }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(filePath, buf);
    console.log('saved', filePath);
    return '/event/' + filename;
  } catch (e) {
    console.warn('img err', url, e.message);
    return '';
  }
}

const res = await fetch(URL, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
if (!res.ok) { console.error('HTTP', res.status); process.exit(1); }
const html = await res.text();
const matches = html.match(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/g) || [];

let data = null;
for (const m of matches) {
  if (!m.includes('banners')) continue;
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

if (!data) { console.error('No data found'); process.exit(1); }

const banners = [];
for (const b of (data.banners || [])) {
  const cover = await downloadCover(b.coverImgSrc, 'banner-' + (b.name || b.id));
  banners.push({ ...b, coverImgSrc: cover });
}
const activities = [];
for (const a of (data.activities || [])) {
  const cover = await downloadCover(a.coverImgSrc, 'activity-' + (a.name || a.id));
  activities.push({ ...a, coverImgSrc: cover });
}

const out = { fetchedAt: new Date().toISOString(), banners, activities };
mkdirSync(OUT_JSON.replace(/[\\/][^\\/]+$/, ''), { recursive: true });
writeFileSync(OUT_JSON, JSON.stringify(out, null, 2));
console.log('Wrote', OUT_JSON, '| banners:', banners.length, '| activities:', activities.length);
