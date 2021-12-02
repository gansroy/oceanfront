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

export interface IconResolver {
  resolve(name: string): Icon | string | null
}

export interface IconFont {
  resolve(name: string): Icon | null
}

function makeResolver(mapping: IconMapping): IconResolver {
  return {
    resolve: (name: string) => (mapping && mapping[name]) || null,
  }
}

const ledIcon = {
  svg: {
    paths: [
      'M 2 12 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0',
      'M 4 12 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0',
    ],
  },
}

class IconManager {
  defaultFont: string | undefined
  fonts: { [name: string]: IconFont }
  resolvers: IconResolver[]
  showMissing = false

  constructor() {
    this.fonts = {}
    this.resolvers = [
      {
        resolve: (name: string) => {
          let ret = null
          if (this.defaultFont) {
            ret = this.fonts[this.defaultFont].resolve(name)
          }
          if (!ret && name.startsWith('led ')) {
            ret = {
              class: 'of--icon-led of--led-' + name.substring(4),
              ...ledIcon,
            }
          }
          return ret
        },
      },
    ]
  }

  resolve(name?: string): Icon | null {
    if (!name) return null
    const spp = name.indexOf(' ')
    if (spp !== -1) {
      const font = name.substring(0, spp)
      if (font in this.fonts) {
        return this.fonts[font].resolve(name.substring(spp + 1))
      }
    }
    for (const r of this.resolvers) {
      const ret = r.resolve(name)
      if (typeof ret === 'string') return this.resolve(ret)
      else if (ret) return ret
    }
    if (this.showMissing) {
      return { text: 'xx' }
    }
    return null
  }
}

const configManager = new ConfigManager('oficon', IconManager)

export function registerIconFont(name: string, def: IconFont): void {
  if (!def) return
  const mgr = configManager.extendingManager
  mgr.fonts[name] = def
  if (!mgr.defaultFont) {
    mgr.defaultFont = name
  }
}

export function registerIcons(icons: IconMapping | IconResolver): void {
  if (!icons) return
  if (typeof icons === 'object') {
    icons = makeResolver(icons as IconMapping)
  }
  configManager.extendingManager.resolvers.push(icons)
}

export function setDefaultIconFont(name: string): void {
  configManager.extendingManager.defaultFont = name
}

export function showMissingIcons(flag?: boolean): void {
  if (flag === undefined) flag = true
  configManager.extendingManager.showMissing = flag
}

export function useIcons(config?: Config): IconManager {
  const mgr = configManager.inject(config)
  return readonlyUnref(mgr)
}
