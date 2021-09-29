<template>
  <div class="container">
    <h1>Date &amp; Time Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />

    <of-demo-field>
      <template #default="props">
        <of-date-field label="Date only" v-model="dateValue" v-bind="props" />
      </template>
    </of-demo-field>

    <of-demo-field>
      <template #default="props">
        <of-datetime-field
          label="Date and Time"
          v-model="dateTimeValue"
          v-bind="props"
        />
      </template>
    </of-demo-field>

    <of-demo-field>
      <template #default="props">
        <of-time-field label="Time only" v-model="timeValue" v-bind="props" />
      </template>
    </of-demo-field>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

const dateTimeValue = ref('2021-03-05 12:00')
const dateValue = ref('2021-03-05')
const timeValue = ref('18:55')

export default defineComponent({
  setup() {
    const sampleCode = `
<of-datetime-field
  label="Date and time"
  v-model="inputValue"
/>
`
    return {
      sampleCode,
      dateValue,
      dateTimeValue,
      timeValue,
    }
  },
})
</script>
