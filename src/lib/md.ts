

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlightNumbers(s: string): string {
  return s.replace(/(^|[^\w.])([+-]?\d+(?:[.,]\d+)?)(%|x|s)?(?:\s+(STA|ATK|HP|DEF|ER|CR|CD|DMG|Qi|detik|poin)\b)?/g, (m, pre, num, suf, unit) => {
    return pre + '<span class="md-num">' + num + (suf || '') + (unit ? ' ' + unit : '') + '</span>';
  });
}

function inline(s: string, skillMap?: Record<string, any>): string {
  return s
    .replace(/\[\[skill:([^\]]+)\]\]/g, (m, name) => {
      if (skillMap && skillMap[name]) {
        return `<button type="button" class="md-skill md-skill-btn" data-skill="${name}">${name}</button>`;
      }
      return `<span class="md-skill">${name}</span>`;
    })
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function highlight(src: string | null | undefined): string {
  if (!src) return '';
  return highlightNumbers(esc(String(src)));
}

export function md(src: string | null | undefined, skillMap?: Record<string, any>): string {
  if (!src) return '';
  const raw0 = esc(String(src)).replace(/\r\n/g, '\n');
  const protected0 = raw0.replace(/\[\[skill:([^\]]+)\]\]/g, (_m, name) => '\u0001SKILL' + name + '\u0002');
  let text = highlightNumbers(protected0).replace(/\u0001SKILL([^\u0002]+)\u0002/g, (_m, name) => '[[skill:' + name + ']]');
  const blocks = text.split(/\n{2,}/);
  const out: string[] = [];

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;

    const lines = block.split('\n');
    const isList = lines.every((l) => /^\s*[-*]\s+/.test(l));
    if (isList) {
      const items = lines.map((l) => '<li>' + inline(l.replace(/^\s*[-*]\s+/, ''), skillMap) + '</li>').join('');
      out.push('<ul>' + items + '</ul>');
    } else {
      const html = lines.map((l) => inline(l, skillMap)).join('<br>');
      out.push('<p>' + html + '</p>');
    }
  }
  return out.join('');
}
