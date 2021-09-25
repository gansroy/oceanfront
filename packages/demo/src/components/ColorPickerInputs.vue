<template>
  <div class="container">
    <h1>Color Picker Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />

    <of-demo-field>
      <template #default="props">
        <of-field
          type="color"
          label="Color Field"
          v-model="colorValue"
          v-bind="props"
        />
      </template>
    </of-demo-field>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

const colorValue = ref({
  h: 240,
  s: 0.33,
  v: 0.72,
})

export default defineComponent({
  setup() {
    const sampleCode = `
<of-color-field
  label="Color"
  v-model="colorValue"
/>`
    return { sampleCode, colorValue }
  },
})
</script>
