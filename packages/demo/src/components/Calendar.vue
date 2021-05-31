<template>
  <div class="container">
    <p>
      <of-select-field
        :items="types"
        :record="state"
        name="type"
      ></of-select-field>
      <of-select-field
        :items="['columns', 'stack']"
        :record="state"
        name="layout"
      ></of-select-field>
      <of-toggle-field name="useSlots" label="Use slots" :record="state" />
      <of-toggle-field
        name="customColors"
        label="Custom colors"
        :record="state"
      />
      <of-button rounded icon="refresh" @click="regenerateEvents"
        >Regenerate events</of-button
      >
    </p>
    <of-calendar
      :type="values.type"
      num-days="3"
      :events="events"
      :layout="values.layout"
      :categories="categories"
      :event-color="values.customColors ? eventColor : null"
    >
      <template #header v-if="values.useSlots">
        <h3>Additional controls can go here</h3>
      </template>
      <template #category-title="props" v-if="values.useSlots">
        <div v-if="props.isDate">
          <b>{{ props.date.getDate() }} </b>
        </div>
        <div v-if="!props.isDate">
          <of-icon name="user" /><i>{{ props.categoryName }} </i>
        </div>
      </template>
      <template
        #event-content="{ formattedRange, placement, brk }"
        v-if="values.useSlots"
      >
        <of-icon name="phone" />
        <b
          ><i>
            {{ placement.event.name }}
          </i></b
        >
        <br v-if="brk" />
        {{ formattedRange }}
      </template>
    </of-calendar>
  </div>
</template>


<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'
import {
  CalendarEvent,
  InternalEvent,
} from 'oceanfront/src/lib/calendar/common'
import { makeRecord } from 'oceanfront'
import { addDays, addMinutes } from 'oceanfront/src/lib/datetime'

const types = [
  { value: 'day', text: 'Day' },
  { value: 'week', text: 'Week' },
  { value: 'category', text: 'Category' },
  { value: 'ndays', text: 'N Days' },
]

function eventColor(e: InternalEvent) {
  const str = e.name ?? ''
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0)

  return 'hsl(' + (hash % 360) + ', 30%, 40%)'
}

const state = makeRecord({
  useSlots: false,
  type: 'day',
  layout: 'columns',
})

const categories = ['Conference room', 'HD Projector', 'Auditorium A']

const names = ['Meeting', 'Discussion', 'Lunch']

const colors = ['LightSalmon', 'DimGrey', 'SlateGrey', 'DarkSeaGreen']

function randomElement<T>(list: T[]): T {
  const idx = Math.floor(Math.random() * list.length)
  return list[idx]
}

let events: Ref<CalendarEvent[]> = ref([])

function expand(n: number, digits: number): string {
  let str = `${n}`
  for (; str.length < digits; str = `0${str}`) {}
  return str
}

function formatDate(d: Date) {
  return (
    expand(d.getUTCFullYear(), 4) +
    '-' +
    expand(d.getUTCMonth() + 1, 2) +
    '-' +
    expand(d.getUTCDate(), 2) +
    ' ' +
    expand(d.getUTCHours(), 2) +
    ':' +
    expand(d.getUTCMinutes(), 2) +
    ':' +
    expand(d.getUTCSeconds(), 2)
  )
}

function regenerateEvents() {
  let number = 1
  const now = new Date()
  const list: CalendarEvent[] = []
  for (let i = -6; i < 7; i++) {
    const nEvents = 2 + Math.random() * 3
    const theDate = addDays(now, i)
    theDate.setHours(0)
    theDate.setMinutes(0)
    for (let idx = 0; idx < nEvents; idx++) {
      const start = addMinutes(theDate, Math.floor(Math.random() * 420))
      const duration =
        30 +
        Math.floor(Math.random() * 360 + (Math.random() > 0.95 ? 4 * 360 : 0))
      const event: CalendarEvent = {
        name: randomElement(names) + ' ' + number++,
        start: formatDate(start),
        duration,
        color: randomElement(colors),
        allDay: Math.random() > 0.8,
        category: randomElement(categories),
      }
      list.push(event)
    }
  }
  events.value = list
}

regenerateEvents()

export default defineComponent({
  setup() {
    const _xx = state.value
    return {
      events: ref(events),
      eventColor,
      state,
      values: state.value,
      types,
      regenerateEvents,
      categories,
    }
  },
})
</script>
