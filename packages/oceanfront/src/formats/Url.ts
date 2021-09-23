import { TextFormatter, TextFormatResult } from '../lib/formats'

export class UrlFormatter implements TextFormatter {
  loadValue(modelValue: any): string | null {
    if (modelValue === null || modelValue === undefined) return null
    return modelValue.toString().trim()
  }

  format(modelValue: any): TextFormatResult {
    let value = modelValue
    let textValue = ''
    let error
    try {
      value = this.loadValue(value)
      if (value != null) {
        textValue = this.fixUrl(value)
      }
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

  fixUrl(value: string): string {
    let url = value,
      tail

    // fix duplicate schema
    while ((tail = url.match(/(.*:\/\/.*?)(\w+:\/\/.*)$/))) url = tail[2]

    // fix issues like a double paste by looking for common schemas
    // http://www.example.comhttp://www.example.com -> comhttp://www.example.com -> http://www.example.com
    const sch = url.match(/^(.*?(file|https?|ftp))?(:\/\/.*)/i)
    if (sch && sch[2]) url = sch[2] + sch[3]

    // fix :/ instead of ://
    url = url.replace(/:\/([^\/])/, '://$1')

    // fix missing schema
    if (!/:\/\//.test(url) && url.length) url = 'http://' + url

    return url
  }

  unformat(input: string): string | null {
    return input
  }
}
