<script lang="ts">
  let { skills }: { skills: any } = $props();

  // Order based on game UI conventions
  const orderedKeys = [
    'basic',
    'skill',
    'liberation',
    'forte',
    'intro',
    'outro'
  ];

  const labels: Record<string, string> = {
    basic: 'Basic Attack',
    skill: 'Resonance Skill',
    liberation: 'Resonance Liberation',
    forte: 'Forte Circuit',
    intro: 'Intro Skill',
    outro: 'Outro Skill'
  };
</script>

<div class="skill-list">
  <!-- Standard Skills -->
  {#each orderedKeys as key}
    {#if skills[key]}
      <div class="skill-group">
        <h3>{labels[key]}{skills[key].name ? ': ' + skills[key].name : ''}</h3>
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
      </div>
    {/if}
  {/each}

  <!-- Inherent Skills (Includes Tune Break if applicable) -->
  {#if skills.inherent && Array.isArray(skills.inherent)}
    {#each skills.inherent as inh, idx}
      <div class="skill-group">
        <h3>Inherent Skill {idx + 1}{inh.name ? ': ' + inh.name : ''}</h3>
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
      </div>
    {/each}
  {/if}
</div>

<style>
  .skill-list { display: flex; flex-direction: column; gap: var(--sp-4); }
  .skill-group h3 { margin: 0 0 var(--sp-2) 0; font-size: var(--fs-md); color: var(--accent); }
  .desc { margin: 0 0 var(--sp-2) 0; font-style: italic; color: var(--text-muted); font-size: var(--fs-sm); }
  .effects { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--sp-2); }
  .effects li { background: var(--bg-hover); padding: var(--sp-2) var(--sp-3); border-radius: var(--radius); font-size: var(--fs-sm); line-height: 1.5; }
  .effects strong { display: block; margin-bottom: 2px; color: var(--text); font-weight: var(--fw-medium); }
</style>
