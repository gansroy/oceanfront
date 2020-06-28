import { ref, computed, VNode, watch, h, readonly } from 'vue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId,
} from '@/lib/fields'
import { OfIcon } from '@/components/Icon'

export const FileField = defineFieldType({
  name: 'file',
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

    const focus = () => {
      elt.value?.focus()
    }
    const clickOpen = (evt?: MouseEvent) => {
      console.log('click open')
      elt.value?.click()
      return false
    }
    const hooks = {
      onBlur(_evt: FocusEvent) {
        focused.value = false
      },
      onClick(evt: MouseEvent) {
        console.log('click a')
        evt.stopPropagation()
      },
      onFocus(_evt: FocusEvent) {
        focused.value = true
      },
      onVnodeMounted(vnode: VNode) {
        elt.value = vnode.el as HTMLInputElement
      },
    }

    return readonly({
      active: true, // always show content
      append() {
        return h(OfIcon, { name: 'attach', size: 'input' })
      },
      blank: computed(() => !stateValue.value),
      class: computed(() => {
        return { 'of-file-field': true }
      }),
      content: () =>
        h('div', { class: 'of-file-input' }, [
          h('input', {
            class: 'of-field-input',
            id: inputId.value,
            // disabled: disabled.value,
            name: ctx.name,
            type: 'file',
            ...hooks,
          }),
          h(
            'label',
            {
              class: [
                'of-field-input-label',
                'of--align-' + (props.align || 'start'),
              ],
              for: inputId.value,
              onClick: (evt: MouseEvent) => evt.stopPropagation(),
            },
            [props.placeholder || 'Select File']
          ),
        ]),
      click: clickOpen,
      cursor: 'pointer', // FIXME depends if editable
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
