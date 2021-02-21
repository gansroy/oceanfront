import { computed, ComputedRef, reactive, watch } from 'vue'
import { Config, ConfigManager } from './config'
import { readonlyUnref } from './util'

export type NavGroupTarget = {
  disabled?: boolean
  focused?: boolean
  elt?: any
  id?: string
  groupCurrent?: boolean
  focus?: () => void
}

export type NavGroupUnregister = {
  unregister(): void
}

export type NavGroup = {
  readonly groupFocused: ComputedRef<boolean>
  groupRegister(target: NavGroupTarget): NavGroupUnregister | null
  groupNavigate(
    target: string | { event: KeyboardEvent } | { id: string }
  ): boolean
}

export type NavTo =
  | string
  | {
      path: string
      hash?: string
      query?: Record<string, string>
      replace?: boolean
      force?: boolean
    }

export interface NavRouter {
  routeActive(target?: NavTo): boolean
  routeNavigate(target: NavTo): Promise<void | string> | null
  routeResolve(target?: NavTo): string | null
}

export interface NavState extends NavRouter, NavGroup {
  readonly haveGroup: boolean
  readonly haveRouter: boolean
}

export class NavManager implements NavState {
  _afterRouteNavigate?: () => void
  _group?: NavGroup
  _router?: NavRouter

  get haveGroup(): boolean {
    return !!this._group
  }

  get haveRouter(): boolean {
    return !!this._router
  }

  get groupFocused(): ComputedRef<boolean> {
    return computed(() =>
      this._group ? this._group.groupFocused.value : false
    )
  }

  groupRegister(target: NavGroupTarget): NavGroupUnregister | null {
    return (this._group && this._group.groupRegister(target)) || null
  }

  groupNavigate(
    target: string | { event: KeyboardEvent } | { id: string }
  ): boolean {
    return (this._group && this._group.groupNavigate(target)) || false
  }

  routeActive(target: NavTo): boolean {
    return (this._router && this._router.routeActive(target)) || false
  }

  routeNavigate(target: NavTo): Promise<void | string> | null {
    const result = (this._router && this._router.routeNavigate(target)) || null
    const after = this._afterRouteNavigate
    if (result && after)
      return result.then((r) => {
        after()
        return r
      })
    return result
  }

  routeResolve(target: NavTo): string | null {
    return (this._router && this._router.routeResolve(target)) || null
  }
}

const configManager = new ConfigManager('ofnav', NavManager)

export function setNavGroup(group: NavGroup | null): void {
  configManager.extendingManager._group = group || undefined
}

export function setAfterRouteNavigate(cb: () => void): void {
  configManager.extendingManager._afterRouteNavigate = cb
}

export function setRouter(router: NavRouter | null): void {
  configManager.extendingManager._router = router || undefined
}

export function useNav(config?: Config): NavState {
  const mgr = configManager.inject(config)
  return readonlyUnref(mgr)
}

export function reactiveNavGroup(): NavGroup {
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
    return (idx !== undefined && orderedItems.value[idx]?.focused) || false
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

  return {
    groupFocused: focused,
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
          if (ordered[idx] && !ordered[idx].disabled && ordered[idx].focus) {
            ordered[idx].focus!()
            if (event) event.preventDefault()
            return true
          }
        }
      }
      return false
    },
  }
}
