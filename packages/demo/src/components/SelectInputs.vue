<template>
  <div class="container">
    <h1>Select Inputs</h1>
    <div class="row">
      <div class="column">
        <of-highlight lang="html" :value="sampleCode" />
        <br />
        <of-select
          label="Select input"
          value="Selected"
          variant="basic"
        ></of-select>
        <br /><br />
        <of-select
          label="Select input"
          value="Selected"
          variant="outlined"
        ></of-select>
        <br /><br />
        <of-select
          label="Select input"
          value="Selected"
          variant="filled"
        ></of-select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-select
  label="Select input"
  value="Selected"
  variant="filled"
/>`
    return { sampleCode }
  }
})
</script>
