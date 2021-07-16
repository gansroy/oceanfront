import { DateTimeFormatterOptions } from "src/formats/DateTime"
import { useFormats } from "src/lib/formats"
import { defineComponent, h } from "vue"

const weekDayFormat: DateTimeFormatterOptions = {
    nativeOptions: { weekday: "short" }
}

const dayFormat: DateTimeFormatterOptions = {
    nativeOptions: { day: "numeric" }
}

export default defineComponent({
    computed: {
        formatMgr: () => useFormats()
    },
    methods: {
        renderWeekDay(date?: Date) {
            const weekFmt = this.formatMgr.getTextFormatter('date', weekDayFormat)
            return h('div', { class: 'weekday' }, weekFmt?.format(date).textValue)
        },
        renderDayNumber(date?: Date, weekday?: boolean) {
            const dayFmt = this.formatMgr.getTextFormatter('date', dayFormat)
            return h('div',
                {
                    class: 'of-calendar-day-title',
                },
                [
                    weekday ? this.renderWeekDay(date) : null,
                    h('div', { class: 'day-number' }, dayFmt?.format(date).textValue)
                ]
            )
        },
    }
})
