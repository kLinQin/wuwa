<script lang="ts">
  let { events = [] }: { events: any[] } = $props();

  const today = new Date();
  let currentYear = $state(today.getFullYear());
  let currentMonth = $state(today.getMonth());

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const daysInMonth = $derived(new Date(currentYear, currentMonth + 1, 0).getDate());
  const firstDay = $derived(new Date(currentYear, currentMonth, 1).getDay());

  const grid = $derived.by(() => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: null, hasEvent: false });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasEvent = events.some(e => {
        if (!e.startDate || !e.endDate) return false;
        const start = e.startDate.split(' ')[0];
        const end = e.endDate.split(' ')[0];
        return dateStr >= start && dateStr <= end;
      });
      cells.push({ day: d, hasEvent });
    }
    return cells;
  });

  function prev() {
    if (currentMonth === 0) { currentMonth = 11; currentYear--; }
    else currentMonth--;
  }
  function next() {
    if (currentMonth === 11) { currentMonth = 0; currentYear++; }
    else currentMonth++;
  }
</script>

<div class="mini-cal surface">
  <div class="cal-header">
    <button class="icon-btn" onclick={prev} aria-label="Prev">&lsaquo;</button>
    <span class="cal-title">{monthNames[currentMonth]} {currentYear}</span>
    <button class="icon-btn" onclick={next} aria-label="Next">&rsaquo;</button>
  </div>
  <div class="cal-grid">
    {#each ['S','M','T','W','T','F','S'] as d}
      <span class="cal-day-name">{d}</span>
    {/each}
    {#each grid as cell}
      <div class="cal-cell" class:empty={!cell.day}>
        {#if cell.day}
          <span class="cal-date" class:today={cell.day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()}>
            {cell.day}
          </span>
          {#if cell.hasEvent}
            <span class="dot"></span>
          {/if}
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .mini-cal {
    padding: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .cal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cal-title { font-size: var(--fs-sm); font-weight: var(--fw-medium); }
  .icon-btn {
    background: none; border: none; cursor: pointer; color: var(--text-body); padding: 0 4px; font-size: var(--fs-md);
  }
  .icon-btn:hover { color: var(--accent); }

  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    text-align: center;
  }
  .cal-day-name {
    font-size: 10px;
    color: var(--text-secondary);
    padding-bottom: 4px;
  }
  .cal-cell {
    position: relative;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--fs-xs);
    border-radius: 50%;
  }
  .cal-date {
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
  }
  .cal-date.today {
    background: var(--accent);
    color: var(--text-inverse);
    font-weight: var(--fw-bold);
  }
  .dot {
    position: absolute;
    bottom: 2px;
    width: 4px; height: 4px;
    background: var(--accent);
    border-radius: 50%;
  }
</style>
