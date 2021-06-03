import { defineComponent, h } from "vue"
import calendarProps from './props'
import DayCalendar from './day'

export default defineComponent({
    mixins: [DayCalendar],
    props: {
        ...calendarProps.common,
        ...calendarProps.category,
    },
    emits: ['click:day'],
    methods: {
        superTitleSlot() {
            return (_: any) => {
                return h('div', {
                    onClick: (event: any) => {
                        this.$emit('click:day', event, this.$props.day)
                    }
                }, this.renderDayNumber(this.$props.day))
            }
        },
        categoryTitleSlot() {
            return (args: any) => {
                const slot = this.$slots['category-title']
                return slot
                    ? slot(args)
                    : h('strong', {}, args.categoryName)
            }
        },
        getIgnoreCategories() { return false },
        getCategoriesList() {
            return this.$props.categories.map((category) => ({ category, date: this.$props.day }))
        },
    },
})