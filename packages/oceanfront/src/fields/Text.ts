import { computed, h, ref, VNode, watch } from 'vue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  fieldRender,
  newFieldId,
} from '../lib/fields'
import { TextFormatter, useFormats } from '../lib/formats'
import { removeEmpty } from '../lib/util'

// editing a list field does not necessarily mean swapping input to edit mode
// it may/should show a popup instead (this might be implied by 'muted' flag)

const allowInputTypes = new Set([
  'date',
  'datetime-local',
  'email',
  'month',
  'number',
  'password',
  'tel',
  'time',
  'week',
  'url',
])

const _inputTypeFrom = (type?: string) => {
  if (type && allowInputTypes.has(type)) return type
  return 'text'
}

export const TextField = defineFieldType({
  name: 'text',
  init(props: FieldProps, ctx: FieldContext) {
    const formatMgr = useFormats(ctx.config)
    const formatter = computed(() =>
      formatMgr.getTextFormatter(
        props.type,
        props.formatOptions,
        ctx.name,
        props.record
      )
    )
    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.defaultValue
      const fmt = formatter.value
      if (fmt) {
        const fval = fmt.format(initial)
        if (fval.error) {
          console.error('Error loading initial value:', fval.error)
        } else initial = fval.value
      }
      if (initial === undefined) initial = null
      return initial
    })

    let lazyInputValue = ''
    const blank = ref()
    const inputValue = ref('')
    const pendingValue = ref()
    const stateValue = ref()
    const invalid = ref(false)
    const updateValue = (val: any, fmt?: TextFormatter) => {
      let updInvalid = false
      if (fmt) {
        const fval = fmt.format(val)
        if (fval.error) {
          // FIXME set messages
          console.error('Error loading field value:', fval.error, val)
          updInvalid = true
        } else {
          lazyInputValue = fval.textValue ?? ''
          val = fval.value
        }
      } else {
        if (val === null || val === undefined) lazyInputValue = ''
        else lazyInputValue = ('' + val).trim()
        val = lazyInputValue
      }
      if (val === undefined || val === '') val = null
      blank.value = val == null
      inputValue.value = lazyInputValue
      stateValue.value = val
      pendingValue.value = undefined
      invalid.value = updInvalid
    }
    watch(
      () => [ctx.value, formatter.value],
      ([val, fmt], _) => updateValue(val, fmt),
      {
        immediate: true,
      }
    )

    const elt = ref<HTMLInputElement | undefined>()
    const focused = ref(false)
    let defaultFieldId: string
    const inputId = computed(() => {
      let id = ctx.id
      if (!id) {
        if (!defaultFieldId) defaultFieldId = newFieldId()
        id = defaultFieldId
      }
      return id
    })
    const multiline = computed(
      () => ctx.fieldType === 'textarea' || formatter.value?.multiline
    )
    const inputType = computed(() => {
      const fmt = formatter.value
      return multiline.value
        ? undefined
        : fmt?.inputType || _inputTypeFrom(props.inputType)
    })
    const focus = (select?: boolean) => {
      if (elt.value) {
        elt.value.focus()
        if (select) elt.value.select()
        return true
      }
    }
    const hooks = {
      onBlur(evt: FocusEvent) {
        focused.value = false
        const fmt = formatter.value
        if (fmt?.handleBlur) {
          fmt.handleBlur(evt)
        }
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
      },
      onChange(evt: Event) {
        const target = evt.target as
          | (HTMLInputElement | HTMLTextAreaElement)
          | null
        if (!target) return
        let val = target.value
        const fmt = formatter.value
        if (fmt) {
          try {
            // FIXME change text formatter to catch exception
            val = fmt.unformat(val)
          } catch (e) {
            invalid.value = true
            // FIXME support an onInvalidInput hook maybe?
            pendingValue.value = undefined
            return
          }
        }
        if (val === stateValue.value) {
          // if the value has changed then this will be called automatically
          // when the new value is bound to the component, otherwise call
          // it manually so that the input reflects the formatted result
          updateValue(val, fmt)
          target.value = lazyInputValue
        } else {
          blank.value = val == null || val === ''
          pendingValue.value = undefined
        }
        if (ctx.onUpdate) ctx.onUpdate(val)
      },
      onClick(evt: MouseEvent) {
        // avoid select() when clicking in unfocused field
        evt.stopPropagation()
      },
      onInput(evt: InputEvent) {
        const inputElt = evt.target as HTMLInputElement | HTMLTextAreaElement
        const fmt = formatter.value
        if (fmt?.handleInput) {
          const upd = fmt.handleInput(evt)
          if (upd) {
            if (!upd.updated) return
            const iVal = upd.textValue ?? ''
            inputElt.value = iVal
            if (upd.selStart !== undefined) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              inputElt.setSelectionRange(upd.selStart, upd.selEnd!)
            }
            lazyInputValue = iVal
            pendingValue.value = upd.value
          }
        }
        if (ctx.onInput) ctx.onInput(evt.data, inputElt.value)
      },
      onKeydown(evt: KeyboardEvent) {
        const fmt = formatter.value
        if (fmt?.handleKeyDown) {
          fmt.handleKeyDown(evt)
        }
      },
      onVnodeMounted(vnode: VNode) {
        elt.value = vnode.el as HTMLInputElement
      },
    }

    return fieldRender({
      blank,
      class: {
        'of-text-field': true,
        'of--multiline': !!multiline.value,
      },
      content: () => {
        const fmt = formatter.value
        if (!ctx.interactive) {
          return blank.value ? '—' : inputValue.value
        }
        return h(multiline.value ? 'textarea' : 'input', {
          class: [
            'of-field-input',
            fmt?.inputClass,
            'of--align-' + (props.align || fmt?.align || 'start'),
          ],
          ...removeEmpty({
            inputmode: fmt?.inputMode,
            id: inputId.value,
            maxlength: props.maxlength,
            name: ctx.name,
            placeholder: props.placeholder,
            readonly: !ctx.editable || undefined,
            rows: props.rows,
            // size: props.size,  - need to implement at field level?
            type: inputType.value,
            value: lazyInputValue,
            ...hooks,
          }),
          // ctx.label as aria label
        })
      },
      click: () => focus(ctx.editable),
      cursor: computed(() => (ctx.editable ? 'text' : 'normal')),
      focus,
      focused,
      // hovered,
      inputId,
      inputValue,
      invalid,
      // loading
      // messages
      pendingValue,
      // popup? - if autocomplete
      updated: computed(() => initialValue.value !== stateValue.value),
      value: stateValue,
    })
  },
})
