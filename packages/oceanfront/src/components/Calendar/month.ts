import { addDays, firstMonday, isoWeekNumber, monthGrid, MonthGridCell, MonthGridData } from "src/lib/datetime";
import calendarProps from './props'
import { defineComponent, h } from "vue";
import { useFormats } from "src/lib/formats";
import { CalendarEvent, InternalEvent, parseEvent } from "src/lib/calendar/common";
import { getDayIdentifier, getEventsOfDay, toTimestamp } from "src/lib/calendar";
import Base from './base'

export default defineComponent({
    mixins: [Base],
    props: {
        ...calendarProps.internal,
        ...calendarProps.common,
        ...calendarProps.month,
    },
    emits: [
        'click:event',
        'enter:event',
        'leave:event',
        'click:day',
        'click:more',
        'click:week',
    ],
    computed: {
        eventsLimitNumber(): number {
            const limit = parseInt(this.$props.eventsLimit as any as string) || 5
            if (limit < 2) return 2
            return limit
        },
        eventHeightNumber(): number {
            return parseInt(this.$props.eventHeight as unknown as string) || 20
        },

        monthGrid(): MonthGridData {
            return monthGrid(this.day)
        },
        parsedEvents(): InternalEvent[] {
            const events: CalendarEvent[] = this.$props.events || []
            const mgr = useFormats()
            return events.map(e => parseEvent(e, mgr)).filter(e => e !== undefined) as InternalEvent[]
        },
    },
    methods: {
        dayEvents(day: Date): InternalEvent[] {
            return getEventsOfDay(this.parsedEvents, getDayIdentifier(toTimestamp(day)), "ignore")
        },
        header() {
            const slot = this.$slots['header']
            return slot?.()
        },
        renderDayNumberOrSlot(day: Date) {
            const slot = this.$slots['day-title']
            const content = slot
                ? slot(day)
                : this.renderDayNumber(day, false)
            return h('div', {
                class: 'day-title', onClick: (event: any) => {
                    this.$emit('click:day', event, day)

                }
            }, content)
        },
        renderMoreLink(count: number, day: Date) {
            if (count < 1) return null
            const slot = this.$slots['more']
            return h('div', {
                class: 'of-calendar-more', onClick: (event: any) => {
                    this.$emit('click:more', event, day)
                }
            }, slot ? slot(count) : `${count} more`)
        },
        renderRow(rowDays: MonthGridCell[], weekNumber: number) {
            const firstDay = addDays(firstMonday(this.day), weekNumber * 7)
            const wn = isoWeekNumber(firstDay);
            const wnSlot = this.$slots['week-number']
            return h('div', { class: 'of-calendar-month-row' },
                [
                    h('div',
                        {
                            class: 'of-calendar-gutter of-week-number',
                            onClick: (event: any) => {
                                this.$emit('click:week', event, wn, firstDay)
                            }
                        }, wnSlot ? wnSlot(wn) : wn),
                    rowDays.map(day => {
                        const dayEvents = this.dayEvents(day.date)
                        let limit = this.eventsLimitNumber
                        let more = 0
                        if (dayEvents.length > limit) {
                            limit -= 1
                            more = dayEvents.length - limit
                        }
                        const events = dayEvents.slice(0, limit)
                        return h('div', { class: 'of-calendar-month-day' },
                            day.otherMonth && this.hideOtherMonths ? [] :
                                [
                                    this.renderDayNumberOrSlot(day.date),
                                    h('div', { class: 'events' },
                                        [
                                            events.map(e => {
                                                const slot = this.$slots['allday-event-content']
                                                const finalColor = this.$props.eventColor?.(e) ?? e.color
                                                const eventClass = this.$props.eventClass?.(e) ?? {}
                                                return h('div',
                                                    {
                                                        class: { ...eventClass, 'of-calendar-event': true },
                                                        style: {
                                                            'background-color': finalColor,
                                                        },
                                                        onClick: (event: any) => {
                                                            this.$emit('click:event', event, { ...e, color: finalColor })
                                                        },
                                                        onMouseEnter: (event: any) => {
                                                            this.$emit('enter:event', event, e)
                                                        },
                                                        onMouseLeave: (event: any) => {
                                                            this.$emit('leave:event', event, e)
                                                        },
                                                    },
                                                    slot ? slot({ event: e }) : h('strong', e.name),
                                                )
                                            }),
                                            this.renderMoreLink(more, day.date),
                                        ]
                                    )
                                ]
                        )
                    })
                ]
            )
        },
        renderGrid() {
            const fm = firstMonday(this.day)
            const style = this.fixedRowHeight ? { '--of-month-day-heigth': '' + (this.eventHeightNumber * this.eventsLimitNumber) + 'px' } : {}
            return h('div', { class: 'of-calendar-month-grid', style }, [
                h('div', { class: 'of-calendar-day-titles' }, [
                    h('div', { class: 'of-calendar-gutter' }),
                    Array.from({ length: 7 }, (_, i) => {
                        return h('div', { class: 'of-calendar-category-title' },
                            h('div', { class: 'of-calendar-day-title' },
                                this.renderWeekDay(addDays(fm, i))
                            ))
                    })
                ]),
                this.monthGrid.grid.map(this.renderRow)
            ])
        }
    },
    render() {
        return h('div',
            {
                class: "container",
                style: {
                    "--of-event-height": `${this.eventHeightNumber}px`,
                },
                onSelectStart(e: Event) {
                    e.preventDefault()
                },
            },
            [
                this.header(),
                this.renderGrid(),
            ]
        )
    },
})