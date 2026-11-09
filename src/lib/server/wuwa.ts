import { promises as fs } from 'node:fs';
import path from 'node:path';

const __cache = new Map<string, { data: any; t: number }>();
const __TTL = 5 * 60 * 1000;
const __useCache = process.env.NODE_ENV === 'production';

const LOCAL = process.env.LOCAL_DATA_DIR || 'C:/Users/eggs/wuwa-data';
const REMOTE = 'https://raw.githubusercontent.com/kLinQin/wuwa-data/main';
const isDev = process.env.NODE_ENV !== 'production';

export async function loadWuwaJSON(filePath: string, fetchFn: typeof fetch): Promise<any> {
  if (__useCache) {
    const c = __cache.get(filePath);
    if (c && Date.now() - c.t < __TTL) return c.data;
  }
  if (isDev) {
    try {
      const raw = await fs.readFile(path.join(LOCAL, filePath), 'utf-8');
      return JSON.parse(raw);
    } catch (e: any) {
      if (e?.code !== 'ENOENT') throw e;
    }
  }
  const res = await fetchFn(`${REMOTE}/${filePath}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (__useCache) __cache.set(filePath, { data, t: Date.now() });
  return data;
}
