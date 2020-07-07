<template>
  <div class="container">
    <h1>Records</h1>
    <p>
      Instead of binding each field's value property directly, it can be more
      effective to bind a <var>record</var> and a field name. This may be be
      required for complex field types which bind to multiple fields on the
      associated record. It also allows for validation rules to be combined at
      the record level, instead of being assigned to individual fields or
      handled within a custom component.
    </p>
    <of-highlight lang="html" :value="sampleBinding" />

    <hr />

    <div class="row">
      <div class="column">
        <of-select-field
          label="One"
          :items="[
            { value: 'optionA', text: 'A' },
            { value: 'optionB', text: 'B' },
          ]"
          :record="testRecord"
          name="one"
        ></of-select-field>
        <br />
        <of-text-field label="Two" name="two" :record="testRecord" />
        <br />
        <of-toggle-field name="three" label="Three" :record="testRecord" />
      </div>
      <div class="column">
        <h4>Record state</h4>
        Updated: {{ testRecord.updated || false }} <br />
        <of-highlight lang="json" :value="formatValue" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue'
import { makeRecord } from 'oceanfront'

const testRecord = makeRecord({
  one: 'optionA',
  two: 'text',
  three: true,
})

export default defineComponent({
  setup() {
    const textValue = ref('62.14')
    const change = () => {
      textValue.value = new Date().getTime().toString()
    }
    const formatValue = computed(() => {
      return JSON.stringify(testRecord.value, null, 2)
    })
    const sampleBinding = `<of-field
  :record="testRecord"
  name="propA"
  type="text"
/>`
    return {
      change,
      formatValue,
      sampleBinding,
      testRecord,
      textValue,
    }
  },
})
</script>
