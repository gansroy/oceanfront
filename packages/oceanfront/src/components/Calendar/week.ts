import { toTimestamp } from "src/lib/calendar"
import { Timestamp } from "src/lib/calendar/common"
import { addDays } from 'src/lib/datetime'
import { defineComponent } from "vue"
import DayCalendar from './day'
import calendarProps from './props'

export default defineComponent({
    mixins: [DayCalendar],
    props: {
        ...calendarProps.common,
        ...calendarProps.week,
    },
    methods: {
        getVisibleRange(): Timestamp[] {
            const weekDay = this.$props.day.getDay()
            let weekStart = parseInt(this.$props.weekStart as string)
            if (weekStart < 0) weekStart = 0
            if (weekStart > 6) weekStart = 6
            if (isNaN(weekStart)) weekStart = 0
            const offset = weekStart - weekDay
            const firstDay = addDays(this.$props.day, offset)
            const lastDay = addDays(firstDay, 7)
            const firstTS = { ...toTimestamp(firstDay), hours: 0, minutes: 0 }
            const lastTS = { ...toTimestamp(lastDay), hours: 0, minutes: 0 }
            return [firstTS, lastTS]
        },
        getCategoriesList() {
            const weekDay = this.$props.day.getDay() || 7
            const offset = 1 - weekDay
            return Array.from({ length: 7 }, (_, i) => ({ category: '' + i, date: addDays(this.$props.day, i + offset) }))
        },
    },
})