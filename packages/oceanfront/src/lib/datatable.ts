export interface DataTableHeader {
  text: string
  value: string
  align?: 'start' | 'center' | 'end'
  format?: string
  sortable?: boolean
  filterable?: boolean
  divider?: boolean
  class?: string | string[]
  width?: string | number
  filter?: (value: any, search: string, item: any) => boolean // provide via formatter?
  sort?: (a: any, b: any) => number // provide via formatter?
  editable?: boolean | string
}
