export type MonthGridRenderer = (g: MonthGridData) => void

const sameDate = (d1: Date, d2: Date): boolean =>
    d1.getDate() == d2.getDate()
    && d1.getMonth() == d2.getMonth()
    && d1.getFullYear() == d2.getFullYear()


// always sets day to 1!
const addMonths = (d: Date, months: number): Date => {
    return new Date(d.getFullYear(), d.getMonth() + months, 1)
}

const addDays = (d: Date, days: number): Date => {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
}

export interface MonthGrid {
    selectedDate: Date
    readonly monthStart: Date
    nextMonth: () => void
    prevMonth: () => void
}

export interface MonthGridCell {
    date: Date
    today: boolean
    selected: boolean
    otherMonth: boolean
}

export interface MonthGridData {
    newDate: boolean
    weekDays: number[]
    grid: MonthGridCell[][]
}

class MonthGridImpl {
    private _selectedDate: Date = new Date;
    private _r: MonthGridRenderer
    private _monthStart: Date

    constructor(r: MonthGridRenderer) {
        this._r = r
        this._monthStart = new Date(this._selectedDate.valueOf())
        this._monthStart.setDate(1)
        this._selectedDate = new Date()
    }

    get selectedDate(): Date { return this._selectedDate }
    get monthStart(): Date { return this._monthStart }

    set selectedDate(newDate: Date) {
        this._selectedDate = newDate
        this._monthStart = new Date(this._selectedDate.valueOf())
        this._monthStart.setDate(1)
        this.render(true)
    }

    nextMonth() {
        this._monthStart = addMonths(this._monthStart, 1)
        this.render()
    }
    prevMonth() {
        this._monthStart = addMonths(this._monthStart, -1)
        this.render()
    }

    render(newDate?: boolean): void {
        const weekDays = [0, 1, 2, 3, 4, 5, 6]
        const month = this._monthStart.getMonth()
        let date = addDays(this._monthStart, - this._monthStart.getDay())
        let rowIdx = 0
        const grid = []
        let today = new Date()
        // there are always at least 4 rows, and we want to stop as soon as we
        // hit another month 
        while (rowIdx < 4 || date.getMonth() == month) {
            rowIdx++
            let row = []
            for (let i = 0; i < 7; i++) {
                row.push({
                    date,
                    today: sameDate(today, date),
                    selected: sameDate(this._selectedDate, date),
                    otherMonth: date.getMonth() != month,
                })
                date = addDays(date, 1)
            }
            grid.push(row)
        }
        this._r({
            newDate: newDate || false,
            grid,
            weekDays,
        })
    }
}

export const monthGrid: (r: MonthGridRenderer) => MonthGrid = (r: MonthGridRenderer) => {
    let grid = new MonthGridImpl(r)
    return grid
}
