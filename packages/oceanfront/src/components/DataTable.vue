<template>
  <table class="of-data-table">
    <colgroup>
      <col v-if="rowsSelector" />
      <col v-for="(col, idx) of columns" :key="idx" />
    </colgroup>
    <thead>
      <tr>
        <th v-if="rowsSelector" class="of-data-table-rows-selector">
          <slot name="header-rows-selector">
            <of-button
              split
              :items="selectRowsItems"
              :on-click-menu-item="selectRows"
              variant="text"
            >
              <of-toggle
                type="toggle"
                variant="basic"
                :checked="headerRowsSelectorChecked"
                @update:checked="onUpdateHeaderRowsSelector"
              />
            </of-button>
          </slot>
          <slot name="header-first-cell" />
        </th>
        <th v-for="(col, idx) of columns" :class="col.class" :key="idx" :style="{ width: col.width }">
          {{ col.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowidx) of rows" :key="rowidx">
        <td v-if="rowsSelector">
          <slot name="rows-selector" :record="rowsRecord" :item="row">
            <of-toggle
              type="toggle"
              :record="rowsRecord"
              :name="row.id"
              variant="basic"
            />
          </slot>
          <slot name="first-cell" :record="rowsRecord" :item="row" />
        </td>
        <td v-for="(col, colidx) of columns" :class="col.class" :key="colidx">
          <of-data-type 
            :value="row[col.value]" 
            :type="row.types[col.value].type"  
            :data="row.types[col.value].data">
          </of-data-type>
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

enum RowsSelectorValues {
  Page = 'page',
  All = 'all',
  DeselectAll = 'deselect-all',
}

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
    resetSelection: Boolean,
  },
  emits: {
    'rows-selected': null,
  },
  setup(props, _ctx: SetupContext) {
    const columns = computed(() => {
      const cols: any[] = []
      for (const hdr of props.headers as DataTableHeader[]) {
        const align = hdr.align
        const cls = ['of--align-' + (align || 'start'), hdr.class]
        cols.push(Object.assign({}, hdr, { align, class: cls }))
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
        let row = propItems[idx];
        row.types = {};
      
        columns.value.forEach(column => {
          let type = 'text';
          let data = {};
          if(typeof row[column.value] == 'object' && row[column.value] !== null) {
            type = row[column.value].type;
            data = row[column.value].data;
            row[column.value] = row[column.value].value;
          }
          row.types[column.value] = {'type': type, 'data': data};
        });
        result.push(row)
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
        _ctx.emit('rows-selected', updatedRecord.value.value)
      },
      { deep: true }
    )
    watch(
      () => props.resetSelection,
      (val) => {
        if (val) selectRows(RowsSelectorValues.DeselectAll)
      }
    )
    const selectRows = function (val: any) {
      if (!rows.value) return false
      const checked = val == RowsSelectorValues.DeselectAll ? false : true
      headerRowsSelectorChecked.value = checked

      if (val === RowsSelectorValues.All) {
        rowsRecord.value.value[RowsSelectorValues.All] = true
        rowsRecord.value.locked = true
      } else {
        rowsRecord.value.value[RowsSelectorValues.All] = false
        rowsRecord.value.locked = false
      }

      for (const row of rows.value) {
        rowsRecord.value.value[row.id] = checked
      }
    }
    const headerRowsSelectorChecked = ref(false)
    const onUpdateHeaderRowsSelector = function (val: any) {
      let select = val
        ? RowsSelectorValues.Page
        : RowsSelectorValues.DeselectAll
      selectRows(select)
    }
    const selectRowsItems = [
      { text: 'Select Page', value: RowsSelectorValues.Page },
      { special: 'divider' },
      { text: 'Select All', value: RowsSelectorValues.All },
      { special: 'divider' },
      { text: 'Deselect All', value: RowsSelectorValues.DeselectAll },
    ]

    return {
      columns,
      footerRows,
      rows,
      rowsSelector,
      rowsRecord,
      selectRowsItems,
      selectRows,
      onUpdateHeaderRowsSelector,
      headerRowsSelectorChecked,
    }
  },
})
</script>
