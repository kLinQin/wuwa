<script lang="ts">
  import BuildStats from '#lib/components/BuildStats.svelte';
  import BuildEcho from '#lib/components/BuildEcho.svelte';
  import BuildWeapon from '#lib/components/BuildWeapon.svelte';
  import BuildTalent from '#lib/components/BuildTalent.svelte';
  import BuildRotation from '#lib/components/BuildRotation.svelte';
  import BottomSheet from '#lib/components/BottomSheet.svelte';

  let { stats, build, echoes = [], sonatas = [], weapons = [] }: { stats?: any; build?: any; echoes?: any[]; sonatas?: any[]; weapons?: any[] } = $props();

  let isNoteOpen = $state(false);
  let isWeaponNoteOpen = $state(false);
  let isTalentNoteOpen = $state(false);
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
          <div class="echo-header-row">
            <BuildEcho {build} {echoes} {sonatas} onnote={() => isNoteOpen = true} />
          </div>
        {/if}
      </div>
    </div>

    <div class="row">
      <div class="col">
        {#if build?.bestWeapon || build?.weaponOptions || build?.weaponNote}
          <BuildWeapon {build} {weapons} onnote={() => isWeaponNoteOpen = true} />
        {/if}
      </div>

      <div class="col">
        <BuildTalent {build} onnote={() => isTalentNoteOpen = true} />
      </div>
    </div>

    <div class="row">
      <div class="col" style="grid-column: 1 / -1;">
        <BuildRotation {build} />
      </div>
    </div>
  {/if}

  <BottomSheet bind:open={isNoteOpen} title="Echo Setup Note">
    {#if build?.echoDetails?.note}
      <p class="note-text">{build.echoDetails.note}</p>
    {/if}
  </BottomSheet>

  <BottomSheet bind:open={isWeaponNoteOpen} title="Weapon Note">
    {#if build?.weaponNote}
      <p class="note-text">{build.weaponNote}</p>
    {/if}
  </BottomSheet>

  <BottomSheet bind:open={isTalentNoteOpen} title="Talent Priority Note">
    {#if build?.talentPriority?.note}
      <p class="note-text">{build.talentPriority.note}</p>
    {/if}
  </BottomSheet>
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

  .note-text {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    margin: 0;
    white-space: pre-line;
    font-style: italic;
  }
</style>
