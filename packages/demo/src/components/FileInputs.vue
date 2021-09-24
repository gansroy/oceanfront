<template>
  <div class="container">
    <h1>File Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />

    <of-demo-field>
      <template #default="props">
        <of-field
          type="file"
          label="Uploaded file"
          :model-value="{ name: 'myreport.pdf', size: 10204 }"
          size="30"
          v-bind="props"
        />
      </template>
    </of-demo-field>
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
/>`

    return { sampleCode }
  },
})
</script>
