import { CalendarEventPlacement, CalendarEventsGroup, DayIdentifier, InternalEvent, layoutFunc, TimeIdentifier, Timestamp, TimestampIdentifier } from './common'


const OFFSET_TIMESTAMP = 10000
const OFFSET_YEAR = 10000
const OFFSET_MONTH = 100
export const MINUTES_IN_DAY = 60 * 24
const MINUTES_IN_HOUR = 60

export function toTimestamp(date: Date): Timestamp {
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
    }
}

export const getDayIdentifier = (date: Timestamp): DayIdentifier => {
    return date.year * OFFSET_YEAR + date.month * OFFSET_MONTH + date.day
}

export const getTimeIdentifier = (date: Timestamp): TimeIdentifier => {
    return date.hours * MINUTES_IN_HOUR + date.minutes
}

export const getTimestampIdintifier = (date: Timestamp): DayIdentifier => {
    return getDayIdentifier(date) * OFFSET_TIMESTAMP + getTimeIdentifier(date)
}

export const isEventInRange =
    (event: InternalEvent, start: TimestampIdentifier, end: TimestampIdentifier): boolean =>
        event.start >= start && event.end <= end


export const getEventsOfDay = (events: InternalEvent[], day: DayIdentifier, allDay: boolean, category?: string, sorted?: boolean): InternalEvent[] => {
    const filtered = events.filter(
        e => (e.allDay || false) === allDay
            && (category === undefined || category === e.category)
            && isEventInRange(e, day * OFFSET_TIMESTAMP, (day + 1) * OFFSET_TIMESTAMP)
    )
    if (!sorted) return filtered
    return filtered.sort(
        (a, b) => a.start - b.start
    )
}

export const hasOverlap = (s0: number, e0: number, s1: number, e1: number, exclude = true): boolean => {
    return exclude ? !(s0 >= e1 || e0 <= s1) : !(s0 > e1 || e0 < s1)
}

export const getNormalizedRange = (event: InternalEvent, day: DayIdentifier): TimestampIdentifier[] => {
    const start = day * OFFSET_TIMESTAMP
    const end = (day + 1) * OFFSET_TIMESTAMP
    return [Math.max(event.start, start), Math.min(event.end, end)]
}

export function getGroups(events: InternalEvent[], day: DayIdentifier, allDay: boolean, category: string | undefined, layout: layoutFunc, overlapThreshold: number): CalendarEventsGroup[] {
    const groups: CalendarEventsGroup[] = []
    const dayEvents = getEventsOfDay(events, day, allDay, category)
    dayEvents.sort(
        (a, b) => a.start - b.start
    )
    const placements: CalendarEventPlacement[] = dayEvents.map(
        e => ({
            event: e,
            start: Math.max(day * OFFSET_TIMESTAMP, e.start),
            end: Math.min(day * OFFSET_TIMESTAMP + MINUTES_IN_DAY, e.end),
            height: 0,
            top: 0,
            width: 0,
            left: 0,
            columns: 1,
            offset: 0,
            zIndex: 0,
            columnAdjust: 0,
            conflict: false,
        })
    )
    for (const p of placements) {
        const [start, end] = [p.start, p.end]
        let startTime = p.event.startTime
        let endTime = p.event.endTime

        if (p.event.startDay < day) {
            p.top = 0
            startTime = 0
        } else {
            p.top = p.event.startTime / MINUTES_IN_DAY * 100
        }
        if (p.event.endDay > day) {
            endTime = MINUTES_IN_DAY
        }
        p.height = (endTime - startTime) / MINUTES_IN_DAY * 100
        let added = false
        for (const g of groups) {
            if (hasOverlap(start, end, g.start, g.end)) {
                g.placements.push(p)
                // no need to update start - events are sorted by start time, so
                // placement of the event with minimal timestamp is guaranteed
                // to be seen first
                g.end = Math.max(g.end, end)
                added = true
                break
            }
        }
        if (!added) {
            groups.push({
                start, end, placements: [p]
            })
        }
    }
    for (const g of groups) {
        if (g.placements.length > 1) {
            g.placements.forEach(p => { p.conflict = true })
        }
        layout(g, overlapThreshold)
    }
    return groups
}
