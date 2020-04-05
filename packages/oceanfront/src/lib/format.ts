import { computed, VNode } from 'vue'

const isDigit = (s: string) => s >= '0' && s <= '9'

export interface ValueFormatter {
  format(modelValue: any): string
  handleInput(evt: InputEvent): void // + warnings
  handleKeyDown(evt: KeyboardEvent): void // + warnings
  // ^ should return new native value + optional new formatted value
  validate(): boolean // + warnings
  render(): VNode | string
  // get attachments (ie. currency symbol, date icon, unit)
  // get input classes (number format)
  // get input mode for keyboard
  inputMode(): string | undefined
}

export class NumberFormatter implements ValueFormatter {
  // move into options
  defaultValue?: any
  decimalSeparator?: string
  groupSeparator?: string
  locale?: string | string[] = 'de-CH'
  minimumIntegerDigits?: number
  maximumFractionDigits?: number
  minimumFractionDigits?: number
  maximumSignificantDigits?: number
  minimumSignificantDigits?: number
  restrictPositive?: boolean
  signDisplay?: string // = 'exceptZero'
  style?: string // = 'decimal' // currency, percent, unit
  useGrouping?: boolean

  inputMode() {
    return 'numeric'
  }

  formatterOptions(editing?: boolean): Intl.NumberFormatOptions {
    return {
      // minimumIntegerDigits: this.minimumIntegerDigits, // requires extra leading zero handling
      maximumFractionDigits: editing ? 5 : this.maximumFractionDigits,
      minimumFractionDigits: this.maximumFractionDigits,
      maximumSignificantDigits: editing
        ? undefined
        : this.maximumSignificantDigits,
      minimumSignificantDigits: this.minimumSignificantDigits,
      // signDisplay: this.signDisplay  // NYI in browsers
      style: this.style,
      useGrouping: this.useGrouping
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
        selStart > 0 &&
        input.substring(selStart - 1, selStart) === '.'
      ) {
        // allow typing '.' as a decimal separator
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
    let group = this.groupSeparator
    let decimal = this.decimalSeparator
    if (group === undefined || decimal === undefined) {
      const formatter = Intl.NumberFormat(this.locale)
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
    const fmt = Intl.NumberFormat(this.locale, this.formatterOptions())
    return fmt.format(value)
  }

  handleInput(evt: InputEvent): void {
    const input = evt.target as HTMLInputElement
    let value = input.value
    let selStart = input.selectionStart || 0
    if (value.length) {
      const fmtOpts = this.formatterOptions(true)
      const unformat = this.unformat(value, selStart)
      console.log(unformat)
      let { minDecs, seps } = unformat
      if (minDecs !== null)
        minDecs = Math.min(minDecs, fmtOpts.maximumFractionDigits!)
      const formatter = Intl.NumberFormat(this.locale, fmtOpts)
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
      input.value = value
      input.setSelectionRange(selStart, selStart)
    }
    // return native value, error message
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
  render(): VNode | string {
    return ''
  }
}
