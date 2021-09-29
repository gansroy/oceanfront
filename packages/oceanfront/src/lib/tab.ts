export interface Tab {
  key: number
  text: string
  visible: boolean
  overflowButton: boolean
  params?: Object | undefined
  icon?: string
  disabled?: boolean
  subMenuItems?: Array<Tab> | undefined
  parentKey?: number | undefined
}
