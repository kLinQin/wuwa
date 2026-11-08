import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const BASE = 'https://api-v2.encore.moe/resource';
const TTL = 60 * 60 * 24 * 7; // 7 hari

export const GET: RequestHandler = async ({ params, fetch, setHeaders }) => {
  const p = params.path || '';
  if (!p || p.includes('..')) throw error(400, 'Invalid path');
  const res = await fetch(`${BASE}/${p}`);
  if (!res.ok) throw error(res.status, 'Upstream image failed');
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw error(404, 'Not an image');
  setHeaders({
    'Content-Type': ct,
    'Cache-Control': `public, max-age=${TTL}, immutable`
  });
  return new Response(res.body, { status: 200, headers: { 'Content-Type': ct } });
};
