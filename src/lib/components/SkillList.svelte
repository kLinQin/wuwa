<script lang="ts">
  let { skills, charSlug }: { skills: any; charSlug: string } = $props();

  const orderedKeys = [
    'basic', 'skill', 'liberation', 'forte', 'intro', 'outro'
  ];

  const labels: Record<string, string> = {
    basic: 'Basic Attack',
    skill: 'Resonance Skill',
    liberation: 'Resonance Liberation',
    forte: 'Forte Circuit',
    intro: 'Intro Skill',
    outro: 'Outro Skill'
  };

  const iconSuffix: Record<string, string> = {
    basic: 'na',
    skill: 'rs',
    liberation: 'rl',
    forte: 'fc',
    intro: 'intro',
    outro: 'outro'
  };

  function getIconUrl(key: string) {
    return `/icons/skills/${charSlug}/${charSlug}-${iconSuffix[key]}.webp`;
  }

  function getInherentIconUrl(idx: number) {
    return `/icons/skills/${charSlug}/${charSlug}-in${idx + 1}.webp`;
  }
</script>

<div class="skill-list">
  <div class="grid-2">
    <!-- Standard Skills -->
    {#each orderedKeys as key}
      {#if skills[key]}
        <div class="skill-card raised">
          <div class="skill-header">
            <img src={getIconUrl(key)} alt={labels[key]} class="skill-icon" onerror={(e) => e.currentTarget.style.display='none'} />
            <div class="skill-title">
              <span class="skill-type">{labels[key]}</span>
              <span class="skill-name">{skills[key].name || ''}</span>
            </div>
          </div>

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

    <!-- Inherent Skills -->
    {#if skills.inherent && Array.isArray(skills.inherent)}
      {#each skills.inherent as inh, idx}
        <div class="skill-card raised">
          <div class="skill-header">
            <img src={getInherentIconUrl(idx)} alt="Inherent" class="skill-icon" onerror={(e) => e.currentTarget.style.display='none'} />
            <div class="skill-title">
              <span class="skill-type">Inherent Skill {idx + 1}</span>
              <span class="skill-name">{inh.name || ''}</span>
            </div>
          </div>

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
</div>

<style>
  .skill-list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }


  .skill-card {
    padding: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    justify-content: flex-start;
    height: 100%;
  }

  .skill-header {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
    flex-shrink: 0;
  }

  .skill-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    background: var(--bg-elev);
    border-radius: var(--radius);
    padding: 2px;
    border: 1px solid var(--border);
  }

  .skill-title {
    display: flex;
    flex-direction: column;
  }

  .skill-type {
    font-size: var(--fs-xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .skill-name {
    font-size: var(--fs-md);
    font-weight: var(--fw-medium);
    color: var(--accent);
  }

  .desc {
    margin: 0;
    font-style: italic;
    color: var(--text-muted);
    font-size: var(--fs-sm);
  }

  .effects {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .effects li {
    background: var(--bg-hover);
    padding: var(--sp-2);
    border-radius: var(--radius);
    font-size: var(--fs-sm);
    line-height: 1.5;
  }

  .effects strong {
    display: block;
    margin-bottom: 2px;
    color: var(--text);
    font-weight: var(--fw-bold);
  }
</style>
