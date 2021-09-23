export const hsvToRgb = (
  h: number,
  s: number,
  v: number
): { r: number; g: number; b: number } => {
  let r, g, b

  h = Math.max(0, Math.min(360, h))
  s = Math.max(0, Math.min(1, s))
  v = Math.max(0, Math.min(1, v))

  if (s !== 0) {
    h /= 60
    const i = Math.floor(h)
    const f = h - i
    const p = v * (1 - s)
    const q = v * (1 - s * f)
    const t = v * (1 - s * (1 - f))

    switch (i) {
      case 0:
        r = v
        g = t
        b = p
        break
      case 1:
        r = q
        g = v
        b = p
        break
      case 2:
        r = p
        g = v
        b = t
        break
      case 3:
        r = p
        g = q
        b = v
        break
      case 4:
        r = t
        g = p
        b = v
        break
      default:
        r = v
        g = p
        b = q
    }
  } else {
    r = g = b = v
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export interface DragEventOptions {
  drag?: (event: Event) => void
  start?: (event: Event) => void
  end?: (event: Event) => void
}

export const triggerDragEvent = (
  element: HTMLElement,
  options: DragEventOptions
): void => {
  let isDragging = false

  const moveFn = function (event: Event) {
    options.drag?.(event)
  }

  const upFn = (event: Event) => {
    document.removeEventListener('mousemove', moveFn)
    document.removeEventListener('mouseup', upFn)
    document.onselectstart = null
    document.ondragstart = null

    isDragging = false

    options.end?.(event)
  }

  element.addEventListener('mousedown', (event) => {
    if (isDragging) return
    document.onselectstart = () => false
    document.ondragstart = () => false
    document.addEventListener('mousemove', moveFn)
    document.addEventListener('mouseup', upFn)
    isDragging = true
    options.start?.(event)
  })
}
