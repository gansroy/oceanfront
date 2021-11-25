import { computed, defineComponent, h, PropType, ref, SetupContext } from 'vue'
import { FieldContext, FieldMode, FieldRender } from '../lib/fields'
import { useFormats } from '../lib/formats'
import { FormRecord, useRecords } from '../lib/records'
import { proxyRefs } from 'vue'

import { useConfig } from '../lib/config'

export const OfToggle = defineComponent({
  name: 'OfToggle',
  props: {
    checked: { type: Boolean, default: false },
    id: String,
    initialValue: { type: Boolean, default: undefined },
    inputType: String,
    label: String,
    loading: Boolean,
    locked: Boolean,
    mode: String as PropType<FieldMode>,
    muted: Boolean,
    name: String,
    readonly: Boolean,
    record: Object as PropType<FormRecord>,
    required: Boolean,
    switch: Boolean,
    value: String,
  },
  emits: {
    'update:checked': null,
  },
  setup(props, ctx: SetupContext) {
    const config = useConfig()
    const formatMgr = useFormats()
    const recordMgr = useRecords()
    const record = computed(() => {
      return props.record || recordMgr.getCurrentRecord() || undefined
    })
    const initialValue = computed(() =>
      props.name && record.value
        ? (record.value.initialValue || {})[props.name]
        : props.initialValue
    )
    const value = computed(() =>
      props.name && record.value
        ? record.value.value[props.name]
        : props.checked
    )
    const mode = computed(
      () => props.mode || (props.readonly ? 'readonly' : 'editable')
    )
    const locked = computed(() => props.locked || record.value?.locked)
    const editable = computed(() => mode.value === 'editable')
    const focused = ref(false)

    const fctx: FieldContext = proxyRefs({
      config,
      container: 'of-field',
      editable,
      fieldType: 'toggle',
      initialValue,
      locked,
      mode,
      record,
      value,
      onUpdate: (value: any) => {
        if (props.name && record.value) record.value.value[props.name] = value
        else ctx.emit('update:checked', value)
      },
      /*...extractRefs(props, [
        'id',
        'label',
        'loading',
        'muted',
        'name',
        'required',
      ]),*/
    })

    const rendered = computed<FieldRender>(() => {
      const found = formatMgr.getFieldType('toggle', true)
      if (!found) {
        throw new TypeError(`Unknown field type: toggle`)
      }
      return found.init(
        {
          inputType: props.inputType || (props.switch ? 'switch' : 'checkbox'),
        },
        fctx
      )
    })

    const handlers = {
      onBlur(_evt: FocusEvent) {
        focused.value = false
      },
      onClick(evt: MouseEvent) {
        const render = rendered.value
        evt.stopPropagation()
        if (render && render.click) return render.click(evt)
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
      },
    }

    return () => {
      const render = rendered.value
      const content = render.content?.()
      if (!content) return
      return h(
        'div',
        {
          class: [
            'of-toggle',
            {
              'of--active': true,
              'of--blank': render.blank,
              'of--focused': focused.value,
              'of--invalid': render.invalid,
              'of--muted': props.muted,
              'of--loading': render.loading,
              'of--locked': locked.value,
              'of--updated': render.updated,
            },
            'of--cursor-' + (render.cursor || 'default'),
            render.class,
          ],
          tabIndex: -1,
          ...handlers,
        },
        content
      )
    }
  },
})
