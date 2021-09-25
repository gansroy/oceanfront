export const parseColor = function (color: string): string | null {
  if (!color || typeof color !== 'string') {
    throw new TypeError('Invalid color value')
  }
  color = color.toLowerCase().replace(/\s/, '')
  if (color === 'transparent') {
    return '#00000000'
  }
  if (/^#[0-9a-f]{3,8}$/.test(color)) {
    if (color.length <= 5) {
      let result =
        '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
      if (color[4] !== undefined && color[4] !== 'f') {
        result += color[4] + color[4]
      }
      return result
    }
    if (color.length === 6 || color.length === 8) {
      color += color[color.length - 1]
    }
    if (color.substring(8) === 'ff') {
      color = color.substring(0, 8)
    }
    return color
  }
  const rgbm = color.match(/^rgba?\((\d+),(\d+),(\d+)(?:,(\d+\.?\d*|\.\d+))\)$/)
  if (rgbm) {
    let result = '#'
    for (let idx = 0; idx < 4; idx++) {
      let val
      if (idx === 3) {
        if (!rgbm[idx]) break
        val = Math.round(255 * parseFloat(rgbm[3]))
        if (val === 255) break
      } else {
        val = parseInt(rgbm[idx] || '255', 10)
      }
      result += (val < 16 ? '0' : '') + val.toString(16)
    }
    return result
  }
  return null
}

let colorCtx: CanvasRenderingContext2D
export const loadColor = function (color: string): string | null {
  if (!color) return null
  let found = parseColor(color)
  if (found) {
    return found
  }
  // try converting html color name or HSL(a)
  color = color.toLowerCase().replace(/\s/, '')
  if (!colorCtx)
    colorCtx = document
      .createElement('canvas')
      .getContext('2d') as CanvasRenderingContext2D
  else {
    // reset any previous input
    colorCtx.fillStyle = '#000'
  }
  colorCtx.fillStyle = color
  found = colorCtx.fillStyle
  if (found === '#000000' && color !== 'black') {
    // probable invalid color (FIXME for hsl(0,0,0))
    throw new TypeError('Invalid color value')
  }
  return parseColor(found)
}

export const rgbToHsv = function (
  r: number,
  g: number,
  b: number
): { h: number; s: number; v: number } {
  r = Math.max(0, Math.min(255, r))
  g = Math.max(0, Math.min(255, g))
  b = Math.max(0, Math.min(255, b))
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  const d = max - min
  const ret = { h: 0, s: max === 0 ? 0 : d / max, v: max / 255 }

  if (d !== 0) {
    let h
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    ret.h = Math.round(h * 60)
  }
  return ret
}

export const hsvToRgb = function (
  h: number,
  s: number,
  v: number
): { r: number; g: number; b: number } {
  let ret

  h = Math.max(0, Math.min(360, h))
  s = Math.max(0, Math.min(1, s))
  v = Math.max(0, Math.min(1, v))

  if (s === 0) {
    ret = { r: v, g: v, b: v }
  } else {
    h /= 60
    const i = Math.floor(h)
    const f = h - i
    const p = v * (1 - s)
    const q = v * (1 - s * f)
    const t = v * (1 - s * (1 - f))

    if (i === 0) ret = { r: v, g: t, b: p }
    else if (i === 1) ret = { r: q, g: v, b: p }
    else if (i === 2) ret = { r: p, g: v, b: t }
    else if (i === 3) ret = { r: p, g: q, b: v }
    else if (i === 4) ret = { r: t, g: p, b: v }
    else ret = { r: v, g: p, b: q }
  }

  ret.r = Math.round(ret.r * 255)
  ret.g = Math.round(ret.g * 255)
  ret.b = Math.round(ret.b * 255)
  return ret
}

export const hsvToHsl = function (
  h: number,
  s: number,
  v: number
): { h: number; s: number; l: number } {
  const l = v - (v * s) / 2
  const m = Math.min(l, 1 - l)
  return { h, s: m ? (v - l) / m : 0, l }
}
