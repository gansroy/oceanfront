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
