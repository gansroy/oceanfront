import { defineComponent } from "vue"
import calendarProps from './props'
import DayCalendar from './day'
import { addDays } from 'src/lib/datetime'

export default defineComponent({
    mixins: [DayCalendar],
    props: {
        ...calendarProps.common,
        ...calendarProps.ndays,
    },
    methods: {
        getCategoriesList() {
            let nDays = parseInt(this.$props.numDays as string)
            if (nDays < 2) nDays = 2
            if (nDays > 6) nDays = 6
            if (isNaN(nDays)) nDays = 2
            return Array.from({ length: nDays }, (_, i) => ({ category: '' + i, date: addDays(this.$props.day, i) }))
        },
    },
})