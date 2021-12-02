<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline-->
  <div
    role="menu"
    class="of-menu of-datepicker-popup"
    :class="{ 'with-time': withTime, 'with-date': withDate }"
    tabindex="0"
    :onVnodeMounted="mounted"
    :onVnodeUnmounted="unmounted"
  >
    <div class="of-date-picker-title" v-if="withDate && !withoutTitle">
      {{ title }}
    </div>
    <div class="of-datepicker-selectors" @selectstart.prevent="">
      <div class="of-datepicker-grid" v-if="withDate">
        <div class="of-datepicker-nav-button prev" :onclick="prevMonth">
          <of-icon name="arrow left" />
        </div>
        <div
          v-if="!editingYear"
          class="of-date-picker-cur-year"
          :onclick="() => editYear(true)"
        >
          {{ monthYear }}
        </div>
        <input
          v-if="editingYear"
          class="of-date-picker-cur-year"
          type="text"
          size="4"
          maxlength="4"
          :onblur="() => editYear(false)"
          :onVnodeMounted="focusYearInput"
          :onkeydown="yearInputHandler"
          :value="selMonthStart.getFullYear()"
        />
        <div class="of-datepicker-nav-button next" :onclick="nextMonth">
          <of-icon name="arrow right" />
        </div>

        <div
          v-for="cell in cells"
          :key="cell.date.toString()"
          class="picker-date"
          :class="{
            'other-month': cell.otherMonth,
            'selected-date': checkSelected?.(cell) || false,
            today: cell.today,
          }"
          :onclick="cell.otherMonth ? null : () => selectDate(cell.date)"
        >
          {{ cell.date.getDate() }}
        </div>
      </div>
      <div class="of-time-selector" v-if="withTime">
        <div />
        <div />
        <div />
        <div />
        <div />

        <div />
        <of-icon
          @mousedown="timeClickHandler('h', 1)"
          @mouseup="timeClickHandler()"
          @mouseleave="timeClickHandler()"
          name="bullet up"
          size="lg"
          class="time-picker-arrow"
        />
        <div />
        <of-icon
          @mousedown="timeClickHandler('m', 1)"
          @mouseup="timeClickHandler()"
          @mouseleave="timeClickHandler()"
          name="bullet up"
          size="lg"
          class="time-picker-arrow"
        />
        <div />

        <div />
        <div class="time-value">{{ hours }}</div>
        <div class="time-value">:</div>
        <div class="time-value">{{ minutes }}</div>
        <div />

        <div />
        <of-icon
          @mousedown="timeClickHandler('h', -1)"
          @mouseup="timeClickHandler()"
          @mouseleave="timeClickHandler()"
          name="bullet down"
          size="lg"
          class="time-picker-arrow"
        />
        <div />
        <of-icon
          @mousedown="timeClickHandler('m', -1)"
          @mouseup="timeClickHandler()"
          @mouseleave="timeClickHandler()"
          name="bullet down"
          size="lg"
          class="time-picker-arrow"
        />
        <div />

        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
    <div class="of-date-picker-buttons" v-if="useButtons">
      <div class="of-date-picker-button accept" :onclick="onAccept">Accept</div>
      <div class="of-date-picker-button cancel" :onclick="onCancel">Cancel</div>
    </div>
  </div>
</template>

<script lang="ts">
import { expand } from 'src/formats/DateTime'
import {
  monthGrid,
  MonthGridCell,
  nextMonth as _nextMonth,
  prevMonth as _prevMonth,
  sameDate,
} from 'src/lib/datetime'
import { useFormats } from 'src/lib/formats'
import { defineComponent, SetupContext, computed, ref, VNode } from 'vue'

