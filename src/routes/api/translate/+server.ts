import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ENDPOINT = 'https://translate.googleapis.com/translate_a/single';
const UA =
  'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';

const cache = new Map<string, { text: string; t: number }>();
const TTL = 1000 * 60 * 60 * 6;

let lastRequestAt = 0;
const MIN_GAP_MS = 1000;
let queue: Promise<any> = Promise.resolve();

function throttle<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(async () => {
    const wait = lastRequestAt + MIN_GAP_MS - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastRequestAt = Date.now();
    return fn();
  });
  queue = next.catch(() => {});
  return next as Promise<T>;
}

async function fetchWithRetry(url: string, maxRetry = 3): Promise<string> {
  let attempt = 0;
  while (true) {
    const res = await fetch(url, {
      headers: {
        'User-Agent': UA,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8'
      }
    });
    if (res.ok) return await res.text();
    if (res.status === 429 && attempt < maxRetry) {
      await new Promise((r) => setTimeout(r, 1000 * (1 << attempt)));
      attempt++;
      continue;
    }
    throw new Error('Upstream HTTP ' + res.status);
  }
}

function parseSingle(raw: string): string {
  const root = JSON.parse(raw);
  const segs = root?.[0] || [];
  let out = '';
  for (const seg of segs) {
    if (Array.isArray(seg) && typeof seg[0] === 'string') out += seg[0];
  }
  return out;
}

export const POST: RequestHandler = async ({ request }) => {
  let body: any;
  try { body = await request.json(); } catch { throw error(400, 'Invalid JSON'); }
  const text = String(body?.text || '').trim();
  if (!text) throw error(400, 'Missing text');
  if (text.length > 5000) throw error(400, 'Text too long (max 5000)');

  const sl = String(body?.sl || 'auto');
  const tl = String(body?.tl || 'id');
  const key = sl + '|' + tl + '|' + text;

  const c = cache.get(key);
  if (c && Date.now() - c.t < TTL) {
    return json({ text: c.text, cached: true });
  }

  const url =
    ENDPOINT +
    '?client=gtx&dt=t&sl=' + encodeURIComponent(sl) +
    '&tl=' + encodeURIComponent(tl) +
    '&q=' + encodeURIComponent(text);

  try {
    const raw = await throttle(() => fetchWithRetry(url));
    const translated = parseSingle(raw);
    cache.set(key, { text: translated, t: Date.now() });
    return json({ text: translated });
  } catch (e: any) {
    console.error('[translate]', e?.message || e);
    throw error(502, 'Translation failed');
  }
};
