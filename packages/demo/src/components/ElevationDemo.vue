<template>
  <div class="container">
    <div
      class="elevation-demo"
      :class="`of--elevated-${e}`"
      v-for="e in elevations"
      :key="e"
    >
      <span>Elevation {{ e }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `
`

    const elevations = ['1', '2', '3', '4', '5']
    return {
      elevations,
      sampleCode,
    }
  },
})
</script>

<style lang="scss">
.spaced {
  > * {
    margin-right: 1em;
    margin-bottom: 0.5em;
  }
}
.elevation-demo {
  background-color: var(--of-color-surface);
  border-radius: 0.25rem;
  margin-top: 2rem;
  padding: 1rem;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
