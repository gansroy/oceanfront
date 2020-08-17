<template>
  <div class="container">
    <h4>Tabs</h4>
    <of-highlight lang="html" :value="sampleCode" />
    <h2>Regular tabs</h2>
    <of-tabs
      :items="testItems"
      v-model:value="selected1"
      variant="standard"
    />
    <h2>Scrolling tabs</h2>
    <of-tabs
      :items="testItems2"
      v-model:value="selected2"
      :scrolling="true"
      variant="standard"
      style="width: 400px;"
    />
    <h2>OSX tabs</h2>
    <of-tabs
      :items="testItems"
      v-model:value="selected3"
      variant="osx"
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
  variant="standard"
/>
<of-tabs
  :items="itemsList2"
  v-model:value="1"
  :scrolling="true"
  style="width: 400px;"
/>
<of-tabs
  :items="itemsList"
  v-model:value="0"
  variant="osx"
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

    const selected3 = 0

    return { sampleCode, testItems, selected1, testItems2, selected2, selected3 }
  },
})
</script>
