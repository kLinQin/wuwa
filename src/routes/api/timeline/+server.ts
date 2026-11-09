import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTimeline } from '#lib/server/timeline';

export const GET: RequestHandler = async ({ fetch }) => {
  const data = await getTimeline(fetch);
  return json(data, { headers: { 'Cache-Control': 'public, max-age=3600' } });
};
