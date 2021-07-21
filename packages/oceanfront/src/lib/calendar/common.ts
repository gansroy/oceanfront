import { DateTimeFormatter } from "src/formats/DateTime"
import { FormatState } from "src/lib/formats"
import { getDayIdentifier, getTimeIdentifier, getTimestampIdintifier, toTimestamp } from "."
import { addMinutes, allDayEnd } from "../datetime"

export type DayIdentifier = number
export type TimeIdentifier = number
export type TimestampIdentifier = number

export type categoryItem = {
    category: string,
    date: Date
}

export interface Timestamp {
    readonly date: Date
    readonly year: number
    readonly month: number
    readonly day: number
    readonly hours: number
    readonly minutes: number
}

/** Calendar event. This event representation is used to supply events to the
 * calendar. The events will be parsed into InternalEvent. If event duration
 * cannot be determined from either of `end` or `duration` fields, the event
 * will be considered all-day regardless of `allDay` field value. All-day events
 * can span multiple days.  */
export interface CalendarEvent {
    /** Event name */
    readonly name: string
    /** Event start date/time "2009-12-28 11:30" */
    readonly start: string
    /** Event end date/time "2009-12-28 14:45" */
    readonly end?: string
    /** Event duration in minutes */
    readonly duration?: number
    /** Event color */
    readonly color?: string
    /** True if the event takes all day */
    readonly allDay?: boolean
    /** Event category */
    readonly category?: string | string[]
    readonly [_: string]: any

}


/** Calendar event, internal representation */
export interface InternalEvent {
    /** The original event that was parsed to create this internal representation */
    readonly orig: any
    /** Event start day identifier */
    readonly startDay: DayIdentifier
    /** Event start time identifier */
    readonly startTime: TimeIdentifier
    /** Event end  date identifier */
    readonly endDay: DayIdentifier
    /** Event end  time identifier */
    readonly endTime: TimeIdentifier
    readonly start: TimestampIdentifier
    readonly end: TimestampIdentifier
    readonly startTS: Timestamp
    readonly endTS: Timestamp
    /** True if the event occupies all day */
    readonly allDay?: boolean
    /** Event name */
    readonly name?: string
    /** Event color */
    readonly color?: string
    /** Event category */
    readonly category?: string | string[]

    uniq: string;

    readonly [_: string]: any
}

export type CalendarAlldayEventPlacement = {
    event: InternalEvent
    top: number
    daysSpan: number
}

/** CalendarEventPlacement represents the placement of an event within a day.
 * Expressing height in milliseconds allows to adapt for different vertical
 * scales and grid slot heights. 
 * 
 * TODO: Would fractions of the whole day work here?
 */
export type CalendarEventPlacement = {
    /** The original event */
    event: InternalEvent
    start: TimestampIdentifier
    end: TimestampIdentifier
    /** Top position, expressed in minutes since day start */
    top: number
    /** Width as a fraction of day width */
    width: number
    /** Height, expressed in milliseconds */
    height: number
    left: number
    columns: number
    columnAdjust: number
    offset: number
    zIndex: number
    conflict: boolean
}

/** CalendarEventsGroup is a group of overlapping events */
export type CalendarEventsGroup = {
    start: TimestampIdentifier
    end: TimestampIdentifier
    placements: CalendarEventPlacement[]
}

export type Column = {
    placements: CalendarEventPlacement[]
    offset: number
    end: number
}

export type layoutFunc = (group: CalendarEventsGroup, overlapThreshold: number) => void

export const parseEvent = (e: CalendarEvent, f: FormatState): InternalEvent | undefined => {
    const fm = f.getTextFormatter('datetime') as DateTimeFormatter
    const startDate = fm.loadValue(e.start)
    if (startDate == null) { return undefined }
    let endDate: Date | null = null
    if (e.end) {
        endDate = fm.loadValue(e.end)
    }
    if (endDate == null && e.duration || 0 > 0) {
        endDate = addMinutes(startDate, e.duration || 0)
    }
    let allDay = e.allDay || false
    if (endDate == null || endDate < startDate) {
        allDay = true
        endDate = allDayEnd(startDate)
    }
    const startTS = toTimestamp(startDate)
    const endTS = toTimestamp(endDate)
    return {
        uniq: "",
        name: e.name,
        color: e.color,
        allDay: allDay,
        startTS: startTS,
        endTS: endTS,
        start: getTimestampIdintifier(startTS),
        end: getTimestampIdintifier(endTS),
        startDay: getDayIdentifier(startTS),
        endDay: getDayIdentifier(endTS),
        startTime: getTimeIdentifier(startTS),
        endTime: getTimeIdentifier(endTS),
        category: e.category,
        orig: e,
    }
}

export const uniqEvent = (e: InternalEvent, cat: categoryItem): InternalEvent => {
    return { ...e, uniq: "" + getDayIdentifier(toTimestamp(cat.date)) + "|" + cat.category }
}