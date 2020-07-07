import { Config, ConfigManager } from './config'
import { readonlyUnref } from './util'

export interface LocaleNumberFormat {
  readonly groupSeparator: string
  readonly decimalSeparator: string
  readonly auto: boolean
}

export interface LocaleState {
  readonly locale: string
  readonly numberFormat?: LocaleNumberFormat
}

class LocaleManager implements LocaleState {
  locale: string
  numberFormat?: LocaleNumberFormat

  constructor() {
    this.locale = navigator.language
  }
}

const configManager = new ConfigManager('ofloc', LocaleManager)

export function setLocale(loc: string) {
  configManager.extendingManager.locale = loc
}

export function useLocale(config?: Config): LocaleState {
  const mgr = configManager.inject(config)
  return readonlyUnref(mgr)
}
