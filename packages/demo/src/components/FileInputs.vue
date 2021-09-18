<template>
  <div class="container">
    <h1>File Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <div class="demo-fields">
      <div class="row form-row">
        <of-field
          type="file"
          label="Uploaded file"
          :model-value="{ name: 'myreport.pdf', size: 10204 }"
          size="30"
          frame="none"
        />
      </div>
      <div class="row form-row">
        <of-field
          type="file"
          label="Uploaded file"
          :model-value="{ name: 'myreport.pdf', size: 10204 }"
          size="30"
          frame="none"
          variant="filled"
        />
      </div>
      <div class="row form-row">
        <of-field
          type="file"
          label="Uploaded file"
          :model-value="{ name: 'myreport.pdf', size: 10204 }"
          size="30"
        />
      </div>
      <div class="row form-row">
        <of-field
          type="file"
          label="Uploaded file"
          :model-value="{ name: 'myreport.pdf', size: 10204 }"
          size="30"
          variant="filled"
        />
      </div>
      <div class="row form-row">
        <of-field type="file" label="Outlined" size="30" frame="block" />
      </div>
      <div class="row form-row">
        <of-field
          type="file"
          label="Filled"
          frame="block"
          variant="filled"
          size="30"
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
  :model-value="{name: 'Previous filename', size: 100}"
  variant="filled"
/>`

    return { sampleCode }
  },
})
</script>
