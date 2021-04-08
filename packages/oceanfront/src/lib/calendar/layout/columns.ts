import { hasOverlap } from '..'
import { CalendarEventsGroup, Column } from '../common'

export default function layout(group: CalendarEventsGroup): void {
    const columns: Column[] = []
    for (const p of group.placements) {
        let added = false
        for (const c of columns) {
            let overlapping = false
            for (const other of c.placements) {
                if (hasOverlap(p.event.start, p.event.end, other.event.start, other.event.end)) {
                    overlapping = true
                    break
                }
            }
            if (!overlapping) {
                c.placements.push(p)
                added = true
                break
            }
        }
        if (!added) {
            columns.push({
                placements: [p]
            })
        }
    }
    columns.forEach((c, cIdx) => {
        for (const p of c.placements) {
            p.columns = 1
            itColumns: for (const c2 of columns.slice(cIdx + 1)) {
                for (const p2 of c2.placements) {
                    if (hasOverlap(p.event.start, p.event.end, p2.event.start, p2.event.end)) {
                        break itColumns;
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
            p.left = left
            p.width = colWidth * p.columns
        }
        left += colWidth
    }
}