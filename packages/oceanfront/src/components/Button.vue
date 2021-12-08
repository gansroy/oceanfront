<template>
  <div
    :class="[
      {
        'of-button--rounded': rounded,
        'of-button--disabled': disabled,
      },
      'of--density-' + density,
      'of-button',
      'of-button--' + variant,
    ]"
  >
    <button v-if="split || !items" :disabled="disabled" @click="onClickMenu">
      <of-icon v-if="icon" :name="icon" :class="iconCls" />
      <slot></slot>
    </button>
    <button
      v-if="items"
      @click="toggleMenu($event)"
      @mouseleave="menuLeave()"
      :class="{ 'expand-split': split, 'expand-menu': !split && items }"
    >
      <of-icon v-if="icon && !split" :name="icon" :class="iconCls" />
      <slot v-if="!split"></slot>
      <of-icon name="expand down" class="expand-down" />
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
    density: { type: [String, Number], default: undefined },
    items: [String, Array, Object],
    onClickMenu: Function,
  },
  setup(props, ctx) {
    const variant = computed(() => props.variant || 'solid')
    const menuShown = ref(false)
    const menuOuter = ref()
    const menuTimerId = ref()
    const iconCls = [{ 'icon-only': !ctx.slots.default }, 'button-icon']
    const density = computed(() => {
      let d = props.density
      if (d === 'default') {
        d = undefined
      } else if (typeof d === 'string') {
        d = parseInt(d, 10)
        if (isNaN(d)) d = undefined
      }
      if (typeof d !== 'number') {
        d = 2
      }
      return Math.max(0, Math.min(3, d || 0))
    })

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
      density,
      iconCls,
      menuLeave,
      menuClearTimeout,
    }
  },
})
</script>
