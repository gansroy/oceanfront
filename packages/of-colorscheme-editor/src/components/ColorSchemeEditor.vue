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
          const lLimit = getLimit(limits, name, 'lightness', mode)
          const sLimit = getLimit(limits, name, 'saturation', mode)
          acc[name][mode] = shades.reduce((acc, l) => {
            const base = srgb_to_okhsl(
              hex_to_rgb(color) || { r: 0, g: 0, b: 0 }
            )
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
        name.substring(1).replace(/\-/g, ' ')
      )
    }

    const updateColor = (n: any, v: any) => {
      ctx.emit('colorUpdated', n, v)
    }
    return {
      pallettes,
      formatName,
      updateColor,
    }
  },
})

export default ColorSchemeEditor
</script>
