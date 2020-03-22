<template>
  <div class="container">
    <h1>Text Inputs</h1>
    <of-highlight lang="html" :value="sampleCode" />
    <br />
    <div class="row">
      <div class="column md-4">
        <div class="form-outer">
          <div class="form-cell">
            <of-text-field
              :config="{ ...testField, variant: 'basic' }"
              v-model="textValue"
            />
          </div>
          <br />
          <div class="form-cell">
            <of-text-field
              :config="{ ...testField, variant: 'outlined' }"
              v-model="textValue"
            />
          </div>
          <br />
          <div class="form-cell">
            <of-text-field
              :config="{ ...testField, variant: 'filled' }"
              v-model="textValue"
            />
          </div>
          <!-- br />
          <button class="input-button" @click="change">Update</button -->
        </div>
      </div>
      <div class="column md-4">
        <div class="form-outer">
          <div class="form-cell">
            <of-textarea
              :config="{ ...testField, rows: 3, variant: 'basic' }"
            />
          </div>
          <br />
          <div class="form-cell">
            <of-textarea
              :config="{ ...testField, rows: 3, variant: 'outlined' }"
            />
          </div>
          <br />
          <div class="form-cell">
            <of-textarea
              :config="{ ...testField, rows: 3, variant: 'filled' }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row demo-row">
      <div class="demo-inline">
        <of-text-field
          class="input-sm"
          value="Small text input"
          style="width: 10em"
        />
      </div>
      <div class="demo-inline">
        <of-text-field value="Normal text input" style="width: 10em" />
      </div>
      <div class="demo-inline">
        <of-text-field
          class="input-lg"
          value="Large text input"
          style="width: 10em"
        />
      </div>
      <div class="demo-inline">
        <of-text-field
          readonly="1"
          value="Read-only text"
          style="width: 10em"
        />
      </div>
      <div class="demo-inline">
        <of-text-field disabled="1" value="Disabled text" style="width: 10em" />
      </div>
      <div class="demo-inline">
        <of-text-field placeholder="Placeholder" style="width: 10em" />
      </div>
      <div class="demo-inline">
        <of-text-field
          class="input-compact"
          style="width: 10em"
          value="Compact"
        />
      </div>
    </div>
    <div class="row demo-row">
      <div class="demo-inline">
        <of-textarea
          class="input-sm"
          style="width: 10em"
          value="Small text area"
        />
      </div>
      <div class="demo-inline">
        <of-textarea style="width: 10em" value="Normal text area" />
      </div>
      <div class="demo-inline">
        <of-textarea
          class="input-lg"
          style="width: 10em"
          value="Large text area"
        />
      </div>
      <div class="demo-inline">
        <of-textarea
          readonly="1"
          style="width: 10em"
          value="Read-only text area"
        />
      </div>
      <div class="demo-inline">
        <of-textarea
          disabled="1"
          style="width: 10em"
          value="Disabled text area"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, nextTick } from 'vue'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const testField = {
  description: 'Field description',
  help: 'field help',
  hidden: false,
  label: 'Field Label',
  placeholder: 'placeholder',
  readOnly: false,
  required: true,
  type: 'float'
}

export default defineComponent({
  /*async */ setup() {
    const textValue = ref('62.14')
    const change = () => {
      textValue.value = new Date().getTime().toString()
    }
    const sampleCode = `
<of-text-field
  label="Field Label"
  v-model="fieldValue"
  variant="filled"
/>`
    return {
      change,
      sampleCode,
      testField,
      textValue
    }
  }
})
</script>
