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
      { text: 'Size', value: 'size', align: 'end' },
    ]
    const items = [
      { 
        name: { 
          value: 'First item' 
        }, 
        category: {
          value: 'Category 1',
          format: 'link',
          params: {
            href: 'https://1crm.com'
          }
        }, 
        size: {
          value: 15.56,  
          format: 'currency',
          params: {
            symbol: '&#36;'
          }
        }, 
      },
      { 
        name: { 
          value: 'Second item' 
        }, 
        category: {
          value: 'Category 2',
          format: 'link',
          params: {
            to: 'tabs'
          }
        }, 
        size: {
          value: -15.56,  
          type: 'currency',
          data: {
            symbol: '&#36;'
          }
        }, 
      },
      { 
        name: { 
          value: 'Third item' 
        }, 
        category: {
          value: 'Category 3'
        }, 
        size: { 
          value: 15125.56 
        }
      },
    ]

    const items2 = [
      { 
        id: { 
          value: '1' 
        }, 
        name: { 
          value: 'First item'
        }, 
        category: { 
          value: 'Category 1' 
        }, 
        size: { 
          value: 15.56 
        },  
      },
      { 
        id: { 
          value: '2' 
        }, 
        name: { 
          value: 'Second item'
        }, 
        category: { 
          value: 'Category 2' 
        }, 
        size: { 
          value: -15.56 
        },  
      },
      { 
        id: { 
          value: '3' 
        }, 
        name: { 
          value: 'Third item'
        }, 
        category: { 
          value: 'Category 3' 
        }, 
        size: { 
          value: 15125.56 
        },  
      },
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
