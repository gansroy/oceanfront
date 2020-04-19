import { computed, defineComponent, h } from 'vue'
import { useFormats } from '../lib/format'

export default defineComponent({
  name: 'of-format',
  props: {
    type: [String, Function, Object],
    options: Object,
    value: {}
  },
  setup(props, ctx) {
    const formatMgr = useFormats()
    const formatter = computed(() =>
      props.type ? formatMgr.getFormatter(props.type, props.options) : undefined
    )
    return () => {
      const fmt = formatter.value
      if (fmt) {
        const render = fmt.render(props.value)
        if (render) {
          return h('div', { class: render.class }, render.content)
        }
      }
      return props.value === undefined ? '' : '' + props.value
    }
  }
})
