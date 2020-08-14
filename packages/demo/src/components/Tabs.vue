<template>
  <div class="container">
    <h4>Tabs</h4>
    <of-highlight lang="html" :value="sampleCode" />
    <h2>Regular tabs</h2>
    <of-tabs
      :items="testItems"
      v-model:value="selected1"
    />
    <h2>Scrolling tabs</h2>
    <of-tabs
      :items="testItems2"
      v-model:value="selected2"
      :scrolling="true"
      style="width: 400px;"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-tabs
  :items="itemsList"
  v-model:value="0"
/>
<of-tabs
  :items="itemsList2"
  v-model:value="1"
  :scrolling="true"
  style="width: 400px;"
/>
`

    const testItems = [
      'Tab 1',
      'Tab 2',
      'Tab 3',
      {text: 'Tab 4'}
    ]

    const selected1 = 0

    const testItems2 = [
      'Tab 1',
      'Tab 2',
      'Tab 3',
      'Tab 4',
      'Tab 5',
      {text: 'Tab 6'},
      'Tab 7',
      'Tab 8',
    ]

    const selected2 = 1

    return { sampleCode, testItems, selected1, testItems2, selected2 }
  },
})
</script>
