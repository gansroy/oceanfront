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
    }
})
