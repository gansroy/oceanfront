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

    <div class="row content">
      <div class="column">
        <div class="demo-form">
          <div class="row form-row">
            <of-select-field
              label="Select"
              :items="[
                { value: 'optionA', text: 'A' },
                { value: 'optionB', text: 'B' },
              ]"
              :record="testRecord"
              name="one"
            ></of-select-field>
          </div>
          <div class="row form-row">
            <of-text-field label="Text" name="two" :record="testRecord" />
          </div>
          <div class="row form-row">
            <of-toggle-field
              name="three"
              label="Toggle"
              label-position="field"
              :record="testRecord"
            />
          </div>
          <div class="row form-row">
            <of-slider-field
              name="four"
              label="Slider"
              label-position="field"
              :record="testRecord"
            />
          </div>
          <div class="row form-row">
            <button @click="testRecord.reset()" :disabled="testRecord.locked">
              Reset
            </button>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="record-info">
          <h4>Record state</h4>
          <div class="row">
            <div class="column sm-4">Locked:</div>
            <div class="column sm-8">
              <of-toggle
                v-model:checked="testRecord.locked"
                style="vertical-align: top"
                switch
              />
            </div>
          </div>
          <div class="row">
            <div class="column sm-4">Updated:</div>
            <div class="column sm-8">
              {{ testRecord.updated || false }}
            </div>
          </div>
          <of-highlight lang="json" :value="formatValue" />
        </div>
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
  four: 25,
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

<style scoped>
.content {
  margin-top: 1.5rem;
}
.record-info {
  padding-left: 1em;
}
</style>
