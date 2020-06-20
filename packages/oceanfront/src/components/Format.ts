import { computed, defineComponent, h } from 'vue'
import { useFormats } from '../lib/formats'

export const OfFormat = defineComponent({
  name: 'OfFormat',
  props: {
    type: [String, Function, Object],
    options: Object,
    value: {
      type: [String, Boolean, Number, Array, Object],
      default: undefined,
    },
  },
  setup(props, _ctx) {
    const formatMgr = useFormats()
    const formatter = computed(() =>
      props.type
        ? formatMgr.getTextFormatter(props.type, props.options)
        : undefined
    )
    return () => {
      const fmt = formatter.value
      if (fmt) {
        const result = fmt.format(props.value)
        if (result) {
          return h('div', { class: result.textClass }, result.textValue)
        }
      }
      return props.value === undefined ? '' : '' + props.value
    }
  },
})
