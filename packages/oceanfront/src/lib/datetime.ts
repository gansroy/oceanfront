export const sameDate = (d1: Date, d2: Date): boolean =>
    d1.getDate() == d2.getDate()
    && d1.getMonth() == d2.getMonth()
    && d1.getFullYear() == d2.getFullYear()


// always sets day to 1!
export const addMonths = (d: Date, months: number): Date => {
    return new Date(d.getFullYear(), d.getMonth() + months, 1)
}

export const addDays = (d: Date, days: number): Date => {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
}

export const addMinutes = (d: Date, minutes: number): Date => {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + minutes)
}

export const allDayEnd = (d: Date): Date => {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
}

export const firstSunday = (d?: Date): Date => {
    d = d || new Date()
    return new Date
}
export interface MonthGridCell {
    date: Date
    today: boolean
    otherMonth: boolean
}

export interface MonthGridData {
    weekDays: number[]
    grid: MonthGridCell[][]
}


export function nextMonth(date: Date): Date {
    return addMonths(date, 1)
}

export function prevMonth(date: Date): Date {
    return addMonths(date, -1)
}

export const monthGrid = (forDate?: Date): MonthGridData => {
    const weekDays = [0, 1, 2, 3, 4, 5, 6]
    const monthStart = new Date(forDate?.valueOf() ?? new Date().valueOf())
    monthStart.setDate(1)
    const month = monthStart.getMonth()
    let date = addDays(monthStart, - monthStart.getDay())
    let rowIdx = 0
    const grid = []
    const today = new Date()
    // there are always at least 4 rows, and we want to stop as soon as we
    // hit another month 
    while (rowIdx < 4 || date.getMonth() == month) {
        rowIdx++
        const row = []
        for (let i = 0; i < 7; i++) {
            row.push({
                date,
                today: sameDate(today, date),
                otherMonth: date.getMonth() != month,
            })
            date = addDays(date, 1)
        }
        grid.push(row)
    }
    return {
        grid,
        weekDays,
    }
}
