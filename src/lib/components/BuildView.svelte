<script lang="ts">
  import BuildStats from '#lib/components/BuildStats.svelte';
  import BuildEcho from '#lib/components/BuildEcho.svelte';
  import BuildWeapon from '#lib/components/BuildWeapon.svelte';
  import BuildRotation from '#lib/components/BuildRotation.svelte';

  let { stats, build, echoes = [], sonatas = [] }: { stats?: any; build?: any; echoes?: any[]; sonatas?: any[] } = $props();
</script>

<div class="build-view">
  {#if stats || build}
    <div class="row">
      <div class="col">
        {#if stats}
          <BuildStats {stats} />
        {/if}
      </div>

      <div class="col">
        {#if build?.bestEcho || build?.echoDetails}
          <BuildEcho {build} {echoes} {sonatas} />
        {/if}
      </div>
    </div>

    {#if build?.echoDetails?.note}
      <div class="echo-note-row">
        <p class="note-text">{build.echoDetails.note}</p>
      </div>
    {/if}

    <div class="row">
      <div class="col">
        {#if build?.bestWeapon || build?.weaponOptions || build?.weaponNote}
          <BuildWeapon {build} />
        {/if}

        <BuildRotation {build} />
      </div>
      <div class="col"></div>
    </div>
  {/if}
</div>

<style>
  .build-view {
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
  }

  .row {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-5);
    align-items: start;
  }

  @media (min-width: 768px) {
    .row { grid-template-columns: 1fr 1fr; }
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
    min-width: 0;
  }

  .echo-note-row {
    width: 100%;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--sp-3);
    margin-top: var(--sp-2);
  }

  .note-text {
    font-size: var(--fs-xs);
    color: var(--text-muted);
    margin: 0;
    white-space: pre-line;
    font-style: italic;
  }
</style>
