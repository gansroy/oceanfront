import { defineComponent, h, SetupContext } from 'vue'
import { OfField } from './Field'
import { extendFieldFormat } from '@/lib/fields'
import { restrictProps } from '@/lib/util'

export const OfToggleField = defineComponent({
  name: 'OfToggleField',
  props: {
    checked: { type: Boolean, default: false },
    format: [String, Function, Object],
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
        value: props.checked,
        'onUpdate:value': (val: boolean) => {
          ctx.emit('update:checked', val)
        },
      })
  },
})
