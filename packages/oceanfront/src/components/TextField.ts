import { defineComponent, SetupContext, h, mergeProps } from 'vue'
import { OfField } from './Field'
import { extendFieldFormat } from '@/lib/fields'

// just a proxy around OfField, but overrides with textInput as the field formatter
export const OfTextField = defineComponent({
  name: 'of-text-field',
  setup(props, ctx: SetupContext) {
    return () => h(OfField, { type: 'text' })
  }
})
