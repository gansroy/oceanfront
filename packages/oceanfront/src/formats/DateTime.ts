import { Ref, computed } from 'vue'
import { Config } from '../lib/config'
import { TextFormatter, TextFormatResult } from '../lib/formats'
import { LocaleState, useLocale } from '../lib/locale'

export interface DateTimeFormatterOptions {
    locale?: string
    dateFormat: "short" | "medium" | undefined
    time?: boolean
    nativeOptions?: Intl.DateTimeFormatOptions
}


export class DateTimeFormatter implements TextFormatter {
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

    get options() {
        return this._options.value
    }

    get inputClass(): string {
        return 'of--text-datetime'
    }

    formatterOptions(editing?: boolean): Intl.DateTimeFormatOptions {
        const opts = this.options
        if (opts.nativeOptions !== undefined) {
            return opts.nativeOptions
        }
        let fmtOpts = {} as any
        if (opts.dateFormat == 'medium') {
            fmtOpts.day = 'numeric'
            fmtOpts.month = 'short'
            fmtOpts.year = 'numeric'
        } else if (opts.dateFormat == 'short') {
            fmtOpts.day = '2-digit'
            fmtOpts.month = '2-digit'
            fmtOpts.year = 'numeric'
        }
        if (opts.time) {
            fmtOpts.hour = '2-digit'
            fmtOpts.minute = '2-digit'
        }
        return fmtOpts
    }

    loadValue(modelValue: any): Date | null {
        if (typeof modelValue === 'string') {
            modelValue = modelValue.trim()
        }
        if (modelValue === null || modelValue == undefined) {
            modelValue = null
        } else if (modelValue instanceof Date) {
        } else if (typeof modelValue === 'string') {
            modelValue = Date.parse(modelValue)
        } else {
            throw new TypeError('Unsupported value')
        }
        return modelValue
    }

    unformat(input: string): Date | null {
        throw new TypeError('Unsupported value')
    }

    format(modelValue: any): TextFormatResult {
        let blank = false
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

}