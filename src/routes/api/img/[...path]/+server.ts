import { error } from '@sveltejs/kit';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { RequestHandler } from './$types';

const BASE = 'https://api-v2.encore.moe';
const CACHE_DIR = path.resolve('static/cache/img');
const TTL_MS = 1000 * 60 * 60 * 24 * 7; 

const NEG_TTL_MS = 1000 * 60 * 5;
const pending = new Map<string, Promise<Buffer>>();
const negative = new Map<string, number>();

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
    
  }

  
  const negAt = negative.get(p);
  if (negAt && Date.now() - negAt < NEG_TTL_MS) {
    throw error(404, 'Cached upstream failure');
  }

  let task = pending.get(p);
  if (!task) {
    task = (async () => {
      const res = await fetch(`${BASE}/${p}`);
      if (!res.ok) {
        negative.set(p, Date.now());
        throw error(res.status, 'Upstream image failed');
      }
      const ct = res.headers.get('content-type') || '';
      if (!ct.startsWith('image/')) {
        negative.set(p, Date.now());
        throw error(404, 'Not an image');
      }
      const buf = Buffer.from(await res.arrayBuffer());
      await ensureDir();
      await Promise.all([
        fs.writeFile(cachePath, buf),
        fs.writeFile(metaPath, JSON.stringify({ contentType: ct }))
      ]).catch((e) => console.error('[img cache write]', e));
      setHeaders({
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=604800, immutable',
        'X-Cache': 'MISS'
      });
      return buf;
    })().finally(() => pending.delete(p));
    pending.set(p, task);
  }

  const buf = await task;
  return new Response(buf, { status: 200 });
};
