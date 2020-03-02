<template>
  <textarea ref="input" v-bind="attrs" v-on="handlers"></textarea>
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
import { StoreRef, storeRef } from '../lib/store'
import { hasOwn } from '../lib/util'

const copyAttrs = new Set([
  'autocomplete',
  'placeholder',
  'cols',
  'rows',
  'tabIndex',
  'value'
])

const mapStateAttrs = {
  id: 'inputId',
  class: 'inputClass',
  maxlength: 'maxLength',
  readonly: 'readOnly',
  required: 'required',
  style: 'inputStyle',
  tabindex: 'tabIndex',
  variant: 'inputVariant'
}

const variantClasses: Record<string, string> = {
  default: 'input-text',
  plain: ''
}

const calcHeight = (input: Ref<HTMLTextAreaElement>) => {
  let ht = input.value && input.value.scrollHeight
  console.log('height', ht)
}

const makeAttrs = (state: FieldState, input: Ref<HTMLTextAreaElement>) => {
  const result: Record<string, any> = Object.assign({}, state.inputAttrs)
  for (const k of copyAttrs) {
    const v = state[k] as any
    if (v !== undefined) result[k] = v
  }
  if (state.disabled) {
    result['disabled'] = true
  } else if (state.readOnly || state.store.locked) {
    result['readOnly'] = true
  }
  result['id'] = state.inputId
  result['class'] = [
    variantClasses[(state.inputVariant || 'default') as string],
    state.inputClass
  ]
  // FIXME make autogrow a property
  result['style'] = [calcHeight(input), state.inputStyle]
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

export default defineComponent({
  name: 'input-textarea',
  inheritAttrs: false,
  async setup(
    props: {
      config?: FieldConfig
      state?: FieldState
      store?: StoreRef
      [key: string]: any
    },
    ctx: SetupContext
  ) {
    // FIXME pull out known attributes, leave any unknown ones
    const state =
      props.state ||
      fieldState(props.config, props.store || storeRef(ctx.attrs.value))
    loadContextAttrs(ctx.attrs, state)
    const input: Ref<HTMLTextAreaElement> = ref()
    const handlers = {
      blur: (evt: FocusEvent) => {
        state.inputFocused = false
      },
      change: (evt: Event) => {
        state.value = input.value.value
      },
      input: (evt: InputEvent) => {
        state.inputValue = input.value.value
      },
      focus: (evt: FocusEvent) => {
        state.inputFocused = true
      }
    }
    return {
      attrs: computed(() => makeAttrs(state, input)),
      handlers,
      input,
      state
    }
  }
})
</script>
