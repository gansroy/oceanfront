<template>
  <field-outer v-bind="fieldAttrs">
    <input ref="elt" type="checkbox" v-bind="attrs" v-on="handlers" />
    <div class="field-input-label">
      <label :for="id">{{ label }}</label>
    </div>
  </field-outer>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  SetupContext,
  reactive,
  computed,
  Ref
} from 'vue'
import { FieldConfig, FieldState, fieldState } from '../lib/field'
import FieldOuter from './FieldOuter.vue'
import { StoreRef, storeRef } from '../lib/store'
import { hasOwn } from '../lib/util'

/*
const copyAttrs = new Set(['tabIndex', 'value'])

const mapStateAttrs = {
  id: 'inputId',
  class: 'inputClass',
  style: 'inputStyle',
  tabindex: 'tabIndex',
  variant: 'inputVariant'
}

const variantClasses: Record<string, string> = {
  default: 'input-check',
  plain: ''
}

const makeAttrs = (state: FieldState) => {
  const result: Record<string, any> = Object.assign({}, state.inputAttrs)
  for (const k of copyAttrs) {
    const v = state[k] as any
    if (v !== undefined) result[k] = v
  }
  if (state.disabled) {
    result['disabled'] = true
  }
  result['id'] = state.inputId
  result['class'] = [
    variantClasses[(state.inputVariant || 'default') as string],
    state.inputClass
  ]
  result['style'] = state.inputStyle
  return result
}

const loadContextAttrs = (attrs: Record<string, any>, state: FieldState) => {
  if (!attrs) return
  for (const k in attrs) {
    if (k === 'state' || k === 'value') continue
    if (hasOwn(mapStateAttrs, k)) {
      // FIXME may want to merge values, inputClass/Style can hold a list
      state[mapStateAttrs[k]] = attrs[k]
    } else {
      if (!state.inputAttrs) state.inputAttrs = {}
      state.inputAttrs[k] = attrs[k]
    }
  }
}
*/

export default defineComponent({
  name: 'input-toggle',
  components: { FieldOuter },
  inheritAttrs: false,
  setup(
    props: {
      checked?: boolean
      class?: string // or object or list
      config?: FieldConfig
      disabled?: boolean
      id?: string
      label?: string
      modelValue?: string
      store?: StoreRef
      tabindex?: number
      variant?: string
      [key: string]: any
    },
    ctx: SetupContext
  ) {
    // FIXME pull out known attributes, leave any unknown ones
    const config = props.config || {}
    const inputValue = ref(props.modelValue)
    const store = props.store || storeRef(inputValue.value) // FIXME
    const elt: Ref<HTMLInputElement | undefined> = ref()
    const disabled = computed(() => config.disabled || props.disabled)
    const focused = ref(false)
    const id =
      props.id || config.id || 'input-' + Math.round(Math.random() * 1000) // FIXME
    const label = computed(() =>
      props.label === undefined ? config.label : props.label
    )
    const handlers = {
      blur: (evt: FocusEvent) => {
        focused.value = false
        ctx.emit('blur')
      },
      change: (evt: Event) => {
        store.value = elt.value?.checked
        ctx.emit('change', elt.value?.checked)
      },
      focus: (evt: FocusEvent) => {
        focused.value = true
        ctx.emit('focus')
      }
    }
    const blank = computed(() => {
      // FIXME ask formatter
      const val = inputValue.value
      return val === undefined || val === null || val === ''
    })
    const fieldAttrs = computed(() => ({
      blank: false, // blank for indeterminate?
      class: ['field-toggle', props.class],
      config,
      disabled: disabled.value,
      focused: focused.value,
      inputId: id,
      label: props.label === undefined ? config.label : props.label,
      showLabel: false,
      store,
      variant: props.variant
    }))
    return {
      attrs: computed(() => ({
        id,
        checked: !!inputValue.value, // ask formatter?
        class: 'field-input',
        disabled: disabled.value,
        tabIndex: props.tabindex
      })),
      elt,
      fieldAttrs,
      id,
      handlers,
      label
    }
  }
})
</script>
