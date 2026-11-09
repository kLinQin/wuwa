import { error, json } from '@sveltejs/kit';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { RequestHandler } from './$types';

const REMOTE_BASE = 'https://raw.githubusercontent.com/kLinQin/wuwa-data/main';
const LOCAL_DATA_DIR = process.env.LOCAL_DATA_DIR || 'C:/Users/eggs/wuwa-data';
const isDev = process.env.NODE_ENV !== 'production';

async function fetchRemote(filePath: string, fetchFn: typeof fetch) {
  const res = await fetchFn(`${REMOTE_BASE}/${filePath}`, {
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) throw error(res.status, `Upstream error: ${res.statusText}`);
  return await res.json();
}

export const GET: RequestHandler = async ({ params, fetch }) => {
  const filePath = params.path;
  if (!filePath || filePath.includes('..')) throw error(400, 'Invalid path');

  if (isDev) {
    try {
      const abs = path.join(LOCAL_DATA_DIR, filePath);
      const raw = await fs.readFile(abs, 'utf-8');
      return json(JSON.parse(raw), { headers: { 'Cache-Control': 'no-store' } });
    } catch (e: any) {
      if (e?.code !== 'ENOENT') {
        console.error('[data proxy local]', filePath, e);
        throw error(500, 'Local read failed');
      }
      
    }
  }

  try {
    const data = await fetchRemote(filePath, fetch);
    return json(data, {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, must-revalidate' }
    });
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e) throw e;
    console.error('[data proxy remote]', filePath, e);
    throw error(502, 'Upstream fetch failed');
  }
};
