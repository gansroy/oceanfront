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
    checked: Boolean,
    class: String,
    disabled: Boolean,
    id: String,
    label: String,
    labelPosition: String,
    modelValue: String,
    tabindex: Number,
    variant: String
  },
  setup(props, ctx: SetupContext) {
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
    const disabled = computed(() => props.disabled)
    const focused = ref(false)
    const id = props.id || 'input-' + Math.round(Math.random() * 1000) // FIXME
    const label = computed(() => props.label)
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
      class: ['of-field-toggle', props.class],
      disabled: disabled.value,
      focused: focused.value,
      inputId: id,
      label: props.label,
      labelPosition: props.labelPosition,
      showLabel: false,
      variant: props.variant
    }))
    return {
      attrs: computed(() => ({
        id,
        checked: !!inputValue.value, // ask formatter?
        class: 'of-field-input',
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
