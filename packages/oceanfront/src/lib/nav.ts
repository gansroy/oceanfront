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
  group?: NavGroup
  router?: NavRouter

  get haveGroup(): boolean {
    return !!this.group
  }

  get haveRouter(): boolean {
    return !!this.router
  }

  groupRegister(target: NavGroupTarget): NavGroupUnregister | null {
    return (this.group && this.group.groupRegister(target)) || null
  }

  groupNavigate(
    target: string | { event: KeyboardEvent } | { id: string }
  ): boolean {
    return (this.group && this.group.groupNavigate(target)) || false
  }

  routeActive(target: NavTo): boolean {
    return (this.router && this.router.routeActive(target)) || false
  }

  routeNavigate(target: NavTo): Promise<void | string> | null {
    return (this.router && this.router.routeNavigate(target)) || null
  }

  routeResolve(target: NavTo): string | null {
    return (this.router && this.router.routeResolve(target)) || null
  }
}

const configManager = new ConfigManager('ofnav', NavManager)

export function setNavGroup(group: NavGroup | null): void {
  configManager.extendingManager.group = group || undefined
}

export function setRouter(router: NavRouter | null): void {
  configManager.extendingManager.router = router || undefined
}

export function useNav(config?: Config): NavState {
  const mgr = configManager.inject(config)
  return readonlyUnref(mgr)
}
