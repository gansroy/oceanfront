import { DeepReadonly, readonly, reactive } from 'vue'

export interface ThemeOptions {
  defaultDensity?: number
  defaultInputVariant?: string
  defaultLabelPosition?: string
}

const options: ThemeOptions = reactive({})
const roOptions = readonly(options)

export function setThemeOptions(opts: ThemeOptions): void {
  if (opts.defaultDensity !== undefined) {
    options.defaultDensity = opts.defaultDensity
  }
  if (opts.defaultInputVariant !== undefined) {
    options.defaultInputVariant = opts.defaultInputVariant
  }
  if (opts.defaultLabelPosition !== undefined) {
    options.defaultLabelPosition = opts.defaultLabelPosition
  }
}

export function useThemeOptions(): DeepReadonly<ThemeOptions> {
  return roOptions
}
