<template>
  <div class="of-data-table" :style="columnsStyle">
    <div class="of-data-table-header">
      <div v-if="rowsSelector" class="of-data-table-rows-selector">
        <slot name="header-rows-selector">
          <of-button split :items="selectRowsItems" variant="text">
            <of-toggle
              type="toggle"
              variant="basic"
              :checked="headerRowsSelectorChecked"
              @update:checked="onUpdateHeaderRowsSelector"
            />
          </of-button>
        </slot>
        <slot name="header-first-cell" />
      </div>
      <div
        v-for="(col, idx) of columns"
        :class="[
          col.class,
          {
            sortable: col.sort !== false,
            [sort.order]: sort.column === col.value,
          },
        ]"
        :key="idx"
      >
        <span :onclick="col.sort == false ? null : () => onSort(col.value)">
          {{ col.text }}
          <of-icon
            v-if="col.sort !== false"
            :name="
              sort.order == 'desc' && sort.column == col.value
                ? 'bullet down'
                : 'bullet up'
            "
          />
        </span>
      </div>
    </div>
    <div
      class="of-data-table-row"
      v-for="(row, rowidx) of rows"
      :key="rowidx"
      :class="{ selected: rowsRecord.value[row.id] }"
    >
      <div v-if="rowsSelector">
        <slot name="rows-selector" :record="rowsRecord" :item="row">
          <of-toggle
            type="toggle"
            :record="rowsRecord"
            :name="row.id"
            variant="basic"
          />
        </slot>
        <slot name="first-cell" :record="rowsRecord" :item="row" />
      </div>
      <div v-for="(col, colidx) of columns" :class="col.class" :key="colidx">
        <of-data-type :value="row[col.value]"></of-data-type>
      </div>
    </div>
    <template v-if="footerRows.length">
      <div
        class="of-data-table-footer"
        v-for="(row, rowidx) of footerRows"
        :key="rowidx"
      >
        <div :class="{ first: rowidx == 0 }" v-if="rowsSelector">&nbsp;</div>
        <div
          v-for="(col, colidx) of columns"
          :class="[col.class, rowidx == 0 ? 'first' : undefined]"
          :key="colidx"
        >
          <of-format :type="col.format" :value="row[col.value]" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { FormRecord, makeRecord } from '../lib/records'
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

enum RowSortOrders {
  asc = 'asc',
  desc = 'desc',
  noOrder = '',
}

const showSelector = (hasSelector: boolean, rows: any[]): boolean => {
  let issetId = false
  if (rows && rows.hasOwnProperty(0) && rows[0].hasOwnProperty('id')) {
    issetId = true
  }
  return (hasSelector && issetId) ?? false
}

export default defineComponent({
  name: 'OfDataTable',
  // components: { OfFormat },
  props: {
    footerItems: { type: Array, default: () => [] },
    headers: { type: Array, default: () => [] } as any as object &
      PropType<DataTableHeader[]>,
    items: { type: Array, default: () => [] } as any as object &
      PropType<Record<string, any>>,
    itemsCount: [String, Number],
    itemsPerPage: [String, Number],
    page: [String, Number],
    rowsSelector: Boolean,
    resetSelection: Boolean,
  },
  emits: {
    'rows-selected': null,
    'rows-sorted': null,
  },
  setup(props, ctx: SetupContext) {
    const sort = ref({ column: '', order: '' })

    const columns = computed(() => {
      const cols: any[] = []
      for (const hdr of props.headers as DataTableHeader[]) {
        const align = hdr.align
        const cls = ['of--align-' + (align || 'start'), hdr.class]
        if (typeof hdr.sort === 'string') {
          setSort(hdr.value, hdr.sort)
        }
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
    const columnsStyle = computed(() => {
      const selectorWidth = showSelector(props.rowsSelector, rows.value)
        ? 'min-content'
        : ''
      const widths = props.headers
        ?.map((h) => {
          if (!h.width) return 'auto'
          const w = h.width.toString()
          if (w.endsWith('%') || w.match(/^[0-9]+(\.[0-9]*)?$/)) {
            const widthNumber = parseFloat(w)
            if (isNaN(widthNumber)) return 'auto'
            return '' + widthNumber + 'fr'
          }
          return w
        })
        .join(' ')
      return {
        '--of-table-columns': `${selectorWidth} ${widths}`,
      }
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

    const rowsSelector = computed(() =>
      showSelector(props.rowsSelector, rows.value)
    )

    const rowsRecord: ComputedRef<FormRecord> = computed(() => {
      let ids: any = { all: false }
      if (rowsSelector.value) {
        for (const row of rows.value) {
          ids[row.id] = false
        }
      }
      return makeRecord(ids)
    })
    watch(
      () => rowsRecord.value.value,
      (val) => {
        ctx.emit('rows-selected', val)
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
      { key: 'page', text: 'Select Page', value: () => selectRows(RowsSelectorValues.Page) },
      { key: 'all', text: 'Select All', value: () => selectRows(RowsSelectorValues.All) },
      {
        key: 'clear', text: 'Deselect All',
        value: () => selectRows(RowsSelectorValues.DeselectAll),
      },
    ]

    const setSort = function (column: string, order: string) {
      sort.value.order = order
      sort.value.column = column
    }

    const onSort = function (column: string) {
      const order =
        sort.value.order == RowSortOrders.noOrder ||
        sort.value.column !== column
          ? RowSortOrders.asc
          : sort.value.order == RowSortOrders.asc
          ? RowSortOrders.desc
          : RowSortOrders.asc

      setSort(column, order)
      selectRows(RowsSelectorValues.DeselectAll)
      ctx.emit('rows-sorted', sort.value)
    }

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
      columnsStyle,
      onSort,
      sort,
    }
  },
})
</script>
