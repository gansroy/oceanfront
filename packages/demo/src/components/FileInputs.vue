<template>
  <div class="container">
    <h1>File Inputs</h1>
    <div class="row">
      <div class="column">
        <of-highlight lang="html" :value="sampleCode" />
        <br />
        <of-field type="file" label="New file" variant="filled" />
        <br />
        <of-field
          type="file"
          label="Uploaded file"
          :value="{ name: 'myreport.pdf', size: 10204 }"
          variant="basic"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-file-field
  label="File input"
  v-model:value="{name: 'Previous filename', size: 100}"
  variant="filled"
/>`

    return { sampleCode }
  },
})
</script>
