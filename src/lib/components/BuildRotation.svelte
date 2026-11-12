<script lang="ts">
  import { rotationGuide } from '#lib/data/rotation-guide';

  let { build }: { build: any } = $props();

  let currentSteps = $state<Record<number, number>>({});

  function nextStep(rotIndex: number, max: number) {
    currentSteps[rotIndex] = Math.min((currentSteps[rotIndex] ?? 0) + 1, max - 1);
  }

  function prevStep(rotIndex: number) {
    currentSteps[rotIndex] = Math.max((currentSteps[rotIndex] ?? 0) - 1, 0);
  }

  function formatStep(text: string) {
    let formatted = text;
    const keys = Object.keys(rotationGuide).sort((a, b) => b.length - a.length);
    for (const key of keys) {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      formatted = formatted.replace(regex, `<span class="highlight">${rotationGuide[key]}</span>`);
    }
    return formatted;
  }
</script>

{#if build?.rotations}
  <div class="section">
    <h3>Rotations</h3>

    <div class="rotation-list">
      {#each build.rotations as rot, rotIdx}
        {@const stepIdx = currentSteps[rotIdx] ?? 0}
        {@const maxSteps = rot.steps.length}

        <div class="rotation-card surface">
          <h4 class="rot-title">{rot.title}</h4>

          <div class="step-viewer">
            <button
              class="raised nav-btn prev"
              aria-label="Previous step"
              onclick={() => prevStep(rotIdx)}
              disabled={stepIdx === 0}
            ><svg width="16" height="16" style="display:inline-block;vertical-align:middle"><use href="#arrow-left" /></svg></button>

            <div class="step-content">
              <div class="step-body">
                <p class="step-text">{@html formatStep(rot.steps[stepIdx])}</p>
                <p class="step-raw">Original: {rot.steps[stepIdx]}</p>
              </div>
            </div>

            <button
              class="raised nav-btn next"
              aria-label="Next step"
              onclick={() => nextStep(rotIdx, maxSteps)}
              disabled={stepIdx >= maxSteps - 1}
            ><svg width="16" height="16" style="display:inline-block;vertical-align:middle"><use href="#arrow-right" /></svg></button>
          </div>

          <div class="step-footer">
            <div class="step-indicator">Step {stepIdx + 1} / {maxSteps}</div>
            <div class="step-dots">
              {#each rot.steps as _, i}
                <span class="dot" class:active={i === stepIdx}></span>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .section h3 {
    margin: 0 0 var(--sp-3) 0;
    font-size: var(--fs-md);
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    padding-bottom: var(--sp-2);
  }

  .rotation-list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .rotation-card {
    padding: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .rot-title {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--text-body);
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
  }

  
  .step-viewer {
    position: relative; 
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    padding: 0 40px; 
  }

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    font-size: var(--fs-md);
    
  }

  .nav-btn.prev {
    left: 0;
  }

  .nav-btn.next {
    right: 0;
  }

  .nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .step-content {
    flex: 1;
    min-width: 400px; 
    display: flex;
    flex-direction: column;
  }

  .step-body {
    flex: 1;
    min-height: 80px; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    gap: 4px;
  }

  .step-text {
    margin: 0;
    font-size: var(--fs-sm);
    line-height: 1.4;
    color: var(--text-body);
  }

  .step-raw {
    margin: 0;
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    opacity: 0.7;
  }

  .step-text :global(.highlight) {
    color: var(--accent);
    font-weight: var(--fw-bold);
  }

  
  .step-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--sp-1);
    border-top: 1px solid var(--border);
    padding-top: var(--sp-2);
  }

  .step-indicator {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
  }

  .step-dots {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border);
  }
  .dot.active {
    background: var(--accent);
  }
</style>
