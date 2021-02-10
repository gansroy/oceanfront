import { ref, computed, VNode, watch, h } from 'vue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId,
  fieldRender,
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
    const labelPosition = computed(() => props.labelPosition || 'input') // FIXME fetch from config
    const inputLabel = computed(() =>
      labelPosition.value === 'field'
        ? undefined
        : props.inputLabel ?? ctx.label
    )
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
    const canToggle = computed(() => ctx.mode !== 'readonly' && !ctx.locked)
    const clickToggle = (_evt?: MouseEvent) => {
      if (canToggle.value) {
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
      append() {
        if (inputType.value === 'switch')
          return h('div', { class: 'of-switch' }, [
            h('div', { class: 'of-switch-thumb' }),
            h('div', { class: 'of-switch-track' }),
          ])
      },
      blank: computed(() => !stateValue.value),
      class: computed(() => {
        return { 'of-toggle-field': true, 'of--checked': !!stateValue.value }
      }),
      content: () => {
        const label = inputLabel.value
          ? h(
              'label',
              {
                class: [
                  'of-field-input-label',
                  'of--align-' + (props.align || 'start'),
                ],
                for: inputId.value,
                onClick: (evt: MouseEvent) => evt.stopPropagation(),
              },
              [inputLabel.value]
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
              ? undefined
              : h(OfIcon, {
                  class: 'of-toggle-icon',
                  name: icon.value,
                  size: 'input',
                }),
          ]),
        ]
        if (label) inner.unshift(label)
        return [h('div', { class: 'of-toggle-wrapper' }, inner)]
      },
      click: clickToggle,
      cursor: computed(() => (canToggle.value ? 'pointer' : null)),
      focus,
      focused,
      // hovered,
      inputId,
      // inputValue,
      label: computed(() =>
        labelPosition.value === 'input' ? '' : props.label
      ),
      // loading
      // messages
      updated: computed(() => initialValue.value !== stateValue.value),
      value: stateValue,
    })
  },
})
