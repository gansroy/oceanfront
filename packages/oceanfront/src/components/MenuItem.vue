<template>
  <div
    ref="elt"
    class="menu-option of-menu-item"
    :tabindex="navActive ? 0 : -1"
    v-on="handlers"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  provide,
  ComponentPublicInstance,
  watchEffect,
  Ref,
  computed,
  reactive,
  inject,
  ref,
  onMounted,
  onUnmounted
} from 'vue'
import { INavGroup } from './NavGroup.vue'

export default defineComponent({
  name: 'of-menu-item',
  props: {
    disabled: Boolean
  },
  setup(props, ctx: SetupContext) {
    let unreg: (() => void) | undefined
    const disabled = computed(() => props.disabled)
    const elt = ref<HTMLElement | undefined>()
    const focused = ref(false)
    const navActive = ref(false)
    const navGroup = inject<INavGroup>('of_NavGroup')
    const navTo = () => {
      let focus = elt.value
      if (focus && focus.focus) focus.focus()
    }
    const handlers = {
      blur(evt: FocusEvent) {
        focused.value = false
      },
      focus(evt: FocusEvent) {
        focused.value = true
      },
      keydown(evt: KeyboardEvent) {
        if (navGroup && navGroup.nav({ event: evt })) return false
      }
    }
    onMounted(() => {
      if (navGroup) {
        unreg = navGroup.navRegister(
          reactive({ disabled, elt, focused, navActive, navTo })
        )
      }
    })
    onUnmounted(() => {
      if (unreg) unreg()
      unreg = undefined
    })
    return {
      elt,
      handlers,
      navActive
    }
  }
})
</script>
