import {
  defineComponent,
  SetupContext,
  computed,
  h,
  shallowRef,
  shallowReadonly,
  toRef,
  reactive,
  readonly,
  PropType
} from 'vue'
import { FieldContext, FieldProps } from '@/lib/fields'
import { useFormats } from '@/lib/format'
import { textInput } from '@/lib/input'
import { extractRefs } from '@/lib/util'

export const OfField = defineComponent({
  name: 'of-field',
  inheritAttrs: false,
  props: {
    class: [String, Array, Object],
    // form
    format: [String, Function, Object],
    id: String,
    label: String,
    loading: Boolean,
    locked: Boolean,
    // messages
    mode: String as PropType<'edit' | 'readonly' | 'view'>,
    muted: Boolean,
    name: String,
    required: Boolean,
    size: Number,
    // style
    // type: String,
    value: [Boolean, Number, String, Object],
    variant: String
  },
  setup(props, ctx: SetupContext) {
    const formats = useFormats()

    const mode = computed(() => props.mode || 'edit')
    // FIXME derive from config
    const variant = computed(() => props.variant || 'basic')

    const fctx: FieldContext = readonly({
      container: 'of-field',
      mode: mode as any, // FIXME type of computedref not unwrapped correctly
      ...(extractRefs(props, [
        'id',
        'label',
        'loading',
        'locked',
        'muted',
        'name',
        'required',
        'size',
        'value'
      ]) as any[]), // FIXME type issues
      // form
      // initialValue - defined by form?
      onUpdate(value: any) {
        ctx.emit('update:value', value)
      }
    })

    const format = computed(() => {
      const fmt = props.format
      const extfmt = fmt ? (typeof fmt === 'string' ? { type: fmt } : fmt) : {}
      if (!extfmt.type) extfmt.type = 'text'
      let found = formats.getFieldFormatter(extfmt.type)
      if (!found) {
        found = textInput
      }
      return found(extfmt, fctx)
    })

    const handlers = {
      onClick(evt: MouseEvent) {
        // ctx.emit('click', evt)
        const fmt = format.value
        if (fmt && fmt.click) fmt.click(evt)
      },
      onMousedown(evt: MouseEvent) {
        // ctx.emit('mousedown', evt)
      }
    }

    return () => {
      try {
        let fmt = format.value
        const blank = fmt.blank && !(fmt.focused || fmt.popup)
        const cls = [
          'of-field-outer',
          {
            'of--active': !blank,
            'of--blank': blank,
            'of--focused': fmt.focused,
            'of--muted': props.muted,
            'of--loading': fmt.loading,
            // 'of--locked': fmt.locked,
            'of--updated': fmt.updated
            // readonly: props.readonly,
            // disabled: props.disabled,
            // 'with-label': withLabel.value
          },
          'of--mode-' + mode.value,
          'of--variant-' + variant.value,
          fmt.class,
          props.class
        ]
        const label = ctx.slots.label
          ? ctx.slots.label()
          : props.label
          ? h('label', { class: 'of-field-label', for: fmt.inputId }, [
              props.label
            ])
          : undefined
        const inner = []
        const prepend = ctx.slots.prepend || fmt.prepend
        const defslot = ctx.slots.default || fmt.content
        const append = ctx.slots.append || fmt.append
        if (prepend) inner.push(prepend())
        if (defslot) inner.push(defslot())
        if (append) inner.push(append())
        return h(
          'div',
          {
            class: cls,
            id: fmt.inputId ? fmt.inputId + '-outer' : props.id,
            ...handlers
          },
          [
            h(
              'div',
              { class: 'of-field-above' },
              label
                ? h('div', { class: 'of-field-label-wrap' }, label)
                : undefined
            ),
            h('div', { class: 'of-field-inner' }, inner),
            h('div', { class: 'of-field-below' }) // custom slots.below or messages
          ]
        )
      } catch (e) {
        console.error(e)
        return
      }
    }
  }
})
