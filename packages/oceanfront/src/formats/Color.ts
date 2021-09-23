import { loadColor } from '../lib/color'
import { TextFormatter, TextFormatResult } from '../lib/formats'

export class ColorFormatter implements TextFormatter {
  format(modelValue: any): TextFormatResult {
    let value = modelValue
    let textValue = ''
    let error
    try {
      value = loadColor(value)
      textValue = value || ''
    } catch (e: any) {
      error = e.toString()
      console.error(error)
    }
    return {
      error,
      value,
      textValue,
    }
  }

  unformat(input: string): string | null {
    return loadColor(input)
  }
}
