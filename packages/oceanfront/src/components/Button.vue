<template>
  <div 
    :class="[
      {
        'of-button--rounded': rounded,
        'of-button--split': split,
      },
      'of-button', 
      'of-button--' + variant
    ]"
  >
    <button :disabled="disabled">
      <of-icon v-if="icon" :name="icon" class="of-button-icon" />
      <slot>Submit</slot>
    </button>
    <button 
      v-if="split" 
      class="expand"
      @click="toggleMenu($event)"
    > 
      <of-icon name="expand-down" />
    </button>
    <OfPopoupMenu :items="items" :shown="menuShown" :outer="menuOuter" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import OfPopoupMenu from './PopupMenu.vue'
import { usePopupMenu } from '../lib/popup_menu'

export default defineComponent({
  name: 'OfButton',  
  components: { OfPopoupMenu },
  props: {
    variant: String,
    label: String,
    icon: String,
    rounded: Boolean,
    disabled: Boolean,
    items: { type: Array, default: () => [] },
  },
  setup(props) {
    const variant = computed(() => props.variant || 'solid')
    const split = computed(() => props.items.length > 0)
    return {
      variant, 
      split,
      ...usePopupMenu(),
    }
  }
})
</script>
