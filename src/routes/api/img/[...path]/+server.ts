import { error } from '@sveltejs/kit';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { RequestHandler } from './$types';

const BASE = 'https://api-v2.encore.moe/resource';
const CACHE_DIR = path.resolve('static/cache/img');
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 hari

function hashOf(s: string): string {
  return crypto.createHash('sha1').update(s).digest('hex');
}

async function ensureDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

export const GET: RequestHandler = async ({ params, fetch, setHeaders }) => {
  const p = params.path || '';
  if (!p || p.includes('..')) throw error(400, 'Invalid path');

  const hash = hashOf(p);
  const cachePath = path.join(CACHE_DIR, hash + '.bin');
  const metaPath = path.join(CACHE_DIR, hash + '.meta.json');

  // cek cache
  try {
    const stat = await fs.stat(cachePath);
    const age = Date.now() - stat.mtimeMs;
    if (age < TTL_MS) {
      const meta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
      const buf = await fs.readFile(cachePath);
      setHeaders({
        'Content-Type': meta.contentType || 'image/webp',
        'Cache-Control': 'public, max-age=604800, immutable',
        'X-Cache': 'HIT'
      });
      return new Response(buf, { status: 200 });
    }
  } catch {
    // miss
  }

  // fetch upstream
  const res = await fetch(`${BASE}/${p}`);
  if (!res.ok) throw error(res.status, 'Upstream image failed');
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw error(404, 'Not an image');

  const buf = Buffer.from(await res.arrayBuffer());

  // simpan ke cache (non-blocking)
  ensureDir()
    .then(() => Promise.all([
      fs.writeFile(cachePath, buf),
      fs.writeFile(metaPath, JSON.stringify({ contentType: ct }))
    ]))
    .catch((e) => console.error('[img cache write]', e));

  setHeaders({
    'Content-Type': ct,
    'Cache-Control': 'public, max-age=604800, immutable',
    'X-Cache': 'MISS'
  });
  return new Response(buf, { status: 200 });
};
