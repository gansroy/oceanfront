import { Config, ConfigManager } from './config'
import { readonlyUnref } from './util'

export interface Icon {
  class?: string
  // component?: Component | string
  // props?: VNodeProps
  name?: string
  svg?: SvgIcon
  text?: string
}

export interface SvgIcon {
  paths: string[]
}

export interface IconMapping {
  [key: string]: Icon | string
}

export interface IconSet {
  name?: string
  requirePrefix?: boolean
  resolve(name: string, prefix?: string): Icon | string | null
}

const ledIcon = {
  svg: {
    paths: [
      'M 2 12 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0',
      'M 4 12 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0',
    ],
  },
}

const LedIconSet = {
  name: 'led',
  resolve(name: string, type?: string): Icon | string | null {
    if (name && type) {
      return {
        class: 'of--icon-led of--led-' + name,
        ...ledIcon,
      }
    }
    return null
  },
}

class IconManager {
  sets: IconSet[]
  setsNamed: { [name: string]: IconSet }
  showMissing = false

  constructor() {
    this.sets = []
    this.setsNamed = { [LedIconSet.name]: LedIconSet }
  }

  resolve(name?: string, type?: string): Icon | null {
    if (typeof name !== 'string') return null
    let result
    const spp = name.indexOf(' ')
    const pfx = type || (spp !== -1 ? name.substring(0, spp) : null)
    if (pfx && pfx in this.setsNamed) {
      const sfx = type ? name : name.substring(spp + 1)
      result = this.setsNamed[pfx].resolve(sfx, pfx)
    }
    if (!result && !type) {
      for (const set of this.sets) {
        result = set.resolve(name)
        if (result) break
      }
    }
    if (typeof result === 'string') {
      if (result === name) {
        result = null // prevent loop
      } else {
        return this.resolve(result)
      }
    }
    if (!result && this.showMissing) {
      result = { text: 'xx' }
    }
    return result || null
  }
}

const configManager = new ConfigManager('oficon', IconManager)

export function registerIconSet(set: IconSet): void {
  if (!set) return
  const mgr = configManager.extendingManager
  const name = set.name
  if (name) {
    mgr.setsNamed[name] = set
  }
  if (!set.requirePrefix) {
    mgr.sets.push(set)
  }
}

export function showMissingIcons(flag?: boolean): void {
  if (flag === undefined) flag = true
  configManager.extendingManager.showMissing = flag
}

export function useIcons(config?: Config): IconManager {
  const mgr = configManager.inject(config)
  return readonlyUnref(mgr)
}
