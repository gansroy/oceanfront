import { computed, Ref, VNode, reactive } from 'vue'
import { Config, ConfigManager, readonlyUnwrap } from './config'
import { FieldConstructor } from './fields'
import { useLocale, LocaleState, LocaleNumberFormat } from './locale'

const isDigit = (s: string) => s >= '0' && s <= '9'

export interface TextFormatResult {
  blank?: boolean
  error?: string
  inputValue?: string
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

export interface NumberFormatterOptions {
  decimalSeparator?: string
  groupSeparator?: string
  locale?: string
  minimumIntegerDigits?: number
  maximumFractionDigits?: number
  minimumFractionDigits?: number
  maximumSignificantDigits?: number
  minimumSignificantDigits?: number
  restrictPositive?: boolean
  signDisplay?: string // = 'exceptZero'
  style?: string // = 'decimal' // currency, percent, unit
  useGrouping?: boolean
}

export class NumberFormatter implements TextFormatter {
  private _locale: LocaleState
  private _options: Ref<NumberFormatterOptions>

  constructor(config?: Config, options?: NumberFormatterOptions) {
    this._locale = useLocale(config)
    this._options = computed(() => {
      const opts: any = {}
      opts.locale = this._locale.locale
      Object.assign(opts, this._locale.numberFormat)
      if (this._options) {
        Object.assign(opts, this._options)
      }
      return opts
    })
  }

  get align(): 'start' | 'center' | 'end' {
    return 'end'
  }

  get inputClass() {
    return 'of-numeric'
  }

  get inputMode() {
    return 'numeric'
  }

  get options() {
    return this._options.value
  }

  formatterOptions(editing?: boolean): Intl.NumberFormatOptions {
    let opts = this.options
    return {
      // minimumIntegerDigits: this.minimumIntegerDigits, // requires extra leading zero handling
      maximumFractionDigits: opts.maximumFractionDigits || 3, // editing ? 5 : opts.maximumFractionDigits,
      minimumFractionDigits: opts.minimumFractionDigits,
      maximumSignificantDigits: editing
        ? undefined
        : opts.maximumSignificantDigits,
      minimumSignificantDigits: opts.minimumSignificantDigits,
      // signDisplay: this.signDisplay  // NYI in browsers
      style: opts.style,
      useGrouping: opts.useGrouping
    }
  }

  parseInput(input: string, selStart?: number) {
    const seps = this.getSeparators()

    if (typeof selStart !== 'number') selStart = 0
    // find first decimal, in case there's more than one
    let decPos: number | null = input.indexOf(seps.decimal)
    if (decPos < 0) {
      if (
        seps.decimal !== '.' &&
        selStart === input.length &&
        input.substring(selStart - 1, selStart) === '.'
      ) {
        // always interpret user entering terminal '.' as a decimal separator
        decPos = selStart - 1
      } else {
        decPos = null
      }
    }

    let parsed = ''
    let parsedSelStart: number | null = null
    let parsedAfterDigit =
      selStart && isDigit(input.substring(selStart - 1, selStart))
    let minDecs: number | null = decPos === null || decPos > selStart ? null : 0
    for (let idx = 0; idx < input.length; idx++) {
      if (selStart === idx) {
        parsedSelStart = parsed.length
      }
      if (idx === decPos) {
        parsed += '.'
      } else {
        const c = input.charAt(idx)
        if (isDigit(c)) {
          parsed += c
          if (minDecs !== null && selStart > idx && idx > decPos!) {
            minDecs++
          }
        }
      }
    }
    if (parsedSelStart === null) parsedSelStart = parsed.length
    const value = parsed.length ? parseFloat(parsed) : null

    // if input is integer-only (maxFractionDigits: 0):
    // - if user just typed a decimal, wipe it out
    // - if there is a decimal somewhere else, round the input immediately

    return {
      input,
      parsed,
      selStart: parsedSelStart,
      selAfterDigit: parsedAfterDigit,
      value,
      minDecs,
      seps
    }
  }

  getSeparators() {
    let opts = this.options
    let group = opts.groupSeparator
    let decimal = opts.decimalSeparator
    if (group === undefined || decimal === undefined) {
      const formatter = Intl.NumberFormat(opts.locale)
      const parts: any[] = (formatter as any).formatToParts(12345.6)
      for (const part of parts) {
        if (part.type === 'group' && group === undefined) group = part.value
        else if (part.type === 'decimal' && decimal === undefined)
          decimal = part.value
      }
    }
    decimal = decimal || '.'
    group = group || ','
    return { decimal, group }
  }

  loadValue(modelValue: any): number | null {
    // bigint?
    if (typeof modelValue === 'number') return modelValue
    if (modelValue === null || modelValue === undefined) return null
    if (typeof modelValue === 'string') {
      modelValue = modelValue.trim()
      if (!modelValue.length) return null
      return parseFloat(modelValue)
    }
    throw new TypeError('Unsupported value')
  }

