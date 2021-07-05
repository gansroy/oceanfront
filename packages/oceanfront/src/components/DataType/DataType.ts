import { defineComponent, h } from "vue"
import dataProps from './props'
import Text from "./text"
import Link from "./link"

export default defineComponent({
  name: 'OfDataType',
  props: dataProps.common,
  render() {
    switch (this.$props.type) {
      case 'link':
        return h(Link, this.$props)
      default:
        return h(Text, this.$props)
    }
  }
})