<template>
  <i :class="{ focused }"></i>
  <slot :focused="focused"></slot>
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
  watch
} from 'vue'

export type NavTarget = {
  disabled?: boolean
  focused?: boolean
  elt?: any
  id?: string
  navActive?: boolean
  navTo?: () => void
}

export type INavGroup = {
  navRegister: (target: NavTarget) => () => void
  nav(target: string | { event: KeyboardEvent } | { id: string }): boolean
}

export default defineComponent({
  name: 'of-nav-group',
  setup(props, ctx: SetupContext) {
    const items = reactive(new Set<NavTarget>())
    const orderedItems = computed(() =>
      [...items].sort((a, b) => {
        const ia = a.elt
        const ib = b.elt
        if (!ia) {
          return ib ? 1 : 0
        }
        if (!ib) return -1
        const cmp = ia.compareDocumentPosition(ib)
        if (cmp == 4 || cmp == 16) return -1
        if (cmp == 2 || cmp == 8) return 1
        return 0
      })
    )
    const scan = computed(() => {
      let first
      let lastActive
      let lastFocused
      for (const [idx, item] of orderedItems.value.entries()) {
        if (item.disabled) continue
        if (first === undefined) first = idx
        if (item.focused) lastFocused = idx
        if (item.navActive) lastActive = idx
      }
      const active = lastFocused ?? lastActive ?? first
      return { lastFocused, lastActive, first, active }
    })
    const focused = computed(() => {
      const idx = scan.value.active
      if (idx !== undefined) return orderedItems.value[idx]?.focused
    })
    watch(
      () => scan.value,
      scan => {
        for (const [idx, item] of orderedItems.value.entries()) {
          const active = idx === scan.active
          if (item.navActive !== active) item.navActive = active
        }
      }
    )
    const provided = {
      navRegister(target: NavTarget): () => void {
        items.add(target)
        return () => {
          items.delete(target)
        }
      },
      nav(target: string | { event: KeyboardEvent } | { id: string }): boolean {
        const ordered = orderedItems.value
        const scanVal = scan.value
        if (!ordered.length || scanVal.active === undefined) return false
        const event: KeyboardEvent | undefined = (
          typeof target === 'object' && (target as any)
        ).event
        const key = event?.key
        if (key === 'ArrowDown' || key === 'ArrowRight') {
          target = 'next'
        } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
          target = 'previous'
        } else if (event) return false
        if (target === 'previous' || target === 'next') {
          let idx = scanVal.active
          let offs = target === 'next' ? 1 : -1
          while (true) {
            idx += offs
            if (idx < 0) idx = ordered.length - 1
            else if (idx >= ordered.length) idx = 0
            if (idx === scanVal.active) return false // looped around
            if (ordered[idx] && !ordered[idx].disabled && ordered[idx].navTo) {
              ordered[idx].navTo!()
              if (event) event.preventDefault()
              return true
            }
          }
        }
        return false
      }
    }
    provide('of_NavGroup', provided)
    return {
      focused
    }
  }
})
</script>
