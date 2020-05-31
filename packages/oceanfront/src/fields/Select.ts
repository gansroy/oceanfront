import { Transition, VNode, ref, computed, watch, h, readonly } from 'vue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId
} from '@/lib/fields'
import { useItems } from '../lib/items'
import OfNavGroup from '../components/NavGroup.vue'
import OfListItem from '../components/ListItem.vue'
import { OfIcon } from '@/components/Icon'

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

export const SelectField = defineFieldType({
  name: 'select',
  setup(props: FieldProps, ctx: FieldContext) {
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
})
