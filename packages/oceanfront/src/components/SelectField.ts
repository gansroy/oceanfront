import { defineComponent, SetupContext, h } from 'vue'
import { OfField } from './Field'

// just a proxy around OfField, but overrides with selectInput as the field formatter
export const OfSelectField = defineComponent({
  name: 'OfSelectField',
  setup(_props, _ctx: SetupContext) {
    return () => h(OfField, { type: 'select' })
  },
})
