<template>
  <div class="container">
    <h4>Tabs</h4>
    <of-highlight lang="html" :value="sampleCode" />
    <h2>Regular tabs</h2>
    <of-tabs>
      <of-tab name="Tab 1">
        <h4>Tab 1 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 2">
        <h4>Tab 2 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 3">
        <h4>Tab 3 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 4">
        <h4>Tab 4 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 5">
        <h4>Tab 5 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 6">
        <h4>Tab 6 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 7">
        <h4>Tab 7 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
    </of-tabs>
    <h2>Scrolling tabs</h2>
    <of-tabs style="width: 400px;">
      <of-tab name="Tab 1">
        <h4>Tab 1 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 2">
        <h4>Tab 2 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 3">
        <h4>Tab 3 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 4">
        <h4>Tab 4 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 5">
        <h4>Tab 5 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 6">
        <h4>Tab 6 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
      <of-tab name="Tab 7">
        <h4>Tab 7 content</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          consequuntur.
        </p>
      </of-tab>
    </of-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const sampleCode = `<of-tabs>
    <of-tab name="Tab 1">
      <h4>Tab 1 content</h4>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
        consequuntur.
      </p>
    </of-tab>
    <of-tab name="Tab 2">
      <h4>Tab 1 content</h4>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
        consequuntur.
      </p>
    </of-tab>
</of-tabs>
`
    return { sampleCode }
  },
})
</script>
