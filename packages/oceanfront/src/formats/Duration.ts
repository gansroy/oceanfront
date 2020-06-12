import { Ref, computed } from 'vue'
import { Config } from '@/lib/config'
import { LocaleState, useLocale } from '@/lib/locale'
import { TextFormatter, TextFormatResult, TextInputResult } from '@/lib/formats'
import { isDigit } from '@/lib/util'

export interface DurationFormatterOptions {
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

export class DurationFormatter implements TextFormatter {
  private _locale: LocaleState
  private _options: Ref<DurationFormatterOptions>

  constructor (config?: Config, options?: DurationFormatterOptions) {
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

  get align (): 'start' | 'center' | 'end' {
    return 'end'
  }

  get inputClass () {
    return 'of--text-numeric'
  }

  get inputMode () {
    return 'numeric'
  }

  get options () {
    return this._options.value
  }

  formatterOptions (editing?: boolean): Intl.NumberFormatOptions {
    const opts = this.options
    return {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      maximumSignificantDigits: editing
        ? undefined
        : opts.maximumSignificantDigits,
      minimumSignificantDigits: opts.minimumSignificantDigits,
      // signDisplay: this.signDisplay  // NYI in browsers
      style: opts.style,
      useGrouping: false
    }
  }

  parseInput (input: string) {
    let value = 0
    if (typeof input === 'string' && input.length !== 0) {
      const hr = parseInt(input.split('hh ')[0], 10)
      const min = parseInt(input.split('hh ')[1].substring(0, 1), 10)
      value = hr * 60 + min
    }

    return {
      input,
      value
    }
  }

  loadValue (modelValue: any): number | null {
    // bigint?
    if (typeof modelValue === 'number') return modelValue
    if (modelValue === null || modelValue === undefined) return null
    if (typeof modelValue === 'string') {
      modelValue = modelValue.trim()
      if (!modelValue.length) return null
      return parseInt(modelValue, 10)
    }
    throw new TypeError('Unsupported value')
  }

  format (modelValue: any): TextFormatResult {
    const value = modelValue
    let textValue = ''
    let error
    try {
      const value = this.loadValue(modelValue)
      if (value != null) {
        textValue = this.minToDurationConvert(modelValue)
      }
    } catch (e) {
      error = e.toString()
    }
    return {
      error,
      value,
      textValue
    }
  }

  minToDurationConvert (value: string) {
    let min = Math.round(parseInt(value, 10))
    const hr = Math.floor(min / 60)
    min = min % 60
    return '' + hr + 'hh ' + (min < 10 ? '0' + min : min) + 'mm'
  }

  unformat (input: string): string | null {
    if (typeof input === 'number') return input
    if (input === null || input === undefined) return null
    if (typeof input === 'string') {
      input = input.trim()
      if (!input.length) return null
      return input
    }
    throw new TypeError('Unsupported value')
  }

  handleInput (evt: InputEvent): TextInputResult {
    const input = evt.target as HTMLInputElement
    let textValue = input.value
    if (textValue.length) {
      const fmtOpts = this.formatterOptions(true)
      const formatter = Intl.NumberFormat(this.options.locale, fmtOpts)
      textValue = formatter.format(parseFloat(textValue))
      return {
        textValue,
        updated: input.value !== textValue,
        value: input.value
      }
    }
    return { updated: false }
  }

  handleFocus (evt: FocusEvent): void {
    const input = evt.target as HTMLInputElement
    input.value = ''
  }

  handleBlur (evt: FocusEvent): TextInputResult {
    const input = evt.target as HTMLInputElement
    let textValue = input.value
    if (textValue.length) {
      textValue = this.minToDurationConvert(textValue)
      return {
        textValue,
        updated: input.value !== textValue,
        value: input.value
      }
    }
    return { updated: false }
  }

  handleKeyDown (evt: KeyboardEvent): void {
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
      if (!range.match(/[0-9]/)) {
        const selPos = (evt.key === 'Backspace' ? selStart : selEnd) as number
        input.setSelectionRange(selPos, selPos)
        evt.preventDefault()
      }
    }
  }

  validate (): boolean {
    return true
  }
}
