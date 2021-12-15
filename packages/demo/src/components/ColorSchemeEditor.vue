<template>
  <div class="container">
    <h1>Color scheme editor</h1>
    <div v-for="(color, name) in colors" :key="name" class="row content">
      <div class="column" style="max-width: 10em">
        <of-field
          v-model="colors[name]"
          type="color"
          :label="formatName(name)"
        />
      </div>
      <div style="width: 2em"></div>
      <div class="column">
        &nbsp;
        <div style="border: solid 1px #fff; display: flex; width: fit-content">
          <div
            style="border: solid 1px #000; display: flex; width: fit-content"
          >
            <div
              v-for="(cl, idx) in pallettes[name]"
              :key="idx"
              :style="{
                height: '30px',
                width: '3px',
                background: cl.color,
                'align-items': 'center',
                'justify-content': 'center',
                display: 'flex',
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <of-highlight lang="css" :value="styles" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue'
import tinycolor from 'tinycolor2'
import { hexToHsluv, hsluvToHex } from 'hsluv'

const colors: Ref<{ [k: string]: string }> = ref({
  primary: tinycolor('hsl(189 47% 50%)').toHexString(),
  secondary: tinycolor('hsl(15 83% 50%)').toHexString(),
  tertiary: tinycolor('hsl(34 97% 50%)').toHexString(),
  neutral: tinycolor('hsl(80 15% 50%)').toHexString(),
  'neutral-variant': tinycolor('hsl(191 8% 50%)').toHexString(),
})

type PaletteEntry = {
  color: string
  isDark: boolean
  l: number
}

const limits: { [k: string]: number } = {
  neutral: 0.4,
  'neutral-variant': 0.4,
}

const shades = Array.from({ length: 101 }).map((_, idx) => idx)

const ColorSchemeEditor = defineComponent({
  name: 'ColorSchemeEditor',
  setup() {
    const pallettes = computed(() => {
      return Object.keys(colors.value).reduce((acc, name) => {
        const color = colors.value[name]
        const base = hexToHsluv(color)
        base[1] *= limits[name] ?? 1
        acc[name] = shades.reduce((acc, l) => {
          base[2] = l
          const cl = hsluvToHex(base)
          return {
            ...acc,
            [l]: {
              color: cl,
              isDark: l < 80,
              l: l,
            },
          }
        }, {} as any)
        return acc
      }, {} as { [k: string]: { [k: string]: PaletteEntry } })
    })
    const styles = computed(() => {
      let style = ''
      Object.keys(pallettes.value).forEach((name) => {
        const pal = pallettes.value[name]
        Object.entries(pal).forEach(([_, _col]) => {
          //style += `--of-color-${name}-${col.l}: ${col.color};`
        })
      })

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

      style += `--of-color-outline-light: ${pallettes.value['neutral-variant'][50].color};\n`
      style += `--of-color-shadow-light: ${pallettes.value['neutral'][0].color};\n`

      style += `--of-color-surface-light: ${pallettes.value['neutral'][95].color};\n`
      style += `--of-color-on-surface-light: ${pallettes.value['neutral'][10].color};\n`

      style += `--of-color-surface-variant-light: ${pallettes.value['neutral-variant'][95].color};\n`
      style += `--of-color-on-surface-variant-light: ${pallettes.value['neutral-variant'][30].color};\n`

      style += `--of-color-inverse-surface-light: ${pallettes.value['neutral'][20].color};\n`
      style += `--of-color-inverse-on-surface-light: ${pallettes.value['neutral'][95].color};\n`

      style += `--of-color-inverse-primary-light: ${pallettes.value['primary'][95].color};\n`
      style += `--of-color-inverse-secondary-light: ${pallettes.value['secondary'][95].color};\n`
      style += `--of-color-inverse-tertiary-light: ${pallettes.value['tertiary'][95].color};\n`

      /******************************************************* */
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
      style += `--of-color-background-dark: ${pallettes.value['neutral'][10].color};\n`
      style += `--of-color-on-background-dark: ${pallettes.value['neutral'][90].color};\n`
      style += `--of-color-outline-dark: ${pallettes.value['neutral-variant'][60].color};\n`
      style += `--of-color-shadow-dark: ${pallettes.value['neutral'][40].color};\n`
      style += `--of-color-surface-dark: ${pallettes.value['neutral'][20].color};\n`
      style += `--of-color-on-surface-dark: ${pallettes.value['neutral'][90].color};\n`
      style += `--of-color-surface-variant-dark: ${pallettes.value['neutral-variant'][30].color};\n`
      style += `--of-color-on-surface-variant-dark: ${pallettes.value['neutral-variant'][80].color};\n`
      style += `--of-color-inverse-surface-dark: ${pallettes.value['neutral'][90].color};\n`
      style += `--of-color-inverse-on-surface-dark: ${pallettes.value['neutral'][20].color};\n`

      style += `--of-color-inverse-primary-dark: ${pallettes.value['primary'][10].color};\n`
      style += `--of-color-inverse-secondary-dark: ${pallettes.value['secondary'][10].color};\n`
      style += `--of-color-inverse-tertiary-dark: ${pallettes.value['tertiary'][10].color};\n`

      const htmlEl = document.body.parentElement
      if (htmlEl) {
        htmlEl.setAttribute('style', style)
      }

      return style
    })
    const colors2 = computed(() => {
      return Object.keys(colors.value).reduce((acc, name) => {
        const color = colors.value[name]
        acc[name] = hexToHsluv(color)
        return acc
      }, {} as any)
    })

    const formatName = (name: string): string => {
      return (
        name.substring(0, 1).toUpperCase() +
        name.substring(1).replaceAll('-', ' ')
      )
    }
    return {
      colors,
      pallettes,
      formatName,
      colors2,
      styles,
    }
  },
})

export default ColorSchemeEditor
</script>
