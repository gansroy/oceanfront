import { VNode, ref, computed, watch, h, readonly } from 'vue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId
} from '@/lib/fields'
import { useFormats } from '../lib/formats'

// of-input format=".." type=".."  type overrides format

// density is an of-field property

// list fields are more complicated because we support
// multiple fields. probably cannot be editable in this case, except with a custom control
// look at project assignment widgets for a complex field example

// editing a list field does not necessarily mean swapping input to edit mode
// it may/should show a popup instead
// but sometimes we do want to embed the editable control in a list view
// editable != can-edit  again
// editable = popup is good to support in general

// which is responsible for rendering display content, input or formatter?
// pass from formatter to input? input doesn't seem to be aware of formatter
// pass 'input processor' and validation (rules) function to input

// const copyAttrs = new Set(['autocomplete', 'placeholder', 'size', 'value'])

// types that can be inherited from state.type
// setting state.inputType allows any value
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
  'url'
])

const inputTypeFrom = (type?: string) => {
  if (type && allowInputTypes.has(type)) return type
  return 'text'
}

export const TextField = defineFieldType({
  name: 'text',
  setup(props: FieldProps, ctx: FieldContext) {
    const formatMgr = useFormats()
    const formatter = computed(() =>
      formatMgr.getTextFormatter(props.type, props.formatOptions)
    )
    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.defaultValue
      const fmt = formatter.value
      if (fmt) {
        const fval = fmt.format(initial)
        if (fval.error)
          console.error('Error loading initial value:', fval.error)
        else initial = fval.value
      }
      if (initial === undefined) initial = null
      return initial
    })

    let lazyInputValue: string
    const inputValue = ref('')
    const pendingValue = ref()
    const stateValue = ref()
    watch(
      () => ctx.value,
      val => {
        const fmt = formatter.value
        if (fmt) {
          const fval = fmt.format(val)
          if (fval.error) {
            console.error('Error loading field value:', fval.error, val)
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
        inputValue.value = lazyInputValue
        stateValue.value = val
        pendingValue.value = undefined
      },
      {
        immediate: true
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
      },
      onFocus(evt: FocusEvent) {
        focused.value = true
      },
      onChange(evt: Event) {
        lazyInputValue = (evt.target as HTMLInputElement)?.value
        let val = formatter.value
          ? formatter.value.unformat(lazyInputValue)
          : lazyInputValue
        stateValue.value = val
        inputValue.value = lazyInputValue
        if (ctx.onUpdate) ctx.onUpdate(val)
      },
      onClick(evt: MouseEvent) {
        // avoid select() when clicking in unfocused field
        evt.stopPropagation()
      },
      onInput(evt: InputEvent) {
        const fmt = formatter.value
        if (fmt?.handleInput) {
          const upd = fmt.handleInput(evt)
          if (upd) {
            if (!upd.updated) return
            let inputElt = evt.target as HTMLInputElement
            let iVal = upd.textValue ?? ''
            inputElt.value = iVal
            if (upd.selStart !== undefined) {
              inputElt.setSelectionRange(upd.selStart!, upd.selEnd!)
            }
            lazyInputValue = iVal
            pendingValue.value = upd.value
          }
        }
      },
      onKeydown(evt: KeyboardEvent) {
        const fmt = formatter.value
        if (fmt?.handleKeyDown) {
          fmt.handleKeyDown(evt)
        }
      },
      onVnodeMounted(vnode: VNode) {
        elt.value = vnode.el as HTMLInputElement
      }
    }
    return readonly({
      blank: computed(() => {
        // FIXME ask formatter
        const val = inputValue.value
        return val === undefined || val === null || val === ''
      }),
      class: 'of-field-text',
      content: () => {
        const fmt = formatter.value
        return h('input', {
          type: fmt?.inputType || 'text',
          class: [
            'of-field-input',
            fmt?.inputClass,
            'of--text-' + (ctx.align || props.align || fmt?.align || 'start')
          ],
          inputmode: fmt?.inputMode,
          id: inputId.value,
          maxlength: props.maxlength,
          name: ctx.name,
          placeholder: ctx.placeholder ?? props.placeholder,
          readonly: ctx.mode === 'readonly' || ctx.locked,
          value: lazyInputValue,
          ...hooks
          // ctx.label as aria label
        })
      },
      click: () => focus(true),
      cursor: 'text', // FIXME depends if editable
      focus,
      focused,
      // hovered,
      inputId,
      inputValue,
      // loading
      // messages
      pendingValue,
      // popup? - if autocomplete
      updated: computed(() => initialValue.value !== stateValue.value),
      value: stateValue
    })
  }
})
