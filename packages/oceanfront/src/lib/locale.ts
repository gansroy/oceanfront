import { Config, ConfigManager, readonlyUnwrap } from '../lib/config'

export interface LocaleNumberFormat {
  groupSeparator: string
  decimalSeparator: string
  auto: boolean
}

export interface LocaleState {
  locale: string
  numberFormat?: LocaleNumberFormat
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
  console.log('mgr', mgr)
}

export function useLocale(config?: Config): LocaleState {
  const mgr = configManager.inject(config)
  return readonlyUnwrap(mgr)
}
