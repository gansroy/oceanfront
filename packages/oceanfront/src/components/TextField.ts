import { defineComponent, SetupContext, h, mergeProps } from 'vue'
import { OfField } from './Field'

// just a proxy around OfField, but overrides with textInput as the field formatter
// will add a way to override specific props of the field format
// specifically 'align', 'maxlength', 'placeholder', 'size'
export const OfTextField = defineComponent({
  name: 'of-text-field',
  setup(props, ctx: SetupContext) {
    return () => h(OfField, { type: 'text' })
  }
})
