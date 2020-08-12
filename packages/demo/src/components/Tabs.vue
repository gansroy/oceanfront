<template>
  <div class="container">
    <h4>Tabs</h4>
    <of-highlight lang="html" :value="sampleCode" />
    <h2>Regular tabs</h2>
    <of-tabs
      :items="testItems"
    ></of-tabs>
    <h2>Scrolling tabs</h2>
    <of-tabs
      :items="testItems2"
      style="width: 400px;"
    ></of-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-tabs
  :items="itemsList"
/>`

    const testItems = [
      'Tab 1',
      'Tab 2',
      'Tab 3'
    ]

    const testItems2 = [
      'Tab 1',
      'Tab 2',
      'Tab 3',
      'Tab 4',
      'Tab 5',
      'Tab 6',
      'Tab 7',
      'Tab 8',
    ]

    return { sampleCode, testItems, testItems2 }
  },
})
</script>
