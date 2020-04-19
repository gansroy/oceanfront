import { computed, Ref, VNode, reactive } from 'vue'
import { Config, ConfigManager, readonlyUnwrap } from './config'
import { useLocale, LocaleState, LocaleNumberFormat } from './locale'

const isDigit = (s: string) => s >= '0' && s <= '9'

export interface InputResult {
  error?: string
  nativeValue?: any
  selStart?: number
  selEnd?: number
  updated: boolean
  value?: string
}

export interface RenderResult {
  class?: string
  content: VNode | string
}

export interface ValueFormatter {
  format(modelValue: any, record?: Record<string, any>, key?: string): string
  handleInput(evt: InputEvent): InputResult // + warnings
  handleKeyDown(evt: KeyboardEvent): void // + warnings
  // ^ should return new native value + optional new formatted value
  validate(): boolean // + warnings
  render(modelValue: any): RenderResult
  // get attachments (ie. currency symbol, date icon, unit)
  inputClass?: string | string[]
  inputMode?: string
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

export class NumberFormatter implements ValueFormatter {
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

  unformat(input: string, selStart?: number) {
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
    const value = parseFloat(parsed)

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

  format(modelValue: any): string {
    let value: number
    if (typeof modelValue === 'number') {
      // or bigint?
      value = modelValue
    } else {
      value = this.unformat(modelValue).value
    }
    const fmt = Intl.NumberFormat(this.options.locale, this.formatterOptions())
    return fmt.format(value)
  }

  render(modelValue: any): RenderResult {
    const val = this.format(modelValue)
    return {
      class: 'of-numeric',
      content: val
    }
  }

  handleInput(evt: InputEvent): InputResult {
    const input = evt.target as HTMLInputElement
    let value = input.value
    let selStart = input.selectionStart || 0
    if (value.length) {
      const fmtOpts = this.formatterOptions(true)
      const unformat = this.unformat(value, selStart)
      let { minDecs, seps } = unformat
      if (minDecs !== null)
        minDecs = Math.min(minDecs, fmtOpts.maximumFractionDigits!)
      const formatter = Intl.NumberFormat(this.options.locale, fmtOpts)
      const parts: any[] = (formatter as any).formatToParts(unformat.value)
      value = ''
      let parsedPos = 0
      for (const part of parts) {
        if (part.type === 'group') value += seps.group
        else if (part.type === 'decimal') {
          value += seps.decimal
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
              selStart = value.length
            }
            parsedPos++
            value += c
            if (unformat.selAfterDigit && parsedPos === unformat.selStart) {
              selStart = value.length
            }
          }
        } else {
          value += part.value
        }
      }
      if (minDecs !== null) {
        value += seps.decimal + '0'.repeat(minDecs)
      }
      return {
        nativeValue: unformat.value,
        selStart,
        selEnd: selStart,
        updated: input.value !== value,
        value
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

type FormatterCtor = { new (config?: Config, options?: any): ValueFormatter }
type FormatterFn = { (config?: Config, options?: any): ValueFormatter }

type FormatterDef = ValueFormatter | FormatterCtor | FormatterFn

export interface FormatState {
  getFormatter(
    type?: string | FormatterDef,
    options?: any
  ): ValueFormatter | undefined
}

class FormatManager implements FormatState {
  readonly formats: Record<string, FormatterDef> = {}
  readonly config: Config

  constructor(config: Config) {
    this.config = config
    this.formats['number'] = NumberFormatter
  }

  getFormatter(
    type?: string | FormatterDef,
    options?: any
  ): ValueFormatter | undefined {
    let def: FormatterDef | undefined
    if (typeof type === 'string') def = this.formats[type]
    else def = type
    if (def) {
      if (typeof def === 'function') {
        if ('format' in def.prototype)
          return new (def as FormatterCtor)(this.config, options)
        return (def as FormatterFn)(this.config, options)
      }
    }
    return def
  }
}

const configManager = new ConfigManager('offmt', FormatManager)

export function defineFormat(name: string, fmt: FormatterDef) {
  let mgr = configManager.activeManager
  if (!mgr) return
  mgr.formats[name] = fmt
}

export function useFormats(config?: Config): FormatState {
  const mgr = configManager.inject(config)
  return readonlyUnwrap(mgr)
}
