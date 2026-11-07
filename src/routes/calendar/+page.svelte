<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();

  // 1. Parse events with timestamp
  interface ParsedEvent {
    title: string;
    type: 'banner' | 'weapon' | 'event' | string;
    icon?: string;
    background?: string;
    start: Date;
    end: Date;
  }

  function parseDate(dateStr: string): { start: Date; end: Date } | null {
    const match = dateStr.match(/<t:(\d+):[A-Z]>/g);
    if (!match || match.length < 2) return null;
    const t1 = parseInt(match[0].match(/\d+/)?.[0] || '0', 10) * 1000;
    const t2 = parseInt(match[match.length - 1].match(/\d+/)?.[0] || '0', 10) * 1000;
    return { start: new Date(t1), end: new Date(t2) };
  }

  const events = $derived<ParsedEvent[]>(
    data.items
      .map((e: any) => {
        const parsed = parseDate(e.date);
        if (!parsed) return null;
        return {
          title: e.title,
          type: e.type,
          icon: e.icon,
          background: e.background,
          start: parsed.start,
          end: parsed.end,
        };
      })
      .filter(Boolean) as ParsedEvent[]
  );

  // 2. Month selection state - Default to Current Real Date
  const initialDate = new Date();
  let selectedYear = $state<number>(initialDate.getFullYear());
  let selectedMonth = $state<number>(initialDate.getMonth()); // 0-indexed

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

  // Filter events visible in selected month
  const monthEvents = $derived(
    events.filter(e => e.end >= monthStart && e.start <= monthEnd)
  );

  // Active filter
  let filterType = $state<'all' | 'banner' | 'weapon' | 'event'>('all');
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

  // Calculate grid column start and span (1-based, 1 to daysInMonth)
  function getColRange(e: ParsedEvent) {
    const isStartInMonth = e.start >= monthStart && e.start <= monthEnd;
    const isEndInMonth = e.end >= monthStart && e.end <= monthEnd;
    const s = e.start < monthStart ? 1 : e.start.getDate();
    const endDay = e.end > monthEnd ? daysInMonth : e.end.getDate();
    const span = Math.max(1, endDay - s + 1);
    return { start: s, span, isStartInMonth, isEndInMonth };
  }

  // Today marker
  const today = new Date();
  const isCurrentMonth = $derived(
    today.getFullYear() === selectedYear && today.getMonth() === selectedMonth
  );
  const todayNum = $derived(isCurrentMonth ? today.getDate() : null);

  const typeColors: Record<string, string> = {
    banner: '#e06c75',
    weapon: '#e5c07b',
    event: '#61afef',
  };
</script>

<svelte:head><title>Calendar — WuWa DB</title></svelte:head>