export default defineComponent({
  name: 'OfDateTimePopup',
  inheritAttrs: false,
  props: {
    id: String,
    withTime: Boolean,
    withDate: Boolean,
    date: Date,
    monthStart: Date,
    isSelected: Function,
    accept: Function,
    withoutTitle: Boolean,
  },
  setup(props, _ctx: SetupContext) {
    let theNode: VNode | null
    const selDate = ref(props.date ?? new Date())
    const selMonthStart = ref(props.monthStart || selDate.value)
    const editingYear = ref(false)

    const formatMgr = useFormats()
    const titleFormat = formatMgr.getTextFormatter('datetime', {
      nativeOptions: {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      },
    })
    const monthFormat = formatMgr.getTextFormatter('date', {
      nativeOptions: { month: 'short', year: 'numeric' },
    })

    const selectDate = (selected: Date) => {
      const date = new Date(selDate.value.valueOf())
      date.setFullYear(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      )
      if (props.withTime) selDate.value = date
      else props.accept?.(date)
    }

    const focusYearInput = (vn: VNode) => {
      const el = vn.el as HTMLInputElement
      el.focus()
      el.setSelectionRange(0, 999999)
    }

    const isSelected = (cell: MonthGridCell) =>
      sameDate(selDate.value, cell.date)

    const nextMonth = () => {
      selMonthStart.value = _nextMonth(selMonthStart.value)
    }
    const prevMonth = () => {
      selMonthStart.value = _prevMonth(selMonthStart.value)
    }
    const editYear = (on: boolean) => {
      editingYear.value = on
    }

    const yearInputHandler = (e: KeyboardEvent) => {
      if (e.key == 'Escape') {
        editingYear.value = false
        e.stopPropagation()
        if (theNode) theNode.el?.focus()
      }
      if (e.key == 'Enter') {
        const el = e.target as HTMLInputElement
        const maybeYear = parseInt(el.value)
        if (isNaN(maybeYear) || maybeYear < 1) return
        const date = new Date(selMonthStart.value.valueOf())
        date.setFullYear(maybeYear)
        selMonthStart.value = date
        editingYear.value = false
        if (theNode) theNode.el?.focus()
      }
    }

    const updateTime = (which: 'h' | 'm', delta: number) => {
      const date = new Date(selDate.value.valueOf())
      let value = which == 'h' ? date.getHours() : date.getMinutes()
      const limit = which == 'h' ? 23 : 59
      value += delta
      if (value < 0) value = limit
      if (value > limit) value = 0
      const _ = which == 'h' ? date.setHours(value) : date.setMinutes(value)
      selDate.value = date
    }

    let timeout: number | undefined
    let interval: number | undefined

    const periodicTimeUpdate = (which: 'h' | 'm', delta: number) => () => {
      updateTime(which, delta)
    }
    const initialTimeUpdate = (which: 'h' | 'm', delta: number) => () => {
      updateTime(which, delta)
      interval = window.setInterval(periodicTimeUpdate(which, delta), 100)
    }

    const timeClickHandler = (which?: 'h' | 'm', delta?: number) => {
      if (timeout) window.clearTimeout(timeout)
      if (interval) window.clearInterval(interval)
      interval = timeout = undefined
      if (which == undefined || delta == undefined) return
      updateTime(which, delta)
      timeout = window.setTimeout(initialTimeUpdate(which, delta), 500)
    }

    return {
      selMonthStart,
      useButtons: props.withTime,

      selectDate,
      checkSelected: computed(() => props.isSelected || isSelected),
      nextMonth,
      prevMonth,
      editYear,
      yearInputHandler,
      timeClickHandler,
      focusYearInput,
      updateTime,
      onAccept: () => props.accept?.(selDate.value),
      onCancel: () => props.accept?.(),

      title: computed(() => titleFormat?.format(selDate.value).textValue),
      monthYear: computed(
        () => monthFormat?.format(selMonthStart.value).textValue
      ),
      hours: computed(() => expand(selDate.value.getHours(), 2)),
      minutes: computed(() => expand(selDate.value.getMinutes(), 2)),
      editingYear,

      cells: computed(() => {
        const gridData = monthGrid(selMonthStart.value)
        return gridData.grid.reduce((items, value) => {
          items.push(...value)
          return items
        }, [])
      }),

      mounted: (vnode: VNode) => {
        theNode = vnode
      },
      unmounted: () => {
        theNode = null
      },
    }
  },
})
</script>
