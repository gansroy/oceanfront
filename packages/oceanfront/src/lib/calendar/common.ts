export type DayIdentifier = number
export type TimeIdentifier = number
export type TimestampIdentifier = number

export interface Timestamp {
    readonly year: number
    readonly month: number
    readonly day: number
    readonly hours: number
    readonly minutes: number
}


/** Calendar event, internal representation */
export interface InternalEvent {
    /** Event start day identifier */
    readonly startDay: DayIdentifier
    /** Event start time identifier */
    readonly startTime: TimeIdentifier
    /** Event end  date identifier */
    readonly endDay: DayIdentifier
    /** Event end  time identifier */
    readonly endTime: DayIdentifier
    readonly start: TimestampIdentifier
    readonly end: TimestampIdentifier
    /** True if the event occupies all day */
    readonly allDay?: boolean
    /** Event name */
    readonly name?: string
    /** Event color */
    readonly color?: string

    readonly [_: string]: any
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
    /** Top position, expressed in minutes since day start */
    top: number
    /** Width as a fraction of day width */
    width: number
    /** Height, expressed in milliseconds */
    height: number
    left: number
    columns: number
}

/** CalendarEventsGroup is a group of overlapping events */
export type CalendarEventsGroup = {
    start: TimestampIdentifier
    end: TimestampIdentifier
    placements: CalendarEventPlacement[]
}

export type Column = {
    placements: CalendarEventPlacement[]
}