<div class="calendar-page">
  <header class="cal-header">
    <h1>Event Calendar</h1>
    <div class="controls">
      <div class="month-nav">
        <button onclick={prevMonth} aria-label="Previous Month">&lsaquo;</button>
        <span class="current-month">{monthNames[selectedMonth]} {selectedYear}</span>
        <button onclick={nextMonth} aria-label="Next Month">&rsaquo;</button>
      </div>

      <div class="filters">
        <button class:active={filterType === 'all'} onclick={() => filterType = 'all'}>All</button>
        <button class:active={filterType === 'banner'} onclick={() => filterType = 'banner'}>Banners</button>
        <button class:active={filterType === 'weapon'} onclick={() => filterType = 'weapon'}>Weapons</button>
        <button class:active={filterType === 'event'} onclick={() => filterType = 'event'}>Events</button>
      </div>
    </div>
  </header>

  <div class="timeline-container">
    <div class="timeline-grid" style="--days: {daysInMonth};">
      {#if todayNum}
        <div class="global-today-line" style="left: calc(220px + (100% - 220px) * ({todayNum} - 0.5) / {daysInMonth});"></div>
      {/if}
      <!-- Days Header -->
      <div class="header-row">
        <div class="title-col">Event</div>
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
      <div class="events-body">
        {#if filteredEvents.length === 0}
          <div class="empty">No events in this month</div>
        {:else}
          {#each filteredEvents as ev, i}
            {@const range = getColRange(ev)}
            {@const color = typeColors[ev.type] || 'var(--accent)'}
            {@const status = getStatusBadge(ev.start, ev.end)}
            <div class="event-row">
              <div class="title-col">
                {#if ev.icon}
                  <img src={ev.icon} alt="" class="ev-icon" />
                {/if}
                <div class="ev-info">
                  <span class="ev-title" title={ev.title}>{ev.title}</span>
                  <div class="meta-row">
                    <span class="ev-date">{formatDateRange(ev.start, ev.end)}</span>
                    <span class="status-badge {status.state}">{status.label}</span>
                  </div>
                </div>
              </div>
              <div class="days-cols">
                {#if range.isStartInMonth}
                  <div class="vertical-event-line start-line" style="left: calc((100% / {daysInMonth}) * ({range.start} - 1)); top: calc(-38px - {i} * 44px); bottom: 6px;"></div>
                {/if}
                {#if range.isEndInMonth}
                  <div class="vertical-event-line end-line" style="left: calc((100% / {daysInMonth}) * {range.start + range.span - 1}); top: calc(-38px - {i} * 44px); bottom: 6px;"></div>
                {/if}
                <div
                  class="event-bar {ev.type}"
                  title="{ev.title} ({formatDateRange(ev.start, ev.end)})"
                  style="
                    grid-column: {range.start} / span {range.span};
                    --bar-color: {color};
                    {ev.background ? `background-image: linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${ev.background})` : ''}
                  "
                >
                  <span class="bar-label">{ev.title}</span>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .calendar-page {
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
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg);
    padding: var(--sp-2) 0;
    border-bottom: 1px solid var(--border);
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
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 2px 6px;
  }

  .month-nav button {
    background: none;
    border: none;
    color: var(--text);
    font-size: var(--fs-lg);
    cursor: pointer;
    padding: 0 8px;
    line-height: 1;
  }

  .current-month {
    font-weight: var(--fw-medium);
    min-width: 140px;
    text-align: center;
    font-size: var(--fs-sm);
  }

  .filters {
    display: flex;
    gap: 4px;
  }

  .filters button {
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-muted);
    padding: 4px 10px;
    font-size: var(--fs-xs);
    cursor: pointer;
  }

  .filters button.active {
    background: var(--bg-hover);
    color: var(--text);
    border-color: var(--accent);
  }

  /* Timeline Grid Layout */
  .timeline-container {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-elev);
  }

  .timeline-grid {
    min-width: 900px;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .global-today-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e74c3c;
    box-shadow: 0 0 6px rgba(231, 76, 60, 0.8);
    z-index: 10;
    pointer-events: none;
  }

  .header-row {
    display: flex;
    height: 38px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 50px; /* Di bawah cal-header */
    z-index: 90;
    background: var(--bg-elev);
  }

  .event-row {
    display: flex;
    height: 44px;
    border-bottom: 1px solid var(--border);
  }

  .title-col {
    width: 220px;
    flex-shrink: 0;
    padding: var(--sp-2) var(--sp-3);
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    border-right: 1px solid var(--border);
    background: var(--bg-elev);
    position: sticky;
    left: 0;
    z-index: 2;
  }

  .header-row .title-col {
    z-index: 95;
    font-weight: var(--fw-bold);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .ev-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .ev-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .ev-title {
    font-size: var(--fs-xs);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
  }

  .ev-date {
    font-size: 10px;
    color: var(--text-muted);
  }

  .status-badge {
    font-size: 9px;
    padding: 0 4px;
    border-radius: 3px;
    font-weight: var(--fw-medium);
    line-height: 1.3;
    border: 1px solid transparent;
  }

  .status-badge.active {
    background: rgba(46,204,113,0.2);
    color: #2ecc71;
    border-color: rgba(46,204,113,0.4);
  }

  .status-badge.upcoming {
    background: rgba(241,196,15,0.2);
    color: #f1c40f;
    border-color: rgba(241,196,15,0.4);
  }

  .status-badge.ended {
    background: rgba(149,165,166,0.2);
    color: #95a5a6;
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
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .d-num {
    font-size: var(--fs-xs);
  }

  .events-body {
    display: flex;
    flex-direction: column;
  }

  .event-row:last-child {
    border-bottom: none;
  }

  .event-bar {
    position: relative;
    height: 32px;
    margin: 4px 2px;
    border-radius: var(--radius);
    background: var(--bar-color);
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    padding: 0 var(--sp-2);
    color: var(--text-inverse);
    font-size: var(--fs-xs);
    font-weight: var(--fw-medium);
    overflow: hidden;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    border-left: 3px solid var(--bar-color);
    z-index: 2;
  }

  .bar-label {
    text-shadow: 0 1px 2px #000;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .empty {
    padding: var(--sp-6);
    text-align: center;
    color: var(--text-muted);
    font-size: var(--fs-sm);
  }

  /* Thin solid 1px marker lines */
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

</style>
