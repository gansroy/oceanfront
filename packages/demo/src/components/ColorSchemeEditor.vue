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
                width: '30px',
                background: cl.color,
                'font-size': '65%',
                'font-weight': 'bolder',
                color: cl.isDark ? '#fff' : '#000',
                'align-items': 'center',
                'justify-content': 'center',
                display: 'flex',
              }"
            >
              {{ idx }}
            </div>
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
const ColorSchemeEditor = defineComponent({
  name: 'ColorSchemeEditor',
  setup() {
    const pallettes = computed(() => {
      return Object.keys(colors.value).reduce((acc, name) => {
        const color = colors.value[name]
        const base = hexToHsluv(color)
        acc[name] = [
          0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 100,
        ].reduce((acc, l) => {
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
          //style += `--of-palette-${name}-${col.l}: ${col.color};`
        })
      })

      style += `--of-palette-primary: ${pallettes.value['primary'][40].color};\n`
      style += `--of-palette-primary-container: ${pallettes.value['primary'][90].color};\n`
      style += `--of-palette-on-primary: ${pallettes.value['primary'][100].color};\n`
      style += `--of-palette-on-primary-container: ${pallettes.value['primary'][10].color};\n`

      style += `--of-palette-secondary: ${pallettes.value['secondary'][40].color};\n`
      style += `--of-palette-secondary-container: ${pallettes.value['secondary'][90].color};\n`
      style += `--of-palette-on-secondary: ${pallettes.value['secondary'][100].color};\n`
      style += `--of-palette-on-secondary-container: ${pallettes.value['secondary'][10].color};\n`

      style += `--of-palette-tertiary: ${pallettes.value['tertiary'][40].color};\n`
      style += `--of-palette-tertiary-container: ${pallettes.value['tertiary'][90].color};\n`
      style += `--of-palette-on-tertiary: ${pallettes.value['tertiary'][100].color};\n`
      style += `--of-palette-on-tertiary-container: ${pallettes.value['tertiary'][10].color};\n`

      style += `--of-palette-error: #ba1b1b;\n`
      style += `--of-palette-on-error: #ffffff;\n`
      style += `--of-palette-error-container: #ffdad4;\n`
      style += `--of-palette-on-error-container: #410001;\n`
      style += `--of-palette-background: ${pallettes.value['neutral'][98].color};\n`
      style += `--of-palette-on-background: ${pallettes.value['neutral'][10].color};\n`
      style += `--of-palette-outline: ${pallettes.value['neutral-variant'][50].color};\n`
      style += `--of-palette-surface: ${pallettes.value['neutral'][98].color};\n`
      style += `--of-palette-on-surface: ${pallettes.value['neutral'][10].color};\n`
      style += `--of-palette-surface-variant: ${pallettes.value['neutral-variant'][90].color};\n`
      style += `--of-palette-on-surface-variant: ${pallettes.value['neutral-variant'][30].color};\n`

      /******************************************************* */
      style += `--of-palette-primary-dark: ${pallettes.value['primary'][80].color};\n`
      style += `--of-palette-primary-container-dark: ${pallettes.value['primary'][30].color};\n`
      style += `--of-palette-on-primary-dark: ${pallettes.value['primary'][20].color};\n`
      style += `--of-palette-on-primary-container-dark: ${pallettes.value['primary'][90].color};\n`

      style += `--of-palette-secondary-dark: ${pallettes.value['secondary'][80].color};\n`
      style += `--of-palette-on-secondary-dark: ${pallettes.value['secondary'][30].color};\n`
      style += `--of-palette-secondary-container-dark: ${pallettes.value['secondary'][20].color};\n`
      style += `--of-palette-on-secondary-container-dark: ${pallettes.value['secondary'][90].color};\n`

      style += `--of-palette-tertiary-dark: ${pallettes.value['tertiary'][80].color};\n`
      style += `--of-palette-on-tertiary-dark: ${pallettes.value['tertiary'][30].color};\n`
      style += `--of-palette-tertiary-container-dark: ${pallettes.value['tertiary'][20].color};\n`
      style += `--of-palette-on-tertiary-container-dark: ${pallettes.value['tertiary'][90].color};\n`

      style += `--of-palette-error-dark: #ffb4a9;\n`
      style += `--of-palette-on-error-dark: #680003;\n`
      style += `--of-palette-error-container-dark: #930006;\n`
      style += `--of-palette-on-error-container-dark: #ffdad4;\n`
      style += `--of-palette-background-dark: ${pallettes.value['neutral'][10].color};\n`
      style += `--of-palette-on-background-dark: ${pallettes.value['neutral'][90].color};\n`
      style += `--of-palette-outline-dark: ${pallettes.value['neutral-variant'][60].color};\n`
      style += `--of-palette-surface-dark: ${pallettes.value['neutral'][10].color};\n`
      style += `--of-palette-on-surface-dark: ${pallettes.value['neutral'][90].color};\n`
      style += `--of-palette-surface-variant-dark: ${pallettes.value['neutral-variant'][30].color};\n`
      style += `--of-palette-on-surface-variant-dark: ${pallettes.value['neutral-variant'][80].color};\n`

      /*
        const htmlEl = document.body.parentElement
        if (htmlEl) {
          htmlEl.setAttribute('style', style)
        }
        */
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
