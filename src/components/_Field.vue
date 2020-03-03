<template>
  <div
    class="field"
    :class="[
      {
        active: !state.blank || state.focused,
        blank: state.blank,
        focus: state.focused,
        readonly: state.readonly,
        disabled: state.disabled
      },
      classAttrs
    ]"
  >
    <div class="field-overlay">
      <div class="field-label-wrap" v-if="showLabel">
        <label :for="state.inputId" class="field-label">{{
          state.label
        }}</label>
      </div>
    </div>
    <div class="field-inner">
      <input-text
        v-if="innerType === 'text'"
        autocomplete="off"
        class="field-input field-text"
        variant="field"
        :state="state"
      />
      <input-textarea
        v-if="innerType === 'textarea'"
        class="field-input field-textarea"
        variant="field"
        :state="state"
      />
      <input-check
        v-if="innerType === 'checkbox'"
        class="field-toggle"
        variant="field"
        :state="state"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, SetupContext, reactive, computed } from 'vue'
import { FieldState, FieldConfig, fieldState } from '../lib/field'
import { StoreRef } from '../lib/store'
import InputCheck from './InputCheck.vue'
import InputText from './InputText.vue'
import InputTextarea from './InputTextarea.vue'

const knownTypes = new Set(['checkbox', 'text', 'textarea'])

export default defineComponent({
  components: { InputCheck, InputText, InputTextarea },
  async setup(
    props: { config?: FieldConfig; store?: StoreRef },
    ctx: SetupContext
  ) {
    const state = fieldState(props.config, props.store)
    const classAttrs = ctx.attrs.class
    const showLabel = computed(
      () => !state.labelPosition || state.labelPosition === 'field'
    )
    let innerType = ctx.attrs.type as string
    if (!innerType || !knownTypes.has(innerType)) innerType = 'text'
    return {
      classAttrs,
      innerType,
      showLabel,
      state
    }
  }
})
</script>
