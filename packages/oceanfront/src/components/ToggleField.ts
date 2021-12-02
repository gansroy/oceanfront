import { defineComponent, h, SetupContext, PropType } from 'vue'
import { OfField } from './Field'
import { extendFieldFormat, FieldFormatProp } from '../lib/fields'
import { restrictProps } from '../lib/util'

export const OfToggleField = defineComponent({
  name: 'OfToggleField',
  props: {
    checked: { type: Boolean, default: false },
    format: [String, Object] as PropType<FieldFormatProp>,
    inputType: String,
    // FIXME add 'side'
    value: String,
  },
  emits: {
    'update:checked': null,
  },
  setup(props, ctx: SetupContext) {
    const format = extendFieldFormat(
      props.format,
      restrictProps(props, ['inputType'], true)
    )
    return () =>
      h(OfField, {
        type: 'toggle',
        format,
        modelValue: props.checked as any, // FIXME working around odd type issue
        'onUpdate:modelValue': (val: boolean) => {
          ctx.emit('update:checked', val)
        },
      })
  },
})
