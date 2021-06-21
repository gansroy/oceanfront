import { defineComponent, h } from "vue"
import calendarProps from './props'
import { CalendarAlldayEventPlacement, CalendarEvent, CalendarEventPlacement, InternalEvent, layoutFunc, parseEvent, Timestamp } from '../../lib/calendar/common'
import { FormatState, useFormats } from "src/lib/formats"
import {
    getGroups,
    getEventsOfDay,
    getDayIdentifier,
    toTimestamp,
    getNormalizedTSRange,
    eventsStartingAtDay,
    withZeroTime,
    getTimestampIdintifier,
} from '../../lib/calendar'
import StackLayout from '../../lib/calendar/layout/stack'
import ColumnLayout from '../../lib/calendar/layout/columns'
import { DateTimeFormatterOptions } from "src/formats/DateTime"
import { BusyInfo, layoutAllday } from "src/lib/calendar/layout/allday"
import { addMinutes } from "src/lib/datetime"


function formatRange(mgr: FormatState, e: InternalEvent, withinDate: Date) {
    const [startTS, endTS] = getNormalizedTSRange(e, withinDate)
    const start = new Date(startTS.year, startTS.month, startTS.day, startTS.hours, startTS.minutes)
    const end = new Date(endTS.year, endTS.month, endTS.day, endTS.hours, endTS.minutes)
    const spansNoon = startTS.hours < 12 != endTS.hours < 12
    const opts: DateTimeFormatterOptions = {
        nativeOptions: { hour: "numeric", minute: "numeric" }
    }
    const fmt = mgr.getTextFormatter('date', opts)
    const resStart = fmt?.format(start).parts as any[]
    const resEnd = fmt?.format(end).parts as any[]
    if (!resStart || !resEnd) return ''
    const startStr = resStart.filter(p => spansNoon || p.type != "dayPeriod").map(p => p.value).join('').trim()
    const endStr = resEnd.map(p => p.value).join('').trim()
    return startStr + '-' + endStr
}

