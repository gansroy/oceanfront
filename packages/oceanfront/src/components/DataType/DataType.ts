import { defineComponent, h } from "vue"
import dataProps from './props'
import Text from "./text"
import Currency from "./currency"
import Link from "./link"

export default defineComponent({
  name: 'OfDataType',
  props: dataProps.common,
  render() {
    switch (this.$props.type) {
      case 'currency':
        return h(Currency, this.$props, this.$slots)
      case 'link':
        return h(Link, this.$props, this.$slots)
      default:
        return h(Text, this.$props, this.$slots)
    }
  }
})