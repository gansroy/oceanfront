<template>
  <div class="container">
    <h1>Color Picker Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <div class="demo-fields">
      <div class="row form-row">
        <div class="column">
          <of-color-field label="Color" v-model="colorValue" frame="none" />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-color-field
            label="Color"
            v-model="colorValue"
            frame="none"
            variant="filled"
          />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-color-field label="Color" v-model="colorValue" />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-color-field label="Color" v-model="colorValue" variant="filled" />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-color-field label="Color" v-model="colorValue" frame="block" />
        </div>
      </div>
      <div class="row form-row">
        <div class="column">
          <of-color-field
            label="Color"
            v-model="colorValue"
            frame="block"
            variant="filled"
          />
        </div>
      </div>
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
  v: 0.7,
})

export default defineComponent({
  setup() {
    const sampleCode = `<of-color-field label="Color" v-model="colorValue" />`
    return { sampleCode, testColorField, colorValue }
  },
})
</script>
