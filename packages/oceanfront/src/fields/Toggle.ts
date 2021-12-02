import { ref, computed, VNode, watch, h } from 'vue'
import { OfIcon } from '../components/Icon'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId,
  fieldRender,
} from '../lib/fields'

export const supportedTypes = new Set(['checkbox', 'switch'])

export const ToggleField = defineFieldType({
  name: 'toggle',
  init(props: FieldProps, ctx: FieldContext) {
    const initialValue = computed(() => {
      let initial = ctx.initialValue
      if (initial === undefined) initial = props.defaultValue
      return initial ?? null
    })
    const stateValue = ref()
    watch(
      () => ctx.value,
      (val) => {
        if (val === undefined || val === '') val = null
        stateValue.value = val
      },
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
    const inputType = computed(() => {
      const pi = props.inputType
      return pi && supportedTypes.has(pi) ? pi : 'checkbox'
    })
    const icon = computed(() => {
      const checked = !!stateValue.value
      return 'checkbox' + (checked ? ' checked' : '')
    })

    const focus = () => {
      const curelt = elt.value
      if (curelt) curelt.focus()
    }
    const clickToggle = (_evt?: MouseEvent) => {
      if (ctx.editable) {
        stateValue.value = !stateValue.value
        if (ctx.onUpdate) ctx.onUpdate(stateValue.value)
      }
      focus()
      return false
    }
    const hooks = {
      onBlur(_evt: FocusEvent) {
        focused.value = false
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
      },
      onVnodeMounted(vnode: VNode) {
        elt.value = vnode.el as HTMLInputElement
      },
    }

    return fieldRender({
      active: true, // always show content
      blank: computed(() => !stateValue.value),
      class: computed(() => {
        return { 'of-toggle-field': true, 'of--checked': !!stateValue.value }
      }),
      content: () => {
        const inputLabel = ctx.inputLabel
        const label = inputLabel
          ? h(
              'label',
              {
                class: [
                  'of-field-content-text',
                  'of--align-' + (props.align || 'start'),
                ],
                for: inputId.value,
                onClick: (evt: MouseEvent) => evt.stopPropagation(),
              },
              [inputLabel]
            )
          : undefined
        const inner = [
          h('div', { class: 'of-toggle-input' }, [
            h('input', {
              class: 'of-field-input',
              checked: !!stateValue.value, // FIXME - make lazy
              id: inputId.value,
              // disabled: disabled.value,
              name: ctx.name,
              type: 'checkbox',
              value: '1',
              ...hooks,
            }),
            inputType.value === 'switch'
              ? h('div', { class: 'of-switch' }, [
                  h('div', { class: 'of-switch-thumb' }),
                  h('div', { class: 'of-switch-track' }),
                ])
              : h(OfIcon, {
                  class: 'of-toggle-icon',
                  name: icon.value,
                  size: 'input',
                }),
          ]),
        ]
        if (label) inner.push(label)
        return [h('div', { class: 'of-toggle-wrapper' }, inner)]
      },
      click: clickToggle,
      cursor: computed(() => (ctx.editable ? 'pointer' : null)),
      focus,
      focused,
      // hovered,
      inputId,
      // inputValue,
      // loading
      // messages
      updated: computed(() => initialValue.value !== stateValue.value),
      value: stateValue,
    })
  },
})
