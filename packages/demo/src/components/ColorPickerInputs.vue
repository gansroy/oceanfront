<template>
  <div class="container">
    <h1>Color Picker Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <div class="demo-fields">
      <of-color-field label="Color" v-model:value="colorValue" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

const testColorField = {
  description: 'Field description',
  label: 'Field Label',
  readonly: false,
  required: true,
  labelPosition: 'both',
  inputLabel: 'Input Label',
}

const colorValue = ref({
  h: 240,
  s: 0.9,
  v: 0.7
})

export default defineComponent({
  setup() {
    const sampleCode = `<of-color-field label="Color" v-model:value="colorValue" />`
    return { sampleCode, testColorField, colorValue }
  },
})
</script>
