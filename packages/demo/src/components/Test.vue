<template>
  <of-field type="color" v-model="color" />
  <br />
  <div style="display: flex; justify-content: center">
    <div style="border: solid 1px #000; display: flex">
      <div
        v-for="(cl, idx) in pallette"
        :key="idx"
        :style="{
          height: '64px',
          width: '64px',
          background: cl.color,
          color: cl.isDark ? '#fff' : '#000',
          'align-items': 'center',
          'justify-content': 'center',
          display: 'flex',
          'font-weight': 'bold'
        }"
      >
      <of-icon name="accept" size="input"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import tinycolor from 'tinycolor2'

const Test = defineComponent({
  name: 'Test',
  setup() {
    const color = ref('#CCCCCC')
    const pallette = computed(() => {
      const base = tinycolor(color.value).toHsl()
      return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 100].map((l) => {
        base.l = l / 100
        const cl = tinycolor(base)
        return {
          color: cl.toHexString(),
          isDark: cl.isDark(),
          l: l,
        }
      })
    })
    return {
      color,
      pallette,
    }
  },
})

export default Test
</script>
