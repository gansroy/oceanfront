<template>
  <div class="container">
    <h1>Color scheme editor</h1>
    <div class="row content">
      <div class="column spaced" style="max-width: 15em">
        <div style="padding: 0 1rem">
          <h2>Source colors</h2>
          <div v-for="(color, name) in colors" :key="name" class="row content">
            <div class="column" style="max-width: 10em">
              <of-field
                v-model="colors[name]"
                type="color"
                :label="formatName(name)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="column spaced">
        <div style="padding: 0 1rem">
          <h2>Application color palette</h2>
          <div class="palette-grid of--elevated-2" :style="styles">
            <div class="primary">Primary</div>
            <div class="on-primary">On Primary</div>
            <div class="primary-container">Primary Container</div>
            <div class="on-primary-container">On Primary Container</div>
            <div class="secondary">Secondary</div>
            <div class="on-secondary">On Secondary</div>
            <div class="secondary-container">Secondary Container</div>
            <div class="on-secondary-container">On Secondary Container</div>
            <div class="tertiary">Tertiary</div>
            <div class="on-tertiary">On Tertiary</div>
            <div class="tertiary-container">Tertiary Container</div>
            <div class="on-tertiary-container">On Tertiary Container</div>
            <div class="error">Error</div>
            <div class="on-error">On Error</div>
            <div class="error-container">Error Container</div>
            <div class="on-error-container">On Error Container</div>
            <div class="background">Background</div>
            <div class="on-background">On Background</div>
            <div class="surface">Surface</div>
            <div class="on-surface">On Surface</div>
            <div class="surface-variant">Surface Variant</div>
            <div class="on-surface-variant">On Surface Variant</div>
            <div class="inverse-surface">Inverse Surface</div>
            <div class="inverse-on-surface">Inverse On Surface</div>
            <div class="outline">Outline</div>
            <div class="shadow">Shadow</div>
            <div class="inverse-primary">Inverse Primary</div>
            <div class="inverse-secondary">Inverse Secondary</div>
            <div class="inverse-tertiary">Inverse Tertiary</div>
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

      const styleEl = document.querySelector('style#color-scheme')
      if (styleEl) {
        ;(styleEl as HTMLElement).innerText = `:root {${style}}`
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
  mounted() {
    if (!document.querySelector('style#color-scheme')) {
      const style = document.createElement('style')
      style.id = 'color-scheme'
      document.head.append(style)
    }
  },
})

export default ColorSchemeEditor
</script>

<style lang="scss" scoped>
.palette-grid {
  display: grid;
  font-size: 65%;
  max-width: 60em;
  grid-template-columns: repeat(4, minmax(50px, 1fr));
  border-radius: 4px;
  overflow: hidden;
  & div {
    padding: 0.4rem;
    font-weight: bold;
  }
  & .primary {
    background: var(--of-color-primary);
    color: var(--of-color-on-primary);
  }
  & .on-primary {
    color: var(--of-color-primary);
    background: var(--of-color-on-primary);
  }
  & .primary-container {
    background: var(--of-color-primary-container);
    color: var(--of-color-on-primary-container);
  }
  & .on-primary-container {
    color: var(--of-color-primary-container);
    background: var(--of-color-on-primary-container);
  }
  & .secondary {
    background: var(--of-color-secondary);
    color: var(--of-color-on-secondary);
  }
  & .on-secondary {
    color: var(--of-color-secondary);
    background: var(--of-color-on-secondary);
  }
  & .secondary-container {
    background: var(--of-color-secondary-container);
    color: var(--of-color-on-secondary-container);
  }
  & .on-secondary-container {
    color: var(--of-color-secondary-container);
    background: var(--of-color-on-secondary-container);
  }
  & .tertiary {
    background: var(--of-color-tertiary);
    color: var(--of-color-on-tertiary);
  }
  & .on-tertiary {
    color: var(--of-color-tertiary);
    background: var(--of-color-on-tertiary);
  }
  & .tertiary-container {
    background: var(--of-color-tertiary-container);
    color: var(--of-color-on-tertiary-container);
  }
  & .on-tertiary-container {
    color: var(--of-color-tertiary-container);
    background: var(--of-color-on-tertiary-container);
  }
  & .error {
    background: var(--of-color-error);
    color: var(--of-color-on-error);
  }
  & .on-error {
    color: var(--of-color-error);
    background: var(--of-color-on-error);
  }
  & .error-container {
    background: var(--of-color-error-container);
    color: var(--of-color-on-error-container);
  }
  & .on-error-container {
    color: var(--of-color-error-container);
    background: var(--of-color-on-error-container);
  }
  & .background {
    background: var(--of-color-background);
    color: var(--of-color-on-background);
  }
  & .on-background {
    color: var(--of-color-background);
    background: var(--of-color-on-background);
  }
  & .surface {
    background: var(--of-color-surface);
    color: var(--of-color-on-surface);
  }
  & .on-surface {
    color: var(--of-color-surface);
    background: var(--of-color-on-surface);
  }
  & .outline {
    grid-column-start: 1;
    grid-column-end: 3;
    background: var(--of-color-outline);
    color: var(--of-color-on-background);
  }
  & .surface-variant {
    background: var(--of-color-surface-variant);
    color: var(--of-color-on-surface-variant);
  }
  & .on-surface-variant {
    color: var(--of-color-surface-variant);
    background: var(--of-color-on-surface-variant);
  }
  & .shadow {
    grid-column-start: 3;
    grid-column-end: 5;
    color: var(--of-color-background);
    background: var(--of-color-shadow);
  }
  & .inverse-surface {
    background: var(--of-color-inverse-surface);
    color: var(--of-color-inverse-on-surface);
  }
  & .inverse-on-surface {
    color: var(--of-color-inverse-surface);
    background: var(--of-color-inverse-on-surface);
  }
  & .inverse-primary {
    grid-column-start: 1;
    grid-column-end: 3;
    color: var(--of-color-primary);
    background: var(--of-color-inverse-primary);
  }
  & .inverse-secondary {
    color: var(--of-color-secondary);
    background: var(--of-color-inverse-secondary);
  }
  & .inverse-tertiary {
    color: var(--of-color-tertiary);
    background: var(--of-color-inverse-tertiary);
  }
}
</style>
