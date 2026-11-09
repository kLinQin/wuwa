<script lang="ts">
  let { events = [], initialDate = new Date() }: { events: any[]; initialDate?: Date } = $props();

  let currentDate = $state(new Date(initialDate));
  let selectedEvent = $state<any>(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const currentMonth = $derived(currentDate.getMonth());
  const currentYear = $derived(currentDate.getFullYear());

  function prevMonth() { currentDate = new Date(currentYear, currentMonth - 1, 1); }
  function nextMonth() { currentDate = new Date(currentYear, currentMonth + 1, 1); }

  
  const daysInMonth = $derived(new Date(currentYear, currentMonth + 1, 0).getDate());
  const firstDayIndex = $derived(new Date(currentYear, currentMonth, 1).getDay());

  const grid = $derived.by(() => {
    const cells: { date: number | null; events: any[] }[] = [];
    
    for (let i = 0; i < firstDayIndex; i++) cells.push({ date: null, events: [] });
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => {
        const start = e.startDate?.split(' ')[0];
        const end = e.endDate?.split(' ')[0];
        return dateStr >= start && dateStr <= end;
      });
      cells.push({ date: d, events: dayEvents });
    }
    return cells;
  });

  function isToday(d: number | null) {
    if (!d) return false;
    const now = new Date();
    return d === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
  }
</script>

<div class="calendar-wrap">
  <div class="cal-header">
    <button class="raised small-btn" onclick={prevMonth}>←</button>
    <h2>{monthNames[currentMonth]} {currentYear}</h2>
    <button class="raised small-btn" onclick={nextMonth}>→</button>
  </div>

  <div class="cal-grid">
    {#each dayNames as dn}
      <div class="cal-day-name">{dn}</div>
    {/each}
    {#each grid as cell}
      <div class="cal-cell" class:empty={!cell.date}>
        {#if cell.date}
          <span class="cal-date" class:today={isToday(cell.date)}>{cell.date}</span>
          <div class="cal-events">
            {#each cell.events as ev}
              <button class="cal-event" class:banner={ev._type === 'Banner'} onclick={() => selectedEvent = ev}>
                {ev.name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

{#if selectedEvent}
  <div class="modal-overlay" onclick={() => selectedEvent = null} role="presentation">
    <div class="modal-card surface" onclick={(e) => e.stopPropagation()} role="presentation">
      <div class="modal-header">
        <span class="badge muted">{selectedEvent._type}</span>
        <button class="raised icon" onclick={() => selectedEvent = null}>&times;</button>
      </div>
      {#if selectedEvent.coverImgSrc}
        <img src={selectedEvent.coverImgSrc} alt={selectedEvent.name} class="modal-img" />
      {/if}
      <h3>{selectedEvent.name}</h3>
      <p class="modal-desc">{selectedEvent.description}</p>
      <p class="modal-date">{selectedEvent.startDate} → {selectedEvent.endDate}</p>
    </div>
  </div>
{/if}

<style>
  .calendar-wrap {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--sp-3);
  }
  .cal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--sp-2);
  }
  .cal-header h2 { margin: 0; font-size: var(--fs-lg); }

  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }
  .cal-day-name {
    background: var(--bg-hover);
    padding: var(--sp-1);
    text-align: center;
    font-size: var(--fs-xs);
    font-weight: var(--fw-bold);
    color: var(--text-secondary);
  }
  .cal-cell {
    background: var(--bg);
    min-height: 80px;
    padding: var(--sp-1);
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;
  }
  @media (min-width: 768px) {
    .cal-cell { min-height: 120px; padding: var(--sp-2); }
  }
  .cal-date {
    font-size: var(--fs-xs);
    font-family: var(--font-mono);
    color: var(--text-secondary);
    align-self: flex-end;
  }
  .cal-date.today {
    background: var(--accent);
    color: var(--text-inverse);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cal-events {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
  }
  .cal-event {
    font-size: 10px;
    line-height: 1.2;
    padding: 2px 4px;
    border-radius: 2px;
    background: var(--bg-hover);
    color: var(--text-body);
    border: none;
    text-align: left;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cal-event.banner { background: var(--accent); color: var(--text-inverse); }
  .cal-event:hover { opacity: 0.8; }

  
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: var(--overlay-dark);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--sp-4);
  }
  .modal-card {
    background: var(--bg-elev);
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: var(--radius);
    padding: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }
  .modal-header { display: flex; justify-content: space-between; align-items: center; }
  .modal-header .icon { width: 24px; height: 24px; font-size: 18px; display: flex; align-items: center; justify-content: center; padding: 0; }
  .modal-img { width: 100%; border-radius: var(--radius); }
  .modal-card h3 { margin: 0; font-size: var(--fs-lg); }
  .modal-desc { font-size: var(--fs-sm); color: var(--text-body); line-height: 1.5; margin: 0; }
  .modal-date { font-size: var(--fs-xs); font-family: var(--font-mono); color: var(--accent); margin: 0; }
</style>
