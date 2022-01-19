import { hsl_to_rgb, rgb_to_hex } from './colorconversion'

export const defaultBaseColors = (): any => {
  return {
    primary: rgb_to_hex(hsl_to_rgb(189 / 360, 0.47, 0.5)),
    secondary: rgb_to_hex(hsl_to_rgb(15 / 360, 0.83, 0.5)),
    tertiary: rgb_to_hex(hsl_to_rgb(227 / 360, 0.97, 0.5)),
    neutral: rgb_to_hex(hsl_to_rgb(80 / 360, 0.06, 0.44)),
    section: rgb_to_hex(hsl_to_rgb(211 / 360, 0.87, 0.53)),
  }
}

export const defaultLimits = {
  lightness: {
    neutral: 0.4,
  },
  saturation: {
    section: { dark: 0.4 },
  },
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const defaultStyles = (pallettes: any): string => {
  let style = ''
  style += `--of-color-primary-light: ${pallettes['primary']['light'][40].color};\n`
  style += `--of-color-primary-container-light: ${pallettes['primary']['light'][90].color};\n`
  style += `--of-color-on-primary-light: ${pallettes['primary']['light'][100].color};\n`
  style += `--of-color-on-primary-container-light: ${pallettes['primary']['light'][10].color};\n`

  style += `--of-color-secondary-light: ${pallettes['secondary']['light'][40].color};\n`
  style += `--of-color-secondary-container-light: ${pallettes['secondary']['light'][90].color};\n`
  style += `--of-color-on-secondary-light: ${pallettes['secondary']['light'][100].color};\n`
  style += `--of-color-on-secondary-container-light: ${pallettes['secondary']['light'][10].color};\n`

  style += `--of-color-tertiary-light: ${pallettes['tertiary']['light'][40].color};\n`
  style += `--of-color-tertiary-container-light: ${pallettes['tertiary']['light'][90].color};\n`
  style += `--of-color-on-tertiary-light: ${pallettes['tertiary']['light'][100].color};\n`
  style += `--of-color-on-tertiary-container-light: ${pallettes['tertiary']['light'][10].color};\n`

  style += `--of-color-error-light: #ba1b1b;\n`
  style += `--of-color-on-error-light: #ffffff;\n`
  style += `--of-color-error-container-light: #ffdad4;\n`
  style += `--of-color-on-error-container-light: #410001;\n`

  style += `--of-color-background-light: ${pallettes['neutral']['light'][98].color};\n`
  style += `--of-color-on-background-light: ${pallettes['neutral']['light'][10].color};\n`

  style += `--of-color-outline-light: ${pallettes['neutral']['light'][50].color};\n`
  style += `--of-color-shadow-light: ${pallettes['neutral']['light'][0].color};\n`

  style += `--of-color-surface-light: ${pallettes['neutral']['light'][95].color};\n`
  style += `--of-color-on-surface-light: ${pallettes['neutral']['light'][10].color};\n`

  style += `--of-color-surface-variant-light: ${pallettes['neutral']['light'][95].color};\n`
  style += `--of-color-on-surface-variant-light: ${pallettes['neutral']['light'][30].color};\n`

  style += `--of-color-inverse-surface-light: ${pallettes['neutral']['light'][20].color};\n`
  style += `--of-color-inverse-on-surface-light: ${pallettes['neutral']['light'][95].color};\n`

  style += `--of-color-inverse-primary-light: ${pallettes['primary']['light'][95].color};\n`
  style += `--of-color-inverse-secondary-light: ${pallettes['secondary']['light'][95].color};\n`
  style += `--of-color-inverse-tertiary-light: ${pallettes['tertiary']['light'][95].color};\n`

  style += `--of-color-section-border-light: ${pallettes['section']['light'][72].color};\n`
  style += `--of-color-section-bg-light: ${pallettes['section']['light'][98].color};\n`
  style += `--of-color-section-alt-bg-light: ${pallettes['section']['light'][97].color};\n`
  style += `--of-color-section-header-light: ${pallettes['section']['light'][95].color};\n`
  style += `--of-color-section-header2-light: ${pallettes['section']['light'][93].color};\n`
  style += `--of-color-section-header3-light: ${pallettes['section']['light'][91].color};\n`

  // *******************************************************

  style += `--of-color-primary-dark: ${pallettes['primary']['dark'][80].color};\n`
  style += `--of-color-primary-container-dark: ${pallettes['primary']['dark'][30].color};\n`
  style += `--of-color-on-primary-dark: ${pallettes['primary']['dark'][20].color};\n`
  style += `--of-color-on-primary-container-dark: ${pallettes['primary']['dark'][90].color};\n`

  style += `--of-color-secondary-dark: ${pallettes['secondary']['dark'][80].color};\n`
  style += `--of-color-on-secondary-dark: ${pallettes['secondary']['dark'][30].color};\n`
  style += `--of-color-secondary-container-dark: ${pallettes['secondary']['dark'][20].color};\n`
  style += `--of-color-on-secondary-container-dark: ${pallettes['secondary']['dark'][90].color};\n`

  style += `--of-color-tertiary-dark: ${pallettes['tertiary']['dark'][80].color};\n`
  style += `--of-color-on-tertiary-dark: ${pallettes['tertiary']['dark'][30].color};\n`
  style += `--of-color-tertiary-container-dark: ${pallettes['tertiary']['dark'][20].color};\n`
  style += `--of-color-on-tertiary-container-dark: ${pallettes['tertiary']['dark'][90].color};\n`

  style += `--of-color-error-dark: #ffb4a9;\n`
  style += `--of-color-on-error-dark: #680003;\n`
  style += `--of-color-error-container-dark: #930006;\n`
  style += `--of-color-on-error-container-dark: #ffdad4;\n`

  style += `--of-color-background-dark: ${pallettes['neutral']['dark'][25].color};\n`
  style += `--of-color-on-background-dark: ${pallettes['neutral']['dark'][90].color};\n`
  style += `--of-color-outline-dark: ${pallettes['neutral']['dark'][60].color};\n`
  style += `--of-color-shadow-dark: ${pallettes['neutral']['dark'][0].color};\n`
  style += `--of-color-surface-dark: ${pallettes['neutral']['dark'][30].color};\n`
  style += `--of-color-on-surface-dark: ${pallettes['neutral']['dark'][90].color};\n`
  style += `--of-color-surface-variant-dark: ${pallettes['neutral']['dark'][30].color};\n`
  style += `--of-color-on-surface-variant-dark: ${pallettes['neutral']['dark'][80].color};\n`
  style += `--of-color-inverse-surface-dark: ${pallettes['neutral']['dark'][90].color};\n`
  style += `--of-color-inverse-on-surface-dark: ${pallettes['neutral']['dark'][20].color};\n`

  style += `--of-color-inverse-primary-dark: ${pallettes['primary']['dark'][10].color};\n`
  style += `--of-color-inverse-secondary-dark: ${pallettes['secondary']['dark'][10].color};\n`
  style += `--of-color-inverse-tertiary-dark: ${pallettes['tertiary']['dark'][10].color};\n`

  style += `--of-color-section-border-dark: ${pallettes['section']['dark'][60].color};\n`
  style += `--of-color-section-bg-dark: ${pallettes['section']['dark'][26].color};\n`
  style += `--of-color-section-alt-bg-dark: ${pallettes['section']['dark'][27].color};\n`
  style += `--of-color-section-header-dark: ${pallettes['section']['dark'][30].color};\n`
  style += `--of-color-section-header2-dark: ${pallettes['section']['dark'][32].color};\n`
  style += `--of-color-section-header3-dark: ${pallettes['section']['dark'][34].color};\n`

  return style
}
