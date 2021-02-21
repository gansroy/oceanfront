import { defineComponent, SetupContext } from 'vue'
import { extendConfig } from '../lib/config'
import { reactiveNavGroup, setNavGroup } from '../lib/nav'

export const OfNavGroup = defineComponent({
  name: 'OfNavGroup',
  setup(_props, ctx: SetupContext) {
    const items = reactiveNavGroup()
    extendConfig(() => {
      setNavGroup(items)
    })
    return () => ctx.slots.default?.({ focused: items.groupFocused })
  },
})
