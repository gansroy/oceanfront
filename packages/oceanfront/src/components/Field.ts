import {
  computed,
  defineComponent,
  h,
  ref,
  watch,
  PropType,
  Ref,
  SetupContext,
  VNode,
} from 'vue'
import {
  FieldContext,
  FieldDragIn,
  FieldRender,
  Renderable,
  FormatProp,
  FieldTypeConstructor,
} from '../lib/fields'
import { useFormats } from '../lib/formats'
import { FieldRecord, useRecords } from '../lib/records'
import {
  extractRefs,
  extendReactive,
  readonlyUnrefs,
  restrictProps,
  watchResize,
  CompatResizeObserver,
} from '../lib/util'
import OfOverlay from '../components/Overlay.vue'

const renderSlot = (
  container: Renderable[],
  slot?: () => Renderable | undefined,
  outer?: string
): void => {
  if (slot) {
    let children = slot()
    if (children) {
      if (outer) children = h('div', { class: outer }, children)
      container.push(children)
    }
  }
}

type PadCalc = {
  watch: CompatResizeObserver
}

const calcPadding = (node: VNode, state: { watch?: CompatResizeObserver }) => {
  if (state.watch) {
    state.watch.disconnect()
  }
  const outer = node.el as HTMLElement | undefined
  if (!outer || !document.body.contains(outer)) {
    return
  }
  const prepend = outer.querySelector('.of-field-prepend') as HTMLElement | null
  const append = outer.querySelector('.of-field-append') as HTMLElement | null
  if (!prepend && !append) {
    return
  }
  state.watch = watchResize(
    (entries) => {
      let presize = 0
      let appsize = 0
      for (const entry of entries) {
        if (entry.target === prepend) {
          presize = Math.ceil(entry.size.width)
        } else if (entry.target === append) {
          appsize = Math.ceil(entry.size.width)
        }
      }
      outer.style.setProperty('--of-field-size-prepend', presize + 'px')
      outer.style.setProperty('--of-field-size-append', appsize + 'px')
    },
    prepend,
    append
  )
}

const makeDragIn = (spec: FieldDragIn, flag: Ref<boolean>) => {
  return {
    handlers: {
      onDragover: function (evt: DragEvent) {
        evt.stopPropagation()
        evt.preventDefault()
        if (evt.dataTransfer) {
          evt.dataTransfer.dropEffect =
            spec.dropEffect === 'none' ||
            spec.dropEffect === 'link' ||
            spec.dropEffect === 'move'
              ? spec.dropEffect
              : 'copy'
        }
        flag.value = true
        if (spec.onEnter) spec.onEnter(evt)
      },
      onDragleave: function (evt: DragEvent) {
        flag.value = false
        if (spec.onLeave) spec.onLeave(evt)
      },
      onDrop: function (evt: DragEvent) {
        flag.value = false

        evt.stopPropagation()
        evt.preventDefault()
        spec.onDrop(evt)
      },
    },
  }
}

