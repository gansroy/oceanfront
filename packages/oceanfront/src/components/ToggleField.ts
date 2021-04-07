import { defineComponent, h, SetupContext, PropType } from 'vue'
import { OfField } from './Field'
import { extendFieldFormat, FormatProp } from '../lib/fields'
import { restrictProps } from '../lib/util'

export const OfToggleField = defineComponent({
  name: 'OfToggleField',
  props: {
    checked: { type: Boolean, default: false },
    format: [String, Object] as PropType<FormatProp>,
    inputLabel: String,
    inputType: String,
    labelPosition: String,
    // FIXME add 'side'
    value: String,
  },
  emits: {
    'update:checked': null,
  },
  setup(props, ctx: SetupContext) {
    const format = extendFieldFormat(
      props.format,
      restrictProps(props, ['inputLabel', 'inputType', 'labelPosition'], true)
    )
    return () =>
      h(OfField, {
        type: 'toggle',
        format,
        labelPosition: props.labelPosition,
        modelValue: props.checked as any, // FIXME working around odd type issue
        'onUpdate:modelValue': (val: boolean) => {
          ctx.emit('update:checked', val)
        },
      })
  },
})
