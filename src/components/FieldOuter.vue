<template>
  <div class="field-outer" :class="classAttrs">
    <div class="field-overlay">
      <div class="field-label-wrap" v-if="showLabel">
        <slot name="label">
          <label :for="inputId" class="field-label">{{ label }}</label>
        </slot>
      </div>
    </div>
    <div class="field-inner">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, SetupContext, reactive, computed } from 'vue'
import { FieldState, FieldConfig, fieldState } from '../lib/field'
import { StoreRef } from '../lib/store'

export default defineComponent({
  name: 'field-outer',
  inheritAttrs: false,
  async setup(
    props: {
      blank?: boolean
      class?: any
      config?: FieldConfig
      disabled?: boolean
      focused?: boolean
      inputId?: string
      label?: any
      opened?: boolean
      readonly?: boolean
      store?: StoreRef
      variant?: string
    },
    ctx: SetupContext
  ) {
    const classAttrs = computed(() => {
      const blank = props.blank && !(props.focused || props.opened)
      const cls = {
        active: !blank,
        blank: blank,
        focus: props.focused,
        readonly: props.readonly,
        disabled: props.disabled
      }
      const variant = props.variant || 'basic'
      return [cls, 'field-' + variant, props.class]
    })
    const config = props.config || {}
    const label = computed(() => props.label || config.label)
    const showLabel = computed(
      () => !config.labelPosition || config.labelPosition === 'field'
    )
    return {
      classAttrs,
      config,
      inputId: computed(() => props.inputId),
      label,
      showLabel
    }
  }
})
</script>
