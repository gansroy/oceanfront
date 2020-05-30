import { VNode } from 'vue'

// format:
// determines field format (type + options)
// container only recreates field when type changes
// field props derived from this
// calls field function with reactive props

// container or helper must derive merged props:
// reactive field options + value
// formatter.render(() => {format: props.format, value: state.value})
// of-input may pass all props?
// -> renderTextInput() | renderTextArea() | renderSelect() ..
// renderSelect may have text input options

let _fieldIndex = 0

export const newFieldId = () => {
  return 'of-field-' + _fieldIndex++
}

export type FieldConstructor = (
  props: FieldProps,
  ctx: FieldContext
) => FieldSetup

export interface BaseForm {
  getInitialValue(name: string): any
  getValue(name: string): any
  locked?: boolean
  // setValue(name: string, value: any)
}

export interface FieldContext {
  container?: string
  // form?: BaseForm
  id?: string
  initialValue?: any // container normally loads from form
  label?: string
  locked?: boolean // | Lock
  mode?: 'view' | 'edit' | 'readonly' // | 'disabled' | 'locked'
  muted?: boolean // if editable, reduce indicators
  name?: string
  // onFocus, onBlur
  onUpdate?: (value: any) => void
  // onUpdate:value? - handled by field container
  // onInput? - watch inputValue
  // record?: Record<string, any>  possibly a Form object with associated locks
  required?: boolean
  size?: number | string
  value?: any
}

export interface FieldProps {
  defaultSize?: number | string
  defaultValue?: any
  //id?: string
  // inputProps:
  // onFocus, onBlur - handled by field container
  // onUpdate:value? - handled by field container
  // onInput? - watch inputValue
  // label?: string  / defaultLabel?
  maxlength?: number | string // defaultMaxlength?
  //name?: string
  placeholder?: string
  type?: string
  [key: string]: any
}

// container props:
// format (= field props), name/id/type (override format), label, value, form, messages, loading, variant
// list view: header block = field props, value obtained from row, row = record

// do not switch fields immediately to 'view' mode when saving form
// set 'locked' property of context, which should close any popups, abort/commit pending changes
// after timeout, change mode to readonly

export interface FieldSetup {
  append?: () => VNode | undefined
  // afterContent? (below)
  blank?: boolean
  class?: string | string[]
  click?: (evt?: MouseEvent) => boolean | undefined
  content?: () => VNode | undefined
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
  popup?: () => VNode | undefined
  // popupPosition
  prepend?: () => VNode | undefined
  updated?: boolean
  value?: any
}

export function defineFieldFormat(f: FieldConstructor): FieldConstructor {
  return f
}
