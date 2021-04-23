<template>
  <table class="of-data-table">
    <colgroup>
      <col v-if="rowsSelector" />
      <col v-for="(col, idx) of columns" :key="idx" />
    </colgroup>
    <thead>
      <tr>
        <th v-if="rowsSelector">
          <of-button
            icon="accept"
            rounded
            split
            :items="selectRowsItems"
            :on-click-menu-item="selectRows"
            >Select</of-button
          >
        </th>
        <th v-for="(col, idx) of columns" :class="col.class" :key="idx">
          {{ col.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowidx) of rows" :key="rowidx">
        <td v-if="rowsSelector">
          <slot name="row-selector">
            <of-toggle
              type="toggle"
              :record="rowsRecord"
              :name="row.id"
              variant="basic"
            />
          </slot>
        </td>
        <td v-for="(col, colidx) of columns" :class="col.class" :key="colidx">
          <!-- of-format :type="col.format" :value="row[col.value]" / -->
          {{ row[col.value] }}
        </td>
      </tr>
    </tbody>
    <tfoot v-if="footerRows.length">
      <tr v-for="(row, rowidx) of footerRows" :key="rowidx">
        <td v-if="rowsSelector">&nbsp;</td>
        <td v-for="(col, colidx) of columns" :class="col.class" :key="colidx">
          <of-format :type="col.format" :value="row[col.value]" />
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { FieldRecord, makeRecord } from '../lib/records'
import {
  computed,
  defineComponent,
  ref,
  watch,
  PropType,
  SetupContext,
  ComputedRef,
} from 'vue'
import { DataTableHeader } from '../lib/datatable'
import { useFormats } from '../lib/formats'
// import OfFormat from './Format'

export default defineComponent({
  name: 'OfDataTable',
  // components: { OfFormat },
  props: {
    footerItems: { type: Array, default: () => [] },
    headers: ({ type: Array, default: () => [] } as any) as object &
      PropType<DataTableHeader[]>,
    items: ({ type: Array, default: () => [] } as any) as object &
      PropType<Record<string, any>>,
    itemsCount: [String, Number],
    itemsPerPage: [String, Number],
    page: [String, Number],
    rowsSelector: Boolean,
  },
  emits: {
    'rows-selected': null,
  },
  setup(props, _ctx: SetupContext) {
    const fmtMgr = useFormats()
    const columns = computed(() => {
      const cols: any[] = []
      for (const hdr of props.headers as DataTableHeader[]) {
        const format = fmtMgr.getTextFormatter(hdr.format)
        const align = hdr.align || (format && format.align)
        const cls = ['of--align-' + (align || 'start'), hdr.class]
        cols.push(Object.assign({}, hdr, { format, align, class: cls }))
      }
      return cols
    })
    const perPage = computed(
      () => parseInt(props.itemsPerPage as any, 10) || 10
    )
    const page = ref(0)
    const pageCount = computed(() => {
      let count = parseInt(props.itemsCount ?? props.items?.length, 10) || 0
      return Math.ceil(count / perPage.value)
    })
    watch(
      () => props.page,
      (p) => (page.value = parseInt(p as string, 10) || 1), // FIXME check in range
      { immediate: true }
    )
    const iterStart = computed(() => {
      if (props.itemsCount != null) return 0 // external navigation
      return Math.max(0, perPage.value * (page.value - 1))
    })
    const rows = computed(() => {
      const result = []
      let count = perPage.value
      let propItems = props.items || []
      for (
        let idx = iterStart.value;
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
    const rowsSelector = computed(() => {
      let issetId = false
      if (
        rows.value &&
        rows.value.hasOwnProperty(0) &&
        rows.value[0].hasOwnProperty('id')
      ) {
        issetId = true
      }
      return (props.rowsSelector && issetId) ?? false
    })
    const rowsRecord: ComputedRef<FieldRecord> = computed(() => {
      let ids: any = { all: false }
      if (rowsSelector.value) {
        for (const row of rows.value) {
          ids[row.id] = false
        }
      }
      return makeRecord(ids)
    })
    watch(
      () => rowsRecord,
      (updatedRecord) => {
        console.log(updatedRecord.value)
        console.log(rowsRecord.value.value['all'])
        _ctx.emit('rows-selected', updatedRecord.value)
      },
      { deep: true }
    )
    const selectRows = function (val: any) {
      if (!rows.value) return false
      const checked = val == 'deselect-all' ? false : true

      if (val === 'all') {
        rowsRecord.value.value['all'] = true
        rowsRecord.value.locked = true
      } else {
        rowsRecord.value.value['all'] = false
        rowsRecord.value.locked = false
      }

      for (const row of rows.value) {
        rowsRecord.value.value[row.id] = checked
      }
    }
    const selectRowsItems = [
      { text: 'Select Page', value: 'page' },
      { special: 'divider' },
      { text: 'Select All', value: 'all' },
      { special: 'divider' },
      { text: 'Deselect All', value: 'deselect-all' },
    ]

    return {
      columns,
      footerRows,
      rows,
      rowsSelector,
      rowsRecord,
      selectRowsItems,
      selectRows,
    }
  },
})
</script>
