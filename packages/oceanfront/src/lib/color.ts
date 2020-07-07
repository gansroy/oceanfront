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
  if (!colorCtx) colorCtx = document.createElement('canvas').getContext('2d')!
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
