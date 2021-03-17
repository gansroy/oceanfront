<template>
  <!-- eslint-disable vue/singleline-html-element-content-newline-->
  <div
    role="menu"
    class="of-menu of-datepicker-popup"
    :class="{ 'with-time': withTime }"
    tabindex="0"
    :onVnodeMounted="mounted"
    :onVnodeUnmounted="unmounted"
  >
    <div class="of-date-picker-title">
      {{ title }}
    </div>
    <div class="of-datepicker-selectors" @selectstart.prevent="">
      <div class="of-datepicker-grid">
        <div class="of-datepicker-nav-button prev" :onclick="prevMonth">
          <of-icon name="arrow-left" />
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
          :value="monthStart.getFullYear()"
        />
        <div class="of-datepicker-nav-button next" :onclick="nextMonth">
          <of-icon name="arrow-right" />
        </div>

        <div
          v-for="cell in cells"
          :key="cell.date.toString()"
          class="picker-date"
          :class="{
            'other-month': cell.otherMonth,
            'selected-date': isSelected?.(cell) || false,
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
          name="triangle-up"
          size="lg"
          class="time-picker-arrow"
        />
        <div />
        <of-icon
          @mousedown="timeClickHandler('m', 1)"
          @mouseup="timeClickHandler()"
          @mouseleave="timeClickHandler()"
          name="triangle-up"
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
          name="triangle-down"
          size="lg"
          class="time-picker-arrow"
        />
        <div />
        <of-icon
          @mousedown="timeClickHandler('m', -1)"
          @mouseup="timeClickHandler()"
          @mouseleave="timeClickHandler()"
          name="triangle-down"
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
      <div class="of-date-picker-button accept" :onclick="accept">Accept</div>
      <div class="of-date-picker-button cancel" :onclick="cancel">Cancel</div>
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
    date: Object,
    monthStart: Object,
    isSelected: Function,
    accept: Function,
  },
  setup(props, _ctx: SetupContext) {
    let theNode: VNode | null
    const selectedDate = ref((props.date ?? new Date()) as Date)
    const monthStart = ref(props.monthStart as Date)
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
    const monthFormat = formatMgr.getTextFormatter('datetime', {
      nativeOptions: { month: 'short', year: 'numeric' },
    })

    const selectDate = (selected: Date) => {
      const date = new Date(selectedDate.value.valueOf())
      date.setFullYear(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      )
      if (props.withTime) selectedDate.value = date
      else props.accept?.(date)
    }

    const focusYearInput = (vn: VNode) => {
      const el = vn.el as HTMLInputElement
      el.focus()
      el.setSelectionRange(0, 999999)
    }

    const isSelected = (cell: MonthGridCell) =>
      sameDate(selectedDate.value, cell.date)

    const nextMonth = () => {
      monthStart.value = _nextMonth(monthStart.value)
    }
    const prevMonth = () => {
      monthStart.value = _prevMonth(monthStart.value)
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
        const date = new Date(monthStart.value.valueOf())
        date.setFullYear(maybeYear)
        monthStart.value = date
        editingYear.value = false
        if (theNode) theNode.el?.focus()
      }
    }

    const updateTime = (which: 'h' | 'm', delta: number) => {
      const date = new Date(selectedDate.value.valueOf())
      let value = which == 'h' ? date.getHours() : date.getMinutes()
      const limit = which == 'h' ? 23 : 59
      value += delta
      if (value < 0) value = limit
      if (value > limit) value = 0
      const _ = which == 'h' ? date.setHours(value) : date.setMinutes(value)
      selectedDate.value = date
    }

    let timeout: number | undefined
    let interval: number | undefined

    const periodicTimeUpdate = (which: 'h' | 'm', delta: number) => () => {
      updateTime(which, delta)
    }
    const initialTimeUpdate = (which: 'h' | 'm', delta: number) => () => {
      updateTime(which, delta)
      interval = setInterval(periodicTimeUpdate(which, delta), 100)
    }

    const timeClickHandler = (which?: 'h' | 'm', delta?: number) => {
      if (timeout) window.clearTimeout(timeout)
      if (interval) window.clearInterval(interval)
      interval = timeout = undefined
      if (which == undefined || delta == undefined) return
      updateTime(which, delta)
      timeout = setTimeout(initialTimeUpdate(which, delta), 500)
    }

    return {
      id: computed(() => props.id),
      withTime: computed(() => props.withTime),
      isSelected: computed(() => props.isSelected ?? isSelected),
      monthStart,
      useButtons: props.withTime,

      selectDate,
      nextMonth,
      prevMonth,
      editYear,
      yearInputHandler,
      timeClickHandler,
      focusYearInput,
      updateTime,
      accept: () => props.accept?.(selectedDate.value),
      cancel: () => props.accept?.(),

      title: computed(() => titleFormat?.format(selectedDate.value).textValue),
      monthYear: computed(
        () => monthFormat?.format(monthStart.value).textValue
      ),
      hours: computed(() => expand(selectedDate.value.getHours(), 2)),
      minutes: computed(() => expand(selectedDate.value.getMinutes(), 2)),
      editingYear,

      cells: computed(() => {
        const gridData = monthGrid(monthStart.value)
        return gridData.grid.reduce((items, value) => {
          items.push(...value)
          return items
        }, [])
      }),

      mounted(vnode: VNode) {
        theNode = vnode
      },
      unmounted() {
        theNode = null
      },
    }
  },
})
</script>