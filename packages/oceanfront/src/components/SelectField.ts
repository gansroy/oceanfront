import { defineComponent, SetupContext, h, mergeProps } from 'vue'
import { OfField } from './Field'

// just a proxy around OfField, but overrides with selectInput as the field formatter
// will add a way to override specific props of the field format
// specifically 'align', 'items', 'placeholder', 'size'
export const OfSelectField = defineComponent({
  name: 'of-select-field',
  setup(props, ctx: SetupContext) {
    return () => h(OfField, { type: 'select' })
  }
})
