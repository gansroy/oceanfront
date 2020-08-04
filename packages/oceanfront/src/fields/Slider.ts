import {ref, computed, watch, h, readonly, VNode} from 'vue'
import {
  defineFieldType,
  FieldContext,
  FieldProps,
  newFieldId,
} from '@/lib/fields'

export const supportedTypes = new Set(['range'])

export const SliderField = defineFieldType({
  name: 'slider',
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
        if (val === undefined || val === '') val = {min: 1, max: 100,  step: 1, value: 1}
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
    const hooks = {
      onChange(evt: Event) {
        const target = evt.target as
          | HTMLInputElement
          | null
        if (!target) return

        stateValue.value.value = target.value
      },
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
    const focus = () => {
      const curelt = elt.value
      if (curelt) curelt.focus()
    }
    return readonly({
      content: () => {
        return h('div', { class: 'of-slider-field' }, [
          h('div', { class: 'of-slider-field--wrapper' }, [
            h('div', {
                class: 'of-slider-field--label'
              },
              stateValue.value.value
            ),
            h('div', {
              class: 'of-slider-field--track',
            }),
            h('input', {
              class: 'of-slider-field--input',
              id: inputId.value,
              name: ctx.name,
              type: 'range',
              min: stateValue.value.min,
              max: stateValue.value.max,
              step: stateValue.value.step,
              value: stateValue.value.value,
              ...hooks,
            }),
          ]),
        ]);
      },
      focus,
      focused,
    })
  },
})
