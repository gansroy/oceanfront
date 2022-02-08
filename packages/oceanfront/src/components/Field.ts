import { useThemeOptions } from '../lib/theme'
import {
  computed,
  defineComponent,
  h,
  PropType,
  proxyRefs,
  ref,
  Ref,
  SetupContext,
  VNode,
  watch,
  WatchStopHandle,
} from 'vue'
import { OfOverlay } from '../components/Overlay'
import { useConfig } from '../lib/config'
import {
  FieldContext,
  FieldDragIn,
  FieldFormatProp,
  FieldLabelPositionProp,
  FieldMode,
  FieldTypeConstructor,
  Renderable,
} from '../lib/fields'
import { useFocusGroup } from '../lib/focus'
import { useFormats } from '../lib/formats'
import { ItemList } from '../lib/items'
import { FormRecord, useRecords } from '../lib/records'
import {
  extendReactive,
  extractRefs,
  PositionObserver,
  restrictProps,
  watchPosition,
} from '../lib/util'

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

const calcPadding = (
  node: VNode,
  state: { listen: PositionObserver; watch?: WatchStopHandle }
) => {
  state.listen.disconnect()
  state.watch?.()
  const outer = node.el as HTMLElement | undefined
  if (!outer || !document.body.contains(outer)) {
    return
  }
  const prepend = outer.querySelector('.of-field-prepend') as HTMLElement | null
  const append = outer.querySelector('.of-field-append') as HTMLElement | null
  if (prepend) state.listen.observe(prepend)
  if (append) state.listen.observe(append)
  state.watch = watch(state.listen.positions, (obs) => {
    let presize = 0
    let appsize = 0
    for (const [target, pos] of obs) {
      if (target === prepend) {
        presize = Math.ceil(pos.width)
      } else if (target === append) {
        appsize = Math.ceil(pos.width)
      }
    }
    outer.style.setProperty('--field-size-prepend', presize + 'px')
    outer.style.setProperty('--field-size-append', appsize + 'px')
  })
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
    class: [String, Array, Object],
    density: { type: [String, Number], default: undefined },
    disabled: Boolean,
    fixed: Boolean,
    format: [String, Object] as PropType<FieldFormatProp>,
    id: String,
    initialValue: {
      type: [String, Boolean, Number, Array, Object],
      default: undefined,
    },
    inline: Boolean,
    inputLabel: String,
    invalid: Boolean,
    items: [String, Array, Object] as PropType<string | any[] | ItemList>,
    label: String,
    labelPosition: String as PropType<FieldLabelPositionProp>,
    loading: Boolean,
    locked: Boolean,
    // messages
    maxlength: [Number, String],
    mode: String as PropType<FieldMode>,
    modelValue: {
      type: [String, Boolean, Number, Array, Object],
      default: undefined,
    },
    muted: Boolean,
    name: String,
    placeholder: String,
    readonly: Boolean,
    record: {
      type: Object as PropType<FormRecord>,
      required: false,
    },
    required: Boolean,
    rounded: Boolean,
    size: { type: [Number, String], default: undefined },
    // style
    type: String,
    variant: String,
    tint: String,
    context: String,
  },
  emits: {
    'update:modelValue': null,
    input: null,
  },
  setup(props, ctx: SetupContext) {
    const config = useConfig()
    const focusGrp = useFocusGroup()
    const formatMgr = useFormats()
    const recordMgr = useRecords()
    const themeOptions = useThemeOptions()

    const formatter = computed(() =>
      formatMgr.getTextFormatter(
        props.type,
        typeof props.format === 'string'
          ? undefined
          : props.format?.formatOptions,
        props.name,
        props.record
      )
    )
    const record = computed(() => {
      return props.record || recordMgr.getCurrentRecord() || undefined
    })
    const metadata = computed(() =>
      props.name ? record.value?.metadata?.[props.name] : null
    )

    const fieldType = computed(() => {
      const fmt = props.format
      return (
        props.type ||
        metadata.value?.type ||
        (fmt && typeof fmt === 'string'
          ? fmt
          : typeof fmt === 'object'
          ? (fmt as any).fieldType || (fmt as any).type
          : undefined)
      )
    })
    const dragOver = ref(false)
    const focused = ref(false)
    const variant = computed(() => {
      let v = props.variant
      if (!v || v == 'default') {
        v = themeOptions.defaultInputVariant
      }
      return v || 'outlined'
    })
    const tint = computed(() => props.tint)

    // may inherit default value from context in future
    const initialValue = computed(() =>
      props.name && record.value
        ? (record.value.initialValue || {})[props.name]
        : props.initialValue
    )
    const value = computed(() =>
      props.name && record.value
        ? record.value.value[props.name]
        : props.modelValue
    )
    const mode = computed(
      () =>
        props.mode ||
        metadata.value?.mode ||
        (props.fixed || metadata.value?.fixed
          ? 'fixed'
          : props.disabled || metadata.value?.disabled
          ? 'disabled'
          : props.readonly || metadata.value?.readonly
          ? 'readonly'
          : props.locked || record.value?.locked
          ? 'locked'
          : 'editable')
    )
    const editable = computed(() => mode.value === 'editable')
    const interactive = computed(() => mode.value !== 'fixed')
    const labelPosition = computed(() => {
      let p = props.labelPosition
      if (!p || p === 'default') {
        p = themeOptions.defaultLabelPosition as
          | FieldLabelPositionProp
          | undefined
      }
      if (!p || p === 'default') {
        p = props.variant === 'filled' ? 'frame' : 'top'
      }
      return p
    })
    const density = computed(() => {
      let d = props.density
      if (d === 'default') {
        d = undefined
      } else if (typeof d === 'string') {
        d = parseInt(d, 10)
        if (isNaN(d)) d = undefined
      }
      if (typeof d !== 'number') {
        d = themeOptions.defaultDensity
      }
      if (typeof d !== 'number') {
        d = labelPosition.value === 'frame' ? 0 : 2
      }
      return Math.max(0, Math.min(3, d || 0))
    })
    const inputLabel = computed(
      () =>
        props.inputLabel ??
        (labelPosition.value === 'input' ? props.label : undefined)
    )

    const fctx: FieldContext = proxyRefs({
      config,
      container: 'of-field',
      density,
      editable,
      fieldType,
      initialValue,
      inputLabel,
      interactive,
      labelPosition,
      mode,
      record,
      value,
      onInput: (input: any, value: any) => {
        ctx.emit('input', input, value)
      },
      onUpdate: (value: any) => {
        if (props.name && record.value) record.value.value[props.name] = value
        else ctx.emit('update:modelValue', value)
      },
      ...extractRefs(props, [
        'id',
        'inline',
        'items',
        'label',
        'loading',
        'muted',
        'name',
        'required',
        'rounded',
      ]),
    })

    const context = computed(() => props.context)

    /**
     * AD: `rendered` should ideally be a Ref that changes within a watch of
     * fieldType.value and props.format. The problem here is that inside watch
     * we cannot call inject(), and that is needed by many field types. Simply
     * converting `rendered` into computed value does not work well because that
     * causes many unnecessary rerenders, and also makes problems with popups.
     *  The remedy that, I memoize the rendered value and recalculate it only
     *  if fieldType.value or props.format has changed
     */
    const rerender = ref(true)
    let renderedMemo: any
    watch(
      () => [fieldType.value, props.format],
      () => {
        rerender.value = true
      }
    )
    const rendered = computed(() => {
      if (!rerender.value) {
        return renderedMemo
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      rerender.value = false
      const [ftype, fmt] = [fieldType.value, props.format]
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
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      renderedMemo = found.init(
        extendReactive(
          extfmt,
          restrictProps(
            props,
            [
              'align',
              'maxlength',
              'placeholder',
              'size',
              'name',
              'record',
              'items',
              'context',
            ],
            true
          )
        ),
        fctx
      )
      return renderedMemo
    })

    const padState = { listen: watchPosition() }
    const checkPad = (node: VNode) => calcPadding(node, padState)

    const handlers = {
      onBlur(_evt: FocusEvent) {
        focused.value = false
        if (focusGrp) focusGrp.blur()
      },
      onClick(evt: MouseEvent) {
        // ctx.emit('click', evt)
        const render = rendered.value
        evt.stopPropagation()
        if (render && render.click) return render.click(evt)
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
        if (focusGrp) focusGrp.focus()
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
        const mainId = render.inputId ? render.inputId + '-main' : props.id
        let overlay, overlayActive, overlayBlur
        // if(ctx.slots.overlay) overlay = ctx.slots.overlay(); else
        const dragIn = render.dragIn && makeDragIn(render.dragIn, dragOver)
        if (render.popup) {
          overlay = render.popup.content
          overlayActive = render.popup.visible ?? true
          overlayBlur = render.popup.onBlur
        }
        const showFocused =
          focused.value || dragOver.value || overlayActive || render.focused
        const blank =
          render.blank &&
          !(showFocused || overlayActive || mode.value === 'fixed')
        const metaLabel = props.name ? metadata.value?.label : undefined
        const labelText = render.label ?? props.label ?? metaLabel
        const label = ctx.slots.label
          ? ctx.slots.label()
          : labelPosition.value !== 'none' &&
            labelPosition.value !== 'input' &&
            labelText
          ? h(
              'label',
              {
                class: 'of-field-label',
                /*, for: render.inputId: triggering duplicate click events */
              },
              [labelText]
            )
          : undefined
        const cls = [
          'of-field ',
          {
            'of--tinted': !!tint.value,
            ['of--tint-' + tint.value]: !!tint.value,
            'of--active': render.active || !blank, // overridden for toggle input to avoid hiding content
            'of--blank': blank,
            'of--dragover': dragOver.value,
            'of--focused': showFocused,
            'of--inline': props.inline,
            'of--invalid': props.invalid || render.invalid,
            'of--interactive': interactive.value,
            'of--muted': props.muted,
            'of--loading': render.loading,
            'of--rounded': props.rounded,
            'of--updated': render.updated,
          },
          'of--cursor-' + (render.cursor || 'default'),
          'of--density-' + density.value,
          'of--label-' + (label ? labelPosition.value : 'none'),
          'of--mode-' + mode.value,
          'of--variant-' + variant.value,
          'of--tint-' + tint.value,
          render.class,
          props.class,
        ]
        const size = render.size || props.size // FIXME fetch from config
        const style: Record<string, string> = {}
        if (size) {
          style['--field-size'] = `${size}ch`
        }
        const inner: VNode | VNode[] = []
        renderSlot(
          inner,
          ctx.slots.prepend || render.prepend,
          'of-field-prepend'
        )
        const fixedValue = interactive.value
          ? undefined
          : formatter.value?.formatFixed?.(value.value, context.value)
        renderSlot(
          inner,
          ctx.slots.default ||
            (interactive.value
              ? render.content
              : fixedValue
              ? () => h('div', { class: 'of-field-content-text' }, fixedValue)
              : render.content),
          'of-field-inner'
        )
        renderSlot(inner, ctx.slots.append || render.append, 'of-field-append')
        if (overlay) {
          overlay = h(
            OfOverlay,
            {
              active: overlayActive,
              capture: false,
              shade: false,
              target: mainId ? '#' + mainId : '',
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
            label &&
            labelPosition.value !== 'frame' &&
            labelPosition.value !== 'input' &&
            labelPosition.value !== 'none'
              ? h('div', { class: 'of-field-main-label' }, label)
              : undefined,
            h(
              'div',
              {
                class: 'of-field-main',
                id: mainId,
              },
              [
                h('div', { class: 'of--layer of--layer-bg' }),
                h('div', { class: 'of--layer of--layer-brd' }),
                h('div', { class: 'of--layer of--layer-outl' }),
                h(
                  'div',
                  {
                    class: 'of-field-header',
                  },
                  label && labelPosition.value === 'frame'
                    ? h('div', { class: 'of-field-header-label' }, label)
                    : undefined
                ),
                h('div', { class: 'of-field-body' }, inner),
              ]
            ),
            h('div', { class: 'of-field-caption' }), // FIXME support custom slot
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
