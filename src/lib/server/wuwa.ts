import { env } from '$env/dynamic/private';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const LOCAL = env.LOCAL_DATA_DIR || 'C:/Users/eggs/wuwa-data';
const REMOTE = 'https://raw.githubusercontent.com/kLinQin/wuwa-data/main';
const isDev = process.env.NODE_ENV !== 'production';

export async function loadWuwaJSON(filePath: string, fetchFn: typeof fetch): Promise<any> {
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
  return res.json();
}
