import { defineComponent, SetupContext, h, PropType } from 'vue'
import { OfField } from './Field'
import { extendFieldFormat, FormatProp } from '@/lib/fields'
import { restrictProps } from '@/lib/util'

// just a proxy around OfField, but overrides with slider as the field formatter
export const OfSliderField = defineComponent({
  name: 'OfSliderField',
  props: {
    format: [String, Object] as PropType<FormatProp>,
    max: Number,
    min: Number,
    step: Number,
  },
  setup(props, _ctx: SetupContext) {
    const format = extendFieldFormat(
      props.format,
      restrictProps(props, ['max', 'min', 'step'], true)
    )
    return () => h(OfField, { format, type: 'slider' })
  },
})
