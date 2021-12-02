<template>
  <div
    :class="[
      {
        'of-button--rounded': rounded,
        'of-button--expand': !split && items,
        'of-button--split': split,
      },
      'of-button',
      'of-button--' + variant,
    ]"
  >
    <button v-if="split || !items" :disabled="disabled" @click="onClickMenu">
      <of-icon v-if="icon" :name="icon" />
      <slot>&nbsp;</slot>
    </button>
    <button v-if="items" @click="toggleMenu($event)" @mouseleave="menuLeave()">
      <of-icon v-if="icon && !split" :name="icon" />
      <slot v-if="!split">&nbsp;</slot>
      <of-icon name="expand down" class="expand" />
    </button>
    <of-overlay
      v-if="items"
      :active="menuShown"
      :capture="false"
      :shade="false"
      :target="menuOuter"
    >
      <of-option-list
        :items="items"
        :on-click="onClickItem"
        @mouseenter="menuClearTimeout()"
        @mouseleave="menuLeave()"
      />
    </of-overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import OfOptionList from './OptionList.vue'
export default defineComponent({
  name: 'OfButton',
  components: { OfOptionList },
  props: {
    variant: String,
    icon: String,
    rounded: Boolean,
    disabled: Boolean,
    split: Boolean,
    items: [String, Array, Object],
    onClickMenu: Function,
  },
  setup(props) {
    const variant = computed(() => props.variant || 'solid')
    const menuShown = ref(false)
    const menuOuter = ref()
    const menuTimerId = ref()
    const onClickItem = (val: any) => {
      if (typeof val === 'function') val.call(this)
      closeMenu()
    }
    const onClickMenu = (val: any) => {
      closeMenu()
      if (props.onClickMenu && props.split) props.onClickMenu.call(this, val)
    }
    const toggleMenu = (_evt?: MouseEvent) => {
      menuOuter.value = (_evt?.target as Element).parentNode
      menuShown.value = !menuShown.value
    }
    const closeMenu = () => {
      menuShown.value = false
    }
    const menuLeave = () => {
      if (!menuShown.value) return false
      menuTimerId.value = window.setTimeout(() => {
        closeMenu()
      }, 500)
    }
    const menuClearTimeout = () => {
      clearTimeout(menuTimerId.value)
    }
    return {
      onClickItem,
      onClickMenu,
      closeMenu,
      toggleMenu,
      menuShown,
      menuOuter,
      variant,
      menuLeave,
      menuClearTimeout,
    }
  },
})
</script>
