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
import { InternalEvent, Timestamp } from 'oceanfront/src/lib/calendar/common'
import {
  getDayIdentifier,
  getTimeIdentifier,
  getTimestampIdintifier,
  toTimestamp,
} from 'oceanfront/src/lib/calendar'
import { makeRecord } from 'oceanfront'
import { addDays } from 'oceanfront/src/lib/datetime'

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

let events: Ref<InternalEvent[]> = ref([])

function regenerateEvents() {
  const now = new Date()
  const list: InternalEvent[] = []
  for (let i = -6; i < 7; i++) {
    const nEvents = 2 + Math.random() * 6
    for (let idx = 0; idx < nEvents; idx++) {
      const theDate = addDays(now, i)
      const nowTS = toTimestamp(theDate)
      const sh = Math.floor(Math.random() * 12)
      const sm = Math.floor(Math.random() * 4) * 15
      const eh = sh + 1 + Math.floor(Math.random() * 6)
      const em = Math.floor(Math.random() * 4) * 15
      const sts: Timestamp = {
        ...nowTS,
        hours: sh,
        minutes: sm,
      }
      const ets: Timestamp = {
        ...nowTS,
        hours: eh,
        minutes: em,
      }
      const event = {
        name: randomElement(names),
        startTS: sts,
        endTS: ets,
        startDay: getDayIdentifier(sts),
        startTime: getTimeIdentifier(sts),
        start: getTimestampIdintifier(sts),
        endDay: getDayIdentifier(ets),
        endTime: getTimeIdentifier(ets),
        end: getTimestampIdintifier(ets),
        category: randomElement(categories),
        color: randomElement(colors),
        allDay: Math.random() > 0.8,
        orig: false,
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
