import { useIcons } from '../lib/icons'
import { computed, defineComponent, h } from 'vue'

export const OfIcon = defineComponent({
  name: 'of-icon',
  props: {
    class: String,
    name: String
  },
  setup(props, ctx) {
    const mgr = useIcons()
    const icon = computed(() => mgr.resolve(props.name))
    return () => {
      const iconVal = icon.value
      if (!iconVal) return
      return h(
        'i',
        {
          'aria-hidden': 'true',
          class: ['of-icon', props.class, iconVal.class],
          ...ctx.attrs
        },
        ctx.slots.default
          ? ctx.slots.default()
          : // iconVal.component ? h(iconVal.component, {name: props.name, ...(iconVal.props || {})})
            iconVal.text
      )
    }
  }
})
