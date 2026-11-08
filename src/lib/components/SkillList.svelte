<script lang="ts">
  import SkillCard from './SkillCard.svelte';

  let { skills, charSlug }: { skills: any; charSlug: string } = $props();

  const orderedKeys = ['basic', 'skill', 'liberation', 'forte', 'intro', 'outro'];
  const labels: Record<string, string> = {
    basic: 'Basic Attack', skill: 'Resonance Skill', liberation: 'Resonance Liberation',
    forte: 'Forte Circuit', intro: 'Intro Skill', outro: 'Outro Skill'
  };
  const iconSuffix: Record<string, string> = {
    basic: 'na', skill: 'rs', liberation: 'rl', forte: 'fc', intro: 'intro', outro: 'outro'
  };
  function getIconUrl(key: string) {
    return `/icons/skills/${charSlug}/${charSlug}-${iconSuffix[key]}.webp`;
  }
  function getInherentIconUrl(idx: number) {
    return `/icons/skills/${charSlug}/${charSlug}-in${idx + 1}.webp`;
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
        <SkillCard icon={getIconUrl(key)} typeLabel={labels[key]} name={skills[key].name || ''}>
          {#if skills[key].description}
            <p class="desc">{skills[key].description}</p>
          {/if}
          {#if skills[key].effects}
            <ul class="effects">
              {#each skills[key].effects as eff}
                <li>
                  {#if eff.isTitleVisible && eff.title}<strong>{eff.title}</strong>{/if}
                  <span>{eff.description}</span>
                </li>
              {/each}
            </ul>
          {/if}

          {#if skills[key].attributes && skills[key].attributes.length}
            <div class="multiplier">
              <div class="mult-head">
                <span class="mult-label">Skill Level</span>
                <span class="mult-badge">Lv. {lv}</span>
              </div>
              <input type="range" min="1" max="10" value={lv} oninput={(e) => setLevel(key, +e.currentTarget.value)} />
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
        <SkillCard icon={getInherentIconUrl(idx)} typeLabel={`Inherent ${idx + 1}`} name={inh.name || ''}>
          {#if inh.effects}
            <ul class="effects">
              {#each inh.effects as eff}
                <li>
                  {#if eff.isTitleVisible && eff.title}<strong>{eff.title}</strong>{/if}
                  <span>{eff.description}</span>
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
  .mult-head { display: flex; justify-content: space-between; align-items: center; }
  .mult-label { font-size: var(--fs-xs); color: var(--text-secondary); text-transform: uppercase; }
  .mult-badge { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--accent); }
  .multiplier input[type=range] { width: 100%; }
  .mult-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); font-family: var(--font-mono); }
  .mult-table th, .mult-table td { text-align: left; padding: 4px var(--sp-2); border-bottom: 1px solid var(--border); }
  .mult-table th { color: var(--text-secondary); font-weight: var(--fw-medium); }
  .mult-table tr:last-child td { border-bottom: none; }
</style>
