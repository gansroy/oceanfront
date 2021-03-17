import { Ref, computed } from 'vue'
import { Config } from '../lib/config'
import { TextFormatter, TextFormatResult } from '../lib/formats'
import { LocaleState, useLocale } from '../lib/locale'

export interface DateTimeFormatterOptions {
    locale?: string
    dateFormat?: "short" | "medium"
    nativeOptions?: Intl.DateTimeFormatOptions
}

export const expand = (value: string | number, digits: number): string => {
    let result = '' + value
    while (result.length < digits) {
        result = '0' + result
    }
    return result
}

abstract class DateTimeFormatterBase implements TextFormatter {
    private _locale: LocaleState
    private _options: Ref<DateTimeFormatterOptions>

    constructor(config?: Config, options?: DateTimeFormatterOptions) {
        this._locale = useLocale(config)
        this._options = computed(() => {
            const opts: any = {}
            opts.locale = this._locale.locale
            Object.assign(opts, this._locale.dateFormat)
            if (options) {
                Object.assign(opts, options)
            }
            if (opts.dateFormat === undefined && !opts.time) opts.dateFormat = 'short'
            return opts
        })
    }

    get options(): DateTimeFormatterOptions {
        return this._options.value
    }

    get inputClass(): string {
        return 'of--text-datetime'
    }

    formatterOptions(_editing?: boolean): Intl.DateTimeFormatOptions {
        const opts = this.options
        if (opts.nativeOptions !== undefined) {
            return opts.nativeOptions
        }
        const fmtOpts = {} as any
        if (opts.dateFormat == 'medium') {
            fmtOpts.day = 'numeric'
            fmtOpts.month = 'short'
            fmtOpts.year = 'numeric'
        } else if (opts.dateFormat == 'short') {
            fmtOpts.day = '2-digit'
            fmtOpts.month = '2-digit'
            fmtOpts.year = 'numeric'
        }
        return fmtOpts
    }


    unformat(_input: string): Date | null {
        throw new TypeError('Unsupported value')
    }

    format(modelValue?: string | Date | number | null): TextFormatResult {
        let error
        let textValue = ''
        let value = modelValue
        try {
            value = this.loadValue(value)
            if (value !== null) {
                const fmt = Intl.DateTimeFormat(
                    this.options.locale,
                    this.formatterOptions()
                )
                textValue = fmt.format(value)
            }
        } catch (e) {
            error = e.toString()
        }
        return {
            textValue,
            error,
            value,
            textClass: this.inputClass,
        }
    }

    abstract formatPortable(date?: Date): string | undefined
    abstract loadValue(modelValue?: string | Date | number | null, dateOnly?: boolean): Date | null

}

export class DateTimeFormatter extends DateTimeFormatterBase {
    formatterOptions(_editing?: boolean): Intl.DateTimeFormatOptions {
        const fmtOpts = super.formatterOptions(_editing)
        fmtOpts.hour = '2-digit'
        fmtOpts.minute = '2-digit'
        return fmtOpts
    }

    formatPortable(date?: Date): string | undefined {
        if (!date) return undefined
        const Y = date.getUTCFullYear()
        const M = date.getUTCMonth() + 1
        const D = date.getUTCDate()
        const h = date.getUTCHours()
        const m = date.getUTCMinutes()
        const s = date.getUTCSeconds()
        return expand(Y, 4) + '-' +
            expand(M, 2) + '-' +
            expand(D, 2) +
            ' ' +
            expand(h, 2) + ':' +
            expand(m, 2) + ':' +
            expand(s, 2)

    }

    loadValue(modelValue?: string | Date | number | null): Date | null {
        let value
        if (typeof modelValue === 'string') {
            modelValue = modelValue.trim()
        }
        if (modelValue === null || modelValue == undefined) {
            value = null
        } else if (modelValue instanceof Date) {
            value = modelValue
        } else if (typeof modelValue === 'string') {
            // we expect "YYYY-MM-DD hh:mm:ss", always GMT
            const re = /^(\d\d\d\d)-(\d\d)-(\d\d)\s+(\d\d):(\d\d)(:\d\d)?$/
            const matches = re.exec(modelValue)
            if (!matches) {
                value = new Date()
            } else {
                const dateStr = matches.slice(1, 4).join('-') + 'T' + matches.slice(4, 6).join(':') + ':00Z'
                value = new Date(dateStr)
            }
        } else if (typeof modelValue === 'number') {
            value = new Date(modelValue)
        } else {
            throw new TypeError('Unsupported value')
        }
        return value
    }
}

export class DateFormatter extends DateTimeFormatterBase {
    formatPortable(date?: Date): string | undefined {
        if (!date) return undefined
        const Y = date.getUTCFullYear()
        const M = date.getUTCMonth() + 1
        const D = date.getUTCDate()
        return expand(Y, 4) + '-' +
            expand(M, 2) + '-' +
            expand(D, 2)

    }

    loadValue(modelValue?: string | Date | number | null): Date | null {
        let value
        if (typeof modelValue === 'string') {
            modelValue = modelValue.trim()
        }
        if (modelValue === null || modelValue == undefined) {
            value = null
        } else if (modelValue instanceof Date) {
            value = modelValue
        } else if (typeof modelValue === 'string') {
            // we expect "YYYY-MM-DD hh:mm:ss", always GMT
            const re = /^(\d\d\d\d)-(\d\d)-(\d\d)$/
            const matches = re.exec(modelValue)
            if (!matches) {
                value = new Date()
            } else {
                const dateStr = matches.slice(1, 4).join('-')
                value = new Date(dateStr)
            }
        } else if (typeof modelValue === 'number') {
            value = new Date(modelValue)
        } else {
            throw new TypeError('Unsupported value')
        }
        return value
    }
}
