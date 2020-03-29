import { useConfig, ConfigHandler, Icon } from '../lib/config'
import { computed, defineComponent, h, createTextVNode } from 'vue'

class IconAccessor {
  protected _states: any[]
  constructor(states: any[]) {
    this._states = states
  }

  resolve(name?: string): Icon | null {
    if (!name) return null
    return { name, class: 'uibasic-icon icon-' + name }
  }
}

export class IconHandler implements ConfigHandler {
  inject(states: any[]): any {
    return new IconAccessor(states)
  }
  loadConfigState(state: any): any {
    return state
  }
}

export const OfIcon = defineComponent({
  name: 'of-icon',
  props: {
    class: String,
    name: String
  },
  setup(props, ctx) {
    const config = useConfig()
    const icon = computed(() => config.icons.resolve(props.name!))
    return () => {
      const iconVal = icon.value || {}
      return h(
        'i',
        {
          'aria-hidden': 'true',
          class: ['of-icon', props.class, iconVal?.class],
          ...ctx.attrs
        },
        ctx.slots.default
          ? ctx.slots.default()
          : // iconVal.component ? h(iconVal.component, {name: props.name, ...(iconVal.props || {})})
          iconVal.text
          ? createTextVNode(iconVal.text)
          : undefined
      )
    }
  }
})
