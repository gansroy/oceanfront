import { ref, computed, Ref, VNode, watch, h, readonly } from 'vue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId
} from '@/lib/fields'
import { OfIcon } from '@/components/Icon'

export const supportedTypes = new Set(['checkbox', 'switch'])

export const ToggleField = defineFieldType({
  name: 'toggle',
  setup(props: FieldProps, ctx: FieldContext) {
    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.defaultValue
      return initial ?? null
    })
    const stateValue = ref()
    watch(
      () => ctx.value,
      val => {
        if (val === undefined || val === '') val = null
        stateValue.value = val
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
    const label = computed(() => ctx.label)
    const inputType = computed(() => {
      let pi = props.inputType
      return pi && supportedTypes.has(pi) ? pi : 'checkbox'
    })
    const icon = computed(() => {
      let checked = !!stateValue.value
      return 'checkbox' + (checked ? ' checked' : '')
    })

    const focus = () => {
      let curelt = elt.value
      if (curelt) curelt.focus()
    }
    const clickToggle = (evt?: MouseEvent) => {
      stateValue.value = !stateValue.value
      focus()
      return false
    }
    const hooks = {
      onBlur(evt: FocusEvent) {
        focused.value = false
      },
      onFocus(evt: FocusEvent) {
        focused.value = true
      },
      onVnodeMounted(vnode: VNode) {
        elt.value = vnode.el as HTMLInputElement
      }
    }

    return readonly({
      append: () => {
        return h(OfIcon, {
          class: 'of-icon-toggle',
          name: icon.value
        })
      },
      blank: computed(() => !stateValue.value),
      class: 'of-toggle-field',
      content: () => {
        return [
          h('input', {
            class: 'of-field-input',
            checked: !!stateValue.value, // FIXME - make lazy
            id: inputId.value,
            // disabled: disabled.value,
            name: ctx.name,
            type: 'checkbox',
            value: '1',
            ...hooks
          }),
          h(
            'div',
            {
              class: [
                'of-field-input-label',
                'of--text-' + (props.align || 'start')
              ]
            },
            [label.value]
          )
        ]
      },
      click: clickToggle,
      cursor: 'pointer', // FIXME depends if editable
      focus,
      focused,
      // hovered,
      inputId,
      // inputValue,
      // loading
      // messages
      updated: computed(() => initialValue.value !== stateValue.value),
      value: stateValue
    })
  }
})
