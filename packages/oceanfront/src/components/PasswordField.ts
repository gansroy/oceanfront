import { defineComponent, SetupContext, h } from 'vue'
import { OfField } from './Field'

// just a proxy around OfField, but overrides with textInput as the field formatter
export const OfPasswordField = defineComponent({
  name: 'OfPasswordField',
  setup(props, _ctx: SetupContext) {
    return () => h(OfField, { type: 'password' })
  },
})
