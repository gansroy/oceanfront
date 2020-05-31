import {
  Transition,
  VNode,
  ref,
  computed,
  watch,
  h,
  readonly,
  resolveDirective,
  withDirectives
} from 'vue'
import {
  defineFieldFormat,
  FieldContext,
  FieldProps,
  newFieldId
} from './fields'
import { useFormats } from '../lib/format'
import { useItems } from '../lib/items'
import OfNavGroup from '../components/NavGroup.vue'
import OfListItem from '../components/ListItem.vue'
import { OfIcon } from '@/components/Icon'

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

export const renderSelectPopup = (
  items: any,
  setValue: any,
  active: boolean
) => {
  let content
  if (active) {
    let rowsOuter: VNode | undefined
    if (!items || !items.length) {
      rowsOuter = h('div', { style: 'padding: 0 0.5em' }, 'No items')
    } else {
      let rows = []
      for (const item of items) {
        if (item.special === 'header') {
          rows.push(h('div', { class: 'of-list-header' }, item.text))
        } else if (item.special === 'divider') {
          rows.push(h('div', { class: 'of-list-divider' }))
        } else {
          rows.push(
            h(
              OfListItem,
              {
                active: item.selected,
                disabled: item.disabled,
                onClick: () => {
                  setValue(item.value)
                }
              },
              () => item.text
            )
          )
        }
      }
      rowsOuter = h('div', { class: 'of-list-outer' }, rows)
    }
    content = () =>
      h('div', { role: 'menu', class: 'of-menu' }, [
        h(OfNavGroup, () => rowsOuter)
      ])
  } else {
    content = undefined
  }
  return h(Transition, { name: 'slide-down' }, content)
}

export const selectInput = defineFieldFormat(
  (props: FieldProps, ctx: FieldContext) => {
    const itemMgr = useItems()
    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.defaultValue
      return initial ?? null
    })

    const inputValue = ref()
    const pendingValue = ref() // store selected but unconfirmed value
    const stateValue = ref()
    watch(
      () => ctx.value,
      val => {
        if (val === undefined || val === '') val = null
        inputValue.value = val
        stateValue.value = val
        pendingValue.value = undefined
      },
      {
        immediate: true
      }
    )

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
    const opened = ref(false)
    const items = computed(
      () => itemMgr.getItemList(props.items) || { items: [] }
    )
    const formatItems = computed(() => {
      const resolved = items.value
      const value = inputValue.value
      const disabledKey =
        resolved.disabledKey === undefined ? 'disabled' : resolved.disabledKey
      const specialKey =
        resolved.specialKey === undefined ? 'special' : resolved.specialKey
      const textKey = resolved.textKey === undefined ? 'text' : resolved.textKey
      const valueKey =
        resolved.valueKey === undefined ? 'value' : resolved.valueKey
      const rows = []
      for (const item of resolved.items) {
        if (typeof item === 'string') {
          rows.push({
            disabled: false,
            text: item,
            selected: item === value,
            value: item
          })
        } else if (typeof item === 'object') {
          rows.push({
            disabled: item[disabledKey],
            text: item[textKey],
            value: item[valueKey],
            selected: item[valueKey] === value,
            special: item[specialKey]
          })
        }
      }
      return rows
    })
    const specialKey = computed(() => {
      const def = items.value.specialKey
      return def === undefined ? 'special' : def
    })
    const textKey = computed(() => {
      const def = items.value.textKey
      return def === undefined ? 'text' : def
    })
    const clickOpen = () => {
      // FIXME - ignore if in the middle of closing
      opened.value = true
    }
    const closePopup = () => {
      opened.value = false
    }
    const setValue = (val: any) => {
      inputValue.value = val
      // ctx.emit('update:modelValue', val)
      closePopup()
    }
    const hooks = {
      onBlur(evt: FocusEvent) {
        focused.value = false
      },
      onFocus(evt: FocusEvent) {
        focused.value = true
      }
    }

    return readonly({
      blank: computed(() => {
        const val = inputValue.value
        return val === undefined || val === null || val === ''
      }),
      class: 'of-field-select',
      content: () => {
        return [
          h(
            'div',
            {
              class: ['of-field-input', 'of--text-' + (props.align || 'start')],
              id: inputId.value,
              tabindex: 0,
              ...hooks
            },
            [inputValue.value]
          ),
          h(OfIcon, {
            class: 'of-bullet-select',
            name: opened.value ? 'bullet-select-close' : 'bullet-select'
          })
        ]
      },
      click: clickOpen,
      cursor: 'pointer', // FIXME depends if editable
      focus,
      focused: computed(() => focused.value || opened.value),
      // hovered,
      inputId,
      inputValue,
      // loading
      // messages
      pendingValue,
      popup: {
        content: () =>
          renderSelectPopup(formatItems.value, setValue, opened.value),
        visible: opened,
        onBlur: closePopup
      },
      updated: computed(() => initialValue.value !== stateValue.value),
      value: stateValue
    })
  }
)

export const textInput = defineFieldFormat(
  (props: FieldProps, ctx: FieldContext) => {
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
            'of--text-' + (props.align || fmt?.align || 'start')
          ],
          inputmode: fmt?.inputMode,
          id: inputId.value,
          maxlength: props.maxlength,
          name: ctx.name,
          placeholder: props.placeholder, // FIXME allow formatter override
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
)
