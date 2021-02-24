import { Config, ConfigManager } from './config'
import { readonlyUnref } from './util'

export interface LocaleNumberFormat {
  readonly groupSeparator: string
  readonly decimalSeparator: string
  readonly auto: boolean
}

export type LocaleDateFormat = {
  placeholder?: any // LocaleDateFormat will be defined later. placeholder is here just to satisfy build 
}

export interface LocaleState {
  readonly locale: string
  readonly numberFormat?: LocaleNumberFormat
  readonly dateFormat?: LocaleDateFormat
}

class LocaleManager implements LocaleState {
  locale: string
  numberFormat?: LocaleNumberFormat
  dateFormat?: LocaleDateFormat

  constructor() {
    this.locale = navigator.language
  }
}

const configManager = new ConfigManager('ofloc', LocaleManager)

export function setLocale(loc: string): void {
  configManager.extendingManager.locale = loc
}

export function useLocale(config?: Config): LocaleState {
  const mgr = configManager.inject(config)
  return readonlyUnref(mgr)
}
