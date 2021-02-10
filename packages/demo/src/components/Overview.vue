<template>
  <div class="container">
    <h1>Oceanfront User Interface Library</h1>
    <div class="row">
      <h2>Lightweight and Flexible</h2>
      <ul class="col2">
        <li>
          The library does not include general page layout rules or
          element-based selectors, allowing it to be mixed in with other
          frameworks and keeping the size to a minimum. Visual styles are easily
          overridden, and multiple basic styles can be used to create themes
          consistent with various platforms.
        </li>
        <li>
          Components are reused across the framework, allowing for input fields
          to adapt to a variety of containers and configuration settings. Custom
          field types only need to be defined once.
        </li>
      </ul>
    </div>
    <div class="row">
      <h2>Future Facing</h2>
      <ul>
        <li>
          Built on Typescript and Vue 3, and taking advantage of newer CSS
          features offered by the current generation of web browsers.
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DemoOverview',
})
</script>

<style scoped>
.row h2 {
  display: flex;
}
@media (min-width: 800px) {
  .row ul {
    display: flex;
    padding: 0;
  }
  .row li {
    list-style: none;
    padding: 0;
  }
  .col2 li {
    width: 48%;
  }
  .col2 li:not(:first-child) {
    margin-left: 4%;
  }
}
</style>
