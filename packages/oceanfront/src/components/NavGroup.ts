import { extendConfig } from 'src/lib/config'
import { defineComponent, SetupContext, computed, reactive, watch } from 'vue'
import { NavGroupTarget, NavGroupUnregister, setNavGroup } from '../lib/nav'

export const OfNavGroup = defineComponent({
  name: 'OfNavGroup',
  setup(_props, ctx: SetupContext) {
    const items = reactive(new Set<NavGroupTarget>())
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
        if (item.groupCurrent) lastActive = idx
      }
      const active = lastFocused ?? lastActive ?? first
      return { lastFocused, lastActive, first, active }
    })
    const focused = computed(() => {
      const idx = scan.value.active
      return idx !== undefined && orderedItems.value[idx]?.focused
    })
    watch(
      () => scan.value,
      (scan) => {
        for (const [idx, item] of orderedItems.value.entries()) {
          const active = idx === scan.active
          if (item.groupCurrent !== active) item.groupCurrent = active
        }
      }
    )

    extendConfig(() => {
      setNavGroup({
        groupRegister(target: NavGroupTarget): NavGroupUnregister | null {
          items.add(target)
          return {
            unregister: () => items.delete(target),
          }
        },
        groupNavigate(
          target: string | { event: KeyboardEvent } | { id: string }
        ): boolean {
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
            const offs = target === 'next' ? 1 : -1
            while (true) {
              idx += offs
              if (idx < 0) idx = ordered.length - 1
              else if (idx >= ordered.length) idx = 0
              if (idx === scanVal.active) return false // looped around
              if (
                ordered[idx] &&
                !ordered[idx].disabled &&
                ordered[idx].focus
              ) {
                ordered[idx].focus!()
                if (event) event.preventDefault()
                return true
              }
            }
          }
          return false
        },
      })
    })

    return () => ctx.slots.default?.({ focused })
  },
})
