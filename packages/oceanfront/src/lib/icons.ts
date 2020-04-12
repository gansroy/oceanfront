import { Config, ConfigManager, readonlyUnwrap } from '../lib/config'
import { computed, Component, InjectionKey, inject } from 'vue'

export interface Icon {
  class?: string
  component?: Component | string
  name?: string
  props?: object
  text?: string
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
    resolve: (name: string) => (mapping && mapping[name]) || null
  }
}

const uiiIcons = [
  'required',
  'accept',
  'cancel',
  'plus',
  'print',
  'search',
  'email',
  'mobile',
  'phone',
  'attach',
  'external',
  'user',
  'lock',
  'sign-in',
  'sign-out',
  'date',
  'time',
  'hourglass',
  'gear',
  'alt-menu',
  'menu',
  'ellipsis',
  'refresh',
  'expand-down',
  'expand-up',
  'expand',
  'expand-close',
  'checkbox',
  'checkbox checked',
  'radio',
  'radio checked',
  'star',
  'star checked',
  'circle-check',
  'circle-cross',
  'circle-ellipsis',
  'circle-help',
  'circle-error',
  'circle-info',
  'circle-plus',
  'circle-minus',
  'circle-divide',
  'circle-split',
  'circle-join',
  'circle-refresh',
  'circle-attach',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'arrow-down',
  'previous',
  'next',
  'triangle-down',
  'triangle-up',
  'nav-top',
  'nav-first',
  'nav-previous',
  'nav-next',
  'nav-last'
]

const uiiIconFont: IconFont = {
  resolve(name) {
    if (uiiIcons.includes(name)) {
      return {
        class: 'uibasic-icon icon-' + name
      }
    }
    return null
  }
}

const materialIcons = {
  required: '*',
  accept: 'done',
  cancel: 'close',
  plus: 'add',
  print: 'print',
  search: 'search',
  email: 'mail_outline',
  mobile: 'smartphone',
  phone: 'phone',
  attach: 'attach_file',
  external: 'open_in_new',
  user: 'account_circle',
  lock: 'lock',
  'sign-in': '⎘',
  'sign-out': '⎗',
  date: 'calendar_today',
  time: 'access_time',
  hourglass: 'hourglass_empty',
  gear: 'settings',
  'alt-menu': 'more_vert',
  menu: 'menu',
  ellipsis: 'more_horiz',
  refresh: 'refresh',
  'expand-down': 'expand_more',
  'expand-up': 'expand_less',
  expand: 'unfold_more',
  'expand-close': 'unfold_less',
  checkbox: 'check_box_outline_blank',
  'checkbox checked': 'check_box',
  radio: 'radio_button_unchecked',
  'radio checked': 'radio_button_checked',
  star: 'star_border',
  'star checked': 'star',
  'circle-check': 'check_circle',
  'circle-cross': 'cancel',
  'circle-ellipsis': '⋯',
  'circle-help': 'help',
  'circle-error': 'error',
  'circle-info': 'info',
  'circle-plus': 'add_circle',
  'circle-minus': 'remove_circle',
  'circle-divide': '⨸',
  'circle-split': '',
  'circle-join': '',
  'circle-refresh': '🔃',
  'circle-attach': 'attach_file',
  'arrow-left': 'arrow_forward icon-horiz-flip',
  'arrow-right': 'arrow_forward',
  'arrow-up': 'arrow_upward',
  'arrow-down': 'arrow_downward',
  previous: 'arrow_left icon-scale-lg',
  next: 'arrow_right icon-scale-lg',
  'triangle-down': 'arrow_drop_down icon-scale-lg',
  'triangle-up': 'arrow_drop_up icon-scale-lg',
  'nav-top': 'vertical_align_top',
  'nav-first': 'first_page',
  'nav-previous': 'navigate_before',
  'nav-next': 'navigate_next',
  'nav-last': 'last_page'
}

const materialIconFont: IconFont = {
  resolve(name) {
    let icon = (materialIcons as any)[name]
    if (icon) {
      let cls = 'material-icons'
      const spp = icon.indexOf(' ')
      if (spp !== -1) {
        cls += icon.substring(spp)
        icon = icon.substring(0, spp)
      }
      return {
        class: cls,
        text: icon
      }
    }
    return null
  }
}

class IconManager {
  defaultFont: string | undefined
  fonts: { [name: string]: IconFont }
  resolvers: IconResolver[]
  showMissing: boolean = false

  constructor() {
    this.defaultFont = 'uii'
    this.fonts = { uii: uiiIconFont, mi: materialIconFont }
    this.resolvers = []
  }

  resolve(name?: string): Icon | null {
    if (!name) return null
    let spp = name.indexOf(' ')
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
    let ret = null
    if (this.defaultFont) {
      ret = this.fonts[this.defaultFont].resolve(name)
    }
    if (!ret && this.showMissing) {
      ret = { text: 'xx' }
    }
    return ret
  }
}

const configManager = new ConfigManager('oficon', IconManager)

export function defineIconFont(name: string, def: IconFont) {
  const mgr = configManager.activeManager
  if (!mgr || !def) return
  mgr.fonts[name] = def
}

export function defineIcons(icons: IconMapping | IconResolver) {
  const mgr = configManager.activeManager
  if (!mgr || !icons) return
  if (typeof icons === 'object') {
    icons = makeResolver(icons as IconMapping)
  }
  mgr.resolvers.push(icons)
}

export function setDefaultIconFont(name: string) {
  const mgr = configManager.activeManager
  if (!mgr) return
  mgr.defaultFont = name
}

export function showMissingIcons(flag?: boolean) {
  const mgr = configManager.activeManager
  if (flag === undefined) flag = true
  if (mgr) mgr.showMissing = flag
}

export function iconConfig(cb: () => void) {}

export function useIcons(config?: Config): IconManager {
  const mgr = configManager.inject(config)
  return readonlyUnwrap(mgr)
}
