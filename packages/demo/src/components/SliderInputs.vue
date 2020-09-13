<template>
  <div class="container">
    <h1>Slider Inputs</h1>
    <div class="row">
      <div class="column md-8">
        <of-highlight lang="html" :value="sampleCode" />
        <br />
        <of-field
          :format="{ max: sliderMax, step: 10 }"
          type="slider"
          v-model:value="sliderValue"
          label="Slider input"
        ></of-field>
        <!--of-slider-field
          :max="sliderMax"
          :step="5"
          v-model:value="sliderValue"
          label="Slider input"
        ></of-slider-field>
        <br /><br / -->
        <!-- of-slider-field
          :max="sliderMax"
          :step="10"
          v-model:value="sliderValue"
          variant="outlined"
          label="Slider input"
        ></of-slider-field>
        <br /><br />
        <of-slider-field
          :max="sliderMax"
          :step="10"
          v-model:value="sliderValue"
          variant="filled"
          label="Slider input"
        ></of-slider-field -->
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
  v-model:value="fieldValue"
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
