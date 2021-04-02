import { defineComponent, SetupContext, h } from 'vue'
import { OfField } from './Field'

export const OfColorField = defineComponent({
  name: 'OfColorField',
  setup(_props, _ctx: SetupContext) {
    return () => h(OfField, { type: 'color' })
  },
})
