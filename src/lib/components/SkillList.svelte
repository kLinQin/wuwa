<script lang="ts">
  import Markdown from '#lib/components/Markdown.svelte';
  import SkillCard from './SkillCard.svelte';
  import Slider from './Slider.svelte';

  let { skills, charSlug }: { skills: any; charSlug: string } = $props();

  const orderedKeys = ['basic', 'skill', 'liberation', 'forte', 'intro', 'outro'];
  const labels: Record<string, string> = {
    basic: 'Basic Attack', skill: 'Resonance Skill', liberation: 'Resonance Liberation',
    forte: 'Forte Circuit', intro: 'Intro Skill', outro: 'Outro Skill'
  };
  const iconSuffix: Record<string, string> = {
    basic: 'na', skill: 'rs', liberation: 'rl', forte: 'fc', intro: 'intro', outro: 'outro'
  };

  const skillMap: Record<string, { type: string; name: string; description: string }> = {};
  for (const k of Object.keys(skills || {})) {
    if (k === 'inherent') continue;
    const sk = (skills as any)[k];
    if (sk?.name) {
      const desc = (sk.effects || []).map((e: any) => e.description).filter(Boolean).join('\n');
      skillMap[sk.name] = { type: labels[k] || k, name: sk.name, description: desc };
    }
  }
  for (const inh of ((skills as any).inherent || [])) {
    if (inh?.name) {
      const desc = (inh.effects || []).map((e: any) => e.description).filter(Boolean).join('\n');
      skillMap[inh.name] = { type: 'Inherent Skill', name: inh.name, description: desc };
    }
  }

  const levels: Record<string, number> = $state({});
  function getLevel(key: string) { return levels[key] ?? 10; }
  function setLevel(key: string, v: number) { levels[key] = v; }
</script>

<div class="skill-list">
  <div class="grid-2">
    {#each orderedKeys as key}
      {#if skills[key]}
        {@const lv = getLevel(key)}
        <SkillCard icon={skills[key].icon} typeLabel={labels[key]} name={skills[key].name || ''}>
          {#if skills[key].description}
            <div class="desc"><Markdown text={skills[key].description} skillsMap={skillMap} /></div>
          {/if}
          {#if skills[key].effects}
            <ul class="effects">
              {#each skills[key].effects as eff}
                <li>
                  {#if eff.isTitleVisible && eff.title}<strong>{eff.title}</strong>{/if}
                  <Markdown text={eff.description} skillsMap={skillMap} />
                </li>
              {/each}
            </ul>
          {/if}

          {#if skills[key].attributes && skills[key].attributes.length}
            <div class="multiplier">
              <Slider label="Skill Level" value={lv} min={1} max={10} onchange={(v) => setLevel(key, v)} />
              <table class="mult-table">
                <thead><tr><th>Attribute</th><th>Value</th></tr></thead>
                <tbody>
                  {#each skills[key].attributes as att}
                    <tr><td>{att.name}</td><td>{att.values[lv - 1] ?? ''}</td></tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </SkillCard>
      {/if}
    {/each}

    {#if skills.inherent && Array.isArray(skills.inherent)}
      {#each skills.inherent as inh, idx}
        <SkillCard icon={inh.icon} typeLabel={`Inherent ${idx + 1}`} name={inh.name || ''}>
          {#if inh.effects}
            <ul class="effects">
              {#each inh.effects as eff}
                <li>
                  {#if eff.isTitleVisible && eff.title}<strong>{eff.title}</strong>{/if}
                  <Markdown text={eff.description} skillsMap={skillMap} />
                </li>
              {/each}
            </ul>
          {/if}
        </SkillCard>
      {/each}
    {/if}
  </div>
</div>

<style>
  .skill-list { display: flex; flex-direction: column; gap: var(--sp-4); }
  .desc { margin: 0; font-style: italic; color: var(--text-secondary); font-size: var(--fs-sm); }
  .effects { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--sp-2); }
  .effects li { background: var(--bg-hover); padding: var(--sp-2); border-radius: var(--radius); font-size: var(--fs-sm); line-height: 1.5; }
  .effects strong { display: block; margin-bottom: 2px; color: var(--text-body); font-weight: var(--fw-bold); }
  .multiplier { display: flex; flex-direction: column; gap: var(--sp-2); margin-top: var(--sp-2); }
  .mult-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); font-family: var(--font-mono); }
  .mult-table th, .mult-table td { text-align: left; padding: 4px var(--sp-2); border-bottom: 1px solid var(--border); }
  .mult-table th { color: var(--text-secondary); font-weight: var(--fw-medium); }
  .mult-table tr:last-child td { border-bottom: none; }
</style>
