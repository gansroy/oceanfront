import { computed, Ref, ref } from 'vue'
import { Config } from '../lib/config'
import {
  TextFormatResult,
  TextFormatter,
  TextInputResult,
} from '../lib/formats'
import { LocaleState, useLocale } from '../lib/locale'
import { isDigit } from '../lib/util'

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

export type NumberSeparators = { decimal: string; group: string }

export class NumberFormatter implements TextFormatter {
  private _locale: LocaleState
  private _options: Ref<NumberFormatterOptions>

  constructor(config?: Config, options?: NumberFormatterOptions) {
    this._locale = useLocale(config)
    this._options = computed(() => {
      const opts: any = {}
      opts.locale = this._locale.locale
      Object.assign(opts, this._locale.numberFormat)
      if (options) {
        Object.assign(opts, options)
      }
      return opts
    })
  }

  get align(): 'start' | 'center' | 'end' {
    return 'end'
  }

  get inputClass(): string {
    return 'of--text-numeric'
  }

  get inputMode(): string {
    return 'numeric'
  }

  get options(): NumberFormatterOptions {
    return this._options.value
  }

  formatterOptions(editing?: boolean): Intl.NumberFormatOptions {
    const opts = this.options
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
      useGrouping: opts.useGrouping,
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
    const parsedAfterDigit =
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
      seps,
    }
  }

  getSeparators(): NumberSeparators {
    const opts = this.options
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
    let textValue = ''
    let error
    try {
      value = this.loadValue(value)
      if (value != null) {
        const selStart = 1;
        const unformat = this.parseInput(value.toString(), selStart);
        textValue = this.applyOptions(value, selStart, unformat);
      }
    } catch (e: any) {
      error = e.toString()
    }
    return {
      error,
      value,
      textValue,
      fixedValue: ref(textValue),
      textClass: this.inputClass,
    }
  }

  unformat(input: string): number | null {
    // bigint?
    if (typeof input === 'number') return input
    if (input === null || input === undefined) return null
    if (typeof input === 'string') {
      input = input.trim()
      if (!input.length) return null
      return this.parseInput(input).value
    }
    throw new TypeError('Unsupported value')
  }

  applyOptions(textValue: string, selStart: number, unformat: any): string {
    const fmtOpts = this.formatterOptions(true);
    const { seps } = unformat;
    let { minDecs } = unformat;
    if (minDecs !== null)
      minDecs = Math.min(minDecs, fmtOpts.maximumFractionDigits || 0);
    const formatter = Intl.NumberFormat(this.options.locale, fmtOpts);
    const parts: any[] =
      unformat.value === null
        ? []
        : (formatter as any).formatToParts(unformat.value);
    textValue = "";
    let parsedPos = 0;
    for (const part of parts) {
      if (part.type === "group") textValue += seps.group;
      else if (part.type === "decimal") {
        textValue += seps.decimal;
        parsedPos++;
      } else if (part.type === "integer" || part.type === "fraction") {
        let pval = part.value as string;
        if (part.type === "fraction") {
          if (minDecs && minDecs > pval.length)
            pval += "0".repeat(minDecs - pval.length);
          minDecs = null;
        }
        for (const c of pval.split("")) {
          if (!unformat.selAfterDigit && parsedPos === unformat.selStart) {
            selStart = textValue.length;
          }
          parsedPos++;
          textValue += c;
          if (unformat.selAfterDigit && parsedPos === unformat.selStart) {
            selStart = textValue.length;
          }
        }
      } else {
        textValue += part.value;
      }
    }
    if (minDecs !== null) {
      textValue += seps.decimal + "0".repeat(minDecs);
    }

    return textValue;
  }

  handleInput(evt: InputEvent): TextInputResult {
    const input = evt.target as HTMLInputElement
    let textValue = input.value
    let selStart = input.selectionStart || 0
    if (textValue.length) {
      const unformat = this.parseInput(textValue, selStart);
      textValue = this.applyOptions(textValue, selStart, unformat);
      selStart = Math.min(selStart, textValue.length);

      return {
        textValue,
        selStart,
        selEnd: selStart,
        updated: input.value !== textValue,
        value: unformat.value,
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
}
