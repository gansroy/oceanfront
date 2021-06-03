import { defineComponent, h } from "vue"
import calendarProps from './props'
import dayColumns from './daycolumn'
import { DateTimeFormatterOptions } from 'src/formats/DateTime'
import { useFormats } from "src/lib/formats"
import { Timestamp } from "src/lib/calendar/common"
import { toTimestamp, withZeroTime } from "src/lib/calendar"
import { addDays } from "src/lib/datetime"

const weekDayFormat: DateTimeFormatterOptions = {
    nativeOptions: { weekday: "short" }
}

const dayFormat: DateTimeFormatterOptions = {
    nativeOptions: { day: "numeric" }
}

export default defineComponent({
    props: {
        ...calendarProps.internal,
        ...calendarProps.common,
    },
    computed: {
        formatMgr: () => useFormats()
    },
    methods: {
        getVisibleRange(): Timestamp[] {
            const firstDay = this.$props.day
            const lastDay = addDays(firstDay, 1)
            const firstTS = withZeroTime(toTimestamp(firstDay))
            const lastTS = withZeroTime(toTimestamp(lastDay))
            return [firstTS, lastTS]
        },
        renderDayNumber(date?: Date) {
            const weekFmt = this.formatMgr.getTextFormatter('date', weekDayFormat)
            const dayFmt = this.formatMgr.getTextFormatter('date', dayFormat)
            return h('div',
                {
                    class: 'of-calendar-day-title',
                },
                [
                    h('div', { class: 'weekday' }, weekFmt?.format(date).textValue),
                    h('div', { class: 'day-number' }, dayFmt?.format(date).textValue)
                ]
            )
        },
        dayTitleSlot() {
            return (date: any) => {
                const slot = this.$slots['day-title']
                return slot
                    ? slot(date)
                    : this.renderDayNumber(date)
            }
        },
        superTitleSlot() {
            return undefined
        },
        collectSlots() {
            return {
                'day-title': this.dayTitleSlot(),
                'super-title': this.superTitleSlot(),
            }
        },
        getCategoriesList() {
            return [{
                category: 'Today', date: this.$props.day,
            }]
        },
        getIgnoreCategories() { return true },
        getProps() {
            return {
                ...this.$props,
                categoriesList: this.getCategoriesList(),
                ignoreCategories: this.getIgnoreCategories(),
                visibleRange: this.getVisibleRange(),
            }
        },
    },
    render() {
        return h(dayColumns, this.getProps(), { ...this.$slots, ...this.collectSlots() })
    }
})
