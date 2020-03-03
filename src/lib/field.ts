import {
  isRef,
  ref,
  Ref,
  reactive,
  isReadonly,
  markNonReactive,
  readonly
} from 'vue'
import { storeRef, StoreRef } from './store'
import { isObject, hasOwn } from './util'
const __DEV__ = true // FIXME
let fieldSeq = 0

const defaultFormatters = new Map<String, FieldFormatter>()

export function getDefaultFormatter(
  fieldType?: string
): FieldFormatter | undefined {
  return defaultFormatters.get(fieldType || 'string')
}

export function setDefaultFormatter(
  fieldType: string,
  formatter?: FieldFormatter
) {
  if (!formatter) defaultFormatters.delete(fieldType)
  else defaultFormatters.set(fieldType, formatter)
}

export interface FieldFormatter<T = any> {
  format(value: T, context?: { target: 'display' } | object): string
  format(value: T, context?: object): any
  unformat(
    value: any,
    context?: object
  ): { value?: T; errors?: ValidationError[] }
}

export interface EventCallback<T = {}> {
  (evt: T): void
}

export interface EventListenerSet<T = {}> {
  // use WeakSet internally
  add(handler: EventCallback<T>): void
  remove(handler: EventCallback<T>): void
}

export interface StoreUpdate<T = any> {
  readonly newValue?: T | null
  readonly complete: boolean
  readonly errors?: ValidationError[]
  readonly rejected?: boolean // defined by errors w/level error or undefined
  cancel(): void
  onComplete: EventListenerSet<this>
}

export interface ValidationError {
  error?: Error
  level?: string
  message?: string
}

export interface StoreUpdateParams {}

export interface FieldUpdateParams extends StoreUpdateParams {
  formatted?: boolean
}

// these can be defined by attributes on the element and by model metadata
export interface FieldConfig {
  autocomplete?: string
  description?: string // allow VNode or component reference for complex content?
  disabled?: boolean
  formatter?: FieldFormatter // handle conversion between value, inputValue, displayValue
  help?: string // allow VNode?
  hidden?: boolean
  inputAttrs?: Record<string, any>
  inputId?: string // can be used to set the 'for' property of related labels
  inputClass?: string // maybe allow object, array
  inputStyle?: string // maybe allow object, array
  inputType?: string // override the input field type
  label?: string // allow VNode?
  maxLength?: number
  name?: string
  // readonly options?: OptionsSpec
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: number
  value?: any
  tabIndex?: number
  type?: string
  // any other properties
  [key: string]: any
}

export interface FieldState<T = string, S = T> extends FieldConfig {
  // inherits inputFocused and inputOpened unless set explicitly
  // allows field focus to be shared by multiple elements
  readonly active?: boolean
  // get whether the current stored value is considered blank
  readonly blank?: boolean
  // inherited properties
  readonly config: FieldConfig
  // get the display value as determined by the formatter
  readonly displayValue?: string
  // inherited properties
  readonly input?: FieldInput
  // unformatted field value, updates produce a commit to the store
  rawValue?: S
  // get whether the current input value is considered blank
  // readonly inputBlank?: boolean
  // // errors applying to the uncommitted value
  // inputErrors?: ValidationError[] | boolean
  // // pure reactive, localized to this ref
  // // allow field to report to listener when it is focused
  // inputFocused?: boolean
  // // whether a popup is currently attached to the element
  // inputOpened?: boolean
  // // represents value which hasn't yet been committed (input event, not change event)
  // // allows parent to react to updates as they happen
  // inputValue?: T
  // instance containing the stored value, pending update, and related methods
  store: StoreRef<S>
  // formatted field value, updates produce a commit to the store
  value?: T
  // --
  // inputHovered?: boolean
  // relFields: { relname: FieldState }
}

export interface FieldInput<T = string> {
  // input is currently focused or opened
  // allows field focus to be shared by multiple elements
  readonly active?: boolean
  // input value is considered blank (fails 'required')
  readonly blank?: boolean
  // the input element
  readonly elt?: HTMLElement
  // errors applying to the current input value
  readonly errors?: ValidationError[] | boolean
  // input is currently focused
  readonly focused?: boolean
  // identifier of the input element
  readonly id?: string
  // whether a popup is currently attached to the element
  readonly opened?: boolean
  // current input value (updated by input event)
  value?: T
}

