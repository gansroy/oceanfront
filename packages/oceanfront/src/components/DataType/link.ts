import { defineComponent, h } from "vue";
import dataProps from './props'
import { OfLink } from '../Link'

export default defineComponent({
  props: {
    ...dataProps.common,
    ...dataProps.link
  },
  render() {
      return h(
        OfLink as any,
        {
          href: this.$props.data.href || null,
          to: this.$props.data.to || null,
        },
        {
          default: () => this.$props.value,
        }
      )
  },
})