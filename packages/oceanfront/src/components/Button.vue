<template>
  <button 
    :disabled="disabled"
    :class="[
      {
        'of-button--rounded': rounded,
        'of-button--disabled': disabled,
      },
      'of-button', 
      'of-button--' + variant
    ]"
  >
    <of-icon v-if="icon" :name="icon" />
    <slot>Submit</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
export default defineComponent({
  name: 'OfButton',  
  props: {
    variant: String,
    label: String,
    icon: String,
    rounded: Boolean,
    disabled: Boolean,
  },
  setup(props) {
    const variant = computed(() => props.variant || 'solid')
    return {
      variant,
    }
  }
})
</script>
