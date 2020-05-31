import { Config, ConfigManager, readonlyUnwrap } from './config'
import { FieldType, FieldTypeConstructor } from './fields'

export interface TextFormatResult {
  blank?: boolean
  error?: string
  textValue?: string
  textClass?: string
  value?: any
}
export interface TextInputResult extends TextFormatResult {
  selStart?: number
  selEnd?: number
  updated: boolean
}

export interface TextFormatter {
  format(modelValue: any): TextFormatResult
  unformat(input: string): any
  handleInput?: (evt: InputEvent) => TextInputResult // + warnings
  handleKeyDown?: (evt: KeyboardEvent) => void // + warnings
  // get attachments (ie. currency symbol, date icon, unit)
  inputClass?: string | string[]
  inputMode?: string
  inputType?: string
  align?: 'start' | 'center' | 'end'
}

type TextFormatterCtor = { new (config?: Config, options?: any): TextFormatter }
type TextFormatterFn = { (config?: Config, options?: any): TextFormatter }

type TextFormatterDef = TextFormatter | TextFormatterCtor | TextFormatterFn
export type TextFormatterProp = TextFormatterDef | string

export interface FormatState {
  getFieldType(
    type?: string,
    defaultType?: boolean | string
  ): FieldTypeConstructor | undefined

  getTextFormatter(
    type?: string | TextFormatterDef,
    options?: any
  ): TextFormatter | undefined
}

class FormatManager implements FormatState {
  defaultFieldType: string = 'text'
  readonly fieldTypes: Record<string, FieldType> = {}
  readonly textFormats: Record<string, TextFormatterDef> = {}
  readonly config: Config

  constructor(config: Config) {
    this.config = config
  }

  getFieldType(
    type: string,
    defaultType?: boolean | string
  ): FieldTypeConstructor | undefined {
    let ctor = this.fieldTypes[type]
    if (!ctor && defaultType) {
      if (typeof defaultType === 'string') ctor = this.fieldTypes[defaultType]
      if (!ctor) ctor = this.fieldTypes[this.defaultFieldType]
    }
    if (ctor && typeof ctor === 'function') {
      ctor = { setup: ctor }
    }
    return ctor
  }

  getTextFormatter(
    type?: TextFormatterProp,
    options?: any
  ): TextFormatter | undefined {
    let def: TextFormatterDef | undefined
    if (typeof type === 'string') def = this.textFormats[type]
    else def = type
    if (def) {
      if (typeof def === 'function') {
        if ('format' in def.prototype)
          return new (def as TextFormatterCtor)(this.config, options)
        return (def as TextFormatterFn)(this.config, options)
      }
    }
    return def
  }
}

const configManager = new ConfigManager('offmt', FormatManager)

export function registerFieldType(name: string, fmt: FieldType) {
  let mgr = configManager.activeManager
  if (!mgr) return
  mgr.fieldTypes[name] = fmt
}

export function registerTextFormatter(name: string, fmt: TextFormatterDef) {
  let mgr = configManager.activeManager
  if (!mgr) return
  mgr.textFormats[name] = fmt
}

export function setDefaultFieldType(name: string) {
  let mgr = configManager.activeManager
  if (!mgr) return
  mgr.defaultFieldType = name
}

export function useFormats(config?: Config): FormatState {
  const mgr = configManager.inject(config)
  return readonlyUnwrap(mgr)
}