export const OfField = defineComponent({
  name: 'OfField',
  inheritAttrs: false,
  props: {
    align: String,
    block: Boolean,
    class: [String, Array, Object],
    // density: {type: Number, default: undefined}
    // form
    format: [String, Object] as PropType<FormatProp>,
    id: String,
    initialValue: {
      type: [String, Boolean, Number, Array, Object],
      default: undefined,
    },
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
    record: Object as PropType<FieldRecord>,
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
  emits: {
    'update:value': null,
  },
  setup(props, ctx: SetupContext) {
    const formatMgr = useFormats()
    const recordMgr = useRecords()

    const fieldType = computed<string | object | undefined>(() => {
      const fmt = props.format
      return (
        props.type ||
        (fmt && typeof fmt === 'string'
          ? fmt
          : typeof fmt === 'object'
          ? (fmt as any).fieldType || (fmt as any).type
          : undefined)
      )
    })
    const dragOver = ref(false)
    const focused = ref(false)
    const mode = computed(
      () => props.mode || (props.readonly ? 'readonly' : 'edit')
    )
    const variant = computed(() => props.variant || 'basic')

    const record = computed(() => {
      return props.record || recordMgr.getCurrentRecord()
    })
    const initialValue = computed(() =>
      props.name && record.value
        ? (record.value.initialValue || {})[props.name]
        : props.initialValue
    )
    const value = computed(() =>
      props.name && record.value ? record.value.value[props.name] : props.value
    )
    const locked = computed(() => props.locked || record.value?.locked)

    const fctx: FieldContext = readonlyUnrefs({
      container: 'of-field',
      fieldType,
      initialValue,
      locked,
      mode,
      record,
      value,
      onUpdate(value: any) {
        if (props.name && record.value) record.value.value[props.name] = value
        else ctx.emit('update:value', value)
      },
      ...extractRefs(props, [
        'block',
        'id',
        'items',
        'label',
        'loading',
        'muted',
        'name',
        'required',
      ]),
    } as Record<string, any>)

    const rendered = ref<FieldRender>()
    watch(
      () => [fieldType.value, props.format],
      ([ftype, fmt]) => {
        const extfmt = fmt
          ? typeof fmt === 'string' || typeof fmt === 'function' // format name or text formatter
            ? { type: fmt }
            : (fmt as object)
          : { type: ftype }
        const found =
          typeof ftype === 'object' && 'setup' in ftype // raw FieldType
            ? (ftype as FieldTypeConstructor)
            : formatMgr.getFieldType(ftype as string, true)
        if (!found) {
          // FIXME should always resolve something, but might
          // want a field type that just renders an error message
          throw new TypeError(`Unknown field type: ${ftype}`)
        }
        rendered.value = found.setup(
          extendReactive(
            extfmt,
            restrictProps(
              props,
              ['align', 'maxlength', 'placeholder', 'size'],
              true
            )
          ),
          fctx
        )
      },
      { immediate: true }
    )

    const padState = {}
    const checkPad = (node: VNode) => calcPadding(node, padState)
    const handlers = {
      onBlur(_evt: FocusEvent) {
        focused.value = false
      },
      onClick(evt: MouseEvent) {
        // ctx.emit('click', evt)
        const render = rendered.value
        evt.stopPropagation()
        if (render && render.click) return render.click(evt)
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
      },
      onMousedown(_evt: MouseEvent) {
        // ctx.emit('mousedown', evt)
      },
      onVnodeMounted: checkPad,
      onVnodeUpdated: checkPad,
      onVnodeUnmounted: checkPad,
    }

    return () => {
      try {
        const render = rendered.value
        if (!render) return
        const outerId = render.inputId ? render.inputId + '-outer' : props.id
        let overlay, overlayActive, overlayBlur
        // if(ctx.slots.overlay) overlay = ctx.slots.overlay(); else
        const dragIn = render.dragIn && makeDragIn(render.dragIn, dragOver)
        if (render.popup) {
          overlay = render.popup.content
          overlayActive = render.popup.visible ?? true
          overlayBlur = render.popup.onBlur
        }
        const showFocused = focused.value || dragOver.value || render.focused
        const blank = render.blank && !(showFocused || overlayActive)
        const labelText = render.label ?? props.label
        const label = ctx.slots.label
          ? ctx.slots.label()
          : labelText
          ? h(
              'label',
              {
                class: 'of-field-label',
                /*, for: render.inputId: triggering double click events */
              },
              [labelText]
            )
          : undefined
        const cls = [
          'of-field',
          {
            'of--active': render.active || !blank, // overridden for toggle input to avoid hiding content
            'of--block': props.block,
            'of--blank': blank,
            'of--dragover': dragOver.value,
            'of--focused': showFocused,
            'of--invalid': render.invalid,
            'of--muted': props.muted,
            'of--loading': render.loading,
            'of--locked': locked.value,
            'of--updated': render.updated,
            // of--readonly: props.readonly,
            // of--disabled: props.disabled,
          },
          'of--cursor-' + (render.cursor || 'default'),
          'of--label-' + (label ? 'visible' : 'none'),
          'of--mode-' + mode.value,
          'of--variant-' + variant.value,
          render.class,
          props.class,
        ]
        const size = render.size || props.size // FIXME fetch from config
        const style: Record<string, string> = {}
        if (size) {
          style['--of-field-size'] = `${size}ch`
        }
        const inner: VNode | VNode[] = []
        renderSlot(
          inner,
          ctx.slots.prepend || render.prepend,
          'of-field-prepend'
        )
        renderSlot(
          inner,
          ctx.slots.default || render.content,
          'of-field-content'
        )
        renderSlot(inner, ctx.slots.append || render.append, 'of-field-append')
        if (overlay) {
          overlay = h(
            OfOverlay,
            {
              active: overlayActive,
              capture: false,
              shade: false,
              target: outerId ? '#' + outerId : '',
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
            style,
            tabindex: '-1',
            ...handlers,
            ...dragIn?.handlers,
          },
          [
            h(
              'div',
              {
                class: 'of-field-body',
              },
              [
                h(
                  'div',
                  {
                    class: 'of-field-over',
                  },
                  label
                    ? h('div', { class: 'of-field-label-wrap' }, label)
                    : undefined
                ),
                h('div', { class: 'of-field-inner' }, inner),
              ]
            ),
            h('div', { class: 'of-field-footer' }), // custom slots.below or messages
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
