import { defineComponent, h } from "vue"
import calendarProps from './props'
import DayCalendar from "./day"
import WeekCalendar from "./week"
import CategoryCalendar from "./category"
import NDaysCalendar from "./ndays"

export default defineComponent({
    name: 'OfCalendar',
    props: calendarProps.common,
    render() {
        switch (this.$props.type) {
            case 'week':
                return h(WeekCalendar, this.$props, this.$slots)
            case 'category':
                return h(CategoryCalendar, this.$props, this.$slots)
            case 'ndays':
                return h(NDaysCalendar, this.$props, this.$slots)
            default:
                return h(DayCalendar, this.$props, this.$slots)
        }
    }
})

