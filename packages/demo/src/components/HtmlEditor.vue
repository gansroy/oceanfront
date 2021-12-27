<template>
  <div class="container">
    <h1>HTML Editor</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <hr />
    <of-html-editor />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `<of-html-editor />`

    return {
      sampleCode,
    }
  },
})
</script>
