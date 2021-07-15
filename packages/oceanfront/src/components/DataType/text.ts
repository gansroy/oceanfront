import { PropType, defineComponent } from "vue";
import { DataTypeValue } from '../../lib/datatype'

export default defineComponent({
    props: { value: { type: Object as PropType<DataTypeValue>, required: true } },
    render() {
        return this.$props.value?.value
    },
})