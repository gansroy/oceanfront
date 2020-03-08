<template>
  <div
    ref="elt"
    class="menu-item"
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
  name: 'menu-item',
  setup(props, ctx: SetupContext) {
    let unreg: (() => void) | undefined
    const elt = ref<HTMLElement | undefined>()
    const focused = ref(false)
    const navActive = ref(false)
    const navGroup = inject<INavGroup>('navGroup')
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
        if (navGroup && navGroup.nav({ key: evt.key })) return false
      }
    }
    onMounted(() => {
      if (navGroup) {
        unreg = navGroup.navRegister(
          reactive({ focused, elt, navActive, navTo })
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
