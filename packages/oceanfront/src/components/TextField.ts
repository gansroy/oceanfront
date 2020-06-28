import { defineComponent, SetupContext, h } from 'vue'
import { OfField } from './Field'

// just a proxy around OfField, but overrides with textInput as the field formatter
export const OfTextField = defineComponent({
  name: 'OfTextField',
  props: {
    multiline: Boolean,
  },
  setup(props, _ctx: SetupContext) {
    return () => h(OfField, { type: props.multiline ? 'textarea' : 'text' })
  },
})
