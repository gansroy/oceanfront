<template>
  <div class="container">
    <h1>Picker Inputs</h1>
    <h2>Date &amp; Time</h2>
    <of-highlight lang="html" :value="sampleCode" />
    <br />
    <div class="row">
      <div class="column md-8"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const testCheckField = {
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Field Label',
  placeholder: 'placeholder',
  readonly: false,
  required: true,
  labelPosition: 'both',
  inputLabel: 'Input Label',
}

export default defineComponent({
  setup() {
    const sampleCode = `
`
    return { sampleCode, testCheckField }
  },
})
</script>
