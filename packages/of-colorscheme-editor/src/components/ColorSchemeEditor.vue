<template>
  <div v-for="(color, name) in colors" :key="name" class="row content">
    <div class="column" style="max-width: 10em">
      <of-field
        :model-value="colors[name]"
        type="color"
        :label="formatName(name)"
        @update:model-value="(v) => updateColor(name, v)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import {
  hex_to_rgb,
  okhsl_to_srgb,
  rgb_to_hex,
  srgb_to_okhsl,
} from '../lib/colorconversion'

type PaletteEntry = {
  color: string
  isDark: boolean
  l: number
}

const shades = Array.from({ length: 101 }).map((_, idx) => idx)

const getLimit = (limits: any, name: string, type: string, mode: string) => {
  const l = limits[type]
  if (!l) return 1
  const v = l[name]
  if (!v) return 1
  return typeof v === 'number' ? v : v[mode] ?? 1
}

const ColorSchemeEditor = defineComponent({
  name: 'ColorSchemeEditor',
  props: {
    colors: Object,
    limits: Object,
  },
  emits: ['colorUpdated', 'palletteUpdated'],
  setup(props, ctx) {
    const pallettes = computed(() => {
      const limits = props.limits ?? {}
      return Object.keys(props.colors ?? {}).reduce((acc, name) => {
        const color = props.colors?.[name] ?? ''
        acc[name] = {}
        ;['light', 'dark'].forEach((mode) => {
          acc[name][mode] = shades.reduce((acc, l) => {
            const base = srgb_to_okhsl(
              hex_to_rgb(color) || { r: 0, g: 0, b: 0 }
            )
            const lLimit = getLimit(limits, name, 'lightness', mode)
            const sLimit = getLimit(limits, name, 'saturation', mode)
            base.l *= lLimit
            base.s *= sLimit
            base.l = l / 100
            const cl = rgb_to_hex(okhsl_to_srgb(base))
            return {
              ...acc,
              [l]: {
                color: cl,
                isDark: l < 80,
                l: l,
              },
            }
          }, {} as any)
        })
        return acc
      }, {} as { [k: string]: { [k: string]: PaletteEntry } })
    })
    const styles = computed(() => {
      let style = ''
      /*
      style += `--of-color-primary-light: ${pallettes.value['primary'][40].color};\n`
      style += `--of-color-primary-container-light: ${pallettes.value['primary'][90].color};\n`
      style += `--of-color-on-primary-light: ${pallettes.value['primary'][100].color};\n`
      style += `--of-color-on-primary-container-light: ${pallettes.value['primary'][10].color};\n`

      style += `--of-color-secondary-light: ${pallettes.value['secondary'][40].color};\n`
      style += `--of-color-secondary-container-light: ${pallettes.value['secondary'][90].color};\n`
      style += `--of-color-on-secondary-light: ${pallettes.value['secondary'][100].color};\n`
      style += `--of-color-on-secondary-container-light: ${pallettes.value['secondary'][10].color};\n`

      style += `--of-color-tertiary-light: ${pallettes.value['tertiary'][40].color};\n`
      style += `--of-color-tertiary-container-light: ${pallettes.value['tertiary'][90].color};\n`
      style += `--of-color-on-tertiary-light: ${pallettes.value['tertiary'][100].color};\n`
      style += `--of-color-on-tertiary-container-light: ${pallettes.value['tertiary'][10].color};\n`

      style += `--of-color-error-light: #ba1b1b;\n`
      style += `--of-color-on-error-light: #ffffff;\n`
      style += `--of-color-error-container-light: #ffdad4;\n`
      style += `--of-color-on-error-container-light: #410001;\n`

      style += `--of-color-background-light: ${pallettes.value['neutral'][98].color};\n`
      style += `--of-color-on-background-light: ${pallettes.value['neutral'][10].color};\n`

      style += `--of-color-outline-light: ${pallettes.value['neutral'][50].color};\n`
      style += `--of-color-shadow-light: ${pallettes.value['neutral'][0].color};\n`

      style += `--of-color-surface-light: ${pallettes.value['neutral'][95].color};\n`
      style += `--of-color-on-surface-light: ${pallettes.value['neutral'][10].color};\n`

      style += `--of-color-surface-variant-light: ${pallettes.value['neutral'][95].color};\n`
      style += `--of-color-on-surface-variant-light: ${pallettes.value['neutral'][30].color};\n`

      style += `--of-color-inverse-surface-light: ${pallettes.value['neutral'][20].color};\n`
      style += `--of-color-inverse-on-surface-light: ${pallettes.value['neutral'][95].color};\n`

      style += `--of-color-inverse-primary-light: ${pallettes.value['primary'][95].color};\n`
      style += `--of-color-inverse-secondary-light: ${pallettes.value['secondary'][95].color};\n`
      style += `--of-color-inverse-tertiary-light: ${pallettes.value['tertiary'][95].color};\n`

      style += `--of-color-section-border-light: ${pallettes.value['section'][72].color};\n`
      style += `--of-color-section-bg-light: ${pallettes.value['section'][98].color};\n`
      style += `--of-color-section-alt-bg-light: ${pallettes.value['section'][97].color};\n`
      style += `--of-color-section-header-light: ${pallettes.value['section'][95].color};\n`
      style += `--of-color-section-header2-light: ${pallettes.value['section'][93].color};\n`
      style += `--of-color-section-header3-light: ${pallettes.value['section'][91].color};\n`

      // ******************************************************* 
      
      style += `--of-color-primary-dark: ${pallettes.value['primary'][80].color};\n`
      style += `--of-color-primary-container-dark: ${pallettes.value['primary'][30].color};\n`
      style += `--of-color-on-primary-dark: ${pallettes.value['primary'][20].color};\n`
      style += `--of-color-on-primary-container-dark: ${pallettes.value['primary'][90].color};\n`

      style += `--of-color-secondary-dark: ${pallettes.value['secondary'][80].color};\n`
      style += `--of-color-on-secondary-dark: ${pallettes.value['secondary'][30].color};\n`
      style += `--of-color-secondary-container-dark: ${pallettes.value['secondary'][20].color};\n`
      style += `--of-color-on-secondary-container-dark: ${pallettes.value['secondary'][90].color};\n`

      style += `--of-color-tertiary-dark: ${pallettes.value['tertiary'][80].color};\n`
      style += `--of-color-on-tertiary-dark: ${pallettes.value['tertiary'][30].color};\n`
      style += `--of-color-tertiary-container-dark: ${pallettes.value['tertiary'][20].color};\n`
      style += `--of-color-on-tertiary-container-dark: ${pallettes.value['tertiary'][90].color};\n`

      style += `--of-color-error-dark: #ffb4a9;\n`
      style += `--of-color-on-error-dark: #680003;\n`
      style += `--of-color-error-container-dark: #930006;\n`
      style += `--of-color-on-error-container-dark: #ffdad4;\n`
      style += `--of-color-background-dark: ${pallettes.value['neutral'][25].color};\n`
      style += `--of-color-on-background-dark: ${pallettes.value['neutral'][90].color};\n`
      style += `--of-color-outline-dark: ${pallettes.value['neutral'][60].color};\n`
      style += `--of-color-shadow-dark: ${pallettes.value['neutral'][0].color};\n`
      style += `--of-color-surface-dark: ${pallettes.value['neutral'][30].color};\n`
      style += `--of-color-on-surface-dark: ${pallettes.value['neutral'][90].color};\n`
      style += `--of-color-surface-variant-dark: ${pallettes.value['neutral'][30].color};\n`
      style += `--of-color-on-surface-variant-dark: ${pallettes.value['neutral'][80].color};\n`
      style += `--of-color-inverse-surface-dark: ${pallettes.value['neutral'][90].color};\n`
      style += `--of-color-inverse-on-surface-dark: ${pallettes.value['neutral'][20].color};\n`

      style += `--of-color-inverse-primary-dark: ${pallettes.value['primary'][10].color};\n`
      style += `--of-color-inverse-secondary-dark: ${pallettes.value['secondary'][10].color};\n`
      style += `--of-color-inverse-tertiary-dark: ${pallettes.value['tertiary'][10].color};\n`

      style += `--of-color-section-border-dark: ${pallettes.value['section-dark'][60].color};\n`
      style += `--of-color-section-bg-dark: ${pallettes.value['section-dark'][26].color};\n`
      style += `--of-color-section-alt-bg-dark: ${pallettes.value['section-dark'][27].color};\n`
      style += `--of-color-section-header-dark: ${pallettes.value['section-dark'][30].color};\n`
      style += `--of-color-section-header2-dark: ${pallettes.value['section-dark'][32].color};\n`
      style += `--of-color-section-header3-dark: ${pallettes.value['section-dark'][34].color};\n`
*/
      return style
    })

    watch(
      () => pallettes.value,
      (pallettes) => {
        ctx.emit('palletteUpdated', pallettes)
      },
      { immediate: true }
    )

    const formatName = (name: string): string => {
      return (
        name.substring(0, 1).toUpperCase() +
        name.substring(1).replaceAll('-', ' ')
      )
    }

    const updateColor = (n: any, v: any) => {
      ctx.emit('colorUpdated', n, v)
    }
    return {
      pallettes,
      formatName,
      styles,
      updateColor,
    }
  },
})

export default ColorSchemeEditor
</script>
