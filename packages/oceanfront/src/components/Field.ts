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
  PropType,
  Ref
} from 'vue'
import { FieldContext, FieldProps } from '@/lib/fields'
import { useFormats } from '@/lib/formats'
import { extractRefs } from '@/lib/util'
import OfOverlay from '../components/Overlay.vue'

export const OfField = defineComponent({
  name: 'of-field',
  inheritAttrs: false,
  props: {
    align: String,
    class: [String, Array, Object],
    // form
    fieldType: String,
    format: [String, Function, Object],
    id: String,
    label: String,
    loading: Boolean,
    locked: Boolean,
    // messages
    mode: String as PropType<'edit' | 'readonly' | 'view'>,
    muted: Boolean,
    name: String,
    placeholder: String,
    readonly: Boolean,
    required: Boolean,
    size: Number,
    // style
    // type: String,
    value: { default: null },
    variant: String
  },
  setup(props, ctx: SetupContext) {
    const formats = useFormats()

    const mode = computed(
      () => props.mode || (props.readonly ? 'readonly' : 'edit')
    )
    // FIXME derive from config
    const variant = computed(() => props.variant || 'basic')

    const fctx: FieldContext = readonly({
      container: 'of-field',
      mode: mode as any, // FIXME ref type not unwrapped correctly
      ...(extractRefs(props, [
        'align',
        'id',
        'label',
        'loading',
        'locked',
        'muted',
        'name',
        'placeholder',
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
      let ftype = props.fieldType || extfmt.fieldType || extfmt.type || 'text'
      let found = formats.getFieldType(ftype, true)
      if (!found) {
        // FIXME should always resolve something, but might
        // want a field type that just renders an error message
        throw new TypeError(`Unknown field type: ${ftype}`)
      }
      return found.setup(extfmt, fctx)
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
        const outerId = fmt.inputId ? fmt.inputId + '-outer' : props.id
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
            // of--readonly: props.readonly,
            // of--disabled: props.disabled,
            // 'of--with-label': withLabel.value
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
        let overlay, overlayActive, overlayBlur
        // if(ctx.slots.overlay) overlay = ctx.slots.overlay(); else
        if (fmt.popup) {
          overlay = fmt.popup.content
          overlayActive = fmt.popup.visible ?? true
          overlayBlur = fmt.popup.onBlur
        }
        if (overlay) {
          overlay = h(
            OfOverlay,
            {
              active: overlayActive,
              capture: false,
              shade: false,
              target: '#' + outerId,
              onBlur: overlayBlur
            },
            overlay
          )
        }
        return h(
          'div',
          {
            class: cls,
            id: outerId,
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
            h('div', { class: 'of-field-below' }), // custom slots.below or messages
            overlay
          ]
        )
      } catch (e) {
        console.error(e)
        return
      }
    }
  }
})
