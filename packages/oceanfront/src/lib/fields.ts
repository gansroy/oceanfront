import { VNode, Ref, readonly } from 'vue'
import { Config } from './config'
import { ItemList } from './items'
import { FormRecord } from './records'
import { extendReactive } from './util'

export type Renderable = VNode | VNode[] | string

let _fieldIndex = 0

export const newFieldId = (): string => {
  return 'of-field-' + _fieldIndex++
}

export type FieldType = FieldTypeConstructor | FieldInit

export interface FieldTypeConstructor {
  name?: string
  init: FieldInit
}

export type FieldInit = (props: FieldProps, ctx: FieldContext) => FieldRender

export type FieldMode = 'normal' | 'disabled' | 'readonly' | 'locked' | 'static'

export interface FieldContext {
  config: Config
  container?: string
  editable?: boolean
  fieldType?: string // the resolved field type name
  id?: string
  initialValue?: any // normally loaded from record
  interactive?: boolean
  items?: string | any[] | ItemList
  label?: string
  labelPosition?: string
  mode?: FieldMode
  muted?: boolean // if editable, reduce indicators
  name?: string
  record?: FormRecord
  // onFocus, onBlur
  onInput?: (input: any, value: any) => void
  onUpdate?: (value: any) => void
  required?: boolean
  value?: any
}

export interface FieldProps {
  align?: string // defaultAlign?
  defaultValue?: any
  items?: string | any[] | ItemList
  // label?: string  / defaultLabel?
  maxlength?: number | string // defaultMaxlength?
  // name?: string
  placeholder?: string
  size?: number | string //  defaultSize?
  type?: string
  record?: FormRecord
  [key: string]: any
}

// container props:
// format (= field props), name/id/type (override format), label, value, form, messages, loading, variant
// list view: header block = field props, value obtained from row, row = record

// do not switch fields immediately to 'view' mode when saving form
// set 'locked' property of context, which should close any popups, abort/commit pending changes
// after timeout, change mode to readonly

export interface FieldRender {
  active?: boolean
  append?: () => Renderable | undefined
  // afterContent? (below)
  blank?: boolean
  class?: string | string[] | Record<string, boolean>
  click?: (evt?: MouseEvent) => boolean | void
  content?: () => Renderable | undefined
  cursor?: string
  dragIn?: FieldDragIn
  focus?: () => void
  // footer?: () => Renderable | undefined
  focused?: boolean
  hovered?: boolean
  inputId?: string
  inputValue?: any
  invalid?: boolean
  label?: string
  loading?: boolean
  // messages
  pendingValue?: any
  popup?: FieldPopup
  prepend?: () => Renderable | undefined
  size?: number | string
  updated?: boolean
  value?: any
}

export interface FieldDragIn {
  dropEffect?: 'none' | 'copy' | 'link' | 'move'
  onDrop: (evt: DragEvent) => void
  onEnter?: (evt: DragEvent) => void
  onLeave?: (evt: DragEvent) => void
}

export interface FieldPopup {
  content?: () => Renderable | undefined
  visible?: boolean
  onBlur?: () => void
  // position?
}

// helper to infer type
export function defineFieldType<T extends FieldType>(f: T): T {
  return f
}

export type FormatProp = string | Record<string, any>

export type FrameProp = 'none' | 'normal' | 'block'

export function extendFieldFormat(
  format: FormatProp | undefined,
  props: Record<string, any>
): Record<string, any> {
  if (typeof format === 'string' || typeof format === 'function') {
    // text format name or constructor
    format = { type: format }
  }
  format = typeof format === 'object' ? format : {}
  return extendReactive(format, props)
}

export type ExtFieldRender = {
  [K in keyof FieldRender]: FieldRender[K] | Ref<FieldRender[K]>
}
export function fieldRender<T extends object>(props: T): FieldRender {
  // FIXME lies
  return readonly(props) as any as FieldRender
}
