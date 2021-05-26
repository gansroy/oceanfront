import { defineComponent, h } from "vue"
import calendarProps from './props'
import dayColumns from './daycolumn'
import { DateTimeFormatterOptions } from 'src/formats/DateTime'
import { useFormats } from "src/lib/formats"

const weekDayFormat: DateTimeFormatterOptions = {
    nativeOptions: { weekday: "short" }
}

const dayFormat: DateTimeFormatterOptions = {
    nativeOptions: { day: "numeric" }
}

export default defineComponent({
    props: calendarProps.common,
    computed: {
        formatMgr: () => useFormats()
    },
    methods: {
        renderDayNumber(date?: Date) {
            const weekFmt = this.formatMgr.getTextFormatter('date', weekDayFormat)
            const dayFmt = this.formatMgr.getTextFormatter('date', dayFormat)
            return h('div', { class: 'of-calendar-day-title' },
                [
                    h('div', { class: 'weekday' }, weekFmt?.format(date).textValue),
                    h('div', { class: 'day-number' }, dayFmt?.format(date).textValue)
                ]
            )
        },
        categoryTitleSlot() {
            return (args: any) => {
                const slot = this.$slots['category-title']
                return slot
                    ? slot(args)
                    : this.renderDayNumber(args.date)
            }
        },
        superTitleSlot() {
            return undefined
        },
        collectSlots() {
            return {
                'category-title': this.categoryTitleSlot(),
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
            }
        }
    },
    render() {
        return h(dayColumns, this.getProps(), { ...this.$slots, ...this.collectSlots() })
    }
})
