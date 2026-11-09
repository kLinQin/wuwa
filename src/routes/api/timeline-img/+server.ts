import { error } from '@sveltejs/kit';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { RequestHandler } from './$types';

const CACHE_DIR = path.resolve('static/cache/img');
const TTL_MS = 1000 * 60 * 60 * 24 * 7;

function hashOf(s: string): string {
  return crypto.createHash('sha1').update(s).digest('hex');
}

export const GET: RequestHandler = async ({ url, fetch, setHeaders }) => {
  const p = url.searchParams.get('path');
  if (!p || !p.startsWith('/api/event-cover-images/')) throw error(400, 'Invalid path');

  const hash = hashOf(p);
  const cachePath = path.join(CACHE_DIR, hash + '.bin');
  const metaPath = path.join(CACHE_DIR, hash + '.meta.json');

  try {
    const stat = await fs.stat(cachePath);
    if (Date.now() - stat.mtimeMs < TTL_MS) {
      const meta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
      const buf = await fs.readFile(cachePath);
      setHeaders({ 'Content-Type': meta.contentType || 'image/png', 'Cache-Control': 'public, max-age=604800, immutable', 'X-Cache': 'HIT' });
      return new Response(buf, { status: 200 });
    }
  } catch {}

  const res = await fetch('https://wuwatracker.com' + p);
  if (!res.ok) throw error(res.status, 'Failed');
  const ct = res.headers.get('content-type') || 'image/png';
  const buf = Buffer.from(await res.arrayBuffer());

  fs.mkdir(CACHE_DIR, { recursive: true })
    .then(() => Promise.all([
      fs.writeFile(cachePath, buf),
      fs.writeFile(metaPath, JSON.stringify({ contentType: ct }))
    ]))
    .catch((e) => console.error('[timeline-img cache]', e));

  setHeaders({ 'Content-Type': ct, 'Cache-Control': 'public, max-age=604800, immutable', 'X-Cache': 'MISS' });
  return new Response(buf, { status: 200 });
};
