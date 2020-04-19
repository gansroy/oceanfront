import { reactive } from 'vue'
import { Config, ConfigManager, readonlyUnwrap } from '../lib/config'

type WindowRect = {
  scrollX: number
  scrollY: number
  width: number
  height: number
}
const windowRect = reactive<WindowRect>({
  scrollX: 0,
  scrollY: 0,
  width: 0,
  height: 0
})

function initEvents() {
  function onScroll() {
    Object.assign(windowRect, {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight
    })
  }
  window.addEventListener('resize', onScroll, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}
let inited = false

export interface LayoutState {
  readonly mobileBreakpoint: number
  readonly isMobile: boolean
  readonly windowRect: WindowRect
}

class LayoutManager implements LayoutState {
  mobileBreakpoint: number = 1024

  constructor(_config: Config) {}

  get isMobile() {
    return windowRect.width < this.mobileBreakpoint
  }

  get windowRect(): WindowRect {
    return windowRect
  }
}

const configManager = new ConfigManager('oflay', LayoutManager)

export function setMobileBreakpoint(bp: number) {
  let mgr = configManager.activeManager
  if (!mgr) return
  mgr.mobileBreakpoint = bp
}

export function useLayout(config?: Config): LayoutState {
  if (!inited) {
    initEvents()
    inited = true
  }
  const mgr = configManager.inject(config)
  return readonlyUnwrap(mgr)
}
