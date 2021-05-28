import { defineComponent } from "vue"
import calendarProps from './props'
import DayCalendar from './day'
import { addDays } from 'src/lib/datetime'

export default defineComponent({
    mixins: [DayCalendar],
    props: {
        ...calendarProps.common,
        ...calendarProps.week,
    },
    methods: {
        getCategoriesList() {
            const weekDay = this.$props.day.getDay()
            let weekStart = parseInt(this.$props.weekStart as string)
            if (weekStart < 0) weekStart = 0
            if (weekStart > 6) weekStart = 6
            if (isNaN(weekStart)) weekStart = 0
            const offset = weekStart - weekDay
            return Array.from({ length: 7 }, (_, i) => ({ category: '' + i, date: addDays(this.$props.day, i + offset) }))
        },
    },
})