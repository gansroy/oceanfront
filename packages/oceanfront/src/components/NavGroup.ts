import { defineComponent, PropType, SetupContext } from 'vue'
import { extendConfig } from '../lib/config'
import {
  reactiveNavGroup,
  setAfterRouteNavigate,
  setNavGroup,
} from '../lib/nav'

export const OfNavGroup = defineComponent({
  name: 'OfNavGroup',
  props: {
    onNavigate: Function as PropType<() => void>,
  },
  setup(props, ctx: SetupContext) {
    const items = reactiveNavGroup()
    extendConfig(() => {
      setNavGroup(items)
      if (props.onNavigate) setAfterRouteNavigate(props.onNavigate)
    })
    return () => ctx.slots.default?.({ focused: items.groupFocused })
  },
})
