import { PropType, defineComponent, h } from "vue"
import { DataTypeValue } from '../../lib/datatype'
import Text from "./text"
import Currency from "./currency"
import Link from "./link"

export default defineComponent({
  name: 'OfDataType',
  props: { 
    value: { type: Object as PropType<DataTypeValue>, required: true },
  },
  render() {
    switch (this.$props.value.format) {
      case 'currency':
        return h(Currency, this.$props, this.$slots)
      case 'link':
        return h(Link, this.$props, this.$slots)
      default:
        return h(Text, this.$props, this.$slots)
    }
  }
})