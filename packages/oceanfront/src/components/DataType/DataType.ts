import { PropType, defineComponent, h } from "vue"
import { DataTypeValue } from '../../lib/datatype'

import Currency from "./currency"
import Link from "./link"

export default defineComponent({
  name: 'OfDataType',
  props: { 
    value: { type: [Object, String, Number] as PropType<DataTypeValue>, required: true } ,
  },
  render() {
    if(typeof(this.$props.value) === 'object') {
      switch (this.$props.value.format) {
        case 'currency':
          return h(Currency, this.$props, this.$slots)
        case 'link':
          return h(Link, this.$props, this.$slots)
        default:
          return this.$props.value.value
      }
    }

    return this.$props.value
  }
})