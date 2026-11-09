<script lang="ts">
  let {
    value = 1,
    min = 1,
    max = 10,
    label = '',
    suffix = '',
    onchange
  }: {
    value?: number;
    min?: number;
    max?: number;
    label?: string;
    suffix?: string;
    onchange?: (v: number) => void;
  } = $props();
</script>

<div class="slider-wrap">
  {#if label}
    <div class="slider-head">
      <span class="slider-label">{label}</span>
      <span class="slider-val">{value}{suffix}</span>
    </div>
  {/if}
  <input type="range" {min} {max} {value} oninput={(e) => onchange?.(+e.currentTarget.value)} />
</div>

<style>
  .slider-wrap { display: flex; flex-direction: column; gap: var(--sp-1); width: 100%; }
  .slider-head { display: flex; justify-content: space-between; align-items: center; }
  .slider-label { font-size: var(--fs-xs); text-transform: uppercase; color: var(--text-secondary); }
  .slider-val { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--accent); }
  input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; background: var(--bg-hover); border-radius: var(--radius); outline: none; cursor: pointer; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--accent); cursor: pointer; }
  input[type=range]::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: var(--accent); cursor: pointer; border: none; }
</style>
