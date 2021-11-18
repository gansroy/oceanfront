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
          @rows-sorted="onItems2Sorted"
          :headers="headers2"
          :items="items2"
          :footer-items="footerItems"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const headers = [
      { text: 'Name', value: 'name', divider: true, width: '150px', sort: false },
      { text: 'Category', value: 'category', sort: false },
      { text: 'Size', value: 'size', align: 'end', sort: false },
    ]
    const items = [
      {
        name: 'First item',
        category: {
          value: 'Category 1',
          format: 'link',
          params: {
            href: 'https://1crm.com',
          },
        },
        size: {
          value: 15.56,
          format: 'currency',
          params: {
            symbol: '&#36;',
          },
        },
      },
      {
        name: 'Second item',
        category: {
          value: 'Category 2',
          format: 'link',
          params: {
            to: 'tabs',
          },
        },
        size: {
          value: -15.56,
          format: 'currency',
          params: {
            symbol: '&#36;',
          },
        },
      },
      {
        name: 'Third item',
        category: 'Category 3',
        size: 15125.56,
      },
    ]

    const headers2 = [
      { text: 'Name', value: 'name', divider: true, width: '150px', sort: 'desc' },
      { text: 'Category', value: 'category', sort: false },
      { text: 'Size', value: 'size', align: 'end' },
    ]
    const items2 = ref([
      {
        id: '1',
        name: 'First item',
        category: 'Category 1',
        size: 15.56,
      },
      {
        id: '2',
        name: 'Second item',
        category: 'Category 2',
        size: -15.56,
      },
      {
        id: '3',
        name: 'Third item',
        category: 'Category 3',
        size: 15125.56,
      },
      {
        id: '4',
        name: 'Fourth item',
        category: 'Category 3',
        size: 45.56,
      },
    ])

    const initialItems2 = [...items2.value]
    const footerItems = [{ size: 100.5 }]
    const onRowsSelected = function (values: any) {
      console.log(values)
    }

    const onItems2Sorted = function (sort: { column: string; order: string }) {
      if (sort.order == '') {
        items2.value = [...initialItems2]
      } else {
        if (sort.column == 'size') {
          items2.value.sort((a, b) => (a.size > b.size ? 1 : -1))
        } else {
          items2.value.sort(function (x, y) {
            let a = x[sort.column as keyof typeof y].toString().toUpperCase(),
              b = y[sort.column as keyof typeof y].toString().toUpperCase()
            return a == b ? 0 : a > b ? 1 : -1
          })
        }
        if (sort.order == 'desc') {
          items2.value.reverse()
        }
      }
    }

    return {
      headers,
      headers2,
      items,
      items2,
      footerItems,
      onRowsSelected,
      onItems2Sorted,
    }
  },
})
</script>
