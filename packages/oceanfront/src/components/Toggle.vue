<template>
  <of-field-outer v-bind="fieldAttrs">
    <input ref="elt" type="checkbox" v-bind="attrs" v-on="handlers" />
    <div class="of-field-input-label">
      <label :for="id">{{ label }}</label>
    </div>
  </of-field-outer>
</template>

<script lang="ts">
import { ref, defineComponent, SetupContext, computed, Ref, watch } from 'vue'
import OfFieldOuter from './FieldOuter.vue'

export default defineComponent({
  name: 'of-toggle',
  components: { OfFieldOuter },
  inheritAttrs: false,
  props: {
    checked: [Boolean, String],
    class: String,
    config: Object,
    disabled: [Boolean, String],
    id: String,
    label: String,
    modelValue: String,
    tabindex: [Number, String],
    variant: String
  },
  setup(props, ctx: SetupContext) {
    const config = props.config || props
    const inputValue = ref(
      props.checked === undefined ? props.modelValue : props.checked
    )
    watch(
      () => props.modelValue,
      val => {
        inputValue.value = val
      }
    )
    const elt: Ref<HTMLInputElement | undefined> = ref()
    const disabled = computed(() => config.disabled)
    const focused = ref(false)
    const id = config.id || 'input-' + Math.round(Math.random() * 1000) // FIXME
    const label = computed(() => config.label)
    const handlers = {
      blur: (evt: FocusEvent) => {
        focused.value = false
        ctx.emit('blur')
      },
      change: (evt: Event) => {
        inputValue.value = elt.value?.checked
        ctx.emit('change', inputValue.value)
        ctx.emit('update:modelValue', inputValue.value)
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
      class: ['of-field-toggle', config.class],
      config,
      disabled: disabled.value,
      focused: focused.value,
      inputId: id,
      label: config.label,
      showLabel: false,
      variant: config.variant
    }))
    return {
      attrs: computed(() => ({
        id,
        checked: !!inputValue.value, // ask formatter?
        class: 'of-field-input',
        disabled: disabled.value,
        tabIndex: config.tabindex
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
