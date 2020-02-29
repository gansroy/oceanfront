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
      <div class="field-label-wrap">
        <label :for="state.inputId" class="field-label">{{
          state.label
        }}</label>
      </div>
    </div>
    <div class="field-inner">
      <input-text
        autocomplete="off"
        class="field-input"
        variant="plain"
        :state="state"
      ></input-text>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, SetupContext, reactive, computed } from 'vue'
import { FieldState } from '../lib/field'
import InputText from './InputText.vue'

export default defineComponent({
  components: { InputText },
  async setup(props: { state: FieldState }, ctx: SetupContext) {
    const state = props.state
    const classAttrs = ctx.attrs.class
    return {
      classAttrs,
      state
    }
  }
})
</script>
