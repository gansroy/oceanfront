<template>
  <div class="container">
    <h1>HTML Editor</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <hr />
    <of-html-editor v-model="content" @updated="updated" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const content = ref('<code>Oceanfront is the best UI lib!</code>')
    const sampleCode = `
<of-html-editor v-model="content" />
<of-html-editor :record="record" name="description" />`

    const updated = (val: any) => {
      console.log(val)
    }

    return {
      sampleCode,
      content,
      updated,
    }
  },
})
</script>
