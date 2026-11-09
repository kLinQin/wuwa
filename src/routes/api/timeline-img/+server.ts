import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const p = url.searchParams.get('path');
  if (!p || !p.startsWith('/api/event-cover-images/')) throw error(400, 'Invalid path');
  const res = await fetch('https://wuwatracker.com' + p);
  if (!res.ok) throw error(res.status, 'Failed');
  const ct = res.headers.get('content-type') || 'image/png';
  return new Response(res.body, { headers: { 'Content-Type': ct, 'Cache-Control': 'public, max-age=604800' } });
};
