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

    <div class="row">
      <div class="column">
        <of-data-table
          rows-selector
          @rows-selected="onRowsSelected"
          :headers="headers"
          :items="items2"
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
      { text: 'Name', value: 'name', divider: true, width: '150px' },
      { text: 'Category', value: 'category' },
      { text: 'Size', value: 'size', format: 'number' },
    ]
    const items = [
      { 
        name: 'First item', 
        category: {
          value: 'Category 1',  
          type: 'link',
          data: {
            url: 'https://1crm.com'
          }
        }, 
        size: 15.56 
      },
      { 
        name: 'Second item', 
        category: {
          value: 'Category 2',  
          type: 'link',
          data: {
            url: 'https://1crm.com'
          }
        }, 
        size: -15.56 
      },
      { name: 'Third item', category: 'Category 3', size: 15125.56 },
    ]
    const items2 = [
      { id: '1', name: 'First item', category: 'Category 1', size: 15.56 },
      { id: '2', name: 'Second item', category: 'Category 2', size: -15.56 },
      { id: '3', name: 'Third item', category: 'Category 3', size: 15125.56 },
    ]
    const footerItems = [{ size: 100.5 }]
    const onRowsSelected = function (values: any) {
      console.log(values)
    }
    return {
      headers,
      items,
      items2,
      footerItems,
      onRowsSelected,
    }
  },
})
</script>
