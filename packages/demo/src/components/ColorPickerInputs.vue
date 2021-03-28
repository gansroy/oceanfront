<template>
  <div class="container">
    <h1>Color Picker Inputs</h1>
    <div class="demo-fields">
      <!-- <of-highlight lang="html" :value="sampleCode" /> -->
      <of-color-field label="Color" v-model:value="inputValue" />
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

const inputValue = ref('20 20 20')

export default defineComponent({
  setup() {
    const sampleCode = ``
    return { sampleCode, testColorField, inputValue }
  },
})
</script>