export default defineComponent({
    props: {
        ...calendarProps.internal,
        ...calendarProps.common,
    },
    emits: [
        'click:event',
        'click:category',
        'click:day',
        'mousedown:time',
        'mousemove:time',
        'mouseup:time',
        'selection:change',
        'selection:end',
        'selection:cancel',
    ],
    data() {
        const selecting = false
        return {
            selecting: selecting as 'start' | 'end' | false,
            selectionStart: 0,
            selectionEnd: 0,
            selectionCategory: "",
        }
    },
    computed: {
        numHourIntervals(): number {
            return parseInt(this.$props.hourIntervals as unknown as string) || 4
        },
        parsedEvents(): InternalEvent[] {
            const events: CalendarEvent[] = this.$props.events || []
            const mgr = useFormats()
            return events.map(e => parseEvent(e, mgr)).filter(e => e !== undefined) as InternalEvent[]
        },
        formatMgr: () => useFormats(),
        layoutFunc(): layoutFunc {
            return this.$props.layout === 'stack' ? StackLayout : ColumnLayout
        },
        hasAllDay(): boolean {
            return (this.$props.events?.filter((e) => e.allDay).length || 0) > 0
        },
        allDayEvents() {
            const visRange = this.visibleRange || []
            const rangeStart = getDayIdentifier(visRange[0])
            const allDayEvents = {} as any
            let busyInfo: BusyInfo = { busyColumns: [], currentColumn: 0 }
            for (const cat of this.$props.categoriesList || []) {
                const day = getDayIdentifier(toTimestamp(cat.date))
                const evs = this.$props.events
                    ? eventsStartingAtDay(
                        getEventsOfDay(this.parsedEvents, day, true, this.ignoreCategories ? undefined : cat.category, true),
                        day,
                        rangeStart
                    )
                    : []
                const layedOut = layoutAllday(evs, visRange, busyInfo)
                if (this.$props.type == 'category') busyInfo = { busyColumns: [], currentColumn: 0 }
                allDayEvents[cat.category] = layedOut
            }
            return allDayEvents
        },
        dayEvents() {
            const dayEvents = {} as any
            for (const cat of this.$props.categoriesList || []) {
                const day = getDayIdentifier(toTimestamp(cat.date))
                const threshold = parseInt(this.$props.overlapThreshold as unknown as string) || 0
                const groups = this.$props.events
                    ? getGroups(this.parsedEvents, day, false, this.ignoreCategories ? undefined : cat.category, this.layoutFunc, threshold)
                    : []
                const placements = []
                for (const g of groups) {
                    placements.push(...g.placements)
                }
                dayEvents[cat.category] = placements
            }
            return dayEvents
        },
        intervals() {
            return Array.from({ length: 24 }, (_, i) => i)
        },
    },
    methods: {
        getEventIntervalRange(ts: Timestamp): number[] {
            const startTsId = getTimestampIdintifier(ts)
            const endTsId = getTimestampIdintifier(toTimestamp(addMinutes(ts.date, 60 / this.numHourIntervals)))
            return [startTsId, endTsId]
        },
        getEventTimestamp(e: MouseEvent | TouchEvent, day: Timestamp) {
            const precision = 60 / this.numHourIntervals
            const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect()
            const touchEvent: TouchEvent = e as TouchEvent
            const mouseEvent: MouseEvent = e as MouseEvent
            const touches: TouchList = touchEvent.changedTouches || touchEvent.touches
            const clientY: number = touches && touches[0] ? touches[0].clientY : mouseEvent.clientY
            const offsetY = (clientY - bounds.top)
            let minutes = Math.floor(offsetY / bounds.height * 24 * 60)
            minutes -= minutes % precision
            const ts = toTimestamp(addMinutes(withZeroTime(day).date, minutes))
            return ts
        },

        superTitle() {
            const slot = this.$slots['super-title']
            if (!slot) return ''
            return [
                h('div', { class: "of-calendar-gutter" }),
                h('div', { class: "of-calendar-day-supertitle" }, slot()),
            ]
        },
        title() {
            if (!this.$props.categoryTitles) {
                return ''
            }
            const isDate = this.$props.type != 'category'
            const slot = isDate ? this.$slots['day-title'] : this.$slots['category-title']
            const titles = !this.$props.categoriesList
                ? ''
                : this.$props.categoriesList.map((cat) => {
                    const theDay = cat.date
                    const slotArgs = isDate ? theDay : cat.category
                    return h(
                        'div',
                        {
                            class: 'of-calendar-category-title',
                            onClick: (event: any) => {
                                if (!isDate) {
                                    this.$emit('click:category', event, cat.category)
                                } else {
                                    this.$emit('click:day', event, theDay)
                                }
                            }
                        },
                        slot
                            ? slot(slotArgs)
                            : cat.category
                    )

                })
            return h('div', { class: 'of-calendar-day-titles' }, [
                h('div', { class: 'of-calendar-gutter' }),
                titles
            ])
        },
        allDayRow() {
            if (!this.hasAllDay) return ''
            const eventHeight = parseInt(this.$props.eventHeight as unknown as string) || 20
            let height = 0
            const columns = !this.$props.categoriesList
                ? ''
                : this.$props.categoriesList.map((cat) => {
                    const events = this.allDayEvents[cat.category] as CalendarAlldayEventPlacement[] || []
                    return h('div', { class: 'of-calendar-day' },
                        events.map(e => {
                            height = Math.max(e.top, height)
                            const finalColor = this.$props.eventColor?.(e.event) ?? e.event.color
                            return h('div',
                                {
                                    class: 'of-calendar-event',
                                    style: {
                                        'background-color': finalColor,
                                        width: '' + ((e.daysSpan * 100) - 2) + '%',
                                        top: '' + (e.top * eventHeight) + 'px',
                                    },
                                    onClick: (event: any) => {
                                        this.$emit('click:event', event, { ...e.event, color: finalColor })
                                    },
                                },
                                h('strong', e.event.name),
                            )
                        })
                    )
                })
            return h('div', { class: 'of-calendar-allday-row', style: { height: '' + (height * eventHeight + eventHeight) + 'px' } }, [
                h('div', { class: 'of-calendar-gutter' }),
                columns,
            ])
        },
        dayRow() {
            const intervals = this.intervals.map(
                (interval) =>
                    h('div', { class: 'of-calendar-interval' },
                        h('div', { class: 'of-calendar-interval-label' }, interval)
                    )
            )
            const days = !this.$props.categoriesList
                ? ''
                : this.$props.categoriesList.map((cat) => {
                    const theDayTS = withZeroTime(toTimestamp(cat.date))
                    const intervals = this.intervals.map((_, i) => {
                        const numSubIntervals = this.numHourIntervals
                        const subIntevals = Array.from({ length: numSubIntervals }, (_, j) => {
                            const minutes = 60 * i + 60 / numSubIntervals * j
                            const intervalTime = getTimestampIdintifier(toTimestamp(addMinutes(theDayTS.date, minutes)))
                            return h('div', {
                                class: {
                                    'of-calendar-subinterval': true,
                                    selected:
                                        this.$data.selecting
                                        && intervalTime >= this.$data.selectionStart
                                        && intervalTime < this.$data.selectionEnd
                                        && this.$data.selectionCategory == cat.category
                                }
                            })
                        })
                        return h('div', {
                            class: "of-calendar-interval",
                        },
                            subIntevals)
                    }
                    )
                    const es = this.dayEvents[cat.category] as CalendarEventPlacement[] || []
                    const events = es.map(e => {
                        const brk = e.event.end - e.event.start > 45
                        const separator = !brk
                            ? ' '
                            : h('br')
                        const formattedRange = formatRange(this.formatMgr, e.event, cat.date)
                        const slot = this.$slots['event-content']
                        const finalColor = this.$props.eventColor?.(e.event) ?? e.event.color
                        return h('div',
                            {
                                class: {
                                    'of-calendar-event': true,
                                    conflict: e.conflict,
                                },
                                style: {
                                    'background-color': finalColor,
                                    'z-index': e.zIndex,
                                    left: e.left * 100 + '%',
                                    width: e.width * 100 + '%',
                                    top: e.top + '%',
                                    height: e.height + '%',
                                },
                                onClick: (event: any) => {
                                    this.$emit('click:event', event, { ...e.event, color: finalColor })
                                },
                                onMouseDown: (event: any) => {
                                    event.stopPropagation()
                                },
                            },
                            slot
                                ? slot({
                                    placement: e,
                                    brk,
                                    formattedRange
                                })
                                : [
                                    h('strong', e.event.name),
                                    separator,
                                    formattedRange,
                                ]
                        )
                    })
                    return h(
                        'div',
                        {
                            class: 'of-calendar-day',
                            onMouseMove: (e: MouseEvent | TouchEvent) => {
                                const ts = this.getEventTimestamp(e, toTimestamp(cat.date))
                                this.$emit('mousemove:time', e, ts)
                                if (this.selecting) {
                                    const [startTs, endTs] = this.getEventIntervalRange(ts)
                                    if (startTs < this.selectionStart) {
                                        this.selecting = "start"
                                        this.selectionStart = startTs
                                    } else if (endTs > this.selectionEnd) {
                                        this.selecting = "end"
                                        this.selectionEnd = endTs
                                    } else if (this.selecting == "start") {
                                        this.selectionStart = startTs
                                    } else if (this.selecting == "end") {
                                        this.selectionEnd = endTs
                                    }
                                    this.$emit('selection:change', this.selectionStart, this.selectionEnd, this.selectionCategory)
                                }
                            },
                            onMouseDown: (e: MouseEvent | TouchEvent) => {
                                const ts = this.getEventTimestamp(e, toTimestamp(cat.date))
                                const [startTsId, endTsId] = this.getEventIntervalRange(ts)
                                this.$emit('mousedown:time', e, ts)
                                const leftPressed = (e as MouseEvent).buttons === 1
                                if (this.selectable && leftPressed) {
                                    this.$data.selecting = "end"
                                    this.$data.selectionStart = startTsId
                                    this.$data.selectionEnd = endTsId
                                    this.$data.selectionCategory = cat.category
                                    this.$emit('selection:change', this.selectionStart, this.selectionEnd, this.selectionCategory)
                                }
                            },
                            onMouseUp: (e: MouseEvent | TouchEvent) => {
                                const ts = this.getEventTimestamp(e, toTimestamp(cat.date))
                                this.$emit('mouseup:time', e, ts)
                                const leftReleased = ((e as MouseEvent).buttons & 1) === 0
                                if (this.selecting && leftReleased) {
                                    this.$emit('selection:end', this.selectionStart, this.selectionEnd, this.selectionCategory)
                                    this.selecting = false
                                }
                            },
                        },
                        [
                            ...intervals,
                            ...events,
                        ])
                })
            return h('div', {
                class: 'of-calendar-day-row',
                onMouseLeave: (_: MouseEvent | TouchEvent) => {
                    if (this.selecting) {
                        this.$emit('selection:cancel')
                        this.selecting = false
                    }
                },
            }, [
                h('div', {
                    class: 'of-calendar-gutter',
                }, intervals),
                days,
            ])
        },
        header() {
            const slot = this.$slots['header']
            return slot?.()
        },
    },
    render() {
        const eventHeight = parseInt(this.$props.eventHeight as unknown as string) || 20
        const conflictColor = this.$props.conflictColor || null
        const subIntervalHeight = '' + (100 / this.numHourIntervals) + '%'
        return h('div',
            {
                class: "container",
                style: {
                    "--of-event-height": `${eventHeight}px`,
                    "--of-calendar-conflict-color": conflictColor,
                    "--of-calendar-subinterval-height": subIntervalHeight,
                },
                onSelectStart(e: Event) {
                    e.preventDefault()
                },
            },
            [
                this.header(),
                h('div',
                    [
                        this.superTitle(),
                        this.title(),
                        this.allDayRow(),
                        this.dayRow(),
                    ]
                )
            ]
        )
    },
})