class FieldStateInternal<T = string, S = T> {
  public config: FieldConfig
  public input?: FieldInput<T>
  public formatter: FieldFormatter<T>
  public props: Record<string, any>
  public store: StoreRef<S>

  constructor(
    config?: FieldConfig,
    input?: FieldInput<T>,
    props?: Record<string, any>,
    store?: StoreRef<S>
  ) {
    config = this.config = config || {}
    this.formatter =
      config.formatter || (getDefaultFormatter(config.type) as any)
    this.input = input
    this.props = reactive(props || {})
    this.store = store || storeRef(config.value) // FIXME apply field type?
    if (!config.inputId) config.inputId = 'input-' + fieldSeq++
  }

  get active(): boolean {
    return (this.input && this.input.active) || false
  }

  get blank(): boolean {
    // FIXME formatter should identify blank values
    let v = this.value
    return v === null || v === undefined || (v as any) === ''
  }

  get displayValue(): string {
    // FIXME run current field value through formatter
    // could also be a vue component?
    return ''
  }

  // FIXME add getter for combined errors: store + input
  // get errors()

  get focused(): boolean {
    return (this.input && this.input.focused) || false
  }

  get inputBlank(): boolean {
    if (this.input) {
      const inputBlank = this.input.blank
      if (inputBlank || inputBlank === false) return !!inputBlank
      let val = this.input.value
      // FIXME formatter should identify blank values
      return val === null || val === undefined || (val as any) === ''
    }
    return true
  }

  get rawValue(): S | null {
    // return unformatted value
    return this.store.value as S
  }

  set rawValue(val: S | null) {
    ;(this.store.value as any) = val
  }

  get value(): T | null {
    // return formatted value
    return (this.store.value as any) as T // FIXME
  }

  set value(val: T | null) {
    ;(this.store.value as any) = val // FIXME unformat the value
  }
}

export function fieldState<T, S>(
  // FIXME accept an object instead
  config?: FieldConfig,
  input?: FieldInput<T>,
  store?: StoreRef<S>
): FieldState<T, S> {
  // config may (should) be reactive before being passed in
  const state = new FieldStateInternal(config, input, store)
  return markNonReactive(new Proxy(state, fieldStateProxy)) // make shallowReactive in new version?
}

const fieldStateInternalProps = new Set([
  'active',
  'blank',
  'config',
  'displayValue',
  'focused',
  'formatter',
  'input',
  'inputBlank',
  'rawValue',
  'store',
  'value'
])

const isFieldStateProp = (key: string): key is keyof FieldStateInternal =>
  fieldStateInternalProps.has(key)

const fieldStateProxy: ProxyHandler<any> = {
  get(target: FieldStateInternal, key: string, receiver: object): any {
    let result: any
    let from: string
    if (isFieldStateProp(key)) {
      result = target[key]
      from = 'state'
    } else {
      const props = target.props
      if (hasOwn(props, key)) {
        result = props[key]
        from = 'props'
      } else {
        result = target.config[key]
        from = 'config'
      }
    }
    if (isRef(result)) {
      result = result.value
    }
    // console.log('get', from, key, result)
    return result
  },
  has(target: FieldStateInternal, key: string): boolean {
    return (
      isFieldStateProp(key) ||
      hasOwn(target.props, key) ||
      Reflect.has(target.config, key)
    )
  },
  ownKeys(target: FieldStateInternal): (string | number | symbol)[] {
    const keys: Set<string | number | symbol> = new Set(fieldStateInternalProps)
    for (const k of Reflect.ownKeys(target.props)) {
      keys.add(k)
    }
    for (const k of Reflect.ownKeys(target.config)) {
      keys.add(k)
    }
    return [...keys]
  },
  set(
    target: FieldStateInternal,
    key: string,
    value: any,
    receiver: object
  ): boolean {
    let from: string
    if (isFieldStateProp(key)) {
      if (key === 'rawValue' || key === 'value') {
        // writable props only
        ;(target[key] as any) = value
      }
      from = 'state'
    } else {
      let prev
      if (hasOwn(target.props, key)) {
        prev = target.props[key]
      } else {
        prev = target.config[key]
      }
      target.props[key] = value
      from = 'props'
    }
    // console.log('set', from, key, value)
    return true
  },
  deleteProperty(target: FieldStateInternal, key: string): boolean {
    if (isFieldStateProp(key)) {
      if (__DEV__) {
        console.error('Cannot delete internal property on FieldState')
      }
    } else {
      delete target.props[key]
    }
    return true
  }
}
