<template>
  <div class="container">
    <div style="position: relative; width: 400px; height: 960px">
      <div
        v-for="(p, index) in placements"
        :key="index"
        :style="{
          'background-color': '#CCC',
          height: '50px',
          border: 'solid 1px #000',
          'border-radius': '4px',
          position: 'absolute',
          left: p.left * 100 + '%',
          width: p.width * 100 + '%',
          top: (p.top / 960) * 100 + '%',
          height: (p.height / 960) * 100 + '%',
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  getGroups,
  getDayIdentifier,
  toTimestamp,
  getTimeIdentifier,
  getTimestampIdintifier,
} from '../lib/calendar'

import {
  CalendarEventPlacement,
  InternalEvent,
  Timestamp,
} from '../lib/calendar/common'

function mockData(): InternalEvent[] {
  const nowTS = toTimestamp(new Date())
  const times = [
    [1, 0, 5, 45],
    [1, 15, 5, 15],
    [1, 15, 3, 45],
    [4, 0, 4, 15],
    [2, 30, 6, 45],
    [1, 15, 3, 30],
    [7, 0, 7, 45],
    [4, 15, 7, 45],
    [9, 15, 10, 0],
  ]
  return times.map((t) => {
    const [sh, sm, eh, em] = t
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
    return {
      startDay: getDayIdentifier(sts),
      startTime: getTimeIdentifier(sts),
      start: getTimestampIdintifier(sts),
      endDay: getDayIdentifier(ets),
      endTime: getTimeIdentifier(ets),
      end: getTimestampIdintifier(ets),
    }
  })
}

export default defineComponent({
  name: 'OfCalendar',
  setup() {
    const events = mockData()
    const nowTS = toTimestamp(new Date())
    const groups = getGroups(events, getDayIdentifier(nowTS), false)
    const placements: CalendarEventPlacement[] = []
    for (const g of groups) {
      placements.push(...g.placements)
    }
    return { placements }
  },
})
</script>
