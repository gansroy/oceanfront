<template>
  <div :id="id" class="of-field-outer" :class="classAttrs" v-on="handlers">
    <div class="of-field-above">
      <div class="of-field-label-wrap" v-if="withLabel">
        <slot name="label">
          <label :for="inputId" class="of-field-label">{{ label }}</label>
        </slot>
      </div>
    </div>
    <div class="of-field-inner">
      <slot />
    </div>
    <div class="of-field-below">
      <slot name="below" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, SetupContext, reactive, computed } from 'vue'
import { FieldState, FieldConfig, fieldState } from '../lib/field'
import { StoreRef } from '../lib/store'

export default defineComponent({
  name: 'of-field-outer',
  inheritAttrs: false,
  setup(
    props: {
      blank?: boolean
      class?: any
      config?: FieldConfig
      disabled?: boolean
      focused?: boolean
      id?: string
      inputId?: string
      label?: any
      opened?: boolean
      readonly?: boolean
      store?: StoreRef
      variant?: string
    },
    ctx: SetupContext
  ) {
    const config = props.config || {}
    const label = computed(() => props.label)
    const withLabel = computed(
      () =>
        (!config.labelPosition || config.labelPosition === 'field') &&
        label.value
    )
    const classAttrs = computed(() => {
      const blank = props.blank && !(props.focused || props.opened)
      const cls = {
        active: !blank,
        blank: blank,
        focus: props.focused,
        readonly: props.readonly,
        disabled: props.disabled,
        'with-label': withLabel.value
      }
      const variant = props.variant || 'basic'
      return [cls, 'of-field-' + variant, props.class]
    })
    const handlers = {
      click(evt: MouseEvent) {
        ctx.emit('click', evt)
      },
      mousedown(evt: MouseEvent) {
        ctx.emit('mousedown', evt)
      }
    }
    return {
      classAttrs,
      handlers,
      id: computed(() => props.id),
      inputId: computed(() => props.inputId),
      label,
      withLabel
    }
  }
})
</script>
