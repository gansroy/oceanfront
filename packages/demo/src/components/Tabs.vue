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
    <h2>Tabs with overflow button</h2>
    <of-tabs
      :items="testItems3"
      v-model:value="selected3"
      overflow-button
      variant="standard"
      style="width: 400px;"
    />
    <h2>OSX tabs</h2>
    <of-tabs
      :items="testItems4"
      v-model:value="selected4"
      variant="osx"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

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
  :items="itemsList3"
  v-model:value="0"
  overflow-buttton
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

    const testItems2 = [
      'Tab 1',
      'Tab 2',
      'Tab 3',
      'Tab 4',
      'Tab 5',
      {text: 'Tab 6'},
      'Tab 7',
      'Tab 8'
    ]

    const testItems3 = [
      'Tab 1',
      'Tab 2',
      'Tab 3',
      'Tab 4',
      'Tab 5',
      {text: 'Tab 6'},
      'Tab 7',
      'Tab 8',
      'Tab 9',
      {text: 'Tab 10'},
      'Today&#039;s Activities'

    ]

    const testItems4 = [
      'Tab 1',
      'Tab 2',
      'Tab 3',
      {text: 'Tab 4'},
      {text: 'Tab 5'}
    ]

    const selected1 = ref(0)
    const selected2 = ref(1)
    const selected3 = ref(0)
    const selected4 = ref(0)

    return { sampleCode, testItems, selected1, testItems2, selected2, testItems3, selected3, testItems4, selected4 }
  },
})
</script>
