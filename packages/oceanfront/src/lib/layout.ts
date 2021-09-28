import { hsluvToHex, rgbToHsluv } from 'hsluv'
import { readonly, ref } from 'vue'
import { hexToRgb } from './color'
import { Config, ConfigManager } from './config'
import { readonlyUnref } from './util'

export type ThemeConfig = {
  primaryColor?: string
  primaryHue?: number
  secondaryHue?: number
  backgroundHue?: number
  dark?: boolean
  saturation?: number
}

const lastScroll = ref(new Date())

type WindowRect = {
  scrollX: number
  scrollY: number
  width: number
  height: number
}
const windowRect = ref<WindowRect>({
  scrollX: 0,
  scrollY: 0,
  width: 0,
  height: 0,
})

function initEvents() {
  function onScroll() {
    windowRect.value = {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }
  window.addEventListener('resize', onScroll, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}
let inited = false

export interface LayoutState {
  readonly isMobile: boolean
  readonly mobileBreakpoint: number
  readonly lastScroll: Date
  readonly windowRect: WindowRect
}

class LayoutManager implements LayoutState {
  mobileBreakpoint = 1024

  get isMobile() {
    return windowRect.value.width < this.mobileBreakpoint
  }

  get lastScroll(): Date {
    return lastScroll.value
  }

  get windowRect(): WindowRect {
    return readonly(windowRect.value)
  }
}

const configManager = new ConfigManager('oflay', LayoutManager)

export function setMobileBreakpoint(bp: number): void {
  configManager.extendingManager.mobileBreakpoint = bp
}

export function themeStyle(config?: ThemeConfig): Record<string, string> {
  if (!config) return {}
  let primaryHue
  let saturation
  if (config.primaryColor) {
    let primary
    try {
      primary = hexToRgb(config.primaryColor) || { r: 0, g: 0, b: 0 }
    } catch (e: any) {
      console.error(`Error parsing primary color: ${e.toString()}`)
      return {}
    }
    const huv = rgbToHsluv([primary.r, primary.g, primary.b])
    primaryHue = huv[0]
    saturation = huv[1]
  } else {
    primaryHue = (config.primaryHue || 0) % 360
    saturation = Math.min(100, config.saturation || 100) / 100
  }
  const secondHue = (config.secondaryHue || primaryHue + 90) % 360
  const bgHue = (config.backgroundHue || primaryHue) % 360
  const bg = config.dark
    ? hsluvToHex([bgHue, 40 * saturation, 10])
    : hsluvToHex([bgHue, 10 * saturation, 95])
  const text = config.dark
    ? hsluvToHex([primaryHue, 40 * saturation, 90])
    : hsluvToHex([primaryHue, 30 * saturation, 20])
  const label = config.dark
    ? hsluvToHex([primaryHue, 40 * saturation, 90]) + 'aa'
    : hsluvToHex([primaryHue, 20 * saturation, 20]) + 'bb'

  const bg_field = config.dark
    ? hsluvToHex([primaryHue, 40 * saturation, 80]) + '22'
    : '#fff'
  const bg_field_focus = config.dark
    ? hsluvToHex([primaryHue, 30 * saturation, 90]) + '33'
    : '#fff'
  const bg_field_filled = config.dark
    ? hsluvToHex([primaryHue, 80 * saturation, 50]) + '66'
    : hsluvToHex([primaryHue, 80 * saturation, 60]) + '33'
  const bg_field_filled_hover = config.dark
    ? hsluvToHex([primaryHue, 90 * saturation, 40]) + '55'
    : hsluvToHex([primaryHue, 80 * saturation, 60]) + '44'
  const bg_field_filled_focus = config.dark
    ? hsluvToHex([primaryHue, 90 * saturation, 60]) + '77'
    : hsluvToHex([primaryHue, 90 * saturation, 60]) + '55'

  const bc_field = config.dark
    ? hsluvToHex([primaryHue, 50 * saturation, 80])
    : hsluvToHex([primaryHue, 30 * saturation, 20]) + 'aa'
  const bc_field_focus = config.dark
    ? hsluvToHex([secondHue, 70 * saturation, 85])
    : hsluvToHex([secondHue, Math.min(100, 80 * saturation + 10), 40])
  const bc_field_hover = config.dark
    ? hsluvToHex([primaryHue, 30 * saturation, 95])
    : hsluvToHex([primaryHue, 60 * saturation, 10])

  const filled_focus_label = config.dark
    ? hsluvToHex([secondHue, 70 * saturation, 85]) + 'cc'
    : hsluvToHex([secondHue, Math.min(100, 70 * saturation + 10), 20]) + 'cc'

  const shadow_focus = `0 0 0 0.2rem ${bc_field_focus}44`
  return {
    '--of-bg-sheet': bg,
    '--of-bg-field': bg_field,
    '--of-bg-field-focus': bg_field_focus,
    '--of-bg-field-filled': bg_field_filled,
    '--of-bg-field-filled-hover': bg_field_filled_hover,
    '--of-bg-field-filled-focus': bg_field_filled_focus,
    '--of-border-color-field': bc_field,
    '--of-border-color-field-focus': bc_field_focus,
    '--of-border-color-field-hover': bc_field_hover,
    '--of-box-shadow-field-basic-focus': shadow_focus,
    '--of-color-field': text,
    '--of-color-field-filled': text,
    '--of-color-field-filled-label': label,
    '--of-color-field-label': label,
    '--of-color-field-focus-label': `${bc_field_focus}dd`,
    '--of-color-field-filled-focus-label': filled_focus_label,
    '--of-color-sheet': text,
  }
}

export function useLayout(config?: Config): LayoutState {
  if (!inited) {
    initEvents()
    inited = true
  }
  const mgr = configManager.inject(config)
  return readonlyUnref(mgr)
}
