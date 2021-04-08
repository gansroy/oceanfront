import { CalendarEventPlacement, CalendarEventsGroup, DayIdentifier, InternalEvent, TimeIdentifier, Timestamp, TimestampIdentifier } from './common'
import layout from './layout/columns'

const OFFSET_TIMESTAMP = 10000
const OFFSET_YEAR = 10000
const OFFSET_MONTH = 100
const MINUTES_IN_DAY = 60 * 24
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


const getEventsOfDay = (events: InternalEvent[], day: DayIdentifier, allDay: boolean): InternalEvent[] => {
    return events.filter(
        e => (e.allDay || false) === allDay
            && isEventInRange(e, day * OFFSET_TIMESTAMP, (day + 1) * OFFSET_TIMESTAMP)
    )
}

export const hasOverlap = (s0: number, e0: number, s1: number, e1: number, exclude = true): boolean => {
    return exclude ? !(s0 >= e1 || e0 <= s1) : !(s0 > e1 || e0 < s1)
}

export const getNormalizedRange = (event: InternalEvent, day: DayIdentifier) => {
    const start = day * OFFSET_TIMESTAMP
    const end = (day + 1) * OFFSET_TIMESTAMP
    return [Math.max(event.start, start), Math.min(event.end, end)]
}

export function getGroups(events: InternalEvent[], day: DayIdentifier, allDay: boolean): CalendarEventsGroup[] {
    const groups: CalendarEventsGroup[] = []
    const dayEvents = getEventsOfDay(events, day, allDay)
    dayEvents.sort(
        (a, b) => a.start - b.start
    )
    const placements: CalendarEventPlacement[] = dayEvents.map(
        e => ({
            event: e,
            height: 0,
            top: 0,
            width: 0,
            left: 0,
        })
    )
    for (const p of placements) {
        const [start, end] = getNormalizedRange(p.event, day)
        let startTime = p.event.startTime
        let endTime = p.event.endTime

        if (p.event.startDay < day) {
            p.top = 0
            startTime = 0
        } else {
            p.top = p.event.startTime
        }
        if (p.event.endDay > day) {
            endTime = MINUTES_IN_DAY
        }
        p.height = endTime - startTime
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
        layout(g)
    }
    return groups
}

function positionEvents(group: CalendarEventsGroup): void {
    0
}