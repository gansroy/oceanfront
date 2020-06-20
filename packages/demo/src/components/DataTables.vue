<template>
  <div class="container">
    <h1>Data Tables</h1>

    <div class="row">
      <div class="column">
        <of-data-table
          :headers="headers"
          :items="items"
          :footer-items="footerItems"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const headers = [
      { text: 'Name', value: 'name', divider: true },
      { text: 'Category', value: 'category' },
      { text: 'Size', value: 'size', format: 'number' },
    ]
    const items = [
      { name: 'First item', category: 'Category 1', size: 15.56 },
      { name: 'Second item', category: 'Category 2', size: -15.56 },
      { name: 'Third item', category: 'Category 3', size: 15125.56 },
    ]
    const footerItems = [{ size: 100.5 }]
    return {
      headers,
      items,
      footerItems,
    }
  },
})
</script>
