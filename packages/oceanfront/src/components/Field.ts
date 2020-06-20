import {
  defineComponent,
  SetupContext,
  computed,
  h,
  readonly,
  PropType,
} from 'vue'
import { FieldContext } from '@/lib/fields'
import { useFormats } from '@/lib/formats'
import { extractRefs, extendReactive, restrictProps } from '@/lib/util'
import OfOverlay from '../components/Overlay.vue'

export const OfField = defineComponent({
  name: 'OfField',
  inheritAttrs: false,
  props: {
    align: String,
    class: [String, Array, Object],
    // density: {type: Number, default: undefined}
    // form
    format: [String, Function, Object],
    id: String,
    items: [String, Array, Object],
    label: String,
    loading: Boolean,
    locked: Boolean,
    // messages
    maxlength: Number,
    mode: String as PropType<'edit' | 'readonly' | 'view'>,
    muted: Boolean,
    name: String,
    placeholder: String,
    readonly: Boolean,
    required: Boolean,
    size: { type: Number, default: undefined },
    // style
    type: String,
    value: {
      type: [String, Boolean, Number, Array, Object],
      default: undefined,
    },
    variant: String,
  },
  setup(props, ctx: SetupContext) {
    const formats = useFormats()

    const fieldType = computed(() => {
      const fmt = props.format
      return (
        props.type ||
        (fmt && typeof fmt === 'string'
          ? fmt
          : typeof fmt === 'object'
          ? fmt.fieldType || fmt.type
          : undefined)
      )
    })
    const mode = computed(
      () => props.mode || (props.readonly ? 'readonly' : 'edit')
    )
    // FIXME derive from config
    const variant = computed(() => props.variant || 'basic')

    const fctx: FieldContext = readonly({
      container: 'of-field',
      fieldType: fieldType as any,
      mode: mode as any, // FIXME ref type not unwrapped correctly
      ...(extractRefs(props, [
        'id',
        'items',
        'label',
        'loading',
        'locked',
        'muted',
        'name',
        'required',
        'value',
      ]) as any[]), // FIXME type issues
      // form
      // initialValue - defined by form?
      onUpdate(value: any) {
        ctx.emit('update:value', value)
      },
    })

    const format = computed(() => {
      const ftype = fieldType.value
      const fmt = props.format
      const extfmt = fmt
        ? typeof fmt === 'string' || typeof fmt === 'function' // format name or text formatter
          ? { type: fmt }
          : fmt
        : { type: ftype }
      const found =
        typeof ftype === 'object' && 'setup' in ftype // raw FieldType
          ? ftype
          : formats.getFieldType(ftype, true)
      if (!found) {
        // FIXME should always resolve something, but might
        // want a field type that just renders an error message
        throw new TypeError(`Unknown field type: ${ftype}`)
      }
      return found.setup(
        extendReactive(
          extfmt,
          restrictProps(
            props,
            ['align', 'placeholder', 'maxlength', 'size'],
            true
          )
        ),
        fctx
      )
    })

    const handlers = {
      onClick(evt: MouseEvent) {
        // ctx.emit('click', evt)
        const render = format.value
        if (render && render.click) return render.click(evt)
      },
      onMousedown(_evt: MouseEvent) {
        // ctx.emit('mousedown', evt)
      },
    }

    return () => {
      try {
        const render = format.value
        const outerId = render.inputId ? render.inputId + '-outer' : props.id
        const blank = render.blank && !(render.focused || render.popup)
        const label = ctx.slots.label
          ? ctx.slots.label()
          : props.label
          ? h('label', { class: 'of-field-label', for: render.inputId }, [
              props.label,
            ])
          : undefined
        const cls = [
          'of-field-outer',
          {
            'of--active': !blank,
            'of--blank': blank,
            'of--focused': render.focused,
            'of--invalid': render.invalid,
            'of--muted': props.muted,
            'of--loading': render.loading,
            // 'of--locked': fmt.locked,
            'of--updated': render.updated,
            // of--readonly: props.readonly,
            // of--disabled: props.disabled,
            'of--with-label': !!label,
          },
          'of--cursor-' + (render.cursor || 'default'),
          'of--mode-' + mode.value,
          'of--variant-' + variant.value,
          render.class,
          props.class,
        ]
        const inner = []
        const prepend = ctx.slots.prepend || render.prepend
        const defslot = ctx.slots.default || render.content
        const append = ctx.slots.append || render.append
        if (prepend) inner.push(prepend())
        if (defslot) inner.push(defslot())
        if (append) inner.push(append())
        let overlay, overlayActive, overlayBlur
        // if(ctx.slots.overlay) overlay = ctx.slots.overlay(); else
        if (render.popup) {
          overlay = render.popup.content
          overlayActive = render.popup.visible ?? true
          overlayBlur = render.popup.onBlur
        }
        if (overlay) {
          overlay = h(
            OfOverlay,
            {
              active: overlayActive,
              capture: false,
              shade: false,
              target: '#' + outerId,
              onBlur: overlayBlur,
            },
            overlay
          )
        }
        return h(
          'div',
          {
            class: cls,
            id: outerId,
            ...handlers,
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
            overlay,
          ]
        )
      } catch (e) {
        console.error(e)
        return
      }
    }
  },
})
