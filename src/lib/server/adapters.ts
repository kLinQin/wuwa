import { encoreGet } from './encore';


export function slugify(name: string): string {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function stripHtml(s: string): string {
  if (!s) return '';
  return String(s)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
function pickText(v: any): string {
  if (!v) return '';
  if (typeof v === 'string') return stripHtml(v);
  if (v.Content) return stripHtml(v.Content);
  return '';
}


function proxyImg(url: string | undefined): string {
  if (!url) return '';
  const prefix = 'https://api-v2.encore.moe/api/resource/';
  if (url.startsWith(prefix)) return '/api/img/' + url.slice(prefix.length);
  return url;
}

const NAME_TO_ELEMENT_ID: Record<string, number> = {
  glacio: 1, fusion: 2, electro: 3, aero: 4, spectro: 5, havoc: 6
};
const NAME_TO_WEAPON_ID: Record<string, number> = {
  broadblade: 1, sword: 2, pistols: 3, pistol: 3, gauntlet: 4, gauntlets: 4, rectifier: 5
};


export interface RawCharListItem {
  Id: number; Name: string; QualityId: number;
  Element?: { Id: number; Name: string };
  WeaponType?: { Id: number; Name: string };
  RoleHeadIcon?: string;
}
export interface RawCharList { roleList?: RawCharListItem[]; }

let charListCache: RawCharListItem[] | null = null;
async function getCharListRaw(): Promise<RawCharListItem[]> {
  if (charListCache) return charListCache;
  const d = await encoreGet<RawCharList>('en/character');
  charListCache = d.roleList || [];
  return charListCache;
}

export async function listCharacters(): Promise<any[]> {
  const raw = await getCharListRaw();
  
  const seenIds = new Set<number>();
  const unique = raw.filter(c => {
    if (seenIds.has(c.Id)) return false;
    seenIds.add(c.Id);
    return true;
  });
  return unique.map(c => ({
    id: c.Id,
    slug: String(c.Id),
    name: c.Name,
    element: c.Element?.Id ?? NAME_TO_ELEMENT_ID[(c.Element?.Name || '').toLowerCase()] ?? 0,
    weapon: c.WeaponType?.Id ?? NAME_TO_WEAPON_ID[(c.WeaponType?.Name || '').toLowerCase()] ?? 0,
    rarity: c.QualityId,
    icon: proxyImg(c.RoleHeadIcon),
    image: proxyImg(c.RoleHeadIcon),
    roles: [], sonatas: [], class: '', faction: '', version: ''
  }));
}

const SKILL_KEY_MAP: Record<string, string> = {
  'Normal Attack': 'basic',
  'Resonance Skill': 'skill',
  'Resonance Liberation': 'liberation',
  'Forte Circuit': 'forte',
  'Intro Skill': 'intro',
  'Outro Skill': 'outro',
  'Inherent Skill': 'inherent',
  'Tune Break': 'inherent'
};


function propValueAt(prop: any, level: number): number | string {
  const g = (prop.GrowthValues || []).find((x: any) => x.level === level);
  return g ? g.value : (prop.BaseValue ?? 0);
}

function mapProperties(props: any[]): Array<{ name: string; base: number | string; lv90: number | string }> {
  return (props || []).map(p => ({
    name: p.Name,
    base: p.BaseValue,
    lv90: propValueAt(p, 90)
  }));
}


let itemIndexCache: Map<number, any> | null = null;
async function getItemIndex(): Promise<Map<number, any>> {
  if (itemIndexCache) return itemIndexCache;
  const d = await encoreGet<any>('en/item');
  const m = new Map<number, any>();
  for (const it of (d.itemList || [])) {
    m.set(it.Id, {
      id: it.Id,
      name: it.Name,
      tier: it.QualityId || 0,
      image: proxyImg(it.Icon),
      typeName: it.TypeName
    });
  }
  itemIndexCache = m;
  return m;
}

function buildMaterials(d: any, itemIdx: Map<number, any>): { materials: any; itemMap: Record<number, any> } {
  const asc: Record<number, number> = {};
  for (const b of (d.Breaches || [])) {
    for (const c of (b.BreachConsume || [])) {
      asc[c.Key] = (asc[c.Key] || 0) + c.Value;
    }
  }

  
  const uniqueSkillMats = new Set<number>();
  for (const t of (d.SkillTree || [])) {
    for (const c of (t.Consume || [])) {
      uniqueSkillMats.add(c.Key);
    }
  }

  
  const staticSkillAmounts: Record<string, number> = {
    
    'shellCredit': 2030000,
    
    'commonT1': 25,
    'commonT2': 28,
    'commonT3': 40,
    'commonT4': 57,
    
    'skillT1': 25,
    'skillT2': 28,
    'skillT3': 55,
    'skillT4': 67,
    
    'weeklyBoss': 26
  };

  
  
  
  const sk: Record<number, number> = {};

  
  sk[2] = staticSkillAmounts['shellCredit'];

  
  const sortedMats = Array.from(uniqueSkillMats).sort((a, b) => a - b);

  
  
  
  

  const commonMats: number[] = [];
  const skillMats: number[] = [];

  for (const id of sortedMats) {
    if (id === 2) continue; 
    const item = itemIdx.get(id);
    if (!item) continue;

    const name = (item.name || '').toLowerCase();
    
    if (name.includes('whisperin') || name.includes('ring') || name.includes('howler')) {
      commonMats.push(id);
    } else {
      
      skillMats.push(id);
    }
  }

  function completeSeries(baseNamePart: string, amounts: number[]) {
    const series = Array.from(itemIdx.values())
      .filter(x => (x.name || '').toLowerCase().includes(baseNamePart))
      .sort((a, b) => a.tier - b.tier);
    for (let i = 0; i < Math.min(4, series.length); i++) {
      sk[series[i].id] = amounts[i];
    }
  }

  if (commonMats.length > 0) {
    const name = (itemIdx.get(commonMats[0])?.name || '').toLowerCase();
    let base = '';
    if (name.includes('whisperin')) base = 'whisperin core';
    else if (name.includes('ring')) base = 'ring';
    else if (name.includes('howler')) base = 'howler core';
    if (base) completeSeries(base, [staticSkillAmounts['commonT1'], staticSkillAmounts['commonT2'], staticSkillAmounts['commonT3'], staticSkillAmounts['commonT4']]);
  }

  let skillBase = '';
  let weeklyBossId = 0;
  for (const id of skillMats) {
    const item = itemIdx.get(id);
    const name = (item?.name || '').toLowerCase();
    if (name.includes('drip')) skillBase = 'metallic drip';
    else if (name.includes('helix')) skillBase = 'helix';
    else if (name.includes('phlogiston')) skillBase = 'phlogiston';
    else if (name.includes('polarizer')) skillBase = 'polarizer';
    else weeklyBossId = id;
  }
  if (skillBase) completeSeries(skillBase, [staticSkillAmounts['skillT1'], staticSkillAmounts['skillT2'], staticSkillAmounts['skillT3'], staticSkillAmounts['skillT4']]);
  if (weeklyBossId) sk[weeklyBossId] = staticSkillAmounts['weeklyBoss'];

  const toList = (obj: Record<number, number>) =>
    Object.entries(obj).map(([k, v]) => ({ item: Number(k), amount: v }));
  const itemMap: Record<number, any> = {};
  for (const k of [...Object.keys(asc), ...Object.keys(sk)]) {
    const it = itemIdx.get(Number(k));
    if (it) itemMap[it.id] = it;
  }
  return {
    materials: {
      ascension: [{ cost: toList(asc), level: 90 }],
      skills: { totalCosts: toList(sk) }
    },
    itemMap
  };
}

export async function getCharacterDetail(encoreId: number): Promise<any | null> {
  let d: any;
  try { d = await encoreGet<any>(`en/character/${encoreId}`); } catch { return null; }
  if (!d || !d.Id) return null;

  const itemIdx = await getItemIndex();
  
  const skills: Record<string, any> = {};
  const inherent: any[] = [];
  const skillsObj = d.Skills || {};
  for (const k of Object.keys(skillsObj)) {
    const s = skillsObj[k];
    const key = SKILL_KEY_MAP[s.SkillType] || 'other';
    const entry = {
      name: s.SkillName || '',
      description: '',
      effects: [{ title: '', description: stripHtml(s.SkillDescribe || ''), isTitleVisible: false }],
      attributes: (s.SkillAttributes || []).map((att: any) => ({
        name: att.attributeName,
        values: att.values || []
      })).filter((x: any) => x.values.length > 0)
    };
    if (key === 'inherent') {
      if (!/skillful cooking/i.test(entry.name)) {
        inherent.push({ name: entry.name, effects: entry.effects });
      }
    }
    else if (!skills[key]) skills[key] = entry;
  }
  if (inherent.length) skills.inherent = inherent;

  
  const sequences = (d.ResonantChain || [])
    .slice()
    .sort((a: any, b: any) => (a.GroupIndex || a.Id) - (b.GroupIndex || b.Id))
    .map((rc: any, i: number) => ({
      stage: 'S' + (i + 1),
      name: (rc.NodeName || '').replace(/\s+/g, ' ').trim(),
      effects: [{ title: '', description: stripHtml(rc.AttributesDescription || ''), isTitleVisible: false }]
    }));

  
  const roles: any[] = (d.Tags || []).filter((t: any) => t.TagName).map((t: any) => ({
    name: t.TagName,
    desc: stripHtml(t.TagDesc || ''),
    icon: t.TagIcon ? ('/api/img/Data' + t.TagIcon) : '',
    color: t.TagNameColor ? ('#' + t.TagNameColor) : ''
  }));

  return {
    id: d.Id,
    slug: String(d.Id),
    name: pickText(d.Name) || d.Name?.Content || '',
    element: d.ElementId ?? 0,
    weapon: d.WeaponType ?? 0,
    rarity: d.QualityId ?? 0,
    icon: proxyImg(d.RoleHeadIconLarge || d.RoleHeadIcon || d.Icon),
    image: proxyImg(d.RoleHeadIconLarge),
    imageBanner: proxyImg(d.RolePortrait || d.RoleStand),
    class: '',
    faction: pickText(d.favorRole?.Country) || '',
    affiliation: pickText(d.favorRole?.Influence) || '',
    version: '',
    roles,
    sonatas: [],
    skills,
    sequences,
    changelog: [],
    intro: pickText(d.Introduction),
    mechanics: (() => {
      const si = (d.SkillInputs || [])[0];
      if (!si) return null;
      const proxyHtml = (html: string) => String(html || '').replace(
        /https:\/\/api-v2\.encore\.moe\/api\/resource\//g,
        '/api/img/'
      );
      return {
        icon: proxyImg(si.Icon),
        descriptions: (si.DescList || []).map((x: string) => stripHtml(x)),
        inputs: (si.InputDetails || []).map((x: any) => ({ html: proxyHtml(x.description) }))
      };
    })(),
    levelStats: (d.Properties || []).reduce((acc: any, p: any) => {
      for (const g of (p.GrowthValues || [])) {
        acc[g.level] = acc[g.level] || {};
        acc[g.level][p.Name] = g.value;
      }
      return acc;
    }, {}),
    stats: mapProperties(d.Properties || []),
    favor: {
      birthday: pickText(d.favorRole?.Birthday),
      sex: pickText(d.favorRole?.Sex),
      country: pickText(d.favorRole?.Country),
      influence: pickText(d.favorRole?.Influence),
      cvEn: pickText(d.favorRole?.CVNameEn),
      cvCn: pickText(d.favorRole?.CVNameCn),
      cvJp: pickText(d.favorRole?.CVNameJp),
      cvKo: pickText(d.favorRole?.CVNameKo)
    },
    stories: (d.Stories || []).map((s: any) => ({ title: stripHtml(s.Title || ''), content: stripHtml(s.Content || '') })),
    words: (d.Words || []).map((w: any) => ({ title: stripHtml(w.Title || ''), content: stripHtml(w.Content || '') })),
    goods: (d.Goods || []).map((g: any) => ({ title: stripHtml(g.Title || ''), content: stripHtml(g.Content || ''), pic: proxyImg(g.Pic) })),
    ...buildMaterials(d, itemIdx),
    skillTree: (d.SkillTree || []).map((t: any) => ({
      title: stripHtml(t.PropertyNodeTitle || ''),
      desc: stripHtml(t.PropertyNodeDescribe || '')
    }))
  };
}


export interface RawWeaponListItem {
  Id: number; Name: string; QualityId: number; Type: number; TypeName?: string; Icon?: string;
}
export interface RawWeaponList { weapons?: RawWeaponListItem[]; }
let weaponListCache: RawWeaponListItem[] | null = null;
async function getWeaponListRaw(): Promise<RawWeaponListItem[]> {
  if (weaponListCache) return weaponListCache;
  const d = await encoreGet<RawWeaponList>('en/weapon');
  weaponListCache = d.weapons || [];
  return weaponListCache;
}

export async function listWeapons(): Promise<any[]> {
  const raw = await getWeaponListRaw();
  return raw.map(wp => ({
    id: wp.Id,
    slug: String(wp.Id),
    name: wp.Name,
    weaponType: wp.Type,
    rarity: wp.QualityId,
    image: proxyImg(wp.Icon),
    subStat: '',
    stats: [0, 0],
    version: ''
  }));
}

export async function getWeaponDetail(encoreId: number): Promise<any | null> {
  let d: any;
  try { d = await encoreGet<any>(`en/weapon/${encoreId}`); } catch { return null; }
  if (!d || !d.ItemId) return null;
  const props = d.Properties || [];
  const atkPropObj = props[0];
  const subPropObj = props[1];
  let subName = subPropObj?.Name || '';
  if ((!subName || subName === 'ATK') && d.SecondPropId?.Id === 10007) subName = 'ATK%';

  const atkProp = atkPropObj;
  const subProp = subPropObj;

  const stats: Record<number, [number, number]> = {};
  if (atkProp && atkProp.GrowthValues) {
    for (const g of atkProp.GrowthValues) {
      const lvl = g.Level;
      const atk = parseFloat(g.Value);
      let subVal = 0;
      if (subProp && subProp.GrowthValues) {
        const sg = subProp.GrowthValues.find((x: any) => x.Level === lvl);
        if (sg) subVal = parseFloat(sg.Value);
      }
      stats[lvl] = [atk, subVal];
    }
  }

  return {
    id: d.ItemId,
    slug: String(d.ItemId),
    name: d.WeaponName,
    weaponType: d.WeaponType,
    rarity: d.QualityId,
    image: d.Icon ? ('/api/img/Data' + d.Icon.replace(/\.[^./]+$/, '') + '.webp') : '',
    subStat: subName,
    stats,
    version: '',
    passive: (() => {
      const raw = stripHtml(d.Desc || '');
      const ranks: string[] = [];
      for (let i = 0; i < 5; i++) {
        ranks.push(raw.replace(/([\d.]+%?\/){1,}[\d.]+%?/g, (m) => {
          const parts = m.split('/');
          return parts[i] !== undefined ? parts[i] : parts[0];
        }));
      }
      return {
        name: d.ResonName || 'Weapon Skill',
        description: raw,
        refinements: ranks
      };
    })(),
    lore: stripHtml(d.BgDescription || '')
  };
}

function propName(id: number): string {
  const map: Record<number, string> = {
    1: 'HP', 2: 'HP%', 3: 'DEF', 4: 'DEF%', 5: 'ATK', 6: 'ATK%',
    7: 'CRIT Rate', 8: 'CRIT DMG', 9: 'Energy Regen', 10: 'Healing Bonus',
    11: 'ATK%', 12: 'DEF%', 13: 'HP%', 14: 'Energy Regen',
    10001: 'HP%', 10002: 'ATK%', 10003: 'DEF%',
    10004: 'CRIT Rate', 10005: 'CRIT DMG', 10006: 'Energy Regen',
    10007: 'ATK%', 10008: 'CRIT Rate', 10009: 'CRIT DMG',
    10010: 'HP%'
  };
  return map[id] || ('Stat ' + id);
}


export interface RawEchoListItem {
  Id: number; Name: string; Rarity: number; Icon?: string;
  Element?: { Id: number; Name: string };
  FetterGroups?: Array<{
    Id: number; Name: string; Icon?: string;
    Fetters?: Array<{ Key: number; EffectDescription: string }>;
  }>;
}
export interface RawEchoList { Echo?: RawEchoListItem[]; }
let echoListCache: RawEchoListItem[] | null = null;
async function getEchoListRaw(): Promise<RawEchoListItem[]> {
  if (echoListCache) return echoListCache;
  const d = await encoreGet<RawEchoList>('en/echo');
  echoListCache = d.Echo || [];
  return echoListCache;
}

export async function listEchoes(): Promise<any[]> {
  const raw = await getEchoListRaw();
  return raw.map(e => ({
    id: e.Id,
    name: e.Name,
    slug: String(e.Id),
    image: proxyImg(e.Icon),
    description: '',
    sonatas: (e.FetterGroups || []).map(g => g.Id),
    cost: ([1,3,4,4][e.Rarity ?? 0] ?? 1),
    rarity: e.Rarity,
    elementId: e.Element?.Id ?? 0,
    version: ''
  }));
}

export async function getEchoDetail(encoreId: number): Promise<any | null> {
  let d: any;
  try { d = await encoreGet<any>(`en/echo/${encoreId}`); } catch { return null; }
  if (!d || !d.ItemId) return null;
  const hb = d.Handbook || {};
  const fdetails = d.FetterDetails || {};
  const sonataDetails = (d.FetterGroupDetails || []).map((fg: any) => {
    const g = fg.Group || {};
    const name = g.FetterGroupName || '';
    const fd = fdetails[name] || {};
    return {
      id: g.Id,
      name,
      icon: g.FetterElementPath ? ('/api/img/Data' + g.FetterElementPath.replace(/\.[^./]+$/, '') + '.webp') : '',
      color: g.FetterElementColor ? ('#' + g.FetterElementColor.slice(0, 6)) : '',
      effects: (fd.EffectDescriptions || []).map((e: string, i: number) => ({
        key: (fd.EffectKeys || [])[i] || (i + 1) * 2,
        description: stripHtml(e)
      })),
      description: (() => { const d = stripHtml((fd.DefineDescriptions || [])[0] || ''); return d === '???' ? '' : d; })()
    };
  });

  return {
    id: d.MonsterId,
    name: d.MonsterName || '',
    slug: String(d.MonsterId || ''),
    image: proxyImg(d.Icon),
    description: stripHtml(d.Skill?.DescriptionEx || d.AttributesDescription || ''),
    sonatas: d.FetterGroup || [],
    sonataDetails,
    cost: ([1,3,4,4][d.Rarity ?? 0] ?? 1),
    rarity: d.Rarity ?? 0,
    elementId: (d.ElementType && d.ElementType[0]) || d.Element?.Id || 0,
    version: '',
    echoClass: stripHtml(hb.TypeDescrtption || ''),
    location: stripHtml(hb.Place || ''),
    possibleStats: (hb.Descrtption1 || '').replace(/\[([^\]]+)\]/g, '$1').replace(/\s+/g, ' ').trim()
  };
}

export async function listSonatas(): Promise<any[]> {
  const echos = await getEchoListRaw();
  const byId = new Map<number, any>();
  for (const e of echos) {
    for (const g of (e.FetterGroups || [])) {
      if (!byId.has(g.Id)) {
        byId.set(g.Id, {
          id: g.Id,
          name: g.Name,
          slug: String(g.Id),
          image: proxyImg(g.Icon),
          fetters: [],
          version: '',
          color: ''
        });
      }
      const entry = byId.get(g.Id);
      for (const f of (g.Fetters || [])) {
        if (!entry.fetters.find((x: any) => x.key === f.Key)) {
          entry.fetters.push({ key: f.Key, effectDescription: stripHtml(f.EffectDescription) });
        }
      }
    }
  }
  return Array.from(byId.values()).sort((a, b) => a.id - b.id);
}

export async function getSonataDetail(encoreId: number): Promise<any | null> {
  const all = await listSonatas();
  return all.find(s => s.id === encoreId) || null;
}


export async function resolveCharIdBySlug(slug: string): Promise<number | null> {
  const raw = await getCharListRaw();
  const found = raw.find(c => String(c.Id) === slug || slugify(c.Name) === slug);
  return found ? found.Id : null;
}
export async function resolveWeaponIdBySlug(slug: string): Promise<number | null> {
  const raw = await getWeaponListRaw();
  const found = raw.find(w => String(w.Id) === slug || slugify(w.Name) === slug);
  return found ? found.Id : null;
}
export async function resolveEchoIdBySlug(slug: string): Promise<number | null> {
  const raw = await getEchoListRaw();
  const found = raw.find(e => String(e.Id) === slug);
  return found ? found.Id : null;
}
export async function resolveSonataIdBySlug(slug: string): Promise<number | null> {
  const all = await listSonatas();
  const found = all.find(s => String(s.id) === slug || s.slug === slug);
  return found ? found.id : null;
}
