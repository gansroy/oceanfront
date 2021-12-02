<template>
  <div class="container">
    <h1>Tabs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <h2>Regular tabs</h2>
    <of-tabs
      :items="testItems"
      v-model="selected1"
      variant="standard"
      @select-tab="selectTab"
    />
    <h2>Tabs with submenu</h2>
    <of-tabs
      :items="testItems5"
      submenu
      v-model="selected5"
      variant="standard"
      @select-tab="selectTab"
    />
    <h2>Scrolling tabs</h2>
    <of-tabs
      :items="testItems2"
      v-model="selected2"
      :scrolling="true"
      variant="standard"
      style="width: 400px"
    />
    <h2>Tabs with overflow button</h2>
    <of-tabs
      :items="testItems3"
      v-model="selected3"
      overflow-button
      variant="standard"
      style="width: 400px"
      @select-tab="selectTab"
    />
    <h2>OSX tabs</h2>
    <of-tabs :items="testItems4" v-model="selected4" variant="osx" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Tab } from 'oceanfront/src/lib/tab'

export default defineComponent({
  setup() {
    const sampleCode = `
<of-tabs
  :items="itemsList"
  v-model="selItem"
  variant="standard"
  @select-tab="selectTab"
/>
<of-tabs
  :items="itemsList"
  v-model="selItem"
  variant="standard"
  submenu
/>
<of-tabs
  :items="itemsList2"
  v-model="selItem"
  :scrolling="true"
  style="width: 400px;"
/>
<of-tabs
  :items="itemsList3"
  v-model="selItem"
  overflow-buttton
  style="width: 400px;"
/>
<of-tabs
  :items="itemsList"
  v-model="selItem"
  variant="osx"
/>
`

    const testItems = [
      'Tab 1',
      'Tab 2',
      'Tab 3',
      {
        text: 'Tab 4',
        params: { module: 'Test', layout: 'Standard' },
      },
    ]

    const testItems2 = [
      'Tab 1',
      'Tab 2',
      'Tab 3',
      'Tab 4',
      'Tab 5',
      { text: 'Tab 6' },
      'Tab 7',
      'Tab 8',
    ]

    const testItems3 = [
      'Tab 1',
      'Tab 2',
      'Tab 3',
      { text: 'Tab 4', icon: 'led red' },
      'Tab 5',
      { text: 'Tab 6' },
      'Tab 7',
      'Tab 8',
      'Tab 9',
      { text: 'Tab 10', icon: 'led blue' },
    ]

    const testItems4 = [
      'Tab 1',
      'Tab 2',
      'Tab 3',
      { text: 'Tab 4' },
      { text: 'Tab 5' },
    ]

    const testItems5 = [
      {
        text: 'Tab 1',
        subMenuItems: [
          { text: 'SubMenu Tab11', icon: 'led blue' },
          { text: 'SubMenu Tab12', icon: 'led red' },
        ],
      },
      {
        text: 'Tab 2',
        subMenuItems: [{ text: 'SubMenu Tab21' }, { text: 'SubMenu Tab22' }],
      },
      {
        text: 'Tab 3',
        subMenuItems: [
          { text: 'SubMenu Tab31' },
          { text: 'SubMenu Tab32' },
          { text: 'SubMenu Tab33' },
        ],
      },
    ]

    const selected1 = ref(0)
    const selected2 = ref(1)
    const selected3 = ref(0)
    const selected4 = ref(0)
    const selected5 = ref(0)

    const selectTab = function (tab: Tab) {
      console.log(tab)
    }

    return {
      sampleCode,
      selectTab,

      testItems,
      selected1,

      testItems2,
      selected2,

      testItems3,
      selected3,

      testItems4,
      selected4,

      testItems5,
      selected5,
    }
  },
})
</script>
