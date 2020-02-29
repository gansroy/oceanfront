import { isRef, ref, Ref, reactive, isReadonly, markNonReactive } from 'vue'
import { storeRef, StoreRef } from './store'
import { isObject } from './util'
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
  readOnly?: boolean
  required?: boolean
  size?: number
  value?: any
  tabIndex?: number
  type?: string
  // any other properties
  [key: string]: any
}

export interface FieldState<T = string, S = T> extends FieldConfig {
  // get whether the current value is considered blank
  readonly blank?: boolean
  // inherited properties
  readonly config: FieldConfig
  // get the display value as determined by the formatter
  readonly displayValue?: string
  // inherits inputFocused and inputOpened unless set explicitly
  // allows field focus to be shared by multiple elements
  focused?: boolean
  // get whether the current input value is considered blank
  readonly inputBlank?: boolean
  // errors applying to the uncommitted value
  inputErrors?: ValidationError[] | boolean
  // pure reactive, localized to this ref
  // allow field to report to listener when it is focused
  inputFocused?: boolean
  // whether a popup is currently attached to the element
  inputOpened?: boolean
  // represents value which hasn't yet been committed (input event, not change event)
  // allows parent to react to updates as they happen
  inputValue?: T
  // instance containing the stored value, pending update, and related methods
  store: StoreRef<S>
  // field value, updates produce a commit to the store
  value?: T
  // --
  // inputHovered?: boolean
  // relFields: { relname: FieldState }
}

class FieldStateInternal<T = string, S = T> {
  public config: FieldConfig
  public formatter: FieldFormatter<T>
  public inputErrors: Ref<ValidationError[] | boolean> = ref(false)
  public inputFocused: Ref<boolean> = ref(false)
  public inputOpened: Ref<boolean> = ref(false)
  public store: StoreRef<S>
  private _focused: Ref<boolean> = ref()
  private _inputValue: Ref<T>
  private _value: Ref<T>

  constructor(config?: FieldConfig, store?: StoreRef<S>) {
    config = this.config = reactiveConfig(config)
    this.formatter =
      config.formatter || (getDefaultFormatter(config.type) as any)
    this.store = store || storeRef(config.value)
    // FIXME watch store value
    if (!config.inputId) config.inputId = 'input-' + fieldSeq++
    // FIXME apply formatter
    this._inputValue = ref()
    // FIXME apply formatter
    this._value = ref(this.store.value) as Ref<T>
  }

  get blank(): boolean {
    let v = this.value
    return v === null || v === undefined || (v as any) === ''
  }

  get displayValue(): string {
    // FIXME run current value (from StoreRef) through formatter
    return ''
  }

  get focused(): boolean {
    const ov = this._focused.value
    if (ov !== undefined) return ov
    return this.inputFocused.value
  }

  set focused(val: boolean) {
    this._focused.value = val
  }

  get inputBlank(): boolean {
    let v = this.inputValue
    return v === null || v === undefined || (v as any) === ''
  }

  get inputValue(): T | null {
    return this._inputValue.value as any
  }

  set inputValue(val: T | null) {
    ;(this._inputValue.value as any) = val
    // FIXME populate inputErrors from formatter
  }

  get value(): T | null {
    return this._value.value as any
  }

  set value(val: T | null) {
    ;(this._value.value as any) = val
    ;(this.store.value as any) = val // FIXME unformat the value
    // FIXME update value if the store value changes to something else
  }

  // add storedValue

  // add getter for combined errors: store + inputErrors
}

export function fieldState<T, S>(
  config?: FieldConfig,
  store?: StoreRef<T>
): FieldState<T, S> {
  // config may (should) be reactive before being passed in
  const state = new FieldStateInternal(config, store)
  return markNonReactive(new Proxy(state, fieldStateProxy)) // make shallowReactive in new version?
}

export function reactiveConfig(
  config?: FieldConfig,
  props?: { [key: string]: any }
): FieldConfig {
  if (config && !props && !isReadonly(config)) return config
  if (isReadonly(config)) {
    const protoConfig = config
    config = {}
    config.prototype = protoConfig
  } else if (!config) {
    config = {}
  }
  if (isObject(props)) {
    Object.assign(config, props)
  }
  return reactive(config)
}

const fieldStateInternalProps = new Set([
  'blank',
  'config',
  'displayValue',
  'focused',
  'formatter',
  'inputBlank',
  'inputErrors',
  'inputFocused',
  'inputOpened',
  'inputValue',
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
      result = target.config[key]
      from = 'config'
    }
    if (isRef(result)) {
      result = result.value
    }
    // console.log('get', from, key, result)
    return result
  },
  has(target: FieldStateInternal, key: string): boolean {
    return isFieldStateProp(key) || Reflect.has(target.config, key)
  },
  ownKeys(target: FieldStateInternal): (string | number | symbol)[] {
    const keys: Set<string | number | symbol> = new Set(fieldStateInternalProps)
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
      if (key === 'inputErrors' || key === 'inputFocused') {
        // ref properties
        target[key].value = value
      } else if (
        key !== 'blank' &&
        key !== 'displayValue' &&
        key !== 'inputBlank'
      ) {
        // ignore read only props
        ;(target[key] as any) = value
      }
      from = 'state'
    } else {
      let prev = target.config[key]
      if (isRef(prev)) {
        prev.value = value
      } else {
        target.config[key] = value
      }
      from = 'config'
    }
    console.log('set', from, key, value)
    return true
  },
  deleteProperty(target: FieldStateInternal, key: string): boolean {
    if (isFieldStateProp(key)) {
      if (__DEV__) {
        console.error('Cannot delete internal property on FieldState')
      }
    } else {
      delete target.config[key]
    }
    return true
  }
}
