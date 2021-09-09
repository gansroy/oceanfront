<template>
  <div class="container">
    <h1>Slider Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <div class="demo-fields">
      <div class="row form-row">
        <of-slider-field
          :max="sliderMax"
          :step="5"
          v-model="sliderValue"
          plain
        ></of-slider-field>
      </div>
      <div class="row form-row">
        <of-slider-field
          :max="sliderMax"
          :step="5"
          v-model="sliderValue"
          plain
          variant="filled"
        ></of-slider-field>
      </div>
      <div class="row form-row">
        <of-slider-field
          :max="sliderMax"
          :step="5"
          v-model="sliderValue"
          label="Slider input"
        ></of-slider-field>
      </div>
      <div class="row form-row">
        <of-slider-field
          :max="sliderMax"
          :step="10"
          v-model="sliderValue"
          variant="outlined"
          label="Slider input"
        ></of-slider-field>
      </div>
      <div class="row form-row">
        <of-slider-field
          :max="sliderMax"
          :step="15"
          v-model="sliderValue"
          variant="filled"
          label="Slider input"
        ></of-slider-field>
      </div>
      <div class="row form-row">
        Output: <of-format type="number" :value="sliderValue"></of-format>
      </div>
    </div>
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
  variant="filled"
/>`
    return {
      sampleCode,
      sliderValue,
      sliderMax,
    }
  },
})
</script>