  format(modelValue: any): TextFormatResult {
    let value = modelValue
    let inputValue = ''
    let error
    try {
      let value = this.loadValue(modelValue)
      if (value != null) {
        const fmt = Intl.NumberFormat(
          this.options.locale,
          this.formatterOptions()
        )
        inputValue = fmt.format(value)
      }
    } catch (e) {
      error = e.toString()
    }
    return {
      error,
      value,
      inputValue
    }
  }

  unformat(input: string): number | null {
    // bigint?
    if (typeof input === 'number') return input
    if (input === null || input === undefined) return null
    if (typeof input === 'string') {
      input = input.trim()
      if (!input.length) return null
      let parsed = this.parseInput(input)
      return parsed.value
    }
    throw new TypeError('Unsupported value')
  }

  handleInput(evt: InputEvent): TextInputResult {
    const input = evt.target as HTMLInputElement
    let inputValue = input.value
    let selStart = input.selectionStart || 0
    if (inputValue.length) {
      const fmtOpts = this.formatterOptions(true)
      const unformat = this.parseInput(inputValue, selStart)
      let { minDecs, seps } = unformat
      if (minDecs !== null)
        minDecs = Math.min(minDecs, fmtOpts.maximumFractionDigits!)
      const formatter = Intl.NumberFormat(this.options.locale, fmtOpts)
      const parts: any[] =
        unformat.value === null
          ? []
          : (formatter as any).formatToParts(unformat.value)
      inputValue = ''
      let parsedPos = 0
      for (const part of parts) {
        if (part.type === 'group') inputValue += seps.group
        else if (part.type === 'decimal') {
          inputValue += seps.decimal
          parsedPos++
        } else if (part.type === 'integer' || part.type === 'fraction') {
          let pval = part.value as string
          if (part.type === 'fraction') {
            if (minDecs && minDecs > pval.length)
              pval += '0'.repeat(minDecs - pval.length)
            minDecs = null
          }
          for (const c of pval.split('')) {
            if (!unformat.selAfterDigit && parsedPos === unformat.selStart) {
              selStart = inputValue.length
            }
            parsedPos++
            inputValue += c
            if (unformat.selAfterDigit && parsedPos === unformat.selStart) {
              selStart = inputValue.length
            }
          }
        } else {
          inputValue += part.value
        }
      }
      if (minDecs !== null) {
        inputValue += seps.decimal + '0'.repeat(minDecs)
      }
      selStart = Math.min(selStart, inputValue.length)
      return {
        inputValue,
        selStart,
        selEnd: selStart,
        updated: input.value !== inputValue,
        value: unformat.value
      }
    }
    return { updated: false }
  }

  handleKeyDown(evt: KeyboardEvent): void {
    // FIXME handle compositionstart, compositionend?
    const input = evt.target as HTMLInputElement
    let selStart = input.selectionStart
    let selEnd = input.selectionEnd
    if (selStart === null || selEnd === null) return
    if (selEnd < selStart) {
      selEnd = selStart
      selStart = input.selectionEnd
    }
    if (evt.key === 'Backspace' || evt.key === 'Delete') {
      // move over separator
      if (selStart === selEnd) {
        if (evt.key === 'Backspace') {
          if (selStart > 0) selStart--
          else return
        } else {
          if (selEnd < input.value.length) selEnd++
          else return
        }
      }
      const range = input.value.substring(selStart!, selEnd)
      if (
        !range.match(/[0-9]/) &&
        range.indexOf(this.getSeparators().decimal) === -1
      ) {
        const selPos = (evt.key === 'Backspace' ? selStart : selEnd) as number
        input.setSelectionRange(selPos, selPos)
        evt.preventDefault()
      }
    }
  }

  validate(): boolean {
    return true
  }
}

type TextFormatterCtor = { new (config?: Config, options?: any): TextFormatter }
type TextFormatterFn = { (config?: Config, options?: any): TextFormatter }

type TextFormatterDef = TextFormatter | TextFormatterCtor | TextFormatterFn
export type TextFormatterProp = TextFormatterDef | string

export interface FormatState {
  getFieldFormatter(type?: string): FieldConstructor | undefined

  getTextFormatter(
    type?: string | TextFormatterDef,
    options?: any
  ): TextFormatter | undefined
}

class FormatManager implements FormatState {
  readonly fieldFormats: Record<string, FieldConstructor> = {}
  readonly textFormats: Record<string, TextFormatterDef> = {}
  readonly config: Config

  constructor(config: Config) {
    this.config = config
    this.textFormats['number'] = NumberFormatter
  }

  getFieldFormatter(type: string): FieldConstructor | undefined {
    return this.fieldFormats[type]
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

export function defineFieldFormat(name: string, fmt: FieldConstructor) {
  let mgr = configManager.activeManager
  if (!mgr) return
  mgr.fieldFormats[name] = fmt
}

export function defineTextFormat(name: string, fmt: TextFormatterDef) {
  let mgr = configManager.activeManager
  if (!mgr) return
  mgr.textFormats[name] = fmt
}

export function useFormats(config?: Config): FormatState {
  const mgr = configManager.inject(config)
  return readonlyUnwrap(mgr)
}
