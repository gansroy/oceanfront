import { VNode } from 'vue'
import { ItemList } from './items'
import { extendReactive, extractRefs } from './util'

export type Renderable = VNode | VNode[] | string

let _fieldIndex = 0

export const newFieldId = () => {
  return 'of-field-' + _fieldIndex++
}

export type FieldType = FieldTypeConstructor | FieldSetup

export interface FieldTypeConstructor {
  name?: string
  setup: FieldSetup
}

export type FieldSetup = (props: FieldProps, ctx: FieldContext) => FieldRender

export interface BaseForm {
  getInitialValue(name: string): any
  getValue(name: string): any
  locked?: boolean
  // setValue(name: string, value: any)
}

// FIXME 'items' currently redundant
export interface FieldContext {
  container?: string
  // form?: BaseForm
  id?: string
  initialValue?: any // container normally loads from form
  items?: string | any[] | ItemList
  label?: string
  locked?: boolean // | Lock
  mode?: 'view' | 'edit' | 'readonly' // | 'disabled'
  muted?: boolean // if editable, reduce indicators
  name?: string
  // onFocus, onBlur
  onUpdate?: (value: any) => void
  // onUpdate:value? - handled by field container
  // onInput? - watch inputValue
  required?: boolean
  value?: any
}

export interface FieldProps {
  align?: string // defaultAlign?
  defaultValue?: any
  items?: string | any[] | ItemList
  // label?: string  / defaultLabel?
  maxlength?: number | string // defaultMaxlength?
  //name?: string
  placeholder?: string
  size?: number | string //  defaultSize?
  type?: string
  [key: string]: any
}

// container props:
// format (= field props), name/id/type (override format), label, value, form, messages, loading, variant
// list view: header block = field props, value obtained from row, row = record

// do not switch fields immediately to 'view' mode when saving form
// set 'locked' property of context, which should close any popups, abort/commit pending changes
// after timeout, change mode to readonly

export interface FieldRender {
  append?: () => Renderable | undefined
  // afterContent? (below)
  blank?: boolean
  class?: string | string[]
  click?: (evt?: MouseEvent) => boolean | void
  content?: () => Renderable | undefined
  cursor?: string
  focus?: () => void
  focused?: boolean
  hovered?: boolean
  inputId?: string
  inputValue?: any
  // labelPosition: 'content' | 'none' | undefined
  loading?: boolean
  // messages
  pendingValue?: any
  popup?: FieldPopup
  // popupPosition
  prepend?: () => Renderable | undefined
  updated?: boolean
  value?: any
}

export interface FieldPopup {
  content?: () => Renderable | undefined
  visible?: boolean
  onBlur?: () => void
}

// helper to infer type
export function defineFieldType<T extends FieldType>(f: T): T {
  return f
}

export function extendFieldFormat(
  format: any,
  props: Record<string, any>,
  restrict: string[]
) {
  if (typeof format === 'string' || typeof format === 'function') {
    // text format name or constructor
    format = { type: format }
  }
  format = typeof format === 'object' ? format : {}
  if (restrict) {
    props = extractRefs(props, restrict)
  }
  return extendReactive(format, props)
}
