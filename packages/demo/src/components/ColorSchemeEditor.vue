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
                height: '20px',
                width: '12px',
                background: cl.color,
                color: cl.isDark ? '#fff' : '#000',
                'align-items': 'center',
                'justify-content': 'center',
                display: 'flex',
                'font-weight': 'bold',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, Ref } from 'vue'
import tinycolor from 'tinycolor2'

const colors: Ref<{ [k: string]: string }> = ref({
  primary: tinycolor('hsl(189 47% 50%)').toHexString(),
  secondary: tinycolor('hsl(15 83% 50%)').toHexString(),
  tertiary: tinycolor('hsl(34 97% 50%)').toHexString(),
  error: tinycolor('hsl(0 75% 50%)').toHexString(),
  neutral: tinycolor('hsl(80 15% 50%)').toHexString(),
  'neutral-variant': tinycolor('hsl(191 8% 50%)').toHexString(),
})

const ColorSchemeEditor = defineComponent({
  name: 'ColorSchemeEditor',
  setup() {
    const pallettes = computed(() => {
      return Object.keys(colors.value).reduce((acc, name) => {
        const color = colors.value[name]
        const base = tinycolor(color).toHsl()
        acc[name] = [
          0, 2, 8, 10, 12, 18, 20, 22, 28, 30, 32, 38, 40, 42, 48, 50, 52, 58,
          60, 62, 68, 70, 72, 78, 80, 82, 88, 90, 92, 98, 100,
        ].map((l) => {
          base.l = l / 100
          const cl = tinycolor(base)
          return {
            color: cl.toHexString(),
            isDark: cl.isDark(),
            l: l,
          }
        })
        return acc
      }, {} as any)
    })
    watch(
      colors,
      (colors) => {
        debugger
        let style = ''
        Object.keys(colors).forEach((name) => {
          const color = colors[name]
          const hsl = tinycolor(color).toHsl()
          const h = hsl.h
          const s = hsl.s
          style += `--of-pal-${name}-huesat: ${h}, ${
            s * 100
          }%;--of-pal-${name}-hue: ${h}; --of-pal-${name}-sat: ${s * 100}%;`
        })
        const htmlEl = document.body.parentElement
        if (htmlEl) {
          htmlEl.setAttribute('style', style)
        }
      },
      { deep: true }
    )
    const formatName = (name: string): string => {
      return name
        .replaceAll('-', ' ')
        .split(' ')
        .map((s) => {
          return s.substring(0, 1).toUpperCase() + s.substring(1)
        })
        .join(' ')
    }
    return {
      colors,
      pallettes,
      formatName,
    }
  },
})

export default ColorSchemeEditor
</script>
