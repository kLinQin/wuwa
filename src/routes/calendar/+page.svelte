<script lang="ts">
  import type { PageProps } from './$types';
  import BottomSheet from '#lib/components/BottomSheet.svelte';
  let { data }: PageProps = $props();

  
  interface ParsedEvent {
    title: string;
    type: 'banner' | 'weapon' | 'event' | string;
    icon?: string;
    background?: string;
    description?: string;
    start: Date;
    end: Date;
  }

  const events = $derived<ParsedEvent[]>(
    data.items.map((e: any) => {
      if (!e.startDate || !e.endDate) return null;
      return {
        title: e.name,
        description: e.description || '',
        type: e.type || 'event',
        icon: e.icon,
        background: e.coverImgSrc,
        start: new Date(e.startDate),
        end: new Date(e.endDate),
      };
    }).filter(Boolean) as ParsedEvent[]
  );

  
  const initialDate = new Date();
  let selectedYear = $state<number>(initialDate.getFullYear());
  let selectedMonth = $state<number>(initialDate.getMonth()); 

  function getStatusBadge(start: Date, end: Date): { label: string; state: string } {
    const now = Date.now();
    const day = 86400000;
    if (now > end.getTime()) return { label: 'Ended', state: 'ended' };
    if (now < start.getTime()) return { label: 'In ' + Math.ceil((start.getTime() - now) / day) + 'd', state: 'upcoming' };
    return { label: Math.ceil((end.getTime() - now) / day) + 'd left', state: 'active' };
  }

  function formatDateRange(start: Date, end: Date): string {
    const sStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const eStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${sStr} - ${eStr}`;
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = $derived(
    new Date(selectedYear, selectedMonth + 1, 0).getDate()
  );

  const monthDays = $derived(
    Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(selectedYear, selectedMonth, i + 1);
      return {
        dayNum: i + 1,
        dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        dateObj: d,
      };
    })
  );

  const monthStart = $derived(new Date(selectedYear, selectedMonth, 1, 0, 0, 0));
  const monthEnd = $derived(new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59));

  
  const monthEvents = $derived(
    events.filter(e => e.end >= monthStart && e.start <= monthEnd)
  );

  
  let filterType = $state<'all' | 'banner' | 'event'>('all');
  const filteredEvents = $derived(
    filterType === 'all' ? monthEvents : monthEvents.filter(e => e.type === filterType)
  );

  function prevMonth() {
    if (selectedMonth === 0) {
      selectedMonth = 11;
      selectedYear--;
    } else {
      selectedMonth--;
    }
  }

  function nextMonth() {
    if (selectedMonth === 11) {
      selectedMonth = 0;
      selectedYear++;
    } else {
      selectedMonth++;
    }
  }

  
  function getColRange(e: ParsedEvent) {
    const isStartInMonth = e.start >= monthStart && e.start <= monthEnd;
    const isEndInMonth = e.end >= monthStart && e.end <= monthEnd;
    const s = e.start < monthStart ? 1 : e.start.getDate();
    const endDay = e.end > monthEnd ? daysInMonth : e.end.getDate();
    const span = Math.max(1, endDay - s + 1);
    return { start: s, span, isStartInMonth, isEndInMonth };
  }

  
  const today = new Date();
  const isCurrentMonth = $derived(
    today.getFullYear() === selectedYear && today.getMonth() === selectedMonth
  );
  const todayNum = $derived(isCurrentMonth ? today.getDate() : null);

  let sheetOpen = $state(false);
  let selectedEvent = $state<ParsedEvent | null>(null);

  function openEvent(ev: ParsedEvent) {
    selectedEvent = ev;
    sheetOpen = true;
  }

  const typeColors: Record<string, string> = {
    banner: '#e06c75',
    
    event: '#61afef',
  };
</script>

<svelte:head><title>Calendar — WWI</title></svelte:head>

<div class="calendar-page">
  <header class="cal-header">
    <h1>Event Calendar</h1>
    <div class="controls">
      <div class="month-nav surface">
        <button onclick={prevMonth} aria-label="Previous Month">&lsaquo;</button>
        <span class="current-month">{monthNames[selectedMonth]} {selectedYear}</span>
        <button onclick={nextMonth} aria-label="Next Month">&rsaquo;</button>
      </div>

      <div class="filters">
        <button class="raised" aria-pressed={filterType === 'all'} onclick={() => filterType = 'all'}>All</button>
        <button class="raised" aria-pressed={filterType === 'banner'} onclick={() => filterType = 'banner'}>Banners</button>
        <button class="raised" aria-pressed={filterType === 'event'} onclick={() => filterType = 'event'}>Activities</button>
      </div>
    </div>
  </header>

  <div class="timeline-container">
    <div class="timeline-grid" style="--days: {daysInMonth};">
      {#if todayNum}
        <div class="global-today-line" style="left: calc((100% * ({todayNum} - 0.5) / {daysInMonth}));"></div>
      {/if}
      <!-- Days Header -->
      <div class="header-row">
        <div class="days-cols">
          {#each monthDays as d}
            <div class="day-cell" class:today={d.dayNum === todayNum}>
              <span class="d-name">{d.dayName}</span>
              <span class="d-num">{d.dayNum}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Events Rows -->
      <div class="events-body" class:empty-state={filteredEvents.length === 0}>
        {#if filteredEvents.length === 0}
          <div class="empty">No events in this month</div>
        {:else}
          {#each filteredEvents as ev, i}
            {@const range = getColRange(ev)}
            {@const color = typeColors[ev.type] || 'var(--accent)'}
            {@const status = getStatusBadge(ev.start, ev.end)}
            <div class="event-row">
              <div class="days-cols">
                {#if range.isStartInMonth}
                  <div class="vertical-event-line start-line" style="left: calc((100% / {daysInMonth}) * ({range.start} - 1)); top: calc(-38px - {i} * 44px); bottom: 6px;"></div>
                {/if}
                {#if range.isEndInMonth}
                  <div class="vertical-event-line end-line" style="left: calc((100% / {daysInMonth}) * {range.start + range.span - 1}); top: calc(-38px - {i} * 44px); bottom: 6px;"></div>
                {/if}
                <div
                  class="event-bar {ev.type}"
                  data-span={range.span}
                  role="button"
                  tabindex="0"
                  onclick={() => openEvent(ev)}
                  onkeydown={(e) => e.key === 'Enter' && openEvent(ev)}
                  title="{ev.title} ({formatDateRange(ev.start, ev.end)})"
                  style="
                    grid-column: {range.start} / span {range.span};
                    --bar-color: {color};
                    {ev.background ? `background-image: linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${ev.background})` : ''}
                  "
                >
                  {#if ev.icon}
                    <img src={ev.icon} alt="" class="bar-icon" />
                  {/if}
                  <span class="bar-label">{ev.title}</span>
                  <span class="bar-meta">
                    <span class="bar-chip bar-date">{formatDateRange(ev.start, ev.end)}</span>
                    <span class="bar-chip bar-status {status.state}">{status.label}</span>
                  </span>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>

  <BottomSheet bind:open={sheetOpen} title={selectedEvent?.title ?? ''}>
    {#if selectedEvent}
      <div class="ev-detail">
        <div class="ev-detail-row">
          <span class="lbl">Type</span>
          <span class="val" style="color: {typeColors[selectedEvent.type] || 'var(--accent)'}">{selectedEvent.type}</span>
        </div>
        <div class="ev-detail-row">
          <span class="lbl">Period</span>
          <span class="val">{formatDateRange(selectedEvent.start, selectedEvent.end)}</span>
        </div>
        <div class="ev-detail-row">
          <span class="lbl">Status</span>
          <span class="val">{getStatusBadge(selectedEvent.start, selectedEvent.end).label}</span>
        </div>
        {#if selectedEvent.description}
          <div class="ev-detail-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
            <span class="lbl">Description</span>
            <span class="val" style="text-align: left;">{selectedEvent.description}</span>
          </div>
        {/if}
        {#if selectedEvent.background}
          <img class="ev-detail-img" src={selectedEvent.background} alt={selectedEvent.title} />
        {/if}
      </div>
    {/if}
  </BottomSheet>
</div>

<style>
  :global(main:has(.calendar-page)) {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  :global(.content:has(.calendar-page)) {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    min-height: 0;
  }

  .calendar-page {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .cal-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-3);
  }

  .cal-header h1 {
    margin: 0;
    font-size: var(--fs-xl);
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--sp-3);
  }

  .month-nav {
    display: inline-flex;
    align-items: stretch;
    gap: 0;
    padding: 0;
  }

  .month-nav.raised {
    padding: 0;
  }

  .month-nav button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--text-body);
    font-size: var(--fs-sm);
    cursor: pointer;
    padding: calc(var(--sp-2) - 3px) var(--sp-2);
    line-height: normal;
  }


  .current-month {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--fw-medium);
    min-width: 140px;
    text-align: center;
    font-size: var(--fs-sm);
    padding: calc(var(--sp-2) - 3px) var(--sp-2);
  }

  .filters {
    display: flex;
    gap: 4px;
  }



  


  .timeline-container {
    flex: 1;
    min-height: 0;
    overflow-x: auto;
    overflow-y: auto;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-elev);
  }

  .timeline-grid {
    min-width: 900px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .global-today-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #e74c3c;
    z-index: 10;
    pointer-events: none;
  }

  .header-row {
    display: flex;
    position: sticky;
    top: 0;
    background: var(--bg-elev);
    z-index: 20;
    border-bottom: 1px solid var(--border);
  }

  .event-row {
    display: flex;
    height: 44px;
    border-bottom: 1px solid var(--border);
  }

  .days-cols {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(var(--days), minmax(28px, 1fr));
    align-items: center;
    position: relative;
  }

  .today-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e74c3c;
    z-index: 1;
    pointer-events: none;
  }

  .day-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px 0;
    border-right: 1px solid var(--border);
    font-size: var(--fs-xs);
  }

  .day-cell:last-child {
    border-right: none;
  }

  .day-cell.today {
    background: var(--bg-hover);
    color: var(--accent);
    font-weight: var(--fw-bold);
  }

  .d-name {
    font-size: var(--fs-2xs);
    color: var(--text-secondary);
    text-transform: uppercase;
  }

  .d-num {
    font-size: var(--fs-xs);
  }

  .events-body {
    display: flex;
    flex-direction: column;
  }

  .events-body.empty-state {
    position: relative;
    flex: 1;
    min-height: 0;
  }



  .event-row:last-child {
    border-bottom: none;
  }

  .event-bar {
    position: relative;
    height: 32px;
    margin: 4px 0 4px 2px;
    border-radius: 1px;
    background: var(--bar-color);
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    padding: 0 2px 0 var(--sp-2);
    color: var(--text-inverse);
    font-size: var(--fs-xs);
    font-weight: var(--fw-medium);
    overflow: hidden;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    border-left: 3px solid var(--bar-color);
    z-index: 2;
  }

  .bar-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    border-radius: 50%;
    flex-shrink: 0;
    margin-right: var(--sp-1);
  }

  .ev-detail { display: flex; flex-direction: column; gap: var(--sp-2); }
  .ev-detail-row { display: flex; justify-content: space-between; gap: var(--sp-2); font-size: var(--fs-sm); }
  .ev-detail-row .lbl { color: var(--text-secondary); }
  .ev-detail-row .val { font-weight: var(--fw-medium); text-align: right; }
  .ev-detail-img { width: 100%; border-radius: var(--radius); margin-top: var(--sp-2); }

  .event-bar { cursor: pointer; }

  .bar-label {
    color: #c9c4b8;
    text-shadow: 0 1px 2px #000;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .event-bar[data-span="1"] .bar-meta,
  .event-bar[data-span="2"] .bar-meta,
  .event-bar[data-span="3"] .bar-meta {
    display: none;
  }

  .bar-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1px;
    margin-left: var(--sp-2);
    flex-shrink: 0;
  }

  .bar-meta .bar-chip {
    margin-left: 0;
  }

  .bar-chip {
    font-size: var(--fs-3xs);
    padding: 0 4px;
    border-radius: 3px;
    margin-left: var(--sp-1);
    flex-shrink: 0;
    line-height: 1.3;
    border: 1px solid transparent;
    background: rgba(0,0,0,0.6);
    text-shadow: none;
  }

  .bar-date {
    color: #c9c4b8;
    border-color: rgba(255,255,255,0.35);
  }

  .bar-status { border: 1px solid transparent; background: rgba(0,0,0,0.6); }

  .bar-status.active {
    color: var(--status-active);
    border-color: var(--status-active);
  }

  .bar-status.upcoming {
    color: var(--status-upcoming);
    border-color: var(--status-upcoming);
  }

  .bar-status.ended {
    color: var(--status-ended);
    border-color: var(--status-ended);
  }

  .empty {
    position: relative;
    flex: 1;
    min-height: 0;
    padding: var(--sp-6);
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--fs-sm);
  }



  .vertical-event-line {
    position: absolute;
    width: 1px;
    z-index: 1;
    pointer-events: none;
    opacity: 0.6;
  }
  .vertical-event-line.start-line {
    background: #2ecc71;
  }
  .vertical-event-line.end-line {
    background: #f39c12;
  }

  
  @media (max-width: 768px) {
    .cal-header {
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
    }
    .cal-header h1 {
      display: none;
    }
    .controls {
      width: 100%;
      justify-content: space-between;
      flex-wrap: nowrap;
      gap: 4px;
    }
    .current-month {
      min-width: 85px;
      font-size: var(--fs-2xs);
    }


  }
</style>
