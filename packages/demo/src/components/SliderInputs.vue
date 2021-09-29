<template>
  <div class="container">
    <h1>Slider Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />

    <of-demo-field>
      <template #default="props">
        <of-slider-field
          :max="sliderMax"
          :step="5"
          :label="'Test Slider (' + sliderValue + ')'"
          v-model="sliderValue"
          v-bind="props"
        ></of-slider-field>
      </template>
    </of-demo-field>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const sliderValue = ref(62)
    const sliderMax = 150
    const sampleCode = `
<of-slider-field
  label="Field Label"
  :min="0"
  :max="100"
  :step="5"
  v-model="fieldValue"
/>`
    return {
      sampleCode,
      sliderValue,
      sliderMax,
    }
  },
})
</script>
