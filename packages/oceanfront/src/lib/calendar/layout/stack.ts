import { hasOverlap } from '..'
import { CalendarEventsGroup, Column } from '../common'

export default function layout(group: CalendarEventsGroup): void {
    const columns: Column[] = []
    let lastEnd: number | undefined
    for (const p of group.placements) {
        let added = false
        for (const c of columns) {
            let overlapping = false
            for (const other of c.placements) {
                if (hasOverlap(p.start, p.end, other.start, other.end)) {
                    if (other.start - p.start >= -30) {
                        overlapping = true
                        break
                    }
                }
            }
            if (!overlapping) {
                if (p.start <= c.end) {
                    if (lastEnd && p.start < lastEnd) {
                        c.offset++
                    }
                    p.offset = c.offset
                } else {
                    c.offset = 0
                }
                lastEnd = p.end
                c.placements.push(p)
                c.end = Math.max(c.end, p.end)
                added = true
                break
            }
        }
        if (!added) {
            p.zIndex = columns.length
            lastEnd = p.end
            columns.push({
                placements: [p],
                offset: 0,
                end: lastEnd
            })
        }
    }
    columns.forEach((c, cIdx) => {
        for (const p of c.placements) {
            p.columns = 1
            itColumns: for (const c2 of columns.slice(cIdx + 1)) {
                for (const p2 of c2.placements) {
                    if (hasOverlap(p.start, p.end, p2.start, p2.end)) {
                        if (Math.abs(p.start - p2.start) < 30) {
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
