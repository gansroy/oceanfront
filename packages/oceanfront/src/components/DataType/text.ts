import { defineComponent } from "vue";
import dataProps from './props'

export default defineComponent({
    props: {
        ...dataProps.common
    },
    render() {
        return this.$props.value
    },
})