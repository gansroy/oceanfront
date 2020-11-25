import { defineComponent, SetupContext, h } from 'vue'
import { OfField } from './Field'
import { extendFieldFormat } from '@/lib/fields'
import { restrictProps } from '@/lib/util'

// just a proxy around OfField, but overrides with textInput as the field formatter
export const OfTextField = defineComponent({
  name: 'OfTextField',
  props: {
    multiline: Boolean,
    inputType: String,
  },
  setup(props, _ctx: SetupContext) {
    const format = extendFieldFormat(
      'text',
      restrictProps(props, ['inputType'], true)
    )

    return () =>
      h(OfField, {
        type: props.multiline ? 'textarea' : 'text',
        format,
      })
  },
})
