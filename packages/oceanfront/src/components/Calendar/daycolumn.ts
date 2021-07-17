import { DateTimeFormatterOptions } from "src/formats/DateTime"
import { BusyInfo, layoutAllday } from "src/lib/calendar/layout/allday"
import { addMinutes } from "src/lib/datetime"
import { FormatState, useFormats } from "src/lib/formats"
import { defineComponent, h } from "vue"
import {
    eventsStartingAtDay,
    getDayIdentifier,
    getEventsOfDay,
    getGroups,
    getNormalizedTSRange,
    getTimestampIdintifier,
    toTimestamp,
    withZeroTime
} from '../../lib/calendar'
import {
    CalendarAlldayEventPlacement,
    CalendarEvent,
    CalendarEventPlacement,
    InternalEvent,
    layoutFunc,
    parseEvent,
    Timestamp
} from '../../lib/calendar/common'
import ColumnLayout from '../../lib/calendar/layout/columns'
import StackLayout from '../../lib/calendar/layout/stack'
import Base from './base'
import calendarProps, { categoryItem } from './props'


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
    mixins: [Base],
    props: {
        ...calendarProps.internal,
        ...calendarProps.common,
    },
    emits: [
        'click:event',
        'enter:event',
        'leave:event',
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

        overlapThresholdNumber(): number {
            return parseInt(this.$props.overlapThreshold as unknown as string) || 0
        },
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
                const dayEvents = getEventsOfDay(this.parsedEvents, day, true, this.ignoreCategories ? undefined : cat.category, true)
                const evs = eventsStartingAtDay(dayEvents, day, rangeStart)
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
                const threshold = this.overlapThresholdNumber
                const forCategory = this.ignoreCategories ? undefined : cat.category
                const groups = getGroups(this.parsedEvents, day, false, forCategory, this.layoutFunc, threshold, this.hoursInterval)
                dayEvents[cat.category] = groups.map(g => g.placements).flat(1)
            }
            return dayEvents
        },
        hoursInterval() {
            let start: number = parseInt(this.dayStart as unknown as string) || 0;
            let end: number = parseInt(this.dayEnd as unknown as string) || 0;
            if (start >= end) [start, end] = [0, 24];
            if (start < 0) start = 0;
            if (end > 24) end = 24;
            return [start, end];
        }
    },
    methods: {
        intervals() {
            const [start, end] = this.hoursInterval;
            return Array.from({ length: end - start }, (_, i) => i + start)
        },
        getEventIntervalRange(ts: Timestamp): number[] {
            const startTsId = getTimestampIdintifier(ts)
            const endTsId = getTimestampIdintifier(toTimestamp(addMinutes(ts.date, 60 / this.numHourIntervals)))
            return [startTsId, endTsId]
        },
        getEventTimestamp(e: MouseEvent | TouchEvent, day: Timestamp) {
            const hours = this.hoursInterval
            const precision = 60 / this.numHourIntervals
            const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect()
            const touchEvent: TouchEvent = e as TouchEvent
            const mouseEvent: MouseEvent = e as MouseEvent
            const touches: TouchList = touchEvent.changedTouches || touchEvent.touches
            const clientY: number = touches && touches[0] ? touches[0].clientY : mouseEvent.clientY
            const offsetY = (clientY - bounds.top)
            let minutes = Math.floor(offsetY / bounds.height * (hours[1] - hours[0]) * 60)
            minutes -= minutes % precision
            minutes += hours[0] * 60
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
        renderCategoryTitle(cat: categoryItem) {
            const isDate = this.$props.type != 'category'
            const slotName = isDate ? 'day-title' : 'category-title'
            const theDay = cat.date
            const slotArgs = isDate ? theDay : cat.category
            const eventName = isDate ? 'click:day' : 'click:category'
            return h('div',
                {
                    class: 'of-calendar-category-title',
                    onClick: (event: any) => this.$emit(eventName, event, slotArgs)
                },
                this.renderSlot(slotName, slotArgs, () => cat.category)
            )
        },
        title() {
            if (!this.$props.categoryTitles) {
                return ''
            }
            const titles = !this.$props.categoriesList
                ? ''
                : this.$props.categoriesList.map(this.renderCategoryTitle)

            return h('div', { class: 'of-calendar-day-titles' }, [
                h('div', { class: 'of-calendar-gutter' }),
                titles
            ])
        },
        allDayRowEvent(acc: { height: number, columns: any[] }, eventHeight: number) {
            return (e: CalendarAlldayEventPlacement) => {
                acc.height = Math.max(e.top, acc.height)
                const finalColor = this.$props.eventColor?.(e.event) ?? e.event.color
                const eventClass = this.$props.eventClass?.(e.event) ?? {}
                const slot = this.$slots['allday-event-content']
                return h('div',
                    {
                        class: { ...eventClass, 'of-calendar-event': true },
                        style: {
                            'background-color': finalColor,
                            width: '' + (((e.daysSpan || 1) * 100) - 2) + '%',
                            top: '' + (e.top * eventHeight) + 'px',
                        },
                        onClick: (event: any) => {
                            this.$emit('click:event', event, { ...e.event, color: finalColor })
                        },
                        onMouseenter: (event: any) => {
                            this.$emit('enter:event', event, e)
                        },
                        onMouseleave: (event: any) => {
                            this.$emit('leave:event', event, e)
                        },
                    },
                    slot ? slot({ event: e.event }) : h('strong', e.event.name),
                )
            }
        },
        allDayRowCell(acc: { height: number, columns: any[] }, cat: categoryItem) {
            const eventHeight = parseInt(this.$props.eventHeight as unknown as string) || 20
            const events = this.allDayEvents[cat.category] as CalendarAlldayEventPlacement[] || []
            const vnode = h('div', { class: 'of-calendar-day' },
                events.map(this.allDayRowEvent(acc, eventHeight))
            )
            acc.columns.push(vnode)
            return acc
        },
        allDayRow() {
            if (!this.hasAllDay) return ''
            const eventHeight = parseInt(this.$props.eventHeight as unknown as string) || 20
            const { height, columns } = !this.$props.categoriesList
                ? { height: 0, columns: [] as any[] }
                : this.$props.categoriesList.reduce(this.allDayRowCell, { height: 0, columns: [] as any[] })
            return h('div', { class: 'of-calendar-allday-row', style: { height: '' + (height * eventHeight + eventHeight) + 'px' } }, [
                h('div', { class: 'of-calendar-gutter' }),
                columns,
            ])
        },
        intervalSelectionHandlers(cat: categoryItem) {
            return {
                onMousemove: (e: MouseEvent | TouchEvent) => {
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

                onMousedown: (e: MouseEvent | TouchEvent) => {
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
                onMouseup: (e: MouseEvent | TouchEvent) => {
                    const ts = this.getEventTimestamp(e, toTimestamp(cat.date))
                    this.$emit('mouseup:time', e, ts)
                    const leftReleased = ((e as MouseEvent).buttons & 1) === 0
                    if (this.selecting && leftReleased) {
                        this.$emit('selection:end', this.selectionStart, this.selectionEnd, this.selectionCategory)
                        this.selecting = false
                    }
                },
            }
        },
        dayRowEventHandlers(e: InternalEvent) {
            return {
                onClick: (event: any) => {
                    this.$emit('click:event', event, e)
                },
                onMousedown: (event: any) => {
                    event.stopPropagation()
                },
                onMouseenter: (event: any) => {
                    if (!this.selecting) {
                        this.$emit('enter:event', event, e)
                    }
                },
                onMouseleave: (event: any) => {
                    if (!this.selecting) {
                        this.$emit('leave:event', event, e)
                    }
                },
            }
        },
        dayRowEvent(cat: categoryItem) {
            return (e: CalendarEventPlacement) => {
                const brk = e.event.end - e.event.start > this.overlapThresholdNumber
                const separator = !brk
                    ? ' '
                    : h('br')
                const formattedRange = formatRange(this.formatMgr, e.event, cat.date)
                const finalColor = this.$props.eventColor?.(e.event) ?? e.event.color
                const eventClass = this.$props.eventClass?.(e.event) ?? {}
                const finalEvent = { ...e.event, color: finalColor }
                return h('div',
                    {
                        class: {
                            ...eventClass,
                            'of-calendar-event': true,
                            conflict: e.conflict,
                            'two-lines': brk,
                        },
                        style: {
                            'background-color': finalColor,
                            'z-index': e.zIndex,
                            left: e.left * 100 + '%',
                            width: e.width * 100 + '%',
                            top: e.top + '%',
                            height: e.height + '%',
                        },
                        ...this.dayRowEventHandlers(finalEvent)
                    },
                    this.renderSlot(
                        'event-content',
                        { event: e.event, brk, formattedRange },
                        () => [h('strong', e.event.name), separator, formattedRange,]
                    )
                )

            }
        },
        dayRowInterval(cat: categoryItem, intervalNumber: number) {
            return (_: any, subIntervalNumber: number) => {
                const theDayTS = withZeroTime(toTimestamp(cat.date))
                const numSubIntervals = this.numHourIntervals
                const [startHour] = this.hoursInterval
                const minutes = 60 * intervalNumber + 60 / numSubIntervals * subIntervalNumber + startHour * 60
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
            }
        },
        dayRowCell(cat: categoryItem) {
            const numSubIntervals = this.numHourIntervals
            const intervals = this.intervals().map((_, intervalNumber) => {
                const subIntevals = Array.from({ length: numSubIntervals }, this.dayRowInterval(cat, intervalNumber))
                return h('div', {
                    class: "of-calendar-interval",
                },
                    subIntevals)
            })
            const es = this.dayEvents[cat.category] as CalendarEventPlacement[] || []
            const events = es.map(this.dayRowEvent(cat))
            return h(
                'div',
                {
                    class: 'of-calendar-day',
                    ...this.intervalSelectionHandlers(cat),
                },
                [
                    ...intervals,
                    ...events,
                ])

        },
        dayRow() {
            const intervals = this.intervals().map(
                (interval) =>
                    h('div', { class: 'of-calendar-interval' },
                        h('div', { class: 'of-calendar-interval-label' }, interval)
                    )
            )
            const days = (this.$props.categoriesList || []).map(this.dayRowCell)
            return h('div', {
                class: 'of-calendar-day-row',
                onMouseleave: (_: MouseEvent | TouchEvent) => {
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
        const hourHeight = parseInt(this.$props.hourHeight as unknown as string) || 48
        const conflictColor = this.$props.conflictColor || null
        const subIntervalHeight = '' + (100 / this.numHourIntervals) + '%'
        return h('div',
            {
                class: "container",
                style: {
                    "--of-calendar-iterval-height": `${hourHeight}px`,
                    "--of-event-height": `${eventHeight}px`,
                    "--of-calendar-conflict-color": conflictColor,
                    "--of-calendar-subinterval-height": subIntervalHeight,
                },
                onselectstart(e: Event) {
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
