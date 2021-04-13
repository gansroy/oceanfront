import { hasOverlap, MINUTES_IN_DAY } from '..'
import { CalendarEventsGroup, Column, TimestampIdentifier } from '../common'

export default function layout(group: CalendarEventsGroup, day: TimestampIdentifier): void {
    const columns: Column[] = []
    for (const p of group.placements) {
        let added = false
        for (const c of columns) {
            let overlapping = false
            for (const other of c.placements) {
                const s1 = Math.max(p.event.start, day)
                const e1 = Math.min(p.event.end, day + MINUTES_IN_DAY)
                const s2 = Math.max(other.event.start, day)
                const e2 = Math.min(other.event.end, day + MINUTES_IN_DAY)
                if (hasOverlap(s1, e1, s2, e2)) {
                    if (s2 - s1 >= -30) {
                        overlapping = true
                        break
                    }
                }
            }
            if (!overlapping) {
                if (p.event.start <= c.end) {
                    c.offset++
                    p.offset = c.offset
                } else {
                    c.offset = 0
                }
                c.placements.push(p)
                c.end = Math.max(c.end, Math.min(p.event.end, day + MINUTES_IN_DAY))
                added = true
                break
            }
        }
        if (!added) {
            p.zIndex = columns.length
            columns.push({
                placements: [p],
                offset: 0,
                end: p.event.end
            })
        }
    }
    columns.forEach((c, cIdx) => {
        for (const p of c.placements) {
            p.columns = 1
            itColumns: for (const c2 of columns.slice(cIdx + 1)) {
                for (const p2 of c2.placements) {
                    const s1 = Math.max(p.event.start, day)
                    const e1 = Math.min(p.event.end, day + MINUTES_IN_DAY)
                    const s2 = Math.max(p2.event.start, day)
                    const e2 = Math.min(p2.event.end, day + MINUTES_IN_DAY)
                    if (hasOverlap(s1, e1, s2, e2)) {
                        if (Math.abs(s1 - s2) < 30) {
                            break itColumns;
                        }
                    }
                }
                p.columns++;
            }
        }
    })
    const colWidth = 1.0 / columns.length
    let left = 0
    for (const c of columns) {
        for (const p of c.placements) {
            const offset = 0.02 * p.offset
            p.left = left + offset
            p.width = colWidth * p.columns - offset
        }
        left += colWidth
    }
}
