<template>
  <table class="of-data-table">
    <colgroup>
      <col v-for="col of columns" />
    </colgroup>
    <thead>
      <tr>
        <th v-for="col of columns" :class="col.class">
          {{ col.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row of rows">
        <td v-for="col of columns" :class="col.class">
          <of-format :type="col.format" :value="row[col.value]" />
        </td>
      </tr>
    </tbody>
    <tfoot v-if="footerRows.length">
      <tr v-for="row of footerRows">
        <td v-for="col of columns" :class="col.class">
          <of-format :type="col.format" :value="row[col.value]" />
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { DataTableHeader } from '../lib/datatable'
import { useFormats } from '../lib/format'
import OfFormat from './Format'

export default defineComponent({
  name: 'of-data-table',
  components: { OfFormat },
  props: {
    footerItems: { type: Array, default: [] },
    headers: { type: Array, default: [] },
    items: { type: Array, default: [] },
    itemsPerPage: [String, Number],
    page: [String, Number],
    serverItemsLength: [String, Number]
  },
  setup(props, ctx) {
    const fmtMgr = useFormats()
    const columns = computed(() => {
      const cols: any[] = []
      for (const hdr of props.headers as DataTableHeader[]) {
        const format = fmtMgr.getFormatter(hdr.format)
        const align = hdr.align || (format && format.align)
        const cls = ['of--text-' + (align || 'start'), hdr.class]
        cols.push(Object.assign({}, hdr, { format, align, class: cls }))
      }
      return cols
    })
    const perPage = computed(() => parseInt(props.itemsPerPage as string) || 10)
    const page = ref(0)
    const pageCount = computed(() => {
      return Math.ceil(props.items.length / perPage.value) // FIXME adjust for server-loaded
    })
    watch(
      () => props.page,
      p => (page.value = parseInt(p as string, 10) || 1), // FIXME check in range
      { immediate: true }
    )
    const startIndex = computed(() => {
      return Math.max(0, perPage.value * (page.value - 1)) // FIXME start at 0 for server-loaded
    })
    const rows = computed(() => {
      const result = []
      let count = perPage.value
      let propItems = props.items
      for (
        let idx = startIndex.value;
        count > 0 && idx < propItems.length;
        idx++
      ) {
        result.push(propItems[idx])
      }
      return result
    })
    const footerRows = computed(() => {
      return props.footerItems
    })
    return {
      columns,
      footerRows,
      rows
    }
  }
})
</script>
