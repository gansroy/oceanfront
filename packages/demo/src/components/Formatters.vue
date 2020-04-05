<template>
  <div class="container">
    <h1>Value Formatters</h1>

    <div class="row">
      <div class="column">
        <of-text-field
          style="width: 10em"
          format="number"
          v-model="inputValue"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, nextTick } from 'vue'

export default defineComponent({
  setup() {
    const inputValue = ref(100125.99)
    const sampleCode = `
<of-text-field
  label="Field Label"
  v-model="fieldValue"
  variant="filled"
/>`
    return {
      sampleCode,
      inputValue
    }
  }
})
</script>
