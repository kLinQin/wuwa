// Encore API client (server-side, cached)
const BASE = 'https://api-v2.encore.moe/api';
const TTL = 10 * 60 * 1000;
const cache = new Map<string, { data: any; t: number }>();
const pending = new Map<string, Promise<any>>();

export async function encoreGet<T = any>(path: string): Promise<T> {
  const url = `${BASE}/${path}`;
  const now = Date.now();
  const c = cache.get(url);
  if (c && now - c.t < TTL) return c.data as T;
  if (pending.has(url)) return pending.get(url) as Promise<T>;

  const p = (async () => {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Encore HTTP ${res.status} ${path}`);
      const data = await res.json();
      cache.set(url, { data, t: Date.now() });
      return data as T;
    } finally {
      pending.delete(url);
    }
  })();
  pending.set(url, p);
  return p;
}

export function clearEncoreCache() { cache.clear(); pending.clear(); }
