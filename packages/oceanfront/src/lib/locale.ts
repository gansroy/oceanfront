import { Config, ConfigManager, readonlyUnwrap } from '../lib/config'

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
  let mgr = configManager.activeManager
  if (!mgr) return
  mgr.locale = loc
}

export function useLocale(config?: Config): LocaleState {
  const mgr = configManager.inject(config)
  return readonlyUnwrap(mgr)
}
