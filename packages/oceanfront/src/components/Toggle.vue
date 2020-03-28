<template>
  <of-field-outer v-bind="fieldAttrs">
    <of-icon :name="icon" class="of-toggle-icon" v-if="icon" />
    <input ref="elt" :type="inputType" v-bind="attrs" />
    <div class="of-field-input-label">
      <label :for="id">{{ label }}</label>
    </div>
  </of-field-outer>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  SetupContext,
  computed,
  Ref,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'
import OfFieldOuter from './FieldOuter.vue'

export const supportedTypes = new Set(['checkbox', 'radio', 'switch'])

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
    name: String,
    type: String,
    value: String,
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
    const type = computed(() =>
      props.type && supportedTypes.has(props.type) ? props.type : 'checkbox'
    )
    const inputType = computed(() =>
      type.value === 'radio' ? 'radio' : 'checkbox'
    )
    const icon = computed(() =>
      type.value === 'switch'
        ? null
        : type.value + (inputValue.value ? ' checked' : '')
    )
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
    // const formChanged = (evt: Event) => {
    //   if (inputType.value === 'radio' && elt.value && !elt.value.checked) {
    //   }
    // }
    // onMounted(() => {
    //   if (elt.value && elt.value.form && inputType.value === 'radio') {
    //     elt.value.form.addEventListener('change', formChanged)
    //   }
    // })
    // onBeforeUnmount(() => {
    //   if (elt.value && elt.value.form) {
    //     elt.value.form.removeEventListener('change', formChanged)
    //   }
    // })
    return {
      attrs: computed(() => ({
        class: 'of-field-input',
        id,
        disabled: disabled.value,
        name: props.name,
        value: props.value,
        onBlur: (evt: FocusEvent) => {
          focused.value = false
        },
        onClick: (evt: Event) => {
          if (inputType.value === 'radio') {
            inputValue.value = props.value
          } else {
            inputValue.value = elt.value?.checked
          }
          ctx.emit('update:modelValue', inputValue.value)
        },
        onFocus: (evt: FocusEvent) => {
          focused.value = true
        }
      })),
      elt,
      fieldAttrs,
      icon,
      id,
      inputType,
      inputValue,
      label,
      type
    }
  }
})
</script>
