import { defineComponent, h } from "vue";
import dataProps from './props'

export default defineComponent({
  props: {
    ...dataProps.common,
    ...dataProps.link
  },
  render() {
    return h('a',
      { 
        href: this.$props.data.url
      },
      this.$props.value   
    )
  },
})