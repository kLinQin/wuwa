<script lang="ts">
  import BuildStats from '#lib/components/BuildStats.svelte';
  import BuildEcho from '#lib/components/BuildEcho.svelte';
  import BuildWeapon from '#lib/components/BuildWeapon.svelte';
  import BuildTalent from '#lib/components/BuildTalent.svelte';
  import BuildRotation from '#lib/components/BuildRotation.svelte';

  let { stats, build, echoes = [], sonatas = [], weapons = [] }: { stats?: any; build?: any; echoes?: any[]; sonatas?: any[]; weapons?: any[] } = $props();
</script>

<div class="build-view">
  {#if stats || build}
    <!-- BARIS 1: Stats & Echo -->
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

    <!-- ECHO NOTE (FULL WIDTH) -->
    {#if build?.echoDetails?.note}
      <div class="echo-note-row">
        <p class="note-text">{build.echoDetails.note}</p>
      </div>
    {/if}

    <!-- BARIS 2: Weapon & Talent -->
    <div class="row">
      <div class="col">
        {#if build?.bestWeapon || build?.weaponOptions || build?.weaponNote}
          <BuildWeapon {build} {weapons} />
        {/if}
      </div>

      <div class="col">
        <BuildTalent {build} />
      </div>
    </div>

    <!-- BARIS 3: Rotations Full Width -->
    <div class="row">
      <div class="col" style="grid-column: 1 / -1;">
        <BuildRotation {build} />
      </div>
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
