<template>
  <input
    ref="input"
    v-bind="attrs"
    v-on="handlers"
    :id="field.inputId"
    :value="field.value"
  />
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
import { FieldState } from '../lib/field'

export default defineComponent({
  setup(props: { field: FieldState; type?: string }, ctx: SetupContext) {
    const field = props.field
    let attrs: any = { type: props.type || 'text' }
    for (const param of ['readOnly', 'placeholder']) {
      ;(attrs[param] as any) = field[param]
    }
    const input: Ref<HTMLInputElement> = ref()
    const handlers = {
      blur: (evt: FocusEvent) => {
        field.inputFocused = false
      },
      change: (evt: Event) => {
        field.value = input.value.value
      },
      input: (evt: InputEvent) => {
        field.inputValue = input.value.value
      },
      focus: (evt: FocusEvent) => {
        field.inputFocused = true
      }
    }
    return {
      attrs,
      field,
      handlers,
      input
    }
  }
})
</script>

<style scoped></style>
