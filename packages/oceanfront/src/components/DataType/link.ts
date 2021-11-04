import { PropType, defineComponent, h } from 'vue'
import { DataTypeValue } from '../../lib/datatype'
import { OfLink } from '../Link'

export default defineComponent({
  props: { value: { type: Object as PropType<DataTypeValue>, required: true } },
  render() {
    return h(
      OfLink as any,
      {
        href: this.$props.value.params.href || null,
        to: this.$props.value.params.to || null,
        onClick: () => {
          if (typeof this.$props.value.params.click === 'function') {
            return this.$props.value.params.click()
          } else {
            return false
          }
        },
      },
      {
        default: () => this.$props.value.value,
      }
    )
  },
})
